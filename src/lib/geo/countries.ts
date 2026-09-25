import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import type { CountryCode } from "./types";

/**
 * ISO 3166-1 names, from i18n-iso-countries rather than a hand-kept map.
 *
 * Only the English locale is registered. The package ships every language, and
 * importing them all would pull a few hundred kilobytes into the bundle to
 * serve a two-word label in a corner badge. If the badge is ever localised,
 * register the extra locales here rather than at the call site.
 */

countries.registerLocale(en as Parameters<typeof countries.registerLocale>[0]);

/** True for a syntactically valid, currently assigned alpha-2 code. */
export function isValidCountryCode(code: unknown): code is CountryCode {
  if (typeof code !== "string" || !/^[A-Za-z]{2}$/.test(code)) return false;
  return countries.isValid(code.toUpperCase());
}

/**
 * A pure abbreviation rather than a name — "UK", "USA", "U.S.".
 *
 * The alias list is ordered by officialness, not by usefulness, so it mixes
 * genuinely better short forms ("China", "Taiwan") with initialisms nobody
 * wants as a label. Anything very short or all-capitals is the latter.
 */
function isAbbreviation(name: string): boolean {
  const letters = name.replace(/[^A-Za-z]/g, "");
  return letters.length < 4 || letters === letters.toUpperCase();
}

/**
 * Display name for a country code, or null if the code isn't one.
 *
 * ISO carries several names per country and neither `select` mode is right on
 * its own: the primary gives "People's Republic of China" and "Taiwan, Province
 * of China", while the first alias gives "Korea, Republic of" for KR and "UK"
 * for GB. So both are read and the shorter is preferred, with abbreviations
 * rejected — which lands on the colloquial form across the board without
 * maintaining a parallel list of names by hand.
 */
export function countryName(code: CountryCode | null | undefined): string | null {
  if (!isValidCountryCode(code)) return null;
  const upper = code.toUpperCase();

  const primary = countries.getName(upper, "en", { select: "official" });
  const alias = countries.getName(upper, "en", { select: "alias" });
  if (!primary) return alias ?? null;
  if (!alias || alias === primary) return primary;

  return alias.length < primary.length && !isAbbreviation(alias) ? alias : primary;
}

/** Normalises any casing to the uppercase alpha-2 used everywhere else, or null. */
export function normaliseCountryCode(code: unknown): CountryCode | null {
  return isValidCountryCode(code) ? code.toUpperCase() : null;
}
