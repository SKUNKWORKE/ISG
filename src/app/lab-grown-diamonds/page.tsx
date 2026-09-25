import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, collectionPage } from "@/lib/structured-data";
import { toQueryString } from "@/lib/catalog-filter";
import { INVENTORY_NOTICE, LAB_STONES } from "@/lib/stones";

const DESCRIPTION =
  "Loose lab-grown diamonds in every standard shape, graded and origin-stated. Filter by shape, carat, colour, clarity, cut, polish, symmetry, fluorescence, proportions and certificate, then enquire on any stone.";

export const metadata: Metadata = {
  title: "Lab-grown loose diamonds",
  description: DESCRIPTION,
};

const EDUCATION = [
  {
    heading: "What it is",
    body: "Carbon in the same cubic lattice as a mined diamond, with the same hardness, refractive index and dispersion. It is a diamond by material definition, not a substitute for one.",
  },
  {
    heading: "How it is made",
    body: "Either by chemical vapour deposition, where carbon is layered onto a seed in a plasma chamber, or by high pressure and high temperature, which reproduces mantle conditions directly. Weeks, rather than a geological age.",
  },
  {
    heading: "How to tell",
    body: "Not by eye, and not with a thermal probe. Laboratories identify grown material by its growth structure and trace elements, and every grown stone is laser-inscribed and reported as such.",
  },
  {
    heading: "What it means for you",
    body: "Larger sizes and higher clarity for a given budget, with an origin stated plainly on the report. Resale behaves differently from natural goods, and that is worth understanding before you buy.",
  },
];

export default async function LabGrownDiamondsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const initialQuery = toQueryString(await searchParams);

  const jsonLd = [
    collectionPage({
      name: "Lab-grown loose diamonds",
      description: DESCRIPTION,
      path: "/lab-grown-diamonds",
      total: LAB_STONES.length,
      items: LAB_STONES.map((s) => ({
        path: `/stones/${s.sku}`,
        name: `${s.shapeName} ${s.carat.toFixed(2)} ct, ${s.color}, ${s.clarity}`,
      })),
    }),
    breadcrumbs([{ name: "Lab-grown loose diamonds", path: "/lab-grown-diamonds" }]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
          <h1 className="max-w-[880px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
            Lab-grown loose diamonds
          </h1>
          <p className="measure mt-5 text-ink-muted">
            The same material, a different origin, stated openly on every report. Filter to the
            specification you need and enquire on any stone.
          </p>
        </div>
      </section>

      <section className="border-b border-hairline bg-panel">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16">
          <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)]">
            What lab-grown actually means
          </h2>
          <div className="mt-9 grid gap-px overflow-hidden rounded-[36px] border border-hairline bg-hairline sm:grid-cols-2 xl:grid-cols-4">
            {EDUCATION.map((item) => (
              <div key={item.heading} className="bg-porcelain p-7">
                <h3 className="font-display text-xl">{item.heading}</h3>
                <p className="mt-2.5 text-[14px] text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16">
        <Catalog
          stones={LAB_STONES}
          origin="lab"
          initialQuery={initialQuery}
          notice={INVENTORY_NOTICE}
        />
      </section>
    </>
  );
}
