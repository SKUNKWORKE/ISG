"use client";

import Link from "next/link";
import { ShapeGlyph } from "./shape-glyph";
import { ShortlistToggle } from "./shortlist-toggle";
import { SHAPE_BY_SLUG } from "@/lib/shapes";
import type { Stone } from "@/lib/stones";

/**
 * A single stone.
 *
 * There is no price on this card, in the DOM or in a data attribute — the only
 * way to a number is an enquiry, and that is a deliberate property of the
 * component, not an omission.
 */
export function StoneCard({ stone, onEnquire }: { stone: Stone; onEnquire: (s: Stone) => void }) {
  const shape = SHAPE_BY_SLUG[stone.shape];

  return (
    <article className="group flex flex-col rounded-[22px] border border-hairline bg-porcelain p-5 transition-colors duration-300 hover:border-metal">
      <div className="relative flex items-center justify-center rounded-[16px] bg-panel px-6 py-8">
        <ShapeGlyph geometry={shape.geometry} className="glyph-auto h-24 w-24" />
        <ShortlistToggle stone={stone} className="absolute right-3 top-3" />
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[22px] leading-none">
          <Link href={`/stones/${stone.sku}`} className="hover:underline hover:underline-offset-4">
            {stone.shapeName} {stone.carat.toFixed(2)}
            <span className="text-[15px] text-ink-muted"> ct</span>
          </Link>
        </h3>
        <span className="shrink-0 rounded-[10px] border border-hairline px-2 py-0.5 text-[11px] text-ink-muted">
          {stone.origin === "natural" ? "Natural" : "Lab-grown"}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-x-3 gap-y-3 border-t border-hairline pt-4">
        <Spec label="Colour" value={stone.color} />
        <Spec label="Clarity" value={stone.clarity} />
        {stone.cut ? <Spec label="Cut" value={stone.cut} /> : null}
        <Spec label="Polish" value={stone.polish} />
        <Spec label="Symmetry" value={stone.symmetry} />
        <Spec label="Report" value={stone.lab} />
      </dl>

      <p className="mt-4 text-[12px] tabular-nums text-ink-muted">{stone.sku}</p>

      <button
        type="button"
        onClick={() => onEnquire(stone)}
        className="mt-4 w-full rounded-full border border-ink py-2.5 text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white"
      >
        Enquire
        <span className="sr-only"> about {stone.shapeName} {stone.carat.toFixed(2)} carat, SKU {stone.sku}</span>
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
