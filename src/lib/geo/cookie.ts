import { GEO_CACHE_TTL_SECONDS, GEO_COOKIE_MAX_AGE } from "./constants";
import { countryName, normaliseCountryCode } from "./countries";
import { countryHemisphere } from "./hemisphere";
import type { Confidence, GeoSource, Hemisphere, VisitorCountry } from "./types";

/**
 * The resolved country, cached in a cookie.
 *
 * Deliberately not a session or a signed token. It holds a country code, the
 * source that produced it and a timestamp — nothing that identifies a person,
 * and specifically not the IP address it was derived from. It is readable by
 * client script on purpose: the pre-paint theme script needs it before any
 * JavaScript bundle has loaded, which rules out `httpOnly`.
 *
 * Format is `CC|H|source|epochSeconds`, parsed defensively. A cookie is
 * user-editable, so a tampered value must degrade to "unknown" rather than
 * reaching the UI unchecked.
 *
 * `H` is the hemisphere as a single letter. It is redundant on the server,
 * which derives it from the country code and ignores the stored value, and it
 * exists purely so the pre-paint script can pick a theme without shipping the
 * country-to-hemisphere dataset into an inline script tag.
 */

// Re-exported so existing importers of this module keep working; the values
// themselves live in constants.ts, which has no dependencies.
export { GEO_COOKIE, GEO_COOKIE_MAX_AGE, GEO_CACHE_TTL_SECONDS } from "./constants";

const SOURCES: readonly GeoSource[] = [
  "cdn-header",
  "maxmind",
  "ip-service",
  "browser-locale",
  "browser-timezone",
  "cache",
  "none",
];

/** Confidence is derived from the source rather than stored, so the two can't disagree. */
export function confidenceForSource(source: GeoSource): Confidence {
  switch (source) {
    case "cdn-header":
    case "maxmind":
      return "high";
    case "ip-service":
      return "medium";
    case "browser-locale":
    case "browser-timezone":
      return "low";
    default:
      return "none";
  }
}

export type CachedGeo = VisitorCountry & { age: number };

/** Single-letter hemisphere, so the pre-paint script can read it without a lookup table. */
const HEMISPHERE_LETTER: Record<Hemisphere, string> = {
  northern: "n",
  southern: "s",
  equatorial: "e",
  unknown: "u",
};

export function encodeGeoCookie(country: VisitorCountry, now: Date = new Date()): string {
  const seconds = Math.floor(now.getTime() / 1000);
  const hemisphere = HEMISPHERE_LETTER[country.hemisphere];
  return `${country.countryCode ?? ""}|${hemisphere}|${country.source}|${seconds}`;
}

/**
 * Parses a geo cookie, returning null for anything malformed or expired.
 *
 * The country name and hemisphere are recomputed from the code rather than
 * read from the cookie: they are derived values, and deriving them again is
 * cheaper than validating that someone hasn't edited them apart.
 */
export function decodeGeoCookie(value: string | undefined | null, now: Date = new Date()): CachedGeo | null {
  if (!value) return null;

  // The hemisphere field is skipped: it is recomputed from the country code
  // below, so an edited value can't reach anything that matters.
  const [rawCode, , rawSource, rawSeconds] = value.split("|");
  const seconds = Number.parseInt(rawSeconds ?? "", 10);
  if (!Number.isFinite(seconds)) return null;

  const age = Math.floor(now.getTime() / 1000) - seconds;
  // A negative age means a clock skew or an edited timestamp; treat as absent.
  if (age < 0 || age > GEO_CACHE_TTL_SECONDS) return null;

  const countryCode = normaliseCountryCode(rawCode);
  const source = (SOURCES as readonly string[]).includes(rawSource ?? "")
    ? (rawSource as GeoSource)
    : "none";

  // A cookie claiming a source but no country is incoherent — drop it.
  if (!countryCode && source !== "none") return null;

  return {
    countryCode,
    countryName: countryName(countryCode),
    hemisphere: countryHemisphere(countryCode),
    confidence: confidenceForSource(source),
    source,
    age,
  };
}

/** Options shared by every place that writes the cookie, so they can't drift apart. */
export const GEO_COOKIE_OPTIONS = {
  path: "/",
  maxAge: GEO_COOKIE_MAX_AGE,
  sameSite: "lax",
  // Readable by the pre-paint theme script; see the note at the top of this file.
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
} as const;
