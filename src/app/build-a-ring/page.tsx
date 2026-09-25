import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RingBuilderReview } from "@/components/ring-builder-review";
import { SavedBuilds } from "@/components/saved-builds";
import { ShapeGlyph } from "@/components/shape-glyph";
import { METALS, PURITIES, metalsLine, type Metal, type Purity } from "@/lib/jewelry";
import { findBuild } from "@/lib/ring-build-store";
import {
  SETTING_STYLES,
  STYLE_NAME,
  builderHref,
  readBuildParams,
  type BuildParams,
  type SettingDesign,
} from "@/lib/ring-builder";
import { SHAPES_WITH_DESIGNS, designsForShape, findSettingDesign } from "@/lib/real-settings";
import { parseUsSize } from "@/lib/ring-sizes";
import { BUILD_CODE_RE } from "@/lib/saved-builds";
import { SHAPES, SHAPE_BY_SLUG, type ShapeSlug } from "@/lib/shapes";
import { ALL_STONES, findStone, type Stone } from "@/lib/stones";

export const metadata: Metadata = {
  title: "Build your own diamond ring",
  description:
    "Choose a loose natural or lab-grown diamond, pair it with one of our ring designs, and pick the metal, purity and ring size. Made to order; price on enquiry.",
  alternates: { canonical: "/build-a-ring" },
};

/** `?setting=custom`: the buyer wants a design suggested rather than one of ours. */
const CUSTOM = "custom";
const PAGE_SIZE = 24;

type Step = "stone" | "setting" | "review";

export default async function BuildARingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = readBuildParams(await searchParams);

  // A saved code on its own is a ring to reopen. Expanding it into the full
  // builder URL, rather than reading the record on every render, means every
  // later change edits the link the buyer now holds — and that clearing a
  // choice clears it, instead of the stored value quietly returning.
  const codeOnly = params.build && Object.keys(params).length === 1 ? params.build : undefined;
  const saved = codeOnly && BUILD_CODE_RE.test(codeOnly) ? await findBuild(codeOnly) : undefined;
  if (saved) redirect(builderHref({ ...saved, build: codeOnly }));

  const stone = params.stone ? findStone(params.stone) : undefined;
  const found = params.setting && params.setting !== CUSTOM ? findSettingDesign(params.setting) : undefined;
  // A design made for another shape can't simply take this stone; ask again.
  const mismatch = Boolean(stone && found && found.centreShape !== stone.shape);
  const design = mismatch ? undefined : found;
  const custom = params.setting === CUSTOM || (stone ? !SHAPES_WITH_DESIGNS.has(stone.shape) : false);

  const step: Step = !stone ? "stone" : design || custom ? "review" : "setting";

  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16">
          <Link
            href="/jewelry?type=ring"
            className="text-[13px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
          >
            Diamond rings
          </Link>
          <h1 className="mt-4 max-w-[880px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
            Build your own ring
          </h1>
          <p className="measure mt-5 text-ink-muted">
            Choose a loose diamond, choose one of our ring designs, and we make the ring to order
            with the head fitted to your stone. Every price is quoted on enquiry.
          </p>
          <Stepper step={step} params={params} stone={stone} design={design} custom={custom} />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16">
        {codeOnly ? (
          <p className="mb-8 rounded-[16px] border border-hairline px-5 py-4 text-[14px] text-ink-muted">
            We could not find a saved ring under{" "}
            <span className="tabular-nums tracking-[0.08em] text-ink">{codeOnly.slice(0, 12)}</span>.
            Check the code, or start again below — nothing is lost, the stones are all still here.
          </p>
        ) : null}

        {mismatch && found && stone ? (
          <p className="mb-8 rounded-[16px] border border-hairline px-5 py-4 text-[14px] text-ink-muted">
            The {found.name} is designed for {withArticle(SHAPE_BY_SLUG[found.centreShape].name)} centre
            stone, so here are the designs made for your {stone.shapeName.toLowerCase()}.
          </p>
        ) : null}

        {step === "stone" ? <StoneStep params={params} design={design} /> : null}
        {step === "setting" && stone ? <SettingStep params={params} stone={stone} /> : null}
        {step === "review" && stone ? (
          <RingBuilderReview
            key={`${stone.sku}-${design?.sku ?? CUSTOM}`}
            stone={snapshot(stone)}
            design={design ?? null}
            params={params}
            initialMetal={(METALS as readonly string[]).includes(params.metal ?? "") ? (params.metal as Metal) : undefined}
            initialPurity={(PURITIES as readonly string[]).includes(params.purity ?? "") ? (params.purity as Purity) : undefined}
            initialSize={parseUsSize(params.size)}
            initialEngraving={params.engraving}
          />
        ) : null}

        {step === "stone" ? <SavedBuilds /> : null}
      </section>
    </>
  );
}

