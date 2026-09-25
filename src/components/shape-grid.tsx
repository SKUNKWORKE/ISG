import Link from "next/link";
import { ShapeGlyph } from "./shape-glyph";
import { SHAPES } from "@/lib/shapes";

/**
 * The wired-grid: every cut shape as a hairline plotting diagram. It is the
 * brand's technical mark and the catalogue's primary navigation at the same
 * time — each glyph lights on hover or focus and opens that shape's stock.
 */
export function ShapeGrid({
  href = "/natural-diamonds",
  heading,
  intro,
}: {
  href?: string;
  heading?: string;
  intro?: string;
}) {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
      {heading ? (
        <div className="max-w-[720px]">
          <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)]">{heading}</h2>
          {intro ? <p className="measure mt-4 text-ink-muted">{intro}</p> : null}
        </div>
      ) : null}

      <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[36px] border border-hairline bg-hairline sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {SHAPES.map((shape) => (
          <li key={shape.slug} className="group bg-porcelain">
            <Link
              href={`${href}?shape=${shape.slug}`}
              className="flex h-full flex-col items-center justify-start gap-4 px-4 py-8 transition-colors duration-300 hover:bg-panel/60"
            >
              <ShapeGlyph geometry={shape.geometry} className="glyph-auto h-16 w-16 shrink-0" />
              <span className="text-center">
                <span className="block font-display text-[19px] leading-none">{shape.name}</span>
                <span className="mt-1.5 block text-[12px] text-ink-muted">{shape.cutFamily}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
