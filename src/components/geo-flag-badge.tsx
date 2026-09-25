"use client";

import { useEffect, useState } from "react";
import {
  SHORTLIST_TAB_CLEARANCE,
  useShortlistTrayVisible,
} from "@/components/shortlist-tray";
import { useVisitorCountry } from "@/hooks/use-visitor-country";
import FLAG_CODES from "@/lib/geo/flag-codes.json";

/**
 * The visitor's country, bottom right.
 *
 * Rules it follows, in rough order of how annoying getting them wrong would be:
 *
 *  - It never guesses out loud. A low-confidence result (locale or timezone)
 *    still tints the page, because a wrong season is invisible, but it does not
 *    put a country name on screen, because a wrong flag is not.
 *  - It disappears rather than apologising. No "location unavailable" state.
 *  - It is dismissible, and stays dismissed.
 *  - It never covers content: it sits clear of the shortlist tray, and on small
 *    screens it collapses to the flag alone.
 */

const DISMISS_KEY = "isg:geo-badge-dismissed";

const AVAILABLE_FLAGS = new Set(FLAG_CODES as string[]);

/** Flags are 4x3; fixing both dimensions stops the row shifting as one loads. */
const FLAG_WIDTH = 20;
const FLAG_HEIGHT = 15;

export function GeoFlagBadge() {
  const { country, status } = useVisitorCountry();
  const trayVisible = useShortlistTrayVisible();
  const [dismissed, setDismissed] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Starts dismissed and is enabled on mount, so the server-rendered markup and
  // the hydration pass agree: nothing renders until the client has read storage.
  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Dismissal not persisting is a far smaller problem than throwing here.
    }
  };

  if (dismissed) return null;

  // Nothing resolved, or resolved only to a guess: show nothing at all rather
  // than a flag that might be wrong.
  const confident = country.confidence === "high" || country.confidence === "medium";
  if (status === "failed" || (status === "resolved" && !confident)) return null;

  const code = country.countryCode?.toLowerCase() ?? null;
  const hasFlag = code !== null && AVAILABLE_FLAGS.has(code);
  const ready = status === "resolved" && confident && country.countryName;

  return (
    <div
      // Shares the bottom-right corner with the shortlist tray, so it steps up
      // by the tab's height whenever the tray is on screen. `pointer-events-none`
      // on the wrapper keeps the gap around the badge clickable for whatever is
      // underneath it, and z-30 keeps it below the tray's own z-40 panel.
      className="pointer-events-none fixed z-30 transition-[bottom] duration-300 ease-[var(--ease-quiet)] print:hidden"
      style={{
        bottom: `calc(0.75rem + env(safe-area-inset-bottom, 0px) + ${trayVisible ? SHORTLIST_TAB_CLEARANCE : 0}px)`,
        right: "calc(0.75rem + env(safe-area-inset-right, 0px))",
      }}
    >
      <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-hairline bg-white/90 py-1 pl-1.5 pr-1 shadow-[0_1px_3px_rgba(23,24,27,0.06)] backdrop-blur-sm">
        {ready ? (
          <>
            {hasFlag ? (
              <img
                src={`/flags/${code}.svg`}
                alt=""
                width={FLAG_WIDTH}
                height={FLAG_HEIGHT}
                loading="lazy"
                decoding="async"
                className="rounded-[2px] ring-1 ring-hairline/60"
              />
            ) : null}
            <span className="max-w-[9rem] truncate text-[12px] leading-none text-ink max-sm:hidden">
              {country.countryName}
            </span>
            <span className="sr-only">Detected location: {country.countryName}</span>

            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              className="rounded-full px-1 text-[12px] leading-none text-ink-muted transition-colors duration-200 hover:text-ink"
              title="Why am I seeing this?"
            >
              <span aria-hidden>?</span>
              <span className="sr-only">About this location badge</span>
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-full px-1 pb-px text-[13px] leading-none text-ink-muted transition-colors duration-200 hover:text-ink"
            >
              <span aria-hidden>&times;</span>
              <span className="sr-only">Hide location badge</span>
            </button>
          </>
        ) : (
          // Resolving. A skeleton the same size as the resolved badge, so the
          // corner does not jump when the real answer arrives.
          <span className="flex items-center gap-1.5 pr-1" aria-hidden>
            <span
              className="animate-pulse rounded-[2px] bg-panel"
              style={{ width: FLAG_WIDTH, height: FLAG_HEIGHT }}
            />
            <span className="h-[10px] w-16 animate-pulse rounded-full bg-panel max-sm:hidden" />
          </span>
        )}
      </div>

      {expanded ? (
        <p className="pointer-events-auto mt-2 max-w-[16rem] rounded-card border border-hairline bg-white/95 p-3 text-[12px] leading-relaxed text-ink-muted shadow-[0_1px_3px_rgba(23,24,27,0.06)] backdrop-blur-sm">
          Your country is estimated from your IP address to set the page&rsquo;s seasonal theme.
          Only the country is used — never a precise location — and nothing is shared with a third
          party beyond the lookup itself.
        </p>
      ) : null}
    </div>
  );
}
