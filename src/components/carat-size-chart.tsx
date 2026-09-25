import Link from "next/link";
import { ShapeGlyph } from "./shape-glyph";
import {
  CHART_CARATS,
  SIZE_MODELS,
  catalogueHref,
  faceUpSize,
  formatCaratBand,
  formatFaceUp,
} from "@/lib/carat-size";
import { SHAPES, SHAPE_BY_SLUG, type ShapeSlug } from "@/lib/shapes";
import { LAB_STONES, NATURAL_STONES, countByShape } from "@/lib/stones";

const ALL_SHAPES = SHAPES.map((s) => s.slug);

/**
 * Carat weight against face-up size, drawn to one millimetre scale across
 * every row so shapes compare with each other as well as across weights.
 * Each silhouette opens natural stock in that shape and weight band.
 *
 * `--mm` is the only size input: every silhouette and the scale bar are
 * multiples of it, so the whole chart rescales by breakpoint in one place.
 */
export function CaratSizeChart({
  shapes = ALL_SHAPES,
  carats = CHART_CARATS,
  rowHeadings = true,
  scaleBar = true,
}: {
  shapes?: readonly ShapeSlug[];
  carats?: readonly number[];
  /** Shape name, typical ratio and stock links above each row. Off when embedded on a shape page. */
  rowHeadings?: boolean;
  scaleBar?: boolean;
}) {
  const natural = countByShape(NATURAL_STONES);
  const lab = countByShape(LAB_STONES);

  return (
    <div className="[--mm:4.5px] sm:[--mm:6px] lg:[--mm:8.5px] xl:[--mm:10px]">
      {scaleBar ? (
        <p className="flex items-center gap-3 text-[12px] text-ink-muted">
          <span
            aria-hidden
            className="h-2 border-x border-b border-ink"
            style={{ width: "calc(var(--mm) * 5)" }}
          />
          5 mm. Every silhouette is drawn to this scale, at typical proportions.
        </p>
      ) : null}

      <ul className={scaleBar ? "mt-6 border-t border-hairline" : undefined}>
        {shapes.map((slug) => {
          const shape = SHAPE_BY_SLUG[slug];
          const [x, y, w, h] = SIZE_MODELS[slug].box;
          return (
            <li key={slug} className={rowHeadings ? "border-b border-hairline py-8" : undefined}>
              {rowHeadings ? (
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="font-display text-[28px] leading-none">
                    <Link
                      href={`/shapes/${slug}`}
                      className="underline decoration-transparent underline-offset-[5px] transition-colors duration-200 hover:decoration-ink"
                    >
                      {shape.name}
                    </Link>
                  </h3>
                  <p className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink-muted">
                    <span className="tabular-nums">
                      Ratio {SIZE_MODELS[slug].ratio.toFixed(2)}
                    </span>
                    <Link
                      href={catalogueHref("natural", slug)}
                      className="underline underline-offset-4 transition-colors duration-200 hover:text-ink"
                    >
                      Natural stock ({natural[slug] ?? 0})
                    </Link>
                    <Link
                      href={catalogueHref("lab", slug)}
                      className="underline underline-offset-4 transition-colors duration-200 hover:text-ink"
                    >
                      Lab-grown stock ({lab[slug] ?? 0})
                    </Link>
                  </p>
                </div>
              ) : null}

              {/* Scrolls sideways on narrow screens rather than shrinking the scale. */}
              <div className={`-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 ${rowHeadings ? "mt-5" : ""}`}>
                <ol className="flex min-w-max items-end gap-1 sm:gap-2">
                  {carats.map((carat) => {
                    const size = faceUpSize(slug, carat);
                    return (
                      <li key={carat}>
                        <Link
                          href={catalogueHref("natural", slug, carat)}
                          className="group flex min-w-[84px] flex-col items-center rounded-[16px] px-2 pb-3 pt-4 transition-colors duration-200 hover:bg-panel"
                        >
                          <span
                            aria-hidden
                            className="block"
                            style={{
                              width: `calc(var(--mm) * ${size.width.toFixed(2)})`,
                              height: `calc(var(--mm) * ${size.length.toFixed(2)})`,
                            }}
                          >
                            {/* Facets always drawn so small stones still read as cut shapes; hover still lights the glint. */}
                            <ShapeGlyph
                              geometry={shape.geometry}
                              frozen
                              viewBox={`${x} ${y} ${w} ${h}`}
                              preserveAspectRatio="none"
                              className="glyph-auto block h-full w-full overflow-visible"
                            />
                          </span>
                          <span className="sr-only">
                            Natural {shape.name.toLowerCase()} diamonds, {formatCaratBand(carat)},
                            about {formatFaceUp(size)} face up
                          </span>
                          <span aria-hidden className="mt-3 font-display text-[19px] leading-none">
                            {carat.toFixed(2)} ct
                          </span>
                          <span aria-hidden className="mt-1 text-[11px] tabular-nums text-ink-muted">
                            {formatFaceUp(size)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** The same figures as text — for search engines, screen readers and anyone who wants the numbers. */
export function CaratSizeTable({
  shapes = ALL_SHAPES,
  carats = CHART_CARATS,
  caption,
}: {
  shapes?: readonly ShapeSlug[];
  carats?: readonly number[];
  caption: string;
}) {
  return (
    <div className="overflow-x-auto rounded-[22px] border border-hairline">
      <table className="w-full min-w-[760px] text-left text-[14px] tabular-nums">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-hairline bg-panel text-[12px] text-ink-muted-panel">
            <th scope="col" className="px-4 py-3 font-normal">
              Shape
            </th>
            {carats.map((carat) => (
              <th key={carat} scope="col" className="px-4 py-3 font-normal">
                {carat.toFixed(2)} ct
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shapes.map((slug) => (
            <tr key={slug} className="border-b border-hairline last:border-b-0">
              <th scope="row" className="px-4 py-3 font-display text-[17px] font-normal">
                {SHAPE_BY_SLUG[slug].name}
              </th>
              {carats.map((carat) => (
                <td key={carat} className="whitespace-nowrap px-4 py-3">
                  {formatFaceUp(faceUpSize(slug, carat))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
