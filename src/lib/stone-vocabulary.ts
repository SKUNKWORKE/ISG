import type { ShapeSlug } from "./shapes";

/**
 * Loose stones — types, grading vocabulary and small helpers only. The stock
 * lists live in stones.ts, which is server-only because of its size (tens of
 * thousands of stones). Client components import from here; stones.ts
 * re-exports all of it, so server code can keep importing from there.
 */

export type Origin = "natural" | "lab";

export type Stone = {
  /** The supplier's own reference ("TP-280626-3329", "OM-1026", "SSD228811"). */
  sku: string;
  shape: ShapeSlug;
  shapeName: string;
  shapeCode: string;
  origin: Origin;
  carat: number;
  /**
   * A D–J grade, a letter below that range ("K", or a GIA range like "W-X"), or
   * a fancy-colour description ("Fancy Vivid Blue") — no fixed scale covers all three.
   */
  color: ColorGrade | FancyColor;
  clarity: ClarityGrade;
  /** Round brilliants only — IGI/GIA don't issue an overall cut grade for fancy shapes. */
  cut?: CutGrade;
  polish: CutGrade;
  symmetry: CutGrade;
  /** Left out where the supplier's list doesn't state it, rather than guessed. */
  fluorescence?: Fluorescence;
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
export const FLUORESCENCE = ["None", "Faint", "Very Slight", "Slight", "Medium", "Strong", "Very Strong"] as const;

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

/** K to Z: the same letter scale as D–J, further down it. GIA grades W–Z as ranges ("W-X"). */
export function isLowerColor(color: ColorGrade | FancyColor): boolean {
  return /^[K-Z](-[K-Z])?$/.test(color);
}

/**
 * Shown once at the top of each catalogue. Stock lists are static files, so
 * availability can lag behind the trade desk.
 */
export const INVENTORY_NOTICE = "Current availability is confirmed on enquiry.";

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
