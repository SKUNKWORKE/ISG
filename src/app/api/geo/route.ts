import { NextResponse, type NextRequest } from "next/server";
import {
  confidenceForSource,
  encodeGeoCookie,
  GEO_COOKIE,
  GEO_COOKIE_OPTIONS,
} from "@/lib/geo/cookie";
import { countryName, normaliseCountryCode } from "@/lib/geo/countries";
import { countryHemisphere } from "@/lib/geo/hemisphere";
import { resolveVisitorCountry } from "@/lib/geo/resolve";
import { getSeasonalTheme } from "@/lib/geo/season";
import type { GeoResponse } from "@/lib/geo/types";

/**
 * The authoritative country lookup, called by the client after first paint.
 *
 * The proxy deliberately skips the network fallback to stay out of the render
 * path, so a visitor behind no CDN and with no local database gets `unknown`
 * from it. This route is where that case is finished off: it runs the full
 * chain, network step included, and writes the result back to the same cookie
 * the proxy uses.
 *
 * It also accepts the client's own browser-derived guess. That guess is never
 * trusted over an IP-derived answer — it is only used when the server has
 * nothing at all, which is the ordinary situation in local development and for
 * visitors whose address resolves to nowhere.
 */

// The lookup needs the filesystem and Node networking for the MaxMind and
// fallback sources, matching the runtime the other route handlers declare.
export const runtime = "nodejs";

// The response depends on the caller's IP and must never be prerendered or
// shared between visitors.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const fresh = url.searchParams.get("fresh") === "1";

  const resolved = await resolveVisitorCountry(request, { allowNetwork: true, fresh });

  // The client may pass what it inferred from navigator.language / timezone.
  // It is a fallback of last resort, so it is only consulted when every
  // server-side source came back empty.
  let country = resolved;
  if (!country.countryCode) {
    const hinted = normaliseCountryCode(url.searchParams.get("hint"));
    const hintSource = url.searchParams.get("hintSource");
    if (hinted && (hintSource === "browser-locale" || hintSource === "browser-timezone")) {
      country = {
        countryCode: hinted,
        countryName: countryName(hinted),
        hemisphere: countryHemisphere(hinted),
        confidence: confidenceForSource(hintSource),
        source: hintSource,
      };
    }
  }

  const now = new Date();
  const body: GeoResponse = {
    ...country,
    // Computed from the server clock so a device with a wrong date still gets
    // the season its actual location is in.
    theme: getSeasonalTheme(country.hemisphere, now),
    resolvedAt: now.toISOString(),
  };

  const response = NextResponse.json(body);

  // Only cache a genuine, IP-derived answer. Caching a browser hint would let a
  // low-confidence guess outlive the page that produced it.
  if (country.countryCode && country.confidence !== "low") {
    response.cookies.set(GEO_COOKIE, encodeGeoCookie(country, now), GEO_COOKIE_OPTIONS);
  }

  // Per-visitor data: never store it in a shared cache.
  response.headers.set("cache-control", "private, no-store");
  return response;
}
