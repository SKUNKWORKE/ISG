import type { Stone } from "./stones";
import { jewelDescriptor, type JewelSummary } from "./jewelry";

/**
 * The single source of contact details for the whole site — pages, spec sheet
 * PDFs, WhatsApp and mail links all read from here. Held in code rather than
 * the environment so every deployment shows the same numbers without depending
 * on config being set correctly. Change them here and the site follows.
 */
export const SALES_EMAIL = "sales@imperialstargems.com";

/** Digits only, including country code. wa.me rejects "+", spaces and dashes. */
export const WHATSAPP_NUMBER = "918140089896";

export const SALES_PHONE = "+91 81400 89896";

/** Secondary line, shown alongside the primary number. */
export const SALES_PHONE_ALT = "+44 7470 911 557";

/** "Round, 1.02ct, D/VVS1" — the recap that rides along with every enquiry. */
export function stoneDescriptor(stone: Pick<Stone, "shapeName" | "carat" | "color" | "clarity">): string {
  return `${stone.shapeName}, ${stone.carat.toFixed(2)}ct, ${stone.color}/${stone.clarity}`;
}

/** Anything with a SKU that can be enquired on — a stone or a piece of jewelry. */
type Enquirable = { sku: string; noun: string; descriptor: string };

const asStone = (stone: Stone): Enquirable => ({
  sku: stone.sku,
  noun: "stone",
  descriptor: stoneDescriptor(stone),
});

const asJewel = (jewel: JewelSummary): Enquirable => ({
  sku: jewel.sku,
  noun: "piece",
  descriptor: jewelDescriptor(jewel),
});

function subjectFor(item: Enquirable): string {
  return `Enquiry - SKU ${item.sku}`;
}

function bodyFor(item: Enquirable): string {
  return `Hi, I'm interested in ${item.noun} SKU ${item.sku} (${item.descriptor}). Please share more details.`;
}

function mailtoFor(item: Enquirable): string {
  const params = new URLSearchParams({ subject: subjectFor(item), body: bodyFor(item) });
  // URLSearchParams encodes spaces as "+", which mail clients render literally
  // in a subject line. %20 is correct for a mailto query.
  return `mailto:${SALES_EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
}

function whatsappFor(item: Enquirable): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(bodyFor(item))}`;
}

export function enquirySubject(stone: Stone): string {
  return subjectFor(asStone(stone));
}

export function enquiryBody(stone: Stone): string {
  return bodyFor(asStone(stone));
}

export function mailtoHref(stone: Stone): string {
  return mailtoFor(asStone(stone));
}

export function whatsappHref(stone: Stone): string {
  return whatsappFor(asStone(stone));
}

export function jewelMailtoHref(jewel: JewelSummary): string {
  return mailtoFor(asJewel(jewel));
}

export function jewelWhatsappHref(jewel: JewelSummary): string {
  return whatsappFor(asJewel(jewel));
}

/**
 * One enquiry for the whole shortlist, instead of one per stone.
 * "Hi, I'm interested in these 3 stones:\n1. SKU OM-1026 (Round, 1.02ct, D/VVS1)\n…"
 */
type ListedStone = Pick<Stone, "sku" | "shapeName" | "carat" | "color" | "clarity" | "origin">;

export function shortlistSubject(stones: ListedStone[]): string {
  return `Enquiry - ${stones.length} stones: ${stones.map((s) => s.sku).join(", ")}`;
}

export function shortlistBody(stones: ListedStone[]): string {
  const lines = stones.map(
    (s, i) =>
      `${i + 1}. SKU ${s.sku} (${stoneDescriptor(s)}, ${s.origin === "natural" ? "natural" : "lab-grown"})`,
  );
  return `Hi, I'm interested in these ${stones.length} stones:\n${lines.join("\n")}\n\nPlease share prices, availability and more details.`;
}

export function shortlistMailtoHref(stones: ListedStone[]): string {
  const params = new URLSearchParams({
    subject: shortlistSubject(stones),
    body: shortlistBody(stones),
  });
  return `mailto:${SALES_EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
}

export function shortlistWhatsappHref(stones: ListedStone[]): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(shortlistBody(stones))}`;
}

