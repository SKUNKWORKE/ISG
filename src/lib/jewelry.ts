import { SHAPE_BY_SLUG, SHAPES, type ShapeSlug } from "./shapes";
import type { Lab, Origin } from "./stones";

/**
 * Finished jewelry — the counterpart of stones.ts. This module holds the types,
 * vocabulary and filtering only; the stock list lives in real-jewelry.ts, which
 * is server-only because of its size. Client components import from here.
 */

export const JEWELRY_CATEGORIES = ["ring", "earrings", "bracelet", "necklace"] as const;
export const METALS = ["yellow", "white", "rose"] as const;
export const PURITIES = ["9K", "10K", "14K", "18K"] as const;

export type JewelryCategory = (typeof JEWELRY_CATEGORIES)[number];
export type Metal = (typeof METALS)[number];
export type Purity = (typeof PURITIES)[number];

export const CATEGORY_NAME: Record<JewelryCategory, string> = {
  ring: "Ring",
  earrings: "Earrings",
  bracelet: "Bracelet",
  necklace: "Necklace",
};

export const CATEGORY_PLURAL: Record<JewelryCategory, string> = {
  ring: "Rings",
  earrings: "Earrings",
  bracelet: "Bracelets",
  necklace: "Necklaces",
};

export const METAL_NAME: Record<Metal, string> = {
  yellow: "Yellow gold",
  white: "White gold",
  rose: "Rose gold",
};

export type JewelImage = {
  /** Under /public/jewelry/<SKU>/ */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Set when the photograph shows one metal colour only. */
  metal?: Metal;
};

export type JewelSection = {
  title: string;
  rows: [string, string][];
  notes: string[];
};

export type Jewel = {
  /** IMPSG-NNNNN, assigned by scripts/scrape-jewelry.mjs. */
  sku: string;
  name: string;
  category: JewelryCategory;
  origin: Origin;
  /** Every shape set in the piece, centre stone first. */
  shapes: ShapeSlug[];
  /** Total diamond weight. */
  carat: number;
  centerCarat?: number;
  diamondCount?: number;
  /** Ranges, not single grades — pieces are set with matched parcels ("D–F", "VVS–VS"). */
  color?: string;
  clarity?: string;
  lab?: Lab;
  /** Metal colours the piece is made in. */
  metals: Metal[];
  /** Gold purities the piece is made in. */
  purities: Purity[];
  ringSize?: string;
  images: JewelImage[];
  /** The full written specification, as supplied. */
  sections: JewelSection[];
  /** ISO timestamp. */
  addedAt: string;
  featured: boolean;
  /**
   * Trade-desk reference only; never rendered and never sent to the browser.
   * `priceUsd` is the supplier's retail range across metal options.
   */
  supplier: {
    productId: number;
    handle: string;
    ref?: string;
    priceUsd?: [number, number];
  };
};

/**
 * What the catalogue, cards and enquiry drawer need. The written specification
 * and supplier details stay on the server.
 */
export type JewelSummary = Omit<Jewel, "sections" | "supplier">;

export function toSummary({ sections: _s, supplier: _p, ...summary }: Jewel): JewelSummary {
  return summary;
}

export function originWord(jewel: Pick<Jewel, "origin">) {
  return jewel.origin === "natural" ? "natural" : "lab-grown";
}

export function metalsLine(jewel: Pick<Jewel, "metals">) {
  return jewel.metals.map((m) => METAL_NAME[m].split(" ")[0]).join(", ") + " gold";
}

export function puritiesLine(jewel: Pick<Jewel, "purities">) {
  return jewel.purities.join(", ");
}

export function shapesLine(jewel: Pick<Jewel, "shapes">) {
  return jewel.shapes.map((s) => SHAPE_BY_SLUG[s].name).join(", ");
}

/** "Ring, 2.57ct, D–F/VVS–VS" — the recap that rides along with every enquiry. */
export function jewelDescriptor(jewel: JewelSummary): string {
  const grades = [jewel.color, jewel.clarity].filter(Boolean).join("/");
  return [CATEGORY_NAME[jewel.category], `${jewel.carat.toFixed(2)}ct`, grades]
    .filter(Boolean)
    .join(", ");
}

