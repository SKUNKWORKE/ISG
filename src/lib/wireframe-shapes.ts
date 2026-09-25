import type { ShapeSlug } from "./shapes";

/**
 * Shapes that have a procedural 3D wireframe. Kept free of any three.js import
 * so the enquiry drawer can check support without pulling the 3D bundle in.
 */
export const WIREFRAME_SHAPES = [
  "round",
  "princess",
  "cushion",
  "emerald",
  "oval",
  "pear",
  "marquise",
  "radiant",
  "asscher",
  "heart",
  "trillion",
  "hexagon",
] as const satisfies readonly ShapeSlug[];

export type WireframeShape = (typeof WIREFRAME_SHAPES)[number];

export function hasWireframe(shape: string): shape is WireframeShape {
  return (WIREFRAME_SHAPES as readonly string[]).includes(shape);
}
