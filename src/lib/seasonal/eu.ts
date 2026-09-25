import { EN } from "./labels";
import type { Occasion } from "./types";

/**
 * The umbrella pages for EU markets without a dedicated language variant.
 *
 * They are written in English and stay deliberately general about the gift
 * moment itself, because the one thing the EU does not share is when presents
 * are opened. France and Germany open them on the evening of the 24th, Spain's
 * main exchange is 6 January, and the Netherlands has a separate December
 * occasion entirely. The country pages carry that detail; these do not pretend to.
 */

const base = {
  region: "eu",
  lang: "en",
  formatLocale: "en-GB",
  variant: "en",
  labels: EN,
} as const;

export const EU_OCCASIONS: Occasion[] = [
  {
    ...base,
    slug: "valentines-day",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 February, fixed" },
    title: "Valentine's Day diamonds in Europe: heart and round, D to F",
    description:
      "Heart and round loose diamonds in D-F for Valentine's Day across the European market. Natural and lab-grown, independently graded, filtered and ready to enquire on.",
    eyebrow: "Europe · Valentine's Day",
    heading: "One date the whole continent keeps",
    standfirst:
      "Valentine's Day is the rare European gifting occasion that needs no translation. The date does not move, it is observed from Lisbon to Helsinki, and unlike Christmas it falls on the same day in every market on the map.",
    sections: [
      {
        heading: "Why heart and round",
        body: [
          "The heart is the one cut that states the occasion before it states anything about the stone, which is what ties it to this date and to no other. It is also the shape most easily bought badly: the two lobes must match, the cleft must be cleanly defined, and the outline must be symmetrical about its centre line. Those are questions of symmetry grade and of looking at images, not of price.",
          "The round is for the buyer who wants the occasion marked without the symbol spelled out. It is the only shape with a published cut standard, so it is the easiest to assess from a report alone, and the most straightforward to reset if the piece is remade later.",
        ],
      },
      {
        heading: "Why D to F",
        body: [
          "D, E and F are the colourless grades, and as a band they read clearly whiter than near-colourless when two stones are seen together, even though the three are hard to separate individually once a stone is set.",
          "European buying runs strongly to platinum and white gold, which is where colourless earns its premium: white metal gives a stone nowhere to hide warmth. Against yellow or rose gold the same premium is much harder to justify, and a near-colourless stone is often the better-judged purchase.",
        ],
      },
      {
        heading: "Shipping within the EU",
        body: [
          "Stones are held individually and quoted individually, so a reference can be reserved while a setting is arranged. Send us the reference and we will confirm availability, the laboratory report and the price, along with what applies on duties and documentation for the destination.",
        ],
      },
    ],
    brief: { shapes: "Heart and round", colour: "D-F, colourless" },
    primary: { shapes: ["heart", "round"], colors: ["D", "E", "F"] },
  },
  {
    ...base,
    slug: "christmas",
    date: {
      kind: "window",
      from: [12, 24],
      to: [12, 25],
      rule: "24 to 25 December; the gift moment itself varies by country",
    },
    title: "Christmas diamonds in Europe: round and princess, D to G",
    description:
      "Round and princess loose diamonds in D-G for Christmas across European markets. Natural and lab-grown, independently graded, filtered and ready to enquire on.",
    eyebrow: "Europe · Christmas",
    heading: "The same week, a different evening",
    standfirst:
      "Christmas is observed across Europe, but the moment the gift is actually handed over is not shared. Much of the continent opens presents on the evening of the twenty-fourth; parts of it wait for the twenty-fifth; Spain's principal exchange is not until January. The shopping deadline shifts accordingly.",
    sections: [
      {
        heading: "Know which evening you are buying for",
        body: [
          "In France, Germany, Austria, Poland, the Czech Republic and much of Scandinavia, the gift moment is the evening of 24 December. In Italy it straddles the Vigilia and Christmas Day itself. In Spain the main exchange belongs to the Reyes Magos on 6 January, nearly a fortnight later.",
          "For anyone ordering into Europe this is the practical detail that matters most, because it moves the real deadline by a day in one direction and by twelve in the other. Where the difference affects a specific market, the country pages set it out rather than leaving it to be inferred here.",
        ],
      },
      {
        heading: "Why round and princess",
        body: [
          "The round is the most predictable shape in the warm, low, mixed light that a December evening indoors actually provides, and the only one with a published cut standard to buy from.",
          "The princess is the square brilliant and it is here on value. It follows the original octahedral rough far more closely than a round does, so much less weight is lost in the cutting, and that saving appears directly in the price per carat. At a set budget it is generally the larger stone of the two.",
        ],
      },
      {
        heading: "Why D to G",
        body: [
          "D through G keeps a stone convincingly white while leaving budget for what is actually noticed in wear, which is size and behaviour in light. If the stone is a princess, read the depth percentage as well: beyond the mid-seventies, weight is sitting below the girdle where it adds cost without adding any face-up size.",
        ],
      },
    ],
    brief: { shapes: "Round and princess", colour: "D-G" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F", "G"] },
  },
];
