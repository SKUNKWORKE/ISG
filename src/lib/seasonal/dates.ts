/**
 * Occasion dates for the seasonal landing pages.
 *
 * Several of these occasions move: Mothering Sunday is pinned to Lent, and the
 * French Fête des Mères steps into June whenever it would land on Pentecost.
 * Both derive from Easter, so Easter is computed rather than tabulated — a
 * hard-coded table would silently expire.
 *
 * Lunar occasions (Chinese New Year, Qixi, Chuseok, Mid-Autumn) are deliberately
 * NOT computed here. They need a lunisolar calendar this site has no reason to
 * carry, and a wrong date on a gifting page is worse than no date, so they are
 * described by their rule instead.
 */

/** Days are handled in UTC throughout, so a build machine's timezone can't shift a date. */
const utc = (year: number, month: number, day: number) => new Date(Date.UTC(year, month, day));

const DAY_MS = 86_400_000;

const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS);

/** Gregorian Easter Sunday (Meeus/Jones/Butcher algorithm). */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return utc(year, month - 1, day);
}

/** The `n`th `weekday` of a month, 1-indexed; weekday 0 = Sunday. */
export function nthWeekdayOf(year: number, month: number, weekday: number, n: number): Date {
  const first = utc(year, month, 1);
  const shift = (weekday - first.getUTCDay() + 7) % 7;
  return utc(year, month, 1 + shift + (n - 1) * 7);
}

/** The last `weekday` of a month; weekday 0 = Sunday. */
export function lastWeekdayOf(year: number, month: number, weekday: number): Date {
  const last = utc(year, month + 1, 0);
  return addDays(last, -((last.getUTCDay() - weekday + 7) % 7));
}

/** Occasions whose date is a rule rather than a fixed day. */
export type ComputedDateId =
  | "us-mothers-day"
  | "us-thanksgiving"
  | "us-black-friday"
  | "uk-mothering-sunday"
  | "fr-fete-des-meres"
  | "de-muttertag"
  | "it-festa-della-mamma"
  | "es-dia-de-la-madre"
  | "jp-seijin-no-hi"
  | "kr-seongin-ui-nal"
  | "anz-mothers-day";

const SUN = 0;
const MON = 1;
const THU = 4;
const JAN = 0;
const MAY = 4;
const JUN = 5;
const NOV = 10;

const COMPUTED: Record<ComputedDateId, (year: number) => Date> = {
  "us-mothers-day": (y) => nthWeekdayOf(y, MAY, SUN, 2),
  "de-muttertag": (y) => nthWeekdayOf(y, MAY, SUN, 2),
  "it-festa-della-mamma": (y) => nthWeekdayOf(y, MAY, SUN, 2),
  "anz-mothers-day": (y) => nthWeekdayOf(y, MAY, SUN, 2),
  "es-dia-de-la-madre": (y) => nthWeekdayOf(y, MAY, SUN, 1),
  "kr-seongin-ui-nal": (y) => nthWeekdayOf(y, MAY, MON, 3),
  "jp-seijin-no-hi": (y) => nthWeekdayOf(y, JAN, MON, 2),
  "us-thanksgiving": (y) => nthWeekdayOf(y, NOV, THU, 4),
  "us-black-friday": (y) => addDays(nthWeekdayOf(y, NOV, THU, 4), 1),
  // Fourth Sunday of Lent — three weeks before Easter.
  "uk-mothering-sunday": (y) => addDays(easterSunday(y), -21),
  // Last Sunday in May, but June's first Sunday whenever that clashes with Pentecost.
  "fr-fete-des-meres": (y) => {
    const may = lastWeekdayOf(y, MAY, SUN);
    const pentecost = addDays(easterSunday(y), 49);
    return may.getTime() === pentecost.getTime() ? nthWeekdayOf(y, JUN, SUN, 1) : may;
  },
};

export function computedDate(id: ComputedDateId, year: number): Date {
  return COMPUTED[id](year);
}

/** How an occasion's date is expressed on the page. */
export type OccasionDate =
  /** A calendar date that never moves, e.g. 14 February. */
  | { kind: "fixed"; month: number; day: number; rule: string }
  /** A season rather than a day, e.g. the Christmas–New Year proposal window. */
  | { kind: "window"; from: [number, number]; to: [number, number]; rule: string }
  /** Movable but computable — resolved from `ComputedDateId`. */
  | { kind: "computed"; id: ComputedDateId; rule: string }
  /** Lunisolar; the rule is stated and no date is invented. */
  | { kind: "lunar"; rule: string }
  /** Not calendar-fixed at all, e.g. Korean 100-day couple milestones. */
  | { kind: "evergreen"; rule: string };

/**
 * The next time an occasion comes round, at or after `from`.
 *
 * Windows resolve to their opening day, and return `undefined` for the kinds
 * that have no computable date so the caller falls back to the written rule.
 */
export function nextOccurrence(date: OccasionDate, from: Date): Date | undefined {
  const year = from.getUTCFullYear();
  const startOfDay = utc(year, from.getUTCMonth(), from.getUTCDate());

  const resolve = (y: number): Date | undefined => {
    if (date.kind === "fixed") return utc(y, date.month - 1, date.day);
    if (date.kind === "window") return utc(y, date.from[0] - 1, date.from[1]);
    if (date.kind === "computed") return computedDate(date.id, y);
    return undefined;
  };

  const thisYear = resolve(year);
  if (!thisYear) return undefined;
  return thisYear.getTime() >= startOfDay.getTime() ? thisYear : resolve(year + 1);
}
