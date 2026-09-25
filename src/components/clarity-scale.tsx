import Link from "next/link";
import { CountLink } from "./color-scale";
import {
  CLARITY_CATEGORIES,
  STOCKED_CLARITIES,
  clarityCatalogueHref,
  inclusionShapes,
  type InclusionPattern,
} from "@/lib/clarity-grades";
import { GLYPHS } from "@/lib/glyphs";
import { LAB_STONES, NATURAL_STONES, type ClarityGrade, type Stone } from "@/lib/stones";

/**
 * A round brilliant seen face up through a 10x loupe, with an illustrative
 * inclusion pattern. `magnified={false}` draws the same stone with no marks —
 * how an eye-clean stone reads without a loupe. Decorative: callers always
 * give the grade in text.
 */
export function Loupe({
  pattern,
  magnified = true,
  className,
}: {
  pattern: InclusionPattern;
  magnified?: boolean;
  className?: string;
}) {
  const marks = magnified ? inclusionShapes(pattern) : { pinpoints: [], feathers: [], crystals: [] };
  const ink = `rgb(23 24 27 / ${0.25 + pattern.contrast * 0.75})`;

  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <circle cx="50" cy="50" r="48" fill="#f6f5f2" stroke="rgb(255 255 255 / 0.35)" strokeWidth="2.5" />
      <g fill="none" stroke="#b9b6ae" strokeWidth="0.5" strokeLinejoin="round">
        <path d={GLYPHS.round.outline} />
        {GLYPHS.round.facets.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {marks.feathers.map((d) => (
        <path key={d} d={d} fill="none" stroke={ink} strokeWidth="0.7" strokeLinecap="round" />
      ))}
      {marks.crystals.map((d) => (
        <path key={d} d={d} fill={ink} stroke="rgb(23 24 27 / 0.9)" strokeWidth="0.3" />
      ))}
      {marks.pinpoints.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r={p.r} fill={ink} />
      ))}
    </svg>
  );
}

function stoneLabel(stone: Stone) {
  return `${stone.shapeName} ${stone.carat.toFixed(2)} ct`;
}

/**
 * The five clarity categories as loupe views on a dark tray. `examples` lists
 * real stones under the grade their report gives; `stock` adds per-grade
 * catalogue counts. Stacks to one column on phones.
 */
export function ClarityScale({ examples = [], stock = false }: { examples?: Stone[]; stock?: boolean }) {
  const count = (stones: Stone[], grade: string) => stones.filter((s) => s.clarity === grade).length;
  const link = "underline underline-offset-4 transition-opacity duration-200 hover:opacity-75";

  return (
    <figure className="rounded-[36px] bg-ink px-5 py-8 text-white sm:p-10 [&_a:focus-visible]:outline-white">
      <ol className="grid gap-px overflow-hidden rounded-[22px] bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
        {CLARITY_CATEGORIES.map((category) => {
          const tagged = examples.filter((s) => category.grades.includes(s.clarity));
          return (
            <li key={category.label} className="flex flex-col bg-ink p-5 sm:p-6">
              <Loupe pattern={category.pattern} className="mx-auto w-full max-w-[180px]" />
              <h3 className="mt-6 font-display text-[26px] leading-none">{category.label}</h3>
              <p className="mt-1.5 text-[13px] text-white/70">{category.name}</p>
              <p className="mt-3 text-[14px] text-white/80">{category.description}</p>

              {tagged.length ? (
                <ul className="mt-4 space-y-1.5 border-t border-white/15 pt-3 text-[13px]">
                  {tagged.map((s) => (
                    <li key={s.sku}>
                      <Link href={`/stones/${s.sku}`} className={link}>
                        {stoneLabel(s)}
                      </Link>
                      <span className="text-white/60">
                        {" "}
                        · {s.clarity}, {s.origin === "natural" ? "natural" : "lab-grown"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {stock ? (
                <dl className="mt-auto space-y-2 pt-5 text-[12px]">
                  {category.grades.map((grade) => {
                    const stocked = (STOCKED_CLARITIES as string[]).includes(grade);
                    return (
                      <div key={grade}>
                        <dt className="font-display text-[16px] leading-none">{grade}</dt>
                        <dd className="mt-1 text-white/60">
                          {stocked ? (
                            <>
                              <CountLink
                                n={count(NATURAL_STONES, grade)}
                                label="natural"
                                href={clarityCatalogueHref("natural", grade as ClarityGrade)}
                                linkClass={`${link} text-white`}
                                mutedClass="text-white/60"
                              />
                              {" · "}
                              <CountLink
                                n={count(LAB_STONES, grade)}
                                label="lab-grown"
                                href={clarityCatalogueHref("lab", grade as ClarityGrade)}
                                linkClass={`${link} text-white`}
                                mutedClass="text-white/60"
                              />
                            </>
                          ) : (
                            "Not stocked"
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              ) : null}
            </li>
          );
        })}
      </ol>
      <figcaption className="measure mt-6 text-[12px] text-white/70 sm:text-[13px]">
        Illustrative 10x views of a round brilliant, face up. Real inclusions vary in type, size
        and position, and a grade reflects how visible they are, not how many there are — the
        plot on the grading report shows what is actually in a stone.
      </figcaption>
    </figure>
  );
}

/** The scale as a table — for search engines, screen readers and printing. */
export function ClarityGradeTable() {
  return (
    <div className="overflow-x-auto rounded-[22px] border border-hairline">
      <table className="w-full text-left text-[14px] sm:text-[15px]">
        <caption className="sr-only">Diamond clarity grades FL to I3, by category</caption>
        <thead>
          <tr className="border-b border-hairline bg-panel text-[12px] text-ink-muted-panel">
            <th scope="col" className="px-5 py-3 font-normal">Grade</th>
            <th scope="col" className="px-5 py-3 font-normal">Category</th>
            <th scope="col" className="px-5 py-3 font-normal">What it means</th>
          </tr>
        </thead>
        <tbody>
          {CLARITY_CATEGORIES.map((c) => (
            <tr key={c.label} className="border-b border-hairline last:border-b-0">
              <th scope="row" className="whitespace-nowrap px-5 py-3.5 font-normal tabular-nums">
                {c.label}
              </th>
              <td className="px-5 py-3.5 font-display text-[18px]">{c.name}</td>
              <td className="px-5 py-3.5 text-ink-muted">{c.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
