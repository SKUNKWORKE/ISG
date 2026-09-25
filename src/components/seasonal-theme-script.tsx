import { GEO_COOKIE } from "@/lib/geo/constants";

/**
 * Picks the seasonal theme before the first paint.
 *
 * A server component on purpose: it emits one inline script tag and no client
 * JavaScript at all. The script reads the cookie the proxy wrote and stamps
 * `data-season` on the document element, so the right palette is in place
 * before anything is drawn.
 *
 * This is what lets the theming be flash-free without making any page dynamic.
 * Reading cookies in the layout would force every route to render per request;
 * this keeps the HTML static and CDN-cacheable, with only the cookie varying.
 *
 * The season is computed from the hemisphere letter and the current month
 * rather than read from a stored theme name, so a cookie written in August is
 * still correct in September.
 *
 * It deliberately does not attempt the timezone fallback. That would mean
 * inlining the zone dataset into every page to serve the small minority of
 * visitors with no cookie, who `SeasonalThemeSync` corrects a few milliseconds
 * later anyway.
 *
 * Keep the month table in step with `NORTHERN_BY_MONTH` in lib/geo/season.ts —
 * the two are checked against each other in docs/geolocation.md's test notes.
 */
const THEME_SCRIPT = `(function(){try{
var m=document.cookie.match(/(?:^|; )${GEO_COOKIE}=([^;]*)/);if(!m)return;
var p=decodeURIComponent(m[1]).split("|");var h=p[1];var c=p[0];
if(!h||h==="u"||h==="e")return;
var n=[3,3,0,0,0,1,1,1,2,2,2,3][new Date().getUTCMonth()];
if(h==="s")n=(n+2)%4;
var r=document.documentElement;
r.setAttribute("data-season",["spring","summer","autumn","winter"][n]);
if(c)r.setAttribute("data-country",c);
}catch(e){}})();`;

export function SeasonalThemeScript() {
  return (
    // The content is a build-time constant with no interpolated request data,
    // and it has to run before paint, which rules out next/script strategies.
    <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
  );
}
