#!/usr/bin/env node
/**
 * Packs the frame sequences into a handful of files per tier.
 *
 * The hero and the rotation loop draw hundreds of separate frames. Fetched one
 * by one, a single visit to the home page made over 500 requests for them,
 * and every one counts against the host's request allowance. This writes the
 * same frames, byte for byte, into packs of FRAMES_PER_PACK, so the home page
 * makes about two dozen requests instead. src/lib/frame-packs.ts reads them;
 * the individual frames stay where they are, as the fallback.
 *
 *   public/sequence/packs/<tier>-<hash>/000.bin, 001.bin, ...
 *   src/data/sequence-packs.json    which packs exist, read by the client
 *
 * The hash covers every frame's bytes and the pack layout, so a new render or
 * a new layout gets new URLs and the one-year immutable cache on /sequence/
 * can never serve a stale pack.
 *
 * Pack layout, all integers little-endian uint32:
 *
 *   "ISGF" | version (1) | frame count n | n frame byte lengths | frames...
 *
 * Runs before every build and dev server (prebuild, predev); the packs are
 * generated, not committed, and take well under a second. The manifest is
 * committed and only changes when the frames do.
 *
 *   node scripts/pack-sequence.mjs
 */

import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SEQUENCE = path.join(ROOT, "public", "sequence");
const OUTPUT = path.join(SEQUENCE, "packs");
const MANIFEST = path.join(ROOT, "src", "data", "sequence-packs.json");
const TIERS_FILE = path.join(ROOT, "src", "data", "sequence-manifest.json");

/** About a second of the hero per pack: small enough that playback starts promptly. */
const FRAMES_PER_PACK = 24;
const FORMAT = 1;
const MAGIC = Buffer.from("ISGF", "ascii");

const { tiers } = JSON.parse(await readFile(TIERS_FILE, "utf8"));
const frameName = (index) => `${String(index + 1).padStart(5, "0")}.webp`;

const manifest = { format: FORMAT, framesPerPack: FRAMES_PER_PACK, tiers: {} };
const keep = new Set();
let written = 0;

for (const [tier, { frames }] of Object.entries(tiers)) {
  const dir = path.join(SEQUENCE, tier);
  const bytes = [];
  for (let i = 0; i < frames; i++) {
    const file = path.join(dir, frameName(i));
    const data = await readFile(file).catch(() => null);
    if (!data?.length) {
      // A missing frame means the manifest and the folder disagree; packing
      // around it would shift every later frame by one. Leave the tier out and
      // let the client load its frames individually, as it always could.
      console.warn(`[packs] ${tier}: ${path.relative(ROOT, file)} missing or empty — tier left unpacked`);
      bytes.length = 0;
      break;
    }
    bytes.push(data);
  }
  if (bytes.length !== frames) continue;

  const hash = createHash("sha1")
    .update(`${FORMAT}:${FRAMES_PER_PACK}:`)
    .update(Buffer.concat(bytes))
    .digest("hex")
    .slice(0, 10);
  const folder = `${tier}-${hash}`;
  const target = path.join(OUTPUT, folder);
  keep.add(folder);
  await mkdir(target, { recursive: true });

  const packs = Math.ceil(frames / FRAMES_PER_PACK);
  for (let p = 0; p < packs; p++) {
    const group = bytes.slice(p * FRAMES_PER_PACK, (p + 1) * FRAMES_PER_PACK);
    const header = Buffer.alloc(12 + group.length * 4);
    MAGIC.copy(header, 0);
    header.writeUInt32LE(FORMAT, 4);
    header.writeUInt32LE(group.length, 8);
    group.forEach((frame, i) => header.writeUInt32LE(frame.length, 12 + i * 4));
    await writeFile(path.join(target, `${String(p).padStart(3, "0")}.bin`), Buffer.concat([header, ...group]));
    written++;
  }
  manifest.tiers[tier] = { hash, packs };
}

// Packs from earlier frames or layouts are dropped; their hashes no longer match.
for (const entry of await readdir(OUTPUT).catch(() => [])) {
  if (!keep.has(entry)) await rm(path.join(OUTPUT, entry), { recursive: true, force: true });
}

const json = `${JSON.stringify(manifest, null, 2)}\n`;
if ((await readFile(MANIFEST, "utf8").catch(() => "")) !== json) await writeFile(MANIFEST, json);

const summary = Object.entries(manifest.tiers)
  .map(([tier, { packs }]) => `${tier} ${packs}`)
  .join(", ");
console.log(`[packs] ${written} packs of up to ${FRAMES_PER_PACK} frames (${summary})`);
