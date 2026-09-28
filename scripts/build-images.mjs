#!/usr/bin/env node
/**
 * Resizes every photo under public/jewelry to the widths in
 * src/data/image-widths.json, writing WebP files to public/_img/jewelry/ for
 * src/lib/image-loader.ts to hand to next/image:
 *
 *   public/jewelry/IMPSG-17053/01.webp -> public/_img/jewelry/IMPSG-17053/01-256.webp
 *                                          ... and so on to 01-1600.webp
 *
 * Runs before every build (the prebuild script). Output is generated, not
 * committed. A photo is only redone when its content, the widths or the
 * quality change — tracked by hash in public/_img/manifest.json, not by file
 * times, which a fresh git checkout resets — so a build that restores the
 * folder from cache (amplify.yml does) takes seconds instead of minutes.
 *
 * Sources narrower than a width are never enlarged; that width's file is the
 * photo at its own size, so every name the loader can produce exists.
 */
import { createHash } from "node:crypto";
import { access, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { cpus } from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "public", "jewelry");
const OUTPUT_ROOT = path.join(ROOT, "public", "_img");
const OUTPUT = path.join(OUTPUT_ROOT, "jewelry");
const MANIFEST = path.join(OUTPUT_ROOT, "manifest.json");
const WIDTHS = JSON.parse(await readFile(path.join(ROOT, "src", "data", "image-widths.json"), "utf8"));
const QUALITY = 75; // next/image's own default
const IMAGE = /\.(webp|jpe?g|png|avif)$/i;
const SETTINGS = `${WIDTHS.join(",")}@q${QUALITY}`;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return files.flat();
}

const exists = (file) => access(file).then(() => true, () => false);

const previous = JSON.parse(await readFile(MANIFEST, "utf8").catch(() => "{}"));
const manifest = {};
const wanted = new Set([MANIFEST]);
const sources = (await walk(SOURCE)).filter((f) => IMAGE.test(f)).sort();
let made = 0;

const jobs = sources.map((source) => async () => {
  const rel = path.relative(SOURCE, source).split(path.sep).join("/");
  const base = path.join(OUTPUT, rel).replace(IMAGE, "");
  const targets = WIDTHS.map((w) => ({ w, file: `${base}-${w}.webp` }));
  targets.forEach((t) => wanted.add(t.file));

  const bytes = await readFile(source);
  const key = `${createHash("sha1").update(bytes).digest("hex")}:${SETTINGS}`;
  manifest[rel] = key;
  if (previous[rel] === key && (await Promise.all(targets.map((t) => exists(t.file)))).every(Boolean)) return;

  await mkdir(path.dirname(base), { recursive: true });
  // Decode once, resize to each width from the same pixels.
  const input = sharp(bytes, { failOn: "none" });
  await Promise.all(
    targets.map((t) =>
      input
        .clone()
        .resize({ width: t.w, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(t.file),
    ),
  );
  made += targets.length;
});

const started = Date.now();
const lanes = Math.max(2, cpus().length);
await Promise.all(
  Array.from({ length: lanes }, async () => {
    while (jobs.length) await jobs.shift()();
  }),
);

// Drop sizes of photos that no longer exist, so the deploy doesn't carry them.
let removed = 0;
for (const file of await walk(OUTPUT_ROOT)) {
  if (!wanted.has(file)) {
    await rm(file);
    removed++;
  }
}
await mkdir(OUTPUT_ROOT, { recursive: true });
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 1)}\n`);

const seconds = ((Date.now() - started) / 1000).toFixed(1);
console.log(
  `[images] ${sources.length} photos x ${WIDTHS.length} widths: ${made} written, ${removed} removed (${seconds}s)`,
);
