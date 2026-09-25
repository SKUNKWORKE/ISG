import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GUIDES,
  findGuide,
  guideContents,
  relatedGuides,
  type Guide,
  type GuideSection,
} from "@/lib/guides";
import { GLOSSARY_BY_SLUG } from "@/lib/glossary";
import { SITE_URL } from "@/lib/stone-specs";

type Props = { params: Promise<{ slug: string }> };

function guideFor(slug: string): Guide {
  const guide = findGuide(slug);
  if (!guide) notFound();
  return guide;
}

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = guideFor((await params).slug);
  return {
    title: guide.metaTitle,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.metaTitle,
      description: guide.description,
    },
  };
}

const H2 = "font-display text-[clamp(2rem,4.4vw,3.2rem)]";

function Section({ section, index }: { section: GuideSection; index: number }) {
  const shaded = index % 2 === 1;
  return (
    <section
      id={section.id}
      className={`scroll-mt-[96px] border-t border-hairline ${shaded ? "bg-panel" : ""}`}
    >
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className={`measure mt-4 ${shaded ? "text-ink-muted-panel" : "text-ink-muted"}`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="lg:pt-3">
            {section.points?.length ? (
              <dl className="divide-y divide-hairline border-y border-hairline">
                {section.points.map(({ term, detail }) => (
                  <div key={term} className="py-5">
                    <dt className="font-display text-[22px] leading-none">{term}</dt>
                    <dd
                      className={`measure mt-2 text-[15px] ${
                        shaded ? "text-ink-muted-panel" : "text-ink-muted"
                      }`}
                    >
                      {detail}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {section.callout ? (
              <aside
                className={`rounded-panel p-8 sm:p-10 ${
                  section.points?.length ? "mt-8" : ""
                } ${shaded ? "bg-porcelain" : "bg-ink text-white [&_a:focus-visible]:outline-white"}`}
              >
                <p className={`text-[13px] ${shaded ? "text-ink-muted" : "text-white/70"}`}>
                  {section.callout.label}
                </p>
                <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
                  {section.callout.heading}
                </h3>
                <p className={`mt-4 text-[15px] ${shaded ? "text-ink-muted" : "text-white/75"}`}>
                  {section.callout.body}
                </p>
                {section.callout.href ? (
                  <Link
                    href={section.callout.href}
                    className="mt-6 inline-block text-[15px] underline underline-offset-4"
                  >
                    {section.callout.cta ?? "Read more"}
                  </Link>
                ) : null}
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function GuidePage({ params }: Props) {
  const guide = guideFor((await params).slug);
  const contents = guideContents(guide);
  const more = relatedGuides(guide);
  const terms = guide.terms
    .map((slug) => GLOSSARY_BY_SLUG.get(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const { spec } = guide;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}`,
      author: { "@type": "Organization", name: "Imperial Star Gems", url: SITE_URL },
      publisher: { "@type": "Organization", name: "Imperial Star Gems", url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map(({ question, answer }) => ({
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

      {/* 1. Header */}
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_320px] lg:items-end lg:gap-16">
          <div>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-muted">
              <Link
                href="/guides"
                className="underline underline-offset-4 transition-colors duration-200 hover:text-ink"
              >
                Buying guides
              </Link>
              <span aria-hidden className="h-px w-3 bg-hairline" />
              <span>{guide.occasion}</span>
              <span aria-hidden className="h-px w-3 bg-hairline" />
              <span>{guide.readingMinutes} min read</span>
            </p>
            <h1 className="mt-4 max-w-[900px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
              {guide.title}
            </h1>
            <p className="measure mt-5 text-ink-muted">{guide.standfirst}</p>
          </div>

          <nav aria-label="On this page" className="border-t border-hairline pt-5">
            <p className="text-[13px] text-ink-muted">On this page</p>
            <ol className="mt-3 space-y-1.5 text-[15px]">
              {contents.map(({ id, label }) => (
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

      {/* 2. The argument */}
      {guide.sections.map((section, i) => (
        <Section key={section.id} section={section} index={i} />
      ))}

      {/* 3. The specification */}
      <section id="specification" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-[720px]">
            <h2 className={H2}>{spec.heading}</h2>
            <p className="measure mt-4 text-ink-muted">{spec.intro}</p>
          </div>

          {/* One row per line of the specification. The column template is shared
              between the header and the rows so the two stay aligned; on a
              comparison table the second value carries its own inline label
              below md, where the columns stack. */}
          {(() => {
            const columns = spec.columns
              ? "md:grid-cols-[0.8fr_1.1fr_1.1fr_1.6fr]"
              : "md:grid-cols-[0.8fr_1.2fr_1.6fr]";
            return (
              <div className="mt-12 overflow-hidden rounded-panel border border-hairline">
                {spec.columns ? (
                  <div
                    className={`hidden gap-x-6 bg-panel px-6 py-3 text-[13px] text-ink-muted md:grid ${columns}`}
                  >
                    <p />
                    <p className="text-ink">{spec.columns[0]}</p>
                    <p>{spec.columns[1]}</p>
                    <p>Why</p>
                  </div>
                ) : null}

                <dl className="grid gap-px bg-hairline">
                  {spec.rows.map((row) => (
                    <div
                      key={row.label}
                      className={`grid gap-x-6 gap-y-2 bg-porcelain px-6 py-5 md:gap-y-0 ${columns}`}
                    >
                      <dt className="text-[13px] text-ink-muted md:pt-1.5">{row.label}</dt>
                      <dd className="font-display text-[20px] leading-tight">{row.value}</dd>
                      {spec.columns ? (
                        <dd className="font-display text-[20px] leading-tight text-ink-muted">
                          <span className="font-sans text-[13px] md:hidden">
                            {spec.columns[1]}:{" "}
                          </span>
                          {row.alt}
                        </dd>
                      ) : null}
                      <dd className="text-[14px] text-ink-muted md:pt-1.5">{row.note}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })()}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={spec.href}
              className="rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
            >
              {spec.cta}
            </Link>
            <Link
              href="/contact#enquiry"
              className="rounded-full border border-ink px-7 py-3 text-[15px] transition-colors duration-200 hover:bg-panel"
            >
              Send this specification to the desk
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Terms used */}
      {terms.length ? (
        <section className="border-t border-hairline bg-panel">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
            <div className="max-w-[720px]">
              <h2 className={H2}>Terms used in this guide</h2>
              <p className="measure mt-4 text-ink-muted-panel">
                The short version. Each one is defined in full, with what a report prints for it,
                in the{" "}
                <Link href="/glossary" className="underline underline-offset-4 hover:text-ink">
                  glossary
                </Link>
                .
              </p>
            </div>
            <dl className="mt-12 grid gap-px overflow-hidden rounded-panel border border-hairline bg-hairline md:grid-cols-2">
              {terms.map((term) => (
                <div key={term.slug} className="bg-porcelain p-7">
                  <dt>
                    <Link
                      href={`/glossary#${term.slug}`}
                      className="font-display text-[22px] leading-none underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-ink"
                    >
                      {term.term}
                    </Link>
                  </dt>
                  <dd className="measure mt-3 text-[15px] text-ink-muted">{term.short}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* 5. FAQ */}
      <section id="faq" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="max-w-[520px]">
            <h2 className={H2}>Frequently Asked Questions</h2>
            <p className="measure mt-4 text-ink-muted">
              What buyers ask us most often about this particular purchase.
            </p>
          </div>
          <div className="border-t border-hairline">
            {guide.faq.map(({ question, answer }) => (
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

      {/* 6. Other guides */}
      {more.length ? (
        <section className="border-t border-hairline bg-panel">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
            <h2 className={H2}>Read next</h2>
            <ul className="mt-12 grid gap-px overflow-hidden rounded-panel border border-hairline bg-hairline md:grid-cols-3">
              {more.map((other) => (
                <li key={other.slug} className="bg-porcelain">
                  <Link
                    href={`/guides/${other.slug}`}
                    className="group flex h-full flex-col p-8 transition-colors duration-200 hover:bg-panel/60"
                  >
                    <p className="text-[13px] text-ink-muted">{other.occasion}</p>
                    <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,1.9rem)] leading-tight underline decoration-transparent underline-offset-[5px] transition-colors duration-200 group-hover:decoration-ink">
                      {other.title}
                    </h3>
                    <p className="measure mt-3 text-[15px] text-ink-muted">{other.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
