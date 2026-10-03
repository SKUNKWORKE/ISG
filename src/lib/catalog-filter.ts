import { SHAPE_BY_SLUG, SHAPES, type ShapeSlug } from "./shapes";
import {
  CLARITY_GRADES,
  COLOR_GRADES,
  CUT_GRADES,
  FLUORESCENCE,
  LABS,
  addedKey,
  isColorGrade,
  isLowerColor,
  type ClarityGrade,
  type ColorGrade,
  type CutGrade,
  type Fluorescence,
  type Lab,
  type Stone,
} from "./stone-vocabulary";

/**
 * Filtering lives here, not in the catalogue component, so the downloadable
 * spec sheet lists exactly the stones the buyer was looking at on screen.
 */

export const FANCY = "Fancy";
/** Colour-filter value for letter grades below J — K through Z, shown as "K–Z". */
export const LOWER_COLORS = "K-Z";

/** Base hues a fancy-colour description is filed under ("Fancy Intense Brownish Pink" → Pink). */
export const FANCY_HUES = ["Yellow", "Pink", "Blue", "Green", "Orange", "Brown", "Purple"] as const;
export type FancyHue = (typeof FANCY_HUES)[number];

/** Finish grades as a buyer ranks them — CUT_GRADES is in the labs' listing order, with Ideal last. */
export const FINISH_GRADES = ["Ideal", "Excellent", "Very Good", "Good", "Fair"] as const satisfies readonly CutGrade[];

export const SORTS = {
  recommended: "Recommended",
  recent: "Recently added",
  bestOverall: "Best overall grade",
  caratDesc: "Carat: high to low",
  caratAsc: "Carat: low to high",
  colorBest: "Colour: best first",
  clarityBest: "Clarity: best first",
  finishBest: "Cut and finish: best first",
  fluorLeast: "Fluorescence: least first",
  ratioAsc: "Length to width: squarest first",
  ratioDesc: "Length to width: longest first",
  tableAsc: "Table: low to high",
  depthAsc: "Depth: low to high",
} as const;

export type Sort = keyof typeof SORTS;

/** How the sort menu is grouped. */
export const SORT_GROUPS: { label: string; sorts: Sort[] }[] = [
  { label: "General", sorts: ["recommended", "recent", "bestOverall"] },
  { label: "Size", sorts: ["caratDesc", "caratAsc"] },
  { label: "Grades", sorts: ["colorBest", "clarityBest", "finishBest", "fluorLeast"] },
  { label: "Proportions", sorts: ["ratioAsc", "ratioDesc", "tableAsc", "depthAsc"] },
];

export const RANGE_KEYS = ["carat", "table", "depth", "ratio"] as const;
export type RangeKey = (typeof RANGE_KEYS)[number];
export type Range = [number, number];
export type Bounds = Record<RangeKey, Range>;

export type Filters = {
  query: string;
  shapes: ShapeSlug[];
  colors: (ColorGrade | typeof LOWER_COLORS | typeof FANCY)[];
  hues: FancyHue[];
  clarities: ClarityGrade[];
  cuts: CutGrade[];
  polishes: CutGrade[];
  symmetries: CutGrade[];
  fluorescences: Fluorescence[];
  labs: Lab[];
  ranges: Record<RangeKey, Range>;
};

export type ListKey = {
  [K in keyof Filters]: Filters[K] extends readonly string[] ? K : never;
}[keyof Filters];

/* ------------------------------------------------------------ stone values */

export function fancyHue(stone: Pick<Stone, "color">): FancyHue | undefined {
  if (isColorGrade(stone.color) || isLowerColor(stone.color)) return undefined;
  const words = stone.color.split(/[\s-]+/);
  for (let i = words.length - 1; i >= 0; i--) {
    const hue = FANCY_HUES.find((h) => h === words[i]);
    if (hue) return hue;
  }
  return undefined;
}

