"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { STOCKED_CLARITIES, clarityCatalogueHref, clarityEnquiryHref } from "@/lib/clarity-grades";
import { SHAPES, SHAPE_BY_SLUG, type ShapeSlug } from "@/lib/shapes";
import type { ClarityGrade } from "@/lib/stones";

const SELECT =
  "mt-1.5 w-full rounded-[12px] border border-hairline bg-porcelain px-3.5 py-2.5 text-[15px] transition-colors duration-200 focus:border-ink";

/** Clarity grade and (optionally) shape in, catalogue or enquiry out. */
export function ClarityFinder({ defaultGrade = "VS2" }: { defaultGrade?: ClarityGrade }) {
  const id = useId();
  const [shape, setShape] = useState<ShapeSlug | "">("");
  const [grade, setGrade] = useState<ClarityGrade>(defaultGrade);
  const chosen = shape || undefined;
  const label = chosen ? `${SHAPE_BY_SLUG[chosen].name}, ${grade} clarity` : `${grade} clarity`;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-grade`} className="block text-[13px] text-ink-muted-panel">
            Clarity grade
          </label>
          <select
            id={`${id}-grade`}
            value={grade}
            onChange={(e) => setGrade(e.target.value as ClarityGrade)}
            className={SELECT}
          >
            {STOCKED_CLARITIES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-shape`} className="block text-[13px] text-ink-muted-panel">
            Shape
          </label>
          <select
            id={`${id}-shape`}
            value={shape}
            onChange={(e) => setShape(e.target.value as ShapeSlug | "")}
            className={SELECT}
          >
            <option value="">Any shape</option>
            {SHAPES.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={clarityCatalogueHref("natural", grade, chosen)}
          className="rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
        >
          Shop natural
        </Link>
        <Link
          href={clarityCatalogueHref("lab", grade, chosen)}
          className="rounded-full border border-ink px-7 py-3 text-[15px] transition-colors duration-200 hover:bg-ink hover:text-white"
        >
          Shop lab-grown
        </Link>
      </div>

      <Link
        href={clarityEnquiryHref(grade, chosen)}
        className="mt-5 inline-block text-[15px] underline underline-offset-4 transition-colors duration-200 hover:text-ink-muted-panel"
      >
        Enquire about {label}
      </Link>
    </div>
  );
}
