"use client";

import { useId } from "react";
import type { FaceUp } from "@/lib/carat-size";
import type { Metal, Purity } from "@/lib/jewelry";
import type { SettingStyle } from "@/lib/ring-builder";
import {
  engravingPath,
  engravingSize,
  glyphTransform,
  ringFrame,
  ringLayout,
  scaleBarMm,
  WALL,
  type Frame,
  type StonePlacement,
} from "@/lib/ring-render";
import { SHAPE_BY_SLUG, type ShapeSlug } from "@/lib/shapes";

/**
 * The ring drawn live from the buyer's own choices: the band at their finger
 * size, their stone at its measured face-up size, in the metal and purity they
 * picked, with their engraving inside the shank.
 *
 * A drawing rather than a render, and the caption beside it says so. What it
 * gets right is the thing a photograph of someone else's stone cannot: the
 * proportions of this stone against this band. The head, halo and side stones
 * are indicative of the style, because the head is cut to fit the stone when
 * the ring is made.
 */

type Tone = { light: string; mid: string; dark: string };

/**
 * Gold at 9K and at 18K, with everything between mixed by actual gold content.
 * White gold is rhodium plated, so its colour barely moves with purity.
 */
const TONES: Record<Metal, { pale: Tone; rich: Tone }> = {
  yellow: {
    pale: { light: "#f4eddd", mid: "#d6c49a", dark: "#9d8f6e" },
    rich: { light: "#f9e9b8", mid: "#ddb85f", dark: "#a07c2e" },
  },
  white: {
    pale: { light: "#fbfbfa", mid: "#dedcd7", dark: "#a6a49e" },
    rich: { light: "#fcfcfb", mid: "#dcdad4", dark: "#a2a09a" },
  },
  rose: {
    pale: { light: "#f7e8e0", mid: "#dcbcac", dark: "#a98878" },
    rich: { light: "#fadfd0", mid: "#e3a586", dark: "#b0705a" },
  },
};

/** Parts of gold per thousand — what the karat mark actually means. */
const FINENESS: Record<Purity, number> = { "9K": 375, "10K": 417, "14K": 583, "18K": 750 };

