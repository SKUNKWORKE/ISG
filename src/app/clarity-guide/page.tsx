import type { Metadata } from "next";
import Link from "next/link";
import { ClarityFinder } from "@/components/clarity-finder";
import { ClarityGradeTable, ClarityScale, Loupe } from "@/components/clarity-scale";
import { ShapeGlyph } from "@/components/shape-glyph";
import { CLARITY_CATEGORIES, FULL_SCALE } from "@/lib/clarity-grades";
import { SHAPES, type Shape } from "@/lib/shapes";
import { FEATURED_STONES } from "@/lib/stones";

export const metadata: Metadata = {
  title: "Diamond clarity guide: clarity chart and eye-clean diamonds",
  description:
    "How diamond clarity is graded from FL to I3 under 10x magnification, a clarity chart anchored to real stock, what eye-clean means, and which clarity grade gives the best value for each shape.",
  alternates: { canonical: "/clarity-guide" },
};

const CONTENTS = [
  ["grading", "What is clarity grading?"],
  ["scale", "The clarity scale"],
  ["eye-clean", "Eye-clean vs. graded clarity"],
  ["price", "Clarity grade and price"],
  ["other-cs", "How clarity interacts with the other Cs"],
  ["choosing", "Choosing the right clarity grade"],
  ["faq", "Frequently asked questions"],
] as const;

const FAQ = [
  {
    question: "What clarity grade is 'eye-clean'?",
    answer:
      "Eye-clean is not a laboratory grade. It means no inclusion is visible without magnification at a normal viewing distance. VS2 and above are almost always eye-clean; many SI1 stones are, and some SI2 stones. It depends on the stone's size, its shape and where the inclusions sit, so it is judged stone by stone.",
  },
  {
    question: "Is VVS clarity worth the extra cost?",
    answer:
      "Rarely for how the stone looks. VVS inclusions are extremely hard to find even at 10x, and a VS or eye-clean SI stone looks the same to the eye. VVS is worth paying for when rarity matters to you, in large step cuts, or where lab-grown makes the higher grade affordable.",
  },
  {
    question: "Do inclusions affect a diamond's durability?",
    answer:
      "Usually not. Most inclusions are tiny and deep inside the stone. The exceptions are large feathers that reach the surface, especially near a girdle, point or corner, which can weaken the stone under a hard knock. They are most common in the I grades and worth checking on the plot.",
  },
  {
    question: "What's the difference between an inclusion and a blemish?",
    answer:
      "An inclusion is inside the stone: a crystal, a feather, a pinpoint or a cloud. A blemish is on the surface: a polish line, a nick, a scratch or an extra facet. Both count towards the clarity grade, but inclusions usually decide it.",
  },
  {
    question: "Do GIA and IGI grade clarity the same way?",
    answer:
      "Both grade on the same FL to I3 scale, under 10x magnification, and the grade names mean the same thing on either report. How strictly each laboratory applies the scale is debated in the trade, so read any single grade as a starting point and look at the plot and the stone.",
  },
];

const FAMILY_GUIDANCE: Record<Shape["cutFamily"], { heading: string; body: string }> = {
  Step: {
    heading: "Step cuts show inclusions",
    body: "Long, open facets act like windows. Choose a higher clarity, and read the plot.",
  },
  Brilliant: {
    heading: "Brilliant cuts hide them",
    body: "Many small facets break up the view. A lower clarity is often invisible face up.",
  },
  Mixed: {
    heading: "Mixed cuts hide them well",
    body: "A step-cut outline over brilliant faceting, which masks inclusions much as a brilliant does.",
  },
};

const H2 = "font-display text-[clamp(2rem,4.4vw,3.2rem)]";

