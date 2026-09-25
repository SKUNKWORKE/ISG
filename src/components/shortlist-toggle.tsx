"use client";

import { openShortlistTray, useHydrated, useShortlist } from "@/hooks/use-shortlist";
import type { ShortlistStone } from "@/lib/shortlist";
import type { Stone } from "@/lib/stones";

export function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M12 3.6l2.47 5.01 5.53.8-4 3.9.94 5.5L12 16.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Adds a stone to the shortlist or takes it off. Deliberately quiet: an outline
 * star that fills when selected, no colour. On a full list it opens the tray
 * instead, so the buyer can make room.
 *
 * `icon` sits on a card; `labelled` is the full-width button on a stone page.
 */
export function ShortlistToggle({
  stone,
  variant = "icon",
  className = "",
}: {
  stone: Stone | ShortlistStone;
  variant?: "icon" | "labelled";
  className?: string;
}) {
  const { has, toggle, full } = useShortlist();
  // Before hydration every star renders empty, matching the server.
  const hydrated = useHydrated();
  const selected = hydrated && has(stone.sku);
  const blocked = hydrated && full && !selected;
  const name = `${stone.shapeName} ${stone.carat.toFixed(2)} carat, SKU ${stone.sku}`;

  const onClick = () => {
    if (!toggle(stone)) openShortlistTray();
  };

  if (variant === "labelled") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={`flex w-full items-center justify-center gap-2 rounded-full border px-7 py-3 text-[15px] transition-colors duration-200 ${
          selected ? "border-ink" : "border-hairline hover:border-ink"
        } ${className}`}
      >
        <StarIcon filled={selected} className="h-[18px] w-[18px]" />
        {selected ? "On your shortlist" : blocked ? "Shortlist full — review" : "Add to shortlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={
        blocked
          ? `Shortlist is full. Review it to make room for ${name}`
          : `${selected ? "Remove from" : "Add to"} shortlist: ${name}`
      }
      title={selected ? "Remove from shortlist" : blocked ? "Shortlist full" : "Add to shortlist"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border bg-porcelain/80 transition-colors duration-200 ${
        selected
          ? "border-ink text-ink"
          : "border-hairline text-ink-muted hover:border-ink hover:text-ink"
      } ${className}`}
    >
      <StarIcon filled={selected} className="h-[18px] w-[18px]" />
    </button>
  );
}