/** The label/value list shared by the piece's page, its enquiry drawer and its PDF spec sheet. */
export function jewelSpecs(jewel: JewelSummary): [string, string][] {
  const specs: [string, string][] = [
    ["Type", CATEGORY_NAME[jewel.category]],
    ["Total carat", `${jewel.carat.toFixed(2)} ct`],
  ];
  if (jewel.centerCarat !== undefined) specs.push(["Centre stone", `${jewel.centerCarat.toFixed(2)} ct`]);
  if (jewel.diamondCount !== undefined) specs.push(["Diamond count", String(jewel.diamondCount)]);
  specs.push([jewel.shapes.length > 1 ? "Shapes" : "Shape", shapesLine(jewel)]);
  if (jewel.color) specs.push(["Colour", jewel.color]);
  if (jewel.clarity) specs.push(["Clarity", jewel.clarity]);
  specs.push(["Origin", jewel.origin === "natural" ? "Natural" : "Lab-grown"]);
  if (jewel.metals.length) specs.push(["Metal", metalsLine(jewel)]);
  if (jewel.purities.length) specs.push(["Purity", puritiesLine(jewel)]);
  if (jewel.ringSize) specs.push(["Ring size", jewel.ringSize]);
  specs.push(["Certificate", jewel.lab ? `${jewel.lab}, on request` : "On request"]);
  return specs;
}

/* ---------------------------------------------------------------- filtering */

/** The stone catalogues' general options plus jewelry's own; not imported from catalog-filter, which pulls in the stone lists. */
export const SORTS = {
  recommended: "Recommended",
  recent: "Newest first",
  oldest: "Oldest first",
  caratDesc: "Total carat: high to low",
  caratAsc: "Total carat: low to high",
  centerDesc: "Centre stone: largest first",
  centerAsc: "Centre stone: smallest first",
  countDesc: "Diamond count: most first",
  countAsc: "Diamond count: fewest first",
  nameAsc: "Name: A to Z",
} as const;

export type Sort = keyof typeof SORTS;

export const SORT_GROUPS: { label: string; sorts: Sort[] }[] = [
  { label: "General", sorts: ["recommended", "recent", "oldest", "nameAsc"] },
  { label: "Total carat", sorts: ["caratDesc", "caratAsc"] },
  { label: "Stones", sorts: ["centerDesc", "centerAsc", "countDesc", "countAsc"] },
];

/** Whether a piece is set with one shape throughout or a mix. */
export const LAYOUTS = ["single", "mixed"] as const;
export type Layout = (typeof LAYOUTS)[number];
export const LAYOUT_NAME: Record<Layout, string> = { single: "One shape", mixed: "Mixed shapes" };
const layoutOf = (j: Pick<Jewel, "shapes">): Layout => (j.shapes.length > 1 ? "mixed" : "single");

export const JEWELRY_RANGE_KEYS = ["carat", "center", "count"] as const;
export type JewelryRangeKey = (typeof JEWELRY_RANGE_KEYS)[number];
export type JewelryBounds = Record<JewelryRangeKey, [number, number]>;

export type JewelryFilters = {
  query: string;
  categories: JewelryCategory[];
  shapes: ShapeSlug[];
  layouts: Layout[];
  metals: Metal[];
  purities: Purity[];
  ranges: JewelryBounds;
};

export type JewelryListKey = "categories" | "shapes" | "layouts" | "metals" | "purities";

function jewelryRangeValue(j: JewelSummary, key: JewelryRangeKey): number | undefined {
  if (key === "carat") return j.carat;
  if (key === "center") return j.centerCarat;
  return j.diamondCount;
}

/** Bounds of each numeric filter for a set, rounded outwards to clean input stops. */
export function jewelryBounds(items: JewelSummary[]): JewelryBounds {
  const extent = (key: JewelryRangeKey, step: number): [number, number] => {
    const values = items.map((j) => jewelryRangeValue(j, key)).filter((v): v is number => v !== undefined);
    if (!values.length) return [0, 0];
    return [
      Number((Math.floor(Math.min(...values) / step) * step).toFixed(2)),
      Number((Math.ceil(Math.max(...values) / step) * step).toFixed(2)),
    ];
  };
  return { carat: extent("carat", 0.1), center: extent("center", 0.1), count: extent("count", 1) };
}

export function emptyJewelryFilters(bounds: JewelryBounds): JewelryFilters {
  return { query: "", categories: [], shapes: [], layouts: [], metals: [], purities: [], ranges: { ...bounds } };
}

export function jewelryRangeActive(filters: JewelryFilters, bounds: JewelryBounds, key: JewelryRangeKey) {
  return filters.ranges[key][0] !== bounds[key][0] || filters.ranges[key][1] !== bounds[key][1];
}

