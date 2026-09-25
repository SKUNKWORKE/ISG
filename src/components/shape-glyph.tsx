import type { GlyphGeometry } from "@/lib/glyphs";

type Props = {
  geometry: GlyphGeometry;
  /** Drives the wireframe-to-glint transition. Ignored when `frozen`. */
  lit?: boolean;
  /** Renders the complete wireframe with no transitions — for cards and lists. */
  frozen?: boolean;
  className?: string;
  /** Hairline weight in CSS pixels, independent of rendered size. */
  strokeWidth?: number;
  title?: string;
  /** Crop to part of the 100×100 drawing — with `preserveAspectRatio="none"`, draws to true proportions. */
  viewBox?: string;
  preserveAspectRatio?: string;
};

/**
 * A cut shape drawn as a plotting diagram: girdle outline plus facet lines,
 * stroked at a true hairline at any size via non-scaling-stroke.
 *
 * Decorative by default — the shape's name is always rendered as text beside it,
 * so repeating it to a screen reader adds nothing. Pass `title` where the glyph
 * is the only thing identifying the shape.
 */
export function ShapeGlyph({
  geometry,
  lit = false,
  frozen = false,
  className,
  strokeWidth = 1,
  title,
  viewBox = "0 0 100 100",
  preserveAspectRatio,
}: Props) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={[
        frozen ? "glyph-static" : "",
        !frozen && lit ? "glyph-is-lit" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    >
      {title ? <title>{title}</title> : null}
      <path d={geometry.outline} className="glyph-outline" vectorEffect="non-scaling-stroke" />
      {geometry.facets.map((d, i) => (
        <path
          key={d}
          d={d}
          className="glyph-facet"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          // Facets draw outside-in, following the order they are listed.
          style={{ transitionDelay: `${i * 42}ms` }}
        />
      ))}
    </svg>
  );
}
