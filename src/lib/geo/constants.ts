/**
 * Geo constants with no dependencies of their own.
 *
 * Split out of `cookie.ts` so the pre-paint script component can import the
 * cookie name without pulling `i18n-iso-countries` along with it. That module
 * is fine on the server and in the badge's bundle, but the inline script runs
 * in `<head>` on every page and has no business carrying a country-name table.
 */

export const GEO_COOKIE = "isg_geo";

/** A week. Country changes are rare, and a wrong flag is cheap and self-correcting. */
export const GEO_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/**
 * How long a cached answer is treated as current.
 *
 * Shorter than the cookie's own lifetime so that a visitor who has moved gets
 * re-resolved while still being served the previous answer instantly in the
 * meantime — the stale value paints, the fresh one replaces it.
 */
export const GEO_CACHE_TTL_SECONDS = 60 * 60 * 24;
