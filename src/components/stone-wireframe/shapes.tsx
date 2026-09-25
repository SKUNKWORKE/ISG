"use client";

import type { ComponentType } from "react";
import type { WireframeShape } from "@/lib/wireframe-shapes";
import { getStoneGeometry, type StoneGeometry } from "./geometry";

export type WireframeProps = { color: string };

/**
 * Hidden-line wireframe: an invisible solid writes depth, near edges draw at
 * full strength against it, and every edge draws again faintly with no depth
 * test so the far side of the stone reads through.
 */
function FacetedWireframe({ geometry, color }: WireframeProps & { geometry: StoneGeometry }) {
  return (
    <group>
      <mesh geometry={geometry.solid} dispose={null}>
        <meshBasicMaterial colorWrite={false} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </mesh>
      <lineSegments geometry={geometry.edges} renderOrder={1} dispose={null}>
        <lineBasicMaterial color={color} />
      </lineSegments>
      <lineSegments geometry={geometry.edges} renderOrder={2} dispose={null}>
        <lineBasicMaterial color={color} transparent opacity={0.16} depthTest={false} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export function RoundWireframe(props: WireframeProps) {
  return <FacetedWireframe {...props} geometry={getStoneGeometry("round")} />;
}

export function PrincessWireframe(props: WireframeProps) {
  return <FacetedWireframe {...props} geometry={getStoneGeometry("princess")} />;
}

export function CushionWireframe(props: WireframeProps) {
  return <FacetedWireframe {...props} geometry={getStoneGeometry("cushion")} />;
}

export function EmeraldWireframe(props: WireframeProps) {
  return <FacetedWireframe {...props} geometry={getStoneGeometry("emerald")} />;
}

export function OvalWireframe(props: WireframeProps) {
  return <FacetedWireframe {...props} geometry={getStoneGeometry("oval")} />;
}

export function PearWireframe(props: WireframeProps) {
  return <FacetedWireframe {...props} geometry={getStoneGeometry("pear")} />;
}

export function MarquiseWireframe(props: WireframeProps) {
  return <FacetedWireframe {...props} geometry={getStoneGeometry("marquise")} />;
}

export function RadiantWireframe(props: WireframeProps) {
  return <FacetedWireframe {...props} geometry={getStoneGeometry("radiant")} />;
}

export function AsscherWireframe(props: WireframeProps) {
  return <FacetedWireframe {...props} geometry={getStoneGeometry("asscher")} />;
}

export function HeartWireframe(props: WireframeProps) {
  return <FacetedWireframe {...props} geometry={getStoneGeometry("heart")} />;
}

export function TrillionWireframe(props: WireframeProps) {
  return <FacetedWireframe {...props} geometry={getStoneGeometry("trillion")} />;
}

export function HexagonWireframe(props: WireframeProps) {
  return <FacetedWireframe {...props} geometry={getStoneGeometry("hexagon")} />;
}

export const WIREFRAMES: Record<WireframeShape, ComponentType<WireframeProps>> = {
  round: RoundWireframe,
  princess: PrincessWireframe,
  cushion: CushionWireframe,
  emerald: EmeraldWireframe,
  oval: OvalWireframe,
  pear: PearWireframe,
  marquise: MarquiseWireframe,
  radiant: RadiantWireframe,
  asscher: AsscherWireframe,
  heart: HeartWireframe,
  trillion: TrillionWireframe,
  hexagon: HexagonWireframe,
};