/** Where a stone files under the colour filter: its D–J grade, K–Z, or Fancy. */
export function colorBucket(stone: Pick<Stone, "color">): Filters["colors"][number] {
  if (isColorGrade(stone.color)) return stone.color;
  return isLowerColor(stone.color) ? LOWER_COLORS : FANCY;
}

/** Longer side over shorter, from "6.48 x 6.51 x 4.01 mm"; NaN when the text won't parse. */
export function lengthToWidth(stone: Pick<Stone, "measurements">): number {
  const [a, b] = stone.measurements.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  if (!a || !b) return Number.NaN;
  return Math.max(a, b) / Math.min(a, b);
}

function rangeValue(stone: Stone, key: RangeKey): number {
  if (key === "carat") return stone.carat;
  if (key === "table") return stone.tablePercent;
  if (key === "depth") return stone.depthPercent;
  return lengthToWidth(stone);
}

/** Lower is better throughout; unranked values sort last. */
const rank = (list: readonly string[], value: string | undefined) => {
  const i = value === undefined ? -1 : list.indexOf(value);
  return i === -1 ? list.length : i;
};
const colorRank = (s: Stone) => rank(COLOR_GRADES, s.color);
/** D to Z by letter ("W-X" by its first), fancy colours after. */
const LETTER_SCALE = "DEFGHIJKLMNOPQRSTUVWXYZ";
const colorScaleRank = (s: Stone) =>
  isColorGrade(s.color) || isLowerColor(s.color) ? LETTER_SCALE.indexOf(s.color[0]) : LETTER_SCALE.length;
const clarityRank = (s: Stone) => rank(CLARITY_GRADES, s.clarity);
/** Cut where graded, then polish and symmetry; a missing cut grade costs nothing. */
const finishRank = (s: Stone) =>
  (s.cut ? rank(FINISH_GRADES, s.cut) : 0) + rank(FINISH_GRADES, s.polish) + rank(FINISH_GRADES, s.symmetry);

/* --------------------------------------------------------------- filtering */

function roundOut([lo, hi]: Range, step: number): Range {
  return [Math.floor(lo / step) * step, Math.ceil(hi / step) * step].map((v) => Number(v.toFixed(2))) as Range;
}

/** Bounds of each numeric filter for a set, rounded outwards to clean input stops. */
export function stoneBounds(stones: Stone[]): Bounds {
  // A loop rather than Math.min(...values): spreading tens of thousands of
  // arguments can overflow the call stack.
  const extent = (key: RangeKey): Range => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const s of stones) {
      const value = rangeValue(s, key);
      if (!Number.isFinite(value)) continue;
      if (value < lo) lo = value;
      if (value > hi) hi = value;
    }
    return lo <= hi ? [lo, hi] : [0, 0];
  };
  return {
    carat: roundOut(extent("carat"), 0.1),
    table: roundOut(extent("table"), 1),
    depth: roundOut(extent("depth"), 1),
    ratio: roundOut(extent("ratio"), 0.01),
  };
}

export function emptyFilters(bounds: Bounds): Filters {
  return {
    query: "",
    shapes: [],
    colors: [],
    hues: [],
    clarities: [],
    cuts: [],
    polishes: [],
    symmetries: [],
    fluorescences: [],
    labs: [],
    ranges: { ...bounds },
  };
}

export function rangeActive(filters: Filters, bounds: Bounds, key: RangeKey) {
  const [lo, hi] = filters.ranges[key];
  return lo !== bounds[key][0] || hi !== bounds[key][1];
}

function matchesQuery(stone: Stone, query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const hay = [stone.sku, stone.shapeName, stone.color, stone.clarity, stone.lab, stone.cut ?? ""]
    .join(" ")
    .toLowerCase();
  return terms.every((t) => hay.includes(t));
}

const FACET_VALUE: { [K in ListKey]: (s: Stone) => string | undefined } = {
  shapes: (s) => s.shape,
  colors: colorBucket,
  hues: fancyHue,
  clarities: (s) => s.clarity,
  cuts: (s) => s.cut,
  polishes: (s) => s.polish,
  symmetries: (s) => s.symmetry,
  fluorescences: (s) => s.fluorescence,
  labs: (s) => s.lab,
};

