#!/usr/bin/env node
/**
 * Renders the Imperial Star Gems logo set into assets/brand/ and installs the
 * favicon into src/app/.
 *
 *   node scripts/render-brand.mjs
 *
 * The mark is a brilliant cut seen face-up — octagonal table, star facets —
 * with the star facets drawn out into an eight-point star. Everything is
 * constructed geometrically here, including the monoline wordmark, so the
 * output never depends on installed fonts.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets/brand");

const f = (n) => Number(n.toFixed(2));
const polar = (r, deg, cx = 500, cy = 500) => {
  const a = ((deg - 90) * Math.PI) / 180; // 0° points up
  return [f(cx + r * Math.cos(a)), f(cy + r * Math.sin(a))];
};
const pt = ([x, y]) => `${x} ${y}`;
const line = (a, b) => `M${pt(a)}L${pt(b)}`;
const loop = (pts) => `M${pts.map(pt).join("L")}Z`;

/* ------------------------------------------------------------------- mark */

/** Geometry in a 1000×1000 box, centred on 500,500. */
function markGeometry() {
  const R_LONG = 470; // N, E, S, W points
  const R_SHORT = 318; // diagonal points
  const R_VALLEY = 168; // between points
  const R_TABLE = 118; // table octagon

  const P = Array.from({ length: 8 }, (_, k) => polar(k % 2 ? R_SHORT : R_LONG, k * 45));
  const V = Array.from({ length: 8 }, (_, k) => polar(R_VALLEY, 22.5 + k * 45));
  const T = Array.from({ length: 8 }, (_, k) => polar(R_TABLE, 22.5 + k * 45));
  const M = Array.from({ length: 8 }, (_, k) => polar(R_TABLE * Math.cos(Math.PI / 8), k * 45));

  const outline = loop(P.flatMap((p, k) => [p, V[k]]));
  const table = loop(T);
  // Each point is a faceted pyramid: two star facets meeting on a ridge.
  const facets = P.flatMap((p, k) => [line(p, T[(k + 7) % 8]), line(p, T[k]), line(p, M[k])]);
  const bezels = T.map((t, k) => line(t, V[k]));
  // Crown ring through the valleys, and an {8/3} star inside the table.
  const crown = loop(V);
  const tableStar = loop(Array.from({ length: 8 }, (_, k) => T[(k * 3) % 8]));

  return { P, V, outline, table, facets, bezels, crown, tableStar };
}

function markDefs(id) {
  return `
    <linearGradient id="${id}-line" gradientUnits="userSpaceOnUse" x1="120" y1="40" x2="880" y2="960">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.45" stop-color="#d6f0ff"/>
      <stop offset="1" stop-color="#8ec5ff"/>
    </linearGradient>
    <radialGradient id="${id}-core" gradientUnits="userSpaceOnUse" cx="500" cy="500" r="200">
      <stop offset="0" stop-color="#e9f7ff" stop-opacity="0.55"/>
      <stop offset="0.5" stop-color="#9fd3ff" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#9fd3ff" stop-opacity="0"/>
    </radialGradient>
    <filter id="${id}-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <filter id="${id}-bloom" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="22"/>
    </filter>
    <radialGradient id="${id}-flare" gradientUnits="objectBoundingBox" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="0.25" stop-color="#e3f4ff" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#8ec5ff" stop-opacity="0"/>
    </radialGradient>`;
}

/** The full-detail luminous mark, as a <g> in 1000×1000 space. */
function markGroup(id) {
  const g = markGeometry();
  const S = `url(#${id}-line)`;
  const wire = (w) => `
      <path d="${g.outline}" stroke-width="${w * 1.25}"/>
      ${g.facets.map((d) => `<path d="${d}" stroke-width="${w}"/>`).join("")}
      <path d="${g.table}" stroke-width="${w * 1.1}"/>
      ${g.bezels.map((d) => `<path d="${d}" stroke-width="${w * 0.8}"/>`).join("")}`;

  const nodes = [...g.P, ...g.V]
    .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i < 8 ? (i % 2 ? 5 : 6.5) : 4}"/>`)
    .join("");

  // A four-ray glint on the top point: the "star" catching light.
  const [tx, ty] = g.P[0];
  const flare = `
      <ellipse cx="${tx}" cy="${ty}" rx="70" ry="3.2" fill="url(#${id}-flare)"/>
      <ellipse cx="${tx}" cy="${ty}" rx="3.2" ry="56" fill="url(#${id}-flare)"/>
      <circle cx="${tx}" cy="${ty}" r="16" fill="url(#${id}-flare)"/>`;

  return `
    <g fill="none" stroke-linejoin="miter" stroke-linecap="round">
      <circle cx="500" cy="500" r="200" fill="url(#${id}-core)" stroke="none"/>
      <g stroke="#7fc0ff" opacity="0.5" filter="url(#${id}-bloom)">${wire(9)}</g>
      <g stroke="#bfe4ff" opacity="0.85" filter="url(#${id}-glow)">${wire(5)}</g>
      <circle cx="500" cy="500" r="392" stroke="${S}" stroke-width="1.6" opacity="0.35"/>
      <circle cx="500" cy="500" r="404" stroke="${S}" stroke-width="0.9" opacity="0.2" stroke-dasharray="2 10"/>
      <path d="${g.crown}" stroke="${S}" stroke-width="1.4" opacity="0.55"/>
      <path d="${g.tableStar}" stroke="${S}" stroke-width="1.2" opacity="0.5"/>
      <g stroke="${S}">${wire(3)}</g>
      <g fill="#ffffff" stroke="none">${nodes}</g>
      ${flare}
    </g>`;
}

