"use client";

import { useEffect } from "react";
import { useVisitorCountry } from "@/hooks/use-visitor-country";

/**
 * Corrects the seasonal theme once the full detection chain has settled.
 *
 * `SeasonalThemeScript` has already applied a theme before the first paint from
 * the cookie the proxy wrote, which covers the overwhelming majority of
 * visitors. This handles the rest: a first visit with cookies unavailable, or a
 * country that only the network fallback could resolve.
 *
 * Where the pre-paint script was already right, this sets the same value again
 * and nothing changes on screen.
 */
export function SeasonalThemeSync() {
  const { theme, country, status } = useVisitorCountry();

  useEffect(() => {
    if (status === "resolving") return;
    const root = document.documentElement;

    // "neutral" is the absence of a season rather than a season of its own, so
    // the attribute is removed and the base palette applies.
    if (theme === "neutral") root.removeAttribute("data-season");
    else root.setAttribute("data-season", theme);

    if (country.countryCode) root.setAttribute("data-country", country.countryCode);
    else root.removeAttribute("data-country");
  }, [theme, country.countryCode, status]);

  return null;
}
