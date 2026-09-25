import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShapeGlyph } from "@/components/shape-glyph";
import { CaratSizeChart } from "@/components/carat-size-chart";
import { GLOSSARY_BY_SLUG } from "@/lib/glossary";
import { SHAPE_GUIDES } from "@/lib/shape-guides";
import { SHAPES, type Shape } from "@/lib/shapes";
import { SITE_URL } from "@/lib/stone-specs";
import { breadcrumbs } from "@/lib/structured-data";
import { LAB_STONES, NATURAL_STONES, countByShape } from "@/lib/stones";

type Props = { params: Promise<{ slug: string }> };

function shapeFor(slug: string): Shape {
  const shape = SHAPES.find((s) => s.slug === slug);
  if (!shape) notFound();
  return shape;
}

export function generateStaticParams() {
  return SHAPES.map((shape) => ({ slug: shape.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shape = shapeFor((await params).slug);
  const { metaTitle, description } = SHAPE_GUIDES[shape.slug];
  return {
    title: metaTitle,
    description,
    alternates: { canonical: `/shapes/${shape.slug}` },
    openGraph: { type: "article", title: metaTitle, description },
  };
}

const H2 = "font-display text-[clamp(1.7rem,3.4vw,2.4rem)]";
const H2_LARGE = "font-display text-[clamp(2rem,4.4vw,3.2rem)]";

export default async function ShapePage({ params }: Props) {
  const shape = shapeFor((await params).slug);
  const index = SHAPES.indexOf(shape);
  const prev = SHAPES[(index - 1 + SHAPES.length) % SHAPES.length];
  const next = SHAPES[(index + 1) % SHAPES.length];
  const natural = countByShape(NATURAL_STONES)[shape.slug] ?? 0;
  const lab = countByShape(LAB_STONES)[shape.slug] ?? 0;
  const guide = SHAPE_GUIDES[shape.slug];
  const terms = guide.terms
    .map((slug) => GLOSSARY_BY_SLUG.get(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const name = shape.name.toLowerCase();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.metaTitle,
      description: guide.description,
      mainEntityOfPage: `${SITE_URL}/shapes/${shape.slug}`,
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
    breadcrumbs([
      { name: "Diamond shapes", path: "/shapes" },
      { name: `${shape.name} cut diamonds`, path: `/shapes/${shape.slug}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_320px] lg:items-center lg:gap-16">
          <div>
            <Link
              href="/shapes"
              className="text-[13px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
            >
              All shapes
            </Link>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,5.6vw,4.2rem)] leading-none">
              {shape.name}
            </h1>
            <p className="measure mt-5 text-ink-muted">{shape.summary}</p>
          </div>
          <div className="flex justify-center rounded-[36px] bg-panel py-14">
            <ShapeGlyph geometry={shape.geometry} className="glyph-auto h-40 w-40" strokeWidth={1} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_320px] lg:gap-16">
        <div>
          <h2 className={H2}>Its character</h2>
          <p className="measure mt-4 text-ink-muted">{shape.note}</p>

          <h2 className={`mt-12 ${H2}`}>Where the {name} cut comes from</h2>
          {guide.history.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="measure mt-4 text-ink-muted">
              {paragraph}
            </p>
          ))}

          <h2 className={`mt-12 ${H2}`}>How a {name} is faceted</h2>
          {guide.anatomy.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="measure mt-4 text-ink-muted">
              {paragraph}
            </p>
          ))}

          <h2 className={`mt-12 ${H2}`}>{shape.name} cut proportions</h2>
          <p className="measure mt-4 text-ink-muted">
            Ranges most well-cut {name} stones fall within. They narrow the field; they do not
            replace seeing the stone.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-ink text-[12px] text-ink-muted">
                  <th scope="col" className="py-2 pr-6 font-normal">Measure</th>
                  <th scope="col" className="py-2 pr-6 font-normal">Typical range</th>
                  <th scope="col" className="py-2 font-normal">Why it matters</th>
                </tr>
              </thead>
              <tbody>
                {guide.proportions.map(({ label, value, note }) => (
                  <tr key={label} className="border-b border-hairline align-top">
                    <th scope="row" className="py-3 pr-6 font-normal">{label}</th>
                    <td className="whitespace-nowrap py-3 pr-6 tabular-nums">{value}</td>
                    <td className="py-3 text-ink-muted">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className={`mt-12 ${H2}`}>What to look for in a {name} diamond</h2>
          <p className="measure mt-4 text-ink-muted">{shape.character}</p>
          <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
            {guide.checks.map(({ term, detail }) => (
              <div key={term} className="py-5">
                <dt className="font-display text-[22px] leading-none">{term}</dt>
                <dd className="measure mt-2 text-[15px] text-ink-muted">{detail}</dd>
              </div>
            ))}
          </dl>

          <h2 className={`mt-12 ${H2}`}>Setting a {name}</h2>
          <p className="measure mt-4 text-ink-muted">{guide.settings}</p>

          <h2 className={`mt-12 ${H2}`}>{shape.name} size by carat weight</h2>
          <p className="measure mt-4 text-ink-muted">
            Approximate face-up size at a typical {shape.name.toLowerCase()} ratio and depth,
            drawn to scale. Select a weight to see natural stock in that band.
          </p>
          <div className="mt-6">
            <CaratSizeChart shapes={[shape.slug]} rowHeadings={false} />
          </div>
          <p className="mt-4 text-[14px] text-ink-muted">
            <Link
              href="/carat-guide"
              className="underline underline-offset-4 transition-colors duration-200 hover:text-ink"
            >
              Diamond carat guide: every shape, price milestones and choosing a weight
            </Link>
          </p>
        </div>

        <aside className="lg:sticky lg:top-[96px] lg:h-fit">
          <dl className="grid grid-cols-3 gap-x-6 gap-y-4 border-t border-hairline pt-5 lg:grid-cols-1">
            <div>
              <dt className="text-[12px] text-ink-muted">Facet family</dt>
              <dd className="mt-0.5 text-[15px]">{shape.cutFamily}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-ink-muted">Typical ratio</dt>
              <dd className="mt-0.5 text-[15px] tabular-nums">{shape.ratio}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-ink-muted">SKU code</dt>
              <dd className="mt-0.5 text-[15px]">{shape.code}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={`/natural-diamonds?shape=${shape.slug}`}
              className="rounded-full border border-ink px-6 py-2.5 text-center text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white"
            >
              Natural in this shape <span className="tabular-nums">({natural})</span>
            </Link>
            <Link
              href={`/lab-grown-diamonds?shape=${shape.slug}`}
              className="rounded-full border border-hairline px-6 py-2.5 text-center text-[14px] transition-colors duration-200 hover:border-ink"
            >
              Lab-grown in this shape <span className="tabular-nums">({lab})</span>
            </Link>
          </div>
        </aside>
      </section>

      {terms.length ? (
        <section className="border-t border-hairline bg-panel">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
            <div className="max-w-[720px]">
              <h2 className={H2_LARGE}>Terms used on this page</h2>
              <p className="measure mt-4 text-ink-muted-panel">
                Each one is defined in full, with what a report prints for it, in the{" "}
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

      <section id="faq" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="max-w-[520px]">
            <h2 className={H2_LARGE}>{shape.name} cut questions</h2>
            <p className="measure mt-4 text-ink-muted">
              What buyers ask most often before choosing a {name} diamond.
            </p>
            <p className="mt-6 text-[14px] text-ink-muted">
              <Link href="/cut-guide" className="underline underline-offset-4 hover:text-ink">
                Cut guide
              </Link>
              <span aria-hidden> · </span>
              <Link href="/clarity-guide" className="underline underline-offset-4 hover:text-ink">
                Clarity guide
              </Link>
              <span aria-hidden> · </span>
              <Link href="/color-guide" className="underline underline-offset-4 hover:text-ink">
                Colour guide
              </Link>
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

      <nav
        aria-label="Other shapes"
        className="mx-auto flex max-w-[1440px] justify-between gap-6 border-t border-hairline px-5 py-10 sm:px-8"
      >
        {[
          { label: "Previous", shape: prev },
          { label: "Next", shape: next },
        ].map(({ label, shape: s }) => (
          <Link
            key={label}
            href={`/shapes/${s.slug}`}
            className={`group flex items-center gap-4 ${label === "Next" ? "flex-row-reverse text-right" : ""}`}
          >
            <ShapeGlyph geometry={s.geometry} frozen className="glyph-auto h-10 w-10 shrink-0" />
            <span>
              <span className="block text-[12px] text-ink-muted">{label}</span>
              <span className="block font-display text-[20px] leading-tight">{s.name}</span>
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
