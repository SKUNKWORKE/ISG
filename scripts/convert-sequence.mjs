/**
 * Frame-sequence build step.
 *
 * Builds the two independent sequences the site ships:
 *
 *   public/sequence/scroll/         every 2nd source frame     1440px  the hero cutting sequence
 *   public/sequence/scroll-mobile/  the same frames             720px  hero on narrow screens
 *   public/sequence/rotate/         every 2nd turntable frame  1440px  looping 360° turn
 *   public/sequence/rotate-mobile/  the same frames             720px  the turn on narrow screens
 *
 * Every frame is cropped to the stone (the renders leave most of the frame
 * empty) and its fine lines are darkened, so the drawing reads at hero size.
 * The hero cross-fades between frames, so every 2nd frame plays as smoothly as
 * all of them at half the download. The last source frame is always kept: it
 * is the same view as the turntable's first, which makes the handover seamless.
 *
 * Inputs:
 *
 *   assets/sequence/raw-700/  the rough -> polished render, 700 PNGs
 *                             (_00000.png – _00699.png, or 00000.png – 00699.png)
 *   assets/sequence/raw-360/  OPTIONAL. The dedicated 360° turntable render,
 *                             expected to be 333 PNGs. When present it is used
 *                             frame for frame.
 *
 * If raw-360 is absent, rotate/ is filled with a stand-in: the finished stone's
 * turn from the end of the 700-frame render, played forward and then back so the
 * loop has no jump. The manifest records which one shipped.
 *
 * Output is numbered from 00001 in every folder, regardless of how the source
 * was numbered. Frames that are empty or fail to decode are dropped before
 * numbering, so there are never gaps; the script reports anything it dropped.
 *
 *   node scripts/convert-sequence.mjs
 */

import { createRequire } from "node:module";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/** The wireframe renders ship. SEQUENCE_SOURCE=raw-700 builds from the photographic one instead. */
const RAW_SCROLL = path.join(ROOT, "assets", "sequence", process.env.SEQUENCE_SOURCE || "wire-700");
/** The wireframe turntable. ROTATE_SOURCE=raw-360 would use a photographic one. */
const RAW_ROTATE = path.join(ROOT, "assets", "sequence", process.env.ROTATE_SOURCE || "wire-360");
const OUT_DIR = path.join(ROOT, "public", "sequence");
const MANIFEST = path.join(ROOT, "src", "data", "sequence-manifest.json");

/** Frames render on white; flattening onto the porcelain ground keeps the
 *  canvas seamless and drops the weight of an alpha channel. */
const BG = { r: 0xfa, g: 0xfa, b: 0xfa };

/**
 * The square around the stone, in pixels of a 2160px render, scaled for other
 * sizes. Checked by eye against a contact sheet of the whole sequence: the
 * stone stays inside it throughout, and only the first cut's scattering
 * offcuts and the laser lines run past its edges. The turntable uses the same
 * camera, so one crop keeps the handover exact.
 */
const CROP_2160 = { left: 420, top: 440, size: 1440 };

/**
 * Darkens the renders' pale hairlines. A linear stretch pinned at the
 * background value, so the ground stays exactly porcelain (y = a·x + b with
 * a·250 + b = 250) while greys below it move towards ink.
 */
const CONTRAST = 1.5;

/** Keep every Nth source frame. */
const FRAME_STEP = 2;

const EXPECTED_SCROLL = 700;
const EXPECTED_ROTATE = 333;

/**
 * Stand-in rotation range, as 0-based source indices into raw-700. Checked by
 * eye: the polishing dust has cleared by _00630.png, and from there to the last
 * frame the finished stone turns from a three-quarter view to face up.
 */
const STANDIN_FROM = 630;

/** Folders from earlier builds that are no longer served. */
const RETIRED = ["desktop", "mobile", "spin", "poster.webp"];

const CONCURRENCY = Math.max(4, Math.min(12, os.cpus().length));

const pad = (n) => String(n).padStart(5, "0");

async function pool(items, worker, label) {
  let cursor = 0;
  let done = 0;
  const runners = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      await worker(items[i], i);
      done++;
      if (label && (done % 100 === 0 || done === items.length)) {
        process.stdout.write(`\r    ${label} ${done}/${items.length}`);
      }
    }
  });
  await Promise.all(runners);
  if (label) process.stdout.write("\n");
}

/** Sorted, non-empty, fully decodable PNGs in `dir`, or null if the folder is missing. */
async function usableFrames(dir) {
  let entries;
  try {
    entries = await fsp.readdir(dir);
  } catch {
    return null;
  }

  const candidates = entries
    .filter((f) => /\d{5}\.png$/i.test(f))
    .sort((a, b) => Number(a.match(/(\d{5})\.png$/i)[1]) - Number(b.match(/(\d{5})\.png$/i)[1]))
    .map((f) => path.join(dir, f));

  const ok = new Array(candidates.length).fill(false);
  const dropped = [];
  await pool(candidates, async (file, i) => {
    if ((await fsp.stat(file)).size === 0) {
      dropped.push(`${path.basename(file)} (empty)`);
      return;
    }
    try {
      // A full decode — a header read will not catch a truncated PNG.
      await sharp(file).resize({ width: 32 }).raw().toBuffer();
      ok[i] = true;
    } catch {
      dropped.push(`${path.basename(file)} (undecodable)`);
    }
  });

  if (dropped.length) console.log(`    dropped ${dropped.length}: ${dropped.sort().join(", ")}`);
  return candidates.filter((_, i) => ok[i]);
}

