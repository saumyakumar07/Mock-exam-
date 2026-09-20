import { Redis } from "@upstash/redis";

const RESULTS_KEY = "examprep:results";

let client: Redis | null = null;

function getClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!client) {
    client = new Redis({ url, token });
  }
  return client;
}

export function isResultsStoreConfigured(): boolean {
  return getClient() !== null;
}

export async function saveResultRecord(record: unknown): Promise<void> {
  const redis = getClient();
  if (!redis) {
    throw new Error(
      "Result storage isn't configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN."
    );
  }
  await redis.lpush(RESULTS_KEY, JSON.stringify(record));
}

export async function listResultRecords<T>(): Promise<T[]> {
  const redis = getClient();
  if (!redis) return [];
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
