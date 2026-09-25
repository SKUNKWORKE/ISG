import { EN } from "./labels";
import type { Occasion } from "./types";

const base = {
  region: "us",
  lang: "en",
  formatLocale: "en-US",
  variant: "native",
  labels: EN,
} as const;

export const US_OCCASIONS: Occasion[] = [
  {
    ...base,
    slug: "valentines-day",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 February, fixed" },
    title: "Valentine's Day diamonds: heart and round, D to F",
    description:
      "Loose heart and round diamonds in the colourless grades for Valentine's Day, filtered to D-F and ready to enquire on. Natural and lab-grown, each stone graded and quoted individually.",
    eyebrow: "United States · Valentine's Day",
    heading: "A stone chosen for the fourteenth",
    standfirst:
      "Valentine's Day concentrates more romantic gifting into a single week than any other date in the American calendar. The two shapes that carry it are the heart, which says what the occasion means without help, and the round, which says it more quietly.",
    sections: [
      {
        heading: "Why heart and round",
        body: [
          "The heart is the only cut in the standard range that reads as a symbol before it reads as a diamond, which is exactly why it belongs to this date and to almost no other. It is also the least forgiving shape to buy badly: the cleft and the two lobes have to be symmetrical, and a poorly cut heart looks wrong from across a room rather than under a loupe. Symmetry and polish grades matter more here than they do on a round.",
          "The round is the other half of the answer. It carries a published cut standard, which makes it the easiest shape to compare on paper, and it is the safest choice where a stone may be reset into something else later. For a first serious gift rather than a proposal, that flexibility is worth more than it looks.",
        ],
      },
      {
        heading: "Why D to F",
        body: [
          "D, E and F are the colourless grades. The distinction between them is invisible face-up in a mounted stone to almost everyone, including most of the trade, but the three of them together sit clearly above the near-colourless range in a way that shows when two stones are next to each other.",
          "For a gift that will be worn against skin and shown under warm indoor light, colourless is the grade band that holds up without argument. It is also the band that resells and reappraises predictably, which is a duller reason and a real one.",
        ],
      },
      {
        heading: "Ordering in time",
        body: [
          "Stones are held individually, so anything on the list can be reserved against a date. Send the reference and we will confirm availability, the laboratory report and the price before anything is committed.",
        ],
      },
    ],
    brief: { shapes: "Heart and round", colour: "D-F, colourless" },
    primary: { shapes: ["heart", "round"], colors: ["D", "E", "F"] },
  },
  {
    ...base,
    slug: "mothers-day",
    date: { kind: "computed", id: "us-mothers-day", rule: "Second Sunday in May" },
    title: "Mother's Day diamonds: round and oval, D to G",
    description:
      "Round and oval loose diamonds in D-G for Mother's Day, the second Sunday in May. Filtered and ready to enquire on, natural or lab-grown, each stone graded independently.",
    eyebrow: "United States · Mother's Day",
    heading: "Something to be worn, not put away",
    standfirst:
      "Mother's Day is a gifting occasion with a different brief from a proposal. The stone is more likely to be set into a pendant, a pair of studs or a right-hand ring than an engagement setting, and it is far more likely to be worn daily.",
    sections: [
      {
        heading: "Why round and oval",
        body: [
          "The round is the default for studs and solitaire pendants for a practical reason: it is the one shape with a cut grade on the report, so a pair can be matched on paper before they are matched by eye. For earrings that matters, because two stones that differ slightly in cut read as a mismatch long before they read as two different weights.",
          "The oval does the opposite job. It covers more finger or more of the chest per carat than a round of the same weight, because the weight is spread across a longer outline rather than carried in depth. For a gift where presence is the point and budget is finite, that is the shape that does the most work.",
        ],
      },
      {
        heading: "Why D to G",
        body: [
          "Extending the band to G rather than stopping at F widens the field substantially without introducing colour that shows in wear. G is the first near-colourless grade, and in a white metal setting under ordinary light it is not separable from F without a comparison stone and a grading tray.",
          "The gain is in choice: across round and oval at the same weight, opening D-F to D-G typically multiplies the number of stones on the list, and the difference goes into carat, cut or clarity instead of into a colour grade nobody will see.",
        ],
      },
      {
        heading: "What to check on an oval",
        body: [
          "Ovals carry a bow-tie, a dark band across the centre that comes from the way the facets meet. Every oval has one; the question is whether it is faint or obvious, and it is not a figure that appears on any report. Ask for images of any oval on the list and it will be visible immediately.",
        ],
      },
    ],
    brief: { shapes: "Round and oval", colour: "D-G" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...base,
    slug: "engagement-season",
    date: {
      kind: "window",
      from: [11, 26],
      to: [12, 31],
      rule: "Thanksgiving to New Year's Eve; Thanksgiving is the fourth Thursday in November",
    },
    title: "Engagement season diamonds: round, cushion and oval, D to F",
    description:
      "Round, cushion and oval loose diamonds in D-F for engagement season, the Thanksgiving to New Year's Eve proposal window. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "United States · Engagement season",
    heading: "The five weeks that carry the year",
    standfirst:
      "More American proposals happen between Thanksgiving and New Year's Eve than in any comparable stretch of the calendar. Families are already in one place, people are already travelling, and the dates that matter are already circled.",
    sections: [
      {
        heading: "Why round, cushion and oval",
        body: [
          "These three cover most of what an engagement stone is asked to do. The round is the benchmark: the only shape with a published cut standard, the easiest to compare between sellers, and the one that holds its position if the ring is ever remade.",
          "The cushion trades some of that light return for a softer outline and, at the same weight, a lower cost per carat than a round. It suits a setting with detail in it, because it does not compete with the metalwork the way a round does. The oval spreads its weight into length, which reads larger on the hand and elongates the finger, and that is the reason it has taken so much of this market in the last decade.",
        ],
      },
      {
        heading: "Why D to F",
        body: [
          "An engagement stone is looked at more closely, and for longer, than any other piece of jewellery a person owns. It is also the one most often compared directly against someone else's. Colourless is the band that survives both.",
          "D, E and F also behave predictably in platinum and white gold, where any warmth in a stone has nothing to hide behind. In yellow or rose metal the case for paying for D weakens considerably, and a G or H stone set in warm metal is a defensible choice, but that is a different brief from this one.",
        ],
      },
      {
        heading: "Timing the order",
        body: [
          "The practical constraint in this window is setting time, not stone availability. A loose stone can be confirmed and shipped quickly; a finished ring cannot. If the date is fixed, work backwards from it and reserve the stone early. We will hold a reference while the setting is decided.",
        ],
      },
    ],
    brief: { shapes: "Round, cushion and oval", colour: "D-F, colourless" },
    primary: { shapes: ["round", "cushion", "oval"], colors: ["D", "E", "F"] },
  },
  {
    ...base,
    slug: "christmas",
    date: { kind: "fixed", month: 12, day: 25, rule: "25 December, fixed" },
    title: "Christmas diamonds: round and princess, D to G",
    description:
      "Round and princess loose diamonds in D-G for Christmas, the single biggest jewellery day in the US calendar. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "United States · Christmas",
    heading: "The twenty-fifth, and what it takes to get there",
    standfirst:
      "Christmas Day moves more jewellery in the United States than any other date. It is also the least forgiving on timing, because the deadline is absolute and shared by everyone ordering at once.",
    sections: [
      {
        heading: "Why round and princess",
        body: [
          "The round needs little defence: it is the most studied cut in the trade and the one that behaves most predictably in the mixed, warm, low light that a room in December actually has.",
          "The princess is the square brilliant, and it earns its place here on value. Because it follows the shape of the original octahedral rough far more closely than a round does, far less weight is lost in cutting, and the saving shows up in the price per carat. For a given budget a princess will generally be the larger stone.",
        ],
      },
      {
        heading: "Why D to G",
        body: [
          "D through G keeps the stone visibly white while leaving room to move on the figures that a recipient will actually notice, which are size and how the stone behaves in light. Stopping at F narrows the field for a difference that is invisible once the stone is set.",
        ],
      },
      {
        heading: "One thing to check on a princess",
        body: [
          "Corners are the princess's weak point. They are the thinnest part of the stone and the part most likely to chip in daily wear, so any princess intended for a ring should sit in a setting with a prong covering each corner. Depth is the other figure worth reading: much beyond the mid-seventies in percent means weight carried below the girdle, where it adds cost but no visible size.",
        ],
      },
    ],
    brief: { shapes: "Round and princess", colour: "D-G" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...base,
    slug: "black-friday",
    date: { kind: "computed", id: "us-black-friday", rule: "The day after Thanksgiving" },
    title: "Black Friday and Cyber Monday diamonds: round, D to G",
    description:
      "Round loose diamonds in D-G for the Black Friday and Cyber Monday window. Every stone graded independently and quoted on its own, with no list price and no countdown.",
    eyebrow: "United States · Black Friday and Cyber Monday",
    heading: "A week when people buy for themselves",
    standfirst:
      "The late-November sale window behaves differently from the rest of the season. Far more of it is self-purchase, the buyer has usually done the reading, and the questions that arrive are about proportions and certificates rather than about presentation.",
    sections: [
      {
        heading: "Why round only",
        body: [
          "This is the one filter in the seasonal range narrowed to a single shape, and it is narrowed deliberately. The round is the only cut for which the laboratories issue an overall cut grade, which makes it the only shape where two stones from two sellers can be compared properly without seeing either of them.",
          "For a buyer working from specifications in a week built around comparison, that matters more than breadth. Every other shape is judged on polish, symmetry and proportions read individually, which is perfectly possible, but it is not a like-for-like comparison, and a sale week is when like-for-like comparison is the whole exercise.",
        ],
      },
      {
        heading: "Why D to G",
        body: [
          "D-G is the band where the colour question stops mattering and the cut question starts. Within it, a buyer choosing on specification is usually better served by spending on an Excellent or Ideal cut grade at G than on a D with ordinary proportions, because cut is what determines how the stone actually behaves in light.",
        ],
      },
      {
        heading: "How pricing works here",
        body: [
          "There is no list price to discount from. Stones are bought one at a time rather than as parcels, and each is quoted on its own against what it actually is: weight, grades, finish and report. Send a reference and the quote comes back with the certificate and images attached, in the same week as any other.",
        ],
      },
    ],
    brief: { shapes: "Round", colour: "D-G" },
    primary: { shapes: ["round"], colors: ["D", "E", "F", "G"] },
  },
];
