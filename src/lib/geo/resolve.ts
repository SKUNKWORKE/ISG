import "server-only";

import { extractClientIp, type HeaderSource } from "./client-ip";
import { confidenceForSource, decodeGeoCookie, GEO_COOKIE } from "./cookie";
import { countryName } from "./countries";
import { countryHemisphere } from "./hemisphere";
import { countryFromCdnHeaders } from "./sources/cdn-headers";
import { countryFromIpService } from "./sources/ip-service";
import { countryFromMaxmind } from "./sources/maxmind";
import { UNKNOWN_VISITOR, type CountryCode, type GeoSource, type VisitorCountry } from "./types";

/**
 * The server half of the detection chain.
 *
 * Order is cheapest-and-most-reliable first: a header the CDN already
 * populated, then an in-process database lookup, then — only if neither is
 * available — a network call. Each step is allowed to fail silently, and the
 * function always returns a usable object.
 *
 * The visitor's IP is read here and never leaves the function. It is passed to
 * a local lookup or, in the fallback case, to the IP service being queried
 * about it; it is not logged, returned, or written to the cookie.
 */

type RequestLike = {
  headers: HeaderSource;
  cookies?: { get(name: string): { value: string } | undefined };
};

export type ResolveOptions = {
  /**
   * Skip the network fallback.
   *
   * Set for the proxy, which runs ahead of every page render: a request that
   * might block for a second on a third-party API has no business sitting in
   * that path. The API route, which the client calls in the background, allows it.
   */
  allowNetwork?: boolean;
  /** Ignore any cached cookie and re-run the chain. */
  fresh?: boolean;
};

function describe(code: CountryCode | null, source: GeoSource): VisitorCountry {
  if (!code) return UNKNOWN_VISITOR;
  return {
    countryCode: code,
    countryName: countryName(code),
    hemisphere: countryHemisphere(code),
    confidence: confidenceForSource(source),
    source,
  };
}

/**
 * Resolve a visitor's country from a request.
 *
 * Never throws and never rejects: every source is individually guarded, so the
 * worst case is `UNKNOWN_VISITOR` and a neutral theme.
 */
export async function resolveVisitorCountry(
  request: RequestLike,
  { allowNetwork = true, fresh = false }: ResolveOptions = {},
): Promise<VisitorCountry> {
  // 0. A recent answer already in the cookie, unless the caller wants it re-run.
  if (!fresh) {
    const cached = decodeGeoCookie(request.cookies?.get(GEO_COOKIE)?.value);
    if (cached?.countryCode) {
      // Keep the original source so confidence survives the round trip, rather
      // than everything degrading to "cache" on the second page view.
      return {
        countryCode: cached.countryCode,
        countryName: cached.countryName,
        hemisphere: cached.hemisphere,
        confidence: cached.confidence,
        source: cached.source === "none" ? "cache" : cached.source,
      };
    }
  }

  // 1. The CDN already did the lookup to route this request.
  const fromHeader = countryFromCdnHeaders(request.headers);
  if (fromHeader) return describe(fromHeader, "cdn-header");

  // Below here an address is required. In local development there isn't one,
  // which is why the badge shows nothing until the client's browser signals
  // arrive rather than reporting the server's own location.
  const ip = extractClientIp(request.headers);
  if (!ip) return UNKNOWN_VISITOR;

  // 2. Self-hosted database: in-process, no network, no rate limit.
  try {
    const fromDb = await countryFromMaxmind(ip);
    if (fromDb) return describe(fromDb, "maxmind");
  } catch {
    // Guarded inside the source too; this is belt and braces around a
    // filesystem-backed dependency that must never break a render.
  }

  // 3. Free keyless services, last because they are the slowest and the only
  //    step that depends on somebody else being up.
  if (allowNetwork) {
    try {
      const fromService = await countryFromIpService(ip);
      if (fromService) return describe(fromService, "ip-service");
    } catch {
      // Same reasoning as above.
    }
  }

  // 4. Nothing worked. The client will try browser signals and, failing those,
  //    the page stays on the neutral theme with no badge.
  return UNKNOWN_VISITOR;
}
