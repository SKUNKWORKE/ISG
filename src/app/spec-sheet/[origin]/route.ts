import { describeFilters, filterStones, filtersFromParams, stoneBounds } from "@/lib/catalog-filter";
import {
  describeJewelryFilters,
  filterJewelry,
  jewelryBounds,
  jewelryFiltersFromParams,
} from "@/lib/jewelry";
import { JEWELRY_SUMMARIES } from "@/lib/real-jewelry";
import { pdfResponse, renderCatalogueSheet, renderJewelryCatalogueSheet } from "@/lib/spec-sheet";
import { stonesFor } from "@/lib/stones";

export const runtime = "nodejs";

/**
 * GET /spec-sheet/natural, /spec-sheet/lab-grown or /spec-sheet/jewelry, with
 * the catalogue's filters as query params.
 */
export async function GET(request: Request, { params }: { params: Promise<{ origin: string }> }) {
  const { origin: slug } = await params;
  const search = new URL(request.url).searchParams;
  const preparedAt = new Date();

  if (slug === "jewelry") {
    const bounds = jewelryBounds(JEWELRY_SUMMARIES);
    const { filters, sort } = jewelryFiltersFromParams(search, bounds);
    const pdf = renderJewelryCatalogueSheet({
      items: filterJewelry(JEWELRY_SUMMARIES, filters, sort, bounds),
      summary: describeJewelryFilters(filters, sort, bounds),
      preparedAt,
    });
    return pdfResponse(pdf, "imperial-star-gems-jewelry", preparedAt);
  }

  const origin = slug === "natural" ? "natural" : slug === "lab-grown" ? "lab" : undefined;
  if (!origin) return new Response("Not found", { status: 404 });

  const all = stonesFor(origin);
  const bounds = stoneBounds(all);
  const { filters, sort } = filtersFromParams(search, bounds);

  const pdf = renderCatalogueSheet({
    stones: filterStones(all, filters, sort, bounds),
    origin,
    summary: describeFilters(filters, sort, bounds),
    preparedAt,
  });
  return pdfResponse(pdf, `imperial-star-gems-${slug}`, preparedAt);
}
