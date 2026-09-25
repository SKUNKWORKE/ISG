import type { ShapeSlug } from "./shapes";
import type { ColorGrade, Origin } from "./stones";

/**
 * The D–Z colour scale for white diamonds, as GIA defined it and IGI also uses.
 *
 * Type-only imports from stones.ts on purpose: this module is used by client
 * components, and a value import would pull the whole stone catalogue into
 * the browser bundle.
 */

export const SCALE = [
  "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
  "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
] as const;

export type ScaleGrade = (typeof SCALE)[number];

/** D–J: the grades the catalogue holds. Mirrors COLOR_GRADES in stones.ts. */
export const STOCKED_GRADES = SCALE.slice(0, 7) as ColorGrade[];

export type ColorCategory = {
  name: string;
  from: ScaleGrade;
  to: ScaleGrade;
  description: string;
};

export const COLOR_CATEGORIES: ColorCategory[] = [
  {
    name: "Colourless",
    from: "D",
    to: "F",
    description: "No colour visible, even to a trained grader. The rarest and most expensive grades.",
  },
  {
    name: "Near colourless",
    from: "G",
    to: "J",
    description: "Colour is difficult to detect face up. The strongest value on the scale.",
  },
  {
    name: "Faint",
    from: "K",
    to: "M",
    description: "Slight warmth, most visible in larger stones and in white metal.",
  },
  {
    name: "Very light",
    from: "N",
    to: "R",
    description: "A noticeable tint.",
  },
  {
    name: "Light",
    from: "S",
    to: "Z",
    description: "A visible yellow or brown tone.",
  },
];

export function categoryOf(grade: ScaleGrade): ColorCategory {
  const index = SCALE.indexOf(grade);
  return (
    COLOR_CATEGORIES.find(
      (c) => index >= SCALE.indexOf(c.from) && index <= SCALE.indexOf(c.to),
    ) ?? COLOR_CATEGORIES[COLOR_CATEGORIES.length - 1]
  );
}

/**
 * An illustrative swatch for a grade. The steps are exaggerated so they read
 * on a screen — between neighbouring grades in a real stone the difference is
 * far subtler — and eased so D–J stay close to white, as they do in life.
 */
export function swatchColor(grade: ScaleGrade): string {
  const t = (SCALE.indexOf(grade) / (SCALE.length - 1)) ** 1.5;
  const from = [251, 252, 254];
  const to = [233, 203, 122];
  const [r, g, b] = from.map((f, i) => Math.round(f + (to[i] - f) * t));
  return `rgb(${r} ${g} ${b})`;
}

export function colorCatalogueHref(origin: Origin, grade?: ColorGrade | "Fancy", shape?: ShapeSlug) {
  const params = new URLSearchParams();
  if (shape) params.set("shape", shape);
  if (grade) params.set("color", grade);
  const base = origin === "natural" ? "/natural-diamonds" : "/lab-grown-diamonds";
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function colorEnquiryHref(grade: ScaleGrade, shape?: ShapeSlug) {
  const params = new URLSearchParams();
  if (shape) params.set("shape", shape);
  params.set("color", grade);
  return `/contact?${params.toString()}#enquiry`;
}
