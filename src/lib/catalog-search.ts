import "server-only";
import {
  CATALOG_PAGE_SIZE,
  facetCounts,
  filterStones,
  filtersFromParams,
  filtersToParams,
  stoneBounds,
  type Bounds,
  type CatalogPage,
  type CatalogSummary,
  type FacetCounts,
  type Filters,
  type Sort,
} from "./catalog-filter";
import { addedKey, isColorGrade, isLowerColor, stonesFor, type Origin, type Stone } from "./stones";

/**
 * Catalogue search, run on the server for the page's first render and for
 * /api/stones after that. The browser never holds the stock list itself.
 */

const SUMMARIES = new Map<Origin, CatalogSummary>();

/** Worked out once per origin: the stock lists only change with a deploy. */
export function catalogSummary(origin: Origin): CatalogSummary {
  let summary = SUMMARIES.get(origin);
  if (!summary) {
    const stones = stonesFor(origin);
    summary = {
      total: stones.length,
      bounds: stoneBounds(stones),
      hasDates: stones.some((s) => addedKey(s) > 0),
      hasFancy: stones.some((s) => !isColorGrade(s.color) && !isLowerColor(s.color)),
      hasLowerColors: stones.some((s) => isLowerColor(s.color)),
    };
    SUMMARIES.set(origin, summary);
  }
  return summary;
}

/**
 * Recent searches, most recently used last.
 *
 * Filtering and sorting runs over every stone of an origin — tens of
 * thousands — and the same search is asked for again and again: by "Show
 * more", which wants the next page of the list it just sorted, by the spec
 * sheet for the view on screen, and by every visitor who opens the catalogue
 * without filters. The stock is fixed for the life of the process, so a
 * result never goes stale. An entry is an array of references into the stock
 * list, not copies of the stones; the cap bounds the memory at a few MB.
 */
type Result = { matched: Stone[]; counts?: FacetCounts };
const RESULTS = new Map<string, Result>();
const MAX_RESULTS = 32;

function cachedResult(origin: Origin, filters: Filters, sort: Sort, bounds: Bounds): Result {
  // The canonical query string: the same search spelled two ways shares an entry.
  const key = `${origin}?${filtersToParams(filters, sort, bounds)}`;
  let result = RESULTS.get(key);
  if (result) {
    RESULTS.delete(key);
  } else {
    result = { matched: filterStones(stonesFor(origin), filters, sort, bounds) };
    if (RESULTS.size >= MAX_RESULTS) RESULTS.delete(RESULTS.keys().next().value as string);
  }
  RESULTS.set(key, result);
  return result;
}

/** Every stone matching `params`, in the requested order. */
export function matchingStones(origin: Origin, params: URLSearchParams): Stone[] {
  const { bounds } = catalogSummary(origin);
  const { filters, sort } = filtersFromParams(params, bounds);
  return cachedResult(origin, filters, sort, bounds).matched;
}

/**
 * One page of the stones matching `params` (the catalogue's own query string).
 * Facet counts come with the first page only; later pages just extend the list.
 */
export function searchCatalog(
  origin: Origin,
  params: URLSearchParams,
  offset = 0,
  limit = CATALOG_PAGE_SIZE,
): CatalogPage {
  const { bounds } = catalogSummary(origin);
  const { filters, sort } = filtersFromParams(params, bounds);
  const result = cachedResult(origin, filters, sort, bounds);
  if (offset === 0 && !result.counts) result.counts = facetCounts(stonesFor(origin), filters, bounds);
  return {
    count: result.matched.length,
    stones: result.matched.slice(offset, offset + limit),
    counts: offset === 0 ? result.counts : undefined,
  };
}
