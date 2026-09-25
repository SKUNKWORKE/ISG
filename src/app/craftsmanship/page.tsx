import type { Metadata } from "next";
import Link from "next/link";
import { STAGES, stageStillUrl } from "@/lib/sequence";

export const metadata: Metadata = {
  title: "Craftsmanship",
  description:
    "How a rough crystal becomes a graded diamond — planning, sawing, faceting and polishing — with our position on sourcing, ethics and independent certification.",
};

const SOURCING = [
  {
    heading: "Where rough comes from",
    body: "Natural rough is bought through established channels that operate under the Kimberley Process Certification Scheme, and every parcel carries the System of Warranties statement that accompanies it down the chain. We keep the paperwork for each purchase and can produce it on request.",
  },
  {
    heading: "Grown material",
    body: "Grown stones are bought from producers who state their growth method and disclose origin on every report. Nothing grown is ever presented as natural, on this site or on an invoice, and the distinction appears on the certificate rather than only in conversation.",
  },
  {
    heading: "Disclosure",
    body: "Treatments are disclosed. If a stone has been laser drilled, fracture filled, irradiated or HPHT processed for colour, it is stated plainly in writing before any money moves. Where we do not know something about a stone's history, we say that too.",
  },
];

const CERTIFICATION = [
  {
    heading: "Independent grading",
    body: "Stones are graded by an independent laboratory — most often GIA for natural goods and IGI for grown, though both grade both. We do not grade our own stock, and we do not ask a laboratory for a second opinion on a report we did not like.",
  },
  {
    heading: "What a report covers",
    body: "Carat weight, colour, clarity, cut where the shape has a published cut standard, polish, symmetry, fluorescence, measurements, proportions and a plotted clarity diagram. For grown material it also states the growth method and any post-growth treatment.",
  },
  {
    heading: "Reading it properly",
    body: "Two stones with identical grades can look quite different. Proportion figures, the plot and the stone in front of you tell you more than the four headline grades, and we will walk through all of it with you before you commit.",
  },
];

const FAQ = [
  {
    question: "Do natural and lab-grown diamonds hold their value the same way?",
    answer:
      "No. Neither should be bought as a guaranteed store of value — a stone bought at retail usually resells for less than was paid. Natural diamonds have an established secondary market with trade buyers who will make an offer, typically well below retail. Production costs for grown diamonds have fallen steadily, retail prices have followed, and the resale market for them is thin. Buy a grown stone for what it is to wear rather than for what it might fetch later.",
  },
  {
    question: "How does GIA grading differ from IGI grading?",
    answer:
      "Both are independent laboratories working to the same colour, clarity and carat scales. GIA, a non-profit founded in 1931, developed the grading system most of the trade uses and is the usual reference for natural stones. IGI, founded in Antwerp in 1975, grades a large share of the world's lab-grown diamonds. Wording differs in places — on round brilliants IGI may issue an \"Ideal\" cut grade, while GIA's highest is \"Excellent\" — and relative strictness is debated in the trade. For any single stone, the full report and the stone itself tell you more than the name at the top.",
  },
  {
    question: "What is the difference between cut, polish and symmetry?",
    answer:
      "Cut is an overall grade of how the stone's proportions — table size, crown and pavilion angles, depth — work together to return light, and most laboratories issue it only for round brilliants. Polish describes the surface finish of the facets: fine polishing lines, burn marks or nicks. Symmetry describes how precisely the facets are shaped, aligned and placed relative to one another and to the outline. Fancy shapes carry polish and symmetry grades but no cut grade, so for them the proportion figures and seeing the stone matter more.",
  },
  {
    question: "What does fluorescence on a report mean?",
    answer:
      "Some diamonds glow, usually blue, under ultraviolet light. Reports grade the strength of that glow from none to very strong, though the exact wording varies between laboratories. In the great majority of stones it has no visible effect in normal light; in a small number with strong fluorescence the stone can look slightly hazy. It is worth judging on the stone itself rather than ruling out a grade on paper.",
  },
];

export default function CraftsmanshipPage() {
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
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
          <h1 className="max-w-[920px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
            A finished diamond is the record of a plan
          </h1>
          <p className="measure mt-5 text-ink-muted">
            Cutting is subtraction. Every gram removed is gone, and the sequence of removals is
            decided while the stone is still an opaque lump of carbon. What follows is how that
            decision is made and then carried out.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <ol>
          {STAGES.map((stage, i) => (
            <li
              key={stage.id}
              className="grid gap-8 border-b border-hairline py-14 last:border-b-0 sm:py-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <p className="text-[13px] tabular-nums text-ink-muted">
                  Stage {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3rem)] leading-none">
                  {stage.title}
                </h2>
                <p className="measure mt-4 text-ink-muted">{stage.body}</p>
              </div>

              <div
                className={`overflow-hidden rounded-[36px] border border-hairline bg-porcelain ${
                  i % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                {/* Real stills from the same render as the home page sequence. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stageStillUrl(stage)}
                  alt={stage.stillAlt}
                  width={1600}
                  height={1600}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="mx-auto aspect-square w-full max-w-[520px] object-contain"
                />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Band
        title="Sourcing and ethics"
        intro="The trade runs on documentation and on being straight about what you do not know. Ours is stated here rather than left to be assumed."
        items={SOURCING}
      />

      <Band
        title="Certification"
        intro="Every stone we list is graded by a laboratory with no stake in the sale."
        items={CERTIFICATION}
        tone="porcelain"
      />

      <section className="border-t border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="max-w-[520px]">
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)]">Frequently asked</h2>
            <p className="measure mt-4 text-ink-muted">
              The questions buyers ask most often before committing to a stone.
            </p>
          </div>
          <div className="border-t border-hairline">
            {FAQ.map(({ question, answer }) => (
              <details key={question} className="group border-b border-hairline">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-display text-[22px] leading-snug [&::-webkit-details-marker]:hidden">
                  {question}
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

      <section className="border-t border-hairline bg-panel">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="max-w-[720px] font-display text-[clamp(2rem,4.4vw,3.2rem)]">
            Questions are welcome before, not after
          </h2>
          <p className="measure mt-4 text-ink-muted-panel">
            If something about a report, a proportion figure or an origin statement is unclear,
            ask. We would rather spend an hour on it now than have you find out later.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
          >
            Talk to us
          </Link>
        </div>
      </section>
    </>
  );
}

function Band({
  title,
  intro,
  items,
  tone = "panel",
}: {
  title: string;
  intro: string;
  items: { heading: string; body: string }[];
  tone?: "panel" | "porcelain";
}) {
  const onPanel = tone === "panel";
  return (
    <section className={`border-t border-hairline ${onPanel ? "bg-panel" : "bg-porcelain"}`}>
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="max-w-[720px]">
          <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)]">{title}</h2>
          <p
            className={`measure mt-4 ${onPanel ? "text-ink-muted-panel" : "text-ink-muted"}`}
          >
            {intro}
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[36px] border border-hairline bg-hairline lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.heading} className="bg-porcelain p-8">
              <h3 className="font-display text-[22px]">{item.heading}</h3>
              <p className="mt-3 text-[15px] text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
