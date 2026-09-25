"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { CHART_CARATS, catalogueHref, formatCaratBand } from "@/lib/carat-size";
import { SHAPES, SHAPE_BY_SLUG, type ShapeSlug } from "@/lib/shapes";

const SELECT =
  "mt-1.5 w-full rounded-[12px] border border-hairline bg-porcelain px-3.5 py-2.5 text-[15px] transition-colors duration-200 focus:border-ink";

/** Shape and weight in, catalogue or enquiry out. */
export function CaratFinder({
  defaultShape = "round",
  defaultCarat = 1,
}: {
  defaultShape?: ShapeSlug;
  defaultCarat?: number;
}) {
  const id = useId();
  const [shape, setShape] = useState<ShapeSlug>(defaultShape);
  const [carat, setCarat] = useState<number>(defaultCarat);
  const label = `${SHAPE_BY_SLUG[shape].name} ${carat.toFixed(2)} ct`;
  const enquiry = new URLSearchParams({ shape, carat: carat.toFixed(2) });

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
          <label htmlFor={`${id}-carat`} className="block text-[13px] text-ink-muted-panel">
            Carat weight
          </label>
          <select
            id={`${id}-carat`}
            value={String(carat)}
            onChange={(e) => setCarat(Number(e.target.value))}
            className={SELECT}
          >
            {CHART_CARATS.map((c) => (
              <option key={c} value={String(c)}>
                {formatCaratBand(c)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={catalogueHref("natural", shape, carat)}
          className="rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
        >
          Shop natural
        </Link>
        <Link
          href={catalogueHref("lab", shape, carat)}
          className="rounded-full border border-ink px-7 py-3 text-[15px] transition-colors duration-200 hover:bg-ink hover:text-white"
        >
          Shop lab-grown
        </Link>
      </div>

      <Link
        href={`/contact?${enquiry.toString()}#enquiry`}
        className="mt-5 inline-block text-[15px] underline underline-offset-4 transition-colors duration-200 hover:text-ink-muted-panel"
      >
        Enquire about {label}
      </Link>
    </div>
  );
}
