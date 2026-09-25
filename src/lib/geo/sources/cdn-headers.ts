import type { HeaderSource } from "../client-ip";
import { normaliseCountryCode } from "../countries";
import type { CountryCode } from "../types";

/**
 * Country headers written by whatever CDN sits in front of the app.
 *
 * This is the cheapest high-confidence source there is: the edge already did an
 * IP lookup to route the request, and it costs a header read to reuse the
 * answer. No database, no network call, no rate limit.
 *
 * Reading a header that several vendors happen to set is not lock-in — nothing
 * depends on it. When no CDN is in front of the app none of these are present,
 * the function returns null, and the chain moves on to the local database.
 */

const COUNTRY_HEADERS = [
  "cf-ipcountry", // Cloudflare
  "x-vercel-ip-country", // Vercel
  "x-nf-client-connection-country", // Netlify
  "fastly-geo-country", // Fastly (when configured)
  "x-geo-country", // common reverse-proxy convention
  "x-appengine-country", // Google App Engine
  "cloudfront-viewer-country", // AWS CloudFront
] as const;

/**
 * Cloudflare sends this for requests it can't place — Tor exits, some
 * anonymising proxies. It is a real header value, not a country, and treating
 * it as one would put "XX" in the badge.
 */
const NOT_A_COUNTRY = new Set(["XX", "T1", "ZZ"]);

export function countryFromCdnHeaders(headers: HeaderSource): CountryCode | null {
  for (const name of COUNTRY_HEADERS) {
    const raw = headers.get(name);
    if (!raw) continue;
    const value = raw.trim().toUpperCase();
    if (NOT_A_COUNTRY.has(value)) continue;
    const code = normaliseCountryCode(value);
    if (code) return code;
  }
  return null;
}
