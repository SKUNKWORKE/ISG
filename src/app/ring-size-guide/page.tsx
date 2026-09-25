import type { Metadata } from "next";
import Link from "next/link";
import { RingSizer } from "@/components/ring-sizer";
import { CHART_SIZES, formatUs } from "@/lib/ring-sizes";

export const metadata: Metadata = {
  title: "Ring size guide and sizer: US, UK and EU ring size chart",
  description:
    "Find your ring size at home: measure a ring you own on screen, measure your finger with string or paper, or convert between US, UK, Australian and European sizes and millimetres.",
  alternates: { canonical: "/ring-size-guide" },
};

const H2 = "font-display text-[clamp(2rem,4.4vw,3.2rem)]";

const TIPS: { term: string; detail: string }[] = [
  {
    term: "Measure warm, late in the day",
    detail:
      "Fingers are smallest when cold and first thing in the morning. Measure at room temperature, towards the evening, and not straight after exercise.",
  },
  {
    term: "Mind the knuckle",
    detail:
      "The ring has to pass over the knuckle. If your knuckle is noticeably wider than the base of the finger, size between the two so the ring goes on without forcing but does not spin.",
  },
  {
    term: "Wide bands need more room",
    detail:
      "A band wider than about 6 mm covers more of the finger and feels tighter. Most people go up a quarter to a half size for wide bands and eternity rings.",
  },
  {
    term: "Eternity rings cannot be resized",
    detail:
      "Stones set all the way round leave no plain metal to cut and rejoin, so full eternity rings are made to the exact size. Measure carefully, and if in doubt ask a local jeweller to size the finger.",
  },
  {
    term: "Surprise purchase?",
    detail:
      "Borrow a ring from the right finger and use the on-screen method, or ask a close friend or family member. A solitaire can usually be resized after the proposal; a halo or pavé band sometimes can, within a size or so.",
  },
  {
    term: "Between two sizes",
    detail: "Take the larger. A ring that is slightly loose is comfortable; one that is slightly tight is not worn.",
  },
];

const FAQ = [
  {
    question: "What is the most common ring size?",
    answer:
      "For women, US 6 to 7 (UK L½ to N½) covers most engagement ring orders; for men, US 9 to 10 (UK R½ to T½). Our ring designs are photographed around US 6¾ to 7 and are made to order in your size.",
  },
  {
    question: "How accurate is an on-screen ring sizer?",
    answer:
      "Once the screen is matched to a bank card it is usually accurate to within a quarter size, because it measures a real ring's inside diameter. Without calibration it is not reliable, which is why the tool asks for it first.",
  },
  {
    question: "How do I convert a UK ring size to a US size?",
    answer:
      "UK sizes are letters and US sizes are numbers, and both map to the ring's inside circumference. For example UK L½ is about US 6, N½ about US 7 and P½ about US 8. The converter on this page gives the exact figures in millimetres too.",
  },
  {
    question: "What is a European ring size?",
    answer:
      "European (ISO 8653) ring sizes are simply the inside circumference in millimetres, so a size 54 ring measures about 54 mm around the inside, which is roughly US 7.",
  },
  {
    question: "Can a ring be resized after it is made?",
    answer:
      "Most plain-shank solitaires can be resized by about two sizes up or down. Pavé, channel-set and halo bands are more limited, and full eternity bands cannot be resized, so the size is confirmed with you before any ring is made.",
  },
];

export default function RingSizeGuidePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to measure your ring size at home",
      step: [
        { "@type": "HowToStep", text: "Wrap a strip of paper or non-stretch string around the base of the finger." },
        { "@type": "HowToStep", text: "Mark where it overlaps, making sure it would still slide over the knuckle." },
        { "@type": "HowToStep", text: "Measure the length to the mark in millimetres." },
        { "@type": "HowToStep", text: "Look up the circumference in the ring size chart, or enter it in the sizer." },
      ],
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
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
          <Link
            href="/jewelry?type=ring"
            className="text-[13px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
          >
            Diamond rings
          </Link>
          <h1 className="mt-4 max-w-[880px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
            Ring size guide
          </h1>
          <p className="measure mt-5 text-ink-muted">
            Three ways to find a ring size without visiting a jeweller: measure a ring that already
            fits, measure the finger itself, or convert a size you already know. Every ring is made
            to order, and we confirm the size with you before it is made.
          </p>
        </div>
      </section>

      <section id="sizer" className="mx-auto max-w-[1440px] scroll-mt-[96px] px-5 py-14 sm:px-8 sm:py-20">
        <RingSizer />
      </section>

      <section id="chart" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <h2 className={H2}>Ring size chart</h2>
          <p className="measure mt-4 text-ink-muted">
            Inside measurements for each size. Charts from different jewellers can differ by a
            fraction of a size, so if you have a measurement in millimetres, that is the figure to
            send us.
          </p>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-[15px] tabular-nums">
              <thead>
                <tr className="border-b border-ink text-[12px] text-ink-muted">
                  <th scope="col" className="py-2 pr-6 font-normal">US / Canada</th>
                  <th scope="col" className="py-2 pr-6 font-normal">UK / Australia</th>
                  <th scope="col" className="py-2 pr-6 font-normal">Europe (ISO)</th>
                  <th scope="col" className="py-2 pr-6 font-normal">Inside diameter</th>
                  <th scope="col" className="py-2 font-normal">Circumference</th>
                </tr>
              </thead>
              <tbody>
                {CHART_SIZES.map((s) => (
                  <tr key={s.us} className="border-b border-hairline">
                    <th scope="row" className="py-2.5 pr-6 font-normal">{formatUs(s.us)}</th>
                    <td className="py-2.5 pr-6">{s.uk}</td>
                    <td className="py-2.5 pr-6">{s.eu}</td>
                    <td className="py-2.5 pr-6">{s.diameter.toFixed(1)} mm</td>
                    <td className="py-2.5">{s.circumference.toFixed(1)} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline bg-panel">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className={H2}>Getting it right</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              A few things change the size you need, whichever method you use.
            </p>
          </div>
          <dl className="divide-y divide-hairline border-y border-hairline">
            {TIPS.map(({ term, detail }) => (
              <div key={term} className="py-5">
                <dt className="font-display text-[22px] leading-none">{term}</dt>
                <dd className="measure mt-2 text-[15px] text-ink-muted-panel">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="faq" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="max-w-[520px]">
            <h2 className={H2}>Ring size questions</h2>
            <p className="measure mt-4 text-ink-muted">
              Found your size?{" "}
              <Link href="/build-a-ring" className="underline underline-offset-4 hover:text-ink">
                Build a ring
              </Link>{" "}
              or browse{" "}
              <Link href="/jewelry?type=ring" className="underline underline-offset-4 hover:text-ink">
                finished rings
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
    </>
  );
}
