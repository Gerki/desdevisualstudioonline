// lib/redis.ts
// Redis client for caching and real-time features

import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.REDIS_URL,
});

/**
 * Cache utility with TTL
 */
export async function setCache(
  key: string,
  value: string,
  ttlSeconds = 3600
): Promise<void> {
  await redis.setex(key, ttlSeconds, value);
}

/**
 * Get cached value
 */
export async function getCache(key: string): Promise<string | null> {
  return redis.get(key);
}

/**
 * Delete cached value
 */
export async function deleteCache(key: string): Promise<void> {
  await redis.del(key);
}

/**
 * Invalidate cache pattern
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
