"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { WireframeShape } from "@/lib/wireframe-shapes";
import { WIREFRAMES } from "./shapes";

/** After a drag, wait this long before the idle spin picks back up. */
const RESUME_AFTER_MS = 1800;

export function StoneWireframeViewer({ shape, label }: { shape: WireframeShape; label: string }) {
  const Wireframe = WIREFRAMES[shape];
  const frameRef = useRef<HTMLDivElement | null>(null);
  const resumeRef = useRef<number | undefined>(undefined);
  const [color, setColor] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [dragging, setDragging] = useState(false);

  // Always starts spinning, even under prefers-reduced-motion: Windows Server,
  // RDP and power-saving setups report it by default, which left the model
  // frozen for those visitors. The Pause button stays available.
  useEffect(() => {
    // Lines take the site's ink colour from CSS rather than a second hard-coded copy.
    if (frameRef.current) setColor(getComputedStyle(frameRef.current).color);
    return () => window.clearTimeout(resumeRef.current);
  }, []);

  return (
    <div>
      <div
        ref={frameRef}
        role="img"
        aria-label={`Wireframe model of ${label}`}
        data-wireframe-viewer={shape}
        className="relative aspect-square w-full touch-none select-none overflow-hidden rounded-[22px] border border-hairline bg-porcelain text-ink"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        <Canvas dpr={[1, 2]} camera={{ position: [0, 1.5, 4.1], fov: 30 }} gl={{ antialias: true, alpha: true }}>
          {color ? <Wireframe color={color} /> : null}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableDamping
            autoRotate={playing && !dragging}
            autoRotateSpeed={1.2}
            onStart={() => {
              window.clearTimeout(resumeRef.current);
              setDragging(true);
            }}
            onEnd={() => {
              resumeRef.current = window.setTimeout(() => setDragging(false), RESUME_AFTER_MS);
            }}
          />
        </Canvas>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={!playing}
          className="rounded-full border border-hairline px-4 py-1.5 text-[13px] transition-colors duration-200 hover:border-ink max-md:min-h-11 max-md:px-5"
        >
          {playing ? "Pause rotation" : "Play rotation"}
        </button>
        <p className="text-[12px] text-ink-muted">Drag to turn the stone</p>
      </div>
    </div>
  );
}
