import { faceUpSize, parseMeasurements, type FaceUp } from "./carat-size";
import type { Jewel, JewelImage, Metal, Purity } from "./jewelry";
import type { ShapeSlug } from "./shapes";

/**
 * Build a ring: a loose stone plus one of our ring designs, made to order.
 *
 * There are no bare mounts in stock. Every engagement ring with a centre stone
 * doubles as a setting design, and the head is made to fit the buyer's stone.
 * No prices: the enquiry carries the choices and the quote comes back from the
 * trade desk, as everywhere else on the site.
 *
 * Client-safe: type-only imports from jewelry and stones data.
 */

/** The only finish offered. Shown, not chosen. */
export const FINISH = "High polish";

export const SETTING_STYLES = ["solitaire", "hidden-halo", "halo", "three-stone", "other"] as const;
export type SettingStyle = (typeof SETTING_STYLES)[number];

export const STYLE_NAME: Record<SettingStyle, string> = {
  solitaire: "Solitaire",
  "hidden-halo": "Hidden halo",
  halo: "Halo",
  "three-stone": "Three-stone",
  other: "Statement",
};

/** Read from the design's name; the supplier names every ring by its style. */
export function styleOf(name: string): SettingStyle {
  const n = name.toLowerCase();
  if (n.includes("hidden halo")) return "hidden-halo";
  if (n.includes("halo")) return "halo";
  if (/three[- ]stone|trilogy/.test(n)) return "three-stone";
  if (n.includes("solitaire")) return "solitaire";
  return "other";
}

/** A ring design offered as a setting. Everything the builder UI needs, nothing server-only. */
export type SettingDesign = {
  sku: string;
  name: string;
  style: SettingStyle;
  centreShape: ShapeSlug;
  /** The centre stone the design was photographed with. */
  centreCarat: number;
  centreSize: FaceUp;
  /** False when the size is estimated from the carat weight. */
  centreSizeMeasured: boolean;
  metals: Metal[];
  purities: Purity[];
  /** Cover first, then one photograph per metal colour where the supplier tagged one. */
  images: JewelImage[];
};

export function isSettingDesign(jewel: Jewel): boolean {
  return jewel.category === "ring" && jewel.centerCarat !== undefined && jewel.shapes.length > 0;
}

/** "Approximately 9.00 × 7.00 mm" from the written specification, else an estimate. */
function centreSizeOf(jewel: Jewel): { size: FaceUp; measured: boolean } {
  const row = jewel.sections
    .flatMap((s) => s.rows)
    .find(([label]) => /cent(er|re).*size/i.test(label));
  const match = row?.[1].match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)/i);
  const parsed = match ? parseMeasurements(`${match[1]} x ${match[2]}`) : undefined;
  if (parsed) return { size: parsed, measured: true };
  return { size: faceUpSize(jewel.shapes[0], jewel.centerCarat ?? 1), measured: false };
}

export function toSettingDesign(jewel: Jewel): SettingDesign {
  const { size, measured } = centreSizeOf(jewel);
  const [cover, ...rest] = jewel.images;
  const perMetal = jewel.metals
    .map((metal) => rest.find((img) => img.metal === metal))
    .filter((img): img is JewelImage => Boolean(img));
  return {
    sku: jewel.sku,
    name: jewel.name,
    style: styleOf(jewel.name),
    centreShape: jewel.shapes[0],
    centreCarat: jewel.centerCarat ?? 0,
    centreSize: size,
    centreSizeMeasured: measured,
    metals: jewel.metals,
    purities: jewel.purities,
    images: cover ? [cover, ...perMetal] : perMetal,
  };
}

/** The photograph to show for a metal colour: its own, else the cover. */
export function imageForMetal(design: SettingDesign, metal: Metal): JewelImage | undefined {
  return design.images.find((img) => img.metal === metal) ?? design.images[0];
}

/* ------------------------------------------------------------ engraving */

/**
 * Inside-the-band engraving. Thirty characters is what an engraver will fit
 * comfortably inside a 2 mm shank at a legible size; longer messages get
 * quoted individually, which the enquiry can ask for in words.
 */
export const ENGRAVING_MAX = 30;

/**
 * What a rotary engraver can cut: letters in any alphabet, digits, spaces and
 * the handful of marks that turn up in names and dates. Everything else is
 * dropped rather than rejected, so a paste never loses the whole message.
 */
const ENGRAVABLE = /[^\p{L}\p{M}\p{N} .,'’&\-–—!?:;()/+♥♡★]/gu;

export function cleanEngraving(value: string | undefined): string {
  return (value ?? "").replace(ENGRAVABLE, "").replace(/\s+/g, " ").trimStart().slice(0, ENGRAVING_MAX);
}

/* ------------------------------------------------------------ URL state */

export type BuildParams = {
  stone?: string;
  setting?: string;
  metal?: string;
  purity?: string;
  size?: string;
  engraving?: string;
  /** A saved build's code, kept in the URL as the reference the desk quotes. */
  build?: string;
  /** Picker filters. */
  shape?: string;
  origin?: string;
  cmin?: string;
  cmax?: string;
  style?: string;
  page?: string;
};

const KEYS: (keyof BuildParams)[] = [
  "stone",
  "setting",
  "metal",
  "purity",
  "size",
  "engraving",
  "build",
  "shape",
  "origin",
  "cmin",
  "cmax",
  "style",
  "page",
];

export function readBuildParams(raw: Record<string, string | string[] | undefined>): BuildParams {
  const out: BuildParams = {};
  for (const key of KEYS) {
    const v = raw[key];
    const value = Array.isArray(v) ? v[0] : v;
    if (value) out[key] = value;
  }
  if (out.engraving) out.engraving = cleanEngraving(out.engraving);
  return out;
}

/** The builder URL with `changes` applied; `undefined` removes a key. */
export function builderHref(current: BuildParams, changes: Partial<BuildParams> = {}): string {
  const next = { ...current, ...changes };
  const params = new URLSearchParams();
  for (const key of KEYS) {
    const value = next[key];
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/build-a-ring?${query}` : "/build-a-ring";
}
