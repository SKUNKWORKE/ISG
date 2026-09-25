"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  CLARITY_GRADES,
  COLOR_GRADES,
  FLUORESCENCE,
  LABS,
  addedKey,
  isColorGrade,
  type Origin,
  type Stone,
} from "@/lib/stones";
import {
  FANCY,
  FANCY_HUES,
  FINISH_GRADES,
  PRESETS,
  RANGE_KEYS,
  SORTS,
  SORT_GROUPS,
  activeFilterList,
  emptyFilters,
  facetCounts,
  filterStones,
  filtersFromParams,
  filtersToParams,
  presetActive,
  stoneBounds,
  type Filters,
  type ListKey,
  type Range,
  type RangeKey,
  type Sort,
} from "@/lib/catalog-filter";

const PAGE = 12;

const MORE_KEYS: (ListKey | RangeKey)[] = ["polishes", "symmetries", "fluorescences", "table", "depth", "ratio"];

export function Catalog({
  stones,
  origin,
  initialQuery = "",
  notice,
}: {
  stones: Stone[];
  origin: Origin;
  /**
   * The page's query string. Every filter and the sort round-trip through it,
   * so guide links (`?color=D,E`), shared URLs and the PDF sheet all agree.
   */
  initialQuery?: string;
  notice?: string;
}) {
  const bounds = useMemo(() => stoneBounds(stones), [stones]);
  const empty = useMemo(() => emptyFilters(bounds), [bounds]);
  const [initial] = useState(() => filtersFromParams(new URLSearchParams(initialQuery), bounds));

  const [filters, setFilters] = useState<Filters>(initial.filters);
  const [sort, setSortState] = useState<Sort>(initial.sort);
  const [visible, setVisible] = useState(PAGE);
  const hasDates = useMemo(() => stones.some((s) => addedKey(s) > 0), [stones]);
  const hasFancy = useMemo(() => stones.some((s) => !isColorGrade(s.color)), [stones]);

  const update = useCallback((change: (prev: Filters) => Filters) => {
    setFilters(change);
    setVisible(PAGE);
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
    setVisible(PAGE);
  }

  const results = useMemo(
    () => filterStones(stones, filters, sort, bounds),
    [stones, filters, sort, bounds],
  );
  const counts = useMemo(() => facetCounts(stones, filters, bounds), [stones, filters, bounds]);
  const active = activeFilterList(filters, bounds);
  const moreActive = active.filter((a) => MORE_KEYS.includes(a.key as ListKey)).length;

  const query = filtersToParams(filters, sort, bounds).toString();
  // The sheet covers every matching stone, not just the page shown so far.
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

  // Re-keying the grid on the filter signature replays the entry transition,
  // which is what makes a filter change feel like it landed.
  const signature = JSON.stringify([filters, sort]);

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
          options={hasFancy ? [...COLOR_GRADES, FANCY] : COLOR_GRADES}
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
            {results.length.toLocaleString()} {results.length === 1 ? "stone" : "stones"}
            {results.length !== stones.length ? (
              <span className="text-ink-muted"> of {stones.length.toLocaleString()}</span>
            ) : null}
          </p>
          <SortSelect value={sort} labels={SORTS} groups={sortGroups} onChange={setSort} />
          {results.length > 0 ? (
            <a
              href={sheetHref}
              download
              className="text-[13px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
            >
              Download spec sheet (PDF)
            </a>
          ) : null}
          {notice ? <p className="w-full text-[13px] text-ink-muted">{notice}</p> : null}
        </div>

        <ActiveFilters items={active} onRemove={remove} onClear={clearAll} />

        {results.length === 0 ? (
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
            className="mt-8"
          >
            <StoneGrid
              stones={results.slice(0, visible)}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            />
          </motion.div>
        )}

        {visible < results.length ? (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-[13px] text-ink-muted">
              Showing {visible} of {results.length.toLocaleString()}
            </p>
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE)}
              className="rounded-full border border-ink px-8 py-3 text-[15px] transition-colors duration-200 hover:bg-ink hover:text-white"
            >
              Show {Math.min(PAGE, results.length - visible)} more
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

