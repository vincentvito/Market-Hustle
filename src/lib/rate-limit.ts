/**
 * In-memory sliding-window rate limiter.
 *
 * Each IP gets a bucket of timestamps. On every request we:
 *  1. Purge timestamps older than the window
 *  2. Check if the count exceeds the limit
 *  3. If not, record the new timestamp
 *
 * A periodic sweep (every 60 s) evicts stale IPs so the Map doesn't grow
 * unboundedly on long-running instances.
 */

interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

// Sweep stale entries every 60 seconds
const SWEEP_INTERVAL = 60_000
let lastSweep = Date.now()

function sweep(windowMs: number) {
  const now = Date.now()
  if (now - lastSweep < SWEEP_INTERVAL) return
  lastSweep = now
  const cutoff = now - windowMs
  store.forEach((entry, key) => {
    if (entry.timestamps.length === 0 || entry.timestamps[entry.timestamps.length - 1] < cutoff) {
      store.delete(key)
    }
  })
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetMs: number // ms until the oldest request in the window expires
}

export function rateLimit(
  key: string,
  { limit, windowMs, tier }: { limit: number; windowMs: number; tier: string }
): RateLimitResult {
  const now = Date.now()
  const cutoff = now - windowMs

  sweep(windowMs)

  const bucketKey = `${tier}:${key}`
  let entry = store.get(bucketKey)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(bucketKey, entry)
  }

  // Purge expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff)

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0]
    return {
      allowed: false,
      remaining: 0,
      resetMs: oldest + windowMs - now,
    }
  }

  entry.timestamps.push(now)
  return {
    allowed: true,
    remaining: limit - entry.timestamps.length,
    resetMs: windowMs,
  }
}
