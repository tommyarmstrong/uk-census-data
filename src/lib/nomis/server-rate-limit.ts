/** In-memory sliding-window limiter for the NOMIS proxy route. */

type Bucket = {
  timestamps: number[];
};

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  { ok: true; remaining: number } | { ok: false; retryAfterSec: number };

/**
 * Allow up to `limit` events per `windowMs` for a key.
 * Suitable for a single Node process (e.g. one Vercel lambda instance).
 */
export function consumeRateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter(
    (stamp) => now - stamp < options.windowMs,
  );

  if (bucket.timestamps.length >= options.limit) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((options.windowMs - (now - oldest)) / 1000),
    );
    buckets.set(key, bucket);
    return { ok: false, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return {
    ok: true,
    remaining: options.limit - bucket.timestamps.length,
  };
}
