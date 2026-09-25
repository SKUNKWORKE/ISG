/**
 * The diamond glossary: the vocabulary a grading report uses, in plain English.
 *
 * Deliberately deeper than the FAQ blocks on the four Cs guides. Those answer
 * the questions a first-time buyer asks; this answers the ones asked on a third
 * stone, when the buyer has started reading the report itself and wants to know
 * what "slightly thick girdle" or "medium blue fluorescence" does to the
 * diamond in front of them.
 *
 * Rules for entries:
 *  - `short` must stand alone. It is what search results and the JSON-LD
 *    definition carry, so it cannot depend on `detail` having been read.
 *  - `onReport` says what GIA or IGI actually print. Where a term is trade
 *    shorthand that no laboratory certifies, say so — that distinction is the
 *    main thing a serious buyer comes here for.
 *  - `seeAlso` holds slugs from this file. Unknown slugs are dropped at render
 *    rather than throwing, so a half-finished entry can never break the build.
 */

export type GlossaryCategory =
  | "anatomy"
  | "proportions"
  | "report"
  | "optics"
  | "inclusions"
  | "trade";

export const CATEGORIES: Record<GlossaryCategory, { label: string; blurb: string }> = {
  anatomy: {
    label: "Anatomy",
    blurb: "The parts of a cut stone, from table to culet.",
  },
  proportions: {
    label: "Proportions",
    blurb: "The percentages and measurements that decide how a diamond handles light.",
  },
  report: {
    label: "Report terms",
    blurb: "What a GIA or IGI grading report records — and what it does not.",
  },
  optics: {
    label: "Light & appearance",
    blurb: "How a diamond behaves in the eye, and the tools used to test it.",
  },
  inclusions: {
    label: "Inclusions",
    blurb: "The clarity characteristics plotted on a report, and which ones matter.",
  },
  trade: {
    label: "Trade & commerce",
    blurb: "How stones are priced, described and moved between dealers.",
  },
};

export const CATEGORY_ORDER: GlossaryCategory[] = [
  "anatomy",
  "proportions",
  "report",
  "optics",
  "inclusions",
  "trade",
];

export type GlossaryTerm = {
  slug: string;
  term: string;
  /** Other names the trade and the reports use. Matched by the search box. */
  aka?: string[];
  category: GlossaryCategory;
  /** One line that stands on its own — used in search results and in JSON-LD. */
  short: string;
  /** The depth: what it changes about the stone, and what to do about it. */
  detail: string;
  /** What a GIA or IGI report prints for it, or a note that it prints nothing. */
  onReport?: string;
  seeAlso?: string[];
  guide?: { href: string; label: string };
};

