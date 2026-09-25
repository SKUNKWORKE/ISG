import type { Metadata } from "next";
import Link from "next/link";
import { CaratFinder } from "@/components/carat-finder";
import { CaratSizeChart, CaratSizeTable } from "@/components/carat-size-chart";
import {
  CHART_CARATS,
  faceUpAtDepth,
  faceUpSize,
  formatFaceUp,
  parseMeasurements,
} from "@/lib/carat-size";
import { SHAPES, type ShapeSlug } from "@/lib/shapes";
import { FEATURED_STONES } from "@/lib/stones";

export const metadata: Metadata = {
  title: "Diamond carat guide: carat weight vs size chart",
  description:
    "What carat weight means, a to-scale carat size chart in millimetres for twelve diamond shapes, how carat drives price, and how to choose the right weight.",
  alternates: { canonical: "/carat-guide" },
};

// Shapes in this week's featured stock lead the chart; the rest follow in catalogue order.
const CHART_ORDER: ShapeSlug[] = [
  ...new Set([...FEATURED_STONES.map((s) => s.shape), ...SHAPES.map((s) => s.slug)]),
];
const LEAD_SHAPES = CHART_ORDER.slice(0, 6);
const MORE_SHAPES = CHART_ORDER.slice(6);

const CONTENTS = [
  ["what-is-carat", "What is carat weight?"],
  ["size-chart", "Carat weight vs. diamond size"],
  ["price", "Carat weight and price"],
  ["other-cs", "How carat interacts with the other Cs"],
  ["choosing", "Choosing the right carat weight"],
  ["faq", "Frequently asked questions"],
] as const;

const FAQ = [
  {
    question: "Is a bigger carat always better?",
    answer:
      "No. Weight is one grade among several. A smaller stone that is well cut, with good colour and clarity, often looks better than a heavier one cut deep or heavily included. A bigger stone always costs more; whether it looks better depends on the other grades.",
  },
  {
    question: "What's the most popular carat weight for engagement rings?",
    answer:
      "One carat is the reference point most buyers start from, partly because it is a round number and partly because it is where prices step up. Many engagement stones sit either side of it. The right weight is the one the budget allows without giving up cut quality.",
  },
  {
    question: "Does carat weight affect durability?",
    answer:
      "No. A diamond is equally hard at any weight. Durability depends on shape and setting: points, thin corners and a thin girdle are the vulnerable areas whatever the stone weighs. A larger stone does sit higher off the hand, so a protective setting matters more.",
  },
  {
    question: "How is carat weight measured for fancy-shaped diamonds?",
    answer:
      "Exactly as for a round: the stone is weighed on a calibrated scale and the report states the weight to two decimal places. What changes is how that weight spreads face up. An oval or marquise covers more area than a round of the same weight; a deep emerald or radiant can cover less. That is why reports give measurements in millimetres.",
  },
  {
    question: "Does carat weight mean the same thing for natural and lab-grown diamonds?",
    answer:
      "Yes. A carat is 200 milligrams whatever the origin, and natural and lab-grown diamonds have the same density, so two stones of equal weight and equal proportions measure the same. The difference between them is price per carat, not size per carat.",
  },
];

const H2 = "font-display text-[clamp(2rem,4.4vw,3.2rem)]";

