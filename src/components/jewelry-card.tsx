"use client";

import Image from "next/image";
import Link from "next/link";
import { ShapeGlyph } from "./shape-glyph";
import { SHAPE_BY_SLUG } from "@/lib/shapes";
import {
  CATEGORY_NAME,
  METAL_NAME,
  shapesLine,
  type JewelSummary,
} from "@/lib/jewelry";

/**
 * A single piece of jewelry — the StoneCard layout with a photograph in place
 * of the shape glyph. As with stones, there is no price here by design.
 */
export function JewelryCard({
  jewel,
  onEnquire,
}: {
  jewel: JewelSummary;
  onEnquire: (j: JewelSummary) => void;
}) {
  const [cover, hover] = jewel.images;

  return (
    <article className="group flex flex-col rounded-[22px] border border-hairline bg-porcelain p-5 transition-colors duration-300 hover:border-metal">
      <Link
        href={`/jewelry/${jewel.sku}`}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-square overflow-hidden rounded-[16px] bg-panel"
      >
        {cover ? (
          <>
            <Image
              src={cover.src}
              alt=""
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
              className={`object-cover transition-opacity duration-500 ${hover ? "group-hover:opacity-0" : ""}`}
            />
            {hover ? (
              <Image
                src={hover.src}
                alt=""
                fill
                sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            ) : null}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShapeGlyph
              geometry={SHAPE_BY_SLUG[jewel.shapes[0] ?? "round"].geometry}
              className="glyph-auto h-24 w-24"
            />
          </div>
        )}
      </Link>

      <div className="mt-5 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 font-display text-[20px] leading-[1.15]">
          <Link href={`/jewelry/${jewel.sku}`} className="hover:underline hover:underline-offset-4">
            {jewel.name}
          </Link>
        </h3>
        <span className="mt-0.5 shrink-0 rounded-[10px] border border-hairline px-2 py-0.5 text-[11px] text-ink-muted">
          {CATEGORY_NAME[jewel.category]}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-x-3 gap-y-3 border-t border-hairline pt-4">
        <Spec label="Carat" value={jewel.carat.toFixed(2)} />
        <Spec label={jewel.shapes.length > 1 ? "Shapes" : "Shape"} value={shapesLine(jewel)} />
        {jewel.color ? <Spec label="Colour" value={jewel.color} /> : null}
        {jewel.clarity ? <Spec label="Clarity" value={jewel.clarity} /> : null}
        <Spec
          label="Metal"
          value={jewel.metals.length === 3 ? "All golds" : jewel.metals.map((m) => METAL_NAME[m].split(" ")[0]).join(", ")}
        />
        <Spec label="Purity" value={jewel.purities.join(", ")} />
      </dl>

      <p className="mt-auto pt-4 text-[12px] tabular-nums text-ink-muted">{jewel.sku}</p>

      <button
        type="button"
        onClick={() => onEnquire(jewel)}
        className="mt-4 w-full rounded-full border border-ink py-2.5 text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white"
      >
        Enquire
        <span className="sr-only"> about {jewel.name}, SKU {jewel.sku}</span>
      </button>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-[14px] leading-tight">{value}</dd>
    </div>
  );
}
