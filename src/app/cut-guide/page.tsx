import type { Metadata } from "next";
import Link from "next/link";
import { CutFinder } from "@/components/cut-finder";
import { CutGradeScale, CutGradeTable } from "@/components/light-path";
import { ShapeGlyph } from "@/components/shape-glyph";
import { CUT_COMPONENTS } from "@/lib/cut-grades";
import { SHAPES } from "@/lib/shapes";
import { FEATURED_STONES, LAB_STONES, type CutGrade, type Stone } from "@/lib/stones";

export const metadata: Metadata = {
  title: "Diamond cut guide: cut grade chart and the best diamond cut",
  description:
    "What diamond cut grades mean from Excellent to Poor, how cut differs from shape, how proportions, symmetry and polish control brilliance and fire, and which cut grade gives the best value.",
  alternates: { canonical: "/cut-guide" },
};

const CONTENTS = [
  ["cut-vs-shape", "Cut vs. shape"],
  ["scale", "The cut grade scale"],
  ["components", "What makes up a cut grade"],
  ["appearance", "How cut affects appearance"],
  ["price", "Cut grade and price"],
  ["choosing", "Choosing the right cut grade"],
  ["faq", "Frequently asked questions"],
] as const;

const FAQ = [
  {
    question: "What's the difference between cut and shape?",
    answer:
      "Shape is the outline seen from above: round, oval, emerald and so on. Cut is how well that shape has been executed — its proportions, symmetry and polish — and it decides how the stone handles light. Any shape can be cut well or badly.",
  },
  {
    question: "Is Excellent cut always worth the extra cost?",
    answer:
      "Not always. Excellent returns the most light, and on a round brilliant it is worth favouring. But a well-chosen Very Good stone can be very hard to tell apart face up, and the saving can go into a better colour or a little more weight. Judge the stone, not only the grade.",
  },
  {
    question: "Do fancy-shaped diamonds have official cut grades?",
    answer:
      "No. GIA and IGI issue an overall cut grade for round brilliants only. Fancy shapes are graded for polish and symmetry, and their reports give the measurements and proportions; how well they return light is judged on the stone itself.",
  },
  {
    question: "What is a 'Hearts and Arrows' diamond?",
    answer:
      "A round brilliant cut to such precise symmetry that a special viewer shows eight arrows looking down through the top and eight hearts looking up through the bottom. It indicates exceptional optical symmetry. It is a pattern, not a laboratory grade, so ask to see the viewer image rather than relying on the name.",
  },
  {
    question: "Why don't all lab-grown listings show a Cut grade?",
    answer:
      "Because the report does not carry one. IGI, which grades most of our lab-grown stock, issues an overall cut grade only for round brilliants — sometimes as Ideal, its top grade. For emerald, pear and every other fancy shape the report gives polish and symmetry instead, and so does our listing.",
  },
];

const H2 = "font-display text-[clamp(2rem,4.4vw,3.2rem)]";

function firstRound(stones: Stone[], grade: CutGrade) {
  return stones.find((s) => s.shape === "round" && s.cut === grade);
}