export default function CaratGuidePage() {
  const worked = (["radiant", "oval", "round"] as const)
    .map((slug) => FEATURED_STONES.find((s) => s.shape === slug))
    .filter((s): s is (typeof FEATURED_STONES)[number] => Boolean(s));

  // The cut callout, computed rather than asserted: same formula as the chart.
  const wellCut = faceUpAtDepth("round", 1, 0.615);
  const deepCut = faceUpAtDepth("round", 1.1, 0.66);

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
              Diamond Carat Guide
            </h1>
            <p className="measure mt-5 text-ink-muted">
              Carat is a measure of weight, not size. It moves the price more directly than any
              other grade, and it says less about how a stone will look than most buyers expect.
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

      {/* 2. What is carat weight? */}
      <section id="what-is-carat" className="scroll-mt-[96px]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>What is carat weight?</h2>
            <p className="measure mt-4 text-ink-muted">
              A carat is a unit of mass: 200 milligrams, or 0.2 grams. It describes how much a
              diamond weighs on a scale, not how large it looks in a ring. Two stones of the same
              weight can face up at noticeably different sizes, depending on shape and how they
              were cut.
            </p>
            <p className="measure mt-4 text-ink-muted">
              It is not the same word as karat, which measures the purity of gold. An 18-karat
              ring and a one-carat diamond share a pronunciation and nothing else.
            </p>
          </div>

          <div className="rounded-[36px] bg-panel p-8 sm:p-10">
            <h3 className="font-display text-[26px] leading-tight">Carats and points</h3>
            <p className="mt-3 text-[15px] text-ink-muted-panel">
              One carat divides into 100 points. The trade often quotes smaller stones in points
              rather than decimals.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-hairline bg-hairline sm:grid-cols-4">
              {[0.25, 0.5, 0.75, 1].map((ct) => (
                <div key={ct} className="bg-porcelain px-4 py-5">
                  <dt className="font-display text-[24px] leading-none tabular-nums">
                    {ct.toFixed(2)} ct
                  </dt>
                  <dd className="mt-1.5 text-[13px] tabular-nums text-ink-muted">
                    {Math.round(ct * 100)} points
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[13px] text-ink-muted-panel">
              1 carat = 200 mg = 0.2 g = 100 points
            </p>
          </div>
        </div>
      </section>

      {/* 3. Size chart — the centrepiece */}
      <section id="size-chart" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <h2 className={H2}>Carat weight vs. diamond size</h2>
              <p className="measure mt-4 text-ink-muted">
                Weight rises faster than size. Doubling the weight of a round adds only about a
                quarter to its diameter, because the extra carbon goes into depth as well as
                width. Shape changes the picture again: elongated cuts spread more of their
                weight face up than a round does.
              </p>
              <p className="measure mt-4 text-ink-muted">
                The figures are for well-proportioned stones. A stone cut deep carries weight
                below the girdle where it cannot be seen, so always read the measurements on the
                report alongside the carat figure.
              </p>
            </div>

            <div className="overflow-x-auto rounded-[22px] border border-hairline lg:self-start">
              <table className="w-full text-left text-[15px] tabular-nums">
                <caption className="border-b border-hairline bg-panel px-5 py-3 text-left text-[13px] text-ink-muted-panel">
                  Round brilliant: carat weight and approximate diameter
                </caption>
                <thead>
                  <tr className="border-b border-hairline text-[12px] text-ink-muted">
                    <th scope="col" className="px-5 py-3 font-normal">
                      Carat
                    </th>
                    <th scope="col" className="px-5 py-3 font-normal">
                      Approx. diameter
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CHART_CARATS.map((ct) => (
                    <tr key={ct} className="border-b border-hairline last:border-b-0">
                      <td className="px-5 py-2.5">{ct.toFixed(2)} ct</td>
                      <td className="px-5 py-2.5">{formatFaceUp(faceUpSize("round", ct))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-16">
            <CaratSizeChart shapes={LEAD_SHAPES} />

            <details className="group border-b border-hairline">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-[22px] [&::-webkit-details-marker]:hidden">
                Six more shapes
                <span
                  aria-hidden
                  className="text-[20px] leading-none text-ink-muted transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <CaratSizeChart shapes={MORE_SHAPES} scaleBar={false} />
            </details>

            <details className="group border-b border-hairline">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-[22px] [&::-webkit-details-marker]:hidden">
                Every shape as a table
                <span
                  aria-hidden
                  className="text-[20px] leading-none text-ink-muted transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="pb-8">
                <CaratSizeTable
                  shapes={CHART_ORDER}
                  caption="Approximate face-up dimensions (length × width) by carat weight, for twelve diamond shapes"
                />
              </div>
            </details>

            <p className="measure mt-6 text-[13px] text-ink-muted">
              Round figures are the standard reference diameters. Other shapes are estimated from
              the trade&apos;s weight formula at a typical ratio and depth for each cut; hexagon
              and trillion have the least standardised proportions and vary most. Select any
              weight to see natural stock in that shape and weight band.
            </p>
          </div>

          {worked.length ? (
            <div className="mt-16 rounded-[36px] bg-panel p-8 sm:p-10">
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)]">
                Worked examples from current stock
              </h3>
              <p className="measure mt-3 text-[15px] text-ink-muted-panel">
                The chart gives the typical figure. Real stones land close to it, and the gap is
                proportion: a slightly shallower stone spreads wider, a deeper one faces up
                smaller.
              </p>
              <ul className="mt-8 grid gap-5 md:grid-cols-3">
                {worked.map((stone) => {
                  const actual = parseMeasurements(stone.measurements);
                  return (
                    <li key={stone.sku}>
                      <Link
                        href={`/stones/${stone.sku}`}
                        className="block h-full rounded-[22px] border border-hairline bg-porcelain p-6 transition-colors duration-200 hover:border-ink"
                      >
                        <p className="text-[12px] tabular-nums text-ink-muted">SKU {stone.sku}</p>
                        <p className="mt-2 font-display text-[26px] leading-none">
                          {stone.shapeName} {stone.carat.toFixed(2)} ct
                        </p>
                        <dl className="mt-5 space-y-3 border-t border-hairline pt-4 text-[14px]">
                          <div className="flex justify-between gap-4">
                            <dt className="text-ink-muted">Report measures</dt>
                            <dd className="tabular-nums">
                              {actual ? formatFaceUp(actual) : stone.measurements}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-ink-muted">Chart estimate</dt>
                            <dd className="tabular-nums">
                              {formatFaceUp(faceUpSize(stone.shape, stone.carat))}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-ink-muted">Depth</dt>
                            <dd className="tabular-nums">{stone.depthPercent}%</dd>
                          </div>
                        </dl>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* 4. Price */}
      <section id="price" className="scroll-mt-[96px] border-t border-hairline bg-panel">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-[720px]">
            <h2 className={H2}>Carat weight and price</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              Price per carat rises with weight, because large rough is rarer than small rough.
              A two-carat stone costs more than two one-carat stones of the same grades.
            </p>
            <p className="measure mt-4 text-ink-muted-panel">
              The rise is not smooth. It steps up at the weights buyers ask for by name, so a
              stone that reaches a milestone costs noticeably more than one a few points short
              of it, though the two look the same.
            </p>
          </div>

          <div className="mt-12">
            <ol className="relative flex justify-between border-t border-ink pt-5">
              {[0.5, 0.75, 1, 1.5, 2].map((ct) => (
                <li key={ct} className="relative flex flex-col items-center">
                  <span aria-hidden className="absolute -top-[26px] h-3 w-px bg-ink" />
                  <span className="font-display text-[clamp(1.3rem,4vw,1.75rem)] leading-none tabular-nums">
                    {ct.toFixed(2)}
                  </span>
                  <span className="mt-1 text-[11px] text-ink-muted-panel sm:text-[12px]">
                    <span className="sm:hidden">ct</span>
                    <span className="hidden sm:inline">ct milestone</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-[36px] border border-hairline bg-hairline lg:grid-cols-2">
            <div className="bg-porcelain p-8">
              <h3 className="font-display text-[24px]">Same weight, different price</h3>
              <p className="mt-3 text-[15px] text-ink-muted">
                Two stones of identical weight can sit far apart on price. Cut, colour and clarity
                set the rest, and a difference of a grade or two in colour or clarity moves the
                figure more than most buyers expect.
              </p>
            </div>
            <div className="bg-porcelain p-8">
              <h3 className="font-display text-[24px]">Natural and lab-grown</h3>
              <p className="mt-3 text-[15px] text-ink-muted">
                At the same weight and grades, a lab-grown diamond costs considerably less than a
                natural one. Weight, size and material are the same; origin, not material, is the
                difference, and the market prices natural stones on their finite supply.
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
        </div>
      </section>

      {/* 5. The other Cs */}
      <section id="other-cs" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>How carat interacts with the other Cs</h2>
            <p className="measure mt-4 text-ink-muted">
              Weight decides how much diamond there is. Cut decides how much of it you see. A
              well-proportioned stone spreads its weight face up and returns light to the eye; a
              stone cut deep hides weight below the girdle and looks smaller and darker for it.
            </p>
            <p className="measure mt-4 text-ink-muted">
              Every stone we list carries an independent GIA or IGI report with the grades that
              matter here:
            </p>
            <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-hairline pt-6 sm:grid-cols-2">
              {[
                ["Cut", "How the proportions return light. Graded for round brilliants only."],
                ["Polish", "The finish of the facet surfaces."],
                ["Symmetry", "How precisely the facets align with each other and the outline."],
                ["Colour", "D to J on the colourless scale, or a fancy-colour description."],
                ["Clarity", "Inclusions and blemishes, from FL down to I2."],
                ["Measurements", "Length, width and depth in millimetres. Read these with the carat figure."],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="text-[15px]">{term}</dt>
                  <dd className="mt-0.5 text-[14px] text-ink-muted">{detail}</dd>
                </div>
              ))}
            </dl>
            <p className="measure mt-6 text-[14px] text-ink-muted">
              <Link href="/craftsmanship" className="underline underline-offset-4 hover:text-ink">
                How to read a grading report
              </Link>
              <span aria-hidden> · </span>
              <Link href="/color-guide" className="underline underline-offset-4 hover:text-ink">
                Diamond colour guide
              </Link>
            </p>
          </div>

          <aside className="rounded-[36px] border border-hairline p-8 sm:p-10 lg:self-start">
            <p className="text-[13px] text-ink-muted">Cut against weight</p>
            <p className="mt-3 font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight">
              A well-cut diamond can look larger than a poorly cut one that weighs more.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-hairline pt-6">
              <div>
                <dt className="text-[12px] text-ink-muted">1.00 ct round, 61.5% depth</dt>
                <dd className="mt-1 font-display text-[28px] leading-none tabular-nums">
                  {formatFaceUp(wellCut)}
                </dd>
              </div>
              <div>
                <dt className="text-[12px] text-ink-muted">1.10 ct round, 66% depth</dt>
                <dd className="mt-1 font-display text-[28px] leading-none tabular-nums">
                  {formatFaceUp(deepCut)}
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-[14px] text-ink-muted">
              A tenth of a carat more weight, paid for, and almost none of it visible face up.
              The deeper stone also returns less light, so it tends to look the smaller of the
              two.
            </p>
            <Link
              href="/cut-guide#scale"
              className="mt-5 inline-block text-[14px] underline underline-offset-4 transition-colors duration-200 hover:text-ink"
            >
              How proportions control light, in the cut guide
            </Link>
          </aside>
        </div>
      </section>

      {/* 6. Choosing */}
      <section id="choosing" className="scroll-mt-[96px] border-t border-hairline bg-panel">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <h2 className={`${H2} max-w-[720px]`}>Choosing the right carat weight</h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[36px] border border-hairline bg-hairline md:grid-cols-2">
            {[
              [
                "Hand and finger size",
                "The same stone reads larger on a slender finger than on a broad one. Elongated shapes such as oval, pear and marquise lengthen the hand and cover more of it for their weight.",
              ],
              [
                "Just under a milestone",
                "A 0.90 ct stone looks almost identical to a 1.00 ct stone and costs noticeably less. The same holds at 1.40 against 1.50, and 1.90 against 2.00.",
              ],
              [
                "Setting style",
                "A halo of small stones around the centre makes it read larger. Thin prongs show more of the stone than heavy ones, and a bezel frames it but covers the edge.",
              ],
              [
                "Origin",
                "At the same weight and budget, lab-grown often allows a higher colour and clarity than natural. Natural offers finite supply. Neither is the wrong choice.",
              ],
            ].map(([heading, body]) => (
              <li key={heading} className="bg-porcelain p-8">
                <h3 className="font-display text-[24px]">{heading}</h3>
                <p className="measure mt-3 text-[15px] text-ink-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="max-w-[520px]">
            <h2 className={H2}>Frequently Asked Questions</h2>
            <p className="measure mt-4 text-ink-muted">
              What buyers ask most often about weight before choosing a stone.
            </p>
            <p className="mt-6 text-[14px] text-ink-muted">
              See how weight trades off against the other Cs in the{" "}
              <Link href="/diamond-4cs-calculator" className="underline underline-offset-4 hover:text-ink">
                4Cs calculator
              </Link>
              .
            </p>
          </div>
          <div className="border-t border-hairline">
            {FAQ.map(({ question, answer }) => (
              <details key={question} className="group border-b border-hairline">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-display text-[22px] leading-snug [&::-webkit-details-marker]:hidden">
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

      {/* 8. CTA */}
      <section className="border-t border-hairline bg-panel">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>Shop Diamonds by Carat</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              Choose a shape and a weight band to open the catalogue already filtered to it. If
              nothing in stock fits, enquire and we will source to the specification.
            </p>
          </div>
          <CaratFinder />
        </div>
      </section>
    </>
  );
}
