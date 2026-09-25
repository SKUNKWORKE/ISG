import type { Metadata } from "next";
import Link from "next/link";
import { ColorFinder } from "@/components/color-finder";
import { ColorGradeTable, ColorScale } from "@/components/color-scale";
import { ShapeGlyph } from "@/components/shape-glyph";
import { categoryOf, colorCatalogueHref, colorEnquiryHref, swatchColor } from "@/lib/color-grades";
import { SHAPE_BY_SLUG } from "@/lib/shapes";
import { FEATURED_STONES, isColorGrade } from "@/lib/stones";

export const metadata: Metadata = {
  title: "Diamond color guide: D–Z color chart and the best color grade",
  description:
    "How diamond colour (color) is graded from D to Z, a visual colour chart anchored to real stock, how setting metal and cut change what you see, and which grade gives the best value.",
  alternates: { canonical: "/color-guide" },
};

const CONTENTS = [
  ["grading", "What is diamond color grading?"],
  ["scale", "The color scale"],
  ["appearance", "How color affects appearance"],
  ["price", "Color grade and price"],
  ["other-cs", "How color interacts with the other Cs"],
  ["choosing", "Choosing the right color grade"],
  ["faq", "Frequently asked questions"],
] as const;

const FAQ = [
  {
    question: "What is the best color grade for the money?",
    answer:
      "For most buyers, G to I. Mounted and seen face up, these grades are very hard to tell from colourless, and they cost noticeably less than D to F. In yellow or rose gold, J and sometimes K work just as well.",
  },
  {
    question: "Can you see the difference between a G and an H color diamond?",
    answer:
      "Rarely, once the stone is set and seen face up. Face down under grading light, beside a master stone, a trained eye can. The difference between neighbouring grades is small; it becomes easier to see in larger stones and in step cuts.",
  },
  {
    question: "Does diamond color affect durability?",
    answer:
      "No. Colour describes how a diamond looks, not how it wears. A D and a J diamond are equally hard and equally durable.",
  },
  {
    question: "What is diamond fluorescence and does it affect color?",
    answer:
      "Some diamonds glow, usually blue, under ultraviolet light, including the ultraviolet in daylight. In lower colour grades, medium to strong blue fluorescence can make a stone look slightly whiter. In a small number of higher-grade stones with strong fluorescence, it can look faintly hazy. Reports grade its strength; judge the effect on the stone itself.",
  },
  {
    question: "Do GIA and IGI grade color the same way?",
    answer:
      "Both grade on the same D to Z scale, by comparing the stone with master stones under controlled light, and the letters mean the same thing on either report. How strictly each laboratory applies the scale is debated in the trade, so treat any single grade as a starting point and look at the stone.",
  },
];

const H2 = "font-display text-[clamp(2rem,4.4vw,3.2rem)]";