/** Every FRAME_STEP-th frame, always including the last. */
function thin(frames) {
  const kept = frames.filter((_, i) => i % FRAME_STEP === 0);
  if (kept[kept.length - 1] !== frames[frames.length - 1]) kept.push(frames[frames.length - 1]);
  return kept;
}

const cropCache = new Map();
async function cropFor(src) {
  const { width, height } = await sharp(src).metadata();
  const key = `${width}x${height}`;
  if (!cropCache.has(key)) {
    const k = Math.min(width, height) / 2160;
    const size = Math.round(CROP_2160.size * k);
    cropCache.set(key, {
      left: Math.min(width - size, Math.round(CROP_2160.left * k)),
      top: Math.min(height - size, Math.round(CROP_2160.top * k)),
      width: size,
      height: size,
    });
  }
  return cropCache.get(key);
}

/** Encodes `sources` in order into `tier`/00001.webp, 00002.webp, … */
async function writeTier(tier, sources, width, quality) {
  const outDir = path.join(OUT_DIR, tier);
  await fsp.rm(outDir, { recursive: true, force: true });
  await fsp.mkdir(outDir, { recursive: true });

  const jobs = sources.map((src, i) => ({ src, dest: path.join(outDir, `${pad(i + 1)}.webp`) }));
  await pool(
    jobs,
    async ({ src, dest }) => {
      // Flatten and crop first, as their own step: sharp applies `linear`
      // before `extract` within a single pipeline.
      const cropped = await sharp(src)
        .flatten({ background: BG })
        .extract(await cropFor(src))
        .toBuffer();
      await sharp(cropped)
        .linear(CONTRAST, BG.r * (1 - CONTRAST))
        .resize({ width, withoutEnlargement: true })
        .sharpen({ sigma: 0.6 })
        .webp({ quality, effort: 5 })
        .toFile(dest);
    },
    tier,
  );

  let bytes = 0;
  for (const { dest } of jobs) bytes += (await fsp.stat(dest)).size;
  console.log(
    `    ${tier}: ${jobs.length} frames, ${pad(1)}.webp – ${pad(jobs.length)}.webp, ` +
      `${(bytes / 1024 / 1024).toFixed(1)} MB`,
  );
  return { frames: jobs.length, width };
}

async function main() {
  console.log(`\n  scroll source: ${path.relative(ROOT, RAW_SCROLL)}`);
  const scroll = await usableFrames(RAW_SCROLL);
  if (!scroll?.length) {
    console.error(`  No frames in ${RAW_SCROLL}. Download the 700-frame render there first.\n`);
    process.exit(1);
  }
  console.log(`    ${scroll.length} usable frames`);
  if (scroll.length !== EXPECTED_SCROLL) {
    console.warn(`    WARNING: expected ${EXPECTED_SCROLL}, found ${scroll.length}`);
  }

  console.log(`\n  rotate source: ${path.relative(ROOT, RAW_ROTATE)}`);
  let rotate = await usableFrames(RAW_ROTATE);
  let rotateSource;
  if (rotate?.length) {
    rotateSource = path.basename(RAW_ROTATE);
    console.log(`    ${rotate.length} usable frames`);
    if (rotate.length !== EXPECTED_ROTATE) {
      console.warn(`    WARNING: expected ${EXPECTED_ROTATE}, found ${rotate.length}`);
    }
  } else {
    // Forward through the finished stone's turn, then back, skipping both end
    // frames on the return so no frame shows twice at the loop point.
    const forward = scroll.slice(STANDIN_FROM);
    const back = forward.slice(1, -1).reverse();
    rotate = [...forward, ...back];
    rotateSource = `stand-in: ${path.basename(RAW_SCROLL)} frames ${STANDIN_FROM}-${scroll.length - 1}, forward then back`;
    console.log(`    not found — using ${rotateSource} (${rotate.length} frames)`);
  }

  await fsp.mkdir(OUT_DIR, { recursive: true });
  for (const name of RETIRED) {
    await fsp.rm(path.join(OUT_DIR, name), { recursive: true, force: true });
  }

  console.log("\n  encoding");
  const intro = thin(scroll);
  const loop = rotate.filter((_, i) => i % FRAME_STEP === 0);
  const tiers = {
    // 1440: the crop's native size, and above the hero canvas's ~1440 device pixels.
    scroll: { ...(await writeTier("scroll", intro, 1440, 76)), step: FRAME_STEP },
    // 720: a phone's hero canvas is ~350 CSS pixels at a capped 2x ratio.
    "scroll-mobile": { ...(await writeTier("scroll-mobile", intro, 720, 70)), step: FRAME_STEP },
    // A loop needs no forced last frame: the turn wraps back to its first.
    rotate: {
      ...(await writeTier("rotate", loop, 1440, 76)),
      step: FRAME_STEP,
      source: rotateSource,
    },
    "rotate-mobile": { ...(await writeTier("rotate-mobile", loop, 720, 70)), step: FRAME_STEP },
  };

  const manifest = { generatedAt: new Date().toISOString(), crop: CROP_2160, contrast: CONTRAST, tiers };
  await fsp.mkdir(path.dirname(MANIFEST), { recursive: true });
  await fsp.writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\n  manifest: ${path.relative(ROOT, MANIFEST)}\n`);
}

await main();
