#!/usr/bin/env node
/**
 * Pulls the finished-jewelry catalogue from the supplier's Shopify storefront
 * (kreanjewels.com) into src/data/jewelry.json, and its product photography
 * into public/jewelry/<SKU>/.
 *
 *   node scripts/scrape-jewelry.mjs            # fetch, parse, download new images
 *   node scripts/scrape-jewelry.mjs --refresh  # also re-encode images already on disk
 *
 * Loose diamonds on the same store (product_type "diamond") are skipped — the
 * site's own stone lists cover those.
 *
 * Each piece gets a random IMPSG-NNNNN SKU. The assignment is kept in
 * scripts/data/jewelry-skus.json, keyed by the supplier's product id, so a
 * re-run keeps every existing SKU (and URL) and only mints numbers for new
 * pieces.
 */
import { randomInt } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STORE = "https://kreanjewels.com";
const SKU_MAP = path.join(ROOT, "scripts/data/jewelry-skus.json");
const OUT_JSON = path.join(ROOT, "src/data/jewelry.json");
const OUT_IMAGES = path.join(ROOT, "public/jewelry");
const REFRESH = process.argv.includes("--refresh");
const UA = "Mozilla/5.0 (compatible; ImperialStarGems-catalogue/1.0)";

/* ------------------------------------------------------------------ fetch */

