import "server-only";
import type { ShapeSlug } from "./shapes";
import { REAL_LAB_STONES } from "./real-stones";
import { REAL_NATURAL_STONES } from "./real-natural-stones";
import { SUPPLIER_STONES } from "./supplier-stones";
import { isColorGrade, type Origin, type Stone } from "./stone-vocabulary";

/**
 * The stock lists. Server-only: tens of thousands of stones would swamp any
 * page that shipped them, so the catalogue filters here and sends the browser
 * one page of results at a time (see catalog-search.ts). Types and vocabulary
 * live in stone-vocabulary.ts and are re-exported for server code.
 */
export * from "./stone-vocabulary";

export const NATURAL_STONES: Stone[] = [
  ...REAL_NATURAL_STONES,
  ...SUPPLIER_STONES.filter((s) => s.origin === "natural"),
];
export const LAB_STONES: Stone[] = [...REAL_LAB_STONES, ...SUPPLIER_STONES.filter((s) => s.origin === "lab")];

export const ALL_STONES: Stone[] = [...NATURAL_STONES, ...LAB_STONES];

const BY_SKU = new Map(ALL_STONES.map((s) => [s.sku, s]));

/** Up to six stones for the home page — one per shape, spread across both origins. */
export const FEATURED_STONES: Stone[] = (() => {
  const wanted: Array<[ShapeSlug, Origin]> = [
    ["radiant", "natural"],
    ["oval", "natural"],
    ["emerald", "lab"],
    ["round", "lab"],
    ["pear", "lab"],
    ["asscher", "natural"],
  ];
  return wanted
    .map(([shape, origin]) => {
      const pool = origin === "natural" ? NATURAL_STONES : LAB_STONES;
      const pick =
        pool.find(
          (s) => s.shape === shape && s.carat >= 1 && isColorGrade(s.color) && s.color <= "G",
        ) ?? pool.find((s) => s.shape === shape);
      return pick ? { ...pick, featured: true } : undefined;
    })
    .filter((s): s is Stone => Boolean(s));
})();

export function stonesFor(origin: Origin): Stone[] {
  return origin === "natural" ? NATURAL_STONES : LAB_STONES;
}

export function findStone(sku: string): Stone | undefined {
  return BY_SKU.get(sku);
}

/** Google reads at most 50,000 URLs from one sitemap, so stone pages are split across several. */
export const STONES_PER_SITEMAP = 50_000;

export function stoneSitemapCount(): number {
  return Math.ceil(ALL_STONES.length / STONES_PER_SITEMAP);
}
