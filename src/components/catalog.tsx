"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { StoneGrid } from "./stone-grid";
import {
  ActiveFilters,
  ChipSet,
  FilterPanel,
  MoreFilters,
  NumberRange,
  QuickPicks,
  SearchBox,
  ShapeFilter,
  SortSelect,
} from "./catalog-controls";
import { CLARITY_GRADES, COLOR_GRADES, FLUORESCENCE, LABS, type Origin } from "@/lib/stone-vocabulary";
import {
  FANCY,
  FANCY_HUES,
  FINISH_GRADES,
  LOWER_COLORS,
  PRESETS,
  RANGE_KEYS,
  SORTS,
  SORT_GROUPS,
  CATALOG_PAGE_SIZE,
  activeFilterList,
  emptyFilters,
  filtersFromParams,
  filtersToParams,
  optionName,
  presetActive,
  type CatalogPage,
  type CatalogSummary,
  type FacetCounts,
  type Filters,
  type ListKey,
  type Range,
  type RangeKey,
  type Sort,
} from "@/lib/catalog-filter";

/** Results on screen, and the query string they answer. */
type Loaded = { query: string; count: number; stones: CatalogPage["stones"]; counts: FacetCounts };

async function loadPage(origin: Origin, query: string, offset: number, signal?: AbortSignal) {
  const params = new URLSearchParams(query);
  params.set("origin", origin);
  if (offset) params.set("offset", String(offset));
  const res = await fetch(`/api/stones?${params}`, { signal });
  if (!res.ok) throw new Error(`Catalogue request failed: ${res.status}`);
  return (await res.json()) as CatalogPage;
}

const MORE_KEYS: (ListKey | RangeKey)[] = ["polishes", "symmetries", "fluorescences", "table", "depth", "ratio"];