export default function ColorGuidePage() {
  // This week's featured stones, on the colourless scale, lightest grade first.
  const examples = FEATURED_STONES.filter((s) => isColorGrade(s.color)).sort((a, b) =>
    a.color.localeCompare(b.color),
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* 1. Header */}
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_320px] lg:items-end lg:gap-16">
          <div>
            <h1 className="max-w-[880px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
              Diamond Color Guide
            </h1>
            <p className="measure mt-5 text-ink-muted">
              Colour is one of the four Cs, and in a white diamond it is graded by its absence.
              The less colour a stone shows, the higher it grades and the more it is worth.
            </p>
          </div>
          <nav aria-label="On this page" className="border-t border-hairline pt-5">
            <p className="text-[13px] text-ink-muted">On this page</p>
            <ol className="mt-3 space-y-1.5 text-[15px]">
              {CONTENTS.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-ink"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* 2. Grading */}
      <section id="grading" className="scroll-mt-[96px]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>What is diamond color grading?</h2>
            <p className="measure mt-4 text-ink-muted">
              Laboratories grade white diamonds on a letter scale that runs from D, colourless,
              to Z, a light yellow or brown. It starts at D rather than A so it could not be
              confused with the looser systems it replaced.
            </p>
            <p className="measure mt-4 text-ink-muted">
              A grader sets the stone face down beside a master set of diamonds of known grade
              and compares them under controlled, daylight-balanced lighting. Face down, the
              body colour shows without the distraction of light returning through the top.
            </p>
          </div>

          <div className="rounded-[36px] bg-panel p-8 sm:p-10 lg:self-start">
            <h3 className="font-display text-[26px] leading-tight">Two laboratories, one scale</h3>
            <p className="mt-3 text-[15px] text-ink-muted-panel">
              Natural stones we list are graded predominantly by GIA, lab-grown predominantly by
              IGI. Both use the same D–Z scale and the same letters, so an F on one report sits
              at the same point on the scale as an F on the other, whatever the stone&apos;s
              origin.
            </p>
            <p className="mt-3 text-[15px] text-ink-muted-panel">
              How strictly each laboratory applies the scale is debated in the trade. Read the
              grade as a reliable starting point, then judge the stone.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Scale — the centrepiece */}
      <section id="scale" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-[720px]">
            <h2 className={H2}>The color scale</h2>
            <p className="measure mt-4 text-ink-muted">
              Twenty-three grades in five groups. Each step is small; the groups are where the
              difference becomes something a buyer can see. Dots mark the grades of stones on
              hand this week.
            </p>
          </div>

          <div className="mt-12">
            <ColorScale
              examples={examples}
              stock
              caption="Swatches are illustrative. The steps are exaggerated here so they read on a screen; between neighbouring grades in a real stone the difference is far subtler."
            />
          </div>

          <div className="mt-12">
            <ColorGradeTable />
          </div>

          {examples.length ? (
            <div className="mt-16">
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)]">
                The scale in current stock
              </h3>
              <p className="measure mt-3 text-[15px] text-ink-muted">
                Every grade on the scale above is a stone you can enquire on. These are this
                week&apos;s featured stones, each with its report grade.
              </p>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {examples.map((stone) => {
                  const grade = stone.color as Parameters<typeof swatchColor>[0];
                  return (
                    <li key={stone.sku}>
                      <Link
                        href={`/stones/${stone.sku}`}
                        className="group flex h-full items-center gap-5 rounded-[22px] border border-hairline p-5 transition-colors duration-200 hover:border-ink"
                      >
                        <span
                          aria-hidden
                          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[16px] border border-hairline"
                          style={{ backgroundColor: swatchColor(grade) }}
                        >
                          <ShapeGlyph
                            geometry={SHAPE_BY_SLUG[stone.shape].geometry}
                            frozen
                            className="glyph-auto h-12 w-12"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-[22px] leading-tight">
                            {stone.shapeName} {stone.carat.toFixed(2)} ct
                          </span>
                          <span className="mt-1 block text-[14px]">
                            {grade} colour, {categoryOf(grade).name.toLowerCase()}
                          </span>
                          <span className="mt-1 block text-[12px] tabular-nums text-ink-muted">
                            {stone.origin === "natural" ? "Natural" : "Lab-grown"} · {stone.lab} ·
                            SKU {stone.sku}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* 4. Appearance */}
      <section id="appearance" className="scroll-mt-[96px] border-t border-hairline bg-panel">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>How color affects appearance</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              A grade is set face down, where colour is easiest to see. Mounted and viewed face
              up, a diamond returns light through its top, and that brightness masks much of its
              body colour. Most people cannot place a near-colourless stone on the scale once it
              is set.
            </p>
            <p className="measure mt-4 text-ink-muted-panel">
              The setting changes what you see. Metal reflects into the stone, so its colour
              becomes part of the diamond&apos;s colour. A deep bezel of yellow gold warms a stone
              more than slim white prongs do.
            </p>
          </div>

          <ul className="grid gap-px self-start overflow-hidden rounded-[36px] border border-hairline bg-hairline">
            {[
              {
                metal: "White gold and platinum",
                swatch: "#e4e5e7",
                body: "Neutral, so any warmth in the stone shows against it. The natural partner for D to H.",
              },
              {
                metal: "Yellow and rose gold",
                swatch: "#e3c77c",
                body: "Warm metal reflects into the stone and hides a warmer grade. J, and sometimes K, can look white against it — a D is partly wasted.",
              },
            ].map((item) => (
              <li key={item.metal} className="flex gap-5 bg-porcelain p-7">
                <span
                  aria-hidden
                  className="mt-1 h-10 w-10 shrink-0 rounded-full border border-hairline"
                  style={{ backgroundColor: item.swatch }}
                />
                <div>
                  <h3 className="font-display text-[22px] leading-tight">{item.metal}</h3>
                  <p className="mt-2 text-[15px] text-ink-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Price */}
      <section id="price" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <h2 className={H2}>Color grade and price</h2>
              <p className="measure mt-4 text-ink-muted">
                Price falls as you move down the scale, and fastest across the colourless grades,
                where rarity is highest. A D costs noticeably more than an F that no one could
                tell apart from it once set.
              </p>
              <p className="measure mt-4 text-ink-muted">
                Near-colourless grades, G to J, are where most buyers find the balance: colour
                very hard to see face up, at a clear saving on the grades above.
              </p>
            </div>
            <div className="rounded-[36px] border border-hairline p-8 sm:p-10 lg:self-start">
              <h3 className="font-display text-[24px]">Natural and lab-grown</h3>
              <p className="mt-3 text-[15px] text-ink-muted">
                Lab-grown diamonds are more often available at D to F in larger sizes, at a price
                a comparable natural stone would not reach. The colour grade means the same thing
                on either; origin, not material, is the difference.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
                <Link href="/natural-diamonds" className="underline underline-offset-4">
                  Natural diamonds
                </Link>
                <Link href="/lab-grown-diamonds" className="underline underline-offset-4">
                  Lab-grown diamonds
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <ColorScale
              tone="light"
              highlight={["G", "J"]}
              caption="G to J: near colourless, and the usual balance of visible quality against price."
            />
          </div>
        </div>
      </section>

      {/* 6. Other Cs */}
      <section id="other-cs" className="scroll-mt-[96px] border-t border-hairline bg-panel">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>How color interacts with the other Cs</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              Cut changes how colour reads. A well-cut stone returns more light face up, and that
              brightness makes a slight tint harder to notice. A stone cut deep or shallow leaks
              light and lets its body colour show.
            </p>
            <p className="measure mt-4 text-ink-muted-panel">
              Fluorescence can work either way. Medium to strong blue fluorescence can make a
              lower grade look whiter in daylight; in a few high-grade stones, strong
              fluorescence can look faintly hazy.
            </p>
            <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-hairline pt-6 sm:grid-cols-2">
              {[
                ["Colour", "D to Z for white diamonds, or a fancy-colour description."],
                ["Cut", "How the proportions return light. Graded for round brilliants only."],
                ["Polish", "The finish of the facet surfaces."],
                ["Symmetry", "How precisely the facets align with each other and the outline."],
                ["Clarity", "Inclusions and blemishes, from FL down to I2."],
                ["Fluorescence", "The strength of any glow under ultraviolet light."],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="text-[15px]">{term}</dt>
                  <dd className="mt-0.5 text-[14px] text-ink-muted-panel">{detail}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[14px] text-ink-muted-panel">
              <Link href="/craftsmanship" className="underline underline-offset-4 hover:text-ink">
                How to read a grading report
              </Link>
              <span aria-hidden> · </span>
              <Link href="/carat-guide" className="underline underline-offset-4 hover:text-ink">
                Diamond carat guide
              </Link>
              <span aria-hidden> · </span>
              <Link href="/cut-guide" className="underline underline-offset-4 hover:text-ink">
                Diamond cut guide
              </Link>
              <span aria-hidden> · </span>
              <Link href="/clarity-guide" className="underline underline-offset-4 hover:text-ink">
                Diamond clarity guide
              </Link>
            </p>
          </div>

          <aside className="rounded-[36px] bg-porcelain p-8 sm:p-10 lg:self-start">
            <p className="text-[13px] text-ink-muted">Outside this scale</p>
            <h3 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight">
              Fancy coloured diamonds are graded separately
            </h3>
            <p className="mt-4 text-[15px] text-ink-muted">
              Beyond Z, colour stops being a flaw and becomes the point. Yellow, pink, blue and
              green diamonds are graded on their own scale by the strength of their colour —
              Fancy Light, Fancy, Fancy Intense, Fancy Vivid and the deeper tones — not by a
              letter. This guide covers the D–Z scale for white diamonds only.
            </p>
            <div className="mt-6 flex gap-2" aria-hidden>
              {["#f2d45c", "#f0a9c0", "#8fb4e3", "#9bc79a"].map((c) => (
                <span key={c} className="h-8 w-8 rounded-full border border-hairline" style={{ backgroundColor: c }} />
              ))}
            </div>
            <Link
              href={colorCatalogueHref("lab", "Fancy")}
              className="mt-6 inline-block text-[15px] underline underline-offset-4"
            >
              Fancy-colour stones in stock
            </Link>
          </aside>
        </div>
      </section>

      {/* 7. Choosing */}
      <section id="choosing" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
          <h2 className={`${H2} max-w-[720px]`}>Choosing the right color grade</h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[36px] border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "Shape",
                "Step cuts such as emerald and asscher have open facets that show colour plainly; stay higher on the scale. Brilliant cuts such as round and cushion hide a tint far better.",
              ],
              [
                "Carat weight",
                "Colour is easier to see in a larger stone, simply because there is more of it. Moving up a grade matters more at two carats than at half a carat.",
              ],
              [
                "Setting metal",
                "White gold and platinum suit D to H. Yellow and rose gold flatter I to K, and a very high grade is partly lost against them.",
              ],
              [
                "Budget",
                "G to I is where most budget-conscious buyers do best: colour very hard to see once set, at a clear saving on colourless.",
              ],
              [
                "Origin",
                "Lab-grown widens access to D to F at larger weights. Natural offers finite supply. Neither is the wrong choice; the grade means the same on both.",
              ],
            ].map(([heading, body]) => (
              // Five cards: the last spans two columns so neither grid leaves an empty cell.
              <li key={heading} className="bg-porcelain p-8 md:last:col-span-2">
                <h3 className="font-display text-[24px]">{heading}</h3>
                <p className="measure mt-3 text-[15px] text-ink-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. FAQ */}
      <section id="faq" className="scroll-mt-[96px] border-t border-hairline">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="max-w-[520px]">
            <h2 className={H2}>Frequently Asked Questions</h2>
            <p className="measure mt-4 text-ink-muted">
              What buyers ask most often about colour before choosing a stone.
            </p>
            <p className="mt-6 text-[14px] text-ink-muted">
              See how colour trades off against the other Cs in the{" "}
              <Link href="/diamond-4cs-calculator" className="underline underline-offset-4 hover:text-ink">
                4Cs calculator
              </Link>
              .
            </p>
          </div>
          <div className="border-t border-hairline">
            {FAQ.map(({ question, answer }) => (
              <details key={question} className="group border-b border-hairline">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-[22px] leading-snug">{question}</h3>
                  <span
                    aria-hidden
                    className="mt-1 text-[20px] leading-none text-ink-muted transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="measure pb-6 text-[15px] text-ink-muted">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="border-t border-hairline bg-panel">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={H2}>Shop Diamonds by Color</h2>
            <p className="measure mt-4 text-ink-muted-panel">
              Choose a grade, and a shape if you have one in mind, to open the catalogue already
              filtered. Grades below J are sourced on request.
            </p>
            <Link
              href={colorEnquiryHref("K")}
              className="mt-5 inline-block text-[15px] underline underline-offset-4 hover:text-ink-muted-panel"
            >
              Enquire about a K grade or lower
            </Link>
          </div>
          <ColorFinder />
        </div>
      </section>
    </>
  );
}
