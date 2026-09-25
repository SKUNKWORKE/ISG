// Copies the flag-icons SVG set into public/flags so the badge can serve one
// flag as an ordinary static asset.
//
// The alternative is flag-icons' stylesheet, which is ~60 KB of class
// definitions covering 270 countries. Every visitor would download all of it to
// display exactly one flag. The SVGs are the same MIT-licensed artwork from the
// same package; taking them directly costs a visitor about 1 KB instead.
//
// public/flags is generated, not committed. `npm run build` runs this first via
// the prebuild script, so a clean checkout produces it automatically.

import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

// Resolved through the package rather than by guessing at node_modules layout,
// so this keeps working under pnpm and Yarn PnP.
const flagIconsRoot = path.dirname(require.resolve("flag-icons/package.json"));
const source = path.join(flagIconsRoot, "flags", "4x3");
const destination = path.join(process.cwd(), "public", "flags");

const licenceSource = path.join(flagIconsRoot, "LICENSE");
const licenceDestination = path.join(destination, "LICENSE.txt");

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

// The MIT licence requires the notice to travel with the artwork, and these
// files are served publicly, so it is copied alongside them.
await cp(licenceSource, licenceDestination);

const files = await readdir(destination);
const codes = files
  .filter((name) => name.endsWith(".svg"))
  .map((name) => name.replace(/\.svg$/, ""))
  .sort();

// The badge checks this list before rendering an <img>, so a country with no
// artwork degrades to a name-only badge instead of a broken image.
await writeFile(
  path.join(process.cwd(), "src", "lib", "geo", "flag-codes.json"),
  `${JSON.stringify(codes, null, 2)}\n`,
  "utf8",
);

console.log(`[flags] copied ${codes.length} flags to public/flags`);
