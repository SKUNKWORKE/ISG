import { nextOccurrence, type OccasionDate } from "./dates";
import type { SeasonalLabels } from "./types";

/**
 * Locale formatting for the seasonal pages.
 *
 * Date order follows the reader's locale rather than a house style, so a US page
 * reads 02/14/2027 and a UK, EU or ANZ page reads 14/02/2027, with Japanese,
 * Korean and Chinese pages taking their own year-first order.
 */

const monthDay = (locale: string) =>
  new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", timeZone: "UTC" });

const fullDate = (locale: string) =>
  new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const numericDate = (locale: string) =>
  new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });

/**
 * The currency a buyer in this market is quoted in, as symbol and ISO code.
 *
 * No amount is ever formatted: the catalogue holds no prices, every stone is
 * quoted individually, and inventing a figure to demonstrate the format would
 * put a number on the page that no stone stands behind.
 */
export function currencyLabel(locale: string, codes: string[]): string {
  return codes
    .map((code) => {
      const parts = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: code,
        currencyDisplay: "narrowSymbol",
      }).formatToParts(0);
      const symbol = parts.find((p) => p.type === "currency")?.value;
      return symbol && symbol !== code ? `${code} (${symbol})` : code;
    })
    .join(" · ");
}

export type FormattedDate = {
  /** The headline date, spelled out in the page's own language. */
  value: string;
  /** The same date in the locale's numeric order; absent when there is no single date. */
  numeric?: string;
  /** The rule behind it, always shown, so a movable date explains itself. */
  rule: string;
};

export function formatOccasionDate(
  date: OccasionDate,
  locale: string,
  labels: SeasonalLabels,
  now: Date,
): FormattedDate {
  if (date.kind === "lunar") return { value: labels.varies, rule: date.rule };
  if (date.kind === "evergreen") return { value: date.rule, rule: date.rule };

  if (date.kind === "window") {
    const year = now.getUTCFullYear();
    const from = new Date(Date.UTC(year, date.from[0] - 1, date.from[1]));
    const to = new Date(Date.UTC(year, date.to[0] - 1, date.to[1]));
    const span = monthDay(locale);
    return { value: `${span.format(from)} – ${span.format(to)}`, rule: date.rule };
  }

  const next = nextOccurrence(date, now);
  if (!next) return { value: date.rule, rule: date.rule };
  return {
    value: fullDate(locale).format(next),
    numeric: numericDate(locale).format(next),
    rule: date.rule,
  };
}
