import type { ShapeSlug } from "./shapes";

/**
 * Long-form educational copy for each /shapes/[slug] page.
 *
 * Kept apart from `shapes.ts`, which feeds the grid, the filters and the SKU
 * parser and should stay small. Same house rules as `guides.ts`:
 *  - Give ranges, not single "ideal" numbers. Fancy shapes have no laboratory
 *    cut grade, and the copy must not imply otherwise.
 *  - Name what is judged by eye (bow-tie, windmill, outline) as such.
 *  - Hedge trade legends; state dated facts plainly.
 */

export type ProportionRow = { label: string; value: string; note: string };

export type ShapeGuide = {
  /** <title>, written for the search result. */
  metaTitle: string;
  description: string;
  /** Where the shape came from. */
  history: string[];
  /** Facet count and arrangement, and what that does to the look. */
  anatomy: string[];
  proportions: ProportionRow[];
  /** Checks to make on a specific stone, in the order a buyer should make them. */
  checks: { term: string; detail: string }[];
  settings: string;
  faq: { question: string; answer: string }[];
  /** Glossary slugs. */
  terms: string[];
};

const NO_CUT_GRADE =
  "Neither GIA nor IGI assigns an overall cut grade to this shape, so these are trade ranges rather than a standard.";

export const SHAPE_GUIDES: Record<ShapeSlug, ShapeGuide> = {
  round: {
    metaTitle: "Round brilliant cut diamonds: proportions, history and buying guide",
    description:
      "How the round brilliant is cut, the table, depth and angle ranges that matter, what a cut grade does and does not tell you, and natural and lab-grown round stock.",
    history: [
      "The round brilliant grew out of the old European cut of the late nineteenth century. Two changes made it: the bruting machine, which let cutters turn a truly circular girdle, and Marcel Tolkowsky's 1919 study Diamond Design, which worked out crown and pavilion angles for a balance of brightness and fire.",
      "Modern rounds have smaller tables, sharper culets and more precise angles than Tolkowsky's model, and optical research since the 1990s has made the round the only shape with a full laboratory cut grade. That grade is why rounds are the easiest shape to compare on paper, and also why they are the most price-transparent.",
    ],
    anatomy: [
      "A standard round brilliant has 57 facets, or 58 if a culet is polished: 33 on the crown (table, 8 bezels, 8 stars and 16 upper girdle facets) and 24 or 25 on the pavilion (8 mains and 16 lower girdle facets). The lower girdle facets are what break light into the fine, needle-like sparkle rounds are known for.",
      "Because every facet repeats around the stone eight times, small errors in angle or alignment show up as uneven patterns. A precisely cut round can show a hearts-and-arrows pattern in a viewer, which is a sign of optical symmetry, not a grade in itself.",
    ],
    proportions: [
      { label: "Table", value: "54 – 58%", note: "Wider tables trade fire for brightness." },
      { label: "Depth", value: "59 – 62.5%", note: "Deeper stones face up smaller for their weight." },
      { label: "Crown angle", value: "34 – 35°", note: "Read together with the pavilion angle." },
      { label: "Pavilion angle", value: "40.6 – 41°", note: "Too steep or too shallow leaks light." },
      { label: "Girdle", value: "Thin to slightly thick", note: "Extremely thin girdles chip." },
      { label: "Culet", value: "None or very small", note: "A large culet shows as a dot face-up." },
    ],
    checks: [
      {
        term: "Cut grade first",
        detail:
          "Excellent (GIA) or Excellent/Ideal (IGI) removes most poorly proportioned stones. Below Very Good, the loss of brightness is usually visible.",
      },
      {
        term: "Angles, not only percentages",
        detail:
          "Two stones with identical table and depth can perform differently. Crown and pavilion angles are printed on the report and are worth reading together.",
      },
      {
        term: "Light performance by eye",
        detail:
          "Reflector images or a video in daylight show contrast and leakage that no grade prints. Compare two graded stones side by side where you can.",
      },
      {
        term: "Fluorescence",
        detail:
          "Strong blue fluorescence occasionally makes a stone look hazy. It is listed on the report, but whether it matters has to be judged on the stone.",
      },
    ],
    settings:
      "A round works in almost every setting: four prongs show more of the stone, six prongs protect it better, and a bezel suits an active lifestyle. It is also the easiest shape to reset later, because mounts for rounds are made in every size.",
    faq: [
      {
        question: "How many facets does a round brilliant diamond have?",
        answer:
          "A standard round brilliant has 57 facets, or 58 when the culet is polished as a facet: 33 on the crown and 24 or 25 on the pavilion.",
      },
      {
        question: "What is the best depth and table for a round diamond?",
        answer:
          "Most well-performing rounds fall between about 59 and 62.5 percent depth with a 54 to 58 percent table, but proportions should be read together with the crown and pavilion angles and the report's cut grade rather than on their own.",
      },
      {
        question: "Why are round diamonds more expensive per carat?",
        answer:
          "Cutting a round from rough loses more weight than most fancy shapes, and demand for rounds is the highest in the market. Both push the price per carat up compared with an otherwise similar fancy shape.",
      },
    ],
    terms: ["brilliant-cut", "cut-grade", "crown-angle", "pavilion-angle", "hearts-and-arrows", "light-leakage"],
  },

  princess: {
    metaTitle: "Princess cut diamonds: depth, corners and buying guide",
    description:
      "How the princess cut is faceted, the depth and table ranges to look for, why corners are the weak point, and natural and lab-grown princess stock.",
    history: [
      "The princess cut as it is sold today dates from around 1980, when Betazel Ambar and Israel Itzkowitz refined a square brilliant pattern. It built on earlier square brilliants such as Arpad Nagy's profile cut of the 1960s.",
      "Its success was partly practical. A princess follows the square cross-section of an octahedral crystal, so two stones can be sawn from one crystal with much less waste than a pair of rounds. That better yield is one reason a princess usually costs less per carat than a round of similar grades.",
    ],
    anatomy: [
      "Most princess cuts have between 50 and 58 facets. The pavilion carries chevron-shaped facets, usually two to four rows of them, and the number of chevrons changes the look: fewer chevrons give larger, bolder flashes, while more give a finer, busier sparkle.",
      "In profile the princess is an inverted pyramid with a relatively deep pavilion, and its corners are sharp points. Both points follow directly from the shape, and both affect how the stone should be bought and set.",
    ],
    proportions: [
      { label: "Table", value: "64 – 75%", note: "A larger table than a round is normal here." },
      { label: "Depth", value: "64 – 75%", note: "Above about 78%, weight is hidden below the girdle." },
      { label: "Length to width", value: "1.00 – 1.05", note: "Above 1.05 the outline reads as rectangular." },
      { label: "Girdle", value: "Thin to slightly thick", note: "Very thin girdles make the corners fragile." },
      { label: "Culet", value: "None", note: "The pavilion should meet at a point." },
      { label: "Cut grade", value: "Not graded", note: NO_CUT_GRADE },
    ],
    checks: [
      {
        term: "Corners",
        detail:
          "Look for chips, naturals or extremely thin girdle at each of the four corners. They are the most common damage on a worn princess.",
      },
      {
        term: "Depth against spread",
        detail:
          "Compare the millimetre measurements with the carat weight. A deep princess can weigh the same as a better-cut stone and face up noticeably smaller.",
      },
      {
        term: "Square outline",
        detail: "Check the length-to-width ratio and that the sides are straight, not bulging or pinched.",
      },
      {
        term: "Polish and symmetry",
        detail:
          "With no cut grade, polish and symmetry are the only cut-related grades on the report. Very Good or better is a sensible floor.",
      },
    ],
    settings:
      "Set a princess with a prong or V-prong over each corner, or in a bezel, so the points are covered. It suits channel settings and sits naturally beside baguettes, other princesses and square step cuts.",
    faq: [
      {
        question: "Are princess cut diamonds cheaper than round?",
        answer:
          "Usually, yes. A princess keeps more of the rough crystal's weight than a round does, so the price per carat is typically lower for the same colour, clarity and carat weight.",
      },
      {
        question: "What depth should a princess cut diamond have?",
        answer:
          "Roughly 64 to 75 percent is typical. Much deeper stones carry weight below the girdle that does not add face-up size, so check the measurements as well as the depth figure.",
      },
      {
        question: "Do princess cut diamonds chip easily?",
        answer:
          "Their sharp corners are more exposed than any part of a round, so they can chip if left unprotected. A setting that covers each corner largely removes that risk.",
      },
    ],
    terms: ["brilliant-cut", "depth-percent", "table-percent", "girdle-thickness", "chip", "spread"],
  },

  cushion: {
    metaTitle: "Cushion cut diamonds: classic vs modified, ratios and buying guide",
    description:
      "The cushion cut explained: its old mine cut origins, cushion brilliant versus modified brilliant faceting, the ratios and depths to look for, and natural and lab-grown cushion stock.",
    history: [
      "The cushion descends from the old mine cut, the dominant diamond shape of the eighteenth and nineteenth centuries. Old mine cuts were shaped by hand around the crystal, with a high crown, a small table and a large culet, and were designed to glow in candlelight.",
      "Modern cushions keep the soft, pillow-like outline but use contemporary angles, a smaller or closed culet and a larger table. Interest in antique jewellery has also brought back 'antique' or 'old mine' style cushions, which deliberately imitate the older look.",
    ],
    anatomy: [
      "A cushion typically has around 58 facets, though modified patterns add more. Laboratory reports separate the two main styles: a cushion brilliant has larger facets arranged much like an old mine cut, giving broad, distinct flashes, while a cushion modified brilliant has an extra row of pavilion facets that produces a busier, 'crushed ice' look.",
      "The report's shape description is the quickest way to tell the two apart before seeing the stone. Neither is better; it is a question of which look you want.",
    ],
    proportions: [
      { label: "Table", value: "58 – 68%", note: "Smaller tables give a more antique look." },
      { label: "Depth", value: "61 – 68%", note: "Cushions run deeper than rounds." },
      { label: "Length to width", value: "1.00 – 1.10 square", note: "1.15 – 1.30 for an elongated cushion." },
      { label: "Girdle", value: "Thin to slightly thick", note: "Check the corners for thin spots." },
      { label: "Culet", value: "None to small", note: "A visible culet is part of the antique style." },
      { label: "Cut grade", value: "Not graded", note: NO_CUT_GRADE },
    ],
    checks: [
      {
        term: "Faceting style",
        detail:
          "Read whether the report says 'cushion brilliant' or 'cushion modified brilliant', then look at a video to confirm you like the flash pattern.",
      },
      {
        term: "Outline",
        detail:
          "Cushions range from nearly square to clearly rectangular, with corners from almost sharp to fully rounded. Match the ratio to the outline you have in mind.",
      },
      {
        term: "Dark centre",
        detail:
          "A deep or poorly angled cushion can show a dark area under the table. It is not graded, so it has to be checked on the stone.",
      },
      {
        term: "Colour in the corners",
        detail:
          "Cushions tend to hold body colour, which gathers toward the corners. Many buyers choose one colour grade higher than they would for a round.",
      },
    ],
    settings:
      "Four prongs placed at the corners suit the outline, and halo settings are common because the soft shape frames well. The rounded corners are less exposed than a princess's, which makes a cushion practical for everyday wear.",
    faq: [
      {
        question: "What is the difference between a cushion brilliant and a cushion modified brilliant?",
        answer:
          "A cushion brilliant has larger facets and shows broad, distinct flashes. A cushion modified brilliant adds an extra row of pavilion facets, giving a finer, 'crushed ice' sparkle. Laboratory reports name which style a stone is.",
      },
      {
        question: "What is a good length-to-width ratio for a cushion cut?",
        answer:
          "About 1.00 to 1.10 gives a square cushion. Elongated cushions usually fall between 1.15 and 1.30. It is a matter of taste rather than quality.",
      },
      {
        question: "Is a cushion cut the same as an old mine cut?",
        answer:
          "No. The cushion developed from the old mine cut, but modern cushions have different angles, a larger table and usually no open culet. Antique-style cushions imitate the older look.",
      },
    ],
    terms: ["brilliant-cut", "old-european-cut", "length-to-width", "depth-percent", "culet", "make"],
  },

  emerald: {
    metaTitle: "Emerald cut diamonds: step cut proportions, clarity and buying guide",
    description:
      "How the emerald step cut works, the table, depth and ratio ranges to look for, why clarity matters more than on a brilliant, and natural and lab-grown emerald-cut stock.",
    history: [
      "Step cutting is among the oldest faceting styles, descended from the table cuts of the fifteenth and sixteenth centuries. The shape takes its name from the gemstone: the cropped corners were used on emeralds to reduce the risk of chipping a brittle crystal, and the same outline was later applied to diamonds.",
      "The emerald cut became especially popular in the Art Deco period of the 1920s and 1930s, when its clean lines suited geometric design, and it has stayed a classic since.",
    ],
    anatomy: [
      "An emerald cut is usually faceted with about 57 or 58 facets in long rows running parallel to the girdle, typically three rows on the crown and three on the pavilion. The corners are cut off at an angle, making the outline an elongated octagon.",
      "Instead of sparkle, the step facets create broad planes of light and dark that shift as the stone moves, often called the hall-of-mirrors effect. The large, open table gives a clear view into the stone.",
    ],
    proportions: [
      { label: "Table", value: "60 – 69%", note: "Too large a table flattens the steps." },
      { label: "Depth", value: "60 – 70%", note: "Very deep stones look small for their weight." },
      { label: "Length to width", value: "1.30 – 1.50", note: "Around 1.40 is the classic rectangle." },
      { label: "Girdle", value: "Thin to slightly thick", note: "Check the cropped corners." },
      { label: "Culet", value: "None to small", note: "Step cuts often finish in a short keel." },
      { label: "Cut grade", value: "Not graded", note: NO_CUT_GRADE },
    ],
    checks: [
      {
        term: "Clarity and the plot",
        detail:
          "Inclusions are easy to see through a step cut. Read the plotted diagram on the report and look for anything under the table; many buyers choose VS2 or better.",
      },
      {
        term: "Colour",
        detail: "The open facets show body colour clearly, particularly in the corners. Consider a colour grade higher than for a round.",
      },
      {
        term: "Even steps",
        detail:
          "The rows of facets should be parallel and evenly spaced, and the corners the same size. Uneven steps show up clearly on a stone this open.",
      },
      {
        term: "Windowing",
        detail:
          "A shallow pavilion can leave a washed-out area in the centre where you see straight through the stone. Check it in a video or in person.",
      },
    ],
    settings:
      "Four prongs at the corners, or double prongs, are traditional. Emerald cuts pair well with tapered baguettes or trapezoid side stones and suit clean, architectural designs.",
    faq: [
      {
        question: "What clarity should I choose for an emerald cut diamond?",
        answer:
          "Because step cuts show inclusions clearly, many buyers choose VS2 or higher. A lower grade can still be eye-clean, but check the plot and the stone itself rather than relying on the grade alone.",
      },
      {
        question: "What is the best ratio for an emerald cut?",
        answer:
          "About 1.30 to 1.50 is typical, with around 1.40 giving the classic rectangle. Squarer stones start to resemble an asscher cut.",
      },
      {
        question: "Why does an emerald cut sparkle less than a round?",
        answer:
          "Its long, flat step facets reflect light in broad flashes rather than breaking it into small points. That clean, reflective look is the character of the shape, not a flaw in the cut.",
      },
    ],
    terms: ["step-cut", "plot", "eye-clean", "windowing", "length-to-width", "table-percent"],
  },

  oval: {
    metaTitle: "Oval cut diamonds: bow-tie, ratio and buying guide",
    description:
      "How the oval brilliant is cut, the bow-tie and why no report grades it, the ratio and depth ranges to look for, and natural and lab-grown oval stock.",
    history: [
      "Oval stones are old, but the modern oval brilliant is usually credited to Lazare Kaplan, who developed it in the early 1960s by adapting round brilliant faceting to an elongated outline.",
      "Ovals have become one of the most requested shapes for engagement rings in recent years, largely because they look bigger than a round of the same weight and flatter the finger.",
    ],
    anatomy: [
      "An oval usually has 56 to 58 facets arranged much like a round brilliant, stretched along one axis. That gives it similar sparkle, but stretching the pattern changes the angles along the length, and some light escapes through the middle of the stone instead of returning.",
      "The result is the bow-tie: a darker, bow-shaped band across the width. Almost every oval shows one to some degree. On a well-cut stone it is faint and shifts as the stone moves; on a poor one it is solid and distracting.",
    ],
    proportions: [
      { label: "Table", value: "53 – 63%", note: "Similar to a round." },
      { label: "Depth", value: "58 – 63%", note: "Deeper stones lose face-up size." },
      { label: "Length to width", value: "1.30 – 1.50", note: "1.35 – 1.45 is the most requested range." },
      { label: "Girdle", value: "Thin to slightly thick", note: "Uneven girdles distort the outline." },
      { label: "Culet", value: "None", note: "" },
      { label: "Cut grade", value: "Not graded", note: NO_CUT_GRADE },
    ],
    checks: [
      {
        term: "Bow-tie",
        detail:
          "No laboratory report mentions the bow-tie, so it has to be checked in a video or in person. Look for a band that flickers rather than one that stays dark.",
      },
      {
        term: "Outline",
        detail:
          "Both halves should mirror each other, with no flat or bulging sides. The ends should be evenly curved, not pointed or squared off.",
      },
      {
        term: "Ratio",
        detail: "Choose the ratio by eye. The same carat weight looks noticeably different at 1.30 and at 1.50.",
      },
      {
        term: "Colour at the ends",
        detail: "Elongated shapes can show more colour toward their tips. A near-colourless grade or better keeps them looking even.",
      },
    ],
    settings:
      "Four or six prongs are typical, with six giving more security. East-west settings, where the oval lies across the finger, are a popular modern variation. Ovals also suit halo and three-stone designs.",
    faq: [
      {
        question: "What is a bow-tie in an oval diamond?",
        answer:
          "It is a darker band across the centre of the stone where light escapes instead of returning to the eye. Nearly all ovals have one; the goal is a faint bow-tie that shifts as the stone moves. Grading reports do not assess it.",
      },
      {
        question: "Does an oval diamond look bigger than a round?",
        answer:
          "Yes. Because it is elongated and relatively shallow, an oval shows more surface area from above than a round of the same carat weight.",
      },
      {
        question: "What is the best length-to-width ratio for an oval?",
        answer:
          "Most buyers choose between 1.35 and 1.45. Below about 1.30 the stone looks nearly round; above 1.50 it looks slender. There is no single correct ratio.",
      },
    ],
    terms: ["bow-tie", "brilliant-cut", "length-to-width", "spread", "symmetry", "depth-percent"],
  },

  pear: {
    metaTitle: "Pear shaped diamonds: symmetry, ratio and buying guide",
    description:
      "How the pear shape is cut, how to judge its symmetry and bow-tie, the ratio and depth ranges to look for, and natural and lab-grown pear stock.",
    history: [
      "Tradition credits the pear shape to Lodewyk van Berquem, a cutter in fifteenth-century Bruges who is also associated with early symmetrical faceting. Whatever its exact origin, the teardrop has been cut for centuries and appears in many historic jewels.",
      "Several of the world's best-known large diamonds are pear shapes, partly because the shape can follow an irregular crystal and save weight that a round would lose.",
    ],
    anatomy: [
      "A pear usually has 56 to 58 brilliant facets, combining the rounded end of an oval with the point of a marquise. The pavilion facets meet along a long axis rather than at a central point.",
      "Like other elongated brilliants, the pear can show a bow-tie across its widest part. The point is the stone's most exposed and fragile area.",
    ],
    proportions: [
      { label: "Table", value: "53 – 63%", note: "" },
      { label: "Depth", value: "58 – 64%", note: "Deeper stones face up smaller." },
      { label: "Length to width", value: "1.45 – 1.75", note: "About 1.55 – 1.70 is the classic teardrop." },
      { label: "Girdle", value: "Thin to slightly thick", note: "Watch for very thin girdle at the point." },
      { label: "Culet", value: "None", note: "" },
      { label: "Cut grade", value: "Not graded", note: NO_CUT_GRADE },
    ],
    checks: [
      {
        term: "Symmetry along the axis",
        detail:
          "Draw an imaginary line from the point through the centre of the rounded end. Both sides should match, and the point should sit exactly on that line.",
      },
      {
        term: "Shoulders and belly",
        detail:
          "The shoulders beside the rounded end should be evenly curved, not flat or high. The widest part should not look bulging or straight-sided.",
      },
      {
        term: "Bow-tie",
        detail: "Check across the widest part in a video or in person. No report grades it.",
      },
      {
        term: "The point",
        detail: "Look for chips or an extremely thin girdle at the tip before the stone is set.",
      },
    ],
    settings:
      "A V-prong or bezel over the point protects it, with two or three prongs holding the rounded end. Pears are worn point toward the fingertip to lengthen the hand, but point-up is also common. They are a traditional choice for pendants and drop earrings.",
    faq: [
      {
        question: "What is the best ratio for a pear shaped diamond?",
        answer:
          "About 1.45 to 1.75 is typical, and most classic teardrops fall between 1.55 and 1.70. Lower ratios look short and wide; higher ones look narrow.",
      },
      {
        question: "Which way should a pear diamond face on a ring?",
        answer:
          "Traditionally the point faces toward the fingertip, which lengthens the look of the hand. Point toward the wrist is also worn; it is purely a matter of preference.",
      },
      {
        question: "Do pear shaped diamonds have a bow-tie?",
        answer:
          "Most do, across the widest part of the stone. A well-cut pear keeps it faint, but it is not graded, so it should be judged on the stone or on video.",
      },
    ],
    terms: ["bow-tie", "symmetry", "length-to-width", "brilliant-cut", "chip", "girdle-thickness"],
  },

  marquise: {
    metaTitle: "Marquise cut diamonds: ratio, symmetry and buying guide",
    description:
      "How the marquise cut is faceted, why it has the largest face-up area per carat, the ratio and symmetry checks that matter, and natural and lab-grown marquise stock.",
    history: [
      "The marquise, also called the navette (French for 'little boat'), is often linked to the court of Louis XV in eighteenth-century France. The popular story that it was modelled on the Marquise de Pompadour's smile is probably a legend, but the shape was certainly fashionable in that period.",
      "It returned strongly in the 1970s and has since become a favourite for vintage-style and east-west designs.",
    ],
    anatomy: [
      "A marquise usually has 56 to 58 brilliant facets, arranged symmetrically on either side of a long axis that ends in two points. Its long, shallow form spreads the weight over a large area, so a marquise shows more surface from above than any other common shape of the same carat weight.",
      "Like the oval and pear, it can show a bow-tie across the middle, and the two points are the fragile parts of the stone.",
    ],
    proportions: [
      { label: "Table", value: "53 – 63%", note: "" },
      { label: "Depth", value: "58 – 63%", note: "" },
      { label: "Length to width", value: "1.85 – 2.10", note: "About 2.0 is classic." },
      { label: "Girdle", value: "Thin to slightly thick", note: "Check both points." },
      { label: "Culet", value: "None", note: "" },
      { label: "Cut grade", value: "Not graded", note: NO_CUT_GRADE },
    ],
    checks: [
      {
        term: "Point alignment",
        detail:
          "Both points should sit on the same straight axis. Even a small offset looks crooked once the stone is set.",
      },
      {
        term: "Even curves",
        detail:
          "The two sides should curve evenly, with the widest part exactly halfway between the points. Look for flat spots or bulges.",
      },
      {
        term: "Bow-tie",
        detail: "Longer stones tend to show a stronger bow-tie. Check it on video or in person, since no report grades it.",
      },
      {
        term: "Colour at the tips",
        detail: "Colour tends to concentrate at the points of elongated shapes, so consider a slightly higher colour grade.",
      },
    ],
    settings:
      "V-prongs or bezels at each point are standard protection. A marquise can be set north-south or east-west, and small marquises are often arranged in clusters or as leaf and petal shapes.",
    faq: [
      {
        question: "Why do marquise diamonds look bigger?",
        answer:
          "A marquise spreads its weight over a long, shallow outline, giving it more visible surface area than other common shapes of the same carat weight.",
      },
      {
        question: "What is the ideal ratio for a marquise diamond?",
        answer:
          "About 1.85 to 2.10 is typical, with 2.0 being the classic look. Stones above about 2.2 look very narrow.",
      },
      {
        question: "Are marquise diamonds fragile?",
        answer:
          "The two points are thin and exposed, so they can chip if unprotected. A V-prong or bezel at each point is the usual solution.",
      },
    ],
    terms: ["bow-tie", "length-to-width", "spread", "symmetry", "brilliant-cut", "chip"],
  },

  radiant: {
    metaTitle: "Radiant cut diamonds: square vs elongated, depth and buying guide",
    description:
      "How the radiant cut combines an emerald outline with brilliant faceting, the depth and ratio ranges to look for, and natural and lab-grown radiant stock.",
    history: [
      "The radiant cut was developed by Henry Grossbard in 1977. It was the first shape to apply a full brilliant facet pattern to both the crown and the pavilion of an emerald-cut outline, combining a clean rectangular shape with strong sparkle.",
      "It became especially important for coloured diamonds, because its facet pattern tends to deepen and even out body colour.",
    ],
    anatomy: [
      "A radiant typically has around 70 facets, although counts vary by cutter. The outline has cropped corners like an emerald cut, but the facets underneath are brilliant-style, producing a lively, 'crushed ice' sparkle.",
      "Its many small facets also help hide inclusions, so a radiant can often be eye-clean at a lower clarity grade than a step cut.",
    ],
    proportions: [
      { label: "Table", value: "61 – 69%", note: "" },
      { label: "Depth", value: "61 – 67%", note: "Square radiants can run up to about 70%." },
      { label: "Length to width", value: "1.00 – 1.05 square", note: "1.20 – 1.35 for the elongated rectangle." },
      { label: "Girdle", value: "Thin to slightly thick", note: "Check the cropped corners." },
      { label: "Culet", value: "None", note: "" },
      { label: "Cut grade", value: "Not graded", note: NO_CUT_GRADE },
    ],
    checks: [
      {
        term: "Depth against measurements",
        detail:
          "Radiants vary greatly in depth. Compare the millimetre measurements to the carat weight so a deep stone does not look smaller than expected.",
      },
      {
        term: "Dark areas",
        detail:
          "Poorly angled radiants can show dark patches or a bow-tie in elongated stones. Check a video in good light.",
      },
      {
        term: "Clarity",
        detail:
          "The brilliant faceting masks many inclusions, so SI grades can be eye-clean. Confirm by looking at the stone rather than relying on the grade.",
      },
      {
        term: "Outline",
        detail: "Check that the corners are cut evenly and that the sides are straight and parallel.",
      },
    ],
    settings:
      "Four prongs at the corners suit the cropped outline, and radiants look good with trapezoid, baguette or other radiant side stones. Elongated radiants make strong solitaires.",
    faq: [
      {
        question: "What is the difference between a radiant and an emerald cut?",
        answer:
          "They share a rectangular outline with cropped corners, but an emerald cut uses long step facets while a radiant uses brilliant faceting. The radiant sparkles more; the emerald shows cleaner, broader flashes.",
      },
      {
        question: "Is a radiant cut the same as a princess cut?",
        answer:
          "No. Both are brilliant-faceted and can be square, but a princess has sharp corners while a radiant's corners are cropped. The cropped corners are also less prone to chipping.",
      },
      {
        question: "What clarity is eye-clean in a radiant cut?",
        answer:
          "Its faceting hides inclusions well, so many SI1 and some SI2 radiants look clean to the eye. It depends on where the inclusions are, so check the stone itself.",
      },
    ],
    terms: ["brilliant-cut", "depth-percent", "length-to-width", "eye-clean", "fancy-colour", "measurements"],
  },

  asscher: {
    metaTitle: "Asscher cut diamonds: windmill pattern, proportions and buying guide",
    description:
      "The asscher cut explained: its 1902 origins, the windmill pattern, the proportions to look for, how it differs from a square emerald cut, and natural and lab-grown asscher stock.",
    history: [
      "The asscher cut was created in 1902 by Joseph Asscher of the Asscher family firm in Amsterdam, the same firm that later split the Cullinan diamond. It was widely used in Art Deco jewellery and then became less common until a revival around 2000.",
      "Laboratory reports often describe an asscher as a 'square emerald cut', since the two share the same step-cut structure.",
    ],
    anatomy: [
      "A classic asscher has around 58 step facets, with a square outline, deeply cropped corners, a high crown and a relatively small table. Seen from above, the corners make the outline look almost octagonal.",
      "When the proportions are right, the steps create a windmill or X-shaped pattern that draws the eye toward the centre of the stone. Like the emerald cut, it shows inclusions and colour clearly.",
    ],
    proportions: [
      { label: "Table", value: "60 – 68%", note: "Smaller tables are closer to the original design." },
      { label: "Depth", value: "60 – 70%", note: "" },
      { label: "Length to width", value: "1.00 – 1.05", note: "Longer stones read as a square emerald cut." },
      { label: "Girdle", value: "Thin to slightly thick", note: "" },
      { label: "Culet", value: "None to small", note: "" },
      { label: "Cut grade", value: "Not graded", note: NO_CUT_GRADE },
    ],
    checks: [
      {
        term: "The windmill",
        detail:
          "Look for four clear arms running from the corners toward the centre. If they are missing or uneven, the proportions are likely off. It is judged by eye, not graded.",
      },
      {
        term: "Squareness",
        detail: "Check that the ratio is close to 1.00 and that all four cropped corners are the same size.",
      },
      {
        term: "Clarity and colour",
        detail:
          "As with the emerald cut, the open facets show inclusions and body colour. Read the plot and consider higher grades than for a brilliant.",
      },
      {
        term: "Crown height",
        detail: "A very flat crown weakens the step pattern. The profile view in a video helps judge it.",
      },
    ],
    settings:
      "Four prongs at the cropped corners are standard, and asschers suit vintage, Art Deco and halo designs. They pair well with baguettes and other step cuts.",
    faq: [
      {
        question: "What is the difference between an asscher cut and an emerald cut?",
        answer:
          "Both are step cuts with cropped corners. An asscher is square with larger cropped corners and usually a higher crown; an emerald cut is rectangular.",
      },
      {
        question: "What clarity should an asscher cut diamond be?",
        answer:
          "Because step facets show inclusions easily, VS2 or higher is a common choice. Always review the plot, as the location of an inclusion matters more here than on a brilliant.",
      },
      {
        question: "Why does a laboratory report call my asscher a square emerald cut?",
        answer:
          "Laboratories often use 'square emerald cut' as the shape description for asscher-style stones, since the facet structure is the same. The name asscher refers to the style first cut by the Asscher family.",
      },
    ],
    terms: ["step-cut", "plot", "length-to-width", "crown", "table-percent", "eye-clean"],
  },

  heart: {
    metaTitle: "Heart shaped diamonds: symmetry, size and buying guide",
    description:
      "How the heart shape is cut, how to judge its lobes, cleft and point, the ratio and minimum size to consider, and natural and lab-grown heart stock.",
    history: [
      "Heart-shaped diamonds appear in European records from the fifteenth century onward, often as gifts between royal families. Early examples were far less precise than modern ones.",
      "Precise heart shapes became practical with modern cutting equipment, which can control the matched lobes and sharp cleft that the outline depends on.",
    ],
    anatomy: [
      "A heart usually has 56 to 59 brilliant facets. It is essentially a pear shape with a cleft cut into the rounded end, which forms two lobes.",
      "The cleft and lobes make it one of the most difficult outlines to cut well, and like other fancy brilliants it can show a bow-tie across the centre.",
    ],
    proportions: [
      { label: "Table", value: "56 – 62%", note: "" },
      { label: "Depth", value: "56 – 62%", note: "" },
      { label: "Length to width", value: "0.95 – 1.10", note: "Close to 1.00 keeps the classic outline." },
      { label: "Girdle", value: "Thin to slightly thick", note: "Check the point and the cleft." },
      { label: "Culet", value: "None", note: "" },
      { label: "Cut grade", value: "Not graded", note: NO_CUT_GRADE },
    ],
    checks: [
      {
        term: "Matched lobes",
        detail: "Both lobes should be the same height and width, with evenly rounded tops.",
      },
      {
        term: "Cleft and point",
        detail:
          "The cleft should be sharp and centred, and the point should sit directly opposite it. A soft cleft makes the outline look vague.",
      },
      {
        term: "Size",
        detail:
          "Below about half a carat the outline is hard to see once set. Around one carat and above, the shape reads clearly.",
      },
      {
        term: "Bow-tie and colour",
        detail: "Check for a dark band in a video, and note that colour can gather in the lobes and point.",
      },
    ],
    settings:
      "Three-prong settings (one at the point, two at the lobes) and bezels are standard. Hearts are popular in pendants as well as rings, and a bezel keeps the outline crisp.",
    faq: [
      {
        question: "What size should a heart shaped diamond be?",
        answer:
          "Around half a carat is the practical minimum for the shape to read clearly once set, and one carat or more shows it best. Smaller hearts are often used as accents rather than centre stones.",
      },
      {
        question: "What makes a well-cut heart shaped diamond?",
        answer:
          "Matched lobes, a sharp and centred cleft, a clean point and a length-to-width ratio close to 1.00. These are judged by eye, since no report grades them.",
      },
      {
        question: "Is a heart shaped diamond more expensive?",
        answer:
          "It is often similar to or slightly below a round per carat, but well-cut hearts can be harder to find, especially in larger sizes and matched pairs.",
      },
    ],
    terms: ["symmetry", "bow-tie", "length-to-width", "brilliant-cut", "carat", "chip"],
  },

  trillion: {
    metaTitle: "Trillion cut diamonds: side stones, depth and buying guide",
    description:
      "How the trillion (trilliant) cut is faceted, why it faces up large for its weight, how to match pairs for side stones, and natural and lab-grown trillion stock.",
    history: [
      "Triangular diamonds have been cut for centuries, often to make use of flat, triangular rough. The trilliant name was trademarked by the Henry Meyer Diamond Company of New York in the 1960s, and trillion and trilliant are now used generally for triangular brilliants.",
      "The shape became established as a side stone in three-stone rings, where a matched pair frames a larger centre stone.",
    ],
    anatomy: [
      "Trillions vary more than most shapes. Brilliant-style trillions have around 31 to 50 facets, and the sides may be straight or slightly curved. Curved sides are common on solitaires and straight sides on side stones.",
      "They are cut shallow, so they cover a lot of surface for their weight. The three corners are the thin, exposed parts of the stone.",
    ],
    proportions: [
      { label: "Table", value: "Varies widely", note: "Read the measurements rather than a single figure." },
      { label: "Depth", value: "Shallow for side stones", note: "Solitaires are usually cut deeper to hold light." },
      { label: "Length to width", value: "1.00 – 1.10", note: "An even triangle is the usual goal." },
      { label: "Girdle", value: "Thin to medium", note: "Very thin corners chip." },
      { label: "Culet", value: "None", note: "" },
      { label: "Cut grade", value: "Not graded", note: NO_CUT_GRADE },
    ],
    checks: [
      {
        term: "Equal sides",
        detail: "All three sides should be the same length and all three corners the same angle.",
      },
      {
        term: "Matched pairs",
        detail:
          "For side stones, the two trillions should match in size, outline, colour and brightness. A matched pair matters more than the grade of either stone.",
      },
      {
        term: "Windowing",
        detail: "Very shallow trillions can look glassy in the centre. Check that the stone stays bright face-up.",
      },
      {
        term: "Corners",
        detail: "Look for chips or very thin girdle at each point before setting.",
      },
    ],
    settings:
      "As side stones, trillions sit on either side of a round, oval, cushion or emerald cut. As a centre stone, a bezel or a three-prong setting with V-prongs protects the corners.",
    faq: [
      {
        question: "What is the difference between a trillion and a trilliant?",
        answer:
          "Trilliant began as a trademark for a specific triangular cut. Today both names are used for triangular brilliant-cut diamonds, and the difference is mostly in usage rather than in the stone.",
      },
      {
        question: "Are trillion diamonds good as side stones?",
        answer:
          "Yes. They are cut shallow, so they cover a lot of surface for their weight, and their shape leads the eye toward the centre stone. Matching the two stones is the most important consideration.",
      },
      {
        question: "Can a trillion be used as a centre stone?",
        answer:
          "Yes, usually with slightly curved sides and a deeper cut to hold light. It needs a protective setting because the corners are exposed.",
      },
    ],
    terms: ["brilliant-cut", "spread", "windowing", "parcel", "chip", "girdle-thickness"],
  },

  hexagon: {
    metaTitle: "Hexagon cut diamonds: proportions, settings and buying guide",
    description:
      "The hexagon cut explained: a newer six-sided mixed cut, what to check when there is no standard, how to choose proportions and settings, and natural and lab-grown hexagon stock.",
    history: [
      "Six-sided diamonds were cut in earlier periods, often as step cuts for Art Deco jewellery. The brilliant-faceted hexagon is a much more recent style, becoming popular in the last decade alongside other geometric and contemporary shapes.",
      "Because it is newer, cutters have not settled on a shared standard, and hexagons from different sources can look quite different.",
    ],
    anatomy: [
      "A hexagon has six straight sides, often slightly elongated, with brilliant-style faceting. Facet counts vary by cutter. Some use step facets instead, which gives a more vintage look.",
      "The straight edges and six corners make the outline strongly geometric. Any irregularity in side length or angle is easier to see than on a curved shape.",
    ],
    proportions: [
      { label: "Table", value: "Varies by cutter", note: "No accepted range yet." },
      { label: "Depth", value: "Varies by cutter", note: "Compare measurements to carat weight." },
      { label: "Length to width", value: "1.05 – 1.20", note: "Closer to 1.00 looks more regular." },
      { label: "Girdle", value: "Thin to medium", note: "Check all six corners." },
      { label: "Culet", value: "None", note: "" },
      { label: "Cut grade", value: "Not graded", note: NO_CUT_GRADE },
    ],
    checks: [
      {
        term: "Outline",
        detail:
          "Opposite sides should be parallel and equal in length, with even angles at the corners. A video from directly above is the best check.",
      },
      {
        term: "Faceting style",
        detail: "Confirm whether the stone is brilliant or step faceted, since the two look very different.",
      },
      {
        term: "Measurements",
        detail:
          "With no standard proportions, the millimetre measurements and ratio tell you more than the shape name. Compare them across stones.",
      },
      {
        term: "Corners",
        detail: "Six corners mean six places to check for chips or thin girdle.",
      },
    ],
    settings:
      "Bezels keep the six edges crisp and protected, and six-prong settings with a prong at each corner are also common. Hexagons suit geometric, minimalist and stacking designs.",
    faq: [
      {
        question: "Is a hexagon cut diamond a good choice for an engagement ring?",
        answer:
          "Yes, if you like a modern, geometric look. Because proportions are not standardised, it is best to compare several stones and check the outline on video.",
      },
      {
        question: "What setting works best for a hexagon diamond?",
        answer:
          "A bezel protects all six corners and emphasises the outline. A six-prong setting with a prong at each corner is a lighter-looking alternative.",
      },
      {
        question: "Are hexagon diamonds graded for cut?",
        answer:
          "No. Like other fancy shapes, they receive polish and symmetry grades but no overall cut grade, so the outline and light performance have to be judged by eye.",
      },
    ],
    terms: ["brilliant-cut", "step-cut", "measurements", "length-to-width", "symmetry", "polish"],
  },
};
