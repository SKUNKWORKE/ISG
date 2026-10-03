/**
 * Marks a filtered catalogue address before the first paint.
 *
 * The catalogue pages (natural, lab-grown, jewelry) are prerendered without
 * filters so the CDN can serve them whole, without a server render per visit.
 * A filtered address — a shared link, a guide's `?color=D,E` — is applied by
 * the catalogue once its script has loaded. Until then the prerendered list is
 * the unfiltered one, so this flags the document and globals.css dims anything
 * marked `data-catalog-results`, the same way the list dims while any filter
 * change is loading. The catalogue clears the flag once its own results are on
 * screen.
 *
 * Tracking parameters (utm_*, click IDs) don't count as filters.
 *
 * A server component that emits one inline script and no client JavaScript,
 * like SeasonalThemeScript.
 */
export const CATALOG_PENDING_ATTRIBUTE = "data-catalog-pending";

const SCRIPT = `(function(){try{
var p=new URLSearchParams(location.search),k,i=p.keys();
while(!(k=i.next()).done){if(!/^(utm_|fbclid$|gclid$|msclkid$|ref$)/.test(k.value)){
document.documentElement.setAttribute("${CATALOG_PENDING_ATTRIBUTE}","");break}}
}catch(e){}})();`;

export function CatalogAddressScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
