import { EN } from "./labels";
import type { Occasion } from "./types";

const base = {
  region: "uk",
  lang: "en-GB",
  formatLocale: "en-GB",
  variant: "native",
  labels: EN,
} as const;

export const UK_OCCASIONS: Occasion[] = [
  {
    ...base,
    slug: "valentines-day",
    date: { kind: "fixed", month: 2, day: 14, rule: "14 February, fixed" },
    title: "Valentine's Day diamonds UK: heart and round, D to F",
    description:
      "Loose heart and round diamonds in D-F for Valentine's Day, filtered and ready to enquire on. Natural and lab-grown stones, each graded by an independent laboratory and quoted individually.",
    eyebrow: "United Kingdom · Valentine's Day",
    heading: "The fourteenth, and the two shapes that suit it",
    standfirst:
      "Valentine's Day in Britain is a narrower occasion than its American counterpart and a more considered one. It skews later, it skews towards a single well-chosen piece rather than several, and a good proportion of it is bought in the week itself.",
    sections: [
      {
        heading: "Why heart and round",
        body: [
          "The heart is the only shape in the standard range that carries its meaning before it carries its grades, which is what makes it specific to this date. It is also the shape where workmanship shows most plainly: the cleft has to be crisp, the lobes have to match, and the outline has to be symmetrical about the centre line. A heart that fails on any of those looks wrong at arm's length, without a loupe and without any training.",
          "The round is the alternative for anyone who wants the occasion marked without the symbol stated outright. It is the only cut with a published grading standard for its proportions, which makes it the simplest shape to judge from a report, and the easiest to reset later if the piece is ever remade.",
        ],
      },
      {
        heading: "Why D to F",
        body: [
          "D, E and F are the colourless grades. Apart under laboratory conditions, they are effectively indistinguishable face-up once a stone is mounted, but as a band they sit clearly above near-colourless when two stones are compared side by side.",
          "British buying leans heavily towards platinum and white gold, and that is where the case for colourless is strongest. A white metal setting gives a stone nowhere to hide any warmth, whereas yellow gold masks it. If the piece is destined for yellow or rose metal, the argument for paying up to D genuinely weakens.",
        ],
      },
      {
        heading: "Ordering and delivery",
        body: [
          "Loose stones are held individually rather than as parcels, so a reference can be reserved against the date while a setting is decided. Send us the reference and the report, images and price come back together.",
        ],
      },
    ],
    brief: { shapes: "Heart and round", colour: "D-F, colourless" },
    primary: { shapes: ["heart", "round"], colors: ["D", "E", "F"] },
  },
  {
    ...base,
    slug: "mothering-sunday",
    date: { kind: "computed", id: "uk-mothering-sunday", rule: "The fourth Sunday of Lent" },
    title: "Mothering Sunday diamonds: round and oval, D to G",
    description:
      "Round and oval loose diamonds in D-G for Mothering Sunday, the fourth Sunday of Lent. A British date in March, distinct from the American Mother's Day in May.",
    eyebrow: "United Kingdom · Mothering Sunday",
    heading: "A March date, and not the American one",
    standfirst:
      "Mothering Sunday falls on the fourth Sunday of Lent, three weeks before Easter, which puts it in March and moves it every year. It is routinely confused with the American Mother's Day in May; they are separate occasions with separate origins, and ordering to the wrong one costs about eight weeks.",
    sections: [
      {
        heading: "A date fixed to Lent, not to the calendar",
        body: [
          "Because Easter is calculated rather than fixed, Mothering Sunday moves with it, landing anywhere between the start of March and early April. The date shown here is the next occurrence, worked out from the same rule rather than read off a list, so it stays right without anyone maintaining it.",
          "The occasion began as the day congregations returned to their mother church, and the gifting convention that grew around it is modest and personal rather than grand. That shapes what suits it: a piece meant for ordinary wear, not for an occasion.",
        ],
      },
      {
        heading: "Why round and oval",
        body: [
          "The round is the practical choice for studs and solitaire pendants, because it is the one shape carrying an overall cut grade on the report. Where two stones have to match, as in a pair of earrings, being able to match them on paper before matching them by eye saves a great deal of back and forth.",
          "The oval spreads the same weight over a longer outline, so it covers more of the finger and reads larger than a round of equal carat. Where the budget is set and presence matters, it is the shape that does the most with it.",
        ],
      },
      {
        heading: "Why D to G",
        body: [
          "Running the band to G rather than stopping at F opens the list considerably without letting in colour that shows in wear. G is the top of near-colourless and is not separable from F in a mounted stone without a comparison set. What is saved goes into weight or into cut, both of which are visible.",
        ],
      },
    ],
    brief: { shapes: "Round and oval", colour: "D-G" },
    primary: { shapes: ["round", "oval"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...base,
    slug: "christmas",
    date: { kind: "fixed", month: 12, day: 25, rule: "25 December, fixed" },
    title: "Christmas diamonds UK: round and princess, D to G",
    description:
      "Round and princess loose diamonds in D-G for Christmas. Natural and lab-grown stones, independently graded, filtered and ready to enquire on.",
    eyebrow: "United Kingdom · Christmas",
    heading: "Bought in December, worn for decades",
    standfirst:
      "Christmas is the heaviest gifting week of the British year, and the one where the deadline is least negotiable. Stones can be confirmed quickly; settings cannot, so the ordering sequence matters more in December than at any other point.",
    sections: [
      {
        heading: "Why round and princess",
        body: [
          "The round is the most studied cut in the trade and the most predictable in the warm, mixed, low light of a British room in December. It is also the shape with a published cut standard, which makes it the easiest to buy well from figures alone.",
          "The princess is the square brilliant and it earns its place on value. It follows the octahedral rough much more closely than a round, so far less weight is lost in cutting, and the difference shows in the price per carat. At a fixed budget the princess is usually the larger stone.",
        ],
      },
      {
        heading: "Why D to G",
        body: [
          "D to G holds the stone visibly white while leaving room to spend on what a recipient actually registers, which is size and the way the stone handles light. Narrowing to D-F trades a good deal of choice for a difference nobody sees once the stone is set.",
        ],
      },
      {
        heading: "What to check on a princess",
        body: [
          "The corners are the vulnerable part of a princess, being the thinnest points of the stone, so a ring setting should carry a prong over each of the four. Depth is the other figure worth reading on the report: past the mid-seventies in percent, weight is being carried below the girdle where it costs money without adding visible size.",
        ],
      },
    ],
    brief: { shapes: "Round and princess", colour: "D-G" },
    primary: { shapes: ["round", "princess"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...base,
    slug: "boxing-day",
    date: { kind: "fixed", month: 12, day: 26, rule: "26 December, fixed" },
    title: "Boxing Day diamonds: round, D to G",
    description:
      "Round loose diamonds in D-G for Boxing Day, filtered and ready to enquire on. Each stone graded independently and quoted on its own rather than marked down from a list.",
    eyebrow: "United Kingdom · Boxing Day",
    heading: "The day the buying turns inward",
    standfirst:
      "Boxing Day is the largest self-purchase day in the British retail calendar. The buyer is spending on themselves, has usually spent December reading rather than shopping, and arrives with specifications rather than with a brief.",
    sections: [
      {
        heading: "Why round only",
        body: [
          "This filter is narrowed to one shape on purpose. The round is the only cut for which GIA and IGI issue an overall cut grade, which makes it the only shape two sellers' stones can be compared on without either being in the room.",
          "On a day built around comparison, that is worth more than breadth of choice. Every other shape has to be judged from polish, symmetry and proportions read one at a time, which is entirely possible but is not a like-for-like comparison, and like-for-like is the whole point of the exercise on the twenty-sixth.",
        ],
      },
      {
        heading: "Why D to G",
        body: [
          "D to G is the band in which colour stops being the deciding question and cut starts. Inside it, a buyer working from specifications is generally better served by an Excellent or Ideal cut at G than by a D with unremarkable proportions, because cut governs how much of the light entering the stone comes back out of the top.",
        ],
      },
      {
        heading: "There is no sale price here",
        body: [
          "Nothing on this list carries a list price to be discounted from. Stones are bought individually rather than in parcels, and each is quoted against what it is: weight, grades, finish and report. That is the same on the twenty-sixth of December as in the middle of June.",
        ],
      },
    ],
    brief: { shapes: "Round", colour: "D-G" },
    primary: { shapes: ["round"], colors: ["D", "E", "F", "G"] },
  },
  {
    ...base,
    slug: "wedding-season",
    date: { kind: "window", from: [6, 1], to: [9, 30], rule: "June to September" },
    title: "Summer wedding season diamonds: round and emerald, D to F",
    description:
      "Round and emerald cut loose diamonds in D-F for the British summer wedding season, June to September. Natural and lab-grown, filtered and ready to enquire on.",
    eyebrow: "United Kingdom · Summer wedding season",
    heading: "June to September, and the engagements around them",
    standfirst:
      "The British wedding season runs from June to September, and it pulls engagement and wedding jewellery demand along with it in both directions: proposals timed ahead of it, and eternity and anniversary pieces bought during it.",
    sections: [
      {
        heading: "Why round and emerald",
        body: [
          "The round is the benchmark and the safe answer. It has a published cut standard, it is the easiest shape to compare between sellers, and it carries over into any future remake without argument.",
          "The emerald cut is the deliberate alternative, and it is a genuinely different object. It is a step cut, not a brilliant: instead of many small facets scattering light into sparkle, it has long parallel planes that return light in broad flashes. The effect is architectural rather than glittering, and it reads as considered, which is why it has come back so strongly for summer weddings.",
        ],
      },
      {
        heading: "Why D to F, especially for an emerald",
        body: [
          "The colourless band matters more on an emerald cut than on almost any other shape. Those long open planes and the large flat table give a stone nowhere to conceal warmth, so body colour that would pass unnoticed in a brilliant is plainly visible in a step cut. Where a G might be perfectly defensible in a round, the same grade in an emerald often is not.",
          "Clarity works the same way. A brilliant's facet pattern breaks up and hides small inclusions; an emerald's open table displays them. For step cuts it is worth reading the clarity grade more carefully than usual, and worth asking for images before committing.",
        ],
      },
      {
        heading: "Timing against the date",
        body: [
          "Summer dates are usually set a long way out, which makes this the one window where there is genuinely time to do things properly: see images, compare two or three stones against each other, and let the setting be made without compressing it. Reserve the stone first and let the setting follow.",
        ],
      },
    ],
    brief: { shapes: "Round and emerald", colour: "D-F, colourless" },
    primary: { shapes: ["round", "emerald"], colors: ["D", "E", "F"] },
  },
];
