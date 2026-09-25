import "server-only";

import { AddressNotFoundError, Reader } from "@maxmind/geoip2-node";
import { normaliseCountryCode } from "../countries";
import type { CountryCode } from "../types";

/**
 * Local MaxMind GeoLite2 lookups.
 *
 * This is the source that makes the feature self-hosted: an in-process lookup
 * against a memory-mapped file, with no network call and therefore no rate
 * limit to design around.
 *
 * The database is deliberately optional and is not committed to the repository.
 * GeoLite2 is free but its licence requires each user to accept the EULA and
 * download it under their own account key, so shipping a copy here would be
 * redistributing it on someone else's behalf. Point `GEOLITE2_COUNTRY_DB` at a
 * downloaded `GeoLite2-Country.mmdb` and this source switches itself on; leave
 * it unset and the chain quietly falls through to the network fallback.
 *
 * See `docs/geolocation.md` for the download and refresh steps.
 */

/** The opened-database type, taken from the API so no deep import is needed. */
type ReaderModel = Awaited<ReturnType<typeof Reader.open>>;

/**
 * Loaded once per process and held.
 *
 * The promise itself is cached rather than the reader, so concurrent requests
 * during startup share one open instead of racing to open the file several
 * times. `null` means "known unavailable" and is never retried — without it, a
 * missing file would cost a failed filesystem call on every single request.
 */
let readerPromise: Promise<ReaderModel | null> | null = null;

function databasePath(): string | null {
  const configured = process.env.GEOLITE2_COUNTRY_DB?.trim();
  return configured ? configured : null;
}

async function loadReader(): Promise<ReaderModel | null> {
  const path = databasePath();
  if (!path) return null;

  try {
    return await Reader.open(path);
  } catch (error) {
    // A misconfigured path should degrade to the next source, not take the page
    // down — but it is a deployment mistake, so say so once, loudly, at startup.
    console.warn(
      `[geo] GEOLITE2_COUNTRY_DB is set to "${path}" but the database could not be opened. ` +
        `Falling back to the network IP service. ${(error as Error).message}`,
    );
    return null;
  }
}

/** True when a database is configured and opened, for diagnostics and docs. */
export async function isMaxmindAvailable(): Promise<boolean> {
  readerPromise ??= loadReader();
  return (await readerPromise) !== null;
}

export async function countryFromMaxmind(ip: string | null): Promise<CountryCode | null> {
  if (!ip) return null;

  readerPromise ??= loadReader();
  const reader = await readerPromise;
  if (!reader) return null;

  try {
    return normaliseCountryCode(reader.country(ip).country?.isoCode);
  } catch (error) {
    // An address genuinely absent from the database is an ordinary outcome,
    // not a fault: the chain moves on. Anything else is worth a line in the log.
    if (!(error instanceof AddressNotFoundError)) {
      console.warn(`[geo] MaxMind lookup failed: ${(error as Error).message}`);
    }
    return null;
  }
}
