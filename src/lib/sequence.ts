import manifest from "@/data/sequence-manifest.json";

/**
 * In development the converted frames are served from the app's own /public
 * folder. In production point NEXT_PUBLIC_SEQUENCE_BASE_URL at a real asset CDN
 * (R2, Bunny, Vercel Blob, S3+CloudFront) and upload public/sequence there.
 *
 * The raw GitHub source is a one-time input to the conversion script and is
 * never referenced at runtime, in either environment.
 */
const BASE = (process.env.NEXT_PUBLIC_SEQUENCE_BASE_URL || "/sequence").replace(/\/+$/, "");

/**
 * Two independent sequences, each at two sizes, in their own folders. Built by
 * scripts/convert-sequence.mjs, which crops every frame to the stone and keeps
 * every second source frame (the hero cross-fades between them):
 *
 *   scroll/         the hero cutting sequence, 1440px
 *   scroll-mobile/  the same frames, 720px, for narrow screens
 *   rotate/         looping 360° turn of the finished stone, 1440px
 *   rotate-mobile/  the same turn, 720px
 *
 * The folder names date from when the hero was scrubbed by scrolling; it now
 * plays on a timer, but the names stay so deployed CDN paths keep working.
 */
export type SequenceTier = "scroll" | "scroll-mobile" | "rotate" | "rotate-mobile";

/** At or below this viewport width the 720px tiers are used. */
export const MOBILE_TIER_MAX_WIDTH = 900;

/** The intro and turntable tiers for a viewport, chosen once when a player mounts. */
export function tiersFor(viewportWidth: number): { intro: SequenceTier; loop: SequenceTier } {
  return viewportWidth <= MOBILE_TIER_MAX_WIDTH
    ? { intro: "scroll-mobile", loop: "rotate-mobile" }
    : { intro: "scroll", loop: "rotate" };
}

export const SEQUENCE: Record<SequenceTier, { frames: number; width: number }> = manifest.tiers;

/**
 * Files on disk are numbered from 00001, matching the source renders. Code
 * works in 0-based indices everywhere, so the +1 happens here and only here —
 * index 0 is 00001.webp.
 */
export function frameUrl(tier: SequenceTier, index: number): string {
  return `${BASE}/${tier}/${String(index + 1).padStart(5, "0")}.webp`;
}

export function frameCount(tier: SequenceTier): number {
  return SEQUENCE[tier].frames;
}

/**
 * The five stages of the cut, as proportions of the sequence. Playback progress
 * drives both the frame index and which caption is showing, so these are
 * expressed as fractions rather than frame numbers and stay correct if the
 * frame count changes.
 */
export type Stage = {
  id: string;
  title: string;
  body: string;
  /** Inclusive start, exclusive end, as a fraction of total progress. */
  from: number;
  to: number;
  /** Where in the sequence to pull the representative still for this stage. */
  still: number;
  /** Alt text for that still. */
  stillAlt: string;
};

export const STAGES: Stage[] = [
  {
    id: "rough",
    title: "In the rough",
    body: "A crystal as it left the ground. Nothing about the finished stone is decided yet — not the shape, not the weight, not whether it becomes one diamond or three.",
    from: 0,
    to: 0.2,
    still: 0.05,
    stillAlt: "An uncut diamond crystal, its natural faces still rough and unpolished.",
  },
  {
    id: "plan",
    title: "Reading the stone",
    body: "The rough is scanned and mapped inclusion by inclusion. Every possible cut is modelled against the crystal, and one is chosen — the plan that trades the least weight for the most light.",
    from: 0.2,
    to: 0.4,
    still: 0.3,
    stillAlt:
      "A scan of the rough crystal with three candidate stones mapped inside it in red, blue and green, showing the possible cuts being weighed against one another.",
  },
  {
    id: "saw",
    title: "The first cut",
    body: "The stone is opened along the planned line. This is the irreversible step: from here the outline is fixed, and the remaining work is a matter of degrees rather than decisions.",
    from: 0.4,
    to: 0.6,
    still: 0.5,
    stillAlt: "The opened stone separating from the offcuts of rough around it.",
  },
  {
    id: "facet",
    title: "Facet by facet",
    body: "Each facet is ground and polished to a set angle, checked, and returned to the wheel. Tolerances are measured in microns, because a fraction of a degree at the pavilion decides whether light comes back or passes through.",
    from: 0.6,
    to: 0.86,
    // The clearest frame of the fully faceted stone with polishing dust around it.
    still: 0.835,
    stillAlt:
      "The fully faceted stone, face up, with a cloud of polishing dust suspended around it.",
  },
  {
    id: "finish",
    title: "Light, returned",
    body: "The finished stone, cleaned and ready for the laboratory. What it is graded at — colour, clarity, cut, carat — was largely settled by the plan made before the first cut.",
    from: 0.86,
    to: 1.0001,
    still: 1,
    stillAlt: "The finished radiant-cut diamond, face up, fully polished.",
  },
];

export function stageAt(progress: number): Stage {
  return STAGES.find((s) => progress >= s.from && progress < s.to) ?? STAGES[STAGES.length - 1];
}

/** The representative still for a stage, taken from the full-size scroll tier. */
export function stageStillUrl(stage: Stage): string {
  const last = SEQUENCE.scroll.frames - 1;
  return frameUrl("scroll", Math.round(stage.still * last));
}
