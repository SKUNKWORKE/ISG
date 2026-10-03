import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { CatalogAddressScript } from "@/components/catalog-address-script";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, collectionPage } from "@/lib/structured-data";
import { catalogSummary, searchCatalog } from "@/lib/catalog-search";
import { INVENTORY_NOTICE, NATURAL_STONES } from "@/lib/stones";

const DESCRIPTION =
  "Loose natural diamonds in every standard shape, graded by independent laboratory. Filter by shape, carat, colour, clarity, cut, polish, symmetry, fluorescence, proportions and certificate, then enquire on any stone.";

export const metadata: Metadata = {
  title: "Natural loose diamonds",
  description: DESCRIPTION,
  // Every filtered view is the same page; ?shape=, ?sort= and the rest point here.
  alternates: { canonical: "/natural-diamonds" },
};

/**
 * Static: the page doesn't read its query string, so it is prerendered once
 * and served from the CDN rather than rendered for every visit. Filters in the
 * address are applied by the catalogue in the browser, through /api/stones.
 */
export default function NaturalDiamondsPage() {
  const firstPage = searchCatalog("natural", new URLSearchParams());

  const jsonLd = [
    collectionPage({
      name: "Natural loose diamonds",
      description: DESCRIPTION,
      path: "/natural-diamonds",
      total: NATURAL_STONES.length,
      items: NATURAL_STONES.map((s) => ({
        path: `/stones/${s.sku}`,
        name: `${s.shapeName} ${s.carat.toFixed(2)} ct, ${s.color}, ${s.clarity}`,
      })),
    }),
    breadcrumbs([{ name: "Natural loose diamonds", path: "/natural-diamonds" }]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
          <h1 className="max-w-[880px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
            Natural loose diamonds
          </h1>
          <p className="measure mt-5 text-ink-muted">
            Stones selected individually rather than bought as parcels, each one graded by an
            independent laboratory before it reaches this list. Filter down to the specification
            you need and enquire — we will send the report, images and availability.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16">
        <CatalogAddressScript />
        <Catalog
          origin="natural"
          summary={catalogSummary("natural")}
          firstPage={firstPage}
          notice={INVENTORY_NOTICE}
        />
      </section>
    </>
  );
}
