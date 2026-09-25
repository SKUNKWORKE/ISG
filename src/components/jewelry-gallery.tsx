"use client";

import Image from "next/image";
import { useState } from "react";
import { ShapeGlyph } from "./shape-glyph";
import { SHAPE_BY_SLUG, type ShapeSlug } from "@/lib/shapes";
import { METAL_NAME, type JewelImage, type Metal } from "@/lib/jewelry";

/**
 * Photographs of one piece. Where shots are tagged by metal colour (usually
 * one lead shot per colour), a metal switch jumps to that colour's shot.
 */
export function JewelryGallery({
  images,
  name,
  shape,
}: {
  images: JewelImage[];
  name: string;
  /** Drawn instead when a piece has no photography. */
  shape: ShapeSlug;
}) {
  const metals = [...new Set(images.flatMap((img) => (img.metal ? [img.metal] : [])))];
  const [index, setIndex] = useState(0);
  const shown = images;
  const current = shown[Math.min(index, shown.length - 1)];
  const metal: Metal | undefined = current?.metal;

  if (!current) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-[22px] border border-hairline bg-panel">
        <ShapeGlyph geometry={SHAPE_BY_SLUG[shape].geometry} className="glyph-auto h-40 w-40" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-[22px] border border-hairline bg-panel">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || name}
          fill
          preload
          sizes="(min-width: 1024px) 520px, 100vw"
          className="object-cover"
        />
      </div>

      {metals.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Metal colour">
          {metals.map((m) => {
            const on = metal === m;
            return (
              <button
                key={m}
                type="button"
                aria-pressed={on}
                onClick={() => setIndex(images.findIndex((img) => img.metal === m))}
                className={`rounded-[10px] border px-3 py-1.5 text-[13px] transition-colors duration-200 ${
                  on ? "border-ink bg-facet" : "border-hairline hover:border-metal"
                }`}
              >
                {METAL_NAME[m]}
              </button>
            );
          })}
        </div>
      ) : null}

      {shown.length > 1 ? (
        <ul className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {shown.map((img, i) => {
            const on = img === current;
            return (
              <li key={img.src}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={on}
                  aria-label={`Photo ${i + 1} of ${shown.length}`}
                  className={`relative block aspect-square w-full overflow-hidden rounded-[12px] border bg-panel transition-colors duration-200 ${
                    on ? "border-ink" : "border-hairline hover:border-metal"
                  }`}
                >
                  <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
