/**
 * Buying guides, organised by what the stone is for.
 *
 * These are deliberately structured data rather than markdown (which is what
 * `insights` uses). A guide is not prose: it is an argument that ends in a
 * specification, and the specification table is the part a buyer screenshots.
 * Keeping it typed means the recommendation can link straight into the
 * catalogue with the right filters applied, and can never drift out of the
 * vocabulary the rest of the site uses.
 *
 * House rules for the copy:
 *  - Recommend ranges, not single grades. A guide that says "buy G/VS2" is
 *    selling, not advising.
 *  - Say what a laboratory does not certify. Anything judged by eye — eye-clean,
 *    bow-tie, make, milkiness — has to be named as such.
 *  - Never imply a diamond is a financial investment. See the wear-grade guide.
 */

export type GuideSection = {
  id: string;
  heading: string;
  /** Paragraphs, rendered in order. */
  body: string[];
  /** An optional definition list under the paragraphs. */
  points?: { term: string; detail: string }[];
  /** An optional aside pulled out of the flow. */
  callout?: { label: string; heading: string; body: string; href?: string; cta?: string };
};

export type SpecRow = {
  label: string;
  value: string;
  /** Second column, used only where the guide's spec table compares two cases. */
  alt?: string;
  note: string;
};

export type Guide = {
  slug: string;
  /** Page H1. */
  title: string;
  /** <title>, written for the search result rather than the page. */
  metaTitle: string;
  /** The badge on the card and the hero: what occasion this covers. */
  occasion: string;
  description: string;
  /** Lead paragraph, also used as the card's body on the hub. */
  standfirst: string;
  readingMinutes: number;
  sections: GuideSection[];
  spec: {
    heading: string;
    intro: string;
    /** Column headings, when the table compares two cases rather than giving one. */
    columns?: [string, string];
    rows: SpecRow[];
    href: string;
    cta: string;
  };
  faq: { question: string; answer: string }[];
  /** Glossary slugs worth reading alongside this guide. */
  terms: string[];
  /** Other guide slugs. */
  related: string[];
};