const JEWELRY_FACETS: { [K in JewelryListKey]: (j: JewelSummary) => readonly string[] } = {
  categories: (j) => [j.category],
  shapes: (j) => j.shapes,
  layouts: (j) => [layoutOf(j)],
  metals: (j) => j.metals,
  purities: (j) => j.purities,
};

function jewelMatches(j: JewelSummary, filters: JewelryFilters, bounds: JewelryBounds, skip?: JewelryListKey) {
  const terms = filters.query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length) {
    const hay = [j.sku, j.name, CATEGORY_NAME[j.category], shapesLine(j), metalsLine(j)].join(" ").toLowerCase();
    if (!terms.every((t) => hay.includes(t))) return false;
  }
  for (const key of Object.keys(JEWELRY_FACETS) as JewelryListKey[]) {
    const wanted = filters[key] as readonly string[];
    if (key === skip || !wanted.length) continue;
    if (!JEWELRY_FACETS[key](j).some((v) => wanted.includes(v))) return false;
  }
  for (const key of JEWELRY_RANGE_KEYS) {
    if (!jewelryRangeActive(filters, bounds, key)) continue;
    const value = jewelryRangeValue(j, key);
    const [lo, hi] = filters.ranges[key];
    // A narrowed range drops pieces that don't state the value.
    if (value === undefined || value < lo - 1e-9 || value > hi + 1e-9) return false;
  }
  return true;
}

/** Per-option counts for every facet, each ignoring its own selection. */
export function jewelryFacetCounts(items: JewelSummary[], filters: JewelryFilters, bounds: JewelryBounds) {
  const out = {} as Record<JewelryListKey, Record<string, number>>;
  for (const key of Object.keys(JEWELRY_FACETS) as JewelryListKey[]) {
    const counts: Record<string, number> = {};
    for (const j of items) {
      if (!jewelMatches(j, filters, bounds, key)) continue;
      for (const v of new Set(JEWELRY_FACETS[key](j))) counts[v] = (counts[v] ?? 0) + 1;
    }
    out[key] = counts;
  }
  return out;
}

