import { SALES_EMAIL, SALES_PHONE, SALES_PHONE_ALT } from "./contact";
import { SITE_URL } from "./stone-specs";

/**
 * schema.org building blocks shared across pages.
 *
 * What is deliberately absent:
 *  - `Offer`. Prices are enquiry-only, and search engines treat an Offer
 *    without a price as an error that invalidates the whole Product. Add
 *    offers here if published prices ever arrive, not page by page.
 *  - `address` on the store. None is published on the site; a made-up or
 *    partial one would do more harm than none. Local-business rich results
 *    need it, so add it here once there is a public address to show.
 */

export const ORG_ID = `${SITE_URL}/#store`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const STORE = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "@id": ORG_ID,
  name: "Imperial Star Gems",
  url: SITE_URL,
  logo: `${SITE_URL}/apple-icon.png`,
  image: `${SITE_URL}/apple-icon.png`,
  description:
    "Loose natural and lab-grown diamonds in every standard shape, and made-to-order diamond jewelry, supplied to trade and private buyers.",
  email: SALES_EMAIL,
  telephone: SALES_PHONE,
  paymentAccepted: "Bank transfer (SWIFT / T/T)",
  contactPoint: [SALES_PHONE, SALES_PHONE_ALT].map((telephone) => ({
    "@type": "ContactPoint",
    contactType: "sales",
    telephone,
    email: SALES_EMAIL,
  })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Diamonds and diamond jewelry",
    itemListElement: [
      { "@type": "OfferCatalog", name: "Natural loose diamonds", url: `${SITE_URL}/natural-diamonds` },
      { "@type": "OfferCatalog", name: "Lab-grown loose diamonds", url: `${SITE_URL}/lab-grown-diamonds` },
      { "@type": "OfferCatalog", name: "Diamond jewelry", url: `${SITE_URL}/jewelry` },
    ],
  },
};

export const WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "Imperial Star Gems",
  url: SITE_URL,
  publisher: { "@id": ORG_ID },
  inLanguage: "en",
};

/** Home › … › current page. `path` is site-relative; the last crumb is the page itself. */
export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * A listing page as a CollectionPage whose main entity is an ItemList of
 * product URLs — the summary-page pattern, where each item is described in
 * full on its own page. Capped so the payload stays small on 2,000-stone lists.
 */
export function collectionPage({
  name,
  description,
  path,
  items,
  total,
}: {
  name: string;
  description: string;
  path: string;
  items: { path: string; name: string }[];
  total: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${path}`,
    isPartOf: { "@id": WEBSITE_ID },
    provider: { "@id": ORG_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: items.slice(0, LIST_LIMIT).map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}${item.path}`,
        name: item.name,
      })),
    },
  };
}

export const LIST_LIMIT = 30;
