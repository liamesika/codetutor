import { Redis } from "@upstash/redis"

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

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

  // If Redis is not configured, allow all requests
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { allowed: true, remaining: config.maxRequests - 1, resetMs: config.windowMs }
  }

  try {
    // Use pipeline for atomic operations
    const pipeline = redis.pipeline()

    // Remove old entries
    pipeline.zremrangebyscore(key, 0, windowStart)

    // Count current entries
    pipeline.zcard(key)

    // Add current request
    pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` })

    // Set expiry
    pipeline.expire(key, Math.ceil(config.windowMs / 1000))

    const results = await pipeline.exec()

    if (!results) {
      return { allowed: true, remaining: config.maxRequests - 1, resetMs: config.windowMs }
    }

    const currentCount = (results[1] as number) || 0
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
  demo: { windowMs: 60000, maxRequests: 5 }, // 5 per minute for demo (stricter)
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

export async function checkDemoRateLimit(clientId: string): Promise<RateLimitResult> {
  return checkRateLimit(`ratelimit:demo:${clientId}`, RATE_LIMITS.demo)
}
