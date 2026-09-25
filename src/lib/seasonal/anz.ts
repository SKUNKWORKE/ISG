import { EN } from "./labels";
import type { Occasion } from "./types";

/**
 * Australia and New Zealand.
 *
 * The seasons are inverted relative to every other market here, which is not a
 * cosmetic difference: Christmas and the peak proposal window fall in high
 * summer, and the copy is written for that rather than translated out of a
 * northern-hemisphere page.
 */

const base = {
  region: "anz",
  lang: "en-AU",
  formatLocale: "en-AU",
  variant: "native",
  labels: EN,
} as const;

export const ANZ_OCCASIONS: Occasion[] = [
  {
    ...base,
    slug: "valentines-day",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 February, fixed" },
    title: "Valentine's Day diamonds Australia and NZ: heart and round, D to F",
    description:
      "Heart and round loose diamonds in D-F for Valentine's Day in Australia and New Zealand. Natural and lab-grown, independently graded, filtered and ready to enquire on.",
    eyebrow: "Australia and New Zealand · Valentine's Day",
    heading: "Mid-February, mid-summer",
    standfirst:
      "Valentine's Day lands in the middle of the Australian and New Zealand summer, at the end of the holiday period rather than in the depth of winter. It sits a few weeks after the season's proposals, which gives it a distinct character: more often a gift between people already committed than a first declaration.",
    sections: [
      {
        heading: "Why heart and round",
        body: [
          "The heart is the only cut that reads as a symbol before it reads as a stone, which is what ties it to this date. It is also the one that shows poor workmanship at a distance: the lobes must match, the cleft must be cleanly cut, and the whole outline must be symmetrical about its centre. Those are symmetry and polish questions, and they are worth checking on images before anything is decided.",
          "The round is the quieter answer, and the more flexible one. It is the only shape with a published cut standard, so it can be judged properly from a report, and it goes into any future remake without difficulty.",
        ],
      },
      {
        heading: "Why D to F",
        body: [
          "D, E and F are the colourless grades. Individually they are close to impossible to separate once a stone is mounted, but the band as a whole reads clearly whiter than near-colourless when stones are compared side by side.",
          "There is a local argument for colourless as well. Australian and New Zealand jewellery is worn in far harsher, brighter daylight than northern markets ever see, and strong direct sun is the least forgiving light a diamond can be looked at in. Any warmth in the body colour is more likely to be noticed here than in a European winter.",
        ],
      },
      {
        heading: "Delivery across the Tasman",
        body: [
          "Stones are held individually and quoted individually, and shipping to both Australian and New Zealand addresses is arranged the same way. Send a reference and we will confirm availability, the report and the price, with the duty and GST position for the destination set out alongside it.",
        ],
      },
    ],
    brief: { shapes: "Heart and round", colour: "D-F, colourless" },
    primary: { shapes: ["heart", "round"], colors: ["D", "E", "F"] },
  },
  {
    ...base,
    slug: "engagement-season",
    date: {
      kind: "window",
      from: [12, 1],
      to: [2, 28],
      rule: "December to February, the southern summer holidays",
    },
    title: "Summer engagement season diamonds ANZ: round and emerald, D to F",
    description:
      "Round and emerald cut loose diamonds in D-F for the Australian and New Zealand summer engagement season, December to February. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "Australia and New Zealand · Summer engagement season",
    heading: "Proposals happen over the summer break",
    standfirst:
      "The peak proposal window here runs from December through February, which is high summer and the long holiday period at once. People are travelling, families are together, and the year has genuinely stopped. It is the southern equivalent of the American Thanksgiving-to-New-Year stretch, shifted half a year and stretched wider.",
    sections: [
      {
        heading: "Why round and emerald",
        body: [
          "The round is the benchmark. It is the only cut with a published proportion standard, it is the easiest shape to compare between sellers without seeing either stone, and it is the least complicated to reset if the ring is ever remade.",
          "The emerald cut is the considered alternative, and it is a genuinely different thing rather than a variation. It is a step cut: long parallel facets returning light in broad flashes, instead of a brilliant's many small facets scattering it into sparkle. The result is architectural and restrained, and it has taken a substantial share of this market over the last few years.",
        ],
      },
      {
        heading: "Why D to F, and why it matters more on an emerald",
        body: [
          "The colourless band is the right brief for a stone that will be looked at closely for decades. On an emerald cut it is close to non-negotiable: the wide flat table and the long open planes give body colour nowhere to hide, so warmth that would pass unremarked in a brilliant is plainly visible in a step cut.",
          "Clarity follows the same logic. A brilliant's facet pattern breaks up small inclusions and conceals them; an emerald's open table puts them on display. Read the clarity grade more carefully than usual on a step cut, and ask for images before deciding.",
        ],
      },
      {
        heading: "Ordering against a summer date",
        body: [
          "The constraint over this window is workshop time rather than stone availability, and it coincides with the period when trade shuts down for several weeks. If the date is fixed, reserve the stone early and let the setting follow. A loose stone can be confirmed and sent quickly; a finished ring in January cannot.",
        ],
      },
    ],
    brief: { shapes: "Round and emerald", colour: "D-F, colourless" },
    primary: { shapes: ["round", "emerald"], colors: ["D", "E", "F"] },
  },
  {
    ...base,
    slug: "christmas",
    date: { kind: "fixed", month: 12, day: 25, rule: "25 December, fixed" },
    title: "Christmas diamonds Australia and NZ: round and princess, D to G",
    description:
      "Round and princess loose diamonds in D-G for a southern-hemisphere Christmas. Natural and lab-grown, independently graded, filtered and ready to enquire on.",
    eyebrow: "Australia and New Zealand · Christmas",
    heading: "Christmas outdoors, in full daylight",
    standfirst:
      "A southern Christmas is not a northern one moved. It happens outdoors, in the middle of summer, in bright direct light rather than by candlelight in a dark room. That changes what a stone has to do on the day it is opened.",
    sections: [
      {
        heading: "Light is the local variable",
        body: [
          "Northern Christmas gifting is judged in warm, low, artificial light, which flatters almost any diamond: it hides warmth in the body colour and masks small inclusions. Bright outdoor summer light does neither. It is the most revealing light a stone can be seen in, and it is the light this gift will be opened in.",
          "That argues for paying attention to cut above everything else. A well-proportioned stone returns light from the top in strong daylight; a poorly proportioned one leaks it through the pavilion and goes flat exactly when it is being looked at hardest.",
        ],
      },
      {
        heading: "Why round and princess",
        body: [
          "The round is the only shape with an overall cut grade on its report, which makes it the one shape where the point above can actually be bought on paper rather than judged by eye.",
          "The princess is the square brilliant and it is here on value. It follows the octahedral rough far more closely than a round does, so much less weight is lost in cutting, and the saving shows up in the price per carat. For a fixed budget it is usually the larger of the two stones.",
        ],
      },
      {
        heading: "Why D to G",
        body: [
          "D to G keeps the stone convincingly white while leaving budget for cut and for carat, which are the two things bright daylight actually rewards. On a princess, read the depth figure as well: past the mid-seventies in percent, weight is being carried below the girdle where it costs money and adds no visible size.",
        ],
      },
    ],
    brief: { shapes: "Round and princess", colour: "D-G" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...base,
    slug: "mothers-day",
    date: { kind: "computed", id: "anz-mothers-day", rule: "Second Sunday in May" },
    title: "Mother's Day diamonds Australia and NZ: round and oval, D to G",
    description:
      "Round and oval loose diamonds in D-G for Mother's Day in Australia and New Zealand, the second Sunday in May. Filtered and ready to enquire on.",
    eyebrow: "Australia and New Zealand · Mother's Day",
    heading: "A piece for everyday wear",
    standfirst:
      "Mother's Day falls on the second Sunday in May in both Australia and New Zealand, the same date as the United States and most of Europe. Autumn here rather than spring, but the brief is the same: something worn daily, not something kept for occasions.",
    sections: [
      {
        heading: "Why round and oval",
        body: [
          "The round is the standard for studs and solitaire pendants, and for a practical reason: it is the only shape carrying an overall cut grade, so a matched pair can be settled on paper before it is judged by eye. Two earrings that differ slightly in cut read as mismatched well before they read as different weights.",
          "The oval spreads its weight along a longer outline, so it covers more finger or more of the neckline than a round of the same carat. Where the budget is fixed and presence is the point, it is the shape that gets the most out of it.",
        ],
      },
      {
        heading: "Why D to G",
        body: [
          "Running to G rather than stopping at F widens the field considerably without admitting colour that shows in wear. G sits at the top of near-colourless and is not separable from F in a mounted stone without a comparison set. What that saves goes into carat or into cut, both of which are visible every day.",
        ],
      },
      {
        heading: "What to look at on an oval",
        body: [
          "Every oval carries a bow-tie, the dark band across the middle created by the way the facets meet. The question is never whether it is there but whether it is faint or obvious, and no report records it. Ask for images of any oval on the list and it shows up straight away.",
        ],
      },
    ],
    brief: { shapes: "Round and oval", colour: "D-G" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...base,
    slug: "boxing-day",
    date: { kind: "fixed", month: 12, day: 26, rule: "26 December, fixed" },
    title: "Boxing Day diamonds Australia and NZ: round, D to G",
    description:
      "Round loose diamonds in D-G for Boxing Day in Australia and New Zealand. Each stone graded independently and quoted on its own rather than discounted from a list.",
    eyebrow: "Australia and New Zealand · Boxing Day",
    heading: "The biggest self-purchase day of the year",
    standfirst:
      "Boxing Day is the largest single retail day in the Australian and New Zealand calendar, and a disproportionate share of it is people buying for themselves. The buyer has generally done the reading, and arrives with specifications rather than with a brief.",
    sections: [
      {
        heading: "Why round only",
        body: [
          "This filter is deliberately narrowed to one shape. The round is the only cut for which GIA and IGI issue an overall cut grade, which makes it the only shape where two stones from two different sellers can be compared properly without either being in front of you.",
          "On a day whose entire logic is comparison, that is worth more than a wider choice. Every other shape has to be assessed from polish, symmetry and proportions read individually, which is perfectly doable but is not a like-for-like comparison.",
        ],
      },
      {
        heading: "Why D to G",
        body: [
          "D to G is the band where colour stops being the deciding factor and cut takes over. Within it, a buyer working from specifications is usually better off with an Excellent or Ideal cut grade at G than with a D of ordinary proportions, because cut is what determines how much light comes back out of the top of the stone.",
        ],
      },
      {
        heading: "No sale price, because there is no list price",
        body: [
          "Nothing here is marked down, because nothing here carries a list price to mark down from. Stones are bought one at a time rather than in parcels and quoted individually against what they are: weight, grades, finish and report. That holds on the twenty-sixth of December exactly as it does in July.",
        ],
      },
    ],
    brief: { shapes: "Round", colour: "D-G" },
    primary: { shapes: ["round"], colors: ["D", "E", "F", "G"] },
  },
];
