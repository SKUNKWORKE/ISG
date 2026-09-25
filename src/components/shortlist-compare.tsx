"use client";

import Link from "next/link";
import { useState } from "react";
import { ShapeGlyph } from "./shape-glyph";
import { useHydrated, useShortlist } from "@/hooks/use-shortlist";
import {
  shortlistMailtoHref,
  shortlistWhatsappHref,
  stoneDescriptor,
} from "@/lib/contact";
import { SHORTLIST_LIMIT, compareStones, type RowResult } from "@/lib/shortlist";
import { SHAPE_BY_SLUG } from "@/lib/shapes";

/** A best value: set in bold with a quiet label, never a colour. */
function Value({ result, index }: { result: RowResult; index: number }) {
  const best = result.best[index];
  return (
    <>
      <span className={best ? "font-semibold" : undefined}>{result.values[index]}</span>
      {best ? (
        <span className="mt-0.5 block text-[11px] text-ink-muted">{result.row.bestLabel}</span>
      ) : null}
    </>
  );
}

export function ShortlistCompare() {
  const { stones, remove, clear } = useShortlist();
  const hydrated = useHydrated();
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  if (!hydrated) return <div className="min-h-[40vh]" aria-busy="true" />;

  if (!stones.length) {
    return (
      <div className="rounded-panel bg-panel px-8 py-14 text-center sm:px-14">
        <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)]">Nothing shortlisted yet</h2>
        <p className="measure mx-auto mt-4 text-ink-muted-panel">
          Select the star on any stone to add it here. You can keep up to {SHORTLIST_LIMIT}, compare
          them side by side and send one enquiry for all of them.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/natural-diamonds"
            className="rounded-full bg-ink px-6 py-2.5 text-[14px] text-white transition-opacity duration-200 hover:opacity-85"
          >
            Natural diamonds
          </Link>
          <Link
            href="/lab-grown-diamonds"
            className="rounded-full border border-ink px-6 py-2.5 text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white"
          >
            Lab-grown diamonds
          </Link>
        </div>
      </div>
    );
  }

  const results = compareStones(stones);
  const rows = onlyDifferences && stones.length > 1 ? results.filter((r) => r.differs) : results;
  // Phones pair the stones up, so four stones read as two rows of two.
  const mobileCols = stones.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-5">
        <p className="text-[14px] text-ink-muted">
          <span className="tabular-nums">{stones.length}</span> of {SHORTLIST_LIMIT} stones. Best
          values in each row are set in bold.
        </p>
        <div className="flex items-center gap-5">
          {stones.length > 1 ? (
            <label className="flex cursor-pointer items-center gap-2 text-[14px]">
              <input
                type="checkbox"
                checked={onlyDifferences}
                onChange={(e) => setOnlyDifferences(e.target.checked)}
                className="h-4 w-4 accent-ink"
              />
              Only show differences
            </label>
          ) : null}
          <button
            type="button"
            onClick={clear}
            className="text-[14px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Desktop and tablet: stones as columns. */}
      <div className="mt-8 hidden md:block">
        <table className="w-full table-fixed border-collapse text-left text-[15px]">
          <caption className="sr-only">Shortlisted stones compared by specification</caption>
          <colgroup>
            <col className="w-[180px]" />
            {stones.map((s) => (
              <col key={s.sku} />
            ))}
          </colgroup>
          <thead>
            <tr className="align-top">
              <td />
              {stones.map((stone) => (
                <th key={stone.sku} scope="col" className="px-4 pb-6 font-normal">
                  <div className="flex justify-center rounded-[16px] bg-panel py-6">
                    <ShapeGlyph
                      geometry={SHAPE_BY_SLUG[stone.shape].geometry}
                      className="glyph-auto h-16 w-16"
                    />
                  </div>
                  <Link
                    href={`/stones/${stone.sku}`}
                    className="mt-4 block font-display text-[22px] leading-tight hover:underline hover:underline-offset-4"
                  >
                    {stone.shapeName} {stone.carat.toFixed(2)} ct
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(stone.sku)}
                    className="mt-2 text-[13px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
                  >
                    Remove<span className="sr-only"> {stone.sku}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((result) => (
              <tr key={result.row.label} className="border-t border-hairline align-top">
                <th scope="row" className="py-3.5 pr-4 text-[13px] font-normal text-ink-muted">
                  {result.row.label}
                </th>
                {stones.map((stone, i) => (
                  <td key={stone.sku} className="break-words px-4 py-3.5 tabular-nums">
                    <Value result={result} index={i} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones: one block per row, stones stacked inside it. No sideways scroll. */}
      <div className="mt-6 md:hidden">
        <ul className="grid gap-3" style={{ gridTemplateColumns: mobileCols }}>
          {stones.map((stone, i) => (
            <li key={stone.sku} className="rounded-[16px] border border-hairline p-3">
              <p className="text-[11px] text-ink-muted">Stone {i + 1}</p>
              <Link
                href={`/stones/${stone.sku}`}
                className="mt-1 block font-display text-[19px] leading-tight underline-offset-4 hover:underline"
              >
                {stone.shapeName} {stone.carat.toFixed(2)} ct
              </Link>
              <button
                type="button"
                onClick={() => remove(stone.sku)}
                className="mt-1 text-[12px] text-ink-muted underline underline-offset-4"
              >
                Remove<span className="sr-only"> {stone.sku}</span>
              </button>
            </li>
          ))}
        </ul>

        <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
          {rows.map((result) => (
            <div key={result.row.label} className="py-3.5">
              <dt className="text-[12px] text-ink-muted">{result.row.label}</dt>
              <dd className="mt-1.5 grid gap-x-3 gap-y-1.5 text-[15px]" style={{ gridTemplateColumns: mobileCols }}>
                {stones.map((stone, i) => (
                  <span key={stone.sku} className="min-w-0 break-words tabular-nums">
                    {stones.length > 1 ? (
                      <span className="mr-1 text-[11px] text-ink-muted">{i + 1}</span>
                    ) : null}
                    <Value result={result} index={i} />
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="mt-12 grid gap-8 rounded-panel bg-panel p-8 sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <h2 className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] leading-tight">
            Enquire about {stones.length > 1 ? `these ${stones.length} stones` : "this stone"}
          </h2>
          <p className="measure mt-3 text-[15px] text-ink-muted-panel">
            One message with every SKU and specification attached. Prices, availability and the
            full grading reports come back in a single reply.
          </p>
          <ul className="mt-4 space-y-1 text-[13px] tabular-nums text-ink-muted-panel">
            {stones.map((s) => (
              <li key={s.sku}>
                {s.sku} · {stoneDescriptor(s)}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={shortlistWhatsappHref(stones)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-6 py-3 text-center text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
          >
            WhatsApp
          </a>
          <a
            href={shortlistMailtoHref(stones)}
            className="rounded-full border border-ink px-6 py-3 text-center text-[15px] transition-colors duration-200 hover:bg-ink hover:text-white"
          >
            Email
          </a>
        </div>
      </section>
    </>
  );
}
