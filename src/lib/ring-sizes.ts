/**
 * Ring size conversion, computed rather than tabulated so every system agrees
 * with every other one.
 *
 *  - US/Canada: inside diameter (mm) = 11.63 + 0.8128 × size, the standard
 *    linear scale (US 7 = 17.3 mm, matching the "17.30 mm" our ring specs quote).
 *  - UK/Australia: BS 6820 letters, 1.25 mm of circumference per letter from a
 *    37.5 mm base, in half steps (US 7 = N½).
 *  - Europe: ISO 8653, where the size is the inside circumference in mm.
 *
 * Charts from different jewellers disagree by up to half a size at the edges,
 * which is why the page asks for millimetres when in doubt and why a size is
 * confirmed before anything is made.
 */

export const US_MIN = 3;
export const US_MAX = 13;
export const DIAMETER_MIN = 14;
export const DIAMETER_MAX = 23;

const UK_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export type RingSize = {
  /** Nearest quarter size. */
  us: number;
  uk: string;
  eu: number;
  diameter: number;
  circumference: number;
};

export function diameterForUs(us: number): number {
  return 11.63 + 0.8128 * us;
}

export function usForDiameter(diameter: number): number {
  return Math.round(((diameter - 11.63) / 0.8128) * 4) / 4;
}

export function ukForCircumference(circumference: number): string {
  const steps = Math.round(((circumference - 37.5) / 1.25) * 2) / 2;
  const index = Math.floor(steps);
  if (index < 0) return "Below A";
  if (index >= UK_LETTERS.length) return `Z+${Math.round((steps - 25) * 2) / 2}`;
  return `${UK_LETTERS[index]}${steps % 1 ? "½" : ""}`;
}

/** "N½" → 54.69 mm. */
export function circumferenceForUk(letter: string): number | undefined {
  const index = UK_LETTERS.indexOf(letter.charAt(0));
  if (index === -1) return undefined;
  return 37.5 + 1.25 * (index + (letter.endsWith("½") ? 0.5 : 0));
}

export function sizeFromDiameter(diameter: number): RingSize {
  const circumference = Math.PI * diameter;
  return {
    us: usForDiameter(diameter),
    uk: ukForCircumference(circumference),
    eu: Math.round(circumference),
    diameter,
    circumference,
  };
}

export function sizeFromUs(us: number): RingSize {
  return { ...sizeFromDiameter(diameterForUs(us)), us };
}

export function sizeFromCircumference(circumference: number): RingSize {
  return sizeFromDiameter(circumference / Math.PI);
}

/** "7", "6½", "6¼", "6¾". */
export function formatUs(us: number): string {
  const whole = Math.floor(us);
  const frac = us - whole;
  const glyph = frac === 0.25 ? "¼" : frac === 0.5 ? "½" : frac === 0.75 ? "¾" : "";
  return `${whole}${glyph}`;
}

/** US sizes offered when ordering: 3 to 13 in quarter steps. */
export const ORDER_SIZES: number[] = Array.from(
  { length: (US_MAX - US_MIN) * 4 + 1 },
  (_, i) => US_MIN + i / 4,
);

/** The printed chart: half sizes keep it readable. */
export const CHART_SIZES: RingSize[] = Array.from(
  { length: (US_MAX - US_MIN) * 2 + 1 },
  (_, i) => sizeFromUs(US_MIN + i / 2),
);

export function parseUsSize(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n) || n < US_MIN || n > US_MAX) return undefined;
  return Math.round(n * 4) / 4;
}
