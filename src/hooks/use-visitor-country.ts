"use client";

import { useEffect, useState } from "react";
import { guessFromBrowser } from "@/lib/geo/browser";
import { decodeGeoCookie, GEO_COOKIE } from "@/lib/geo/cookie";
import { countryName } from "@/lib/geo/countries";
import { getSeasonalTheme } from "@/lib/geo/season";
import { UNKNOWN_VISITOR, type GeoResponse, type ThemeName, type VisitorCountry } from "@/lib/geo/types";

/**
 * The visitor's country, resolved through the full fallback chain.
 *
 * Three phases, each replacing the last only when it is an improvement:
 *
 *  1. The cookie the proxy wrote, read synchronously — usually already correct,
 *     and available on the very first render with no flicker.
 *  2. A browser guess, if the cookie was empty, so the theme is at least
 *     plausible while the network call is in flight.
 *  3. /api/geo, which runs the sources the proxy skipped and settles it.
 *
 * `status` is exposed so the badge can show a skeleton for phase 1-2 rather
 * than flashing a country that is about to change.
 */

const STORAGE_KEY = "isg:geo";

export type VisitorCountryState = {
  country: VisitorCountry;
  theme: ThemeName;
  status: "resolving" | "resolved" | "failed";
};

/**
 * localStorage mirror of the cookie.
 *
 * The cookie is the source of truth; this exists because it survives the cookie
 * being dropped by a short session and saves a repeat visitor the API call.
 * Everything read out of it is re-validated, since it is user-editable.
 */
function readStored(): VisitorCountry | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { country?: VisitorCountry; at?: number };
    if (!parsed?.country || typeof parsed.at !== "number") return null;
    // Same TTL as the cookie cache; a day-old country is still worth painting.
    if (Date.now() - parsed.at > 24 * 60 * 60 * 1000) return null;
    return parsed.country.countryCode ? parsed.country : null;
  } catch {
    // Disabled storage, quota errors, private mode, hand-edited JSON.
    return null;
  }
}

function writeStored(country: VisitorCountry) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ country, at: Date.now() }));
  } catch {
    // Storage being unavailable is not a reason to fail; the cookie still works.
  }
}

function readCookie(): VisitorCountry | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${GEO_COOKIE}=([^;]*)`));
  const cached = decodeGeoCookie(match ? decodeURIComponent(match[1]) : null);
  return cached?.countryCode ? cached : null;
}

export function useVisitorCountry(): VisitorCountryState {
  // Server render and the hydration pass both produce the unknown state, so the
  // markup matches exactly and React has nothing to complain about. Everything
  // real happens in the effect below.
  const [state, setState] = useState<VisitorCountryState>({
    country: UNKNOWN_VISITOR,
    theme: "neutral",
    status: "resolving",
  });

  useEffect(() => {
    let cancelled = false;

    const settle = (country: VisitorCountry, theme: ThemeName, status: VisitorCountryState["status"]) => {
      if (!cancelled) setState({ country, theme, status });
    };

    // Phase 1 — whatever the server already decided.
    const known = readCookie() ?? readStored();
    if (known) settle(known, getSeasonalTheme(known.hemisphere), "resolved");

    // Phase 2 — a provisional answer so the theme is not neutral while waiting.
    const guess = guessFromBrowser();
    if (!known && guess.hemisphere !== "unknown") {
      settle(
        {
          countryCode: guess.countryCode,
          countryName: countryName(guess.countryCode),
          hemisphere: guess.hemisphere,
          confidence: "low",
          source: guess.source,
        },
        getSeasonalTheme(guess.hemisphere),
        "resolving",
      );
    }

    // Phase 3 — confirm with the server unless it has already answered well.
    // A high-confidence cookie came from the visitor's own IP; re-asking would
    // cost a round trip to be told the same thing.
    if (!(known && known.confidence === "high")) {
      const params = new URLSearchParams();
      if (guess.countryCode && guess.source !== "none") {
        params.set("hint", guess.countryCode);
        params.set("hintSource", guess.source);
      }

      // Anything that leaves the page mid-flight resolves to "keep what we have".
      const keepCurrent = () => {
        if (cancelled) return;
        setState((current) => ({
          ...current,
          status: current.country.countryCode ? "resolved" : "failed",
        }));
      };

      fetch(`/api/geo?${params}`, { credentials: "same-origin" })
        .then((response) => (response.ok ? (response.json() as Promise<GeoResponse>) : null))
        .then((data) => {
          // An error status leaves whatever is on screen in place. It is read
          // through the updater because this closure's copy is stale by now.
          if (!data) return keepCurrent();

          const country: VisitorCountry = {
            countryCode: data.countryCode,
            countryName: data.countryName,
            hemisphere: data.hemisphere,
            confidence: data.confidence,
            source: data.source,
          };
          if (country.countryCode) writeStored(country);
          settle(country, data.theme, country.countryCode ? "resolved" : "failed");
        })
        // Offline, blocked by an extension, aborted by navigation.
        .catch(keepCurrent);
    }

    return () => {
      cancelled = true;
    };
    // Runs once: the chain is a one-time resolution, not a subscription.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