/* --------------------------------------------------------------- wordmark */

/** Monoline capitals on a 100-unit cap height. [path, advance width]. */
const LETTERS = {
  I: ["M0 0V100", 0],
  M: ["M0 100V0L40 72L80 0V100", 80],
  P: ["M0 100V0H36A25 25 0 0 1 36 50H0", 61],
  E: ["M60 0H0V100H60M0 50H48", 60],
  R: ["M0 100V0H36A25 25 0 0 1 36 50H0M32 50L62 100", 62],
  A: ["M0 100L38 0L76 100M13.7 64H62.3", 76],
  L: ["M0 0V100H54", 54],
  S: [
    "M60 11C53 4 44 0 32 0C15 0 3 9 3 24C3 39 15 45 32 49C49 53 62 59 62 75C62 91 50 100 32 100C18 100 8 96 0 88",
    62,
  ],
  T: ["M0 0H70M35 0V100", 70],
  G: ["M69 17C62 6 51 0 38 0C17 0 0 21 0 50C0 79 17 100 38 100C60 100 76 85 76 62V55H44", 76],
};

function wordmark(text, { tracking = 34, space = 70 } = {}) {
  let x = 0;
  const parts = [];
  for (const ch of text) {
    if (ch === " ") {
      x += space;
      continue;
    }
    const [d, w] = LETTERS[ch];
    parts.push(`<path d="${d}" transform="translate(${f(x)} 0)"/>`);
    x += w + tracking;
  }
  return { body: parts.join(""), width: x - tracking };
}

function wordmarkGroup(id, text, strokeWidth) {
  const { body } = wordmark(text);
  return `
    <g fill="none" stroke-linecap="square" stroke-linejoin="miter">
      <g stroke="#bfe4ff" opacity="0.55" filter="url(#${id}-textglow)" stroke-width="${strokeWidth * 1.8}">${body}</g>
      <g stroke="url(#${id}-text)" stroke-width="${strokeWidth}">${body}</g>
    </g>`;
}

function wordmarkDefs(id, width) {
  return `
    <linearGradient id="${id}-text" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${width}" y2="100">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.6" stop-color="#e2f3ff"/>
      <stop offset="1" stop-color="#a9d5ff"/>
    </linearGradient>
    <filter id="${id}-textglow" x="-5%" y="-40%" width="110%" height="180%">
      <feGaussianBlur stdDeviation="4"/>
    </filter>`;
}

/* ---------------------------------------------------------------- layouts */

const DARK_BG = (w, h) => `
  <defs>
    <radialGradient id="bg" gradientUnits="userSpaceOnUse" cx="${w / 2}" cy="${h * 0.42}" r="${Math.max(w, h) * 0.7}">
      <stop offset="0" stop-color="#141a24"/>
      <stop offset="0.55" stop-color="#0a0d13"/>
      <stop offset="1" stop-color="#050608"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>`;

