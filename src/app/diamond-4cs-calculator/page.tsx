import type { Metadata } from "next";
import Link from "next/link";
import { FourCsCalculator } from "@/components/fourcs-calculator";
import { JsonLd } from "@/components/json-ld";
import {
  CALC_CLARITIES,
  CALC_COLORS,
  bandIndex,
  cubeKey,
  type StockCube,
} from "@/lib/fourcs-model";
import { SITE_URL } from "@/lib/stone-specs";
import { ALL_STONES, type ClarityGrade, type ColorGrade } from "@/lib/stones";
import { breadcrumbs } from "@/lib/structured-data";

const DESCRIPTION =
  "Move the carat, colour, clarity and cut sliders to see how each of the 4Cs changes a diamond's relative price and how rare the combination is in real stock. Educational, not a quote.";

export const metadata: Metadata = {
  title: "Diamond 4Cs calculator: how carat, colour, clarity and cut change price",
  description: DESCRIPTION,
  alternates: { canonical: "/diamond-4cs-calculator" },
};

/** Counted at build time; the browser gets a few hundred numbers, not the catalogue. */
function stockCube(): StockCube {
  const cube: StockCube = { natural: {}, lab: {} };
  for (const s of ALL_STONES) {
    const c = CALC_COLORS.indexOf(s.color as ColorGrade);
    const q = CALC_CLARITIES.indexOf(s.clarity as ClarityGrade);
    if (c === -1 || q === -1) continue;
    const key = cubeKey(s.shape, c, q, bandIndex(s.carat));
    cube[s.origin][key] = (cube[s.origin][key] ?? 0) + 1;
  }
  return cube;
}

const FAQ = [
  {
    question: "Which of the 4Cs affects diamond price the most?",
    answer:
      "Carat weight, because price per carat itself rises with size: a 2 carat stone typically costs far more than two 1 carat stones of the same grades. Colour and clarity come next, and cut matters most for how the stone actually looks.",
  },
  {
    question: "Why do diamond prices jump at 1 carat?",
    answer:
      "Prices are set in weight bands, and demand clusters at round numbers such as 0.50, 1.00 and 2.00 carats. A stone just under a milestone, such as 0.95 carat, usually costs noticeably less and looks almost the same size.",
  },
  {
    question: "Is this calculator a price quote?",
    answer:
      "No. It shows how prices typically move relative to a 1.00 carat, G, VS2, Excellent round, so you can see the trade-offs between the 4Cs. Real prices also depend on fluorescence, proportions, the grading laboratory and the market, and are quoted on enquiry.",
  },
  {
    question: "Do the same rules apply to lab-grown diamonds?",
    answer:
      "The direction is the same (bigger, whiter and cleaner costs more), but lab-grown prices are much lower and the gaps between grades are much smaller, so a higher grade is usually a smaller step up.",
  },
];

export default function FourCsCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Diamond 4Cs calculator",
      url: `${SITE_URL}/diamond-4cs-calculator`,
      description: DESCRIPTION,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
    breadcrumbs([
      { name: "Buying guides", path: "/guides" },
      { name: "Diamond 4Cs calculator", path: "/diamond-4cs-calculator" },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
          <h1 className="max-w-[880px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
            Diamond 4Cs calculator
          </h1>
          <p className="measure mt-5 text-ink-muted">
            See how carat, colour, clarity and cut trade off against each other. The index shows how
            price typically moves as each C changes, and the rarity panel counts how many stones in
            our own stock meet the specification. It teaches the shape of the market; it is not a
            quote.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20">
        <FourCsCalculator cube={stockCube()} />
      </section>

      <section id="faq" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="max-w-[520px]">
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)]">4Cs and price</h2>
            <p className="mt-6 text-[14px] text-ink-muted">
              <Link href="/carat-guide" className="underline underline-offset-4 hover:text-ink">Carat guide</Link>
              <span aria-hidden> · </span>
              <Link href="/color-guide" className="underline underline-offset-4 hover:text-ink">Colour guide</Link>
              <span aria-hidden> · </span>
              <Link href="/clarity-guide" className="underline underline-offset-4 hover:text-ink">Clarity guide</Link>
              <span aria-hidden> · </span>
              <Link href="/cut-guide" className="underline underline-offset-4 hover:text-ink">Cut guide</Link>
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
    </>
  );
}
