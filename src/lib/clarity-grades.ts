import type { ShapeSlug } from "./shapes";
import type { ClarityGrade, Origin } from "./stones";

/**
 * The FL–I3 clarity scale and the illustrative 10x loupe views that go with it.
 *
 * Type-only imports from stones.ts on purpose: this module is used by client
 * components, and a value import would pull the whole stone catalogue into the
 * browser bundle.
 *
 * The loupe views are drawn, not photographed. They show how inclusions grow
 * in number, size and contrast down the scale, but a grade reflects how
 * visible inclusions are — their size, nature, position and relief — not a
 * count, so no drawing stands in for a real plot.
 */

/** GIA's full scale. The catalogue carries FL to I2 (CLARITY_GRADES in stones.ts). */
export const FULL_SCALE = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"] as const;
export type ScaleClarity = (typeof FULL_SCALE)[number];

/** The grades stock can carry, in scale order. Mirrors CLARITY_GRADES in stones.ts. */
export const STOCKED_CLARITIES = FULL_SCALE.slice(0, 10) as ClarityGrade[];

export type InclusionPattern = {
  pinpoints: number;
  pinpointSize: number;
  feathers: number;
  featherLength: number;
  crystals: number;
  crystalSize: number;
  /** A cluster of tiny pinpoints that reads as haze. */
  cloud: boolean;
  /** 0–1: how dark the inclusions are drawn. */
  contrast: number;
  seed: number;
};

export type ClarityCategory = {
  label: string;
  name: string;
  grades: ScaleClarity[];
  description: string;
  pattern: InclusionPattern;
};

export const CLARITY_CATEGORIES: ClarityCategory[] = [
  {
    label: "FL / IF",
    name: "Flawless / Internally Flawless",
    grades: ["FL", "IF"],
    description:
      "No inclusions visible to a skilled grader at 10x. FL shows no blemishes either; IF may show minor surface blemishes.",
    pattern: { pinpoints: 0, pinpointSize: 0, feathers: 0, featherLength: 0, crystals: 0, crystalSize: 0, cloud: false, contrast: 0, seed: 1 },
  },
  {
    label: "VVS1 / VVS2",
    name: "Very, Very Slightly Included",
    grades: ["VVS1", "VVS2"],
    description: "Inclusions so slight they are extremely difficult for a skilled grader to find at 10x.",
    pattern: { pinpoints: 2, pinpointSize: 0.55, feathers: 0, featherLength: 0, crystals: 0, crystalSize: 0, cloud: false, contrast: 0.35, seed: 7 },
  },
  {
    label: "VS1 / VS2",
    name: "Very Slightly Included",
    grades: ["VS1", "VS2"],
    description: "Minor inclusions, difficult to somewhat easy to see at 10x. Almost never visible to the eye.",
    pattern: { pinpoints: 4, pinpointSize: 0.75, feathers: 1, featherLength: 4, crystals: 0, crystalSize: 0, cloud: false, contrast: 0.5, seed: 21 },
  },
  {
    label: "SI1 / SI2",
    name: "Slightly Included",
    grades: ["SI1", "SI2"],
    description: "Inclusions noticeable at 10x. Sometimes visible to the eye, more often in SI2 and in larger stones.",
    pattern: { pinpoints: 6, pinpointSize: 1, feathers: 2, featherLength: 7, crystals: 2, crystalSize: 2.2, cloud: true, contrast: 0.7, seed: 42 },
  },
  {
    label: "I1 / I2 / I3",
    name: "Included",
    grades: ["I1", "I2", "I3"],
    description: "Inclusions obvious at 10x and usually to the eye. They can affect transparency, brilliance and, at I3, durability.",
    pattern: { pinpoints: 10, pinpointSize: 1.25, feathers: 3, featherLength: 13, crystals: 4, crystalSize: 3.4, cloud: true, contrast: 0.9, seed: 97 },
  },
];

/** Deterministic PRNG, so a drawing is identical on every render. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type InclusionShapes = {
  pinpoints: { x: number; y: number; r: number }[];
  feathers: string[];
  crystals: string[];
};

/** Inclusion marks inside the 100×100 loupe, kept within the stone's girdle (radius 40 about 50,50). */
export function inclusionShapes(p: InclusionPattern): InclusionShapes {
  const rand = mulberry32(p.seed);
  const point = (maxR: number) => {
    const angle = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * maxR;
    return { x: 50 + Math.cos(angle) * r, y: 50 + Math.sin(angle) * r };
  };

  const pinpoints = Array.from({ length: p.pinpoints }, () => ({ ...point(34), r: p.pinpointSize }));
  if (p.cloud) {
    const centre = point(18);
    for (let i = 0; i < 14; i++) {
      pinpoints.push({
        x: centre.x + (rand() - 0.5) * 9,
        y: centre.y + (rand() - 0.5) * 6,
        r: 0.35 + rand() * 0.25,
      });
    }
  }

  const feathers = Array.from({ length: p.feathers }, () => {
    const a = point(28);
    const angle = rand() * Math.PI * 2;
    const bx = a.x + Math.cos(angle) * p.featherLength;
    const by = a.y + Math.sin(angle) * p.featherLength;
    const cx = (a.x + bx) / 2 + (rand() - 0.5) * p.featherLength * 0.6;
    const cy = (a.y + by) / 2 + (rand() - 0.5) * p.featherLength * 0.6;
    return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
  });

  const crystals = Array.from({ length: p.crystals }, (_, i) => {
    // The first crystal in a heavily included stone sits under the table, where it shows most.
    const c = i === 0 && p.crystals > 2 ? point(8) : point(30);
    const s = p.crystalSize * (0.7 + rand() * 0.5);
    const pts = [0, 1, 2, 3].map((k) => {
      const angle = (k / 4) * Math.PI * 2 + rand() * 0.9;
      const r = s * (0.6 + rand() * 0.5);
      return `${(c.x + Math.cos(angle) * r).toFixed(1)} ${(c.y + Math.sin(angle) * r).toFixed(1)}`;
    });
    return `M${pts.join(" L")} Z`;
  });

  return { pinpoints, feathers, crystals };
}

export function clarityCatalogueHref(origin: Origin, grade?: ClarityGrade, shape?: ShapeSlug) {
  const params = new URLSearchParams();
  if (shape) params.set("shape", shape);
  if (grade) params.set("clarity", grade);
  const base = origin === "natural" ? "/natural-diamonds" : "/lab-grown-diamonds";
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function clarityEnquiryHref(grade: ScaleClarity, shape?: ShapeSlug) {
  const params = new URLSearchParams();
  if (shape) params.set("shape", shape);
  params.set("clarity", grade);
  return `/contact?${params.toString()}#enquiry`;
}
