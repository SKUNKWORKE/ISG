"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { m } from "framer-motion";
import { JewelryGrid } from "./jewelry-grid";
import { CATALOG_PENDING_ATTRIBUTE } from "./catalog-address-script";
import {
  ActiveFilters,
  ChipSet,
  FilterPanel,
  MoreFilters,
  NumberRange,
  SearchBox,
  ShapeFilter,
  SortSelect,
} from "./catalog-controls";
import {
  CATEGORY_PLURAL,
  JEWELRY_CATEGORIES,
  JEWELRY_RANGE_KEYS,
  LAYOUTS,
  LAYOUT_NAME,
  METAL_NAME,
  METALS,
  PURITIES,
  SORTS,
  SORT_GROUPS,
  activeJewelryFilterList,
  emptyJewelryFilters,
  filterJewelry,
  jewelryBounds,
  jewelryFacetCounts,
  jewelryFiltersFromParams,
  jewelryFiltersToParams,
  type JewelSummary,
  type JewelryFilters,
  type JewelryListKey,
  type JewelryRangeKey,
  type Sort,
} from "@/lib/jewelry";

const PAGE = 12;

/** The stone Catalog's layout and behaviour, filtered on jewelry's own attributes. */
export function JewelryCatalog({
  items,
  initialQuery = "",
  notice,
}: {
  items: JewelSummary[];
  /**
   * The query the server rendered, e.g. `type=ring`; empty on the prerendered
   * page. Filters and sort round-trip through the address bar, whose own query
   * is applied once the page is in the browser.
   */
  initialQuery?: string;
  notice?: string;
}) {
  const bounds = useMemo(() => jewelryBounds(items), [items]);
  const empty = useMemo(() => emptyJewelryFilters(bounds), [bounds]);
  const [initial] = useState(() => jewelryFiltersFromParams(new URLSearchParams(initialQuery), bounds));

  const [filters, setFilters] = useState<JewelryFilters>(initial.filters);
  const [sort, setSortState] = useState<Sort>(initial.sort);
  const [visible, setVisible] = useState(PAGE);

  // The page is prerendered without filters so the CDN can serve it whole; a
  // filtered address is applied here, once in the browser. Filtering runs
  // locally, so its results are on screen in the same pass and the pre-paint
  // dimming can go at once.
  const [addressRead, setAddressRead] = useState(false);
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search);
    if (wanted.toString() !== initialQuery) {
      const next = jewelryFiltersFromParams(wanted, bounds);
      setFilters(next.filters);
      setSortState(next.sort);
    }
    setAddressRead(true);
    document.documentElement.removeAttribute(CATALOG_PENDING_ATTRIBUTE);
  }, [bounds, initialQuery]);

  const update = useCallback((change: (prev: JewelryFilters) => JewelryFilters) => {
    setFilters(change);
    setVisible(PAGE);
  }, []);

  function toggle<K extends JewelryListKey>(key: K, value: JewelryFilters[K][number]) {
    update((prev) => {
      const list = prev[key] as string[];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [key]: next };
    });
  }

  const setRange = (key: JewelryRangeKey) => (value: [number, number]) =>
    update((prev) => ({ ...prev, ranges: { ...prev.ranges, [key]: value } }));

  const setQuery = useCallback((query: string) => update((prev) => ({ ...prev, query })), [update]);

  function setSort(next: Sort) {
    setSortState(next);
    setVisible(PAGE);
  }

  const results = useMemo(
    () => filterJewelry(items, filters, sort, bounds),
    [items, filters, sort, bounds],
  );
  const counts = useMemo(() => jewelryFacetCounts(items, filters, bounds), [items, filters, bounds]);
  const active = activeJewelryFilterList(filters, bounds);
  const moreActive = active.filter((a) => a.key === "layouts" || a.key === "center" || a.key === "count").length;

  const query = jewelryFiltersToParams(filters, sort, bounds).toString();
  // The sheet covers every matching piece, not just the page shown so far.
  const sheetHref = `/spec-sheet/jewelry${query ? `?${query}` : ""}`;

  // Keep the address bar in step so the current view can be bookmarked or shared.
  useEffect(() => {
    if (!addressRead) return;
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, "", url);
    }
  }, [query, addressRead]);

  function remove(id: string) {
    const item = active.find((a) => a.id === id);
    if (!item) return;
    if (item.key === "query") return setQuery("");
    if ((JEWELRY_RANGE_KEYS as readonly string[]).includes(item.key)) {
      const key = item.key as JewelryRangeKey;
      return setRange(key)(bounds[key]);
    }
    toggle(item.key as JewelryListKey, item.value as never);
  }

  const clearAll = () => update(() => empty);

  // Re-keying the grid on the filter signature replays the entry transition.
  const signature = JSON.stringify([filters, sort]);

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

        <SearchBox value={filters.query} placeholder="Search name or SKU" onChange={setQuery} />

        <ChipSet
          label="Type"
          options={JEWELRY_CATEGORIES}
          selected={filters.categories}
          onToggle={(v) => toggle("categories", v)}
          optionLabel={(v) => CATEGORY_PLURAL[v]}
          counts={counts.categories}
        />

        <ShapeFilter
          selected={filters.shapes}
          counts={counts.shapes}
          onToggle={(slug) => toggle("shapes", slug)}
        />

        <NumberRange
          label="Total carat"
          bounds={bounds.carat}
          value={filters.ranges.carat}
          onChange={setRange("carat")}
        />

        <ChipSet
          label="Metal"
          options={METALS}
          selected={filters.metals}
          onToggle={(v) => toggle("metals", v)}
          optionLabel={(v) => METAL_NAME[v]}
          counts={counts.metals}
        />
        <ChipSet
          label="Purity"
          options={PURITIES}
          selected={filters.purities}
          onToggle={(v) => toggle("purities", v)}
          counts={counts.purities}
        />

        <MoreFilters activeCount={moreActive}>
          <ChipSet
            label="Stone layout"
            options={LAYOUTS}
            selected={filters.layouts}
            onToggle={(v) => toggle("layouts", v)}
            optionLabel={(v) => LAYOUT_NAME[v]}
            counts={counts.layouts}
          />
          <NumberRange
            label="Centre stone"
            unit="ct"
            bounds={bounds.center}
            value={filters.ranges.center}
            onChange={setRange("center")}
          />
          <NumberRange
            label="Diamond count"
            step={1}
            bounds={bounds.count}
            value={filters.ranges.count}
            onChange={setRange("count")}
          />
          <p className="mt-2 text-[11px] text-ink-muted">
            Narrowing either range leaves out pieces whose listing doesn&rsquo;t state it.
          </p>
        </MoreFilters>
      </FilterPanel>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-hairline pb-5">
          <p aria-live="polite" className="text-[15px]" data-catalog-results="">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
            {results.length !== items.length ? (
              <span className="text-ink-muted"> of {items.length}</span>
            ) : null}
          </p>
          <SortSelect value={sort} labels={SORTS} groups={SORT_GROUPS} onChange={setSort} />
          {results.length > 0 ? (
            <a
              href={sheetHref}
              rel="nofollow"
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
              Widen a range or remove one of the filters above. We also make to order, so tell us
              the piece you have in mind and we will quote for it.
            </p>
          </div>
        ) : (
          <m.div
            key={signature}
            data-catalog-results=""
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-8"
          >
            <JewelryGrid
              items={results.slice(0, visible)}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            />
          </m.div>
        )}

        {visible < results.length ? (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-[13px] text-ink-muted">
              Showing {visible} of {results.length}
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