/** "an oval", "an asscher", "a round". */
function withArticle(shapeName: string) {
  const word = shapeName.toLowerCase();
  return `${/^[aeiou]/.test(word) ? "an" : "a"} ${word}`;
}

/** What the browser needs of a stone — the same shape the shortlist stores. */
function snapshot({ shapeCode: _c, featured: _f, ...stone }: Stone) {
  return stone;
}

/* ------------------------------------------------------------ stepper */

function Stepper({
  step,
  params,
  stone,
  design,
  custom,
}: {
  step: Step;
  params: BuildParams;
  stone?: Stone;
  design?: SettingDesign;
  custom: boolean;
}) {
  const items: { id: Step; label: string; detail?: string; href?: string }[] = [
    {
      id: "stone",
      label: "Stone",
      detail: stone ? `${stone.shapeName} ${stone.carat.toFixed(2)} ct` : undefined,
      href: stone ? builderHref(params, { stone: undefined, page: undefined }) : undefined,
    },
    {
      id: "setting",
      label: "Setting",
      detail: design ? STYLE_NAME[design.style] : custom && stone ? "Made to order" : undefined,
      href:
        stone && (design || params.setting === CUSTOM)
          ? builderHref(params, { setting: undefined, style: undefined })
          : undefined,
    },
    { id: "review", label: "Metal, size & enquiry" },
  ];
  const order: Step[] = ["stone", "setting", "review"];

  return (
    <ol className="mt-10 grid gap-3 sm:grid-cols-3">
      {items.map((item, i) => {
        const current = item.id === step;
        const done = order.indexOf(item.id) < order.indexOf(step);
        const body = (
          <>
            <span className="text-[12px] text-ink-muted">
              {i + 1}. {item.label}
            </span>
            <span className="mt-0.5 block truncate text-[15px]">
              {item.detail ?? (current ? "Choose" : "—")}
            </span>
            {done && item.href ? (
              <span className="mt-0.5 block text-[12px] text-ink-muted underline underline-offset-4">Change</span>
            ) : null}
          </>
        );
        return (
          <li
            key={item.id}
            aria-current={current ? "step" : undefined}
            className={`rounded-[16px] border px-4 py-3 ${current ? "border-ink" : "border-hairline"}`}
          >
            {done && item.href ? (
              <Link href={item.href} className="block">
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------ step 1: stone */

function StoneStep({ params, design }: { params: BuildParams; design?: SettingDesign }) {
  const fixedShape = design?.centreShape;
  const shape = (fixedShape ?? (SHAPE_BY_SLUG[params.shape as ShapeSlug] ? params.shape : undefined)) as
    | ShapeSlug
    | undefined;
  const origin = params.origin === "natural" || params.origin === "lab" ? params.origin : undefined;
  const cmin = Number.parseFloat(params.cmin ?? "");
  const cmax = Number.parseFloat(params.cmax ?? "");
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const matches = ALL_STONES.filter(
    (s) =>
      (!shape || s.shape === shape) &&
      (!origin || s.origin === origin) &&
      (!Number.isFinite(cmin) || s.carat >= cmin) &&
      (!Number.isFinite(cmax) || s.carat <= cmax),
  ).sort((a, b) =>
    design
      ? Math.abs(a.carat - design.centreCarat) - Math.abs(b.carat - design.centreCarat)
      : a.carat - b.carat,
  );
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const shown = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const field = "mt-1.5 w-full rounded-input border border-hairline bg-porcelain px-3 py-2 text-[15px]";

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-12">
      <aside className="lg:sticky lg:top-[96px] lg:h-fit">
        {design ? <DesignSummary design={design} params={params} /> : null}

        {/* A plain GET form: filtering works without any JavaScript. */}
        <form action="/build-a-ring" method="get" className="space-y-4">
          {(["setting", "metal", "purity", "size", "engraving", "build"] as const).map((key) =>
            params[key] ? <input key={key} type="hidden" name={key} value={params[key]} /> : null,
          )}
          <h2 className="font-display text-[26px] leading-none">Choose a stone</h2>
          {fixedShape ? (
            <p className="text-[14px] text-ink-muted">
              Showing {SHAPE_BY_SLUG[fixedShape].name.toLowerCase()} stones, closest in size to the
              design first.
            </p>
          ) : (
            <label className="block text-[13px] text-ink-muted">
              Shape
              <select name="shape" defaultValue={shape ?? ""} className={field}>
                <option value="">Any shape</option>
                {SHAPES.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="block text-[13px] text-ink-muted">
            Origin
            <select name="origin" defaultValue={origin ?? ""} className={field}>
              <option value="">Natural and lab-grown</option>
              <option value="natural">Natural</option>
              <option value="lab">Lab-grown</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-[13px] text-ink-muted">
              Min carat
              <input name="cmin" type="number" step="0.01" min="0" inputMode="decimal" defaultValue={params.cmin} className={field} />
            </label>
            <label className="block text-[13px] text-ink-muted">
              Max carat
              <input name="cmax" type="number" step="0.01" min="0" inputMode="decimal" defaultValue={params.cmax} className={field} />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-ink px-6 py-2.5 text-[14px] text-white transition-opacity duration-200 hover:opacity-85"
          >
            Show stones
          </button>
          <p className="text-[13px] text-ink-muted">
            Prefer the full filters? Browse{" "}
            <Link href="/natural-diamonds" className="underline underline-offset-4 hover:text-ink">natural</Link> or{" "}
            <Link href="/lab-grown-diamonds" className="underline underline-offset-4 hover:text-ink">lab-grown</Link>{" "}
            stock and choose &ldquo;Set this stone in a ring&rdquo; on any stone.
          </p>
        </form>
      </aside>

      <div>
        <p className="text-[14px] text-ink-muted">
          <span className="tabular-nums">{matches.length}</span> {matches.length === 1 ? "stone" : "stones"}
        </p>
        {shown.length ? (
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((s) => (
              <li key={s.sku} className="group flex flex-col rounded-[22px] border border-hairline p-5 transition-colors duration-300 hover:border-metal">
                <div className="flex items-center gap-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-panel">
                    <ShapeGlyph geometry={SHAPE_BY_SLUG[s.shape].geometry} className="glyph-auto h-11 w-11" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-[22px] leading-none">
                      {s.shapeName} {s.carat.toFixed(2)}
                      <span className="text-[15px] text-ink-muted"> ct</span>
                    </h3>
                    <p className="mt-1 truncate text-[13px] text-ink-muted">
                      {s.color} · {s.clarity} · {s.origin === "natural" ? "Natural" : "Lab-grown"} · {s.lab}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <Link href={`/stones/${s.sku}`} className="text-[13px] text-ink-muted underline underline-offset-4 hover:text-ink">
                    Details<span className="sr-only"> for {s.sku}</span>
                  </Link>
                  <Link
                    href={builderHref(params, {
                      stone: s.sku,
                      shape: undefined,
                      origin: undefined,
                      cmin: undefined,
                      cmax: undefined,
                      page: undefined,
                    })}
                    className="rounded-full border border-ink px-5 py-2 text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white"
                  >
                    Choose<span className="sr-only"> {s.shapeName} {s.carat.toFixed(2)} carat, {s.sku}</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-[16px] bg-panel px-6 py-8 text-ink-muted-panel">
            No stones match. Widen the carat range, or{" "}
            <Link href="/contact" className="underline underline-offset-4">ask us to source one</Link>.
          </p>
        )}
        {pages > 1 ? (
          <nav aria-label="Pages" className="mt-8 flex items-center justify-between text-[14px]">
            {page > 1 ? (
              <Link href={builderHref(params, { page: String(page - 1) })} className="underline underline-offset-4">
                Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="tabular-nums text-ink-muted">
              Page {page} of {pages}
            </span>
            {page < pages ? (
              <Link href={builderHref(params, { page: String(page + 1) })} className="underline underline-offset-4">
                Next
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function DesignSummary({ design, params }: { design: SettingDesign; params: BuildParams }) {
  const cover = design.images[0];
  return (
    <div className="mb-8 flex items-center gap-4 border-b border-hairline pb-6">
      {cover ? (
        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[14px] bg-panel">
          <Image src={cover.src} alt="" fill sizes="64px" className="object-cover" />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-[12px] text-ink-muted">Your setting</p>
        <p className="truncate text-[15px]">{STYLE_NAME[design.style]}</p>
        <Link
          href={builderHref(params, { setting: undefined })}
          className="text-[12px] text-ink-muted underline underline-offset-4 hover:text-ink"
        >
          Change
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ step 2: setting */

function SettingStep({ params, stone }: { params: BuildParams; stone: Stone }) {
  const all = designsForShape(stone.shape).sort(
    (a, b) => Math.abs(a.centreCarat - stone.carat) - Math.abs(b.centreCarat - stone.carat),
  );
  const styles = SETTING_STYLES.filter((s) => all.some((d) => d.style === s));
  const style = styles.find((s) => s === params.style);
  const designs = style ? all.filter((d) => d.style === style) : all;

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-[14px] transition-colors duration-200 ${
      active ? "border-ink bg-ink text-white" : "border-hairline hover:border-ink"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none">Choose a setting</h2>
          <p className="measure mt-3 text-ink-muted">
            Designs made for {withArticle(stone.shapeName)} centre stone, closest in size to your{" "}
            {stone.carat.toFixed(2)} ct stone first. Each is remade with the head fitted to your stone.
          </p>
        </div>
        {styles.length > 1 ? (
          <nav aria-label="Setting style" className="flex flex-wrap gap-2">
            <Link href={builderHref(params, { style: undefined })} aria-current={!style ? "true" : undefined} className={chip(!style)}>
              All <span className="tabular-nums opacity-70">{all.length}</span>
            </Link>
            {styles.map((s) => (
              <Link key={s} href={builderHref(params, { style: s })} aria-current={style === s ? "true" : undefined} className={chip(style === s)}>
                {STYLE_NAME[s]}{" "}
                <span className="tabular-nums opacity-70">{all.filter((d) => d.style === s).length}</span>
              </Link>
            ))}
          </nav>
        ) : null}
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {designs.map((d) => {
          const cover = d.images[0];
          const choose = builderHref(params, { setting: d.sku, style: undefined });
          return (
            <li key={d.sku} className="group flex flex-col rounded-[22px] border border-hairline p-4 transition-colors duration-300 hover:border-metal">
              <Link href={choose} tabIndex={-1} aria-hidden className="relative block aspect-square overflow-hidden rounded-[16px] bg-panel">
                {cover ? (
                  <Image src={cover.src} alt="" fill sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                ) : null}
              </Link>
              <p className="mt-4 text-[12px] text-ink-muted">{STYLE_NAME[d.style]}</p>
              <h3 className="mt-1 line-clamp-2 font-display text-[19px] leading-[1.15]">{d.name}</h3>
              <p className="mt-2 text-[13px] text-ink-muted">
                Shown with a {d.centreCarat.toFixed(2)} ct centre · {metalsLine(d)}
              </p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                <Link href={`/jewelry/${d.sku}`} className="text-[13px] text-ink-muted underline underline-offset-4 hover:text-ink">
                  Details<span className="sr-only"> of {d.name}</span>
                </Link>
                <Link
                  href={choose}
                  className="rounded-full border border-ink px-5 py-2 text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white"
                >
                  Choose<span className="sr-only"> {d.name}</span>
                </Link>
              </div>
            </li>
          );
        })}
        <li className="flex flex-col justify-between rounded-[22px] bg-panel p-6">
          <div>
            <h3 className="font-display text-[24px] leading-tight">Something else in mind?</h3>
            <p className="mt-3 text-[14px] text-ink-muted-panel">
              Describe the ring you want and we will suggest a made-to-order setting for this stone.
            </p>
          </div>
          <Link
            href={builderHref(params, { setting: CUSTOM, style: undefined })}
            className="mt-6 rounded-full border border-ink px-5 py-2.5 text-center text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white"
          >
            Ask for a design
          </Link>
        </li>
      </ul>
    </div>
  );
}
