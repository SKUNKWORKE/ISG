#!/usr/bin/env node
/**
 * Turns a `next build` into an AWS Amplify Hosting deployment bundle, using
 * Amplify's deployment specification (the same format its framework adapters
 * write):
 *
 *   .amplify-hosting/
 *     deploy-manifest.json     routing: which paths are files, which go to the server
 *     compute/default/         the standalone Next.js server (.next/standalone)
 *     static/                  public/ and .next/static, served by Amplify's CDN
 *
 * Why not Amplify's built-in Next.js support: it covers Next.js up to 15, and
 * this site is on 16. The deployment specification is framework-neutral — a
 * Node server listening on port 3000 plus a folder of files — so it runs any
 * Next.js version the standalone output supports.
 *
 * Amplify refuses a compute bundle over 220 MB and a server response over
 * 5.72 MB. Both are checked here, so an oversized build fails with a reason
 * instead of at deploy time.
 *
 *   npm run build:amplify      # next build, then this
 */
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const STANDALONE = path.join(ROOT, ".next", "standalone");
const OUT = path.join(ROOT, ".amplify-hosting");
const COMPUTE = path.join(OUT, "compute", "default");
const STATIC = path.join(OUT, "static");

const MAX_COMPUTE_BYTES = 220 * 1024 * 1024;
const MAX_RESPONSE_BYTES = 5.72 * 1024 * 1024;
/** Amplify's runtimes are Lambda's; Next.js 16 needs Node 20.9 or later. */
const RUNTIME = "nodejs22.x";
const ENTRYPOINT = "amplify-server.js";

const IMMUTABLE = "public, max-age=31536000, immutable";

async function size(target) {
  const info = await stat(target);
  if (!info.isDirectory()) return info.size;
  const entries = await readdir(target);
  let total = 0;
  for (const entry of entries) total += await size(path.join(target, entry));
  return total;
}

async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return nested.flat();
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

function fail(message) {
  console.error(`\n[amplify] ${message}\n`);
  process.exit(1);
}

await stat(path.join(STANDALONE, "server.js")).catch(() =>
  fail('No .next/standalone/server.js. Run `next build` first, with output: "standalone" in next.config.ts.'),
);

await rm(OUT, { recursive: true, force: true });
await mkdir(COMPUTE, { recursive: true });
await mkdir(STATIC, { recursive: true });

/* ---------------------------------------------------------------- compute */

await cp(STANDALONE, COMPUTE, { recursive: true, verbatimSymlinks: true });
// Files are served from static/ by the CDN; a copy left in the server bundle
// (standalone's server.js serves them if present) would only cost size.
await rm(path.join(COMPUTE, "public"), { recursive: true, force: true });
await rm(path.join(COMPUTE, ".next", "static"), { recursive: true, force: true });
// Image optimisation is done before the build (scripts/build-images.mjs), so
// sharp's native libraries are dead weight here even if the tracer kept them.
for (const dir of ["sharp", "@img"]) {
  await rm(path.join(COMPUTE, "node_modules", dir), { recursive: true, force: true });
}

// Amplify sends traffic to port 3000 on the compute resource. HOSTNAME is
// pinned too: some runtimes set it to the machine's name, and the standalone
// server would then listen on that interface alone.
await writeFile(
  path.join(COMPUTE, ENTRYPOINT),
  `// Written by scripts/package-amplify.mjs.
process.env.PORT = "3000";
process.env.HOSTNAME = "0.0.0.0";
require("./server.js");
`,
);

/* ----------------------------------------------------------------- static */

await cp(path.join(ROOT, "public"), STATIC, {
  recursive: true,
  // The resize script's bookkeeping, not something to serve.
  filter: (src) => path.relative(path.join(ROOT, "public"), src) !== path.join("_img", "manifest.json"),
});
await cp(path.join(ROOT, ".next", "static"), path.join(STATIC, "_next", "static"), { recursive: true });

/* --------------------------------------------------------------- manifest */

const nextVersion = JSON.parse(await readFile(path.join(ROOT, "node_modules", "next", "package.json"), "utf8")).version;
const compute = { kind: "Compute", src: "default" };

const manifest = {
  version: 1,
  framework: { name: "next", version: nextVersion },
  // First match wins; Amplify allows at most 25 rules.
  routes: [
    // Build output with content hashes in the names, and frame sequences that
    // never change in place (see next.config.ts): cache for good.
    { path: "/_next/static/*", target: { kind: "Static", cacheControl: IMMUTABLE } },
    { path: "/sequence/*", target: { kind: "Static", cacheControl: IMMUTABLE } },
    // Anything that looks like a file is tried as a file first. robots.txt,
    // the sitemaps, the favicon and the RSS feed are generated by the server,
    // so a miss falls through to it.
    { path: "/*.*", target: { kind: "Static" }, fallback: compute },
    // Pages, the API and everything else.
    { path: "/*", target: compute },
  ],
  computeResources: [{ name: "default", runtime: RUNTIME, entrypoint: ENTRYPOINT }],
};
await writeFile(path.join(OUT, "deploy-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

/* ----------------------------------------------------------------- checks */

const computeBytes = await size(COMPUTE);
const staticBytes = await size(STATIC);

// Prerendered responses are served by the server, so each counts against the
// response cap.
const served = (await files(path.join(COMPUTE, ".next", "server", "app"))).filter((f) =>
  /\.(html|rsc|body)$/.test(f),
);
const oversized = [];
for (const file of served) {
  const bytes = (await stat(file)).size;
  if (bytes > MAX_RESPONSE_BYTES) oversized.push(`${path.relative(COMPUTE, file)} (${mb(bytes)})`);
}

console.log(`[amplify] compute/default ${mb(computeBytes)} of ${mb(MAX_COMPUTE_BYTES)}`);
console.log(`[amplify] static          ${mb(staticBytes)}`);
console.log(`[amplify] wrote .amplify-hosting/deploy-manifest.json (Next.js ${nextVersion}, ${RUNTIME})`);
// Amplify sets AWS_APP_ID in its builds. The branch setting this depends on
// can't be read from here, so say it where the failure would show up.
if (process.env.AWS_APP_ID) {
  console.log(
    `[amplify] Deploys .amplify-hosting only if branch "${process.env.AWS_BRANCH ?? "?"}" has a framework other than ` +
      `"Next.js - SSR". If the deploy fails with "Can't find required-server-files.json", run in AWS CloudShell:\n` +
      `[amplify]   aws amplify update-branch --app-id ${process.env.AWS_APP_ID} --branch-name ${process.env.AWS_BRANCH ?? "main"} --framework Web`,
  );
}

if (computeBytes > MAX_COMPUTE_BYTES) {
  fail(
    `The server bundle is ${mb(computeBytes)}; Amplify's limit is ${mb(MAX_COMPUTE_BYTES)}. ` +
      "Look in .amplify-hosting/compute/default for what grew.",
  );
}
if (oversized.length) {
  fail(`These prerendered responses exceed Amplify's ${mb(MAX_RESPONSE_BYTES)} response limit:\n  ${oversized.join("\n  ")}`);
}
