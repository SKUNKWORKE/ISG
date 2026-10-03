import { NextResponse } from "next/server";
import { CATALOG_PAGE_SIZE } from "@/lib/catalog-filter";
import { searchCatalog } from "@/lib/catalog-search";

export const runtime = "nodejs";

const MAX_LIMIT = 48;

/**
 * The answer depends only on the URL, and the stock only changes with a
 * deploy, which starts the CDN's cache afresh. So the CDN keeps each answer
 * for a day and serves it to every visitor asking the same question — the
 * unfiltered list, a shape, a colour range — without running this function.
 * Browsers keep it for five minutes, which covers going back and forth
 * between filters.
 */
const CACHE_CONTROL = "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800";

function whole(value: string | null, fallback: number, min: number, max: number) {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

/**
 * GET /api/stones?origin=lab|natural&<catalogue filters>&offset=0&limit=12
 *
 * One page of catalogue results for the browser. The filters are the same
 * query params the catalogue pages and spec sheets read.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const origin = params.get("origin");
  if (origin !== "natural" && origin !== "lab") {
    return NextResponse.json({ error: "origin must be natural or lab" }, { status: 400 });
  }
  const offset = whole(params.get("offset"), 0, 0, Number.MAX_SAFE_INTEGER);
  const limit = whole(params.get("limit"), CATALOG_PAGE_SIZE, 1, MAX_LIMIT);
  const response = NextResponse.json(searchCatalog(origin, params, offset, limit));
  response.headers.set("Cache-Control", CACHE_CONTROL);
  return response;
}
