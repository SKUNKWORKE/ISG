"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  GLOSSARY_SORTED,
  alphabet,
  groupedByLetter,
  relatedTerms,
  searchGlossary,
  type GlossaryCategory,
  type GlossaryTerm,
} from "@/lib/glossary";

/*
  Filtering runs on the client, but every entry is rendered on the server first:
  this component receives no props and reads the whole glossary at module scope,
  so the full text is in the HTML for search engines and for anyone who lands on
  a deep link like /glossary#girdle before hydration.
*/

const LETTERS = alphabet();

function Entry({ term }: { term: GlossaryTerm }) {
  const related = relatedTerms(term);
  return (
    <article id={term.slug} className="scroll-mt-[96px] border-b border-hairline py-9">
      <div className="grid gap-x-12 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)]">
        <div>
          <h3 className="font-display text-[clamp(1.5rem,2.6vw,1.9rem)] leading-tight">
            {term.term}
          </h3>
          {term.aka?.length ? (
            <p className="mt-1.5 text-[13px] text-ink-muted">Also: {term.aka.join(", ")}</p>
          ) : null}
          <p className="mt-3 inline-block rounded-chip border border-hairline px-2.5 py-1 text-[11px] text-ink-muted">
            {CATEGORIES[term.category].label}
          </p>
        </div>

        <div>
          <p className="measure text-[17px]">{term.short}</p>
          <p className="measure mt-3 text-[15px] text-ink-muted">{term.detail}</p>

          {term.onReport ? (
            <p className="measure mt-5 rounded-card bg-panel px-5 py-4 text-[14px] text-ink-muted-panel">
              <span className="text-ink">On the report </span>
              {term.onReport}
            </p>
          ) : null}

          {related.length || term.guide ? (
            <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[14px] text-ink-muted">
              {related.length ? (
                <>
                  <span>See also</span>
                  {related.map((r, i) => (
                    <span key={r.slug}>
                      <a
                        href={`#${r.slug}`}
                        className="underline underline-offset-4 transition-colors duration-200 hover:text-ink"
                      >
                        {r.term}
                      </a>
                      {i < related.length - 1 ? <span aria-hidden>,</span> : null}
                    </span>
                  ))}
                </>
              ) : null}
              {term.guide ? (
                <Link
                  href={term.guide.href}
                  className="text-ink underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
                >
                  {term.guide.label} →
                </Link>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function GlossaryIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlossaryCategory | "all">("all");

  const visible = useMemo(() => {
    const byCategory =
      category === "all"
        ? GLOSSARY_SORTED
        : GLOSSARY_SORTED.filter((t) => t.category === category);
    return searchGlossary(byCategory, query);
  }, [query, category]);

  const groups = useMemo(() => groupedByLetter(visible), [visible]);
  const present = useMemo(() => new Set(groups.map((g) => g.letter)), [groups]);
  const filtered = query.trim() !== "" || category !== "all";

  return (
    <div>
      {/* Controls. Sticky under the site header so the filters stay reachable
          in a list this long. */}
      <div className="sticky top-[72px] z-30 -mx-5 border-b border-hairline bg-porcelain/90 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center gap-3 lg:max-w-[360px]">
            <label htmlFor="glossary-search" className="sr-only">
              Search the glossary
            </label>
            <input
              id="glossary-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search terms and definitions"
              className="w-full rounded-input border border-hairline bg-porcelain px-4 py-2.5 text-[15px] placeholder:text-ink-muted focus:border-ink focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {(["all", ...CATEGORY_ORDER] as const).map((key) => {
              const active = category === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(key)}
                  className={`rounded-chip border px-3 py-1.5 text-[13px] transition-colors duration-200 ${
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-hairline text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {key === "all" ? "All" : CATEGORIES[key].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p aria-live="polite" className="text-[13px] tabular-nums text-ink-muted">
            {visible.length} {visible.length === 1 ? "term" : "terms"}
            {filtered ? ` of ${GLOSSARY_SORTED.length}` : ""}
          </p>
          <nav aria-label="Jump to letter" className="flex flex-wrap gap-x-1.5 gap-y-1">
            {LETTERS.map(({ letter, count }) => {
              const reachable = count > 0 && present.has(letter);
              return reachable ? (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="text-[13px] tabular-nums text-ink-muted underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline"
                >
                  {letter}
                </a>
              ) : (
                <span key={letter} aria-hidden className="text-[13px] text-hairline">
                  {letter}
                </span>
              );
            })}
          </nav>
          {filtered ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="text-[13px] text-ink underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {groups.length ? (
        groups.map((group) => (
          <section key={group.letter} aria-labelledby={`letter-${group.letter}-heading`}>
            <h2
              id={`letter-${group.letter}-heading`}
              className="scroll-mt-[168px] border-b border-ink pb-2 pt-14 font-display text-[28px] leading-none"
            >
              <span id={`letter-${group.letter}`} className="scroll-mt-[168px]">
                {group.letter}
              </span>
            </h2>
            {group.terms.map((term) => (
              <Entry key={term.slug} term={term} />
            ))}
          </section>
        ))
      ) : (
        <div className="mt-14 rounded-panel bg-panel p-8 sm:p-12">
          <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)]">
            Nothing here matches “{query}”
          </h2>
          <p className="measure mt-3 text-[15px] text-ink-muted-panel">
            Try a shorter word, clear the category filter, or ask us directly — the trade desk
            answers this kind of question every day.
          </p>
          <Link
            href="/contact#enquiry"
            className="mt-6 inline-block rounded-full bg-ink px-6 py-2.5 text-[14px] text-white transition-opacity duration-200 hover:opacity-85"
          >
            Ask the desk
          </Link>
        </div>
      )}
    </div>
  );
}
