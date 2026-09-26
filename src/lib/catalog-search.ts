import "server-only";
import {
  CATALOG_PAGE_SIZE,
  facetCounts,
  filterStones,
  filtersFromParams,
  stoneBounds,
  type CatalogPage,
  type CatalogSummary,
} from "./catalog-filter";
import { addedKey, isColorGrade, isLowerColor, stonesFor, type Origin } from "./stones";

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
 * One page of the stones matching `params` (the catalogue's own query string).
 * Facet counts come with the first page only; later pages just extend the list.
 */
export function searchCatalog(
  origin: Origin,
  params: URLSearchParams,
  offset = 0,
  limit = CATALOG_PAGE_SIZE,
): CatalogPage {
  const stones = stonesFor(origin);
  const { bounds } = catalogSummary(origin);
  const { filters, sort } = filtersFromParams(params, bounds);
  const matched = filterStones(stones, filters, sort, bounds);
  return {
    count: matched.length,
    stones: matched.slice(offset, offset + limit),
    counts: offset === 0 ? facetCounts(stones, filters, bounds) : undefined,
  };
}
