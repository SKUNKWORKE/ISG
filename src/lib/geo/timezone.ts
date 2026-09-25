import { EQUATORIAL_COUNTRIES, SOUTHERN_COUNTRIES } from "./hemisphere";
import type { CountryCode, Hemisphere } from "./types";

/**
 * Hemisphere and country guesses from IANA timezone identifiers.
 *
 * This is the instant client-side fallback: it costs nothing, needs no network,
 * and is available before the first paint. It is also the weakest source in the
 * chain, because a timezone describes a device's settings rather than where the
 * device is. A traveller keeps their home timezone until they change it.
 *
 * So this is used for two things only — picking a provisional theme before the
 * server answers, and salvaging a hemisphere when no IP lookup succeeded. The
 * badge never claims a country on this evidence alone.
 *
 * Only the tropical and southern zones are enumerated. The northern temperate
 * zones are the overwhelming majority and fall out as the default, which keeps
 * this a short list instead of a copy of the tz database.
 */

/** Zone prefixes that are entirely within one hemisphere. */
const SOUTHERN_PREFIXES = ["Australia/", "Antarctica/", "Indian/Kerguelen"];

/** Individual zones whose population sits south of the equator. */
const SOUTHERN_ZONES = new Set([
  "America/Argentina/Buenos_Aires",
  "America/Argentina/Cordoba",
  "America/Argentina/Mendoza",
  "America/Argentina/Salta",
  "America/Argentina/Tucuman",
  "America/Argentina/Ushuaia",
  "America/Asuncion",
  "America/Bahia",
  "America/Belem",
  "America/Campo_Grande",
  "America/Cuiaba",
  "America/Fortaleza",
  "America/La_Paz",
  "America/Lima",
  "America/Maceio",
  "America/Montevideo",
  "America/Noronha",
  "America/Punta_Arenas",
  "America/Recife",
  "America/Santiago",
  "America/Sao_Paulo",
  "Africa/Blantyre",
  "Africa/Gaborone",
  "Africa/Harare",
  "Africa/Johannesburg",
  "Africa/Lubumbashi",
  "Africa/Luanda",
  "Africa/Lusaka",
  "Africa/Maputo",
  "Africa/Maseru",
  "Africa/Mbabane",
  "Africa/Windhoek",
  "Atlantic/Stanley",
  "Indian/Antananarivo",
  "Indian/Mauritius",
  "Indian/Mayotte",
  "Indian/Reunion",
  "Pacific/Apia",
  "Pacific/Auckland",
  "Pacific/Chatham",
  "Pacific/Efate",
  "Pacific/Fiji",
  "Pacific/Guadalcanal",
  "Pacific/Norfolk",
  "Pacific/Noumea",
  "Pacific/Pago_Pago",
  "Pacific/Port_Moresby",
  "Pacific/Rarotonga",
  "Pacific/Tahiti",
  "Pacific/Tongatapu",
]);

/** Zones in the tropical band, where a four-season theme would misdescribe the year. */
const EQUATORIAL_ZONES = new Set([
  "Africa/Accra",
  "Africa/Addis_Ababa",
  "Africa/Asmara",
  "Africa/Bangui",
  "Africa/Brazzaville",
  "Africa/Bujumbura",
  "Africa/Dar_es_Salaam",
  "Africa/Douala",
  "Africa/Juba",
  "Africa/Kampala",
  "Africa/Kigali",
  "Africa/Kinshasa",
  "Africa/Libreville",
  "Africa/Malabo",
  "Africa/Mogadishu",
  "Africa/Monrovia",
  "Africa/Nairobi",
  "Africa/Sao_Tome",
  "America/Bogota",
  "America/Guayaquil",
  "Asia/Brunei",
  "Asia/Colombo",
  "Asia/Jakarta",
  "Asia/Jayapura",
  "Asia/Kuala_Lumpur",
  "Asia/Kuching",
  "Asia/Makassar",
  "Asia/Pontianak",
  "Asia/Singapore",
  "Indian/Maldives",
  "Pacific/Galapagos",
  "Pacific/Nauru",
  "Pacific/Palau",
  "Pacific/Tarawa",
]);

