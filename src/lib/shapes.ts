import { GLYPHS, type GlyphGeometry } from "./glyphs";

export type ShapeSlug =
  | "round"
  | "princess"
  | "cushion"
  | "emerald"
  | "oval"
  | "pear"
  | "marquise"
  | "radiant"
  | "asscher"
  | "heart"
  | "trillion"
  | "hexagon";

export type Shape = {
  slug: ShapeSlug;
  name: string;
  /** Two-letter code used in the SKU. */
  code: string;
  /** Brilliant, step or mixed — how the facets are arranged. */
  cutFamily: "Brilliant" | "Step" | "Mixed";
  /** Typical length-to-width range buyers ask for. */
  ratio: string;
  /** One line, used under the glyph in the shape grid. */
  summary: string;
  /** Two or three sentences for the shape gallery. */
  note: string;
  /** What to look for when buying — the dedicated shape page's second paragraph. */
  character: string;
  geometry: GlyphGeometry;
};

export const SHAPES: Shape[] = [
  {
    slug: "round",
    name: "Round",
    code: "RD",
    cutFamily: "Brilliant",
    ratio: "1.00 – 1.02",
    summary: "Fifty-seven or fifty-eight facets, cut for maximum return of light.",
    note: "The most studied cut in the trade, and the only one with a grading scale devoted entirely to its proportions. Angles are held within fractions of a degree, because a round shows deviation more readily than any other shape. It carries the highest cost per carat in rough, since a round yields less finished weight than a shape that follows the crystal.",
    character: "Because the round has a published cut standard, it is the easiest shape to compare on paper: table and depth appear on the report, and an Excellent or Ideal cut grade narrows the field quickly. What the figures cannot show is how the stone behaves in real light, so two rounds with the same grades are still worth seeing side by side. It suits almost any setting, and it is the safest choice where a stone may be reset later.",
    geometry: GLYPHS.round,
  },
  {
    slug: "princess",
    name: "Princess",
    code: "PR",
    cutFamily: "Brilliant",
    ratio: "1.00 – 1.05",
    summary: "A square outline over a brilliant facet pattern.",
    note: "Square from above, inverted pyramid in profile. It retains far more of the original octahedral rough than a round, which is why it reached the market as the practical square brilliant. Corners are the vulnerable point and are worth examining closely on any stone intended for daily wear.",
    character: "Depth is the figure to watch: roughly 65 to 75 percent is typical, and much deeper than that means weight carried below the girdle that does nothing face-up. Chipped or thin corners are the common fault, so a setting with a prong over each corner is standard. Its crisp outline pairs naturally with channel-set side stones and other square cuts.",
    geometry: GLYPHS.princess,
  },
  {
    slug: "cushion",
    name: "Cushion",
    code: "CU",
    cutFamily: "Mixed",
    ratio: "1.00 – 1.10",
    summary: "Softened corners, larger facets, broad flashes of light.",
    note: "A direct descendant of the old mine cut, updated with modern angles. Facets are fewer and larger than a round's, so the stone reads as slow, broad flashes rather than fine scintillation. Variation between cushions is wide — two stones of the same grade can look quite different, so these are worth seeing individually.",
    character: "Faceting patterns differ more than the name suggests: a classic cushion shows larger, distinct flashes, while a modified pattern gives a busier, crushed-ice look. Outlines run from square to noticeably rectangular, so check the length-to-width ratio against what you have in mind. It holds fancy colour well, which is why so much coloured stock is cut this way.",
    geometry: GLYPHS.cushion,
  },
  {
    slug: "emerald",
    name: "Emerald",
    code: "EM",
    cutFamily: "Step",
    ratio: "1.30 – 1.50",
    summary: "Parallel steps and an open table — clarity on display.",
    note: "A step cut: rectangular facets running parallel to the girdle, with cropped corners. There is nowhere for an inclusion to hide behind scintillation, so clarity and colour are graded conservatively here and buyers usually move a grade higher than they would on a brilliant. What it gives back is the hall-of-mirrors effect down the length of the stone.",
    character: "Proportions matter more here than on most shapes: too deep and the stone looks small for its weight, too shallow and the steps turn glassy. A ratio around 1.4 gives the classic long rectangle, while squarer stones begin to read like an asscher. Because inclusions sit in plain view, the plotted diagram on the report deserves more attention than the clarity grade alone.",
    geometry: GLYPHS.emerald,
  },
  {
    slug: "oval",
    name: "Oval",
    code: "OV",
    cutFamily: "Brilliant",
    ratio: "1.30 – 1.50",
    summary: "A brilliant drawn out along one axis.",
    note: "Reads larger than a round of equal weight because more of its surface faces up. The trade-off is the bow-tie — a darker band across the centre where light escapes rather than returns. Every oval has one to some degree; on a well-cut stone it is faint enough to miss.",
    character: "The bow-tie is the first thing to check, and no report grades it — it has to be judged on the stone or on video. Ratio is largely a matter of taste: around 1.35 reads classic, 1.5 and above reads slender. Ovals flatter the hand and sit comfortably in a four- or six-prong setting.",
    geometry: GLYPHS.oval,
  },
  {
    slug: "pear",
    name: "Pear",
    code: "PS",
    cutFamily: "Brilliant",
    ratio: "1.45 – 1.75",
    summary: "One rounded end, one point, cut symmetrically about its axis.",
    note: "Half oval, half marquise. Symmetry is the thing to check: the shoulders should mirror each other and the point should sit exactly on the long axis, since any drift is obvious once the stone is set. The point is also the most exposed part of the stone and is normally protected by the mount.",
    character: "A ratio of about 1.5 to 1.7 gives the traditional teardrop; below that the stone looks stubby, above it narrow. Check the shoulders and the belly for flat spots, and look for a bow-tie across the widest part. Worn point towards the fingertip it lengthens the hand, though point-up is just as valid.",
    geometry: GLYPHS.pear,
  },
  {
    slug: "marquise",
    name: "Marquise",
    code: "MQ",
    cutFamily: "Brilliant",
    ratio: "1.85 – 2.10",
    summary: "Two points, a long axis, and the largest face-up area per carat.",
    note: "No shape covers more surface for its weight, which makes it efficient in the hand and unforgiving in the cut. Both points must be even and the widest part must fall at the midpoint. Like the oval it can show a bow-tie, and the longer the stone, the more carefully that should be checked.",
    character: "Sight it from point to point: both ends should sit on one axis and the outline should curve evenly on either side. A ratio near 2.0 is classic, and past about 2.2 the stone turns very narrow. The points are the fragile part, so a V-prong at each end is the usual protection.",
    geometry: GLYPHS.marquise,
  },
  {
    slug: "radiant",
    name: "Radiant",
    code: "RA",
    cutFamily: "Mixed",
    ratio: "1.00 – 1.35",
    summary: "Cropped corners with a full brilliant pattern beneath.",
    note: "The outline of an emerald cut with the facet work of a brilliant — the shape that resolved the choice between a rectangular silhouette and active light return. Available square or elongated. It holds colour well, which is why it is a common choice in fancy-coloured goods.",
    character: "Radiants vary widely in depth, and a deep stone can face up smaller than its weight suggests, so read the measurements alongside the carat figure. The brilliant faceting hides inclusions far better than a step cut, which often means a lower clarity grade is invisible face-up. Elongated radiants make strong solitaires; square ones sit naturally among other square cuts.",
    geometry: GLYPHS.radiant,
  },
  {
    slug: "asscher",
    name: "Asscher",
    code: "AS",
    cutFamily: "Step",
    ratio: "1.00 – 1.05",
    summary: "A square step cut with deeply cropped corners.",
    note: "Square in outline, with corners cut back far enough that the stone reads as an octagon and the steps draw the eye straight down to the culet. Like the emerald cut it hides nothing, so clarity is graded strictly. Higher crowns and smaller tables distinguish it from a square emerald.",
    character: "Look for the windmill — four clean arms running in from the corners — which only appears when the proportions are right. An outline between 1.00 and 1.05 is expected; anything longer is closer to a square emerald cut. As with the emerald, the plot on the report matters more than usual, because the open facets show everything inside.",
    geometry: GLYPHS.asscher,
  },
  {
    slug: "heart",
    name: "Heart",
    code: "HT",
    cutFamily: "Brilliant",
    ratio: "0.95 – 1.10",
    summary: "A cleft, two matched lobes, and a point on the axis.",
    note: "The most demanding outline to cut well. The two lobes must be the same height and width, the cleft must be sharp and centred, and the point must sit directly opposite it. Below roughly half a carat the outline becomes hard to read once mounted, so these are usually taken in larger sizes.",
    character: "Check for a clearly defined cleft, lobes of equal size and a crisp point, with a ratio close to 1.0 — stones much wider or narrower lose the outline. A heart reads best from around a carat upward. Three-prong and bezel settings protect the point and keep the silhouette clean.",
    geometry: GLYPHS.heart,
  },
  {
    slug: "trillion",
    name: "Trillion",
    code: "TR",
    cutFamily: "Brilliant",
    ratio: "1.00 – 1.10",
    summary: "Three sides, shallow depth, wide spread.",
    note: "Cut shallow, so it spreads wide for its weight and sits low. Sides may be straight or slightly convex. Most often specified as a matched pair flanking a centre stone, which means symmetry between the two matters as much as the grade of either.",
    character: "Check that the three sides match in length and that the corners are not cut too thin, since those are the points most at risk. The shallow cut means a trillion faces up large for its weight, which is exactly why it works so well beside a centre stone. As a solitaire it makes a modern statement, but it needs a protective setting.",
    geometry: GLYPHS.trillion,
  },
  {
    slug: "hexagon",
    name: "Hexagon",
    code: "HX",
    cutFamily: "Mixed",
    ratio: "1.05 – 1.20",
    summary: "Six sides, gently elongated, with a full brilliant facet pattern.",
    note: "A mixed cut that keeps the six-sided outline close to the rough rather than rounding it away, faceted as a brilliant rather than in steps. Newer to the trade and less standardised than the classic shapes, so proportions vary more from one cutter to the next — worth seeing individually before a setting is chosen.",
    character: "With no single accepted standard, the measurements and length-to-width ratio tell you more than the shape name does — hexagons range from near-regular to long and narrow. Look for straight, parallel sides and even angles between them; small irregularities show more readily on a six-sided outline than on a curved one. It suits geometric and contemporary settings, and a bezel keeps the edges crisp.",
    geometry: GLYPHS.hexagon,
  },
];

export const SHAPE_BY_SLUG: Record<ShapeSlug, Shape> = Object.fromEntries(
  SHAPES.map((s) => [s.slug, s]),
) as Record<ShapeSlug, Shape>;

export function shapeByCode(code: string): Shape | undefined {
  return SHAPES.find((s) => s.code === code);
}
