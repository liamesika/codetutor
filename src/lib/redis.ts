import Redis from "ioredis"

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined
}

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

export const redis = globalThis.redis || new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) return null
    return Math.min(times * 100, 3000)
  },
})

if (process.env.NODE_ENV !== "production") {
  globalThis.redis = redis
}

// Rate limiting utility
export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetMs: number
}

export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowStart = now - config.windowMs

  try {
    // Use sorted set for sliding window rate limiting
    const multi = redis.multi()

    // Remove old entries
    multi.zremrangebyscore(key, 0, windowStart)

    // Count current entries
    multi.zcard(key)

    // Add current request
    multi.zadd(key, now, `${now}-${Math.random()}`)

    // Set expiry
    multi.expire(key, Math.ceil(config.windowMs / 1000))

    const results = await multi.exec()

    if (!results) {
      return { allowed: true, remaining: config.maxRequests - 1, resetMs: config.windowMs }
    }

    const currentCount = (results[1]?.[1] as number) || 0
    const allowed = currentCount < config.maxRequests

    if (!allowed) {
      // Remove the request we just added since it's not allowed
      await redis.zremrangebyscore(key, now, now)
    }

    return {
      allowed,
      remaining: Math.max(0, config.maxRequests - currentCount - 1),
      resetMs: config.windowMs,
    }
  } catch (error) {
    console.error("Rate limit check failed:", error)
    // Fail open but log the error
    return { allowed: true, remaining: config.maxRequests, resetMs: config.windowMs }
  }
}

// Specific rate limit configurations
export const RATE_LIMITS = {
  codeExecution: { windowMs: 60000, maxRequests: 20 }, // 20 per minute
  hintUsage: { windowMs: 60000, maxRequests: 10 }, // 10 per minute
  submission: { windowMs: 60000, maxRequests: 30 }, // 30 per minute
  api: { windowMs: 60000, maxRequests: 100 }, // 100 per minute general
}

export async function checkExecutionRateLimit(userId: string): Promise<RateLimitResult> {
  return checkRateLimit(`ratelimit:exec:${userId}`, RATE_LIMITS.codeExecution)
}

export async function checkHintRateLimit(userId: string): Promise<RateLimitResult> {
  return checkRateLimit(`ratelimit:hint:${userId}`, RATE_LIMITS.hintUsage)
}

export async function checkSubmissionRateLimit(userId: string): Promise<RateLimitResult> {
  return checkRateLimit(`ratelimit:submit:${userId}`, RATE_LIMITS.submission)
}

export async function checkApiRateLimit(userId: string): Promise<RateLimitResult> {
  return checkRateLimit(`ratelimit:api:${userId}`, RATE_LIMITS.api)
}
