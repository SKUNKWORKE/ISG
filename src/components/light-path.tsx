import Link from "next/link";
import { GIA_CUT_SCALE, cutCatalogueHref, type DiagramProfile, type RayFate } from "@/lib/cut-grades";
import { LAB_STONES, NATURAL_STONES, type CutGrade, type Stone } from "@/lib/stones";

/*
  Schematic profile of a round brilliant in a 200×170 box:
  table 64–136 at y 36, crown down to the girdle at y 58 (x 16–184),
  pavilion down to a culet at (100, culetY). Rays are drawn, not simulated —
  see the note in lib/cut-grades.ts.
*/
const TABLE_Y = 36;
const GIRDLE_Y = 58;
const LEFT = 16;
const RIGHT = 184;
const CX = 100;

function pavilionY(x: number, culetY: number) {
  const side = x < CX ? (x - LEFT) / (CX - LEFT) : (RIGHT - x) / (RIGHT - CX);
  return GIRDLE_Y + side * (culetY - GIRDLE_Y);
}

/**
 * A ray as two segments: its path in and through the stone, and the segment
 * where it leaves. Only the leaving segment says whether the light was kept or
 * lost, so a lost ray is drawn solid up to the point it escapes.
 */
function rayPath(x: number, fate: RayFate, culetY: number): { inner: string; exit: string } {
  const mirror = 2 * CX - x;
  const y1 = pavilionY(x, culetY).toFixed(1);
  const y2 = pavilionY(mirror, culetY);
  const entry = `M${x} 4 L${x} ${TABLE_Y} L${x} ${y1}`;
  if (fate === "returns") {
    // Across to the opposite facet, back up and out through the top.
    return {
      inner: `${entry} L${mirror} ${y2.toFixed(1)} L${mirror} ${TABLE_Y}`,
      exit: `M${mirror} ${TABLE_Y} L${mirror} 4`,
    };
  }
  if (fate === "leaks-bottom") {
    // Too shallow: the second facet is struck too squarely and the light passes out below.
    return {
      inner: `${entry} L${mirror} ${y2.toFixed(1)}`,
      exit: `M${mirror} ${y2.toFixed(1)} L${Math.min(mirror + 34, 198)} ${Math.min(y2 + 30, 168)}`,
    };
  }
  // Too deep: light strikes the far facet low and exits through the side.
  const xDeep = mirror + 10;
  const yDeep = pavilionY(xDeep, culetY);
  return {
    inner: `${entry} L${xDeep} ${yDeep.toFixed(1)}`,
    exit: `M${xDeep} ${yDeep.toFixed(1)} L198 ${Math.min(yDeep + 6, 168)}`,
  };
}

