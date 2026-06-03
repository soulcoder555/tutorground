import Redis from "ioredis";
import { env } from "../config/env";

let redis: Redis | null = null;
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

export function getRedis() {
  if (!env.REDIS_URL) return null;
  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      lazyConnect: true
    });
    redis.on("error", () => undefined);
  }
  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedis();
  if (client) {
    const value = await client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }
  const item = memoryCache.get(key);
  if (!item || item.expiresAt < Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return JSON.parse(item.value) as T;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number) {
  const serialized = JSON.stringify(value);
  const client = getRedis();
  if (client) {
    await client.set(key, serialized, "EX", ttlSeconds);
    return;
  }
  memoryCache.set(key, { value: serialized, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export async function cacheDel(key: string) {
  const client = getRedis();
  if (client) {
    await client.del(key);
    return;
  }
  memoryCache.delete(key);
}
