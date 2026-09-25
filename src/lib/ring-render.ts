import { SIZE_MODELS, type FaceUp } from "./carat-size";
import type { SettingStyle } from "./ring-builder";
import { diameterForUs } from "./ring-sizes";
import type { ShapeSlug } from "./shapes";

/**
 * Geometry for the builder's live drawing of the ring.
 *
 * Everything here is in millimetres, in a space whose origin is the centre of
 * the finger hole, with y increasing downwards as SVG does. Every part of the
 * drawing is therefore to scale against every other part: a 1 ct round really
 * does cover that much of the band it sits on.
 *
 * The frame is fitted to the ring rather than fixed, because the stock runs
 * from a quarter carat to twenty-two, and one frame that held the largest
 * would leave the ordinary ones as specks. Scale is carried by a labelled bar
 * instead, the way a map does it, so the drawing stays readable at any size
 * and still says exactly how big it is.
 *
 * It is a jeweller's sketch, not a render. The band is drawn at the chosen
 * finger size and the centre stone at its measured face-up size; the head,
 * halo and side stones are indicative of the style, since the head is cut to
 * fit the stone once the ring is ordered. The caption in the UI says so.
 */

/** Radial thickness of the shank — a typical engagement band. */
const SHANK = 1.4;

/** Gap between the top of the shank and the girdle, where the basket sits. */
const BASKET = 0.35;

/** The size drawn when the buyer hasn't chosen one yet. */
export const DEFAULT_US = 7;

export type Point = { x: number; y: number };

export type Frame = { x: number; y: number; width: number; height: number };

export type StonePlacement = {
  shape: ShapeSlug;
  /** Centre of the girdle. */
  cx: number;
  cy: number;
  width: number;
  length: number;
};

export type RingLayout = {
  /** Inside diameter of the band, in millimetres. */
  inner: number;
  /** Outside diameter of the band. */
  outer: number;
  centre: StonePlacement;
  /** Claws over the girdle. */
  prongs: Point[];
  prongRadius: number;
  /** Halo stones around the girdle, empty unless the style has one. */
  halo: { at: Point[]; radius: number };
  /** True when the halo sits under the girdle and is only glimpsed from above. */
  haloHidden: boolean;
  /** Flanking stones, empty unless the style has them. */
  sides: StonePlacement[];
  /** The head that carries the stone up off the shank, as a filled outline. */
  basket: string;
};

/** A point on the ellipse through the girdle, at `deg` clockwise from 3 o'clock. */
function onGirdle(stone: StonePlacement, deg: number, grow = 0): Point {
  const t = (deg * Math.PI) / 180;
  return {
    x: stone.cx + (stone.width / 2 + grow) * Math.cos(t),
    y: stone.cy + (stone.length / 2 + grow) * Math.sin(t),
  };
}

/** Ramanujan's approximation — good to a fraction of a percent at these ratios. */
function ellipsePerimeter(a: number, b: number): number {
  const h = ((a - b) * (a - b)) / ((a + b) * (a + b));
  return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
}

/**
 * Where the claws go. Four at the quarters is the common solitaire head; a
 * round is as often held in six, and a marquise or pear needs a claw over each
 * point, which is where they chip.
 */
function prongAngles(shape: ShapeSlug): number[] {
  if (shape === "round") return [30, 90, 150, 210, 270, 330];
  if (shape === "marquise" || shape === "pear" || shape === "heart") return [90, 200, 270, 340];
  return [45, 135, 225, 315];
}

export function ringLayout({
  shape,
  stone,
  style,
  us = DEFAULT_US,
}: {
  shape: ShapeSlug;
  stone: FaceUp;
  style: SettingStyle | null;
  us?: number;
}): RingLayout {
  const inner = diameterForUs(us);
  const outer = inner + 2 * SHANK;

  const halo = style === "halo" || style === "hidden-halo";
  const haloRadius = Math.max(0.42, Math.min(0.78, stone.width * 0.085));
  /*
    Where the halo's centres sit, measured outward from the girdle. A visible
    halo rings it, each stone just clear of the edge. A hidden halo is set
    below the girdle plane, so from directly above its centres are *inside* the
    outline and only a crescent of each stone shows past it — which is the
    whole point of the setting, and why it reads as a plain solitaire from the
    top and a haloed one from the side.
  */
  const haloOffset = halo ? (style === "halo" ? haloRadius : -haloRadius * 0.35) : 0;

  // How far past the girdle anything reaches, so the stone clears the shank.
  const reach = halo ? Math.max(0, haloOffset + haloRadius) : 0;
  const centre: StonePlacement = {
    shape,
    cx: 0,
    cy: -(outer / 2 + BASKET + reach + stone.length / 2),
    width: stone.width,
    length: stone.length,
  };

  const box = SIZE_MODELS[shape];
  const sideWidth = stone.width * 0.52;
  const sides: StonePlacement[] =
    style === "three-stone"
      ? [-1, 1].map((dir) => ({
          shape,
          cx: dir * (stone.width / 2 + sideWidth / 2 + 0.35),
          cy: centre.cy,
          width: sideWidth,
          length: sideWidth * box.ratio,
        }))
      : [];

  let haloAt: Point[] = [];
  if (halo) {
    const a = stone.width / 2 + haloOffset;
    const b = stone.length / 2 + haloOffset;
    const count = Math.max(12, Math.min(30, Math.round(ellipsePerimeter(a, b) / (haloRadius * 2.15))));
    haloAt = Array.from({ length: count }, (_, i) =>
      onGirdle({ ...centre, width: a * 2, length: b * 2 }, (i * 360) / count),
    );
  }

  // The head, as a plain taper from the shoulders up to the girdle. Its top
  // runs past the girdle so the stone is painted over it and the join is
  // hidden, which is what a basket looks like from directly above. A
  // three-stone head has to carry all three, so it spans the whole trio.
  const span = sides.length
    ? Math.max(...sides.map((s) => Math.abs(s.cx) + s.width / 2))
    : stone.width / 2;
  const foot = Math.min(span, outer * 0.24);
  const shoulder = span * 0.84;
  const basket =
    `M${-foot.toFixed(3)} ${(-outer / 2 + 0.2).toFixed(3)}` +
    `L${-shoulder.toFixed(3)} ${centre.cy.toFixed(3)}` +
    `L${shoulder.toFixed(3)} ${centre.cy.toFixed(3)}` +
    `L${foot.toFixed(3)} ${(-outer / 2 + 0.2).toFixed(3)}Z`;

  return {
    inner,
    outer,
    centre,
    basket,
    prongs: prongAngles(shape).map((deg) => onGirdle(centre, deg, -0.12)),
    prongRadius: Math.max(0.36, Math.min(0.62, stone.width * 0.075)),
    halo: { at: haloAt, radius: haloRadius },
    haloHidden: style === "hidden-halo",
    sides,
  };
}