/**
 * Timezone to country, for the zones where the mapping is unambiguous.
 *
 * Deliberately partial. It covers major population centres so the provisional
 * badge has something to show, and returns null everywhere else rather than
 * guessing — an unfamiliar zone yields a hemisphere but no country.
 */
const ZONE_COUNTRY: Record<string, CountryCode> = {
  "Africa/Cairo": "EG",
  "Africa/Johannesburg": "ZA",
  "Africa/Lagos": "NG",
  "Africa/Nairobi": "KE",
  "America/Argentina/Buenos_Aires": "AR",
  "America/Bogota": "CO",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Halifax": "CA",
  "America/Lima": "PE",
  "America/Los_Angeles": "US",
  "America/Mexico_City": "MX",
  "America/Montevideo": "UY",
  "America/New_York": "US",
  "America/Phoenix": "US",
  "America/Santiago": "CL",
  "America/Sao_Paulo": "BR",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "Asia/Bangkok": "TH",
  "Asia/Colombo": "LK",
  "Asia/Dhaka": "BD",
  "Asia/Dubai": "AE",
  "Asia/Ho_Chi_Minh": "VN",
  "Asia/Hong_Kong": "HK",
  "Asia/Jakarta": "ID",
  "Asia/Jerusalem": "IL",
  "Asia/Karachi": "PK",
  "Asia/Kolkata": "IN",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Manila": "PH",
  "Asia/Riyadh": "SA",
  "Asia/Seoul": "KR",
  "Asia/Shanghai": "CN",
  "Asia/Singapore": "SG",
  "Asia/Taipei": "TW",
  "Asia/Tokyo": "JP",
  "Australia/Adelaide": "AU",
  "Australia/Brisbane": "AU",
  "Australia/Melbourne": "AU",
  "Australia/Perth": "AU",
  "Australia/Sydney": "AU",
  "Europe/Amsterdam": "NL",
  "Europe/Athens": "GR",
  "Europe/Berlin": "DE",
  "Europe/Brussels": "BE",
  "Europe/Bucharest": "RO",
  "Europe/Budapest": "HU",
  "Europe/Copenhagen": "DK",
  "Europe/Dublin": "IE",
  "Europe/Helsinki": "FI",
  "Europe/Lisbon": "PT",
  "Europe/London": "GB",
  "Europe/Madrid": "ES",
  "Europe/Moscow": "RU",
  "Europe/Oslo": "NO",
  "Europe/Paris": "FR",
  "Europe/Prague": "CZ",
  "Europe/Rome": "IT",
  "Europe/Stockholm": "SE",
  "Europe/Vienna": "AT",
  "Europe/Warsaw": "PL",
  "Europe/Zurich": "CH",
  "Pacific/Auckland": "NZ",
  "Pacific/Fiji": "FJ",
  "Pacific/Honolulu": "US",
};

export function hemisphereFromTimezone(timeZone: string | null | undefined): Hemisphere {
  if (!timeZone) return "unknown";
  if (SOUTHERN_ZONES.has(timeZone)) return "southern";
  if (EQUATORIAL_ZONES.has(timeZone)) return "equatorial";
  if (SOUTHERN_PREFIXES.some((prefix) => timeZone.startsWith(prefix))) return "southern";

  // A recognisable Region/City identifier we simply don't list is northern by
  // default; anything that isn't shaped like a zone tells us nothing at all.
  return timeZone.includes("/") || timeZone === "UTC" ? "northern" : "unknown";
}

export function countryFromTimezone(timeZone: string | null | undefined): CountryCode | null {
  if (!timeZone) return null;
  return ZONE_COUNTRY[timeZone] ?? null;
}

/**
 * Hemisphere implied by a country code, without importing the server module.
 *
 * Mirrors `countryHemisphere` but reuses the exported sets, so the client and
 * server can never disagree about which half of the world a country is in.
 */
export function hemisphereFromCountry(code: CountryCode | null): Hemisphere {
  if (!code) return "unknown";
  const upper = code.toUpperCase();
  if (SOUTHERN_COUNTRIES.has(upper)) return "southern";
  if (EQUATORIAL_COUNTRIES.has(upper)) return "equatorial";
  return /^[A-Z]{2}$/.test(upper) ? "northern" : "unknown";
}
