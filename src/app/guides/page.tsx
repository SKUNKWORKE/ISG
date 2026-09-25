import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/stone-specs";

export const metadata: Metadata = {
  title: "Diamond buying guides by occasion",
  description:
    "Which diamond to buy, by what the stone is for: engagement rings, first purchases on a set budget, anniversary and milestone stones, matched pairs for earrings, surprises, and the difference between investment-grade and wear-grade.",
  alternates: { canonical: "/guides" },
};

const H2 = "font-display text-[clamp(2rem,4.4vw,3.2rem)]";

const PRINCIPLES = [
  {
    heading: "Cut before everything",
    body: "It is the only grade that changes how much light comes back out of the stone. Nothing else compensates for a dull diamond.",
  },
  {
    heading: "Grades are thresholds, not targets",
    body: "Clarity to eye-clean, colour to the setting metal. Past those points you are paying for a difference nobody will see.",
  },
  {
    heading: "Millimetres, not carats",
    body: "Weight is not size. What a stone looks like on a hand is a measurement, and the report prints it.",
  },
  {
    heading: "What a report cannot tell you",
    body: "Eye-clean, milkiness, bow-ties and make are not graded. For those, ask for a video — or ask us.",
  },
];

export default function GuidesPage() {
  const [lead, ...rest] = GUIDES;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Imperial Star Gems diamond buying guides",
    itemListElement: GUIDES.map((guide, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/guides/${guide.slug}`,
      name: guide.title,
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
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
          <h1 className="max-w-[900px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
            Buying Guides
          </h1>
          <p className="measure mt-5 text-ink-muted">
            The four Cs guides explain the scales. These explain the decision — which specification
            to actually buy, given what the stone is for and who will wear it. Each one ends in a
            written specification you can send us, or take anywhere else.
          </p>
          <p className="mt-6 text-[14px] text-ink-muted">
            <Link href="/glossary" className="underline underline-offset-4 hover:text-ink">
              Every report term, in the glossary
            </Link>
          </p>
        </div>
      </section>

      {/* 2. The guides */}
      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16">
        {lead ? (
          <Link
            href={`/guides/${lead.slug}`}
            className="group block rounded-panel bg-panel p-8 transition-colors duration-200 sm:p-12"
          >
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-muted-panel">
              <span>{lead.occasion}</span>
              <span aria-hidden className="h-px w-3 bg-hairline" />
              <span>{lead.readingMinutes} min read</span>
            </p>
            <h2 className="mt-5 max-w-[900px] font-display text-[clamp(2rem,4.4vw,3.2rem)] underline decoration-transparent underline-offset-[6px] transition-colors duration-200 group-hover:decoration-ink">
              {lead.title}
            </h2>
            <p className="measure mt-4 text-ink-muted-panel">{lead.standfirst}</p>
            <span className="mt-8 inline-block rounded-full bg-ink px-6 py-2.5 text-[14px] text-white">
              Read the guide
            </span>
          </Link>
        ) : null}

        <ul className="mt-6 grid gap-px overflow-hidden rounded-panel border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
          {rest.map((guide) => (
            <li key={guide.slug} className="bg-porcelain">
              <Link
                href={`/guides/${guide.slug}`}
                className="group flex h-full flex-col p-8 transition-colors duration-200 hover:bg-panel/60"
              >
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-muted">
                  <span>{guide.occasion}</span>
                  <span aria-hidden className="h-px w-3 bg-hairline" />
                  <span>{guide.readingMinutes} min read</span>
                </p>
                <h2 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight underline decoration-transparent underline-offset-[5px] transition-colors duration-200 group-hover:decoration-ink">
                  {guide.title}
                </h2>
                <p className="measure mt-3 text-[15px] text-ink-muted">{guide.description}</p>
                <span aria-hidden className="mt-auto pt-6 text-[14px] text-ink">
                  Read the guide →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. What every guide assumes */}
      <section className="border-t border-hairline bg-panel">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-[720px]">
            <h2 className={H2}>What every one of these assumes</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              Four principles sit underneath all six guides. If you read nothing else here, read
              these — they account for most of the difference between buying well and overpaying.
            </p>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-panel border border-hairline bg-hairline md:grid-cols-2">
            {PRINCIPLES.map(({ heading, body }, i) => (
              <li key={heading} className="bg-porcelain p-8">
                <p className="text-[13px] tabular-nums text-ink-muted">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-[24px] leading-tight">{heading}</h3>
                <p className="measure mt-3 text-[15px] text-ink-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Where to go next */}
      <section className="border-t border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>Or skip to the stones</h2>
            <p className="measure mt-4 text-ink-muted">
              If you already know the specification, the catalogues filter on every grade these
              guides discuss. If you do not, send us the brief — what it is for, what it is worth
              to you, and by when — and we will come back with stones rather than questions.
            </p>
            <Link
              href="/contact#enquiry"
              className="mt-8 inline-block rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
            >
              Send a brief
            </Link>
          </div>

          <ul className="grid gap-px self-start overflow-hidden rounded-panel border border-hairline bg-hairline">
            {[
              ["/natural-diamonds", "Natural diamonds", "Filter by shape, carat, colour and clarity."],
              ["/lab-grown-diamonds", "Lab-grown diamonds", "The same specification, at a different price."],
              ["/glossary", "Glossary", "Every term a grading report uses, defined."],
              ["/cut-guide", "The four Cs", "Cut, colour, clarity and carat, one guide each."],
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
