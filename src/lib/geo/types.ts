/**
 * Visitor country detection.
 *
 * The whole feature is cosmetic — a flag in the corner and a seasonal tint on
 * the landing page — so every layer is built to degrade rather than to insist.
 * Nothing here blocks a render, and "we don't know" is a first-class answer
 * that the UI knows how to show.
 *
 * Only country-level data is ever derived or stored. No coordinates, no city,
 * and the visitor's IP is never persisted: it is read from the request, used
 * for a lookup, and dropped.
 */

/** ISO 3166-1 alpha-2, uppercase. */
export type CountryCode = string;

/**
 * Which half of the world the visitor's seasons run on.
 *
 * `equatorial` is not geographic pedantry: countries in the tropical band have
 * wet and dry seasons rather than four, so showing them "autumn" would be
 * wrong rather than merely imprecise. They get the neutral theme.
 */
export type Hemisphere = "northern" | "southern" | "equatorial" | "unknown";

export type Season = "spring" | "summer" | "autumn" | "winter";

/** `neutral` is the honest theme for equatorial and undetected visitors alike. */
export type ThemeName = Season | "neutral";

/**
 * Where an answer came from, in the order the chain tries them.
 *
 * Kept on the result (and in the cookie) because it is the only way to tell a
 * confident answer from a plausible guess after the fact — useful when
 * debugging "why is this visitor seeing winter".
 */
export type GeoSource =
  /** Country header attached by the CDN in front of the app. */
  | "cdn-header"
  /** Local MaxMind GeoLite2 database lookup. */
  | "maxmind"
  /** Network call to a free IP geolocation service. */
  | "ip-service"
  /** Client-side guess from navigator.language / navigator.languages. */
  | "browser-locale"
  /** Client-side guess from the IANA timezone. */
  | "browser-timezone"
  /** Previously resolved and cached. */
  | "cache"
  /** Nothing worked. */
  | "none";

/**
 * How much the answer should be trusted.
 *
 * `high` comes from the visitor's actual IP address. `medium` is still
 * IP-derived but went over the network and may have been rate-limited into a
 * partial answer. `low` is a browser hint, which reflects the device's
 * configuration rather than where it is — a laptop bought abroad keeps its
 * locale. The badge shows `low` results only for hemisphere purposes and never
 * claims a country it isn't reasonably sure of.
 */
export type Confidence = "high" | "medium" | "low" | "none";

export type VisitorCountry = {
  countryCode: CountryCode | null;
  /** English display name from i18n-iso-countries; null when the code is unknown. */
  countryName: string | null;
  hemisphere: Hemisphere;
  confidence: Confidence;
  source: GeoSource;
};

/** The answer when every source has failed. Never throws, always renderable. */
export const UNKNOWN_VISITOR: VisitorCountry = {
  countryCode: null,
  countryName: null,
  hemisphere: "unknown",
  confidence: "none",
  source: "none",
};

/** What the client receives from /api/geo, theme included so it need not recompute. */
export type GeoResponse = VisitorCountry & {
  theme: ThemeName;
  /** Server date the theme was computed from, ISO. Lets the client avoid trusting its own clock. */
  resolvedAt: string;
};
