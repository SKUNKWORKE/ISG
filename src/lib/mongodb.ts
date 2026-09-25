import { MongoClient, type Db } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

/**
 * Pooled MongoDB client. The URI comes from the Vercel MongoDB integration,
 * which names the variable after the project rather than the usual MONGODB_URI.
 *
 * Two things make this safe on serverless. attachDatabasePool keeps the
 * instance alive long enough for idle connections to leave the pool instead of
 * being severed mid-suspend, and the client promise is cached on globalThis so
 * that HMR in dev reuses one pool rather than opening a new one per reload.
 */

const URI = process.env.imperialstargem_MONGODB_URI;

/** The connection string carries no database path, so the name is set here. */
const DB_NAME = process.env.MONGODB_DB || "imperialstargem";

declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

/** False on a checkout with no URI configured, so callers can degrade instead of throwing. */
export function isMongoConfigured(): boolean {
  return Boolean(URI);
}

function clientPromise(): Promise<MongoClient> {
  if (!URI) {
    throw new Error("imperialstargem_MONGODB_URI is not set.");
  }
  if (!globalThis.__mongoClientPromise) {
    // maxIdleTimeMS is what attachDatabasePool watches to retire connections.
    const client = new MongoClient(URI, { maxIdleTimeMS: 10_000 });
    attachDatabasePool(client);
    globalThis.__mongoClientPromise = client.connect();
  }
  return globalThis.__mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  return (await clientPromise()).db(DB_NAME);
}
