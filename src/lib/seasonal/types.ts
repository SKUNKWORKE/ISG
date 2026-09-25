import { FANCY, type FancyHue } from "@/lib/catalog-filter";
import type { ShapeSlug } from "@/lib/shapes";
import type { ColorGrade } from "@/lib/stones";
import type { OccasionDate } from "./dates";

/**
 * Regional seasonal landing pages.
 *
 * These are unlinked entry points: nothing in the nav, footer or sitemap points
 * at them, and they point outwards only at routes that already exist. Each one
 * hands the buyer to the existing catalogue with a filter already applied, so
 * no stone-fetching or filtering logic is repeated here.
 */

export type RegionKey =
  | "us"
  | "uk"
  | "eu"
  | "eu-fr"
  | "eu-de"
  | "eu-it"
  | "eu-es"
  | "jp"
  | "kr"
  | "cn"
  | "anz";

export type Region = {
  key: RegionKey;
  /** English name, used in breadcrumbs and structured data. */
  name: string;
  /** ISO 4217 codes a buyer in this market is quoted in. */
  currencies: string[];
};

export const REGIONS: Record<RegionKey, Region> = {
  us: { key: "us", name: "United States", currencies: ["USD"] },
  uk: { key: "uk", name: "United Kingdom", currencies: ["GBP"] },
  eu: { key: "eu", name: "European Union", currencies: ["EUR"] },
  "eu-fr": { key: "eu-fr", name: "France", currencies: ["EUR"] },
  "eu-de": { key: "eu-de", name: "Germany", currencies: ["EUR"] },
  "eu-it": { key: "eu-it", name: "Italy", currencies: ["EUR"] },
  "eu-es": { key: "eu-es", name: "Spain", currencies: ["EUR"] },
  jp: { key: "jp", name: "Japan", currencies: ["JPY"] },
  kr: { key: "kr", name: "South Korea", currencies: ["KRW"] },
  cn: { key: "cn", name: "China", currencies: ["CNY"] },
  anz: { key: "anz", name: "Australia and New Zealand", currencies: ["AUD", "NZD"] },
};

/**
 * A catalogue filter expressed in the terms the catalogue actually parses.
 *
 * `filtersFromParams` drops anything it doesn't recognise, so these are built
 * from the real vocabularies — shape slugs, D–J colour grades, and the fancy
 * hue list — rather than from free text.
 */
export type StoneFilter = {
  shapes: ShapeSlug[];
  /** White-scale grades. Ignored when `fancyHue` is set; see `filterParams`. */
  colors?: ColorGrade[];
  /** A fancy hue, which the catalogue reads as `color=Fancy` plus `hue=`. */
  fancyHue?: FancyHue;
};

/**
 * A filter as catalogue query parameters.
 *
 * Fancy and white grades are mutually exclusive on purpose: the catalogue
 * requires a stone to match every active facet, and a white stone has no hue,
 * so `color=Fancy,D,E,F&hue=Pink` would quietly return fancy pinks alone. Where
 * an occasion calls for both, the white grades go on a second link instead.
 */
export function filterParams(filter: StoneFilter): string {
  const params = new URLSearchParams();
  params.set("shape", filter.shapes.join(","));
  if (filter.fancyHue) {
    params.set("color", FANCY);
    params.set("hue", filter.fancyHue);
  } else if (filter.colors?.length) {
    params.set("color", filter.colors.join(","));
  }
  return params.toString();
}

export const naturalHref = (filter: StoneFilter) => `/natural-diamonds?${filterParams(filter)}`;
export const labHref = (filter: StoneFilter) => `/lab-grown-diamonds?${filterParams(filter)}`;

/** UI chrome in the page's own language, so a native page has no English seams. */
export type SeasonalLabels = {
  date: string;
  shapes: string;
  colour: string;
  quotedIn: string;
  naturalCta: string;
  labCta: string;
  alsoConsider: string;
  /** Sits under the buttons: why no price is printed. */
  priceNote: string;
  moreLinks: string;
  home: string;
  allNatural: string;
  allLab: string;
  contact: string;
  /** Shown instead of a call to action when that origin has nothing matching. */
  noNatural: string;
  noLab: string;
  /** Stands in for a date the lunar calendar decides. */
  varies: string;
};

export type Occasion = {
  region: RegionKey;
  /** Final route segment under /seasonal/<region>/. */
  slug: string;
  /** BCP-47 tag for this page's copy; sets `lang` so CJK glyph forms resolve correctly. */
  lang: string;
  /** Locale used to format the occasion's date and currency. */
  formatLocale: string;
  variant: "native" | "en";
  date: OccasionDate;
  title: string;
  description: string;
  /** Occasion name above the heading, in its own script. */
  eyebrow: string;
  heading: string;
  standfirst: string;
  sections: { heading: string; body: string[] }[];
  /** One line each, describing the stone brief beside the call to action. */
  brief: { shapes: string; colour: string };
  primary: StoneFilter;
  /** A distinct second offer, where one filter cannot express both halves. */
  secondary?: { filter: StoneFilter; label: string; note: string };
  labels: SeasonalLabels;
};
