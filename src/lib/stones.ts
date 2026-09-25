import type { ShapeSlug } from "./shapes";
import { REAL_LAB_STONES } from "./real-stones";
import { REAL_NATURAL_STONES } from "./real-natural-stones";

export type Origin = "natural" | "lab";

export type Stone = {
  /** The supplier's own reference ("TP-280626-3329", "OM-1026"). */
  sku: string;
  shape: ShapeSlug;
  shapeName: string;
  shapeCode: string;
  origin: Origin;
  carat: number;
  /** A D–J grade, or a fancy-colour description ("Fancy Vivid Blue") — no fixed scale covers both. */
  color: ColorGrade | FancyColor;
  clarity: ClarityGrade;
  /** Round brilliants only — IGI/GIA don't issue an overall cut grade for fancy shapes. */
  cut?: CutGrade;
  polish: CutGrade;
  symmetry: CutGrade;
  fluorescence: Fluorescence;
  lab: Lab;
  /** "6.48 x 6.51 x 4.01 mm" */
  measurements: string;
  tablePercent: number;
  depthPercent: number;
  featured: boolean;
};

export const COLOR_GRADES = ["D", "E", "F", "G", "H", "I", "J"] as const;
export const CLARITY_GRADES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2"] as const;
export const CUT_GRADES = ["Excellent", "Very Good", "Good", "Fair", "Ideal"] as const;
export const LABS = ["GIA", "IGI"] as const;
export const FLUORESCENCE = ["None", "Faint", "Very Slight", "Slight", "Medium", "Strong"] as const;

export type ColorGrade = (typeof COLOR_GRADES)[number];
export type ClarityGrade = (typeof CLARITY_GRADES)[number];
export type CutGrade = (typeof CUT_GRADES)[number];
export type Lab = (typeof LABS)[number];
export type Fluorescence = (typeof FLUORESCENCE)[number];
/** Free-form, like `shapeName` — fancy-colour wording ("Fancy Intense Yellowish Brown")
 *  isn't a closed scale the way D–J or a clarity grade is. */
export type FancyColor = string;

export function isColorGrade(color: ColorGrade | FancyColor): color is ColorGrade {
  return (COLOR_GRADES as readonly string[]).includes(color);
}

/**
 * Shown once at the top of each catalogue. Stock lists are static files, so
 * availability can lag behind the trade desk.
 */
export const INVENTORY_NOTICE = "Current availability is confirmed on enquiry.";

export const NATURAL_STONES: Stone[] = REAL_NATURAL_STONES;
export const LAB_STONES: Stone[] = REAL_LAB_STONES;

export const ALL_STONES: Stone[] = [...NATURAL_STONES, ...LAB_STONES];

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
  return ALL_STONES.find((s) => s.sku === sku);
}

export function countByShape(stones: Stone[]): Record<string, number> {
  return stones.reduce<Record<string, number>>((acc, s) => {
    acc[s.shape] = (acc[s.shape] ?? 0) + 1;
    return acc;
  }, {});
}

/**
 * Sortable intake key from a supplier SKU — "TP-070926-3399" is 7 Sep 2026, serial 3399.
 * Other references carry no date and return 0, so they sort after dated stock.
 */
export function addedKey(stone: Stone): number {
  const short = /^TP-(\d{2})(\d{2})(\d{2})-+(\d+)/.exec(stone.sku);
  if (short) {
    const [, dd, mm, yy, serial] = short;
    return Number(`20${yy}${mm}${dd}`) * 1e5 + Number(serial);
  }
  const long = /^TP-(\d{2})(\d{2})(\d{4})-+(\d+)/.exec(stone.sku);
  if (long) {
    const [, dd, mm, yyyy, serial] = long;
    return Number(`${yyyy}${mm}${dd}`) * 1e5 + Number(serial);
  }
  return 0;
}
