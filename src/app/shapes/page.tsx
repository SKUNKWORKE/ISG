import type { Metadata } from "next";
import Link from "next/link";
import { ShapeGlyph } from "@/components/shape-glyph";
import { JsonLd } from "@/components/json-ld";
import { SHAPES } from "@/lib/shapes";
import { breadcrumbs, collectionPage } from "@/lib/structured-data";
import { LAB_STONES, NATURAL_STONES, countByShape } from "@/lib/stones";

const DESCRIPTION =
  "Round, princess, cushion, emerald, oval, pear, marquise, radiant, asscher, heart, trillion and hexagon — what each cut asks of the cutter, and what it gives back.";

export const metadata: Metadata = {
  title: "Diamond shapes",
  description: DESCRIPTION,
};

export default function ShapesPage() {
  const naturalCounts = countByShape(NATURAL_STONES);
  const labCounts = countByShape(LAB_STONES);

  const jsonLd = [
    collectionPage({
      name: "Diamond shapes",
      description: DESCRIPTION,
      path: "/shapes",
      total: SHAPES.length,
      items: SHAPES.map((s) => ({ path: `/shapes/${s.slug}`, name: `${s.name} cut diamonds` })),
    }),
    breadcrumbs([{ name: "Diamond shapes", path: "/shapes" }]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
          <h1 className="max-w-[900px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
            Twelve outlines, and what each one demands
          </h1>
          <p className="measure mt-5 text-ink-muted">
            Shape is not decoration. It decides how much of the rough survives, where light goes
            once it enters the stone, and how much an inclusion or a half-degree of asymmetry will
            show. These are the twelve we hold.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <ul>
          {SHAPES.map((shape, i) => {
            const natural = naturalCounts[shape.slug] ?? 0;
            const lab = labCounts[shape.slug] ?? 0;

            return (
              <li
                key={shape.slug}
                id={shape.slug}
                className="group scroll-mt-24 border-b border-hairline py-14 last:border-b-0 sm:py-16"
              >
                <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-14">
                  <div className="flex items-start justify-center rounded-[36px] bg-panel py-12 lg:sticky lg:top-[96px] lg:h-fit">
                    <ShapeGlyph
                      geometry={shape.geometry}
                      className="glyph-auto h-32 w-32"
                      strokeWidth={1}
                    />
                  </div>

                  <div>
                    <p className="text-[13px] tabular-nums text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3rem)] leading-none">
                      <Link href={`/shapes/${shape.slug}`} className="hover:underline hover:underline-offset-8">
                        {shape.name}
                      </Link>
                    </h2>
                    <p className="measure mt-4 text-ink-muted">{shape.note}</p>
                    <Link
                      href={`/shapes/${shape.slug}`}
                      className="mt-3 inline-block text-[14px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
                    >
                      What to look for in a {shape.name.toLowerCase()}
                    </Link>

                    <dl className="mt-7 grid max-w-[520px] grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline pt-5 sm:grid-cols-3">
                      <div>
                        <dt className="text-[12px] text-ink-muted">Facet family</dt>
                        <dd className="mt-0.5 text-[15px]">{shape.cutFamily}</dd>
                      </div>
                      <div>
                        <dt className="text-[12px] text-ink-muted">Typical ratio</dt>
                        <dd className="mt-0.5 text-[15px] tabular-nums">{shape.ratio}</dd>
                      </div>
                      <div>
                        <dt className="text-[12px] text-ink-muted">SKU code</dt>
                        <dd className="mt-0.5 text-[15px]">{shape.code}</dd>
                      </div>
                    </dl>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href={`/natural-diamonds?shape=${shape.slug}`}
                        className="rounded-full border border-ink px-6 py-2.5 text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white"
                      >
                        {/* Inherits the button's colour so it stays legible once
                            the button fills with ink on hover. */}
                        Natural in this shape <span className="tabular-nums">({natural})</span>
                      </Link>
                      <Link
                        href={`/lab-grown-diamonds?shape=${shape.slug}`}
                        className="rounded-full border border-hairline px-6 py-2.5 text-[14px] transition-colors duration-200 hover:border-ink"
                      >
                        Lab-grown in this shape <span className="tabular-nums">({lab})</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <section className="mt-8 border-t border-hairline bg-panel">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="max-w-[720px] font-display text-[clamp(2rem,4.4vw,3.2rem)]">
            Not seeing the specification you need?
          </h2>
          <p className="measure mt-4 text-ink-muted-panel">
            Much of what we supply never reaches this site. Tell us the shape, weight range and
            grades you are working to, and we will come back with what is available.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
          >
            Send a sourcing request
          </Link>
        </div>
      </section>
    </>
  );
}
