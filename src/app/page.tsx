import Link from "next/link";
import { HeroSequence } from "@/components/hero-sequence";
import { DiamondRotation } from "@/components/diamond-rotation";
import { ShapeGrid } from "@/components/shape-grid";
import { StoneGrid } from "@/components/stone-grid";
import { ShapeGlyph } from "@/components/shape-glyph";
import { GLYPHS } from "@/lib/glyphs";
import { FEATURED_STONES } from "@/lib/stones";

const ORIGINS = [
  {
    title: "Natural",
    href: "/natural-diamonds",
    glyph: GLYPHS.round,
    body: "Formed in the mantle and brought up by volcanic rock, then found, sorted and cut. Each one is geologically unique and its supply is finite, which is what the market prices.",
    points: [
      "Graded predominantly by GIA",
      "Sourced through Kimberley Process channels",
      "Every stone individually selected",
    ],
  },
  {
    title: "Lab-grown",
    href: "/lab-grown-diamonds",
    glyph: GLYPHS.emerald,
    body: "The same carbon lattice, grown under controlled conditions in weeks rather than eons. Chemically and optically a diamond — the difference is origin, not material.",
    points: [
      "Graded predominantly by IGI",
      "Origin stated on every report",
      "Higher colour and clarity available in larger sizes",
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSequence />

      <section className="border-b border-hairline" aria-labelledby="rotation-heading">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[5fr_6fr] lg:gap-16">
          <div>
            <h2
              id="rotation-heading"
              className="font-display text-[clamp(2rem,4.4vw,3.2rem)]"
            >
              The finished stone, in the round
            </h2>
            <p className="measure mt-4 text-ink-muted">
              A diamond is judged from every angle, not only face up. Let it turn, or take hold of
              it and turn it yourself — the way it would be examined across a grading table.
            </p>
          </div>
          <DiamondRotation
            label="the finished radiant-cut diamond"
            className="mx-auto w-full max-w-[560px]"
          />
        </div>
      </section>

      <ShapeGrid
        heading="Twelve shapes, one discipline"
        intro="Every outline asks something different of the cutter — a step cut hides nothing, a marquise punishes asymmetry, a round is judged against a published standard. Choose a shape to see what we hold in it."
      />

      <section className="border-y border-hairline bg-panel">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-[720px]">
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)]">
              Two origins, graded the same way
            </h2>
            <p className="measure mt-4 text-ink-muted-panel">
              We supply both, and we do not argue for one over the other. They are
              indistinguishable to the eye and to standard testing; they differ in how they came
              to exist and in what the market does with that fact. Which one suits you is a
              question of budget, size and conviction.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {ORIGINS.map((origin) => (
              <article
                key={origin.title}
                className="group flex flex-col rounded-[36px] border border-hairline bg-porcelain p-8 transition-colors duration-300 hover:border-metal sm:p-10"
              >
                <ShapeGlyph geometry={origin.glyph} className="glyph-auto h-12 w-12" />
                <h3 className="mt-6 font-display text-[30px] leading-tight">{origin.title}</h3>
                <p className="measure mt-3 text-[15px] text-ink-muted">{origin.body}</p>

                <ul className="mt-6 space-y-2.5 border-t border-hairline pt-5">
                  {origin.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[14px] text-ink-muted">
                      <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-metal" />
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  href={origin.href}
                  className="mt-8 self-start rounded-full border border-ink px-7 py-3 text-[15px] transition-colors duration-200 hover:bg-ink hover:text-white"
                >
                  View {origin.title.toLowerCase()} stock
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)]">On hand this week</h2>
            <p className="measure mt-4 text-ink-muted">
              A short selection across both origins. Availability moves quickly, so treat this as
              a starting point rather than a complete list.
            </p>
          </div>
          <Link
            href="/natural-diamonds"
            className="rounded-full border border-hairline px-7 py-3 text-[15px] transition-colors duration-200 hover:border-ink"
          >
            See the full catalogue
          </Link>
        </div>

        <div className="mt-12">
          <StoneGrid stones={FEATURED_STONES} />
        </div>
      </section>

      <section className="border-t border-hairline bg-panel">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)]">
              The decisions are made before the first cut
            </h2>
            <p className="measure mt-4 text-ink-muted-panel">
              A finished diamond is the record of a plan. Where the saw goes, which inclusion is
              cut away and which is kept, how much weight is surrendered for symmetry — all of it
              is settled while the stone is still rough, and none of it can be revisited
              afterwards.
            </p>
            <Link
              href="/craftsmanship"
              className="mt-8 inline-block rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
            >
              How a stone is made
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[36px] border border-hairline bg-hairline sm:grid-cols-4 lg:grid-cols-2">
            {(["round", "marquise", "pear", "asscher"] as const).map((slug) => (
              <li key={slug} className="group flex items-center justify-center bg-porcelain p-10">
                <ShapeGlyph geometry={GLYPHS[slug]} className="glyph-auto h-20 w-20" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