/** One schematic diagram. Decorative — callers always pair it with the grade in text. */
export function LightPathDiagram({
  profile,
  className,
}: {
  profile: DiagramProfile;
  className?: string;
}) {
  const outline = `M${LEFT} ${GIRDLE_Y} L64 ${TABLE_Y} L136 ${TABLE_Y} L${RIGHT} ${GIRDLE_Y} L${CX} ${profile.culetY} Z`;
  return (
    <svg viewBox="0 0 200 170" aria-hidden className={className} fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d={outline} className="fill-white/5 stroke-white/60" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <path d={`M${LEFT} ${GIRDLE_Y}H${RIGHT}`} className="stroke-white/25" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {profile.rays.map((ray) => {
        const { inner, exit } = rayPath(ray.x, ray.fate, profile.culetY);
        const kept = ray.fate === "returns";
        return (
          <g key={`${ray.x}-${ray.fate}`}>
            <path
              d={inner}
              className={kept ? "stroke-[#f4dc8a]" : "stroke-white/55"}
              strokeWidth={kept ? 1.75 : 1.25}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={exit}
              className={kept ? "stroke-[#f4dc8a]" : "stroke-white/45"}
              strokeWidth={kept ? 1.75 : 1.25}
              strokeDasharray={kept ? undefined : "4 3"}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </svg>
  );
}

function roundsWithCut(stones: Stone[], grade: CutGrade) {
  return stones.filter((s) => s.shape === "round" && s.cut === grade);
}

/**
 * GIA's five cut grades as schematic light paths, side by side on a dark tray.
 * `examples` tags grades with real round brilliants; `stock` adds counts of
 * round brilliants per grade, linked into the catalogue. Only rounds are ever
 * counted, because only rounds carry a cut grade.
 */
export function CutGradeScale({
  examples = [],
  stock = false,
}: {
  examples?: Stone[];
  stock?: boolean;
}) {
  const link = "underline underline-offset-4 transition-opacity duration-200 hover:opacity-75";

  return (
    <figure className="rounded-[36px] bg-ink px-5 py-8 text-white sm:p-10 [&_a:focus-visible]:outline-white">
      <ol className="grid gap-px overflow-hidden rounded-[22px] bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
        {GIA_CUT_SCALE.map(({ grade, description, diagram }) => {
          // "Poor" exists on GIA's scale but never in stock data, so it has no catalogue filter.
          const certified: CutGrade | undefined = grade === "Poor" ? undefined : grade;
          const tagged = certified ? examples.filter((s) => s.cut === certified) : [];
          const natural = certified ? roundsWithCut(NATURAL_STONES, certified).length : 0;
          const lab = certified ? roundsWithCut(LAB_STONES, certified).length : 0;
          return (
            <li key={grade} className="flex flex-col bg-ink p-5 sm:p-6">
              <LightPathDiagram profile={diagram} className="mx-auto w-full max-w-[220px]" />
              <h3 className="mt-5 font-display text-[26px] leading-none">{grade}</h3>
              <p className="mt-2 text-[14px] text-white/75">{description}</p>

              {tagged.length ? (
                <ul className="mt-4 space-y-1.5 border-t border-white/15 pt-3 text-[13px]">
                  {tagged.map((s) => (
                    <li key={s.sku}>
                      <Link href={`/stones/${s.sku}`} className={link}>
                        {s.shapeName} {s.carat.toFixed(2)} ct
                      </Link>
                      <span className="text-white/60">
                        {" "}
                        · {s.origin === "natural" ? "natural" : "lab-grown"}, {s.lab}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {stock ? (
                <p className="mt-auto pt-4 text-[13px] text-white/60">
                  {natural || lab ? (
                    <>
                      Round in stock:{" "}
                      {natural ? (
                        <Link href={cutCatalogueHref("natural", certified, "round")} className={`${link} text-white`}>
                          {natural} natural
                        </Link>
                      ) : null}
                      {natural && lab ? " · " : null}
                      {lab ? (
                        <Link href={cutCatalogueHref("lab", certified, "round")} className={`${link} text-white`}>
                          {lab} lab-grown
                        </Link>
                      ) : null}
                    </>
                  ) : grade === "Poor" ? (
                    "Not stocked"
                  ) : (
                    "None in stock"
                  )}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-white/70">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-[2px] w-6 bg-[#f4dc8a]" /> Light returned to the eye
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="w-6 border-t border-dashed border-white/50" /> Light escaping, lost to the eye
        </span>
      </div>
      <figcaption className="measure mt-4 text-[12px] text-white/70 sm:text-[13px]">
        Schematic side views of a round brilliant, not to scale. A shallow pavilion lets light
        out through the bottom, a deep one through the side. Laboratories grade cut by measuring
        the stone itself, not from diagrams like these.
      </figcaption>
    </figure>
  );
}

/** The scale as a table, with IGI&apos;s Ideal grade — for search engines and screen readers. */
export function CutGradeTable() {
  const rows = [
    {
      grade: "Ideal",
      description: "IGI only, for round brilliants: its top grade, above Excellent. GIA's scale has no equivalent above Excellent.",
    },
    ...GIA_CUT_SCALE.map(({ grade, description }) => ({ grade, description })),
  ];
  return (
    <div className="overflow-x-auto rounded-[22px] border border-hairline">
      <table className="w-full text-left text-[14px] sm:text-[15px]">
        <caption className="sr-only">Diamond cut grades for round brilliants</caption>
        <thead>
          <tr className="border-b border-hairline bg-panel text-[12px] text-ink-muted-panel">
            <th scope="col" className="px-5 py-3 font-normal">Grade</th>
            <th scope="col" className="px-5 py-3 font-normal">What it means</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.grade} className="border-b border-hairline last:border-b-0">
              <th scope="row" className="whitespace-nowrap px-5 py-3.5 font-display text-[18px] font-normal">
                {row.grade}
              </th>
              <td className="px-5 py-3.5 text-ink-muted">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