/** Filtering lives here, not in the component, so the PDF sheet lists exactly what was on screen. */
export function filterJewelry<T extends JewelSummary>(
  items: T[],
  filters: JewelryFilters,
  sort: Sort,
  bounds: JewelryBounds,
): T[] {
  const matched = items.filter((j) => jewelMatches(j, filters, bounds));
  // Pieces that don't state the sorted value go last either way.
  const by = (key: (j: T) => number | undefined, dir: 1 | -1) => (a: T, b: T) => {
    const ka = key(a);
    const kb = key(b);
    if (ka === undefined || kb === undefined) return Number(ka === undefined) - Number(kb === undefined);
    return (ka - kb) * dir || b.carat - a.carat;
  };
  switch (sort) {
    case "recent":
      return matched.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    case "oldest":
      return matched.sort((a, b) => a.addedAt.localeCompare(b.addedAt));
    case "caratDesc":
      return matched.sort((a, b) => b.carat - a.carat);
    case "caratAsc":
      return matched.sort((a, b) => a.carat - b.carat);
    case "centerDesc":
      return matched.sort(by((j) => j.centerCarat, -1));
    case "centerAsc":
      return matched.sort(by((j) => j.centerCarat, 1));
    case "countDesc":
      return matched.sort(by((j) => j.diamondCount, -1));
    case "countAsc":
      return matched.sort(by((j) => j.diamondCount, 1));
    case "nameAsc":
      return matched.sort((a, b) => a.name.localeCompare(b.name));
    default:
      // Recommended: featured pieces first, otherwise stock order.
      return matched.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

const JEWELRY_PARAM: Record<JewelryListKey, string> = {
  categories: "type",
  shapes: "shape",
  layouts: "layout",
  metals: "metal",
  purities: "purity",
};

const JEWELRY_ALLOWED: Record<JewelryListKey, readonly string[]> = {
  categories: JEWELRY_CATEGORIES,
  shapes: SHAPES.map((s) => s.slug),
  layouts: LAYOUTS,
  metals: METALS,
  purities: PURITIES,
};

const JEWELRY_RANGE_PARAM: Record<JewelryRangeKey, [string, string]> = {
  carat: ["cmin", "cmax"],
  center: ["ccmin", "ccmax"],
  count: ["nmin", "nmax"],
};

/** Only non-default values are written, so an unfiltered sheet has a bare URL. */
export function jewelryFiltersToParams(filters: JewelryFilters, sort: Sort, bounds: JewelryBounds) {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  for (const key of Object.keys(JEWELRY_PARAM) as JewelryListKey[]) {
    if (filters[key].length) params.set(JEWELRY_PARAM[key], filters[key].join(","));
  }
  for (const key of JEWELRY_RANGE_KEYS) {
    const [lo, hi] = filters.ranges[key];
    if (lo !== bounds[key][0]) params.set(JEWELRY_RANGE_PARAM[key][0], String(lo));
    if (hi !== bounds[key][1]) params.set(JEWELRY_RANGE_PARAM[key][1], String(hi));
  }
  if (sort !== "recommended") params.set("sort", sort);
  return params;
}

/** `?type=ring,earrings` style values, with anything unrecognised dropped. */
export function pickList<T extends string>(
  value: string | string[] | null | undefined,
  allowed: readonly T[],
): T[] {
  const raw = (Array.isArray(value) ? value[0] : value) ?? "";
  return raw.split(",").filter((v): v is T => (allowed as readonly string[]).includes(v));
}

/** The inverse of `jewelryFiltersToParams`. */
export function jewelryFiltersFromParams(
  params: URLSearchParams,
  bounds: JewelryBounds,
): { filters: JewelryFilters; sort: Sort } {
  const filters = emptyJewelryFilters(bounds);
  filters.query = (params.get("q") ?? "").slice(0, 80);
  for (const key of Object.keys(JEWELRY_PARAM) as JewelryListKey[]) {
    (filters[key] as string[]) = [...new Set(pickList(params.get(JEWELRY_PARAM[key]), JEWELRY_ALLOWED[key]))];
  }
  for (const key of JEWELRY_RANGE_KEYS) {
    const [lo, hi] = bounds[key];
    const read = (name: string, fallback: number) => {
      const value = Number.parseFloat(params.get(name) ?? "");
      return Number.isFinite(value) ? Math.min(hi, Math.max(lo, value)) : fallback;
    };
    filters.ranges[key] = [read(JEWELRY_RANGE_PARAM[key][0], lo), read(JEWELRY_RANGE_PARAM[key][1], hi)];
  }
  const sort = (Object.keys(SORTS) as Sort[]).find((key) => key === params.get("sort"));
  return { filters, sort: sort ?? "recommended" };
}

const JEWELRY_RANGE_LABEL: Record<JewelryRangeKey, (lo: number, hi: number) => string> = {
  carat: (lo, hi) => `${lo.toFixed(2)}–${hi.toFixed(2)} ct total`,
  center: (lo, hi) => `Centre ${lo.toFixed(2)}–${hi.toFixed(2)} ct`,
  count: (lo, hi) => `${lo}–${hi} diamonds`,
};

/** Every active constraint as a removable label — used for the pills on screen and the sheet header. */
export function activeJewelryFilterList(filters: JewelryFilters, bounds: JewelryBounds) {
  const items: { id: string; label: string; key: JewelryListKey | JewelryRangeKey | "query"; value?: string }[] = [];
  if (filters.query.trim()) items.push({ id: "q", label: `“${filters.query.trim()}”`, key: "query" });
  const name: Record<JewelryListKey, (v: string) => string> = {
    categories: (v) => CATEGORY_PLURAL[v as JewelryCategory],
    shapes: (v) => SHAPE_BY_SLUG[v as ShapeSlug].name,
    layouts: (v) => LAYOUT_NAME[v as Layout],
    metals: (v) => METAL_NAME[v as Metal],
    purities: (v) => v,
  };
  for (const key of Object.keys(JEWELRY_PARAM) as JewelryListKey[]) {
    for (const value of filters[key]) items.push({ id: `${key}:${value}`, label: name[key](value), key, value });
  }
  for (const key of JEWELRY_RANGE_KEYS) {
    if (jewelryRangeActive(filters, bounds, key)) {
      items.push({ id: key, label: JEWELRY_RANGE_LABEL[key](...filters.ranges[key]), key });
    }
  }
  return items;
}

/** One line for the sheet header, so a forwarded copy says what it was filtered to. */
export function describeJewelryFilters(filters: JewelryFilters, sort: Sort, bounds: JewelryBounds): string {
  const parts = activeJewelryFilterList(filters, bounds).map((i) => i.label);
  const scope = parts.length ? `Filtered to ${parts.join("  •  ")}` : "Full catalogue, no filters";
  return `${scope}  •  Sorted ${SORTS[sort].toLowerCase()}`;
}
