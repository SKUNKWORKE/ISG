"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { DiamondRotation } from "./diamond-rotation";
import type { Stone } from "@/lib/stones";
import { hasWireframe } from "@/lib/wireframe-shapes";

// three.js only downloads when a drawer for a supported shape actually opens.
const StoneWireframeViewer = dynamic(
  () => import("./stone-wireframe/viewer").then((m) => m.StoneWireframeViewer),
  { ssr: false, loading: () => <ViewerPlaceholder /> },
);

/** The stone's 3D wireframe, or the rotation video for shapes without one. */
export function StoneModel({ stone, label }: { stone: Stone; label: string }) {
  const shape = stone.shape;
  const supported = hasWireframe(shape);

  useEffect(() => {
    if (!supported) {
      console.warn(
        `[StoneModel] No wireframe for shape "${shape}" (SKU ${stone.sku}); showing the rotation video instead.`,
      );
    }
  }, [supported, shape, stone.sku]);

  if (!supported) return <DiamondRotation label={label} />;
  return <StoneWireframeViewer shape={shape} label={label} />;
}

function ViewerPlaceholder() {
  return (
    <div>
      <div className="flex aspect-square w-full items-end justify-center rounded-[22px] border border-hairline bg-porcelain pb-5">
        <p className="text-[11px] text-ink-muted" aria-live="polite">
          Loading model
        </p>
      </div>
      <div className="mt-3 h-[31px]" />
    </div>
  );
}