const LIST_KEYS = Object.keys(FACET_VALUE) as ListKey[];

/** Search text and numeric ranges: the constraints no facet count ever leaves out. */
function matchesFixed(stone: Stone, filters: Filters, bounds: Bounds) {
  if (!matchesQuery(stone, filters.query)) return false;
  for (const key of RANGE_KEYS) {
    if (!rangeActive(filters, bounds, key)) continue;
    const value = rangeValue(stone, key);
    const [lo, hi] = filters.ranges[key];
    // A narrowed range drops stones that can't be measured against it.
    if (!(value >= lo - 1e-9 && value <= hi + 1e-9)) return false;
  }
  return true;
}

/** Whether a stone passes one facet that has a selection. */
function inFacet(stone: Stone, filters: Filters, key: ListKey) {
  const value = FACET_VALUE[key](stone);
  return value !== undefined && (filters[key] as readonly string[]).includes(value);
}

function matches(stone: Stone, filters: Filters, bounds: Bounds) {
  return matchesFixed(stone, filters, bounds) && LIST_KEYS.every((key) => !filters[key].length || inFacet(stone, filters, key));
}

/**
 * Per-option counts for every facet, each ignoring its own selection — so a
 * stone that fails only the colour filter still counts toward the colour
 * chips. One pass over the stones rather than one per facet.
 */
export function facetCounts(stones: Stone[], filters: Filters, bounds: Bounds) {
  const out = Object.fromEntries(LIST_KEYS.map((key) => [key, {}])) as Record<ListKey, Record<string, number>>;
  const active = LIST_KEYS.filter((key) => filters[key].length);
  const tally = (key: ListKey, stone: Stone) => {
    const value = FACET_VALUE[key](stone);
    if (value !== undefined) out[key][value] = (out[key][value] ?? 0) + 1;
  };
  for (const stone of stones) {
    if (!matchesFixed(stone, filters, bounds)) continue;
    let failed: ListKey | undefined;
    let failures = 0;
    for (const key of active) {
      if (inFacet(stone, filters, key)) continue;
      failed = key;
      if (++failures > 1) break;
    }
    if (failures > 1) continue;
    if (failed) tally(failed, stone);
    else for (const key of LIST_KEYS) tally(key, stone);
  }
  return out;
}

export type FacetCounts = ReturnType<typeof facetCounts>;

/**
 * The catalogue filters on the server (catalog-search.ts) and the browser
 * receives one page of results at a time, since the stock lists run to tens
 * of thousands of stones. These are the shapes that travel.
 */
export type CatalogPage = {
  /** Every stone matching the filters, not just this page. */
  count: number;
  stones: Stone[];
  /** Option counts for the filter chips; sent with the first page only. */
  counts?: FacetCounts;
};

/** What the filter panel needs to know about a whole stock list. */
export type CatalogSummary = {
  total: number;
  bounds: Bounds;
  /** Any SKUs carrying an intake date, for the "Recently added" sort. */
  hasDates: boolean;
  hasFancy: boolean;
  hasLowerColors: boolean;
};

export const CATALOG_PAGE_SIZE = 12;

