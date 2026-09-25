import { METALS, PURITIES } from "./jewelry";
import { cleanEngraving } from "./ring-builder";
import { US_MAX, US_MIN } from "./ring-sizes";

/**
 * A saved ring: the buyer's choices, kept so the configuration can be picked up
 * again later — on this device from the browser's own store, or anywhere from a
 * short code the desk can quote back over WhatsApp.
 *
 * Client-safe. The server half lives in ring-build-store.ts.
 */

/**
 * Crockford's base 32 without I, L, O and U: no character can be misread as
 * another over a phone call, and nothing spells anything unfortunate.
 */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const BUILD_CODE_LENGTH = 8;
export const BUILD_CODE_RE = /^[0-9A-HJKMNP-TV-Z]{8}$/;

export function newBuildCode(): string {
  const bytes = new Uint8Array(BUILD_CODE_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/** Accepts what a person types: lower case, spaces, and the letters they confuse. */
export function normaliseBuildCode(input: string): string | undefined {
  const cleaned = input
    .trim()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .replace(/[IL]/g, "1")
    .replace(/O/g, "0")
    .replace(/U/g, "V");
  return BUILD_CODE_RE.test(cleaned) ? cleaned : undefined;
}

/** The stored choices. Only strings, and only the ring — never the picker's filters. */
export type SavedBuild = {
  stone: string;
  setting?: string;
  metal?: string;
  purity?: string;
  size?: string;
  engraving?: string;
};

const SKU = /^[A-Za-z0-9-]{1,40}$/;

/**
 * Validates whatever arrives — a POST body, or a document read back from the
 * database — into a build we are willing to render. Returns undefined rather
 * than throwing, so a bad record degrades to "not found" instead of a 500.
 */
export function parseSavedBuild(value: unknown): SavedBuild | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const raw = value as Record<string, unknown>;
  const str = (key: string): string | undefined => {
    const v = raw[key];
    return typeof v === "string" && v ? v : undefined;
  };

  const stone = str("stone");
  if (!stone || !SKU.test(stone)) return undefined;

  const setting = str("setting");
  const metal = str("metal");
  const purity = str("purity");
  const size = Number.parseFloat(str("size") ?? "");
  const engraving = cleanEngraving(str("engraving"));

  return {
    stone,
    // "custom" is a real answer here: a design to be suggested, not a SKU.
    ...(setting && (setting === "custom" || SKU.test(setting)) ? { setting } : {}),
    ...((METALS as readonly string[]).includes(metal ?? "") ? { metal } : {}),
    ...((PURITIES as readonly string[]).includes(purity ?? "") ? { purity } : {}),
    ...(Number.isFinite(size) && size >= US_MIN && size <= US_MAX ? { size: String(size) } : {}),
    ...(engraving ? { engraving } : {}),
  };
}

/** The short link that reopens a saved ring anywhere. */
export function savedBuildHref(code: string): string {
  return `/build-a-ring?build=${code}`;
}