async function fetchWithRetry(url, as = "json", tries = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return as === "json" ? await res.json() : Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (attempt >= tries) throw new Error(`${url}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

async function fetchProducts() {
  const all = [];
  for (let page = 1; ; page++) {
    const { products } = await fetchWithRetry(`${STORE}/products.json?limit=250&page=${page}`);
    all.push(...products);
    if (products.length < 250) return all;
  }
}

/* ------------------------------------------------------ description parse */

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", times: "×", middot: "·",
  eacute: "é", reg: "®", trade: "™", deg: "°",
};

function decode(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(Number.parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

const tidy = (s) => decode(s).replace(/\s+/g, " ").replace(/\s+([,.;:])/g, "$1").trim();

/** Heading text → display title; the store decorates headings with ✦. */
const headingTitle = (s) => tidy(s).replace(/✦/g, "").trim();

/**
 * The store uses two description templates: a label/value grid, and "◆ Label:
 * value" lists. Both reduce to the same shape — titled sections holding rows
 * and free-text notes.
 */
function parseDescription(html) {
  let h = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(style|title|script|head)[\s\S]*?<\/\1>/gi, "")
    // The grid template's intro only carries the supplier SKU; its closing is a tagline.
    .replace(/<div class="intro">[\s\S]*?<\/div>\s*<\/div>/i, "")
    .replace(/<div class="closing">[\s\S]*?<\/div>/i, "")
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_, t) => `\n§ ${t.replace(/<[^>]+>/g, "")}\n`)
    .replace(
      /<span class="label">([\s\S]*?)<\/span>\s*<span class="value[^"]*">([\s\S]*?)<\/span>/gi,
      "\n◆ $1: $2\n",
    )
    .replace(/<span class="sep">[\s\S]*?<\/span>/gi, " ◆ ")
    .replace(/<li[^>]*>/gi, "\n◆ ")
    .replace(/<br\s*\/?>|<\/(p|div|li|ul|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  const sections = [];
  let current = null;
  for (const raw of h.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("§")) {
      current = { title: headingTitle(line.slice(1)), rows: [], notes: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      current = { title: "Details", rows: [], notes: [] };
      sections.push(current);
    }
    // "Package Includes" in the grid template is one line joined with ✦.
    for (const piece of line.split(/[◆✦]/)) {
      const text = tidy(piece);
      if (!text) continue;
      const pair = /^([^:]{2,48}):\s*(.+)$/.exec(text);
      if (pair && !/^https?$/i.test(pair[1])) current.rows.push([pair[1].trim(), pair[2].trim()]);
      else current.notes.push(text);
    }
  }

  // The supplier's own reference is kept, but never shown.
  let supplierRef;
  const skuSection = sections.findIndex((s) => /^(product )?sku$/i.test(s.title));
  if (skuSection >= 0) {
    supplierRef = sections[skuSection].notes[0];
    sections.splice(skuSection, 1);
  }
  const introSku = /SKU\s*·\s*([A-Z0-9-]+)/.exec(html);
  supplierRef ??= introSku?.[1];

  return {
    supplierRef,
    sections: sections
      .map((s) => ({
        title: s.title || "Details",
        rows: s.rows,
        notes: s.notes.filter((n) => !/^product description$/i.test(n)).map(stripSupplier),
      }))
      .filter((s) => s.rows.length || s.notes.length),
  };
}

const stripSupplier = (text) => text.replace(/\bkrean(\s+jewels)?\b/gi, "Imperial Star Gems");

/* ------------------------------------------------------- field extraction */

const CATEGORY = {
  ring: "ring",
  bracelets: "bracelet",
  necklace: "necklace",
  earing: "earrings",
  earring: "earrings",
  earrings: "earrings",
};

/** Words that name one of the site's shapes (src/lib/shapes.ts). */
const SHAPE_WORDS = [
  [/\bround\b|\bbrilliant\b/i, "round"],
  [/\bprincess\b/i, "princess"],
  [/\bcushion\b/i, "cushion"],
  [/\bemerald\b/i, "emerald"],
  [/\boval\b/i, "oval"],
  [/\bpear\b/i, "pear"],
  [/\bmarquise\b/i, "marquise"],
  [/\bradiant\b/i, "radiant"],
  [/\basscher\b/i, "asscher"],
  [/\bheart\b/i, "heart"],
  [/\btrillion\b|\btrilliant\b/i, "trillion"],
  [/\bhexagon(al)?\b/i, "hexagon"],
];

function shapesIn(text) {
  return SHAPE_WORDS.map(([re, slug]) => [text.search(re), slug])
    .filter(([at]) => at >= 0)
    .sort((a, b) => a[0] - b[0])
    .map(([, slug]) => slug);
}

function metalOf(value) {
  const v = value.toLowerCase();
  if (v.includes("rose")) return "rose";
  if (v.includes("white")) return "white";
  if (v.includes("yellow") || v.includes("gold")) return "yellow";
  return undefined;
}

const purityOf = (value) => {
  const m = /(\d{1,2})\s*K/i.exec(value);
  return m ? `${Number(m[1])}K` : undefined;
};

const num = (value) => {
  const m = /(\d+(?:\.\d+)?)/.exec(value ?? "");
  return m ? Number(m[1]) : undefined;
};

/** "D–F (Colorless)" → "D–F"; "VVS–VS, Subject to Availability" → "VVS–VS". */
const grade = (value) => value?.replace(/\s*\(.*$/, "").replace(/,.*$/, "").trim() || undefined;

const uniq = (list) => [...new Set(list.filter(Boolean))];

function extract(product, sections) {
  const rows = sections.flatMap((s) => s.rows);
  const row = (re) => rows.find(([label]) => re.test(label))?.[1];
  const title = tidy(product.title);

  const option = (re) => product.options.find((o) => re.test(o.name.trim()));
  const purityOption = option(/^metal purity$/i);
  const colorOption = option(/^colou?r$/i);
  const sizeOption = option(/^diamond size$/i);

  const carat =
    num(row(/^total diamond weight$/i)) ??
    num(/(\d+(?:\.\d+)?)\s*CT\b/i.exec(title)?.[1]) ??
    (sizeOption?.values.length === 1 ? num(sizeOption.values[0]) : undefined);

  const shapeText = [
    row(/^center stone shapes?$/i),
    row(/^(diamond|center stone|centre stone) shape$/i),
    row(/^shape$/i),
    title,
    product.tags.join(" "),
    row(/diamond shape|diamonds$/i),
  ]
    .filter(Boolean)
    .join(" | ");

  const typeText = `${row(/^diamond type$/i) ?? ""} ${title} ${row(/origin/i) ?? ""}`;
  const labGrown = /lab|cvd|hpht/i.test(typeText) || /lab[- ]grown|cvd/i.test(product.body_html);

  const cert = row(/^certification$/i) ?? "";

  return {
    name: title,
    category: CATEGORY[product.product_type.trim().toLowerCase()] ?? "ring",
    origin: labGrown ? "lab" : "natural",
    shapes: uniq(shapesIn(shapeText)),
    carat,
    centerCarat: num(row(/^cent(er|re) (stone |diamond )?weight$/i)),
    diamondCount: num(row(/^total diamond count$/i)),
    color: grade(row(/^(diamond )?colou?r( grade)?$/i)),
    clarity: grade(row(/^(diamond )?clarity( grade)?$/i)),
    lab: /\bGIA\b/.test(cert) ? "GIA" : /\bIGI\b/.test(cert) ? "IGI" : undefined,
    metals: uniq(
      (colorOption?.values ?? (row(/^metal colou?rs?/i) ?? "").split(/[·/,|]/)).map(metalOf),
    ).sort((a, b) => ["yellow", "white", "rose"].indexOf(a) - ["yellow", "white", "rose"].indexOf(b)),
    purities: uniq(
      (purityOption?.values ?? (row(/^(metal )?purity( options)?$/i) ?? "").split(/[·/,|]/)).map(
        purityOf,
      ),
    ).sort((a, b) => Number.parseInt(a) - Number.parseInt(b)),
    ringSize: row(/^ring size$/i),
    colorOptionIndex: colorOption ? product.options.indexOf(colorOption) : -1,
  };
}

/* ----------------------------------------------------------------- images */

async function saveImage(src, file) {
  if (existsSync(file) && !REFRESH) {
    const { width, height } = await sharp(file).metadata();
    return { width, height };
  }
  const input = await fetchWithRetry(src, "buffer");
  // Studio shots on transparent PNG: flatten onto white, which is how the
  // store shows them and a fraction of the size.
  const { data, info } = await sharp(input)
    .flatten({ background: "#ffffff" })
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer({ resolveWithObject: true });
  await writeFile(file, data);
  return { width: info.width, height: info.height };
}

async function pool(items, size, worker) {
  let next = 0;
  let done = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const item = items[next++];
        await worker(item);
        if (++done % 50 === 0 || done === items.length) {
          process.stdout.write(`  images ${done}/${items.length}\n`);
        }
      }
    }),
  );
}

/* ------------------------------------------------------------------- main */

function mintSku(used) {
  for (;;) {
    const sku = `IMPSG-${String(randomInt(0, 100000)).padStart(5, "0")}`;
    if (!used.has(sku)) {
      used.add(sku);
      return sku;
    }
  }
}

async function main() {
  console.log(`Fetching ${STORE}/products.json …`);
  const products = (await fetchProducts()).filter(
    (p) => p.product_type.trim().toLowerCase() !== "diamond",
  );
  console.log(`  ${products.length} jewelry pieces`);

  const skuMap = existsSync(SKU_MAP) ? JSON.parse(await readFile(SKU_MAP, "utf8")) : {};
  const used = new Set(Object.values(skuMap));
  for (const p of products) skuMap[p.id] ??= mintSku(used);
  if (new Set(Object.values(skuMap)).size !== Object.keys(skuMap).length) {
    throw new Error("Duplicate SKU in jewelry-skus.json");
  }
  await mkdir(path.dirname(SKU_MAP), { recursive: true });
  await writeFile(SKU_MAP, `${JSON.stringify(skuMap, null, 2)}\n`);

  const jobs = [];
  const pieces = products.map((product) => {
    const sku = skuMap[product.id];
    const { supplierRef, sections } = parseDescription(product.body_html ?? "");
    const { colorOptionIndex, ...fields } = extract(product, sections);

    const variantMetal = new Map(
      product.variants.map((v) => [
        v.id,
        colorOptionIndex >= 0 ? metalOf(v[`option${colorOptionIndex + 1}`] ?? "") : undefined,
      ]),
    );

    const images = product.images.map((img, i) => {
      const file = `${String(i + 1).padStart(2, "0")}.webp`;
      const metals = uniq(img.variant_ids.map((id) => variantMetal.get(id)));
      const entry = {
        src: `/jewelry/${sku}/${file}`,
        width: img.width,
        height: img.height,
        alt: img.alt ? tidy(img.alt) : "",
        ...(metals.length === 1 ? { metal: metals[0] } : {}),
      };
      jobs.push({ entry, url: img.src, file: path.join(OUT_IMAGES, sku, file) });
      return entry;
    });

    const prices = product.variants.map((v) => Number(v.price)).filter((n) => n > 0);

    return {
      sku,
      ...fields,
      images,
      sections,
      addedAt: product.created_at,
      featured: product.tags.some((t) => /^feature/i.test(t)),
      supplier: {
        productId: product.id,
        handle: product.handle,
        ref: supplierRef,
        priceUsd: prices.length ? [Math.min(...prices), Math.max(...prices)] : undefined,
      },
    };
  });

  console.log(`Downloading ${jobs.length} images …`);
  for (const p of pieces) await mkdir(path.join(OUT_IMAGES, p.sku), { recursive: true });
  const failed = [];
  await pool(jobs, 8, async (job) => {
    try {
      Object.assign(job.entry, await saveImage(job.url, job.file));
    } catch (err) {
      failed.push(job);
      console.warn(`  ! ${err.message}`);
    }
  });
  for (const p of pieces) {
    p.images = p.images.filter((img) => !failed.some((f) => f.entry === img));
  }

  pieces.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  await mkdir(path.dirname(OUT_JSON), { recursive: true });
  await writeFile(OUT_JSON, `${JSON.stringify(pieces, null, 1)}\n`);

  const missing = (key) => pieces.filter((p) => p[key] === undefined || p[key]?.length === 0).length;
  console.log(
    `Wrote ${pieces.length} pieces to ${path.relative(ROOT, OUT_JSON)}` +
      ` (no carat: ${missing("carat")}, no shape: ${missing("shapes")}, no images: ${missing("images")}, failed images: ${failed.length})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