export function filterStones(stones: Stone[], filters: Filters, sort: Sort, bounds: Bounds): Stone[] {
  const matched = stones.filter((s) => matches(s, filters, bounds));
  // Keys are worked out once per stone, not once per comparison: some parse
  // text, and a sort compares n·log n times.
  const keyed = (key: (s: Stone) => number) => {
    const keys = new Map(matched.map((s) => [s, key(s)]));
    return (s: Stone) => keys.get(s)!;
  };
  const by = (rawKey: (s: Stone) => number, dir = 1) => {
    const key = keyed(rawKey);
    return (a: Stone, b: Stone) => {
      const ka = key(a);
      const kb = key(b);
      // Unmeasurable values go last whichever way the sort runs.
      if (Number.isNaN(ka) || Number.isNaN(kb)) return Number(Number.isNaN(ka)) - Number(Number.isNaN(kb));
      return (ka - kb) * dir || b.carat - a.carat;
    };
  };
  switch (sort) {
    case "recent": {
      const added = keyed(addedKey);
      return matched.sort((a, b) => added(b) - added(a));
    }
    case "bestOverall":
      return matched.sort(by((s) => colorRank(s) + clarityRank(s) + finishRank(s)));
    case "caratDesc":
      return matched.sort((a, b) => b.carat - a.carat);
    case "caratAsc":
      return matched.sort((a, b) => a.carat - b.carat);
    case "colorBest": {
      // Within a rank, colours in collation order, as localeCompare would put them.
      const names = [...new Set(matched.map((s) => s.color))].sort((a, b) => a.localeCompare(b));
      const collation = new Map(names.map((name, i) => [name, i]));
      return matched.sort(by((s) => colorScaleRank(s) * names.length + collation.get(s.color)!));
    }
    case "clarityBest":
      return matched.sort(by(clarityRank));
    case "finishBest":
      return matched.sort(by(finishRank));
    case "fluorLeast":
      return matched.sort(by((s) => rank(FLUORESCENCE, s.fluorescence)));
    case "ratioAsc":
      return matched.sort(by(lengthToWidth));
    case "ratioDesc":
      return matched.sort(by(lengthToWidth, -1));
    case "tableAsc":
      return matched.sort(by((s) => s.tablePercent));
    case "depthAsc":
      return matched.sort(by((s) => s.depthPercent));
    default:
      return matched;
  }
}

/* ---------------------------------------------------------- quick presets */

export type Preset = { label: string; key: ListKey; values: string[] };

