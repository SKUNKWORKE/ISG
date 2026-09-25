import type { ShapeSlug } from "./shapes";
import type { Origin } from "./stones";

/**
 * Approximate face-up dimensions by carat weight, for the carat size chart.
 *
 * Rounds use the widely published reference figures directly. Every other
 * shape is estimated with the trade's weight-estimation formula,
 *
 *   carat ≈ length × width × depth (mm) × shape factor
 *
 * solved for length at a typical length-to-width ratio and depth percentage.
 * The same formula reproduces the round reference figures to within 0.1 mm.
 * Real stones vary with proportions — a deep stone faces up smaller for its
 * weight — which is why every report gives measurements, and why the chart
 * says "approximate".
 */

type SizeModel = {
  /** Length ÷ width, face up. */
  ratio: number;
  /** Total depth as a fraction of width. */
  depth: number;
  /** Shape factor from the weight-estimation formula. */
  factor: number;
  /**
   * The region of the 100×100 glyph the girdle outline occupies, as
   * [x, y, width, height]. Cropping the glyph to it lets a silhouette be
   * stretched to true length × width without empty margins skewing the scale.
   */
  box: [number, number, number, number];
};

export const SIZE_MODELS: Record<ShapeSlug, SizeModel> = {
  round: { ratio: 1, depth: 0.615, factor: 0.0061, box: [10, 10, 80, 80] },
  princess: { ratio: 1, depth: 0.7, factor: 0.0083, box: [12, 12, 76, 76] },
  cushion: { ratio: 1.05, depth: 0.65, factor: 0.0081, box: [10, 10, 80, 80] },
  emerald: { ratio: 1.45, depth: 0.66, factor: 0.0092, box: [14, 6, 72, 88] },
  oval: { ratio: 1.4, depth: 0.61, factor: 0.0062, box: [22, 8, 56, 84] },
  pear: { ratio: 1.6, depth: 0.6, factor: 0.0059, box: [22, 6, 56, 86] },
  marquise: { ratio: 2, depth: 0.58, factor: 0.0058, box: [24, 8, 52, 84] },
  radiant: { ratio: 1.2, depth: 0.66, factor: 0.0081, box: [14, 6, 72, 88] },
  asscher: { ratio: 1, depth: 0.66, factor: 0.008, box: [8, 8, 84, 84] },
  heart: { ratio: 1, depth: 0.6, factor: 0.0059, box: [16, 20, 68, 72] },
  trillion: { ratio: 1, depth: 0.45, factor: 0.0057, box: [12, 12, 76, 74] },
  // No accepted standard for this cut yet; the least certain estimate here.
  hexagon: { ratio: 1.12, depth: 0.62, factor: 0.0075, box: [15, 12, 70, 76] },
};

/** The weights the chart shows — and the milestones where price steps up. */
export const CHART_CARATS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3] as const;

const ROUND_REFERENCE: Record<number, number> = {
  0.25: 4.1,
  0.5: 5.1,
  0.75: 5.8,
  1: 6.4,
  1.5: 7.3,
  2: 8.1,
  3: 9.3,
};

export type FaceUp = { length: number; width: number };

export function faceUpAtDepth(shape: ShapeSlug, carat: number, depth: number): FaceUp {
  const { ratio, factor } = SIZE_MODELS[shape];
  const length = Math.cbrt((carat * ratio ** 2) / (depth * factor));
  return { length, width: length / ratio };
}

export function faceUpSize(shape: ShapeSlug, carat: number): FaceUp {
  const reference = shape === "round" ? ROUND_REFERENCE[carat] : undefined;
  if (reference) return { length: reference, width: reference };
  return faceUpAtDepth(shape, carat, SIZE_MODELS[shape].depth);
}

export function formatFaceUp({ length, width }: FaceUp): string {
  const l = length.toFixed(1);
  const w = width.toFixed(1);
  return l === w ? `${l} mm` : `${l} × ${w} mm`;
}

/** Face-up length and width from a report's "7.22 x 7.24 x 4.53 mm". */
export function parseMeasurements(measurements: string): FaceUp | undefined {
  const [a, b] = measurements.split(/\s*x\s*/i).map((part) => Number.parseFloat(part));
  if (!Number.isFinite(a) || !Number.isFinite(b)) return undefined;
  return { length: Math.max(a, b), width: Math.min(a, b) };
}

/** A chart weight's trade band: from that weight up to just under the next milestone. */
export function caratBand(carat: number): [number, number | undefined] {
  const weights = CHART_CARATS as readonly number[];
  const next = weights[weights.indexOf(carat) + 1];
  return [carat, next === undefined ? undefined : Math.round((next - 0.01) * 100) / 100];
}

export function formatCaratBand(carat: number): string {
  const [lo, hi] = caratBand(carat);
  return hi === undefined ? `${lo.toFixed(2)} ct and above` : `${lo.toFixed(2)}–${hi.toFixed(2)} ct`;
}

/** The catalogue, opened on a shape and (optionally) a chart weight's band. */
export function catalogueHref(origin: Origin, shape?: ShapeSlug, carat?: number): string {
  const params = new URLSearchParams();
  if (shape) params.set("shape", shape);
  if (carat !== undefined) {
    const [lo, hi] = caratBand(carat);
    params.set("cmin", lo.toFixed(2));
    if (hi !== undefined) params.set("cmax", hi.toFixed(2));
  }
  const base = origin === "natural" ? "/natural-diamonds" : "/lab-grown-diamonds";
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}
