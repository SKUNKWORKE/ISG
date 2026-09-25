import type { ClarityGrade, ColorGrade, CutGrade } from "./stones";

/**
 * The 4Cs calculator's model. Educational, not a quote.
 *
 * The price index is a stylised picture of how natural diamond prices usually
 * move with each C, relative to a 1.00 ct, G, VS2, Excellent reference (= 100).
 * The multipliers are rounded approximations of typical trade price-list
 * relationships, not our prices and not any published list:
 *
 *  - Carat: price per carat steps up at the weight milestones, so total price
 *    rises faster than weight, and jumps at 0.50, 0.70, 1.00, 1.50, 2.00 …
 *  - Colour and clarity: each grade up costs more, with the steps widening
 *    towards D and FL.
 *  - Cut: only rounds carry a cut grade; lower grades are discounted.
 *
 * Real prices also depend on fluorescence, proportions, the lab, the market
 * week and, for lab-grown stones, a much flatter curve at a far lower level.
 * The page says so wherever the index appears.
 *
 * Type-only imports: stones.ts values would pull the catalogue into the browser.
 */

export const CALC_COLORS: ColorGrade[] = ["D", "E", "F", "G", "H", "I", "J"];
export const CALC_CLARITIES: ClarityGrade[] = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2"];
export const CALC_CUTS: CutGrade[] = ["Excellent", "Very Good", "Good", "Fair"];

export const CARAT_MIN = 0.3;
export const CARAT_MAX = 5;

/** Weight bands: [from, price-per-carat multiplier]. A band runs to the next one's start. */
export const CARAT_BANDS: [number, number][] = [
  [0.3, 0.42],
  [0.4, 0.5],
  [0.5, 0.62],
  [0.7, 0.78],
  [0.9, 0.88],
  [1, 1],
  [1.5, 1.38],
  [2, 1.9],
  [3, 2.75],
  [4, 3.1],
  [5, 3.8],
];

/** Where the price per carat steps up: the weights worth landing just under. */
export const MILESTONES = [0.5, 0.7, 1, 1.5, 2, 3, 4, 5];

const COLOR_FACTOR: Record<string, number> = { D: 1.45, E: 1.3, F: 1.18, G: 1, H: 0.88, I: 0.76, J: 0.66 };
const CLARITY_FACTOR: Record<string, number> = {
  FL: 1.9,
  IF: 1.6,
  VVS1: 1.42,
  VVS2: 1.28,
  VS1: 1.13,
  VS2: 1,
  SI1: 0.86,
  SI2: 0.73,
  I1: 0.47,
  I2: 0.32,
};
const CUT_FACTOR: Record<string, number> = { Excellent: 1, "Very Good": 0.88, Good: 0.76, Fair: 0.62 };

export function bandIndex(carat: number): number {
  let index = 0;
  CARAT_BANDS.forEach(([from], i) => {
    if (carat >= from - 1e-9) index = i;
  });
  return index;
}

export type Spec = {
  carat: number;
  color: ColorGrade;
  clarity: ClarityGrade;
  /** Undefined for fancy shapes, which have no cut grade. */
  cut?: CutGrade;
};

export type IndexBreakdown = {
  /** Reference stone = 100. */
  index: number;
  carat: number;
  color: number;
  clarity: number;
  cut: number;
};

export function priceIndex(spec: Spec): IndexBreakdown {
  const carat = CARAT_BANDS[bandIndex(spec.carat)][1] * spec.carat;
  const color = COLOR_FACTOR[spec.color];
  const clarity = CLARITY_FACTOR[spec.clarity];
  const cut = spec.cut ? CUT_FACTOR[spec.cut] : 1;
  return { index: 100 * carat * color * clarity * cut, carat, color, clarity, cut };
}

export const REFERENCE: Spec = { carat: 1, color: "G", clarity: "VS2", cut: "Excellent" };

/* ------------------------------------------------------------ rarity */

/**
 * Stock counts, bucketed so the browser gets a few hundred numbers rather than
 * the catalogue: "shape|colourIndex|clarityIndex|bandIndex" → count, per origin.
 * D–J stones only; fancy colours sit outside the scale.
 */
export type StockCube = Record<"natural" | "lab", Record<string, number>>;

export function cubeKey(shape: string, color: number, clarity: number, band: number) {
  return `${shape}|${color}|${clarity}|${band}`;
}

/** Stones at this spec or better (bigger, whiter, cleaner), and the pool they came from. */
export function rarity(
  cube: Record<string, number>,
  spec: Spec,
  shape: string | undefined,
): { matching: number; pool: number } {
  const c = CALC_COLORS.indexOf(spec.color);
  const q = CALC_CLARITIES.indexOf(spec.clarity);
  const b = bandIndex(spec.carat);
  let matching = 0;
  let pool = 0;
  for (const [key, count] of Object.entries(cube)) {
    const [s, ci, qi, bi] = key.split("|");
    if (shape && s !== shape) continue;
    pool += count;
    if (Number(ci) <= c && Number(qi) <= q && Number(bi) >= b) matching += count;
  }
  return { matching, pool };
}