function svg(w, h, inner, dark) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${
    dark ? DARK_BG(w, h) : ""
  }${inner}</svg>`;
}

function markSvg(dark) {
  return svg(1000, 1000, `<defs>${markDefs("m")}</defs>${markGroup("m")}`, dark);
}

/** Mark above a two-line wordmark. */
function stackedSvg(dark) {
  const W = 1600;
  const H = 1600;
  const top = wordmark("IMPERIAL");
  const bottom = wordmark("STAR GEMS");
  const scale = 1.05;
  const line1X = (W - top.width * scale) / 2;
  const line2X = (W - bottom.width * scale) / 2;
  const inner = `
    <defs>${markDefs("m")}${wordmarkDefs("t", Math.max(top.width, bottom.width))}</defs>
    <g transform="translate(360 90) scale(0.88)">${markGroup("m")}</g>
    <g transform="translate(${f(line1X)} 1075) scale(${scale})">${wordmarkGroup("t", "IMPERIAL", 5)}</g>
    <path d="M${W / 2 - 150} 1232H${W / 2 - 24}M${W / 2 + 24} 1232H${W / 2 + 150}" stroke="#a9d5ff" stroke-width="1.5" opacity="0.6"/>
    <path d="M${W / 2} 1222L${W / 2 + 10} 1232L${W / 2} 1242L${W / 2 - 10} 1232Z" fill="none" stroke="#e2f3ff" stroke-width="1.8"/>
    <g transform="translate(${f(line2X)} 1285) scale(${scale})">${wordmarkGroup("t", "STAR GEMS", 5)}</g>`;
  return svg(W, H, inner, dark);
}

/** Mark to the left of a one-line wordmark. */
function horizontalSvg(dark) {
  const text = wordmark("IMPERIAL STAR GEMS");
  const scale = 0.9;
  const markSize = 400;
  const gap = 70;
  const padX = 80;
  const W = Math.round(padX * 2 + markSize + gap + text.width * scale);
  const H = 560;
  const inner = `
    <defs>${markDefs("m")}${wordmarkDefs("t", text.width)}</defs>
    <g transform="translate(${padX} ${(H - markSize) / 2}) scale(${markSize / 1000})">${markGroup("m")}</g>
    <g transform="translate(${padX + markSize + gap} ${H / 2 - 45}) scale(${scale})">${wordmarkGroup("t", "IMPERIAL STAR GEMS", 5.5)}</g>`;
  return svg(W, H, inner, dark);
}

/**
 * Favicon: the star outline and table only, on a dark tile so it reads in
 * light and dark browser chrome. Stroke weights are set per pixel size so
 * lines land near whole pixels instead of blurring out.
 */
function faviconSvg(px) {
  const g = markGeometry();
  const tune = { 16: { w: 0, pad: 15 }, 32: { w: 40, pad: 50 }, 48: { w: 30, pad: 55 } };
  const { w, pad } = tune[px] ?? { w: 26, pad: 60 };
  // At 16 px linework blurs together: draw a solid star with the table cut out.
  const solid = px <= 16;
  const view = 1000 + pad * 2;
  const radius = view * 0.22;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="${-pad} ${-pad} ${view} ${view}">
    <defs>
      <linearGradient id="fl" gradientUnits="userSpaceOnUse" x1="150" y1="50" x2="850" y2="950">
        <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#9fd0ff"/>
      </linearGradient>
      <radialGradient id="fb" gradientUnits="userSpaceOnUse" cx="500" cy="420" r="800">
        <stop offset="0" stop-color="#18202c"/><stop offset="1" stop-color="#06080b"/>
      </radialGradient>
    </defs>
    <rect x="${-pad}" y="${-pad}" width="${view}" height="${view}" rx="${radius}" fill="url(#fb)"/>
    ${
      solid
        ? `<path d="${g.outline} ${g.table}" fill="url(#fl)" fill-rule="evenodd" stroke="url(#fl)" stroke-width="30" stroke-linejoin="round"/>`
        : `<g fill="none" stroke="url(#fl)" stroke-linejoin="miter" stroke-width="${w}">
      <path d="${g.outline}"/>
      <path d="${g.table}" stroke-width="${w * 0.8}"/>
      ${px >= 48 ? g.facets.filter((_, i) => i % 3 === 2).map((d) => `<path d="${d}" stroke-width="${w * 0.55}"/>`).join("") : ""}
    </g>`
    }
  </svg>`;
}

/** An .ico whose entries are PNGs (supported by every current browser). */
function ico(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

async function png(svgText, width, file) {
  const data = await sharp(Buffer.from(svgText), { density: 72 * (width / Number(/width="(\d+)"/.exec(svgText)[1])) })
    .resize({ width })
    .png({ compressionLevel: 9 })
    .toBuffer();
  if (file) await writeFile(path.join(OUT, file), data);
  return data;
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const outputs = [
    ["logo-mark", markSvg, 4096],
    ["logo-stacked", stackedSvg, 4096],
    ["logo-horizontal", horizontalSvg, 6000],
  ];
  for (const [name, build, width] of outputs) {
    await writeFile(path.join(OUT, `${name}.svg`), build(false));
    await png(build(false), width, `${name}.png`);
    await png(build(true), width, `${name}-on-dark.png`);
    console.log(`  ${name}: svg, png (transparent), png (on dark) at ${width}px`);
  }

  const icons = [];
  for (const size of [16, 32, 48]) {
    const data = await png(faviconSvg(size), size, `favicon-${size}.png`);
    icons.push({ size, data });
  }
  await writeFile(path.join(OUT, "favicon.svg"), faviconSvg(512));
  await png(faviconSvg(512), 512, "favicon-512.png");
  const favicon = ico(icons);
  await writeFile(path.join(OUT, "favicon.ico"), favicon);

  // Next's file conventions: favicon.ico and apple-icon.png in the app root.
  await writeFile(path.join(ROOT, "src/app/favicon.ico"), favicon);
  await png(faviconSvg(180), 180, null).then((d) => writeFile(path.join(ROOT, "src/app/apple-icon.png"), d));
  console.log("  favicon: 16, 32, 48 px (.png and .ico), 512 px; installed to src/app/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
