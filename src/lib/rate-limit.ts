/**
 * Basic per-IP, fixed-window rate limiter for the form handlers.
 *
 * In-memory and best-effort: serverless instances each keep their own map, so
 * this throttles casual abuse / accidental double-submits, not a distributed
 * flood. For hard guarantees move to a shared store (e.g. Upstash Redis); the
 * call site stays the same.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * Returns `true` when the request is allowed, `false` when the IP has exceeded
 * `limit` requests within `windowMs`.
 */
export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    // Opportunistic cleanup so the map can't grow unbounded.
    if (buckets.size > 5_000) {
      for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k);
    }
    return true;
  }

  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

/** Best-effort client IP from the platform's forwarding headers. */
export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
