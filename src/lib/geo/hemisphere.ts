import type { CountryCode, Hemisphere } from "./types";

/**
 * Country to hemisphere, at country-level precision only.
 *
 * The rule applied throughout: a country is filed by where most of its
 * population lives, not by where its territory reaches. Brazil crosses the
 * equator but São Paulo and Rio are both south of it, so Brazil is southern.
 * The United States has Hawaii in the tropics and Alaska in the Arctic, and is
 * simply northern.
 *
 * `EQUATORIAL` is the set where four-season theming does not describe the
 * weather at all. Singapore does not have an autumn. These get the neutral
 * theme rather than a season they don't experience — which is a more accurate
 * answer than picking the nearest hemisphere.
 *
 * Everything not listed defaults to northern, because roughly ninety percent of
 * the world's population lives there.
 */

/** Population centre lies south of the equator, with a genuine seasonal cycle. */
const SOUTHERN = new Set<CountryCode>([
  "AO", // Angola
  "AQ", // Antarctica
  "AR", // Argentina
  "AU", // Australia
  "BO", // Bolivia
  "BR", // Brazil — population centre is south
  "BV", // Bouvet Island
  "BW", // Botswana
  "CC", // Cocos (Keeling) Islands
  "CK", // Cook Islands
  "CL", // Chile
  "CX", // Christmas Island
  "FJ", // Fiji
  "FK", // Falkland Islands
  "GS", // South Georgia
  "HM", // Heard & McDonald Islands
  "IO", // British Indian Ocean Territory
  "KM", // Comoros
  "LS", // Lesotho
  "MG", // Madagascar
  "MU", // Mauritius
  "MW", // Malawi
  "MZ", // Mozambique
  "NA", // Namibia
  "NC", // New Caledonia
  "NF", // Norfolk Island
  "NU", // Niue
  "NZ", // New Zealand
  "PE", // Peru — Lima is south of the equator
  "PF", // French Polynesia
  "PG", // Papua New Guinea
  "PN", // Pitcairn
  "PY", // Paraguay
  "RE", // Réunion
  "SB", // Solomon Islands
  "SC", // Seychelles
  "SH", // Saint Helena
  "SZ", // Eswatini
  "TF", // French Southern Territories
  "TL", // Timor-Leste
  "TO", // Tonga
  "TV", // Tuvalu
  "UY", // Uruguay
  "VU", // Vanuatu
  "WF", // Wallis & Futuna
  "WS", // Samoa
  "ZA", // South Africa
  "ZM", // Zambia
  "ZW", // Zimbabwe
]);

/**
 * Tropical band, where the year runs on wet and dry rather than four seasons.
 *
 * Filed separately so these visitors get the neutral theme instead of a
 * northern or southern season that would misdescribe their weather entirely.
 */
const EQUATORIAL = new Set<CountryCode>([
  "BI", // Burundi
  "BN", // Brunei
  "CD", // DR Congo
  "CF", // Central African Republic
  "CG", // Republic of the Congo
  "CM", // Cameroon
  "CO", // Colombia
  "EC", // Ecuador
  "ER", // Eritrea
  "ET", // Ethiopia
  "GA", // Gabon
  "GH", // Ghana
  "GQ", // Equatorial Guinea
  "ID", // Indonesia
  "KE", // Kenya
  "KI", // Kiribati
  "LK", // Sri Lanka
  "LR", // Liberia
  "MV", // Maldives
  "MY", // Malaysia
  "NR", // Nauru
  "PW", // Palau
  "RW", // Rwanda
  "SG", // Singapore
  "SO", // Somalia
  "SS", // South Sudan
  "ST", // São Tomé & Príncipe
  "TZ", // Tanzania
  "UG", // Uganda
]);

export function countryHemisphere(code: CountryCode | null | undefined): Hemisphere {
  if (!code) return "unknown";
  const upper = code.toUpperCase();
  if (SOUTHERN.has(upper)) return "southern";
  if (EQUATORIAL.has(upper)) return "equatorial";
  // Two letters that aren't in either set: assume northern, where most people are.
  return /^[A-Z]{2}$/.test(upper) ? "northern" : "unknown";
}

/** Exposed for the timezone fallback, which needs the same sets client-side. */
export const SOUTHERN_COUNTRIES: ReadonlySet<CountryCode> = SOUTHERN;
export const EQUATORIAL_COUNTRIES: ReadonlySet<CountryCode> = EQUATORIAL;