export const GUIDES: Guide[] = [
  // ——————————————————————————————————————————————————————————————
  {
    slug: "choosing-an-engagement-ring-stone",
    title: "Choosing an engagement ring stone",
    metaTitle: "How to choose an engagement ring diamond: shape, grades and budget",
    occasion: "Engagement",
    description:
      "Which diamond specification to buy for an engagement ring: how to pick the shape, where the budget genuinely shows, how to match colour to the metal, and the durability questions no grading report answers.",
    standfirst:
      "An engagement stone is the one diamond most people buy without ever having bought one before, and it is worn every day for decades. That combination — no experience, high stakes, hard wear — is what this guide is built around.",
    readingMinutes: 9,
    sections: [
      {
        id: "shape-first",
        heading: "Start with the shape",
        body: [
          "Shape is the only decision here that is purely a matter of taste, and the only one that cannot be quietly improved later. Grades can be traded against each other; a pear is a pear. So settle it first, and settle it honestly — on what the wearer likes, not on what is currently good value.",
          "Round brilliants are roughly two thirds of the market. They are also the only shape a laboratory issues an overall cut grade for, which makes them the easiest shape to buy well at a distance. Everything else is a fancy shape, and buying one well means reading the proportions yourself or looking at the stone.",
          "Elongated shapes — oval, pear, marquise, emerald — face up larger than a round of the same weight, because more of their weight sits across the face. That is a real saving, and it comes with a real catch: elongated brilliant cuts are prone to a bow-tie, a dark band across the centre that no report mentions.",
        ],
        points: [
          {
            term: "Round",
            detail:
              "The safest buy and the most expensive per carat. Cut-graded, so you can judge it from the paperwork alone.",
          },
          {
            term: "Oval, pear, marquise",
            detail:
              "More size for the weight, and more taste required. Ask for a video and check the centre for a bow-tie before anything else.",
          },
          {
            term: "Emerald, Asscher",
            detail:
              "Step cuts. Open and architectural, and unforgiving — buy them a grade or two higher in both clarity and colour.",
          },
          {
            term: "Cushion, radiant, princess",
            detail:
              "Brilliant-faceted squares and rectangles. Forgiving on clarity, and the ratio changes their character considerably.",
          },
        ],
        callout: {
          label: "Before you choose",
          heading: "Look at the shapes at size, not on a screen",
          body: "A shape's character changes completely between a 0.70 ct and a 2.00 ct. Our shape pages show each outline with its typical ratio range and the stock we hold in it.",
          href: "/shapes",
          cta: "Compare the twelve shapes",
        },
      },
      {
        id: "budget-order",
        heading: "Where the budget actually shows",
        body: [
          "There is a spending order that holds for nearly every engagement stone, and it is not the order the four Cs are usually listed in. Cut first, because it decides whether the stone is bright or dull and nothing else can compensate for it. Then clarity — but only as far as eye-clean. Then colour, matched to the metal. Carat last, because it is the C that costs most and shows least per pound spent.",
          "The single most common mistake is paying for grades that only exist under a loupe. Clarity is defined at 10× magnification, so a VVS1 and a well-chosen VS2 can be indistinguishable to anyone who is not holding a loupe — and the price difference between them will comfortably buy a better cut, or another quarter of a carat.",
          "The second most common is buying exactly on a magic size. Demand clusters at 1.00, 1.50 and 2.00 ct, so the price per carat steps up as a stone crosses them. A 0.92 ct is about 2.5% narrower than a 1.00 ct — a difference of roughly a fifth of a millimetre — and meaningfully cheaper.",
        ],
        points: [
          {
            term: "1. Cut",
            detail:
              "Excellent or Ideal on a round. On a fancy shape, sensible depth and table figures, tight symmetry, and eyes on the stone.",
          },
          {
            term: "2. Clarity, to eye-clean",
            detail:
              "VS2 and SI1 are very often eye-clean. Stop at the first grade where the stone is clean to the eye, and spend the rest elsewhere.",
          },
          {
            term: "3. Colour, to the metal",
            detail:
              "G–I in white metal, H–J in yellow or rose. Above that you are paying for a difference that only shows face down against a master stone.",
          },
          {
            term: "4. Carat",
            detail:
              "Buy just under a magic size. Judge size in millimetres, not carats — the cut decides how much of the weight you can see.",
          },
        ],
      },
      {
        id: "colour-and-metal",
        heading: "Match the colour grade to the setting",
        body: [
          "Colour grading happens face down, in a neutral tray, under standardised light, against master stones. It is a laboratory comparison designed to be repeatable — it is not a description of how the diamond looks on a hand.",
          "Once a stone is set, the metal around it drives the apparent colour more than a grade or two does. A warm setting lends its colour to the stone, so in yellow or rose gold an H, I or J reads as white and a D is money spent on something nobody will see. In platinum or white gold the contrast is less forgiving, and G to I is the sensible range.",
          "Fluorescence is the related lever, and the one most buyers avoid for no reason. In an I or J, faint to medium blue fluorescence can make a stone look slightly whiter in daylight, and such stones usually sell a little cheaper. It is worth asking for specifically — just judge the stone in daylight rather than judging the word on the report.",
        ],
        callout: {
          label: "One caveat",
          heading: "Strong fluorescence in a very high colour",
          body: "In D through F, strong or very strong blue occasionally gives a hazy, oily look in sunlight. It is uncommon, and it is a reason to see the stone rather than a reason to rule the category out.",
          href: "/glossary#fluorescence",
          cta: "Fluorescence, in the glossary",
        },
      },
      {
        id: "durability",
        heading: "The durability questions no grade answers",
        body: [
          "A grading report describes a loose stone. It says nothing about how that stone will survive twenty years of doors, handles, gym equipment and washing-up — and an engagement ring takes more knocks than any other piece of jewellery a person owns.",
          "Three things are worth asking about before you commit, and none of them appear as a grade. First, girdle thickness: Extremely Thin is fragile at the setting bench and afterwards, and Very Thick parks weight in a rim you cannot see. Medium to Slightly Thick is the comfortable range.",
          "Second, on any pointed shape — pear, marquise, heart — ask specifically about the girdle at the points, and have the setter protect them. Third, ask whether any feather reaches the surface, and where it sits. A large surface-reaching feather under a claw is a question about durability, not about clarity, and the grade will not flag it.",
        ],
        points: [
          {
            term: "Girdle thickness",
            detail: "Medium to Slightly Thick. Avoid Extremely Thin, particularly on pointed shapes.",
          },
          {
            term: "Surface-reaching feathers",
            detail:
              "Ask where they sit. Under a claw or at a point is a different conversation from tucked at the girdle.",
          },
          {
            term: "Knots and cavities",
            detail:
              "Both break the surface. A knot can catch a fingernail; a cavity traps dirt and dulls the stone between cleanings.",
          },
          {
            term: "Culet",
            detail:
              "Should read None on a modern stone. Medium or larger can show through the table as a grey dot.",
          },
        ],
      },
      {
        id: "natural-or-lab",
        heading: "Natural or lab-grown",
        body: [
          "They are the same material. A lab-grown diamond is diamond by every physical and optical test, it is graded on the same scales by the same laboratories, and it is inscribed as laboratory-grown on the girdle. What differs is origin, scarcity and price.",
          "The practical consequence is straightforward: the same budget buys a substantially larger or higher-graded stone lab-grown. If size is what the wearer wants, that is the honest route to it. If the origin of the stone is part of what the piece means, that is a reason to buy natural, and it is a perfectly good one.",
          "What we would not do is choose between them on resale. Neither is bought back at anything close to retail, and lab-grown prices in particular have fallen a long way as growing capacity has expanded. Buy the stone you want to look at.",
        ],
        callout: {
          label: "Both, side by side",
          heading: "Filter either catalogue to the same specification",
          body: "Every listing carries the same figures — cut, polish, symmetry, fluorescence, table, depth and measurements — so the two can be compared on like terms.",
          href: "/natural-diamonds",
          cta: "Browse natural stock",
        },
      },
    ],
    spec: {
      heading: "A specification that works",
      intro:
        "A sensible engagement stone for daily wear, written as ranges rather than single grades. Adjust one line at a time, and spend what you save further up the list.",
      rows: [
        {
          label: "Shape",
          value: "The wearer's, without compromise",
          note: "The one decision that cannot be traded against another.",
        },
        {
          label: "Cut",
          value: "Excellent or Ideal (round)",
          note: "On a fancy shape: depth and table in range, symmetry Excellent or Very Good, and eyes on the stone.",
        },
        {
          label: "Clarity",
          value: "VS2 – SI1, eye-clean",
          note: "Step cuts one to two grades higher — an emerald hides nothing.",
        },
        {
          label: "Colour",
          value: "G – I in white metal, H – J in yellow",
          note: "The setting metal does more for apparent colour than a grade does.",
        },
        {
          label: "Carat",
          value: "Just under a magic size",
          note: "0.92 rather than 1.00, 1.42 rather than 1.50. Judge the size in millimetres.",
        },
        {
          label: "Fluorescence",
          value: "None to Medium",
          note: "Faint to medium blue can help an I or J, and usually costs less. See the stone in daylight.",
        },
        {
          label: "Girdle",
          value: "Medium to Slightly Thick",
          note: "A durability figure, not an optical one. Check the points on pointed shapes.",
        },
        {
          label: "Report",
          value: "GIA or IGI, inscription checked",
          note: "Compare GIA with GIA and IGI with IGI — not across the two.",
        },
      ],
      href: "/natural-diamonds?clarity=VS2,SI1&color=G,H,I",
      cta: "See stones in this range",
    },
    faq: [
      {
        question: "How much should an engagement ring cost?",
        answer:
          "There is no rule, and the ones you have heard — two months' salary and its variants — began as advertising. Set a figure you are comfortable with, then use the spending order in this guide to get the most stone for it. A well-cut 0.90 ct at G/VS2 will outshine a poorly cut 1.20 ct at D/VVS1 every day of the week.",
      },
      {
        question: "Is a lab-grown diamond a real diamond?",
        answer:
          "Yes. It is the same crystal, the same hardness and the same optical behaviour, graded by the same laboratories on the same scales. The report states it is laboratory-grown and the girdle carries a matching inscription. The difference is how it was formed, what it costs, and how scarce it is.",
      },
      {
        question: "What clarity grade is safe to buy without seeing the stone?",
        answer:
          "For a brilliant cut, VS1 and VS2 are almost always eye-clean, and SI1 usually is. For a step cut such as emerald or Asscher, move up: VS1 or better. But 'usually' is not a guarantee — clarity is graded at 10×, eye-clean is not graded at all, so ask us to confirm it on the specific stone.",
      },
      {
        question: "Does the colour grade matter less in yellow gold?",
        answer:
          "Considerably less. A warm setting lends its colour to the stone, so H, I and J read as white in yellow or rose gold while a D would show no visible benefit. In platinum and white gold the contrast is sharper, and G to I is the range we would work in.",
      },
      {
        question: "Should I buy the stone and the setting together?",
        answer:
          "Buy the stone loose. It is the only way to examine it from every angle, weigh it, and check the inscription against the report before a setter touches it. Choosing the setting afterwards also means the mount is built around the actual measurements rather than a nominal weight.",
      },
    ],
    terms: [
      "cut-grade",
      "eye-clean",
      "fluorescence",
      "girdle-thickness",
      "magic-sizes",
      "bow-tie",
      "step-cut",
      "lab-grown",
    ],
    related: [
      "a-first-diamond-on-a-set-budget",
      "buying-a-diamond-as-a-surprise",
      "investment-grade-vs-wear-grade",
    ],
  },

  // ——————————————————————————————————————————————————————————————
  {
    slug: "investment-grade-vs-wear-grade",
    title: "Investment-grade vs wear-grade",
    metaTitle: "Investment-grade vs wear-grade diamonds: what the difference really is",
    occasion: "Value & rarity",
    description:
      "What the trade means by investment-grade, why almost every diamond sold is wear-grade, the costs nobody quotes, and how to buy the rarer end honestly if that is genuinely what you want.",
    standfirst:
      "Two buyers can ask for a two-carat diamond and want completely different objects. One wants the most beautiful stone their budget reaches. The other wants the scarcest thing their budget reaches. Those are different purchases, and conflating them is how people overpay.",
    readingMinutes: 10,
    sections: [
      {
        id: "two-purchases",
        heading: "Two different purchases",
        body: [
          "Wear-grade means a diamond bought to be looked at. Every grade on it is chosen for what it contributes to the stone's appearance on a hand, in daylight, at arm's length — and every grade beyond that point is treated as waste.",
          "Investment-grade is trade shorthand for the opposite logic: grades chosen for scarcity, whether or not the eye can tell. A D colour is not visibly whiter than an F once set. An IF is not visibly cleaner than a VS1 to anyone without a loupe. They cost more because fewer exist, not because they look better.",
          "We should be blunt about the word investment, because the trade is not always. Diamonds pay nothing while you hold them, there is no exchange to sell them on, and the gap between what a retail buyer pays and what a dealer will pay is wide. Historically only a very narrow band of exceptional stones has held value well. Nothing on this page is financial advice, and we do not sell stones as an investment product.",
        ],
        callout: {
          label: "Plainly",
          heading: "Almost everyone reading this should buy wear-grade",
          body: "If the stone is going into a ring that will be worn, wear-grade is not the compromise option — it is the correct one. Investment-grade logic only makes sense if scarcity itself is what you are buying.",
        },
      },
      {
        id: "wear-grade",
        heading: "What wear-grade looks like",
        body: [
          "A wear-grade specification is built by asking, for each grade, whether the next step up changes what anyone will see. Usually it does not, and the budget moves to where it does.",
          "Cut is the exception, and it is where wear-grade buyers should be least willing to compromise. It is the only C that changes how much light comes back out of the stone, and no amount of colour or clarity compensates for a stone that is dull. Everything else is bought to a threshold: clarity to eye-clean, colour to the metal, carat to just under a magic size.",
          "The result is a stone that will look, at arm's length, almost identical to one costing a great deal more — and that is the entire point of buying this way.",
        ],
        points: [
          {
            term: "Cut",
            detail: "The one grade to max. Excellent or Ideal on a round; verified by eye on a fancy.",
          },
          {
            term: "Clarity",
            detail: "To eye-clean and no further. Usually VS2 or SI1 in a brilliant cut.",
          },
          {
            term: "Colour",
            detail: "To the setting metal. G–I white, H–J yellow.",
          },
          {
            term: "Fluorescence",
            detail: "None through Medium. A faintly fluorescent I or J is often the best value on the table.",
          },
          {
            term: "Size",
            detail: "Just under the magic weights, judged in millimetres.",
          },
        ],
      },
      {
        id: "what-is-scarce",
        heading: "What the market actually treats as scarce",
        body: [
          "If scarcity is what you are buying, it is worth knowing where scarcity genuinely sits rather than assuming high grades in general are rare. They are not: the mid-market is full of good stones.",
          "Size is the strongest single factor. Large natural rough is genuinely uncommon and the per-carat rate steps up hard with weight, which is why a 3.00 ct costs far more than three 1.00 ct stones of the same quality. Beyond size, the market pays for the top of each scale in combination — a D IF is a different object from a D VS1 — and for stones with an exceptional make rather than merely a good grade.",
          "Fancy colours follow their own rules entirely: pure, strongly saturated hues in pinks, blues and greens are the rarest diamonds there are, and are priced accordingly. They are also the hardest category for a private buyer to value, and the one where expert help matters most.",
        ],
        points: [
          {
            term: "Weight",
            detail:
              "The steps at 2, 3 and 5 carats are much larger than the steps below them. Size is the least substitutable quality.",
          },
          {
            term: "Top-of-scale combinations",
            detail: "D through F with IF to VVS, together, not one or the other.",
          },
          {
            term: "Natural origin, GIA report",
            detail:
              "In this part of the market GIA is close to a requirement, and a report from elsewhere narrows the buyer pool.",
          },
          {
            term: "No fluorescence",
            detail:
              "Rational or not, the high-colour end of the market discounts fluorescence — the opposite of the wear-grade calculus.",
          },
          {
            term: "Fancy colour",
            detail: "Pure hue, high saturation, no modifying overtone. A category of its own.",
          },
          {
            term: "Provenance",
            detail:
              "Documented origin, where it is genuinely available and genuinely documented rather than asserted.",
          },
        ],
      },
      {
        id: "costs",
        heading: "The costs nobody quotes",
        body: [
          "Before buying at the rare end, it is worth putting numbers on the frictions, because they are what turn a stone that appreciated on paper into a loss in practice.",
          "The spread is the big one. A retail buyer pays a retail price and sells at a wholesale bid, and the gap between them is not small. That gap has to be recovered before any appreciation is real. Then there is liquidity: there is no exchange, no daily price, and selling means finding a specific buyer for a specific stone, which takes time and usually a discount for speed.",
          "Add insurance, safe storage, and the fact that the stone produces no income while you hold it. And note one risk specific to diamonds: grading is expert opinion, not measurement, so a stone regraded years later may not receive exactly the same grades — which at the top of the scale can move the value materially.",
        ],
        points: [
          {
            term: "Retail-to-wholesale spread",
            detail: "Paid on the way in, recovered only if the stone appreciates past it.",
          },
          {
            term: "Liquidity",
            detail: "No exchange and no daily price. A quick sale is a discounted sale.",
          },
          {
            term: "Holding costs",
            detail: "Insurance and storage, against no income of any kind.",
          },
          {
            term: "Regrading risk",
            detail: "Grades are opinions. At D/IF, a single step matters a great deal.",
          },
        ],
      },
      {
        id: "if-you-still-want-it",
        heading: "If the rarer stone is what you want",
        body: [
          "There are perfectly good reasons to buy at the top of the scales that have nothing to do with returns — the pleasure of owning something genuinely uncommon, or a stone intended to be handed down. If that is the purchase, buy it deliberately.",
          "Insist on a GIA report for a natural stone, and check the inscription against it. Ask for the stone's full proportions rather than the summary grades, and for an ASET or Idealscope image: at this level you are paying for an exceptional make, so verify that you are getting one. Buy loose, keep the paperwork, and insure it on a current valuation.",
          "And be honest with yourself about which of the two purchases this is. Most people who say investment mean heirloom, and heirloom is a much better reason.",
        ],
        callout: {
          label: "We can help either way",
          heading: "Tell us which purchase this is",
          body: "The desk sources both ends — a bright, sensible daily-wear stone, or a specific rarity to a written specification. Saying which changes everything about what we go looking for.",
          href: "/contact#enquiry",
          cta: "Talk to the desk",
        },
      },
    ],
    spec: {
      heading: "The two specifications side by side",
      intro:
        "Same question, two answers, depending on what the stone is for. The wear-grade column is the right one for a piece that will be worn.",
      columns: ["Wear-grade", "Rarity-led"],
      rows: [
        {
          label: "Cut",
          value: "Excellent / Ideal",
          alt: "Excellent / Ideal, plus ASET",
          note: "The one line both columns agree on. At the rare end, verify the make with an image.",
        },
        {
          label: "Clarity",
          value: "VS2 – SI1, eye-clean",
          alt: "IF – VVS2",
          note: "Eye-clean costs a fraction of loupe-clean and looks the same at arm's length.",
        },
        {
          label: "Colour",
          value: "G – J, matched to metal",
          alt: "D – F",
          note: "D is not visibly whiter than F once set. It is rarer, which is a different claim.",
        },
        {
          label: "Carat",
          value: "Just under a magic size",
          alt: "Over the magic size, 2 ct and up",
          note: "The two columns want opposite things here: one avoids the step, one buys it.",
        },
        {
          label: "Fluorescence",
          value: "None – Medium",
          alt: "None",
          note: "The wear-grade buyer can profit from a discount the rarity market applies.",
        },
        {
          label: "Report",
          value: "GIA or IGI",
          alt: "GIA, natural",
          note: "At the rare end, a non-GIA report narrows the buyer pool considerably.",
        },
        {
          label: "Origin",
          value: "Natural or lab-grown",
          alt: "Natural, documented where possible",
          note: "Lab-grown is an excellent wear-grade buy and is not bought for scarcity.",
        },
      ],
      href: "/natural-diamonds?color=D,E,F&clarity=IF,VVS1,VVS2",
      cta: "See the top of the scales in stock",
    },
    faq: [
      {
        question: "Are diamonds a good investment?",
        answer:
          "We would not present them as one, and nothing here is financial advice. They generate no income, there is no exchange to sell them on, and the gap between retail and wholesale has to be recovered before any gain is real. Historically only a narrow band of exceptional stones has held value well. Buy a diamond because you want the diamond.",
      },
      {
        question: "Do lab-grown diamonds hold their value?",
        answer:
          "Lab-grown prices have fallen substantially as growing capacity has expanded, and the resale market for them is thin. That makes lab-grown an excellent way to buy a large, bright stone for a given budget, and a poor way to store value. Those are two separate facts and both are worth knowing before you choose.",
      },
      {
        question: "Is a D colour visibly whiter than an F?",
        answer:
          "Not once set, and not to an unaided eye. The distinction is made face down, in a neutral tray, against master stones, under standardised light. D commands more because fewer stones grade there — a statement about scarcity, not about appearance.",
      },
      {
        question: "What does 'investment-grade' actually mean?",
        answer:
          "It is trade shorthand, not a defined standard, and no laboratory certifies it. It generally points at large natural stones at the top of the colour and clarity scales with a GIA report, an exceptional make and no fluorescence. Because the term means whatever the seller wants it to, treat it as a prompt to ask for the specific grades.",
      },
      {
        question: "Should I insure a diamond, and at what value?",
        answer:
          "Yes, on a current valuation rather than the purchase price, and revisit it every few years. Keep the grading report and the inscription number with the policy — identifying a specific stone after a loss is far easier with both.",
      },
    ],
    terms: [
      "magic-sizes",
      "price-per-carat",
      "rapaport",
      "type-iia",
      "fancy-colour",
      "provenance",
      "grading-report",
      "make",
    ],
    related: [
      "choosing-an-engagement-ring-stone",
      "anniversary-and-milestone-stones",
      "a-first-diamond-on-a-set-budget",
    ],
  },

  // ——————————————————————————————————————————————————————————————
  {
    slug: "a-first-diamond-on-a-set-budget",
    title: "A first diamond, on a set budget",
    metaTitle: "Buying your first diamond on a budget: the order to spend in",
    occasion: "First purchase",
    description:
      "How to get the most visible diamond for a fixed figure: the three numbers to decide before you shop, the order to spend in, where first-time buyers overspend, and how to compare two quotes properly.",
    standfirst:
      "A fixed budget is not a constraint on buying well — it is the thing that makes buying well possible, because it forces every grade to justify itself. This is the method we would use with our own money.",
    readingMinutes: 8,
    sections: [
      {
        id: "three-numbers",
        heading: "Decide three numbers first",
        body: [
          "Before looking at a single stone, fix three things: the most you will spend, the smallest size you would be happy with, and the date you need it by. Every subsequent decision is a trade between those three, and if they are not written down the budget drifts upward one small step at a time.",
          "Be realistic about the size figure in millimetres rather than carats. A 1.00 ct round is about 6.5 mm across; a 0.90 ct is about 6.3 mm. If what you actually want is a stone that reads as substantial on a hand, the millimetre figure is the honest target and the carat figure is a proxy for it.",
          "The date matters more than people expect. Sourcing a specific stone to a specification takes time, and buying under deadline pressure is how you end up paying retail for whatever happens to be in the case.",
        ],
      },
      {
        id: "spend-order",
        heading: "The order to spend in",
        body: [
          "Spend on cut until it is excellent, spend on clarity until the stone is clean to the eye, spend on colour until it looks white in the metal you have chosen, and put everything left into size. In that order, every time.",
          "The reason is that only one of the four Cs changes how much light the stone gives back, and that is cut. A dull diamond with a flawless clarity grade is a dull diamond. Meanwhile clarity and colour both have a threshold past which additional spending buys something genuinely invisible, and the entire craft of buying well is finding that threshold and stopping there.",
          "Size is last not because it does not matter — it is usually what the wearer notices first — but because it is the most expensive per unit of visible difference, and because cut quality partly substitutes for it. A well-cut stone faces up larger and brighter than a heavier one cut for weight.",
        ],
        callout: {
          label: "The cheapest size upgrade there is",
          heading: "Buy just under the magic weights",
          body: "Price steps up at 0.50, 0.75, 1.00, 1.50 and 2.00 ct because demand clusters there. A 1.42 ct is about 2% narrower than a 1.50 ct and appreciably cheaper. Nobody has ever noticed the difference across a table.",
          href: "/carat-guide",
          cta: "Size against weight, by shape",
        },
      },
      {
        id: "overspending",
        heading: "Where first-time buyers overspend",
        body: [
          "Four places, consistently. Clarity above eye-clean is the largest: the scale is defined at 10× magnification, so grades above VS are paying for something that requires equipment to see. Colour above G in white metal, or above H in yellow, is the second.",
          "The third is landing exactly on a round carat weight. The fourth is the premium attached to a name rather than to the stone — branded cuts and house grading systems that cannot be compared with anything else. A stone with an independent GIA or IGI report can be compared with every other stone in the world; one with a proprietary grade cannot.",
          "There is a fifth, subtler one: buying a stone that grades well but was never seen. Milkiness from dense clouds or internal graining does not always appear on the plot, sometimes only as a comment. Ask for a video before committing to any stone bought remotely.",
        ],
        points: [
          {
            term: "Clarity above eye-clean",
            detail: "Graded at 10×. Above VS you are buying loupe performance.",
          },
          {
            term: "Colour above the metal's needs",
            detail: "G in white, H in yellow. Beyond that the setting hides the difference.",
          },
          {
            term: "Exactly on a magic size",
            detail: "Cross the step and the per-carat rate rises for every carat, not just the last point.",
          },
          {
            term: "Proprietary grading",
            detail: "A house grade cannot be compared with anything. Insist on GIA or IGI.",
          },
          {
            term: "Never seeing the stone",
            detail: "Milkiness and bow-ties are not graded. Ask for a video, and for an ASET where it exists.",
          },
        ],
      },
      {
        id: "comparing-quotes",
        heading: "How to compare two quotes properly",
        body: [
          "Convert both to a price per carat. That is how the trade quotes, and it is the only way to compare stones of different weights on the same basis — a 1.20 ct at one rate and a 1.05 ct at another are not comparable until you divide.",
          "Then check that you are comparing like with like. Same laboratory, because grading is not perfectly interchangeable across laboratories. Same shape and similar proportions. Same fluorescence. And check the measurements, not just the weight — two 1.00 ct stones can differ by a third of a millimetre across, which is a visible difference you would otherwise pay for blindly.",
          "Finally, ask both sellers the same three questions: is it eye-clean, is there a video, and what is the girdle thickness. The answers, and how readily they come, will tell you a good deal about who you are dealing with.",
        ],
      },
    ],
    spec: {
      heading: "A first stone, specified",
      intro:
        "Built for maximum visible quality per pound. Every line is a threshold rather than a maximum — reach it, then stop.",
      rows: [
        {
          label: "Origin",
          value: "Lab-grown, if size is the priority",
          note: "The same budget reaches a larger or higher-graded stone. Note that our lab-grown white stock runs D–F, so there the colour line moves up rather than the price coming down.",
        },
        {
          label: "Shape",
          value: "Round, or an elongated fancy for more spread",
          note: "Round is the easiest to buy well remotely. Oval and pear face up larger per carat.",
        },
        {
          label: "Cut",
          value: "Excellent or Ideal",
          note: "Never the line to economise on. It is the only C that changes light return.",
        },
        {
          label: "Clarity",
          value: "SI1, confirmed eye-clean",
          note: "VS2 if you cannot see the stone or a video first. Step cuts higher again.",
        },
        {
          label: "Colour",
          value: "H – J",
          note: "In yellow or rose gold, J is comfortable. In platinum, work up to G or H.",
        },
        {
          label: "Carat",
          value: "0.90, 1.40, 1.90",
          note: "Just under each step. Check the millimetres — that is what shows.",
        },
        {
          label: "Fluorescence",
          value: "Faint to Medium blue",
          note: "In an I or J it can help the colour, and it usually costs less. Judge in daylight.",
        },
        {
          label: "Report",
          value: "IGI or GIA — never a house grade",
          note: "An independent report is what makes comparison across sellers possible at all.",
        },
      ],
      href: "/natural-diamonds?color=H,I,J&clarity=VS1,VS2,SI1",
      cta: "See natural stones in this range",
    },
    faq: [
      {
        question: "What is the cheapest way to get a diamond that looks big?",
        answer:
          "Three levers, in order. Buy lab-grown, where the same budget reaches a larger stone. Choose an elongated shape — oval, pear or marquise — which faces up larger than a round of the same weight. And buy just under a magic size. Keep the cut grade high throughout: a well-cut stone looks larger than a deep one of the same weight.",
      },
      {
        question: "Is SI1 clarity a mistake?",
        answer:
          "Not at all, provided you confirm the specific stone is eye-clean. SI1 is where a great deal of the best value in the market sits. The caveat is that the grade alone does not guarantee it — the position and colour of the inclusion decide, so read the plot or ask us to check.",
      },
      {
        question: "How much does cut actually change the price?",
        answer:
          "Enough to notice, and it is the one place we would pay it without hesitation. An Excellent cut commands a premium because it shows the stone's other qualities at their best — the colour you paid for looks whiter and the weight you paid for faces up in full. Very Good is a legitimate saving; below Good, the saving rarely covers the light lost.",
      },
      {
        question: "Can I trust grades from a smaller laboratory?",
        answer:
          "Grading is expert opinion, and consistency varies between laboratories. GIA and IGI are the two we work with, and the practical rule is never to compare a stone graded by one laboratory with a stone graded by another on grades alone. A stone with a report from neither is very hard to value.",
      },
    ],
    terms: [
      "eye-clean",
      "price-per-carat",
      "magic-sizes",
      "spread",
      "milky",
      "cut-grade",
      "measurements",
      "lab-grown",
    ],
    related: [
      "choosing-an-engagement-ring-stone",
      "investment-grade-vs-wear-grade",
      "buying-a-diamond-as-a-surprise",
    ],
  },

  // ——————————————————————————————————————————————————————————————
  {
    slug: "anniversary-and-milestone-stones",
    title: "Anniversary and milestone stones",
    metaTitle: "Anniversary diamond guide: upgrading a stone, bands and matching",
    occasion: "Anniversary",
    description:
      "Buying for an anniversary or milestone: whether to upgrade the centre stone, add a band, or commission something new — and how to match a new diamond to one bought years ago.",
    standfirst:
      "A milestone purchase is rarely a blank page. There is usually a ring already, bought years ago under different circumstances, and the new stone has to live alongside it. That constraint is the whole job.",
    readingMinutes: 7,
    sections: [
      {
        id: "which-purchase",
        heading: "Decide which of the three this is",
        body: [
          "Upgrading the centre stone, adding a band, or commissioning a separate piece are three quite different projects, and they want different stones. It is worth being explicit about which one you are doing before looking at anything.",
          "Upgrading replaces the diamond in a ring that already means something. The advantage is that the existing setting tells you exactly what to buy — its dimensions, its metal, and what the wearer has liked for years. The risk is sentimental: for some people the original stone is the point, and a larger replacement is a loss rather than a gift.",
          "Adding a band sidesteps that entirely and is the safer choice more often than people expect. A separate piece — studs, a pendant, a right-hand ring — gives the most freedom, because nothing has to match.",
        ],
        points: [
          {
            term: "Upgrade the centre",
            detail:
              "Most impact, most risk. Ask first, or keep the original stone and have it reset into something else.",
          },
          {
            term: "Add a band",
            detail:
              "Sits beside what is already there. Wants calibrated stones matched to the existing ring, not a single centre.",
          },
          {
            term: "A separate piece",
            detail:
              "No matching constraints at all. The place to buy a shape or colour the original ring could never take.",
          },
        ],
      },
      {
        id: "upgrading",
        heading: "Upgrading a centre stone",
        body: [
          "Work in millimetres from the start. The existing head and shank were built around a specific diameter, and a stone more than a little larger means a new setting — which is a perfectly good outcome, but it should be a decision rather than a surprise at the bench.",
          "Match the colour to the ring, not to an abstract standard. If the original stone is an I in white gold, a new G will look correct while a D may read as slightly cold against the melee around it. The accent stones set years ago are part of what the new centre is being judged against.",
          "Shape is where to be careful. A jump in size within the same shape reads as an upgrade; a change of shape reads as a different ring, which may be exactly right or exactly wrong. If the setting is being remade anyway, the shape question reopens properly.",
        ],
        callout: {
          label: "Worth asking",
          heading: "Keep the original stone",
          body: "Resetting the first diamond into a pendant or a pair of studs is often the difference between an upgrade that lands and one that quietly disappoints. Budget for it from the start.",
        },
      },
      {
        id: "bands",
        heading: "Eternity and anniversary bands",
        body: [
          "A band is bought as a set of stones rather than as a stone. What matters is that they match each other and the ring they will sit beside — consistent colour, consistent clarity, and consistent size, which the trade calls calibrated.",
          "Buy the whole set at once, from one parcel. Matching melee to an existing band years later is genuinely difficult, and a single stone that is a shade warmer or a fraction smaller is visible precisely because it sits in a row.",
          "For a full eternity band, be aware that it cannot be resized later, and stones on the underside take the worst of the wear. A half-eternity keeps the resizing option and puts the metal where the knocks are — for a ring meant to be worn daily, it is usually the better buy.",
        ],
        points: [
          {
            term: "Calibrated stones",
            detail: "Cut to consistent millimetre sizes so the row reads as even.",
          },
          {
            term: "One parcel, one purchase",
            detail: "Colour and clarity matched across the set. Adding to it later rarely matches cleanly.",
          },
          {
            term: "Half against full eternity",
            detail: "A half can be resized and wears better. A full is uninterrupted, and permanent in its size.",
          },
          {
            term: "Match the original",
            detail:
              "Take the existing ring's colour grade as the target, not the top of the scale.",
          },
        ],
      },
      {
        id: "matching",
        heading: "Matching a stone bought years ago",
        body: [
          "If the original ring has no paperwork — common enough — the new stone is matched by eye rather than by grade, and that means seeing them together. Send us the ring or clear photographs in daylight, and we will work from the stone rather than from an assumed grade.",
          "Where paperwork does exist, read it with a little scepticism about age. Grading standards and laboratory practice have shifted over the decades, and a report from a different laboratory was never directly comparable in the first place. Treat an old grade as a strong hint, not as a measurement.",
          "One practical point: fluorescence should match across stones that sit together. A fluorescent stone beside a non-fluorescent one can look subtly different in daylight, and it is the kind of mismatch nobody can name but everybody notices.",
        ],
      },
    ],
    spec: {
      heading: "What to ask for",
      intro:
        "The specification for a milestone stone follows the ring it joins. These are the lines to fix before looking.",
      rows: [
        {
          label: "Target size",
          value: "In millimetres, from the existing setting",
          note: "Decides whether the current head can be reused or a new mount is needed.",
        },
        {
          label: "Shape",
          value: "Usually the same as the original",
          note: "Changing shape reads as a different ring. Reopen it only if the setting is being remade.",
        },
        {
          label: "Colour",
          value: "Matched to the existing stone and melee",
          note: "Match the ring, not the top of the scale. A cold centre among warm accents looks wrong.",
        },
        {
          label: "Clarity",
          value: "Eye-clean at the ring's own viewing distance",
          note: "A milestone stone is looked at more closely than most. VS2 upward is comfortable.",
        },
        {
          label: "Cut",
          value: "Excellent or Ideal",
          note: "If the upgrade is to read as an upgrade, brightness does more work than weight.",
        },
        {
          label: "Fluorescence",
          value: "Matched to the original",
          note: "Mismatched fluorescence in adjacent stones shows in daylight.",
        },
        {
          label: "For a band",
          value: "Calibrated melee, one parcel",
          note: "Matched across the set and bought together. Half-eternity if it will be worn daily.",
        },
      ],
      href: "/natural-diamonds?clarity=VS1,VS2&color=F,G,H",
      cta: "See matched-quality stock",
    },
    faq: [
      {
        question: "Should I upgrade the original engagement stone or keep it?",
        answer:
          "Ask, if you possibly can — this is the one area where a surprise goes wrong more often than it goes right. Where asking is not an option, the safer route is to keep the original stone and have it reset into a pendant or studs alongside the new centre. Nothing is lost that way.",
      },
      {
        question: "Can I add stones to an existing eternity band later?",
        answer:
          "It is difficult to do well. Melee is bought in matched parcels, and a stone sourced years later will rarely match the colour and cut of the original row closely enough to be invisible. Buy the full set at once wherever possible.",
      },
      {
        question: "How do I match a new diamond to one with no certificate?",
        answer:
          "By eye, together, in daylight. Send us the ring or good daylight photographs and we will match the new stone against the actual diamond rather than against an assumed grade. Where the original does have a report, treat an old grade as a hint — standards and laboratories have shifted over the years.",
      },
      {
        question: "Is a full eternity band a bad idea?",
        answer:
          "Not bad, but permanent: it cannot be resized, and the stones on the underside take the hardest wear. For a ring worn every day a half-eternity is usually the more practical buy, and it keeps the resizing option open for later life.",
      },
    ],
    terms: ["melee", "parcel", "fluorescence", "measurements", "color-grade", "eye-clean"],
    related: [
      "matched-pairs-for-earrings",
      "choosing-an-engagement-ring-stone",
      "investment-grade-vs-wear-grade",
    ],
  },

  // ——————————————————————————————————————————————————————————————
  {
    slug: "matched-pairs-for-earrings",
    title: "Matched pairs for earrings",
    metaTitle: "Buying a matched pair of diamonds for stud earrings",
    occasion: "Earrings",
    description:
      "How diamond pairs are matched for studs and drops: the tolerances that matter, why fluorescence has to match, and where a pair can safely be graded lower than a ring stone.",
    standfirst:
      "A pair is not two diamonds — it is one purchase with two halves, and it is judged on how well they agree. Buying the halves separately, at different times or from different sellers, is the single most common way this goes wrong.",
    readingMinutes: 6,
    sections: [
      {
        id: "bought-as-a-pair",
        heading: "A pair is bought as a pair",
        body: [
          "Two stones that are individually excellent can make a poor pair. What the eye picks up across a face is difference — one slightly larger, one slightly warmer, one a touch brighter — and it does so at a level of sensitivity that would never register on a single stone.",
          "This is why pairs are sourced as pairs, matched at the desk against each other rather than each against a specification. A well-matched pair of I colour stones will look better than a mismatched pair where one is an H, and it will usually cost less.",
          "Practically, it means deciding the pair now rather than buying one and matching later. Matching to an existing stone months afterwards means searching a much smaller pool, and typically paying more for a worse result.",
        ],
      },
      {
        id: "tolerances",
        heading: "The tolerances that matter",
        body: [
          "Weight should agree closely — within a couple of points on a pair under a carat total — but the figure that actually matters is millimetres, because that is what is visible. Matched diameters within about a tenth of a millimetre is the standard to ask for.",
          "Colour and clarity should be the same grade, not merely adjacent grades. Cut and make should match too: two stones with the same cut grade can still differ in how they behave if one has a noticeably different table or crown angle, and a pair where one sparkles more than the other is immediately obvious.",
          "Fluorescence is the tolerance most often overlooked, and the one that produces the strangest results. A fluorescent stone beside a non-fluorescent one can look faintly different in daylight while looking identical indoors — so match it, or specify None for both.",
        ],
        points: [
          {
            term: "Diameter",
            detail: "Within about 0.10 mm. This is the one the eye actually measures.",
          },
          { term: "Weight", detail: "Within a couple of points, which usually follows from diameter." },
          { term: "Colour", detail: "The same grade. Adjacent grades can show across a face." },
          { term: "Clarity", detail: "The same grade, and both eye-clean at conversational distance." },
          {
            term: "Cut and make",
            detail: "Same grade and similar proportions, so both stones behave the same way in light.",
          },
          {
            term: "Fluorescence",
            detail: "Matched, or None for both. Mismatched fluorescence shows in daylight only.",
          },
        ],
      },
      {
        id: "where-to-save",
        heading: "Where a pair can safely be graded lower",
        body: [
          "Earrings are seen from a distance and at an angle, never held up and inspected the way a ring on a hand is. They also sit against skin and hair rather than against a white metal shank, and there is no second stone alongside for comparison. All of that makes them more forgiving than a ring stone.",
          "Clarity is the clearest saving: SI1 and SI2 stones that are clean at conversational distance are perfectly good in studs, and would be a harder call in a solitaire. Colour can drop a grade or two for the same reason.",
          "Cut, as ever, is not the place to economise — earrings catch the light while someone moves, which is exactly what a well-cut stone does best. And because a pair is two stones, the total weight reads smaller than the same weight in one: a pair of 0.50 ct studs is a one-carat purchase that looks like two half-carat stones, which is the point.",
        ],
        callout: {
          label: "Sizing studs",
          heading: "Total weight is quoted for the pair",
          body: "A one-carat pair means two 0.50 ct stones, about 5.2 mm each. Quote the per-stone weight when you enquire so nobody is comparing a pair against a solitaire by mistake.",
          href: "/carat-guide",
          cta: "Millimetres by carat weight",
        },
      },
      {
        id: "studs-and-drops",
        heading: "Studs and drops want different stones",
        body: [
          "A stud is seen face on, in a fixed position, so brightness and evenness matter most and a round brilliant is hard to beat. Four-claw and three-claw settings show more of the stone; a bezel protects it and reads slightly smaller.",
          "Drops move, which changes the calculus. Movement flatters fancy shapes, and a pear or marquise that might show a faint bow-tie when held still reads as a flash of light when it swings. It also means the stones are seen from more angles, so the make has to be good all the way round.",
          "One practical note for daily wear: earrings are lost more often than any other piece of jewellery. For stones of real value, ask the setter about screw-backs rather than friction backs — the difference in security is substantial and the cost is not.",
        ],
      },
    ],
    spec: {
      heading: "A pair, specified",
      intro:
        "Written for studs worn regularly. Each line is about agreement between the two stones as much as the quality of either.",
      rows: [
        {
          label: "Shape",
          value: "Round brilliant for studs",
          note: "Fancy shapes come into their own in drops, where movement is part of the effect.",
        },
        {
          label: "Per-stone weight",
          value: "0.35 – 0.75 ct each",
          note: "Quote per stone, not total. A 1.00 ct pair is two 0.50 ct stones.",
        },
        {
          label: "Diameter match",
          value: "Within 0.10 mm",
          note: "The figure the eye actually checks across a face.",
        },
        {
          label: "Cut",
          value: "Excellent or Ideal, both stones",
          note: "Earrings catch light in movement. Brightness is most of the effect.",
        },
        {
          label: "Colour",
          value: "G – J, same grade for both",
          note: "Against skin and hair rather than white metal, so more forgiving than a ring.",
        },
        {
          label: "Clarity",
          value: "SI1 – SI2, eye-clean at distance",
          note: "The clearest saving a pair offers. Both stones at the same grade.",
        },
        {
          label: "Fluorescence",
          value: "Matched, or None for both",
          note: "Mismatched fluorescence shows in daylight and nowhere else.",
        },
        {
          label: "Backs",
          value: "Screw-backs for daily wear",
          note: "A setting decision, but the one that most often decides whether the pair survives.",
        },
      ],
      href: "/natural-diamonds?cmin=0.35&cmax=0.8",
      cta: "See stones in pairing sizes",
    },
    faq: [
      {
        question: "What does a 'one carat' pair of studs mean?",
        answer:
          "Total weight across both stones, so two 0.50 ct diamonds of about 5.2 mm each. It is worth stating the per-stone weight when you enquire, because a 1.00 ct solitaire and a 1.00 ct pair are very different objects at very different prices.",
      },
      {
        question: "Can I buy one stone now and match it later?",
        answer:
          "You can, but expect it to be harder and dearer than buying the pair together. Matching to an existing stone means searching a much smaller pool for a specific diameter, colour, clarity and fluorescence — and the result is usually a less convincing match than a pair chosen side by side.",
      },
      {
        question: "Do both stones need their own grading report?",
        answer:
          "For stones of meaningful size, yes — a report each, and the inscriptions checked against them. Smaller stones are often traded as matched parcels rather than individually certified, which is normal practice and not a warning sign at that size.",
      },
      {
        question: "Does fluorescence really matter in earrings?",
        answer:
          "Only in that it should match. A fluorescent stone next to a non-fluorescent one can look subtly different in daylight while looking identical indoors, which is an odd effect to live with. Either match the grade across both stones, or specify None for both.",
      },
    ],
    terms: ["measurements", "fluorescence", "eye-clean", "melee", "parcel", "make"],
    related: [
      "anniversary-and-milestone-stones",
      "a-first-diamond-on-a-set-budget",
      "choosing-an-engagement-ring-stone",
    ],
  },

  // ——————————————————————————————————————————————————————————————
  {
    slug: "buying-a-diamond-as-a-surprise",
    title: "Buying a diamond as a surprise",
    metaTitle: "Buying a diamond as a surprise: what to find out first",
    occasion: "Surprise",
    description:
      "How to buy a diamond without the recipient there: what you genuinely need to know first, how to find it out, and how to structure the purchase so the surprise survives being wrong about something.",
    standfirst:
      "The surprise is the easy part. The hard part is that you are making a taste decision on someone else's behalf, permanently, without being able to ask. This guide is about reducing how much of that decision you actually have to make.",
    readingMinutes: 6,
    sections: [
      {
        id: "what-you-need",
        heading: "What you genuinely need to know",
        body: [
          "Less than most people assume, provided the purchase is structured properly. Four things are worth real effort to establish: the shape they like, the metal they wear, roughly the size they would be comfortable wearing, and how hard they are on their hands.",
          "Ring size matters less than it feels like it should, because almost any ring can be sized afterwards — a full eternity band being the notable exception. Getting the ring size wrong costs a short delay. Getting the shape wrong is not fixable in the same way.",
          "The lifestyle question is the one people skip and then regret. Someone who climbs, gardens, works with their hands or handles equipment daily wants a lower profile setting, protected points, and a girdle that is not Extremely Thin. That constraint changes which stones are suitable more than any grade does.",
        ],
        points: [
          {
            term: "Shape",
            detail: "The one irreversible taste decision. Worth the most effort to get right.",
          },
          {
            term: "Metal",
            detail:
              "Look at what they already wear. It also sets the colour grade you need — warm metal is forgiving.",
          },
          {
            term: "Scale",
            detail: "Do they wear bold jewellery or fine? A stone too large for the wearer is a real problem.",
          },
          {
            term: "Lifestyle",
            detail: "Hands-on work argues for a lower setting, protected points and a sturdier girdle.",
          },
        ],
      },
      {
        id: "finding-out",
        heading: "Finding out without asking",
        body: [
          "Their existing jewellery answers the metal question outright, and usually the scale question too. Photographs on their phone or a saved collection online, if you have honest access to one, answer shape more reliably than anything they have said out loud.",
          "Friends and family are the most useful resource and the biggest risk. Ask one person, not three, and ask someone who can keep it to themselves. A sibling or close friend has usually heard a preference stated directly.",
          "For ring size, borrowing a ring they already wear on the correct finger is the classic method and still the best. Failing that, buy to a common size and budget for resizing — the delay is short and it is far better than guessing the stone.",
        ],
      },
      {
        id: "de-risking",
        heading: "Structuring the purchase so it survives being wrong",
        body: [
          "The strongest move is to separate the two decisions. Buy the loose stone, propose with it — in a simple temporary mount, or in the box with the report — and choose the setting together afterwards. It keeps the surprise entirely intact while handing back every reversible decision.",
          "It also happens to be the better purchase. Buying the diamond loose is how you see exactly what you are paying for, examine it from every angle, and check the inscription against the report before anything is set.",
          "If a finished ring is essential, keep some budget back — enough for resizing and for a setting change — and choose a stone with broad appeal rather than an unusual shape. A round or oval in a classic solitaire is nobody's second choice. And confirm before buying what can be changed afterwards and within what period.",
        ],
        callout: {
          label: "The move we would make",
          heading: "Propose with the loose stone",
          body: "Every stone here is sold loose and comes with its report. Choosing the setting together afterwards removes the only genuinely irreversible risk in a surprise proposal.",
          href: "/contact#enquiry",
          cta: "Talk it through with the desk",
        },
      },
      {
        id: "timing",
        heading: "Timing",
        body: [
          "Allow more time than feels necessary. Sourcing a stone to a specification takes time, setting takes time after that, and sizing can add a further week. Buying under deadline pressure is how people end up paying retail for whatever is in the case rather than the stone they actually wanted.",
          "If the date is fixed and close, the loose-stone route is the answer again: a stone can be sourced and shipped far faster than a finished ring can be made, and the setting then happens on a calm timetable afterwards.",
        ],
      },
    ],
    spec: {
      heading: "What to fix before you buy",
      intro:
        "Decide these, and the rest can safely be decided together afterwards. Every line is chosen to be either low-risk or reversible.",
      rows: [
        {
          label: "Shape",
          value: "Round or oval, unless you know otherwise",
          note: "The broadest appeal of any shape, and the easiest to set into anything later.",
        },
        {
          label: "Buy it",
          value: "Loose, with the report",
          note: "Keeps the setting decision open and lets the stone be examined before it is set.",
        },
        {
          label: "Cut",
          value: "Excellent or Ideal",
          note: "Brightness is what gets noticed in the moment. Never the line to economise on.",
        },
        {
          label: "Clarity",
          value: "VS2, eye-clean",
          note: "A safer choice than SI when the stone is bought without being seen by the recipient.",
        },
        {
          label: "Colour",
          value: "G – H",
          note: "Reads white in either metal, so the setting decision stays genuinely open.",
        },
        {
          label: "Carat",
          value: "Just under a magic size",
          note: "Better value, and no visible difference. Keep the saving for the setting.",
        },
        {
          label: "Held back",
          value: "Budget for sizing and setting",
          note: "The surprise survives almost anything if the reversible decisions are still funded.",
        },
      ],
      href: "/natural-diamonds?clarity=VS1,VS2&color=G,H",
      cta: "See safe-choice stones",
    },
    faq: [
      {
        question: "Can I propose without a ring?",
        answer:
          "Yes, and increasingly people do. Proposing with the loose stone in its box, with the grading report, keeps the gesture intact while leaving the shape of the ring to be chosen together. It is also the better way to buy a diamond, which makes it an unusually easy decision.",
      },
      {
        question: "What if I get the ring size wrong?",
        answer:
          "Most rings can be sized up or down within a reasonable range, so it is a short delay rather than a problem. The exception is a full eternity band, which cannot be resized — another reason a solitaire is the safer surprise.",
      },
      {
        question: "Which shape is the safest guess?",
        answer:
          "Round, then oval. Round brilliants are roughly two thirds of the market and suit almost any setting; ovals face up larger for the weight and have broad appeal. An unusual shape is a strong statement about someone else's taste, made without consulting them.",
      },
      {
        question: "How long should I allow?",
        answer:
          "For a finished ring, several weeks is comfortable: sourcing the stone, setting it, then sizing if needed. If the date is close, buy the stone loose — it can be sourced and delivered much faster, and the setting then happens without pressure.",
      },
    ],
    terms: ["loose-stone", "grading-report", "eye-clean", "girdle-thickness", "magic-sizes"],
    related: [
      "choosing-an-engagement-ring-stone",
      "a-first-diamond-on-a-set-budget",
      "anniversary-and-milestone-stones",
    ],
  },
];

export const GUIDE_BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));

export function findGuide(slug: string): Guide | undefined {
  return GUIDE_BY_SLUG.get(slug);
}

/** Resolves `related` slugs, dropping the guide itself and anything unknown. */
export function relatedGuides(guide: Guide): Guide[] {
  return guide.related
    .map((slug) => GUIDE_BY_SLUG.get(slug))
    .filter((g): g is Guide => g !== undefined && g.slug !== guide.slug);
}

/** The in-page contents list, derived from the sections so it cannot drift. */
export function guideContents(guide: Guide): { id: string; label: string }[] {
  return [
    ...guide.sections.map((s) => ({ id: s.id, label: s.heading })),
    { id: "specification", label: guide.spec.heading },
    { id: "faq", label: "Frequently asked questions" },
  ];
}
