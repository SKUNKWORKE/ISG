import Link from "next/link";
import { ShapeGlyph } from "@/components/shape-glyph";
import { GLYPHS } from "@/lib/glyphs";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-[1440px] flex-col items-start justify-center px-5 py-20 sm:px-8">
      <ShapeGlyph
        geometry={GLYPHS.trillion}
        frozen
        className="h-16 w-16 [&_.glyph-facet]:stroke-hairline [&_.glyph-outline]:stroke-metal"
      />
      <h1 className="mt-8 font-display text-[clamp(2.4rem,5.6vw,4rem)]">
        This page is not in stock
      </h1>
      <p className="measure mt-4 text-ink-muted">
        The page you were after has moved or never existed. The catalogue is a good place to pick
        the thread back up.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/natural-diamonds"
          className="rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
        >
          Natural diamonds
        </Link>
        <Link
          href="/"
          className="rounded-full border border-hairline px-7 py-3 text-[15px] transition-colors duration-200 hover:border-ink"
        >
          Home
        </Link>
      </div>
    </section>
  );
}
