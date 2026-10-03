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
 * committed. The resized files are made in .next/cache/images/ and copied to
 * public/_img/ at the end: `next build` leaves .next/cache alone, and Vercel
 * and amplify.yml both keep it between builds, while public/ starts empty on
 * every fresh checkout. A photo is only redone when its content, the widths or
 * the quality change — tracked by hash in the cache's manifest.json, not by
 * file times, which a fresh git checkout resets — so only the first build
 * pays for all 1,750 photos (several minutes on a 2-core build machine); later
 * ones take seconds.
 *
 * Sources narrower than a width are never enlarged; that width's file is the
 * photo at its own size, so every name the loader can produce exists.
 */
import { createHash } from "node:crypto";
import { access, cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { availableParallelism } from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "public", "jewelry");
const STORE = path.join(ROOT, ".next", "cache", "images");
const OUTPUT = path.join(STORE, "jewelry");
const MANIFEST = path.join(STORE, "manifest.json");
const PUBLISHED = path.join(ROOT, "public", "_img");
const WIDTHS = JSON.parse(await readFile(path.join(ROOT, "src", "data", "image-widths.json"), "utf8"));
const LARGEST = Math.max(...WIDTHS);
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
let done = 0;

const started = Date.now();
const elapsed = () => `${((Date.now() - started) / 1000).toFixed(1)}s`;

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
  // Decode once, at no more than the largest width, and make every size from
  // those pixels. (sharp's clone() would decode the full photo once per size.)
  const { data, info } = await sharp(bytes, { failOn: "none" })
    .resize({ width: LARGEST, withoutEnlargement: true })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const raw = { width: info.width, height: info.height, channels: info.channels };
  await Promise.all(
    targets.map((t) =>
      sharp(data, { raw })
        .resize({ width: t.w, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(t.file),
    ),
  );
  made += targets.length;
});

// A build log that stays silent for minutes looks like a hung build.
const step = Math.max(1, Math.ceil(sources.length / 10));
const lanes = Math.max(2, availableParallelism());
await Promise.all(
  Array.from({ length: lanes }, async () => {
    while (jobs.length) {
      await jobs.shift()();
      if (++done % step === 0 && made) console.log(`[images] ${done}/${sources.length} photos (${elapsed()})`);
    }
  }),
);

// Drop sizes of photos that no longer exist, so the deploy doesn't carry them.
let removed = 0;
for (const file of await walk(STORE)) {
  if (!wanted.has(file)) {
    await rm(file);
    removed++;
  }
}
await mkdir(OUTPUT, { recursive: true });
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 1)}\n`);

// Publish: public/_img is exactly the cache's sizes, with nothing left over.
await rm(PUBLISHED, { recursive: true, force: true });
await cp(OUTPUT, path.join(PUBLISHED, "jewelry"), { recursive: true });

console.log(
  `[images] ${sources.length} photos x ${WIDTHS.length} widths: ${made} written, ${removed} removed (${elapsed()})`,
);