export const PRESETS: Preset[] = [
  { label: "Colourless (D–F)", key: "colors", values: ["D", "E", "F"] },
  { label: "Eye-clean (VS2+)", key: "clarities", values: ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2"] },
  { label: "Excellent polish", key: "polishes", values: ["Excellent"] },
  { label: "Excellent symmetry", key: "symmetries", values: ["Excellent"] },
  { label: "No fluorescence", key: "fluorescences", values: ["None"] },
  { label: "Fancy colour", key: "colors", values: [FANCY] },
];

export function presetActive(filters: Filters, preset: Preset) {
  const current = filters[preset.key] as readonly string[];
  return current.length === preset.values.length && preset.values.every((v) => current.includes(v));
}

/* ------------------------------------------------------------ URL params */

const PARAM: Record<ListKey, string> = {
  shapes: "shape",
  colors: "color",
  hues: "hue",
  clarities: "clarity",
  cuts: "cut",
  polishes: "polish",
  symmetries: "sym",
  fluorescences: "fluor",
  labs: "lab",
};

const ALLOWED: Record<ListKey, readonly string[]> = {
  shapes: SHAPES.map((s) => s.slug),
  colors: [...COLOR_GRADES, LOWER_COLORS, FANCY],
  hues: FANCY_HUES,
  clarities: CLARITY_GRADES,
  cuts: CUT_GRADES,
  polishes: CUT_GRADES,
  symmetries: CUT_GRADES,
  fluorescences: FLUORESCENCE,
  labs: LABS,
};

const RANGE_PARAM: Record<RangeKey, [string, string]> = {
  carat: ["cmin", "cmax"],
  table: ["tmin", "tmax"],
  depth: ["dmin", "dmax"],
  ratio: ["rmin", "rmax"],
};

/** Only non-default values are written, so an unfiltered sheet has a bare URL. */
export function filtersToParams(filters: Filters, sort: Sort, bounds: Bounds) {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  for (const key of Object.keys(PARAM) as ListKey[]) {
    if (filters[key].length) params.set(PARAM[key], filters[key].join(","));
  }
  for (const key of RANGE_KEYS) {
    const [lo, hi] = filters.ranges[key];
    if (lo !== bounds[key][0]) params.set(RANGE_PARAM[key][0], String(lo));
    if (hi !== bounds[key][1]) params.set(RANGE_PARAM[key][1], String(hi));
  }
  if (sort !== "recommended") params.set("sort", sort);
  return params;
}

/** The inverse of `filtersToParams`; anything unrecognised is dropped rather than trusted. */
export function filtersFromParams(
  params: URLSearchParams,
  bounds: Bounds,
): { filters: Filters; sort: Sort } {
  const filters = emptyFilters(bounds);
  filters.query = (params.get("q") ?? "").slice(0, 80);
  for (const key of Object.keys(PARAM) as ListKey[]) {
    const raw = params.get(PARAM[key]);
    const values = raw ? raw.split(",").filter((v) => ALLOWED[key].includes(v)) : [];
    (filters[key] as string[]) = [...new Set(values)];
  }
  for (const key of RANGE_KEYS) {
    const [lo, hi] = bounds[key];
    const read = (name: string, fallback: number) => {
      const value = Number.parseFloat(params.get(name) ?? "");
      return Number.isFinite(value) ? Math.min(hi, Math.max(lo, value)) : fallback;
    };
    filters.ranges[key] = [read(RANGE_PARAM[key][0], lo), read(RANGE_PARAM[key][1], hi)];
  }
  const sort = (Object.keys(SORTS) as Sort[]).find((key) => key === params.get("sort"));
  return { filters, sort: sort ?? "recommended" };
}

/* ---------------------------------------------------------------- summary */

export const FACET_LABEL: Record<ListKey, string> = {
  shapes: "Shape",
  colors: "Colour",
  hues: "Fancy hue",
  clarities: "Clarity",
  cuts: "Cut",
  polishes: "Polish",
  symmetries: "Symmetry",
  fluorescences: "Fluorescence",
  labs: "Certificate",
};

export const RANGE_LABEL: Record<RangeKey, { label: string; format: (v: number) => string }> = {
  carat: { label: "Carat", format: (v) => `${v.toFixed(2)} ct` },
  table: { label: "Table", format: (v) => `${v}%` },
  depth: { label: "Depth", format: (v) => `${v}%` },
  ratio: { label: "L/W ratio", format: (v) => v.toFixed(2) },
};

export function optionName(key: ListKey, value: string) {
  if (key === "shapes") return SHAPE_BY_SLUG[value as ShapeSlug].name;
  return key === "colors" && value === LOWER_COLORS ? "K–Z" : value;
}

/** Every active constraint as a removable label — used for the pills on screen and the sheet header. */
export function activeFilterList(filters: Filters, bounds: Bounds) {
  const items: { id: string; label: string; key: ListKey | RangeKey | "query"; value?: string }[] = [];
  if (filters.query.trim()) items.push({ id: "q", label: `“${filters.query.trim()}”`, key: "query" });
  for (const key of Object.keys(PARAM) as ListKey[]) {
    for (const value of filters[key]) {
      const name = optionName(key, value);
      items.push({
        id: `${key}:${value}`,
        label: key === "shapes" || key === "labs" ? name : `${FACET_LABEL[key]} ${name}`,
        key,
        value,
      });
    }
  }
  for (const key of RANGE_KEYS) {
    if (!rangeActive(filters, bounds, key)) continue;
    const { label, format } = RANGE_LABEL[key];
    const [lo, hi] = filters.ranges[key];
    items.push({ id: key, label: `${label} ${format(lo)}–${format(hi)}`, key });
  }
  return items;
}

/** One line for the sheet header, so a forwarded copy says what it was filtered to. */
export function describeFilters(filters: Filters, sort: Sort, bounds: Bounds): string {
  const parts = activeFilterList(filters, bounds).map((i) => i.label);
  const scope = parts.length ? `Filtered to ${parts.join("  •  ")}` : "Full catalogue, no filters";
  return `${scope}  •  Sorted ${SORTS[sort].toLowerCase()}`;
}
