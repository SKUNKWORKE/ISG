import type { Stone } from "./stones";

/**
 * A shortlisted stone: a snapshot of its specification rather than a bare SKU.
 * Resolving SKUs would mean shipping the whole catalogue to the browser, and
 * the snapshot is only used to compare and to enquire — availability is
 * confirmed on enquiry anyway. A Stone carries no price, so none is stored.
 */
export type ShortlistStone = Omit<Stone, "shapeCode" | "featured">;

/** Enough to keep the compare table readable, on a phone too. */
export const SHORTLIST_LIMIT = 4;

/**
 * Rows of the side-by-side comparison, and which value in each row is best.
 *
 * Scales are restated here rather than imported from stones.ts: a value import
 * from there pulls the whole catalogue into the browser bundle.
 *
 * Only rows with an agreed direction are ranked. Fluorescence, table and depth
 * are shown and flagged when they differ, but never called better or worse —
 * whether they matter depends on the stone, as the guides say.
 */

const COLOR_SCALE = ["D", "E", "F", "G", "H", "I", "J"];
const CLARITY_SCALE = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"];
const FINISH_SCALE = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];

export type CompareRow = {
  label: string;
  value: (s: ShortlistStone) => string;
  /** Lower is better. Undefined means the stone can't be ranked on this row. */
  rank?: (s: ShortlistStone) => number | undefined;
  /** Shown beside the best value(s). */
  bestLabel?: string;
};

const indexIn = (scale: string[]) => (value: string | undefined) => {
  if (!value) return undefined;
  const i = scale.indexOf(value);
  return i === -1 ? undefined : i;
};

const colorRank = indexIn(COLOR_SCALE);
const clarityRank = indexIn(CLARITY_SCALE);
const finishRank = indexIn(FINISH_SCALE);

export const COMPARE_ROWS: CompareRow[] = [
  { label: "Shape", value: (s) => s.shapeName },
  { label: "Origin", value: (s) => (s.origin === "natural" ? "Natural" : "Lab-grown") },
  {
    label: "Carat",
    value: (s) => s.carat.toFixed(2),
    rank: (s) => -s.carat,
    bestLabel: "Largest",
  },
  {
    label: "Colour",
    value: (s) => s.color,
    rank: (s) => colorRank(s.color),
    bestLabel: "Most colourless",
  },
  {
    label: "Clarity",
    value: (s) => s.clarity,
    rank: (s) => clarityRank(s.clarity),
    bestLabel: "Cleanest",
  },
  {
    label: "Cut",
    value: (s) => s.cut ?? "Not graded",
    rank: (s) => finishRank(s.cut),
    bestLabel: "Best cut",
  },
  {
    label: "Polish",
    value: (s) => s.polish,
    rank: (s) => finishRank(s.polish),
    bestLabel: "Best polish",
  },
  {
    label: "Symmetry",
    value: (s) => s.symmetry,
    rank: (s) => finishRank(s.symmetry),
    bestLabel: "Best symmetry",
  },
  { label: "Fluorescence", value: (s) => s.fluorescence },
  { label: "Table", value: (s) => `${s.tablePercent}%` },
  { label: "Depth", value: (s) => `${s.depthPercent}%` },
  { label: "Measurements", value: (s) => s.measurements },
  { label: "Report", value: (s) => s.lab },
  { label: "Price", value: () => "On enquiry" },
  { label: "SKU", value: (s) => s.sku },
];

export type RowResult = {
  row: CompareRow;
  values: string[];
  /** Per stone: is this the best value in the row? */
  best: boolean[];
  differs: boolean;
};

export function compareStones(stones: ShortlistStone[]): RowResult[] {
  return COMPARE_ROWS.map((row) => {
    const values = stones.map(row.value);
    const differs = new Set(values).size > 1;
    let best = stones.map(() => false);

    if (row.rank && differs && stones.length > 1) {
      const ranks = stones.map(row.rank);
      const ranked = ranks.filter((r): r is number => r !== undefined);
      // A "best" needs at least two comparable stones that don't all tie.
      // Fancy colours, for instance, sit outside D–J and can't be ranked against it.
      if (ranked.length >= 2) {
        const top = Math.min(...ranked);
        if (ranked.some((r) => r !== top)) best = ranks.map((r) => r === top);
      }
    }

    return { row, values, best, differs };
  });
}
