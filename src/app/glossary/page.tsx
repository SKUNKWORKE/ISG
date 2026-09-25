import type { Metadata } from "next";
import Link from "next/link";
import { AnatomyDiagram } from "@/components/anatomy-diagram";
import { GlossaryIndex } from "@/components/glossary-index";
import { CATEGORIES, CATEGORY_ORDER, GLOSSARY } from "@/lib/glossary";
import { SITE_URL } from "@/lib/stone-specs";

export const metadata: Metadata = {
  title: "Diamond glossary: fluorescence, table %, depth %, girdle, culet",
  description:
    "Every term on a diamond grading report, explained plainly — fluorescence, table and depth percentages, girdle thickness, culet, bow-tie, eye-clean, make and the rest. Written for buyers who read the report, not just the grade.",
  alternates: { canonical: "/glossary" },
};

const H2 = "font-display text-[clamp(2rem,4.4vw,3.2rem)]";

/** The order a report is worth reading in — the thing no report tells you. */
const READING_ORDER = [
  {
    step: "Shape and measurements",
    body: "Millimetres before carats. The measurements tell you how big the stone will actually look, and on a fancy shape they give you the length-to-width ratio.",
  },
  {
    step: "Table % and depth %",
    body: "The two proportion figures every listing carries. Read them together, never one alone — and on a round, against the cut grade below them.",
  },
  {
    step: "Cut, polish, symmetry",
    body: "On a round brilliant, the cut grade summarises all three. On every other shape there is no cut grade, so polish and symmetry carry the weight.",
  },
  {
    step: "The plot, then the clarity grade",
    body: "Where the inclusions sit matters as much as how many there are. Read the diagram and the comments first, and let the grade confirm what you saw.",
  },
  {
    step: "Colour, then fluorescence",
    body: "Grading light is far harsher than daylight. Fluorescence can help a lower colour and, rarely, haze a very high one — so the pair is judged together.",
  },
];

export default function GlossaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Imperial Star Gems diamond glossary",
    description:
      "Definitions of the terms used on diamond grading reports and in the diamond trade.",
    url: `${SITE_URL}/glossary`,
    hasDefinedTerm: GLOSSARY.map((term) => ({
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/glossary#${term.slug}`,
      name: term.term,
      description: term.short,
      inDefinedTermSet: `${SITE_URL}/glossary`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* 1. Header */}
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_360px] lg:items-end lg:gap-16">
          <div>
            <h1 className="max-w-[900px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
              Diamond Glossary
            </h1>
            <p className="measure mt-5 text-ink-muted">
              A grading report is a dense page of numbers and abbreviations, and almost none of it
              is explained on the report itself. This is the vocabulary, in full: what each term
              means, what a laboratory actually prints for it, and what it changes about the stone
              in your hand.
            </p>
            <p className="measure mt-4 text-ink-muted">
              The four Cs guides cover the grades most buyers compare on. This goes a layer below
              them — the terms that decide why two stones with identical grades do not look alike.
            </p>
          </div>

          <nav aria-label="Categories" className="border-t border-hairline pt-5">
            <p className="text-[13px] text-ink-muted">
              {GLOSSARY.length} terms, in six groups
            </p>
            <ul className="mt-3 space-y-2 text-[15px]">
              {CATEGORY_ORDER.map((key) => (
                <li key={key}>
                  <span className="text-ink">{CATEGORIES[key].label}</span>
                  <span className="block text-[13px] text-ink-muted">{CATEGORIES[key].blurb}</span>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* 2. Anatomy — the diagram the proportion terms refer back to */}
      <section id="anatomy" className="scroll-mt-[96px] border-b border-hairline bg-panel">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>The parts of a cut stone</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              Five words account for most of a report&apos;s proportions section. Table and depth
              are both given as percentages of the same thing — the stone&apos;s average diameter
              — which is why they only mean something read together.
            </p>
            <p className="measure mt-4 text-ink-muted-panel">
              The girdle is the band a setter&apos;s claws grip, so it is the one part of the stone
              with a job beyond optics. The culet is the point at the bottom; on a modern stone the
              report should read None.
            </p>
            <p className="mt-6 text-[14px] text-ink-muted-panel">
              <Link href="/cut-guide" className="underline underline-offset-4 hover:text-ink">
                How proportions become a cut grade
              </Link>
              <span aria-hidden> · </span>
              <Link href="/craftsmanship" className="underline underline-offset-4 hover:text-ink">
                How a stone is cut
              </Link>
            </p>
          </div>
          <AnatomyDiagram className="lg:self-center" />
        </div>
      </section>

      {/* 3. Reading order */}
      <section id="reading-a-report" className="scroll-mt-[96px] border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-[720px]">
            <h2 className={H2}>Reading a report in order</h2>
            <p className="measure mt-4 text-ink-muted">
              Most buyers read a report top to bottom and stop at the grades. The order below puts
              the figures that change how a diamond looks ahead of the ones that mainly change
              what it costs.
            </p>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-panel border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
            {READING_ORDER.map(({ step, body }, i) => (
              // Five steps: the last spans the remaining columns so no cell is left empty.
              <li key={step} className="bg-porcelain p-8 lg:last:col-span-3 md:last:col-span-2">
                <p className="text-[13px] tabular-nums text-ink-muted">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-[24px] leading-tight">{step}</h3>
                <p className="measure mt-3 text-[15px] text-ink-muted">{body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[14px] text-ink-muted">
            Every listing on this site prints the same figures.{" "}
            <Link href="/natural-diamonds" className="underline underline-offset-4 hover:text-ink">
              Natural stock
            </Link>
            <span aria-hidden> · </span>
            <Link href="/lab-grown-diamonds" className="underline underline-offset-4 hover:text-ink">
              Lab-grown stock
            </Link>
          </p>
        </div>
      </section>

      {/* 4. The glossary itself */}
      <section id="terms" className="scroll-mt-[96px]">
        <div className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 sm:pb-24">
          <GlossaryIndex />
        </div>
      </section>

      {/* 5. Where to go next */}
      <section className="border-t border-hairline bg-panel">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>Still not sure what you are looking at?</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              Send us a report, or a link to a stone anywhere, and we will read it back to you in
              plain terms — what the figures say, what they do not, and what we would ask the
              seller. No obligation, and no charge.
            </p>
            <Link
              href="/contact#enquiry"
              className="mt-8 inline-block rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
            >
              Ask the trade desk
            </Link>
          </div>

          <ul className="grid gap-px self-start overflow-hidden rounded-panel border border-hairline bg-hairline">
            {[
              ["/guides", "Buying guides", "Which specification to buy, by what the stone is for."],
              ["/cut-guide", "Cut guide", "Proportions, symmetry and polish, and what they cost."],
              ["/clarity-guide", "Clarity guide", "Where eye-clean sits on the scale, and why."],
              ["/color-guide", "Colour guide", "D to Z, and where the money stops buying anything."],
              ["/carat-guide", "Carat guide", "Weight against face-up size, and the magic sizes."],
            ].map(([href, title, body]) => (
              <li key={href} className="bg-porcelain">
                <Link
                  href={href}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-7 py-5 transition-colors duration-200 hover:bg-panel/60"
                >
                  <span className="font-display text-[22px] leading-none">{title}</span>
                  <span className="w-full text-[14px] text-ink-muted">{body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
