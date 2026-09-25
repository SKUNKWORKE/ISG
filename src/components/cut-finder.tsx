"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { SHOPPABLE_CUTS, cutCatalogueHref, cutEnquiryHref } from "@/lib/cut-grades";
import { SHAPES, SHAPE_BY_SLUG, type ShapeSlug } from "@/lib/shapes";
import type { CutGrade } from "@/lib/stones";

const SELECT =
  "mt-1.5 w-full rounded-[12px] border border-hairline bg-porcelain px-3.5 py-2.5 text-[15px] transition-colors duration-200 focus:border-ink";

/**
 * Cut grade and shape in, catalogue or enquiry out. A cut grade exists only for
 * round brilliants, so choosing any other shape drops the grade and says why,
 * rather than opening a filter that could never match a certified grade.
 */
export function CutFinder() {
  const id = useId();
  const [shape, setShape] = useState<ShapeSlug>("round");
  const [grade, setGrade] = useState<CutGrade>("Excellent");
  const graded = shape === "round";
  const name = SHAPE_BY_SLUG[shape].name;
  const label = graded ? `${name}, ${grade} cut` : name;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-shape`} className="block text-[13px] text-ink-muted-panel">
            Shape
          </label>
          <select
            id={`${id}-shape`}
            value={shape}
            onChange={(e) => setShape(e.target.value as ShapeSlug)}
            className={SELECT}
          >
            {SHAPES.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-grade`} className="block text-[13px] text-ink-muted-panel">
            Cut grade
          </label>
          <select
            id={`${id}-grade`}
            value={grade}
            disabled={!graded}
            aria-describedby={graded ? undefined : `${id}-note`}
            onChange={(e) => setGrade(e.target.value as CutGrade)}
            className={`${SELECT} disabled:opacity-50`}
          >
            {SHOPPABLE_CUTS.map((g) => (
              <option key={g} value={g}>
                {g}
                {g === "Ideal" ? " (IGI)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!graded ? (
        <p id={`${id}-note`} className="mt-3 text-[14px] text-ink-muted-panel">
          {name} diamonds carry no overall cut grade. The catalogue opens on the shape; compare
          polish, symmetry and proportions on each listing.
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={cutCatalogueHref("natural", grade, shape)}
          className="rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
        >
          Shop natural
        </Link>
        <Link
          href={cutCatalogueHref("lab", grade, shape)}
          className="rounded-full border border-ink px-7 py-3 text-[15px] transition-colors duration-200 hover:bg-ink hover:text-white"
        >
          Shop lab-grown
        </Link>
      </div>

      <Link
        href={cutEnquiryHref(grade, shape)}
        className="mt-5 inline-block text-[15px] underline underline-offset-4 transition-colors duration-200 hover:text-ink-muted-panel"
      >
        Enquire about {label}
      </Link>
    </div>
  );
}