export default function ClarityGuidePage() {
  // This week's featured stones, highest clarity first.
  const rank = (grade: string) => (FULL_SCALE as readonly string[]).indexOf(grade);
  const examples = [...FEATURED_STONES].sort((a, b) => rank(a.clarity) - rank(b.clarity));
  const siPattern = CLARITY_CATEGORIES[3].pattern;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* 1. Header */}
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_320px] lg:items-end lg:gap-16">
          <div>
            <h1 className="max-w-[880px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
              Diamond Clarity Guide
            </h1>
            <p className="measure mt-5 text-ink-muted">
              Clarity measures what a diamond carries inside it, its inclusions, and on its
              surface, its blemishes. The fewer there are and the harder they are to see, the
              higher the grade.
            </p>
          </div>
          <nav aria-label="On this page" className="border-t border-hairline pt-5">
            <p className="text-[13px] text-ink-muted">On this page</p>
            <ol className="mt-3 space-y-1.5 text-[15px]">
              {CONTENTS.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-ink"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* 2. Grading */}
      <section id="grading" className="scroll-mt-[96px]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>What is clarity grading?</h2>
            <p className="measure mt-4 text-ink-muted">
              A grader examines the stone under 10x magnification, the standard for the trade,
              and weighs everything found by its size, nature, number, position and relief. The
              grade describes how visible those characteristics are at 10x, not simply how many
              there are.
            </p>
            <dl className="mt-8 grid gap-6 border-t border-hairline pt-6 sm:grid-cols-2">
              <div>
                <dt className="font-display text-[24px] leading-none">Inclusions</dt>
                <dd className="mt-2 text-[15px] text-ink-muted">
                  Inside the stone: crystals, feathers, pinpoints and clouds formed as it grew.
                </dd>
              </div>
              <div>
                <dt className="font-display text-[24px] leading-none">Blemishes</dt>
                <dd className="mt-2 text-[15px] text-ink-muted">
                  On the surface: polish lines, nicks and scratches, often from cutting or wear.
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[36px] bg-panel p-8 sm:p-10 lg:self-start">
            <h3 className="font-display text-[26px] leading-tight">Two laboratories, one scale</h3>
            <p className="mt-3 text-[15px] text-ink-muted-panel">
              Natural stones we list are graded predominantly by GIA, lab-grown predominantly by
              IGI. Both use the same FL–I3 scale under the same 10x standard, so a VS1 on one
              report sits at the same point on the scale as a VS1 on the other, whatever the
              stone&apos;s origin.
            </p>
            <p className="mt-3 text-[15px] text-ink-muted-panel">
              How strictly each laboratory applies the scale is debated in the trade. Read the
              grade as a reliable starting point, then look at the plot and the stone.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Scale — the centrepiece */}
      <section id="scale" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-[720px]">
            <h2 className={H2}>The clarity scale</h2>
            <p className="measure mt-4 text-ink-muted">
              Eleven grades in five groups, from Flawless to Included. Each view below is a round
              brilliant under a 10x loupe; stones on hand this week are listed under their
              report grade.
            </p>
          </div>

          <div className="mt-12">
            <ClarityScale examples={examples} stock />
          </div>

          <div className="mt-12">
            <ClarityGradeTable />
          </div>
        </div>
      </section>

      {/* 4. Eye-clean */}
      <section id="eye-clean" className="scroll-mt-[96px] border-t border-hairline bg-panel">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 className={H2}>Eye-clean vs. graded clarity</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              A clarity grade describes a stone at 10x. <strong className="font-normal text-ink">Eye-clean</strong>{" "}
              describes it as you will actually see it: no inclusion visible without
              magnification, at a normal viewing distance.
            </p>
            <p className="measure mt-4 text-ink-muted-panel">
              VS2 and above are almost always eye-clean. Many SI1 stones are, and some SI2 stones,
              depending on the stone&apos;s size, its shape and where the inclusions sit. Eye-clean
              is not printed on any report; it is judged stone by stone.
            </p>
          </div>

          <aside className="rounded-[36px] bg-ink p-8 text-white sm:p-10 lg:self-start">
            <p className="text-[13px] text-white/70">The concept that matters most</p>
            <p className="mt-3 font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight">
              Most buyers care whether they can see an inclusion, not which letter the laboratory
              printed.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/15 pt-6">
              <div>
                <Loupe pattern={siPattern} className="mx-auto w-full max-w-[150px]" />
                <p className="mt-3 text-center text-[13px] text-white/75">An SI1 stone at 10x</p>
              </div>
              <div>
                <Loupe pattern={siPattern} magnified={false} className="mx-auto w-full max-w-[150px]" />
                <p className="mt-3 text-center text-[13px] text-white/75">The same stone, to the eye</p>
              </div>
            </div>
            <p className="mt-6 text-[12px] text-white/60">
              Illustrative. Whether a particular SI1 is eye-clean depends on the stone.
            </p>
          </aside>
        </div>
      </section>

      {/* 5. Price */}
      <section id="price" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <h2 className={H2}>Clarity grade and price</h2>
              <p className="measure mt-4 text-ink-muted">
                Price falls significantly as you move down the scale, and the top grades carry
                the steepest premium for differences no one sees without a loupe.
              </p>
              <p className="measure mt-4 text-ink-muted">
                VS2 to SI1 is often where value sits: usually eye-clean, at a clear saving on the
                VVS grades above.
              </p>
            </div>
            <div className="rounded-[36px] border border-hairline p-8 sm:p-10 lg:self-start">
              <h3 className="font-display text-[24px]">Natural and lab-grown</h3>
              <p className="mt-3 text-[15px] text-ink-muted">
                Lab-grown diamonds are more often available at VVS and above, at a price close to
                a natural stone several grades lower. The grade means the same thing on either;
                origin, not material, is the difference.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
                <Link href="/natural-diamonds" className="underline underline-offset-4">
                  Natural diamonds
                </Link>
                <Link href="/lab-grown-diamonds" className="underline underline-offset-4">
                  Lab-grown diamonds
                </Link>
              </div>
            </div>
          </div>

          <ol className="mt-12 flex flex-wrap gap-2" aria-label="Clarity grades, with the usual value range marked">
            {FULL_SCALE.map((grade) => {
              const value = grade === "VS2" || grade === "SI1";
              return (
                <li
                  key={grade}
                  className={`rounded-[10px] border px-3.5 py-2 text-[14px] tabular-nums ${
                    value ? "border-ink bg-ink text-white" : "border-hairline text-ink-muted"
                  }`}
                >
                  {grade}
                  {value ? <span className="sr-only"> (usual value range)</span> : null}
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-[13px] text-ink-muted">VS2 to SI1: usually eye-clean, and the usual balance of price and appearance.</p>
        </div>
      </section>

      {/* 6. Other Cs */}
      <section id="other-cs" className="scroll-mt-[96px] border-t border-hairline bg-panel">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <h2 className={H2}>How clarity interacts with the other Cs</h2>
              <p className="measure mt-4 text-ink-muted-panel">
                Size matters: an inclusion is easier to see in a larger stone, where the facets
                that frame it are larger too. Shape matters more. Step cuts have long, open
                facets that show what is inside; brilliant cuts break the view into small flashes
                that hide it.
              </p>
              <p className="measure mt-4 text-ink-muted-panel">
                A well-cut stone&apos;s brilliance helps mask minor inclusions, and a prong or
                bezel placed over an inclusion near the edge can hide it entirely.
              </p>
            </div>
            <dl className="grid gap-x-8 gap-y-4 self-start border-t border-hairline pt-6 sm:grid-cols-2">
              {[
                ["Clarity", "FL to I2 on our listings; the full scale runs to I3."],
                ["Colour", "D to Z for white diamonds, or a fancy-colour description."],
                ["Cut", "How the proportions return light. Graded for round brilliants only."],
                ["Polish", "The finish of the facet surfaces."],
                ["Symmetry", "How precisely the facets align with each other and the outline."],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="text-[15px]">{term}</dt>
                  <dd className="mt-0.5 text-[14px] text-ink-muted-panel">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          <h3 className="mt-14 font-display text-[clamp(1.5rem,2.6vw,2rem)]">Clarity by shape</h3>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {(["Step", "Brilliant", "Mixed"] as const).map((family) => (
              <div key={family} className="rounded-[22px] bg-porcelain p-6">
                <p className="text-[12px] text-ink-muted">{family} cuts</p>
                <h4 className="mt-1 font-display text-[22px] leading-tight">{FAMILY_GUIDANCE[family].heading}</h4>
                <p className="mt-2 text-[14px] text-ink-muted">{FAMILY_GUIDANCE[family].body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {SHAPES.filter((s) => s.cutFamily === family).map((shape) => (
                    <li key={shape.slug} className="group">
                      <Link
                        href={`/shapes/${shape.slug}`}
                        className="flex items-center gap-2 rounded-[12px] border border-hairline px-3 py-2 text-[14px] transition-colors duration-200 hover:border-ink"
                      >
                        <ShapeGlyph geometry={shape.geometry} className="glyph-auto h-6 w-6" />
                        {shape.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[14px] text-ink-muted-panel">
            <Link href="/cut-guide" className="underline underline-offset-4 hover:text-ink">
              Diamond cut guide
            </Link>
            <span aria-hidden> · </span>
            <Link href="/carat-guide" className="underline underline-offset-4 hover:text-ink">
              Carat guide
            </Link>
            <span aria-hidden> · </span>
            <Link href="/color-guide" className="underline underline-offset-4 hover:text-ink">
              Colour guide
            </Link>
          </p>
        </div>
      </section>

      {/* 7. Choosing */}
      <section id="choosing" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <h2 className={`${H2} max-w-[720px]`}>Choosing the right clarity grade</h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[36px] border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "Aim for eye-clean",
                "Buy a stone that looks clean to you rather than chasing the highest grade. The money is better spent on cut or size.",
              ],
              [
                "Brilliant shapes",
                "Round, oval, pear and the other brilliants — and mixed cuts such as cushion and radiant — hide inclusions well. A lower clarity is usually safe.",
              ],
              [
                "Step-cut shapes",
                "Emerald and asscher show inclusions through their open facets. Move up the scale, and look closely at the plot.",
              ],
              [
                "Ask for the plot",
                "The inclusion plot on the report shows exactly what is in the stone and where. Ask for it, with images, before committing.",
              ],
              [
                "Read the grades together",
                "Compare clarity alongside Colour, Cut, Polish and Symmetry, as our listings present them, not in isolation.",
              ],
            ].map(([heading, body]) => (
              // Five cards: the last spans two columns so neither grid leaves an empty cell.
              <li key={heading} className="bg-porcelain p-8 md:last:col-span-2">
                <h3 className="font-display text-[24px]">{heading}</h3>
                <p className="measure mt-3 text-[15px] text-ink-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. FAQ */}
      <section id="faq" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="max-w-[520px]">
            <h2 className={H2}>Frequently Asked Questions</h2>
            <p className="measure mt-4 text-ink-muted">
              What buyers ask most often about clarity before choosing a stone.
            </p>
            <p className="mt-6 text-[14px] text-ink-muted">
              See how clarity trades off against the other Cs in the{" "}
              <Link href="/diamond-4cs-calculator" className="underline underline-offset-4 hover:text-ink">
                4Cs calculator
              </Link>
              .
            </p>
          </div>
          <div className="border-t border-hairline">
            {FAQ.map(({ question, answer }) => (
              <details key={question} className="group border-b border-hairline">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-[22px] leading-snug">{question}</h3>
                  <span
                    aria-hidden
                    className="mt-1 text-[20px] leading-none text-ink-muted transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="measure pb-6 text-[15px] text-ink-muted">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="border-t border-hairline bg-panel">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>Shop Diamonds by Clarity</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              Choose a grade, and a shape if you have one in mind, to open the catalogue already
              filtered. If nothing in stock fits, enquire and we will source to the specification.
            </p>
          </div>
          <ClarityFinder />
        </div>
      </section>
    </>
  );
}
