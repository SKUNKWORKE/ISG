import { hemisphereFromCountry, countryFromTimezone, hemisphereFromTimezone } from "./timezone";
import type { CountryCode, GeoSource, Hemisphere, VisitorCountry } from "./types";

/**
 * Client-side detection from browser signals.
 *
 * Fast — no network, available synchronously — and weak. A locale says which
 * language the device is configured for, not where it is; a timezone says which
 * offset it is set to, not where it woke up this morning. Somebody who bought a
 * laptop in Germany and moved to Japan reports `de-DE` and, until they change
 * it, `Europe/Berlin`.
 *
 * So these results are marked low confidence and used for two jobs only:
 * choosing a provisional theme before the server answers, and rescuing a
 * hemisphere when every IP-based source has failed. The badge does not show a
 * country on this evidence alone.
 */

/**
 * Region subtag from the browser's preferred locales, e.g. `en-AU` → `AU`.
 *
 * `navigator.languages` is walked in order, because the first entry is the most
 * preferred and later entries are fallbacks. A bare `en` carries no region and
 * is skipped rather than guessed at — `en` is not a country.
 */
export function countryFromLocale(): CountryCode | null {
  if (typeof navigator === "undefined") return null;

  const locales = navigator.languages?.length
    ? navigator.languages
    : [navigator.language].filter(Boolean);

  for (const locale of locales) {
    try {
      const region = new Intl.Locale(locale).region;
      if (region && /^[A-Z]{2}$/.test(region)) return region;
    } catch {
      // Intl.Locale throws on malformed tags; try the next one.
    }
  }
  return null;
}

export function browserTimezone(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    return null;
  }
}

export type BrowserGuess = {
  countryCode: CountryCode | null;
  hemisphere: Hemisphere;
  source: Extract<GeoSource, "browser-locale" | "browser-timezone" | "none">;
};

/**
 * The best guess available without a network round trip.
 *
 * Timezone is preferred over locale for the *country*, because a timezone at
 * least tracks the machine's clock settings, whereas a locale frequently
 * outlives a move. Where the timezone maps to no country the locale region
 * fills in, and the hemisphere is taken from whichever signal is present —
 * timezone first, since hemisphere is the one thing it is genuinely good at.
 */
export function guessFromBrowser(): BrowserGuess {
  const timeZone = browserTimezone();
  const fromZone = countryFromTimezone(timeZone);
  if (fromZone) {
    return { countryCode: fromZone, hemisphere: hemisphereFromCountry(fromZone), source: "browser-timezone" };
  }

  const zoneHemisphere = hemisphereFromTimezone(timeZone);
  const fromLocale = countryFromLocale();
  if (fromLocale) {
    return {
      countryCode: fromLocale,
      // The zone is the better hemisphere signal; fall back to the locale's
      // country only where the zone was unrecognised.
      hemisphere: zoneHemisphere === "unknown" ? hemisphereFromCountry(fromLocale) : zoneHemisphere,
      source: "browser-locale",
    };
  }

  if (zoneHemisphere !== "unknown") {
    // A hemisphere with no country still picks the right season, which is the
    // more visible half of this feature.
    return { countryCode: null, hemisphere: zoneHemisphere, source: "browser-timezone" };
  }

  return { countryCode: null, hemisphere: "unknown", source: "none" };
}

/** Shapes a browser guess like every other result, always at low confidence. */
export function browserGuessAsVisitor(guess: BrowserGuess, countryName: string | null): VisitorCountry {
  return {
    countryCode: guess.countryCode,
    countryName,
    hemisphere: guess.hemisphere,
    confidence: guess.source === "none" ? "none" : "low",
    source: guess.source,
  };
}