export function Catalog({
  origin,
  summary,
  firstPage,
  initialQuery = "",
  notice,
}: {
  origin: Origin;
  /** The whole stock list in brief; the stones themselves stay on the server. */
  summary: CatalogSummary;
  /** Results for `initialQuery`, rendered on the server so the first view needs no request. */
  firstPage: CatalogPage;
  /**
   * The page's query string. Every filter and the sort round-trip through it,
   * so guide links (`?color=D,E`), shared URLs and the PDF sheet all agree.
   */
  initialQuery?: string;
  notice?: string;
}) {
  const { bounds, total, hasDates, hasFancy, hasLowerColors } = summary;
  const empty = useMemo(() => emptyFilters(bounds), [bounds]);
  const [initial] = useState(() => filtersFromParams(new URLSearchParams(initialQuery), bounds));

  const [filters, setFilters] = useState<Filters>(initial.filters);
  const [sort, setSortState] = useState<Sort>(initial.sort);

  const query = filtersToParams(filters, sort, bounds).toString();

  const [loaded, setLoaded] = useState<Loaded>(() => ({
    query,
    count: firstPage.count,
    stones: firstPage.stones,
    counts: firstPage.counts ?? ({} as FacetCounts),
  }));
  const [failedQuery, setFailedQuery] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [more, setMore] = useState<"idle" | "loading" | "failed">("idle");
  const moreRequest = useRef<AbortController | null>(null);

  // Every change of filters or sort asks the server for the first page again.
  // Aborting on cleanup means a slow answer to an old query never lands.
  useEffect(() => {
    if (query === loaded.query) return;
    const controller = new AbortController();
    if (moreRequest.current) {
      moreRequest.current.abort();
      moreRequest.current = null;
      setMore("idle");
    }
    loadPage(origin, query, 0, controller.signal)
      .then((page) => {
        setLoaded({ query, count: page.count, stones: page.stones, counts: page.counts ?? ({} as FacetCounts) });
        setFailedQuery(null);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailedQuery(query);
      });
    return () => controller.abort();
  }, [origin, query, loaded.query, attempt]);

  const loading = query !== loaded.query && failedQuery !== query;

  function retry() {
    setFailedQuery(null);
    setAttempt((n) => n + 1);
  }

  async function showMore() {
    const controller = new AbortController();
    moreRequest.current = controller;
    setMore("loading");
    try {
      const page = await loadPage(origin, loaded.query, loaded.stones.length, controller.signal);
      setLoaded((prev) =>
        prev.query === loaded.query ? { ...prev, stones: [...prev.stones, ...page.stones] } : prev,
      );
      setMore("idle");
    } catch {
      if (!controller.signal.aborted) setMore("failed");
    } finally {
      if (moreRequest.current === controller) moreRequest.current = null;
    }
  }

  const update = useCallback((change: (prev: Filters) => Filters) => {
    setFilters(change);
  }, []);

  function toggle<K extends ListKey>(key: K, value: Filters[K][number]) {
    update((prev) => {
      const list = prev[key] as string[];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [key]: next };
    });
  }

  const setRange = (key: RangeKey) => (value: Range) =>
    update((prev) => ({ ...prev, ranges: { ...prev.ranges, [key]: value } }));

  const setQuery = useCallback((query: string) => update((prev) => ({ ...prev, query })), [update]);

  function setSort(next: Sort) {
    setSortState(next);
  }

  const counts = loaded.counts;
  const active = activeFilterList(filters, bounds);
  const moreActive = active.filter((a) => MORE_KEYS.includes(a.key as ListKey)).length;

  // The sheet covers the matching stones (up to its limit), not just the page shown so far.
  const sheetHref = `/spec-sheet/${origin === "natural" ? "natural" : "lab-grown"}${query ? `?${query}` : ""}`;

  // Keep the address bar in step so the current view can be bookmarked or shared.
  useEffect(() => {
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, "", url);
    }
  }, [query]);

  function remove(id: string) {
    const item = active.find((a) => a.id === id);
    if (!item) return;
    if (item.key === "query") return setQuery("");
    if ((RANGE_KEYS as readonly string[]).includes(item.key)) {
      const key = item.key as RangeKey;
      return setRange(key)(bounds[key]);
    }
    toggle(item.key as ListKey, item.value as never);
  }

  const clearAll = () => update(() => empty);

  // Re-keying the grid on the query its results answer replays the entry
  // transition when they arrive, which is what makes a filter change feel like it landed.
  const signature = loaded.query;
  const colorOptions = [
    ...COLOR_GRADES,
    ...(hasLowerColors ? [LOWER_COLORS] : []),
    ...(hasFancy ? [FANCY] : []),
  ] as Filters["colors"];

  const sortGroups = SORT_GROUPS.map((g) => ({
    ...g,
    sorts: g.sorts.filter((key) => key !== "recent" || hasDates),
  }));

  return (
    <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-12">
      <FilterPanel activeCount={active.length}>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl">Filter</h2>
          {active.length > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="text-[13px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
            >
              Clear {active.length}
            </button>
          ) : null}
        </div>

        <SearchBox
          value={filters.query}
          placeholder="Search SKU, shape or colour"
          onChange={setQuery}
        />

        <QuickPicks
          presets={PRESETS.filter((p) => p.values[0] !== FANCY || hasFancy).map((preset) => {
            const on = presetActive(filters, preset);
            return {
              label: preset.label,
              active: on,
              onToggle: () =>
                update((prev) => ({ ...prev, [preset.key]: on ? [] : [...preset.values] })),
            };
          })}
        />

        <ShapeFilter
          selected={filters.shapes}
          counts={counts.shapes}
          onToggle={(slug) => toggle("shapes", slug)}
        />

        <NumberRange
          label="Carat"
          bounds={bounds.carat}
          value={filters.ranges.carat}
          onChange={setRange("carat")}
        />

        <ChipSet
          label="Colour"
          options={colorOptions}
          optionLabel={(v) => optionName("colors", v)}
          selected={filters.colors}
          counts={counts.colors}
          onToggle={(v) => toggle("colors", v)}
        />
        {hasFancy ? (
          <ChipSet
            label="Fancy colour hue"
            options={FANCY_HUES.filter((h) => counts.hues[h] || filters.hues.includes(h))}
            selected={filters.hues}
            counts={counts.hues}
            onToggle={(v) => toggle("hues", v)}
          />
        ) : null}
        <ChipSet
          label="Clarity"
          options={CLARITY_GRADES}
          selected={filters.clarities}
          counts={counts.clarities}
          onToggle={(v) => toggle("clarities", v)}
        />
        <ChipSet
          label="Cut"
          hint="Graded on round brilliants only."
          options={FINISH_GRADES}
          selected={filters.cuts}
          counts={counts.cuts}
          onToggle={(v) => toggle("cuts", v)}
        />
        <ChipSet
          label="Certificate"
          options={LABS}
          selected={filters.labs}
          counts={counts.labs}
          onToggle={(v) => toggle("labs", v)}
        />

        <MoreFilters activeCount={moreActive}>
          <ChipSet
            label="Polish"
            options={FINISH_GRADES}
            selected={filters.polishes}
            counts={counts.polishes}
            onToggle={(v) => toggle("polishes", v)}
          />
          <ChipSet
            label="Symmetry"
            options={FINISH_GRADES}
            selected={filters.symmetries}
            counts={counts.symmetries}
            onToggle={(v) => toggle("symmetries", v)}
          />
          <ChipSet
            label="Fluorescence"
            options={FLUORESCENCE}
            selected={filters.fluorescences}
            counts={counts.fluorescences}
            onToggle={(v) => toggle("fluorescences", v)}
          />
          <NumberRange
            label="Table"
            unit="%"
            step={0.5}
            bounds={bounds.table}
            value={filters.ranges.table}
            onChange={setRange("table")}
          />
          <NumberRange
            label="Depth"
            unit="%"
            step={0.5}
            bounds={bounds.depth}
            value={filters.ranges.depth}
            onChange={setRange("depth")}
          />
          <NumberRange
            label="Length to width"
            step={0.01}
            bounds={bounds.ratio}
            value={filters.ranges.ratio}
            onChange={setRange("ratio")}
          />
          <p className="mt-2 text-[11px] text-ink-muted">
            1.00 is square or round; ovals and pears usually sit between 1.30 and 1.60.
          </p>
        </MoreFilters>
      </FilterPanel>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-hairline pb-5">
          <p aria-live="polite" className="text-[15px]">
            {loaded.count.toLocaleString()} {loaded.count === 1 ? "stone" : "stones"}
            {loaded.count !== total ? (
              <span className="text-ink-muted"> of {total.toLocaleString()}</span>
            ) : null}
          </p>
          <SortSelect value={sort} labels={SORTS} groups={sortGroups} onChange={setSort} />
          {loaded.count > 0 ? (
            <a
              href={sheetHref}
              download
              className="text-[13px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
            >
              Download spec sheet (PDF)
            </a>
          ) : null}
          {notice ? <p className="w-full text-[13px] text-ink-muted">{notice}</p> : null}
          {failedQuery === query ? (
            <p role="alert" className="w-full text-[13px] text-ink-muted">
              The list could not be updated.{" "}
              <button
                type="button"
                onClick={retry}
                className="underline underline-offset-4 transition-colors duration-200 hover:text-ink"
              >
                Try again
              </button>
            </p>
          ) : null}
        </div>

        <ActiveFilters items={active} onRemove={remove} onClear={clearAll} />

        {loaded.count === 0 ? (
          <div className="mt-10 rounded-[22px] border border-hairline bg-panel p-8">
            <h3 className="font-display text-2xl">Nothing matches that combination</h3>
            <p className="measure mt-2 text-[15px] text-ink-muted-panel">
              Widen a range or remove one of the filters above. We also source to order, so tell
              us what you are looking for and we will go and find it.
            </p>
          </div>
        ) : (
          <motion.div
            key={signature}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            aria-busy={loading}
            className={`mt-8 transition-opacity duration-200 ${loading ? "opacity-50" : ""}`}
          >
            <StoneGrid
              stones={loaded.stones}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            />
          </motion.div>
        )}

        {loaded.stones.length < loaded.count ? (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-[13px] text-ink-muted">
              {more === "failed"
                ? "Those stones could not be loaded."
                : `Showing ${loaded.stones.length.toLocaleString()} of ${loaded.count.toLocaleString()}`}
            </p>
            <button
              type="button"
              onClick={showMore}
              disabled={more === "loading" || loading}
              className="rounded-full border border-ink px-8 py-3 text-[15px] transition-colors duration-200 hover:bg-ink hover:text-white disabled:opacity-50"
            >
              {more === "failed"
                ? "Try again"
                : more === "loading"
                  ? "Loading…"
                  : `Show ${Math.min(CATALOG_PAGE_SIZE, loaded.count - loaded.stones.length)} more`}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

