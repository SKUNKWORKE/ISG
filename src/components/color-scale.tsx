import Link from "next/link";
import {
  COLOR_CATEGORIES,
  SCALE,
  STOCKED_GRADES,
  categoryOf,
  colorCatalogueHref,
  colorEnquiryHref,
  swatchColor,
  type ScaleGrade,
} from "@/lib/color-grades";
import { LAB_STONES, NATURAL_STONES, type Stone } from "@/lib/stones";

const COLUMNS = { gridTemplateColumns: `repeat(${SCALE.length}, minmax(0, 1fr))` };

function stoneLabel(stone: Stone) {
  return `${stone.shapeName} ${stone.carat.toFixed(2)} ct${stone.origin === "lab" ? " lab-grown" : ""}`;
}

/**
 * The D–Z colour scale as a swatch strip, grouped into GIA's five categories.
 *
 * `examples` marks the grades of real stones on the strip. `highlight` dims
 * everything outside a range (the price section uses G–J). `stock` adds
 * catalogue counts and links for the D–J grades we hold. The dark tray is the
 * default because the palest swatches disappear against the porcelain ground.
 */
export function ColorScale({
  examples = [],
  highlight,
  stock = false,
  tone = "dark",
  caption,
}: {
  examples?: Stone[];
  highlight?: [ScaleGrade, ScaleGrade];
  stock?: boolean;
  tone?: "dark" | "light";
  caption?: string;
}) {
  const dark = tone === "dark";
  const muted = dark ? "text-white/70" : "text-ink-muted";
  const marked = new Map<string, Stone[]>();
  for (const stone of examples) marked.set(stone.color, [...(marked.get(stone.color) ?? []), stone]);
  const [lo, hi] = highlight ? highlight.map((g) => SCALE.indexOf(g)) : [-1, -1];

  return (
    <figure
      className={
        dark
          ? "rounded-[36px] bg-ink px-4 py-7 text-white sm:p-10 [&_a:focus-visible]:outline-white"
          : undefined
      }
    >
      <div aria-hidden className="grid gap-x-px" style={COLUMNS}>
        {COLOR_CATEGORIES.map((category) => {
          const start = SCALE.indexOf(category.from);
          const span = SCALE.indexOf(category.to) - start + 1;
          const dim = highlight && (start + span - 1 < lo || start > hi);
          return (
            <p
              key={category.name}
              style={{ gridColumn: `${start + 1} / span ${span}` }}
              className={`mr-1 border-t pt-2 text-[10px] leading-tight sm:text-[13px] ${
                dark ? "border-white/40" : "border-ink"
              } ${dim ? "opacity-40" : ""}`}
            >
              {category.name}
            </p>
          );
        })}
      </div>

      <ol className="mt-3 grid gap-x-px" style={COLUMNS}>
        {SCALE.map((grade, i) => {
          const dim = highlight && (i < lo || i > hi);
          const stones = marked.get(grade);
          return (
            <li key={grade} className="flex flex-col items-center">
              <span
                aria-hidden
                className={`block h-14 w-full sm:h-24 ${
                  i === 0 ? "rounded-l-[8px] sm:rounded-l-[14px]" : ""
                } ${i === SCALE.length - 1 ? "rounded-r-[8px] sm:rounded-r-[14px]" : ""} ${
                  !dark ? "border-y border-hairline first:border-l" : ""
                } ${dim ? "opacity-35" : ""}`}
                style={{ backgroundColor: swatchColor(grade) }}
              />
              <span
                aria-hidden
                className={`mt-2 text-[11px] leading-none tabular-nums sm:text-[16px] ${dim ? "opacity-40" : ""}`}
              >
                {grade}
              </span>
              <span className="sr-only">
                {grade}, {categoryOf(grade).name}
                {stones ? `. In current stock: ${stones.map(stoneLabel).join("; ")}` : ""}
              </span>
              {stones ? (
                <span aria-hidden className="mt-1.5 flex gap-0.5">
                  {stones.map((s) => (
                    <span key={s.sku} className="h-1.5 w-1.5 rounded-full bg-current" />
                  ))}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      {caption ? (
        <figcaption className={`measure mt-6 text-[12px] sm:text-[13px] ${muted}`}>{caption}</figcaption>
      ) : null}

      {stock ? <StockByGrade dark={dark} /> : null}
    </figure>
  );
}

function StockByGrade({ dark }: { dark: boolean }) {
  const count = (stones: Stone[], grade: string) => stones.filter((s) => s.color === grade).length;
  const muted = dark ? "text-white/70" : "text-ink-muted";
  const link = `underline underline-offset-4 transition-opacity duration-200 hover:opacity-75`;

  return (
    <div className={`mt-8 border-t pt-6 ${dark ? "border-white/20" : "border-hairline"}`}>
      <p className={`text-[13px] ${muted}`}>In stock now, by grade</p>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {STOCKED_GRADES.map((grade) => (
          <li
            key={grade}
            className={`rounded-[16px] border p-4 ${dark ? "border-white/15" : "border-hairline"}`}
          >
            <p className="flex items-center gap-2.5 font-display text-[26px] leading-none">
              <span
                aria-hidden
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: swatchColor(grade) }}
              />
              {grade}
            </p>
            <p className="mt-3 text-[13px]">
              <CountLink
                n={count(NATURAL_STONES, grade)}
                label="natural"
                href={colorCatalogueHref("natural", grade)}
                linkClass={link}
                mutedClass={muted}
              />
            </p>
            <p className="mt-1 text-[13px]">
              <CountLink
                n={count(LAB_STONES, grade)}
                label="lab-grown"
                href={colorCatalogueHref("lab", grade)}
                linkClass={link}
                mutedClass={muted}
              />
            </p>
          </li>
        ))}
      </ul>
      <p className={`mt-5 text-[13px] ${muted}`}>
        K to Z are sourced on request.{" "}
        <Link href={colorEnquiryHref("K")} className={`${link} ${dark ? "text-white" : "text-ink"}`}>
          Enquire about a lower grade
        </Link>
      </p>
    </div>
  );
}

/** A count that only links when there is something to open — an empty catalogue is a dead end. */
export function CountLink({
  n,
  label,
  href,
  linkClass,
  mutedClass,
}: {
  n: number;
  label: string;
  href: string;
  linkClass: string;
  mutedClass: string;
}) {
  if (n === 0) return <span className={mutedClass}>None {label}</span>;
  return (
    <Link href={href} className={linkClass}>
      {n} {label}
    </Link>
  );
}

/** The categories as a table — for search engines, screen readers and printing. */
export function ColorGradeTable() {
  return (
    <div className="overflow-x-auto rounded-[22px] border border-hairline">
      <table className="w-full text-left text-[14px] sm:text-[15px]">
        <caption className="sr-only">Diamond colour grades D to Z, by category</caption>
        <thead>
          <tr className="border-b border-hairline bg-panel text-[12px] text-ink-muted-panel">
            <th scope="col" className="px-5 py-3 font-normal">Grade</th>
            <th scope="col" className="px-5 py-3 font-normal">Category</th>
            <th scope="col" className="px-5 py-3 font-normal">What it means</th>
          </tr>
        </thead>
        <tbody>
          {COLOR_CATEGORIES.map((c) => (
            <tr key={c.name} className="border-b border-hairline last:border-b-0">
              <th scope="row" className="whitespace-nowrap px-5 py-3.5 font-normal tabular-nums">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-4 w-8 rounded-[4px] border border-hairline"
                    style={{
                      background: `linear-gradient(to right, ${swatchColor(c.from)}, ${swatchColor(c.to)})`,
                    }}
                  />
                  {c.from}–{c.to}
                </span>
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
