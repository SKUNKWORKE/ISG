import { filterStones, filtersFromParams, stoneBounds } from "@/lib/catalog-filter";
import { LAB_STONES, NATURAL_STONES, type Origin } from "@/lib/stones";
import { filterParams, type StoneFilter } from "./types";

/**
 * How many stones a seasonal filter actually reaches, per origin.
 *
 * This runs the link through the catalogue's own parser and filter rather than
 * matching stones here, so a count can never drift from what the buyer sees
 * after the click — if `filtersFromParams` rejects a value, it is rejected here
 * too.
 *
 * It matters because the two catalogues hold very different stock. Natural
 * inventory here is entirely fancy-colour and warm-tinted, with no D-J whites
 * and no rounds at all, so a colourless brief that returns hundreds of
 * lab-grown stones can return none at all in natural. The pages use these
 * counts to avoid sending anyone to an empty list.
 */

const BOUNDS = {
  natural: stoneBounds(NATURAL_STONES),
  lab: stoneBounds(LAB_STONES),
} as const;

export function stockCount(filter: StoneFilter, origin: Origin): number {
  const stones = origin === "natural" ? NATURAL_STONES : LAB_STONES;
  const bounds = BOUNDS[origin];
  const { filters, sort } = filtersFromParams(new URLSearchParams(filterParams(filter)), bounds);
  return filterStones(stones, filters, sort, bounds).length;
}

export function stockCounts(filter: StoneFilter): { natural: number; lab: number } {
  return { natural: stockCount(filter, "natural"), lab: stockCount(filter, "lab") };
}
