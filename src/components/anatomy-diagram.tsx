import Link from "next/link";

/*
  A labelled profile of a round brilliant, drawn to explain the words a report
  uses rather than to depict any particular stone. Geometry is close to textbook
  proportions — 56% table, 61% depth against the width drawn — but it is a
  schematic, not a scale drawing, and it says so on the page.

  Everything is laid out in one 360×260 box so the leader lines can be written
  as plain coordinates: the stone sits left of centre, labels run down the right.
*/
const LEFT = 44;
const RIGHT = 224;
const CX = (LEFT + RIGHT) / 2;
const TABLE_L = 90;
const TABLE_R = 178;
const TABLE_Y = 60;
const GIRDLE_TOP = 96;
const GIRDLE_BOTTOM = 103;
const CULET_Y = 206;
const LABEL_X = 244;

type Part = {
  /** Where the leader line starts, on the stone. */
  from: [number, number];
  /** Baseline of the label text. */
  y: number;
  term: string;
  slug: string;
};

const PARTS: Part[] = [
  { from: [CX + 20, TABLE_Y], y: 52, term: "Table", slug: "table" },
  { from: [RIGHT - 22, 80], y: 82, term: "Crown", slug: "crown" },
  { from: [RIGHT - 2, GIRDLE_TOP + 3], y: 112, term: "Girdle", slug: "girdle" },
  { from: [CX + 42, 150], y: 150, term: "Pavilion", slug: "pavilion" },
  { from: [CX + 3, CULET_Y - 2], y: 206, term: "Culet", slug: "culet" },
];

/** The crown outline, girdle band and pavilion, as one closed profile. */
const OUTLINE = [
  `M${LEFT} ${GIRDLE_TOP}`,
  `L${TABLE_L} ${TABLE_Y}`,
  `H${TABLE_R}`,
  `L${RIGHT} ${GIRDLE_TOP}`,
  `V${GIRDLE_BOTTOM}`,
  `L${CX} ${CULET_Y}`,
  `L${LEFT} ${GIRDLE_BOTTOM}`,
  "Z",
].join(" ");

/** Crown and pavilion facet joins — decorative, but they make the form read. */
const FACETS = [
  `M${TABLE_L} ${TABLE_Y} L${LEFT + 22} ${GIRDLE_TOP}`,
  `M${TABLE_R} ${TABLE_Y} L${RIGHT - 22} ${GIRDLE_TOP}`,
  `M${LEFT + 46} ${GIRDLE_TOP} L${TABLE_L + 22} ${TABLE_Y}`,
  `M${RIGHT - 46} ${GIRDLE_TOP} L${TABLE_R - 22} ${TABLE_Y}`,
  `M${LEFT + 44} ${GIRDLE_BOTTOM} L${CX} ${CULET_Y}`,
  `M${RIGHT - 44} ${GIRDLE_BOTTOM} L${CX} ${CULET_Y}`,
];

export function AnatomyDiagram({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <svg
        viewBox="0 0 360 260"
        role="img"
        aria-labelledby="anatomy-title anatomy-desc"
        className="h-auto w-full"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <title id="anatomy-title">Profile of a round brilliant diamond, with its parts labelled</title>
        <desc id="anatomy-desc">
          Seen from the side: the flat table on top, the sloping crown beneath it, the girdle band
          around the widest point, the pavilion tapering below, and the culet at the bottom point.
          Table percent is measured across the table against the stone&apos;s average diameter;
          depth percent is measured from table to culet against the same diameter.
        </desc>

        {/* Average diameter — the denominator both percentages are measured against. */}
        <g className="stroke-metal" strokeWidth={1}>
          <path d={`M${LEFT} 232 H${RIGHT}`} strokeDasharray="3 3" />
          <path d={`M${LEFT} 228 V236`} />
          <path d={`M${RIGHT} 228 V236`} />
        </g>
        <text x={CX} y={250} textAnchor="middle" className="fill-ink-muted text-[11px]">
          Average diameter
        </text>

        {/* Table % — measured across the top facet. */}
        <g className="stroke-metal" strokeWidth={1}>
          <path d={`M${TABLE_L} 30 H${TABLE_R}`} />
          <path d={`M${TABLE_L} 26 V34`} />
          <path d={`M${TABLE_R} 26 V34`} />
          <path d={`M${TABLE_L} 34 V${TABLE_Y - 2}`} strokeDasharray="2 3" />
          <path d={`M${TABLE_R} 34 V${TABLE_Y - 2}`} strokeDasharray="2 3" />
        </g>
        <text x={CX} y={20} textAnchor="middle" className="fill-ink text-[11px]">
          Table %
        </text>

        {/* Depth % — measured table to culet, down the left. */}
        <g className="stroke-metal" strokeWidth={1}>
          <path d={`M26 ${TABLE_Y} V${CULET_Y}`} />
          <path d={`M22 ${TABLE_Y} H30`} />
          <path d={`M22 ${CULET_Y} H30`} />
        </g>
        <text
          x={14}
          y={(TABLE_Y + CULET_Y) / 2}
          textAnchor="middle"
          className="fill-ink text-[11px]"
          transform={`rotate(-90 14 ${(TABLE_Y + CULET_Y) / 2})`}
        >
          Depth %
        </text>

        {/* The stone. */}
        <path d={OUTLINE} className="fill-facet/40 stroke-ink" strokeWidth={1.25} />
        {FACETS.map((d) => (
          <path key={d} d={d} className="stroke-hairline" strokeWidth={1} />
        ))}
        {/* The girdle band, drawn heavier — it is a part, not just an edge. */}
        <path d={`M${LEFT} ${GIRDLE_TOP} H${RIGHT}`} className="stroke-ink" strokeWidth={1} />
        <path d={`M${LEFT} ${GIRDLE_BOTTOM} H${RIGHT}`} className="stroke-ink" strokeWidth={1} />

        {/* Leader lines and part names. */}
        {PARTS.map(({ from, y, term }) => (
          <g key={term}>
            <path
              d={`M${from[0]} ${from[1]} L${LABEL_X - 8} ${y - 4}`}
              className="stroke-metal"
              strokeWidth={1}
            />
            <circle cx={from[0]} cy={from[1]} r={2} className="fill-ink" />
            <text x={LABEL_X} y={y} className="fill-ink text-[12px]">
              {term}
            </text>
          </g>
        ))}
      </svg>

      <figcaption className="mt-5 text-[14px] text-ink-muted">
        Schematic, not to scale.{" "}
        {PARTS.map(({ term, slug }, i) => (
          <span key={slug}>
            {i > 0 ? <span aria-hidden> · </span> : null}
            <Link
              href={`/glossary#${slug}`}
              className="underline underline-offset-4 transition-colors duration-200 hover:text-ink"
            >
              {term}
            </Link>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