function mix(a: string, b: string, t: number): string {
  const channel = (i: number) => {
    const from = Number.parseInt(a.slice(1 + i * 2, 3 + i * 2), 16);
    const to = Number.parseInt(b.slice(1 + i * 2, 3 + i * 2), 16);
    return Math.round(from + (to - from) * t)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(1)}${channel(2)}`;
}

function toneFor(metal: Metal, purity: Purity): Tone {
  const { pale, rich } = TONES[metal];
  const t = (FINENESS[purity] - FINENESS["9K"]) / (FINENESS["18K"] - FINENESS["9K"]);
  return {
    light: mix(pale.light, rich.light, t),
    mid: mix(pale.mid, rich.mid, t),
    dark: mix(pale.dark, rich.dark, t),
  };
}

/** The girdle outline and facet lines, stretched to a true-to-millimetre placement. */
function Stone({ place, faint = false }: { place: StonePlacement; faint?: boolean }) {
  const geometry = SHAPE_BY_SLUG[place.shape].geometry;
  return (
    <g transform={glyphTransform(place)} opacity={faint ? 0.85 : 1}>
      <path
        d={geometry.outline}
        className="fill-facet stroke-ink"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      {geometry.facets.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          className="stroke-ink"
          strokeWidth={faint ? 0.6 : 1}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={faint ? 0.5 : 0.8}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  );
}

type Props = {
  shape: ShapeSlug;
  /** Face-up size of the buyer's stone, in millimetres. */
  stone: FaceUp;
  style: SettingStyle | null;
  metal: Metal;
  purity: Purity;
  /** Undefined until a finger size is chosen; the drawing falls back to US 7. */
  us?: number;
  engraving?: string;
  /** Spoken description of the whole drawing. */
  label: string;
  className?: string;
};

export function RingComposite({ shape, stone, style, metal, purity, us, engraving, label, className }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const layout = ringLayout({ shape, stone, style, us });
  const tone = toneFor(metal, purity);
  const band = `band-${uid}`;
  const arc = `arc-${uid}`;
  const inside = `inside-${uid}`;

  const frame = ringFrame(layout);
  const R = layout.outer / 2;
  const r = layout.inner / 2;
  // One path, two circles, even-odd: the hole is a hole rather than a disc
  // painted in the page colour, so nothing shows through it.
  const circle = (radius: number) => {
    const d = (radius * 2).toFixed(3);
    const a = radius.toFixed(3);
    return `M${(-radius).toFixed(3)} 0a${a} ${a} 0 1 0 ${d} 0a${a} ${a} 0 1 0 -${d} 0Z`;
  };
  const annulus = circle(R) + circle(r);

  const text = engraving?.trim();

  return (
    <svg
      viewBox={`${frame.x.toFixed(3)} ${frame.y.toFixed(3)} ${frame.width.toFixed(3)} ${frame.height.toFixed(3)}`}
      className={className}
      role="img"
      aria-label={label}
    >
      <defs>
        {/* Light from the upper left, as every stone photograph on the site is lit. */}
        <linearGradient id={band} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={tone.light} />
          <stop offset="45%" stopColor={tone.mid} />
          <stop offset="100%" stopColor={tone.dark} />
        </linearGradient>
        {/* The inside wall turns away from you towards the top of the ring. */}
        <linearGradient id={inside} x1="0" y1="0" x2="0" y2="1">
          <stop offset="30%" stopColor={tone.mid} stopOpacity={0} />
          <stop offset="100%" stopColor={tone.mid} stopOpacity={0.75} />
        </linearGradient>
        <path id={arc} d={engravingPath(layout.inner)} />
      </defs>

      {/* The shank, and the inner wall you see through the hole. */}
      <path
        d={annulus}
        fillRule="evenodd"
        fill={`url(#${band})`}
        stroke={tone.dark}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      {/* The far inside wall, seen through the hole — and read from, if engraved. */}
      <circle
        cx={0}
        cy={0}
        r={r - WALL / 2}
        fill="none"
        stroke={`url(#${inside})`}
        strokeWidth={WALL}
      />

      {text ? (
        <text
          fontSize={engravingSize(text, layout.inner)}
          fill={tone.dark}
          letterSpacing={0.06}
          className="font-display"
        >
          {/* xlinkHref for renderers that never caught up with SVG 2. */}
          <textPath href={`#${arc}`} xlinkHref={`#${arc}`} startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      ) : null}

      {/* The head, painted before the stone so the join disappears under it. */}
      <path
        d={layout.basket}
        fill={`url(#${band})`}
        stroke={tone.dark}
        strokeWidth={1}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* A hidden halo is set below the girdle: from above only a rim of it shows. */}
      {layout.haloHidden
        ? layout.halo.at.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={layout.halo.radius} className="fill-facet stroke-ink" strokeWidth={1} opacity={0.75} vectorEffect="non-scaling-stroke" />
          ))
        : null}

      {layout.sides.map((place, i) => (
        <Stone key={i} place={place} faint />
      ))}

      {!layout.haloHidden
        ? layout.halo.at.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={layout.halo.radius} className="fill-facet stroke-ink" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))
        : null}

      <Stone place={layout.centre} />

      {layout.prongs.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={layout.prongRadius}
          fill={tone.mid}
          stroke={tone.dark}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      <ScaleBar frame={frame} />
    </svg>
  );
}

/**
 * How big any of this is, in the only unit a grading report uses. The frame is
 * fitted to the ring, so without this the drawing would be scaleless — a 22 ct
 * stone and a half carat would look identical.
 */
function ScaleBar({ frame }: { frame: Frame }) {
  const mm = scaleBarMm(frame);
  const size = frame.width / 26;
  const x = frame.x + frame.width * 0.04;
  const y = frame.y + frame.height - size * 1.4;

  return (
    <g className="fill-ink-muted stroke-ink-muted" aria-hidden>
      <path
        d={`M${x} ${y - size * 0.45}V${y}H${x + mm}V${y - size * 0.45}`}
        fill="none"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <text x={x + mm + size * 0.4} y={y} fontSize={size} stroke="none">
        {mm} mm
      </text>
    </g>
  );
}