export const GLOSSARY: GlossaryTerm[] = [
  // ——— Anatomy ———————————————————————————————————————————————
  {
    slug: "table",
    term: "Table",
    category: "anatomy",
    short: "The large flat facet on the very top of the diamond.",
    detail:
      "The table is the window light goes in and out through, and it is by far the largest facet on the stone. Its width relative to the stone's diameter is the table percentage — one of the two proportion figures every listing carries.",
    onReport: "Reported as a percentage of average diameter, not in millimetres.",
    seeAlso: ["table-percent", "crown", "facet"],
  },
  {
    slug: "crown",
    term: "Crown",
    category: "anatomy",
    short: "Everything above the girdle: the sloping top of the stone.",
    detail:
      "The crown carries the table and the facets ringing it. Its height and the angle of its slope do most of the work of splitting white light into colour, which is why a shallow crown tends to look bright but flat, with little fire.",
    onReport: "Crown height and crown angle appear in the proportions diagram on a GIA report.",
    seeAlso: ["crown-angle", "table", "girdle", "fire"],
  },
  {
    slug: "girdle",
    term: "Girdle",
    category: "anatomy",
    short: "The narrow band around the widest part of the stone, where crown meets pavilion.",
    detail:
      "The girdle is where a setter's claws grip, so it has a practical job as well as an optical one. Too thin and it chips; too thick and it hides weight inside the stone that you paid for but cannot see. Medium through Slightly Thick is the comfortable range. It may be left frosted from bruting, polished smooth, or faceted.",
    onReport:
      'Graded from Extremely Thin through Medium to Extremely Thick, often as a range such as "Thin to Slightly Thick", with the finish noted as faceted, polished or bruted.',
    seeAlso: ["girdle-thickness", "bruting", "pavilion", "crown"],
  },
  {
    slug: "pavilion",
    term: "Pavilion",
    category: "anatomy",
    short: "Everything below the girdle: the cone tapering down to the culet.",
    detail:
      "The pavilion is the mirror. Light entering the table strikes the pavilion facets and, if their angle is right, bounces across and back up out of the top. Get that angle wrong by a degree or two and the light passes straight out of the bottom instead — which is the whole difference between a lively stone and a dull one.",
    onReport: "Pavilion depth and pavilion angle appear in the proportions diagram on a GIA report.",
    seeAlso: ["pavilion-angle", "culet", "light-leakage", "girdle"],
  },
  {
    slug: "culet",
    term: "Culet",
    aka: ["culet size"],
    category: "anatomy",
    short:
      "The point at the very bottom of the stone — or a small facet where that point is cut flat.",
    detail:
      'Modern cutting usually brings the pavilion to a true point, and the report then reads "None". Where a small facet is left instead, it can show through the table as a grey dot in the centre of the stone once it reaches Medium or larger. On antique and old-cut stones a sizeable culet is normal and part of the character.',
    onReport:
      'Graded None, Very Small, Small, Medium, Slightly Large, Large, Very Large or Extremely Large. "None" is the modern ideal.',
    seeAlso: ["pavilion", "old-european-cut"],
  },
  {
    slug: "facet",
    term: "Facet",
    category: "anatomy",
    short: "One polished flat surface on the stone. A round brilliant has 57 or 58 of them.",
    detail:
      "The count is 57 without a culet facet and 58 with one. Brilliant cuts use triangular and kite-shaped facets arranged to scatter light in every direction; step cuts use long parallel facets that behave more like a hall of mirrors.",
    seeAlso: ["brilliant-cut", "step-cut", "culet"],
  },
  {
    slug: "brilliant-cut",
    term: "Brilliant cut",
    category: "anatomy",
    short: "A faceting style built from triangular and kite-shaped facets radiating from the centre.",
    detail:
      "Rounds, ovals, pears, marquises, hearts, cushions and radiants are all brilliant cuts. The style maximises the sparkle returned through the top, and it hides small inclusions better than a step cut does, because the busy light pattern gives the eye nothing to settle on.",
    seeAlso: ["step-cut", "facet", "scintillation"],
    guide: { href: "/shapes", label: "Shapes we carry" },
  },
  {
    slug: "step-cut",
    term: "Step cut",
    category: "anatomy",
    short: "A faceting style of long parallel facets running around the stone like steps.",
    detail:
      "Emerald and Asscher cuts are step cuts. They trade fine sparkle for broad flashes and an open, glassy look straight into the stone. That openness is unforgiving: inclusions and body colour a brilliant cut would disguise are plainly visible, so step cuts are usually bought a grade or two higher in both colour and clarity.",
    seeAlso: ["brilliant-cut", "eye-clean"],
    guide: { href: "/clarity-guide", label: "Clarity guide" },
  },
  {
    slug: "bruting",
    term: "Bruting",
    aka: ["girdling"],
    category: "anatomy",
    short: "The stage of cutting that grinds the rough to its round outline, forming the girdle.",
    detail:
      "Two diamonds are turned against one another on a lathe until one is round. It is the step that gives a brilliant its outline, and it leaves the girdle with the frosted, slightly granular surface a report calls bruted, unless it is later polished or faceted.",
    seeAlso: ["girdle", "make"],
    guide: { href: "/craftsmanship", label: "How a stone is cut" },
  },
  {
    slug: "old-european-cut",
    term: "Old European cut",
    aka: ["old cut", "old mine cut"],
    category: "anatomy",
    short:
      "A hand-cut round predating modern proportions, with a small table, a high crown and an open culet.",
    detail:
      "Cut by eye under candlelight rather than to a formula, these stones show big, slow flashes of colour rather than the fine glitter of a modern round. They will not score well against a modern cut grade, and are not meant to — they are bought for character and priced on their own terms.",
    onReport: "Graded for polish and symmetry; no modern overall cut grade is issued.",
    seeAlso: ["culet", "cut-grade", "fire"],
  },

  // ——— Proportions ———————————————————————————————————————————
  {
    slug: "table-percent",
    term: "Table %",
    aka: ["table percentage"],
    category: "proportions",
    short: "The width of the table facet as a percentage of the stone's average diameter.",
    detail:
      "On a round brilliant, roughly 54–58% is where most well-cut stones fall. A larger table lets in more light and can look brighter face up, but gives away fire; a smaller table does the reverse. Read it alongside depth, never on its own — the two have to work together.",
    onReport: "Printed on every GIA and IGI report, and shown on every listing on this site.",
    seeAlso: ["table", "depth-percent", "crown-angle"],
    guide: { href: "/cut-guide", label: "Cut guide" },
  },
  {
    slug: "depth-percent",
    term: "Depth %",
    aka: ["total depth", "depth percentage"],
    category: "proportions",
    short: "The stone's height from table to culet as a percentage of its average diameter.",
    detail:
      "Around 59–62.5% is the usual window for a well-cut round. Cut too deep and weight hides below the girdle where nobody can see it, so the stone faces up smaller than its carat weight suggests. Cut too shallow and light escapes through the bottom, leaving a flat, watery centre.",
    onReport: "Printed on every GIA and IGI report, and shown on every listing on this site.",
    seeAlso: ["table-percent", "spread", "light-leakage", "pavilion-angle"],
    guide: { href: "/carat-guide", label: "Carat guide" },
  },
  {
    slug: "crown-angle",
    term: "Crown angle",
    category: "proportions",
    short: "The angle between the girdle plane and the sloping crown facets.",
    detail:
      "Roughly 34–35° suits a round brilliant. Crown and pavilion angles are a pair: the crown sets the light up and the pavilion returns it, and a stone can have a textbook figure for one and still perform poorly because the other does not complement it. It is why two stones with identical table and depth figures can look quite different.",
    onReport: "Given in the proportions diagram on a GIA report; not always printed elsewhere.",
    seeAlso: ["pavilion-angle", "crown", "fire"],
  },
  {
    slug: "pavilion-angle",
    term: "Pavilion angle",
    aka: ["pavilion depth"],
    category: "proportions",
    short:
      "The angle of the pavilion facets below the girdle — the most sensitive number on the stone.",
    detail:
      "About 40.6–41.0° is the target on a round brilliant. The tolerance here is far tighter than anywhere else in the cut: half a degree out and light that should have come back to the eye leaves through the bottom instead. It is the figure that most often separates an Excellent from a Very Good.",
    onReport: "Given in the proportions diagram on a GIA report.",
    seeAlso: ["crown-angle", "pavilion", "light-leakage", "cut-grade"],
  },
  {
    slug: "girdle-thickness",
    term: "Girdle thickness",
    category: "proportions",
    short:
      "How thick the band at the stone's widest point is, graded Extremely Thin to Extremely Thick.",
    detail:
      "Extremely Thin girdles are fragile at the setting stage, particularly on shapes with points — pear, marquise and heart. Very Thick and above parks carat weight in a rim that adds nothing to face-up size. Medium to Slightly Thick is the range to aim for; on pointed shapes, ask about the girdle at the points specifically.",
    onReport: "Graded, usually as a range, with the finish noted as faceted, polished or bruted.",
    seeAlso: ["girdle", "spread", "depth-percent"],
  },
  {
    slug: "length-to-width",
    term: "Length-to-width ratio",
    aka: ["l/w", "lw ratio"],
    category: "proportions",
    short: "The outline's proportions — length divided by width — which decides how a fancy shape reads.",
    detail:
      "A 1.40 oval looks round and generous; a 1.60 oval looks long and slim. Neither is correct, but the ratio is the main lever on how a fancy shape sits on a hand, and it is almost entirely a matter of taste. Ratio is also where bow-ties live: very long ovals, pears and marquises are more prone to them.",
    onReport: "Not printed as a ratio — it is calculated from the measurements on the report.",
    seeAlso: ["measurements", "bow-tie", "spread"],
    guide: { href: "/shapes", label: "Ratios by shape" },
  },
  {
    slug: "measurements",
    term: "Measurements",
    category: "proportions",
    short: "The stone's physical size in millimetres: length × width × depth.",
    detail:
      "For a round the first two figures are the minimum and maximum diameter, and a wide gap between them means the outline is out of round. For a fancy shape they are length and width, and dividing one by the other gives the ratio. Millimetres, not carats, are what a buyer actually sees.",
    onReport: "Printed on every report, to two decimal places.",
    seeAlso: ["length-to-width", "spread", "carat"],
    guide: { href: "/carat-guide", label: "Size by carat weight" },
  },
  {
    slug: "spread",
    term: "Spread",
    aka: ["face-up size"],
    category: "proportions",
    short: "How large a stone looks from above, relative to what its carat weight would suggest.",
    detail:
      'Trade shorthand rather than a graded term. A stone that "spreads well" carries its weight across the face rather than down into the pavilion or out into a thick girdle. It is why a well-cut 0.95 ct can face up larger than a poorly cut 1.10 ct — and why buying just under a magic size is often good value.',
    onReport: "Not a report term. Judge it from the measurements against carat weight.",
    seeAlso: ["depth-percent", "girdle-thickness", "magic-sizes", "measurements"],
  },

  // ——— Report terms ——————————————————————————————————————————
  {
    slug: "fluorescence",
    term: "Fluorescence",
    category: "report",
    short: "A glow, almost always blue, that some diamonds give off under ultraviolet light.",
    detail:
      "Roughly a quarter to a third of diamonds show it. In a lower colour grade — I, J and down — faint to medium blue can make a stone look slightly whiter in daylight, and it usually sells a little cheaper, which makes it one of the few genuine bargains in the market. In very high colours, D through F, strong fluorescence occasionally gives a hazy or oily look. Judge it by eye, in daylight, not by the word on the report.",
    onReport:
      "Graded None, Faint, Medium, Strong or Very Strong, with the colour of the glow noted where present. IGI reports also use Very Slight and Slight.",
    seeAlso: ["milky", "color-grade", "overtone"],
    guide: { href: "/color-guide", label: "Colour guide" },
  },
  {
    slug: "cut-grade",
    term: "Cut grade",
    category: "report",
    short: "An overall verdict on how well a round brilliant has been cut — issued for rounds only.",
    detail:
      "GIA grades Excellent, Very Good, Good, Fair and Poor; IGI adds Ideal above Excellent. It is a summary of proportions, symmetry and polish taken together. No laboratory issues an overall cut grade for fancy shapes, so for those you read the proportions yourself and, ideally, look at the stone.",
    onReport: "Round brilliants only. Fancy shapes carry polish and symmetry instead.",
    seeAlso: ["polish", "symmetry", "pavilion-angle", "make"],
    guide: { href: "/cut-guide", label: "Cut guide" },
  },
  {
    slug: "polish",
    term: "Polish",
    category: "report",
    short: "How smoothly each facet surface has been finished.",
    detail:
      "Graded on the same word scale as cut. Poor polish leaves drag lines, burn marks or a faintly greasy surface that scatters light before it can get into the stone. Excellent and Very Good are both perfectly good buys; below that it becomes visible under a loupe and, at the bottom of the scale, to the eye.",
    onReport: "Graded on every report, for every shape.",
    seeAlso: ["symmetry", "cut-grade"],
    guide: { href: "/cut-guide", label: "Cut guide" },
  },
  {
    slug: "symmetry",
    term: "Symmetry",
    category: "report",
    short: "How precisely the facets line up with one another and with the outline.",
    detail:
      "Misalignment pushes light off its intended path, so poor symmetry costs sparkle even when every other figure reads well. It is also the term doing most of the work on fancy shapes, where there is no overall cut grade to fall back on. Optical symmetry — the kind a Hearts and Arrows viewer shows — is a stricter thing again, and is not what this grade measures.",
    onReport: "Graded on every report, for every shape.",
    seeAlso: ["polish", "hearts-and-arrows", "cut-grade"],
    guide: { href: "/cut-guide", label: "Cut guide" },
  },
  {
    slug: "color-grade",
    term: "Colour grade",
    category: "report",
    short: "How close to colourless a white diamond is, on a scale running D to Z.",
    detail:
      "D–F is colourless, G–J near colourless, K and below shows warmth to the eye. Grading is done face down against master stones in controlled light — far harsher than the way anyone wears a diamond. In a warm-metal setting, G through I usually looks white, and the money saved against D is better spent on cut.",
    onReport: "Graded D to Z. Stones with more colour than Z are graded as fancy colours instead.",
    seeAlso: ["fancy-colour", "master-stones", "fluorescence"],
    guide: { href: "/color-guide", label: "Colour guide" },
  },
  {
    slug: "master-stones",
    term: "Master stones",
    category: "report",
    short: "A calibrated set of reference diamonds a laboratory grades colour against.",
    detail:
      "A grader compares the stone, face down in a neutral tray under standardised light, with a set of stones of known grade. This is why colour grading is consistent between reports from one laboratory, and why a colour grade is a comparison rather than a measurement.",
    onReport: "Not printed. It is the method behind the colour grade.",
    seeAlso: ["color-grade", "grading-report"],
  },
  {
    slug: "fancy-colour",
    term: "Fancy colour",
    category: "report",
    short: "A diamond with enough body colour to be graded for that colour rather than against D–Z.",
    detail:
      "Graded by hue, tone and saturation — Fancy Light, Fancy, Fancy Intense, Fancy Vivid and so on. The logic inverts here: in a white diamond colour is a fault to be minimised, in a fancy it is the entire point, and the deeper and purer the colour the higher the price.",
    onReport: 'Described in words, for example "Fancy Vivid Yellow", on a coloured diamond report.',
    seeAlso: ["color-grade", "overtone"],
  },
  {
    slug: "clarity-grade",
    term: "Clarity grade",
    category: "report",
    short:
      "How free of inclusions a stone is, from Flawless down to I3, judged at 10× magnification.",
    detail:
      "The whole scale is defined at 10×, not by eye — which is the key to spending well. VS2 and SI1 stones are very often eye-clean, and the grades above them are paying for something only a loupe can find. Where the inclusion sits matters as much as the grade: one under the table is worse than the same one near the girdle.",
    onReport: "Graded FL, IF, VVS1–VVS2, VS1–VS2, SI1–SI2, I1–I3, with the characteristics plotted.",
    seeAlso: ["eye-clean", "plot", "feather", "crystal"],
    guide: { href: "/clarity-guide", label: "Clarity guide" },
  },
  {
    slug: "plot",
    term: "Plot",
    aka: ["clarity plot", "plotting diagram"],
    category: "report",
    short: "The diagram on a report marking where each clarity characteristic sits in the stone.",
    detail:
      "Red marks internal inclusions, green marks surface blemishes. Read it before the grade: it tells you whether an SI1's inclusion is a dark crystal under the table or a feather tucked at the girdle where a claw will cover it. Reports on smaller stones often replace the plot with a written list of characteristics.",
    onReport: "Printed on full reports; dossier-style reports list characteristics in words instead.",
    seeAlso: ["clarity-grade", "eye-clean", "key-to-symbols"],
  },
  {
    slug: "key-to-symbols",
    term: "Key to symbols",
    category: "report",
    short: "The legend beside the plot, naming each characteristic found, in order of significance.",
    detail:
      'The first item listed is the one that set the grade. Comments below the key can matter more than the key itself — "clouds are not shown" or "internal graining is not shown" often explains why a stone looks milky despite a respectable grade on paper.',
    onReport: "Printed beside the plotting diagram.",
    seeAlso: ["plot", "cloud", "graining", "milky"],
  },
  {
    slug: "eye-clean",
    term: "Eye-clean",
    category: "report",
    short: "No inclusion visible to an unaided eye at normal viewing distance.",
    detail:
      "Trade shorthand, not a graded term, and it has no fixed definition — six inches and ten inches are both defended. It is still the single most useful idea in clarity buying: the goal is a stone clean to the eye, which is often two or three grades below where the price starts climbing steeply.",
    onReport: "Never appears on a report. Confirm it from the plot, from images, or by asking.",
    seeAlso: ["clarity-grade", "plot", "step-cut"],
    guide: { href: "/clarity-guide", label: "Clarity guide" },
  },
  {
    slug: "grading-report",
    term: "Grading report",
    aka: ["certificate", "cert"],
    category: "report",
    short: "A laboratory's record of one stone's measurements, grades and characteristics.",
    detail:
      "The trade calls it a certificate; a laboratory will not, because it certifies nothing and guarantees nothing. It is a set of expert opinions about one stone on one day. Grades are reproducible within a laboratory but not perfectly across them, so compare like with like — and check the report number against the inscription on the girdle.",
    onReport: "It is the report. Every stone we sell is sold with one.",
    seeAlso: ["gia", "igi", "laser-inscription"],
  },
  {
    slug: "gia",
    term: "GIA",
    aka: ["Gemological Institute of America"],
    category: "report",
    short: "The Gemological Institute of America — the laboratory that defined the modern scales.",
    detail:
      "GIA wrote the D–Z colour scale and the clarity scale the whole market now uses, and is generally treated as the strictest and most consistent of the major laboratories. A GIA report on a natural stone typically carries a price premium over the same stone graded elsewhere, because buyers trust the grade.",
    seeAlso: ["igi", "grading-report"],
  },
  {
    slug: "igi",
    term: "IGI",
    aka: ["International Gemological Institute"],
    category: "report",
    short: "The International Gemological Institute — the dominant laboratory for lab-grown stones.",
    detail:
      "IGI grades the large majority of lab-grown diamonds, including most of ours, and issues an overall cut grade for round brilliants where its top grade is Ideal. Compare IGI with IGI and GIA with GIA: mixing reports across laboratories while comparing two stones on grade alone is how buyers get caught out.",
    seeAlso: ["gia", "grading-report", "cut-grade"],
    guide: { href: "/lab-grown-diamonds", label: "Lab-grown stock" },
  },
  {
    slug: "laser-inscription",
    term: "Laser inscription",
    category: "report",
    short: "The report number etched microscopically onto the girdle, tying stone to paperwork.",
    detail:
      "Invisible to the eye and readable under magnification, it is how you confirm the stone in front of you is the stone the report describes. Lab-grown diamonds are additionally inscribed as laboratory-grown. Always check it, especially on a stone bought remotely.",
    onReport: "The inscription is quoted on the report where present.",
    seeAlso: ["grading-report", "lab-grown"],
  },
  {
    slug: "carat",
    term: "Carat",
    aka: ["ct", "points"],
    category: "report",
    short: "The unit of weight for gemstones: one carat is 0.2 grams, divided into 100 points.",
    detail:
      "A 0.75 ct stone is spoken of as seventy-five points. Weight is not size — it says nothing about how large the stone looks face up, which depends on the cut. Price per carat rises in steps rather than smoothly, and jumps hardest at the round numbers.",
    onReport: "Printed to two decimal places on every report.",
    seeAlso: ["magic-sizes", "spread", "price-per-carat", "measurements"],
    guide: { href: "/carat-guide", label: "Carat guide" },
  },

  // ——— Light & appearance ————————————————————————————————————
  {
    slug: "brilliance",
    term: "Brilliance",
    category: "optics",
    short: "The white light a diamond returns to the eye — its overall brightness.",
    detail:
      "Brilliance is what makes a stone read as bright rather than grey in ordinary room light. It comes from pavilion angles that send light back up through the crown instead of out of the bottom, which is why it tracks cut quality more closely than any other property.",
    seeAlso: ["fire", "scintillation", "light-leakage", "pavilion-angle"],
    guide: { href: "/cut-guide", label: "Cut guide" },
  },
  {
    slug: "fire",
    term: "Fire",
    aka: ["dispersion"],
    category: "optics",
    short: "White light split into flashes of spectral colour as it leaves the stone.",
    detail:
      'Properly called dispersion. Fire shows best under a point source — candlelight, spotlights, sunshine — and barely shows under a flat overcast sky or office lighting. Crown angle and a table that is not too large are what produce it, which is why very large-tabled "spready" stones can look bright but lifeless.',
    seeAlso: ["brilliance", "crown-angle", "scintillation"],
  },
  {
    slug: "scintillation",
    term: "Scintillation",
    aka: ["sparkle"],
    category: "optics",
    short: "The flashing pattern of light and dark as the stone, the light or the viewer moves.",
    detail:
      "Scintillation is what you notice across a room. It depends on the contrast pattern the facets create — a stone with no dark areas at all looks washed out, so some contrast is desirable. It is the one optical property a still photograph cannot show, which is why a video is worth asking for.",
    seeAlso: ["brilliance", "fire", "facet"],
  },
  {
    slug: "light-leakage",
    term: "Light leakage",
    aka: ["leakage"],
    category: "optics",
    short:
      "Light that enters the stone and escapes through the bottom or side instead of returning to the eye.",
    detail:
      "Leakage is the direct cost of poor proportions, and it reads as dull or dark patches face up. A stone cut too shallow leaks through the pavilion in a ring around the table; one cut too deep leaks out of the sides. An ASET or Idealscope image shows exactly where it is happening.",
    seeAlso: ["aset", "idealscope", "windowing", "pavilion-angle"],
  },
  {
    slug: "windowing",
    term: "Window",
    aka: ["windowing", "fish-eye"],
    category: "optics",
    short:
      "A see-through patch in the middle of the stone where light passes straight out of the bottom.",
    detail:
      "Hold the stone over print: if you can read through the centre, that area is a window and is returning no light at all. It is a shallow-cut fault, common on fancy shapes bought for spread. The related fish-eye is a whitish ring — the girdle reflected under the table — on very shallow rounds.",
    seeAlso: ["light-leakage", "depth-percent", "spread"],
  },
  {
    slug: "bow-tie",
    term: "Bow-tie",
    category: "optics",
    short: "A dark band across the centre of an elongated stone, shaped like a bow-tie.",
    detail:
      "Ovals, pears and marquises are all prone to it; it is caused by the viewer's own body blocking the light those facets need. A faint one is normal and shows on almost every elongated stone. A strong one is a permanent dark stripe, and no report will mention it, so it has to be judged from a video or from the stone.",
    onReport: "Never appears on a report. Ask for a video before buying an elongated shape.",
    seeAlso: ["length-to-width", "light-leakage", "scintillation"],
  },
  {
    slug: "hearts-and-arrows",
    term: "Hearts and Arrows",
    aka: ["h&a"],
    category: "optics",
    short:
      "A pattern of eight arrows from above and eight hearts from below, shown by a special viewer on exceptionally symmetrical rounds.",
    detail:
      "It indicates optical symmetry well beyond what the report's symmetry grade measures, and such stones are usually cut with more care throughout. But it is a pattern, not a laboratory grade, and anyone can print the words on a listing — ask for the viewer image and judge the stone on it.",
    onReport: "Not a graded term. Some laboratories issue a supplementary image report.",
    seeAlso: ["symmetry", "idealscope", "cut-grade"],
  },
  {
    slug: "aset",
    term: "ASET",
    aka: ["Angular Spectrum Evaluation Tool"],
    category: "optics",
    short:
      "A scope that colour-codes where a stone draws its light from — red for the best angles, green for weaker, blue for contrast, white for leakage.",
    detail:
      "The most informative single image you can ask for, and the most useful tool available for fancy shapes, which have no overall cut grade. Strong red across the stone with an even blue contrast pattern is what you want; white patches are light leaking away.",
    seeAlso: ["idealscope", "light-leakage", "cut-grade"],
  },
  {
    slug: "idealscope",
    term: "Idealscope",
    category: "optics",
    short: "A simpler red-and-white scope: red is returned light, white is leakage, black is contrast.",
    detail:
      "Cheaper and more common than ASET, and read the same way — the more even red and the less white, the better the stone handles light. On a round brilliant it also makes symmetry faults obvious, as breaks in the eight-fold pattern.",
    seeAlso: ["aset", "light-leakage", "hearts-and-arrows"],
  },
  {
    slug: "milky",
    term: "Milky",
    aka: ["hazy", "cloudy"],
    category: "optics",
    short: "A diamond that looks faintly cloudy or sleepy rather than crisp and transparent.",
    detail:
      "Usually caused by dense clouds or heavy internal graining — both of which a report may mention only in a comment, or not plot at all. A milky stone can carry good grades on paper and still look dull, which is the strongest argument there is for seeing the stone or a video before committing.",
    onReport: 'Sometimes only hinted at, by a comment such as "clouds are not shown".',
    seeAlso: ["cloud", "graining", "key-to-symbols", "fluorescence"],
  },
  {
    slug: "overtone",
    term: "Overtone",
    category: "optics",
    short: "A secondary hue lying over a fancy colour diamond's main colour.",
    detail:
      'In "Fancy Intense Yellowish Brown", brown is the body colour and yellowish is the overtone. The modifier changes value considerably: a pure hue almost always commands more than the same saturation carrying a modifier.',
    onReport: "Written into the colour description on a coloured diamond report.",
    seeAlso: ["fancy-colour", "color-grade"],
  },

  // ——— Inclusions ————————————————————————————————————————————
  {
    slug: "inclusion",
    term: "Inclusion",
    aka: ["clarity characteristic"],
    category: "inclusions",
    short: "Any internal feature in a diamond — what clarity grading counts.",
    detail:
      "Inclusions are the record of how the stone formed, and almost every diamond has some. What matters is not how many but which kind, how large, where they sit and whether they are dark: a pale feather at the girdle is invisible, a black crystal under the table is not.",
    onReport: "Marked in red on the plot and named in the key to symbols; blemishes are green.",
    seeAlso: ["clarity-grade", "plot", "feather", "crystal", "eye-clean"],
    guide: { href: "/clarity-guide", label: "Clarity guide" },
  },
  {
    slug: "feather",
    term: "Feather",
    category: "inclusions",
    short: "An internal fracture, named for its wispy white look.",
    detail:
      "The most common inclusion on a report. Most are harmless and invisible face up. Two things to check: whether it reaches the surface, and whether it sits under a point or at the girdle where a setter's pressure falls — a large surface-reaching feather in a vulnerable place is a durability question, not just a clarity one.",
    onReport: "Plotted in red and named in the key to symbols.",
    seeAlso: ["inclusion", "plot", "chip", "knot"],
  },
  {
    slug: "crystal",
    term: "Crystal",
    category: "inclusions",
    short: "Another mineral crystal trapped inside the diamond.",
    detail:
      "Colour decides how much it matters. A colourless or white crystal can be hard to see even at a fair size; a black or dark red one is visible at a fraction of that size, especially under the table. If a report lists crystal as the first characteristic on an SI stone, ask what colour it is.",
    onReport: "Plotted in red and named in the key to symbols. Colour is not always stated.",
    seeAlso: ["inclusion", "pinpoint", "eye-clean"],
  },
  {
    slug: "cloud",
    term: "Cloud",
    category: "inclusions",
    short: "A cluster of pinpoints so close together it reads as a hazy patch.",
    detail:
      'A small tight cloud is nothing. A large diffuse one is the classic cause of a milky stone — and because clouds are sometimes noted only in a comment rather than plotted, a diamond can grade VS2 on paper and still look sleepy. Treat "clouds are not shown" as a prompt to see the stone.',
    onReport: 'Plotted, or noted in a comment such as "clouds are not shown".',
    seeAlso: ["milky", "pinpoint", "key-to-symbols"],
  },
  {
    slug: "pinpoint",
    term: "Pinpoint",
    category: "inclusions",
    short: "A minute crystal, visible only under magnification as a tiny dot.",
    detail:
      "Individually irrelevant to the eye, and the reason many VVS and VS stones are graded where they are. Their significance is collective: enough pinpoints in one place become a cloud.",
    onReport: "Plotted in red; often the sole characteristic on a VVS stone.",
    seeAlso: ["cloud", "crystal", "clarity-grade"],
  },
  {
    slug: "needle",
    term: "Needle",
    category: "inclusions",
    short: "A long, thin crystal inclusion.",
    detail:
      "Usually harmless and invisible face up unless it is dark or sits in a run beneath the table. A reflective needle can occasionally be seen as a fine line when the stone is tilted.",
    onReport: "Plotted in red and named in the key to symbols.",
    seeAlso: ["crystal", "inclusion"],
  },
  {
    slug: "twinning-wisp",
    term: "Twinning wisp",
    category: "inclusions",
    short: "A ribbon of distorted crystal growth, formed where the diamond twisted as it grew.",
    detail:
      "Common in fancy shapes and in lab-grown material. Usually faint and not visible face up, but a broad one can slightly soften the stone's transparency. Read it alongside any graining comment.",
    onReport: "Plotted and named; often accompanies a graining comment.",
    seeAlso: ["graining", "inclusion", "milky"],
  },
  {
    slug: "knot",
    term: "Knot",
    category: "inclusions",
    short: "An included crystal that breaks the surface of the polished stone.",
    detail:
      "Because it reaches the surface it can show as a raised or depressed spot, and it can catch a fingernail. More significant than its size suggests, and worth asking about specifically on any stone that will be worn daily.",
    onReport: "Plotted and named; usually caps the grade at SI or below.",
    seeAlso: ["cavity", "chip", "feather"],
  },
  {
    slug: "cavity",
    term: "Cavity",
    category: "inclusions",
    short: "An opening in the surface, often where an included crystal fell out during polishing.",
    detail:
      "Cavities trap dirt and dull the stone between cleanings, and they are a weak point in a diamond that gets knocked. Where one sits decides how much it matters — under a claw is very different from the middle of the table.",
    onReport: "Plotted in green as a surface characteristic.",
    seeAlso: ["knot", "chip", "inclusion"],
  },
  {
    slug: "chip",
    term: "Chip",
    category: "inclusions",
    short: "A small shallow break at the girdle, a point or the culet.",
    detail:
      "Often the result of handling or setting rather than nature. A chip at a pear's point or a marquise's tip is the one to take seriously; a minute girdle chip a claw will cover is usually a bargaining point rather than a problem.",
    onReport: "Plotted in green as a surface characteristic.",
    seeAlso: ["feather", "girdle", "cavity"],
  },
  {
    slug: "natural",
    term: "Natural",
    category: "inclusions",
    short: "A patch of the original rough diamond's skin left unpolished, usually on the girdle.",
    detail:
      "A cutter leaves one to keep as much weight as possible. A small natural confined to the girdle affects nothing. An indented natural — one dipping below the polished surface — is worth checking if it is large or sits where it will be seen.",
    onReport: 'Plotted in green; "indented natural" is noted separately.',
    seeAlso: ["girdle", "inclusion", "make"],
  },
  {
    slug: "graining",
    term: "Graining",
    category: "inclusions",
    short: "Irregular crystal growth showing as faint lines, reflections or a whitish haze.",
    detail:
      "Internal graining is the more serious kind and, in quantity, a common cause of a milky stone. Like clouds, it may be mentioned only in a comment on the report. Surface graining on the polished facets is usually trivial.",
    onReport: 'Often a comment — "internal graining is not shown" — rather than a plotted mark.',
    seeAlso: ["milky", "cloud", "key-to-symbols", "twinning-wisp"],
  },

  // ——— Trade & commerce ——————————————————————————————————————
  {
    slug: "price-per-carat",
    term: "Price per carat",
    aka: ["pc", "per carat"],
    category: "trade",
    short: "How the trade quotes diamonds: a rate per carat, multiplied by weight for the total.",
    detail:
      "A 1.50 ct at a rate of £6,000 per carat is £9,000. Quoting this way makes stones of different weights directly comparable, and it exposes the steps in the market: the per-carat rate itself jumps at each size band, so a 1.00 ct costs more per carat than a 0.99 ct, not merely more in total.",
    seeAlso: ["magic-sizes", "rapaport", "carat"],
  },
  {
    slug: "magic-sizes",
    term: "Magic sizes",
    category: "trade",
    short: "The round weights — 0.50, 0.75, 1.00, 1.50, 2.00 ct — where price steps up sharply.",
    detail:
      "Demand clusters at whole and half carats, so the per-carat rate jumps as a stone crosses them. Buying just under, at 0.90 or 1.40, can save a noticeable amount for a difference in diameter of a few tenths of a millimetre that nobody will ever see.",
    seeAlso: ["price-per-carat", "carat", "spread"],
    guide: { href: "/carat-guide", label: "Carat guide" },
  },
  {
    slug: "rapaport",
    term: "Rapaport list",
    aka: ["rap", "rap list"],
    category: "trade",
    short: "A weekly published price list the natural diamond trade quotes discounts against.",
    detail:
      'Stones are traded as a percentage below list — "20 back" means 20% under the Rapaport price for that size, colour and clarity. It is a benchmark for wholesale negotiation rather than a retail price, and it covers natural stones; lab-grown pricing works on different and faster-moving terms.',
    seeAlso: ["price-per-carat", "lab-grown"],
    guide: { href: "/insights", label: "Market insights" },
  },
  {
    slug: "make",
    term: "Make",
    category: "trade",
    short: "Trade shorthand for the overall quality of the cutting work.",
    detail:
      '"A good make" means the stone was cut for beauty rather than to save weight — tight symmetry, clean polish, sensible proportions. It is the quality a cut grade tries to summarise, and the thing that most separates two stones with identical grades on paper.',
    seeAlso: ["cut-grade", "symmetry", "bruting"],
    guide: { href: "/craftsmanship", label: "Craftsmanship" },
  },
  {
    slug: "loose-stone",
    term: "Loose stone",
    category: "trade",
    short: "An unset diamond, sold on its own.",
    detail:
      "Buying loose is how you see what you are actually paying for: the stone can be examined from every angle, weighed, and checked against its report before a setter touches it. Everything on this site is sold loose.",
    seeAlso: ["parcel", "memo"],
  },
  {
    slug: "parcel",
    term: "Parcel",
    category: "trade",
    short: "A group of stones of similar quality sold together rather than individually.",
    detail:
      "Normal for melee — the small accent stones around a centre — where grading each one individually would cost more than the stone is worth. A parcel is described by a range of grades and an average size, not by a report per stone.",
    seeAlso: ["loose-stone", "melee"],
  },
  {
    slug: "melee",
    term: "Melee",
    category: "trade",
    short: "Small diamonds, generally under 0.18 ct, used as accent stones.",
    detail:
      "Sold by parcel and by weight rather than individually certified. Quality still varies considerably between parcels, and cheap melee around a fine centre stone is a false economy — it is the ring of small stones that most often looks grey.",
    seeAlso: ["parcel", "loose-stone"],
  },
  {
    slug: "memo",
    term: "Memo",
    aka: ["consignment"],
    category: "trade",
    short: "Stones sent to a buyer on approval, remaining the supplier's property until sold.",
    detail:
      "Standard practice between dealers and jewellers: it lets a stone be seen, shown to a client and returned without a purchase. It is a trade arrangement rather than a retail one, and it always runs on a written memo describing each stone.",
    seeAlso: ["loose-stone", "parcel"],
  },
  {
    slug: "lab-grown",
    term: "Lab-grown",
    aka: ["lgd", "laboratory-grown", "cvd", "hpht"],
    category: "trade",
    short:
      "A real diamond grown in a reactor rather than in the earth — chemically and optically identical to a mined one.",
    detail:
      "Grown by CVD, where carbon is deposited from a gas onto a seed, or by HPHT, which reproduces the pressure and temperature of natural formation. The material is diamond by every physical test; what differs is origin, supply and price, and lab-grown prices have fallen a long way as capacity has grown.",
    onReport: "Reports state laboratory-grown, and the girdle carries a matching inscription.",
    seeAlso: ["hpht-treatment", "type-iia", "laser-inscription", "rapaport"],
    guide: { href: "/lab-grown-diamonds", label: "Lab-grown diamonds" },
  },
  {
    slug: "hpht-treatment",
    term: "HPHT treatment",
    category: "trade",
    short: "High pressure, high temperature processing used after growth or mining to improve colour.",
    detail:
      "Distinct from HPHT as a growth method. Applied to a finished stone it can lift a brownish diamond several colour grades. It is permanent and legitimate, but it must be disclosed, and a treated stone is worth considerably less than an untreated one of the same final grade.",
    onReport: "Disclosed on the report where detected. Undisclosed treatment is a serious matter.",
    seeAlso: ["lab-grown", "type-iia", "grading-report"],
  },
  {
    slug: "type-iia",
    term: "Type IIa",
    category: "trade",
    short:
      "A rare classification of diamond containing almost no nitrogen — around 2% of natural stones.",
    detail:
      "Type IIa stones are typically exceptionally colourless and transparent, and the classification is often quoted on very fine natural diamonds as a mark of quality. Most CVD lab-grown material is also type IIa, so on its own the term says nothing about origin.",
    onReport: "Not on a standard report; issued as a separate type classification letter.",
    seeAlso: ["lab-grown", "color-grade", "hpht-treatment"],
  },
  {
    slug: "kimberley-process",
    term: "Kimberley Process",
    category: "trade",
    short: "The international certification scheme controlling trade in rough diamonds.",
    detail:
      "Rough crossing a border must travel with a Kimberley Process certificate confirming it is not funding conflict. It governs rough, not polished stones, so a polished diamond does not carry a certificate of its own — traceability beyond that point depends on the supply chain, and is asked for stone by stone.",
    seeAlso: ["provenance", "rough"],
  },
  {
    slug: "provenance",
    term: "Provenance",
    aka: ["origin", "traceability"],
    category: "trade",
    short: "The documented history of where a stone was mined and how it reached the market.",
    detail:
      "Distinct from the natural-or-lab-grown question. Country-of-origin provenance is available on some natural stones through mine-to-market programmes and is rarer on the open market — where it is offered, it should come with documentation rather than a verbal assurance.",
    seeAlso: ["kimberley-process", "rough", "lab-grown"],
  },
  {
    slug: "rough",
    term: "Rough",
    category: "trade",
    short: "An uncut diamond crystal, as it comes out of the ground.",
    detail:
      'A polished stone typically retains only around 40–50% of the rough\'s weight, and the cutter decides at this stage where to save weight and where to cut for beauty. That decision is what "make" ultimately refers to.',
    seeAlso: ["make", "bruting", "kimberley-process"],
    guide: { href: "/craftsmanship", label: "Craftsmanship" },
  },
];

