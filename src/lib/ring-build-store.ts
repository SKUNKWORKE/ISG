import "server-only";
import { getDb, isMongoConfigured } from "./mongodb";
import { newBuildCode, parseSavedBuild, type SavedBuild } from "./saved-builds";

/**
 * Saved ring configurations, keyed by a short code the buyer can read out.
 *
 * Deliberately anonymous: a build carries SKUs and choices, never a name or a
 * contact. Whoever holds the code holds the ring, which is exactly what makes
 * it shareable over WhatsApp, and why there is nothing in it worth guessing.
 */

const COLLECTION = "ringBuilds";

type BuildDoc = {
  code: string;
  build: SavedBuild;
  createdAt: Date;
};

/** False on a checkout with no database, so the UI can fall back to a long link. */
export function canSaveBuilds(): boolean {
  return isMongoConfigured();
}

/**
 * Stores the build under a fresh code. Codes are 32^8 wide, so a collision is
 * vanishingly unlikely — but a unique index and a couple of retries make it
 * impossible rather than unlikely.
 */
export async function saveBuild(build: SavedBuild): Promise<string> {
  const db = await getDb();
  const builds = db.collection<BuildDoc>(COLLECTION);
  await builds.createIndex({ code: 1 }, { unique: true });

  for (let attempt = 0; attempt < 4; attempt++) {
    const code = newBuildCode();
    try {
      await builds.insertOne({ code, build, createdAt: new Date() });
      return code;
    } catch (err) {
      // 11000 is a duplicate key: try another code. Anything else is real.
      if ((err as { code?: number }).code !== 11000) throw err;
    }
  }
  throw new Error("Could not allocate a build code.");
}

export async function findBuild(code: string): Promise<SavedBuild | undefined> {
  if (!isMongoConfigured()) return undefined;
  try {
    const db = await getDb();
    const doc = await db.collection<BuildDoc>(COLLECTION).findOne({ code });
    return doc ? parseSavedBuild(doc.build) : undefined;
  } catch (err) {
    console.error("[ring-build] lookup failed", err);
    return undefined;
  }
}