/**
 * A ring built from a loose stone and one of our designs. Without a setting it
 * is a request for a made-to-order design around the stone.
 */
export type RingBuild = {
  stone: ListedStone;
  setting?: { sku: string; name: string };
  /** "18K white gold, high polish" */
  metal?: string;
  /** "US 6½ (UK M, EU 52)" */
  size?: string;
  /** What goes inside the band, already stripped of anything unengravable. */
  engraving?: string;
  /** The saved build's code, so the desk can open the same ring the buyer sees. */
  reference?: string;
  /** Absolute link that reopens the build. */
  link?: string;
};

export function ringBuildSubject(build: RingBuild): string {
  return build.setting
    ? `Ring enquiry - stone ${build.stone.sku} in setting ${build.setting.sku}`
    : `Ring enquiry - setting for stone ${build.stone.sku}`;
}

export function ringBuildBody(build: RingBuild): string {
  const { stone, setting } = build;
  const lines = [
    `Stone: SKU ${stone.sku} (${stoneDescriptor(stone)}, ${stone.origin === "natural" ? "natural" : "lab-grown"})`,
    setting
      ? `Setting: SKU ${setting.sku} (${setting.name})`
      : "Setting: please suggest a design for this stone",
    build.metal ? `Metal: ${build.metal}` : undefined,
    `Ring size: ${build.size ?? "not sure yet"}`,
    build.engraving ? `Engraving inside the band: "${build.engraving}"` : undefined,
    build.reference ? `Saved ring: ${build.reference}` : undefined,
    build.link ? `Opens here: ${build.link}` : undefined,
  ].filter(Boolean);
  return `Hi, I'd like a ring made with:\n${lines.map((l) => `- ${l}`).join("\n")}\n\nPlease confirm the price and lead time.`;
}

export function ringBuildMailtoHref(build: RingBuild): string {
  const params = new URLSearchParams({
    subject: ringBuildSubject(build),
    body: ringBuildBody(build),
  });
  return `mailto:${SALES_EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
}

export function ringBuildWhatsappHref(build: RingBuild): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(ringBuildBody(build))}`;
}

/**
 * The WhatsApp updates list: new stock across a category, and market notes.
 * Deliberately worded as a general list, so the desk never mistakes it for an
 * alert on one particular stone.
 */
export const UPDATE_TOPICS = [
  { id: "natural", label: "New natural stones" },
  { id: "lab", label: "New lab-grown stones" },
  { id: "jewelry", label: "New jewelry" },
  { id: "insights", label: "Market insights" },
] as const;

export type UpdateTopic = (typeof UPDATE_TOPICS)[number]["id"];

export function updatesBody({
  topics,
  name,
  buyer,
}: {
  topics: UpdateTopic[];
  name?: string;
  buyer?: "private" | "trade";
}): string {
  const lines = [
    "Hi, please add me to your WhatsApp updates list. This is a general sign-up, not an alert for a specific stone.",
    name?.trim() ? `Name: ${name.trim().slice(0, 80)}` : undefined,
    buyer ? `Buying as: ${buyer === "trade" ? "trade / business" : "private buyer"}` : undefined,
    "Please send me:",
    ...UPDATE_TOPICS.filter((t) => topics.includes(t.id)).map((t) => `- ${t.label}`),
    "",
    "I can ask to be removed at any time.",
  ];
  return lines.filter((l) => l !== undefined).join("\n");
}

export function updatesWhatsappHref(options: Parameters<typeof updatesBody>[0]): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(updatesBody(options))}`;
}

/** General enquiry links, for the header and contact page. */
export function generalWhatsappHref(message?: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message ?? "Hi, I'd like to enquire about loose diamonds.",
  )}`;
}

export function generalMailtoHref(message?: string): string {
  const params = new URLSearchParams({ subject: "General enquiry" });
  if (message) params.set("body", message);
  return `mailto:${SALES_EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
}