export const GLOSSARY_BY_SLUG = new Map(GLOSSARY.map((t) => [t.slug, t]));

/** Case- and accent-insensitive sort on the term itself. */
export const GLOSSARY_SORTED = [...GLOSSARY].sort((a, b) =>
  a.term.localeCompare(b.term, "en", { sensitivity: "base" }),
);

/** The letter a term files under. Anything non-alphabetic falls into "#". */
export function initial(term: GlossaryTerm): string {
  const first = term.term[0]?.toUpperCase() ?? "#";
  return /[A-Z]/.test(first) ? first : "#";
}

/** A–Z with per-letter counts, so the jump bar can dim letters with no entry. */
export function alphabet(): { letter: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const term of GLOSSARY) {
    const key = initial(term);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .map((letter) => ({ letter, count: counts.get(letter) ?? 0 }));
}

/** Terms grouped by initial, in alphabetical order, skipping empty letters. */
export function groupedByLetter(terms: GlossaryTerm[] = GLOSSARY_SORTED) {
  const groups: { letter: string; terms: GlossaryTerm[] }[] = [];
  for (const term of terms) {
    const letter = initial(term);
    const last = groups[groups.length - 1];
    if (last && last.letter === letter) last.terms.push(term);
    else groups.push({ letter, terms: [term] });
  }
  return groups;
}

/** Resolves `seeAlso` slugs, dropping any that no longer exist. */
export function relatedTerms(term: GlossaryTerm): GlossaryTerm[] {
  return (term.seeAlso ?? [])
    .map((slug) => GLOSSARY_BY_SLUG.get(slug))
    .filter((t): t is GlossaryTerm => t !== undefined && t.slug !== term.slug);
}

/** Free-text match over the term, its synonyms and both definitions. */
export function searchGlossary(terms: GlossaryTerm[], query: string): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  if (!q) return terms;
  return terms.filter((t) =>
    [t.term, ...(t.aka ?? []), t.short, t.detail, t.onReport ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}
