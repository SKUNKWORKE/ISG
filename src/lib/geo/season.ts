import type { Hemisphere, Season, ThemeName } from "./types";

/**
 * Season from hemisphere and date.
 *
 * Meteorological seasons are used rather than astronomical ones: they start on
 * the first of a month instead of on a solstice that moves by a day or two each
 * year, which means no ephemeris and no annual drift. For a page tint, the
 * difference is three weeks twice a year and nobody notices.
 *
 * The date is read in UTC. The alternative — the server's local timezone —
 * would make the theme depend on where the app happens to be deployed, which is
 * the one input that has nothing to do with the visitor.
 */

/** Northern-hemisphere season by month index (0 = January). */
const NORTHERN_BY_MONTH: readonly Season[] = [
  "winter", // Jan
  "winter", // Feb
  "spring", // Mar
  "spring", // Apr
  "spring", // May
  "summer", // Jun
  "summer", // Jul
  "summer", // Aug
  "autumn", // Sep
  "autumn", // Oct
  "autumn", // Nov
  "winter", // Dec
];

const OPPOSITE: Record<Season, Season> = {
  spring: "autumn",
  autumn: "spring",
  summer: "winter",
  winter: "summer",
};

/**
 * The theme a visitor should see.
 *
 * Equatorial and unknown both resolve to `neutral`, for different reasons that
 * happen to share an answer: one has no four-season year to reflect, the other
 * has no location to reflect it from. Neither should be guessed at.
 */
export function getSeasonalTheme(hemisphere: Hemisphere, date: Date = new Date()): ThemeName {
  if (hemisphere === "equatorial" || hemisphere === "unknown") return "neutral";

  const northern = NORTHERN_BY_MONTH[date.getUTCMonth()];
  return hemisphere === "southern" ? OPPOSITE[northern] : northern;
}

/** The four themes plus neutral, for CSS generation and tests. */
export const THEME_NAMES: readonly ThemeName[] = [
  "spring",
  "summer",
  "autumn",
  "winter",
  "neutral",
];

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === "string" && (THEME_NAMES as readonly string[]).includes(value);
}