export default function CutGuidePage() {
  // Rounds are the only stones with a certified cut grade, so only rounds tag the scale:
  // the featured round, plus real lab-grown rounds at each grade it doesn't cover.
  const featuredRound = FEATURED_STONES.find((s) => s.shape === "round" && s.cut);
  const scaleExamples = [
    featuredRound,
    ...(["Excellent", "Very Good", "Good"] as CutGrade[])
      .filter((g) => featuredRound?.cut !== g)
      .map((g) => firstRound(LAB_STONES, g)),
  ].filter((s): s is Stone => Boolean(s));
  const idealRound = firstRound(LAB_STONES, "Ideal");

  // Fancy shapes from this week's selection: shown with polish and symmetry, never a cut grade.
  const fancyExamples = FEATURED_STONES.filter((s) => s.shape !== "round");

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
              Diamond Cut Guide
            </h1>
            <p className="measure mt-5 text-ink-muted">
              Cut is how well a diamond&apos;s facets work with light. Of the four Cs it does
              most for brilliance and sparkle, and it is not the same thing as shape.
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

      {/* 2. Cut vs shape */}
      <section id="cut-vs-shape" className="scroll-mt-[96px]">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <h2 className={H2}>Cut vs. shape</h2>
              <p className="measure mt-4 text-ink-muted">
                <strong className="font-normal text-ink">Shape</strong> is the outline seen from
                above: round, oval, princess. <strong className="font-normal text-ink">Cut</strong>{" "}
                is the quality of the work inside that outline — the proportions, symmetry and
                polish that decide how light behaves once it enters the stone.
              </p>
              <p className="measure mt-4 text-ink-muted">
                Any shape can be cut well or badly. A round is simply the only one measured
                against a published standard.
              </p>
            </div>
            <div className="rounded-[36px] bg-panel p-8 sm:p-10 lg:self-start">
              <h3 className="font-display text-[26px] leading-tight">Rounds are graded; fancy shapes are judged</h3>
              <p className="mt-3 text-[15px] text-ink-muted-panel">
                GIA issues an overall cut grade for round brilliants only, and so does IGI, whose
                top round grade is Ideal. Every other shape is graded for polish and symmetry,
                and its light performance is judged on the stone — which makes proportions,
                length-to-width ratio and seeing the diamond matter more.
              </p>
            </div>
          </div>

          <h3 className="mt-14 font-display text-[24px]">The twelve shapes we carry</h3>
          <ul className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-[22px] border border-hairline bg-hairline sm:grid-cols-4 lg:grid-cols-6">
            {SHAPES.map((shape) => (
              <li key={shape.slug} className="group bg-porcelain">
                <Link
                  href={`/shapes/${shape.slug}`}
                  className="flex h-full flex-col items-center gap-2 px-2 py-5 transition-colors duration-200 hover:bg-panel/60"
                >
                  <ShapeGlyph geometry={shape.geometry} className="glyph-auto h-10 w-10" />
                  <span className="font-display text-[17px] leading-none">{shape.name}</span>
                  <span className="text-[11px] text-ink-muted">
                    {shape.slug === "round" ? "Cut graded" : "Polish & symmetry"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Scale — the centrepiece */}
      <section id="scale" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-[720px]">
            <h2 className={H2}>The cut grade scale</h2>
            <p className="measure mt-4 text-ink-muted">
              GIA grades round brilliants on five steps, from Excellent to Poor. The difference
              between them is how much of the light entering the top finds its way back out of
              it. Real round brilliants from current stock are listed under their grade.
            </p>
          </div>

          <div className="mt-12">
            <CutGradeScale examples={scaleExamples} stock />
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <CutGradeTable />
            <aside className="rounded-[36px] border border-hairline p-8 sm:p-10 lg:self-start">
              <p className="text-[13px] text-ink-muted">What a report does and doesn&apos;t certify</p>
              <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
                Fancy shapes carry polish and symmetry, not a cut grade
              </h3>
              <p className="mt-4 text-[15px] text-ink-muted">
                Our lab-grown stock is graded predominantly by IGI. On its reports, round
                brilliants carry a cut grade
                {idealRound ? (
                  <>
                    {" "}
                    — often Ideal, as on the{" "}
                    <Link href={`/stones/${idealRound.sku}`} className="underline underline-offset-4">
                      Round {idealRound.carat.toFixed(2)} ct, SKU {idealRound.sku}
                    </Link>
                  </>
                ) : null}
                . Fancy shapes do not: their reports, and our listings, give polish and symmetry
                instead. That is what the report certifies, and this guide claims no more.
              </p>
            </aside>
          </div>

          {fancyExamples.length ? (
            <div className="mt-16">
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)]">
                Fancy shapes in current stock
              </h3>
              <p className="measure mt-3 text-[15px] text-ink-muted">
                This week&apos;s featured fancy shapes, with the finish grades that apply to them.
                Judge their light performance on the stone, or ask for images.
              </p>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {fancyExamples.map((stone) => {
                  const shape = SHAPES.find((s) => s.slug === stone.shape);
                  return (
                    <li key={stone.sku}>
                      <Link
                        href={`/stones/${stone.sku}`}
                        className="group flex h-full items-center gap-5 rounded-[22px] border border-hairline p-5 transition-colors duration-200 hover:border-ink"
                      >
                        <span aria-hidden className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[16px] bg-panel">
                          {shape ? <ShapeGlyph geometry={shape.geometry} frozen className="glyph-auto h-12 w-12" /> : null}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-[22px] leading-tight">
                            {stone.shapeName} {stone.carat.toFixed(2)} ct
                          </span>
                          <span className="mt-1 block text-[14px]">
                            Polish {stone.polish} · Symmetry {stone.symmetry}
                          </span>
                          <span className="mt-1 block text-[12px] tabular-nums text-ink-muted">
                            {stone.origin === "natural" ? "Natural" : "Lab-grown"} · {stone.lab} · SKU{" "}
                            {stone.sku}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* 4. Components */}
      <section id="components" className="scroll-mt-[96px] border-t border-hairline bg-panel">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-[720px]">
            <h2 className={H2}>What makes up a cut grade</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              Three things, and our listings show each of them by name.
            </p>
          </div>
          <dl className="mt-12 grid gap-px overflow-hidden rounded-[36px] border border-hairline bg-hairline md:grid-cols-3">
            {CUT_COMPONENTS.map((c) => (
              <div key={c.term} className="bg-porcelain p-8">
                <dt>
                  <span className="block font-display text-[26px] leading-none">{c.term}</span>
                  <span className="mt-2 block text-[12px] text-ink-muted">
                    On a listing: {c.listing}
                    {c.listing === "Cut" ? " (round brilliants)" : ""}
                  </span>
                </dt>
                <dd className="mt-4 text-[15px] text-ink-muted">{c.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 5. Appearance */}
      <section id="appearance" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>How cut affects appearance</h2>
            <p className="measure mt-4 text-ink-muted">
              Cut controls three separate effects. A stone can be strong in one and weaker in
              another, which is why two diamonds with the same grades can look different.
            </p>
            <dl className="mt-8 space-y-6 border-t border-hairline pt-6">
              {[
                ["Brilliance", "White light returned to the eye. The overall brightness of the stone."],
                ["Fire", "Light split into flashes of colour as it leaves through the crown."],
                ["Scintillation", "The sparkle and pattern of light and dark as the stone, the light or the viewer moves."],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="font-display text-[24px] leading-none">{term}</dt>
                  <dd className="measure mt-2 text-[15px] text-ink-muted">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="rounded-[36px] bg-ink p-8 text-white sm:p-10 lg:self-start [&_a:focus-visible]:outline-white">
            <p className="text-[13px] text-white/70">Cut against size</p>
            <p className="mt-3 font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight">
              A well-cut diamond can look larger and brighter than a heavier one cut poorly.
            </p>
            <p className="mt-4 text-[15px] text-white/75">
              A stone cut deep carries weight below the girdle where it cannot be seen, and
              returns less light for it. The carat guide works through the numbers: a 1.10 ct
              round cut deep measures almost the same across as a well-cut 1.00 ct.
            </p>
            <Link
              href="/carat-guide#other-cs"
              className="mt-6 inline-block text-[15px] underline underline-offset-4"
            >
              Cut against weight, in the carat guide
            </Link>
          </aside>
        </div>
      </section>

      {/* 6. Price */}
      <section id="price" className="scroll-mt-[96px] border-t border-hairline bg-panel">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>Cut grade and price</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              At the same carat, colour and clarity, cut moves the price substantially. An
              Excellent cut commands a premium because it shows the stone&apos;s other qualities
              at their best: the colour you paid for looks whiter and the size you paid for
              faces up in full.
            </p>
            <p className="measure mt-4 text-ink-muted-panel">
              Very Good often gives the best balance of performance and price. Below Good, the
              saving rarely makes up for the light lost.
            </p>
          </div>
          <ol className="grid gap-px self-start overflow-hidden rounded-[36px] border border-hairline bg-hairline">
            {[
              ["Excellent", "Premium", "The most light, and the price that goes with it."],
              ["Very Good", "Best value", "Very close face up, at a meaningful saving."],
              ["Good", "Budget", "Visibly less lively beside the grades above."],
              ["Fair · Poor", "Avoid", "Light loss outweighs the lower price."],
            ].map(([grade, tag, body]) => (
              <li key={grade} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 bg-porcelain px-7 py-5">
                <span className="font-display text-[22px] leading-none">{grade}</span>
                <span className="text-[12px] text-ink-muted">{tag}</span>
                <span className="w-full text-[14px] text-ink-muted">{body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. Choosing */}
      <section id="choosing" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <h2 className={`${H2} max-w-[720px]`}>Choosing the right cut grade</h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[36px] border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "Put cut first",
                "If the budget is limited, protect cut before colour, clarity or carat. It has the largest effect on how the stone looks.",
              ],
              [
                "Round brilliants",
                "Choose Excellent or Very Good — or Ideal on an IGI report. Avoid Fair and Poor.",
              ],
              [
                "Fancy shapes",
                "With no overall grade to lean on, look at the length-to-width ratio, the depth and table figures, and how even the facet pattern is.",
              ],
              [
                "Ask for light images",
                "An ASET or Idealscope image shows where a stone returns light and where it leaks. Ask for one where it is available.",
              ],
              [
                "Read the three together",
                "Compare Cut, Polish and Symmetry side by side, as our listings show them, rather than the cut grade alone.",
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
              What buyers ask most often about cut before choosing a stone.
            </p>
            <p className="mt-6 text-[14px] text-ink-muted">
              <Link href="/carat-guide" className="underline underline-offset-4 hover:text-ink">
                Carat guide
              </Link>
              <span aria-hidden> · </span>
              <Link href="/color-guide" className="underline underline-offset-4 hover:text-ink">
                Colour guide
              </Link>
              <span aria-hidden> · </span>
              <Link href="/clarity-guide" className="underline underline-offset-4 hover:text-ink">
                Clarity guide
              </Link>
              <span aria-hidden> · </span>
              <Link href="/diamond-4cs-calculator" className="underline underline-offset-4 hover:text-ink">
                4Cs calculator
              </Link>
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
            <h2 className={H2}>Shop Diamonds by Cut</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              Choose a round brilliant&apos;s cut grade, or another shape, to open the catalogue
              already filtered. If nothing in stock fits, enquire and we will source to the
              specification.
            </p>
          </div>
          <CutFinder />
        </div>
      </section>
    </>
  );
}
