import { ANZ_OCCASIONS } from "./anz";
import { CN_OCCASIONS } from "./cn";
import { EU_OCCASIONS } from "./eu";
import { EU_DE_OCCASIONS } from "./eu-de";
import { EU_ES_OCCASIONS } from "./eu-es";
import { EU_FR_OCCASIONS } from "./eu-fr";
import { EU_IT_OCCASIONS } from "./eu-it";
import { JP_OCCASIONS } from "./jp";
import { KR_OCCASIONS } from "./kr";
import { UK_OCCASIONS } from "./uk";
import { US_OCCASIONS } from "./us";
import type { Occasion, RegionKey } from "./types";

export * from "./types";

export const SEASONAL_OCCASIONS: Occasion[] = [
  ...US_OCCASIONS,
  ...UK_OCCASIONS,
  ...EU_FR_OCCASIONS,
  ...EU_DE_OCCASIONS,
  ...EU_IT_OCCASIONS,
  ...EU_ES_OCCASIONS,
  ...EU_OCCASIONS,
  ...JP_OCCASIONS,
  ...KR_OCCASIONS,
  ...CN_OCCASIONS,
  ...ANZ_OCCASIONS,
];

const BY_PATH = new Map(SEASONAL_OCCASIONS.map((o) => [`${o.region}/${o.slug}`, o]));

/**
 * The occasion behind one seasonal route.
 *
 * Throws rather than returning undefined: every page passes a literal pair that
 * exists, so a miss means a typo in a route, and failing the build is the point
 * at which that is cheapest to notice.
 */
export function occasion(region: RegionKey, slug: string): Occasion {
  const found = BY_PATH.get(`${region}/${slug}`);
  if (!found) throw new Error(`No seasonal occasion for /seasonal/${region}/${slug}`);
  return found;
}

/** Metadata for a seasonal page, with the canonical it would have once launched. */
export function seasonalMetadata(region: RegionKey, slug: string) {
  const { title, description } = occasion(region, slug);
  return {
    title,
    description,
    alternates: { canonical: `/seasonal/${region}/${slug}` },
  };
}