/** Everything drawn, as boxes, so the frame can be fitted around the lot. */
function extents(layout: RingLayout): { x: number; y: number }[] {
  const R = layout.outer / 2;
  const corners = ({ cx, cy, width, length }: StonePlacement) => [
    { x: cx - width / 2, y: cy - length / 2 },
    { x: cx + width / 2, y: cy + length / 2 },
  ];
  return [
    { x: -R, y: -R },
    { x: R, y: R },
    ...corners(layout.centre),
    ...layout.sides.flatMap(corners),
    ...layout.halo.at.flatMap((p) => [
      { x: p.x - layout.halo.radius, y: p.y - layout.halo.radius },
      { x: p.x + layout.halo.radius, y: p.y + layout.halo.radius },
    ]),
  ];
}

/**
 * The viewBox fitted around the ring, with room under it for the scale bar.
 * Margins are a share of the drawing rather than a fixed number of
 * millimetres, so a small ring and a large one are framed alike.
 */
export function ringFrame(layout: RingLayout): Frame {
  const points = extents(layout);
  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));

  const pad = Math.max(maxX - minX, maxY - minY) * 0.05;
  const footer = Math.max(maxX - minX, maxY - minY) * 0.12;
  return {
    x: minX - pad,
    y: minY - pad,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad + footer,
  };
}

/** A round number of millimetres, about a quarter of the frame across. */
export function scaleBarMm(frame: Frame): number {
  const target = frame.width * 0.25;
  return [1, 2, 5, 10, 20, 50].reduce((best, step) =>
    Math.abs(step - target) < Math.abs(best - target) ? step : best,
  );
}

/**
 * The transform that maps a glyph's 100×100 drawing onto a placement, cropped
 * to the girdle box so the silhouette reaches true length and width with no
 * empty margin skewing the scale. Strokes must be non-scaling: the scale is
 * deliberately not uniform.
 */
export function glyphTransform(place: StonePlacement): string {
  const [bx, by, bw, bh] = SIZE_MODELS[place.shape].box;
  const sx = place.width / bw;
  const sy = place.length / bh;
  const x = place.cx - place.width / 2;
  const y = place.cy - place.length / 2;
  return `translate(${x.toFixed(3)} ${y.toFixed(3)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${-bx} ${-by})`;
}

/**
 * The arc the engraving runs along: the inside of the band across its lower
 * half, left to right, which is the face you read when the ring is off the
 * finger and turned towards you.
 */
export function engravingPath(inner: number): string {
  const r = inner / 2 - 0.45;
  const from = (150 * Math.PI) / 180;
  const to = (30 * Math.PI) / 180;
  const p = (t: number) => `${(r * Math.cos(t)).toFixed(3)} ${(r * Math.sin(t)).toFixed(3)}`;
  // Sweep 0 runs 150° → 90° → 30°, passing through the bottom of the ring.
  return `M${p(from)} A ${r.toFixed(3)} ${r.toFixed(3)} 0 0 0 ${p(to)}`;
}

/**
 * How deep into the hole the inner surface of the band shows.
 *
 * Drawn as a ring stroked down the middle of that depth and faded out towards
 * the top, which is what you see looking through a ring: the far inside wall,
 * brightest across the bottom where it faces you, gone by the time it turns
 * away at the top. Stroking only the bottom arc instead leaves two cut ends
 * sitting in mid-air.
 */
export const WALL = 2;

/** Engraving set smaller as it gets longer, so a long message still fits the arc. */
export function engravingSize(text: string, inner: number): number {
  const arc = ((inner / 2 - 0.45) * 2 * Math.PI) / 3;
  return Math.max(0.62, Math.min(1.05, (arc / Math.max(text.length, 1)) * 1.45));
}
