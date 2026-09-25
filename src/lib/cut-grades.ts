import type { ShapeSlug } from "./shapes";
import type { CutGrade, Origin } from "./stones";

/**
 * The cut grade scale and the schematic light-path diagrams that illustrate it.
 *
 * Type-only imports from stones.ts on purpose: this module is used by client
 * components, and a value import would pull the whole stone catalogue into the
 * browser bundle.
 *
 * The diagrams are schematic. They show the textbook behaviour of a round
 * brilliant's profile — light returning through the top when the pavilion is
 * well proportioned, escaping through the bottom when it is too shallow and
 * through the opposite side when it is too deep. They are not a simulation,
 * and laboratories do not grade from pictures like these: cut grades come from
 * measuring the stone itself.
 */

/** How a ray leaves the stone in a diagram. */
export type RayFate = "returns" | "leaks-bottom" | "leaks-side";

export type DiagramProfile = {
  /** Culet depth in the 200×170 diagram; the ideal profile sits at 138. */
  culetY: number;
  rays: { x: number; fate: RayFate }[];
};

export type ScaleGrade = {
  /** GIA's grade names; IGI adds "Ideal" above Excellent for rounds. */
  grade: Exclude<CutGrade, "Ideal"> | "Poor";
  description: string;
  diagram: DiagramProfile;
};

export const GIA_CUT_SCALE: ScaleGrade[] = [
  {
    grade: "Excellent",
    description: "Maximum brilliance, fire and scintillation. Proportions return nearly all the light that enters.",
    diagram: { culetY: 138, rays: [{ x: 78, fate: "returns" }, { x: 92, fate: "returns" }] },
  },
  {
    grade: "Very Good",
    description: "Returns most of the light that enters. Close to Excellent face up, usually at a better price.",
    diagram: { culetY: 132, rays: [{ x: 78, fate: "returns" }, { x: 94, fate: "returns" }] },
  },
  {
    grade: "Good",
    description: "Returns a good share of light, with some escaping. A solid option where budget leads.",
    diagram: { culetY: 120, rays: [{ x: 78, fate: "returns" }, { x: 94, fate: "leaks-bottom" }] },
  },
  {
    grade: "Fair",
    description: "Noticeably less brilliance. Proportions let light escape through the sides or the bottom.",
    diagram: { culetY: 158, rays: [{ x: 80, fate: "leaks-side" }, { x: 94, fate: "returns" }] },
  },
  {
    grade: "Poor",
    description: "Significant light loss. The stone looks dull or dark in areas, even in good light.",
    diagram: { culetY: 106, rays: [{ x: 76, fate: "leaks-bottom" }, { x: 92, fate: "leaks-bottom" }] },
  },
];

/** The three things a cut grade weighs, in the terms stock listings use. */
export const CUT_COMPONENTS = [
  {
    term: "Proportions",
    listing: "Cut",
    detail: "Table %, depth %, and the crown and pavilion angles — how the shape is built to return light.",
  },
  {
    term: "Symmetry",
    listing: "Symmetry",
    detail: "How precisely the facets are aligned, placed and matched to each other and to the outline.",
  },
  {
    term: "Polish",
    listing: "Polish",
    detail: "The smoothness of every facet surface: no drag lines, burn marks or nicks.",
  },
] as const;

/** Grades the finder offers — the ones stock actually carries. */
export const SHOPPABLE_CUTS: CutGrade[] = ["Ideal", "Excellent", "Very Good", "Good"];

export function cutCatalogueHref(origin: Origin, grade?: CutGrade, shape?: ShapeSlug) {
  const params = new URLSearchParams();
  if (shape) params.set("shape", shape);
  // A cut grade only exists for rounds, so it is only ever applied to them.
  if (grade && (!shape || shape === "round")) params.set("cut", grade);
  const base = origin === "natural" ? "/natural-diamonds" : "/lab-grown-diamonds";
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function cutEnquiryHref(grade?: CutGrade, shape?: ShapeSlug) {
  const params = new URLSearchParams();
  if (shape) params.set("shape", shape);
  if (grade && (!shape || shape === "round")) params.set("cut", grade);
  return `/contact?${params.toString()}#enquiry`;
}
