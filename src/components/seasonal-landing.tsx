import Link from "next/link";
import { ShapeGlyph } from "@/components/shape-glyph";
import { currencyLabel, formatOccasionDate } from "@/lib/seasonal/format";
import { SHAPE_NAMES, type SeasonalLang } from "@/lib/seasonal/shape-names";
import { stockCounts } from "@/lib/seasonal/stock";
import {
  REGIONS,
  labHref,
  naturalHref,
  type Occasion,
  type SeasonalLabels,
  type StoneFilter,
} from "@/lib/seasonal/types";
import { SHAPE_BY_SLUG } from "@/lib/shapes";

/**
 * The one layout behind every seasonal landing page.
 *
 * It owns no stone data: the catalogue keeps that, and every call to action
 * here is a deep link into it with the occasion's filter already applied. The
 * page is chrome plus copy, which is why a new occasion is a data entry rather
 * than a new component.
 */

const H2 = "font-display text-[clamp(1.7rem,3.4vw,2.4rem)]";

/** The language pack a page's copy is written in, from its BCP-47 tag. */
const langOf = (occasion: Occasion): SeasonalLang =>
  occasion.lang.split("-")[0] as SeasonalLang;

/**
 * Calls to action for one filter, carrying their live match counts.
 *
 * A count of zero drops the button rather than styling it as unavailable: the
 * natural catalogue holds no colourless stock at all, so several of these
 * briefs genuinely have no natural stones behind them, and a link into an empty
 * catalogue view is worse than no link. The unfiltered catalogue is always one
 * click away at the foot of the page.
 */
function StoneLinks({
  filter,
  labels,
  naturalLabel,
  emphasis = "primary",
}: {
  filter: StoneFilter;
  labels: SeasonalLabels;
  naturalLabel: string;
  emphasis?: "primary" | "secondary";
}) {
  const counts = stockCounts(filter);
  const shell = emphasis === "primary" ? "px-6 py-2.5 text-center" : "px-5 py-2";

  return (
    <>
      <div className={emphasis === "primary" ? "flex flex-col gap-3" : "flex flex-wrap gap-3"}>
        {counts.natural > 0 ? (
          <Link
            href={naturalHref(filter)}
            className={`rounded-full border border-ink ${shell} text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white`}
          >
            {naturalLabel} <span className="tabular-nums">({counts.natural})</span>
          </Link>
        ) : null}
        {counts.lab > 0 ? (
          <Link
            href={labHref(filter)}
            className={`rounded-full border ${counts.natural > 0 ? "border-hairline hover:border-ink" : "border-ink hover:bg-ink hover:text-white"} ${shell} text-[14px] transition-colors duration-200`}
          >
            {labels.labCta} <span className="tabular-nums">({counts.lab})</span>
          </Link>
        ) : null}
      </div>
      {counts.natural === 0 || counts.lab === 0 ? (
        <p className="mt-3 text-[13px] text-ink-muted">
          {counts.natural === 0 ? labels.noNatural : labels.noLab}
        </p>
      ) : null}
    </>
  );
}

function ShapeRow({ filter, lang, className }: { filter: StoneFilter; lang: SeasonalLang; className?: string }) {
  const names = SHAPE_NAMES[lang];
  return (
    <ul className={`flex flex-wrap items-end gap-x-8 gap-y-6 ${className ?? ""}`}>
      {filter.shapes.map((slug) => (
        <li key={slug} className="flex flex-col items-center gap-2">
          <ShapeGlyph
            geometry={SHAPE_BY_SLUG[slug].geometry}
            frozen
            className="h-14 w-14"
            strokeWidth={1}
          />
          <span className="text-[13px] text-ink-muted-panel">{names[slug]}</span>
        </li>
      ))}
    </ul>
  );
}

export function SeasonalLanding({ occasion }: { occasion: Occasion }) {
  const lang = langOf(occasion);
  const labels = occasion.labels;
  const region = REGIONS[occasion.region];
  // Rendered per request under a daily revalidate, so a movable date stays current.
  const date = formatOccasionDate(occasion.date, occasion.formatLocale, labels, new Date());
  const currency = currencyLabel(occasion.formatLocale, region.currencies);

  const facts = [
    { term: labels.date, detail: date.value, note: date.numeric ?? date.rule },
    { term: labels.shapes, detail: occasion.brief.shapes },
    { term: labels.colour, detail: occasion.brief.colour },
    { term: labels.quotedIn, detail: currency },
  ];

  return (
    <article lang={occasion.lang}>
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_320px] lg:items-center lg:gap-16">
          <div>
            <p className="text-[13px] tracking-[0.08em] text-ink-muted uppercase">{occasion.eyebrow}</p>
            <h1 className="mt-4 max-w-[880px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)] leading-none">
              {occasion.heading}
            </h1>
            <p className="measure mt-5 text-ink-muted">{occasion.standfirst}</p>
          </div>
          <div className="flex justify-center rounded-panel bg-panel px-8 py-10">
            <ShapeRow filter={occasion.primary} lang={lang} className="justify-center" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_320px] lg:gap-16">
        <div>
          {occasion.sections.map((section, i) => (
            <div key={section.heading}>
              <h2 className={i === 0 ? H2 : `mt-12 ${H2}`}>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="measure mt-4 text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}

          {occasion.secondary ? (
            <div className="mt-12 rounded-card border border-hairline p-7">
              <h2 className="font-display text-[22px] leading-none">{labels.alsoConsider}</h2>
              <p className="measure mt-3 text-[15px] text-ink-muted">{occasion.secondary.note}</p>
              <div className="mt-5">
                <StoneLinks
                  filter={occasion.secondary.filter}
                  labels={labels}
                  naturalLabel={occasion.secondary.label}
                  emphasis="secondary"
                />
              </div>
            </div>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-[96px] lg:h-fit">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline pt-5 lg:grid-cols-1">
            {facts.map(({ term, detail, note }) => (
              <div key={term}>
                <dt className="text-[12px] text-ink-muted">{term}</dt>
                <dd className="mt-0.5 text-[15px]">
                  {detail}
                  {note ? (
                    <span className="mt-0.5 block text-[13px] text-ink-muted tabular-nums">{note}</span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <StoneLinks
              filter={occasion.primary}
              labels={labels}
              naturalLabel={labels.naturalCta}
            />
          </div>
          <p className="mt-4 text-[13px] text-ink-muted">{labels.priceNote}</p>
        </aside>
      </section>

      <section className="border-t border-hairline bg-panel">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)]">{labels.moreLinks}</h2>
          <nav className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-[15px]">
            {[
              { href: "/", label: labels.home },
              { href: "/natural-diamonds", label: labels.allNatural },
              { href: "/lab-grown-diamonds", label: labels.allLab },
              { href: "/contact", label: labels.contact },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-ink-muted-panel underline underline-offset-4 transition-colors duration-200 hover:text-ink"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </article>
  );
}
