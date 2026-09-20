import { Redis } from "@upstash/redis";

const RESULTS_KEY = "examprep:results";

let client: Redis | null = null;

/** Pure env-var presence check — cannot throw, safe to call outside try/catch. */
export function hasRedisEnvVars(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/** Constructs (or reuses) the Redis client. Can throw if the URL/token are malformed —
 * callers must wrap this (directly or via saveResultRecord/listResultRecords) in try/catch. */
function getClient(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set.");
  }
  if (!client) {
    client = new Redis({ url, token });
  }
  return client;
}

export async function saveResultRecord(record: unknown): Promise<void> {
  const redis = getClient();
  await redis.lpush(RESULTS_KEY, JSON.stringify(record));
}

export async function listResultRecords<T>(): Promise<T[]> {
  const redis = getClient();
  const raw = await redis.lrange<string>(RESULTS_KEY, 0, -1);
  return raw
    .map((entry) => {
      try {
        return typeof entry === "string" ? (JSON.parse(entry) as T) : (entry as T);
      } catch {
        return null;
      }
    })
    .filter((r): r is T => r !== null);
}
