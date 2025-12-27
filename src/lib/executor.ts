/**
 * Executor Service - Handles code execution with proper error handling,
 * health checks, timeouts, retries, and structured logging.
 */

import { randomUUID } from "crypto"

/**
 * Normalize executor URL:
 * - Add https:// if missing protocol
 * - Remove trailing slash
 * - Never include /health in the base URL
 * - Returns null if empty or invalid
 */
export function normalizeExecutorUrl(url: string | undefined): string | null {
  if (!url || url.trim() === "") {
    return null
  }

  let normalized = url.trim()

  // Add https:// if no protocol
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = `https://${normalized}`
  }

  // Remove trailing slash
  normalized = normalized.replace(/\/+$/, "")

  // Remove /health if present at the end (it should be appended in code)
  normalized = normalized.replace(/\/health$/, "")

  return normalized
}

/**
 * Get executor config with validation
 */
export function getExecutorConfig(): {
  url: string | null
  secret: string | null
  isConfigured: boolean
  healthUrl: string | null
} {
  const url = normalizeExecutorUrl(process.env.EXECUTOR_URL)
  const secret = process.env.EXECUTOR_SECRET || null

  return {
    url,
    secret,
    isConfigured: !!url,
    healthUrl: url ? `${url}/health` : null,
  }
}

// Types
export interface TestCase {
  input: string
  expectedOutput: string
  isHidden?: boolean
}

export interface TestResult {
  name: string
  passed: boolean
  expected?: string
  received?: string
  message?: string
  durationMs?: number
  isHidden?: boolean
}

export interface ExecutionResponse {
  status: "ok" | "error"
  passed: boolean
  tests: TestResult[]
  stdout: string
  stderr: string
  compileError?: string
  runtimeError?: string
  durationMs: number
  requestId: string
}

export interface ExecutorHealthStatus {
  healthy: boolean
  message: string
  latencyMs?: number
  checkedAt: Date
}

// Configuration - use normalized URL
const executorConfig = getExecutorConfig()
const EXECUTOR_URL = executorConfig.url || ""
const EXECUTOR_SECRET = executorConfig.secret || ""
const EXECUTION_TIMEOUT_MS = 25000 // 25 second hard limit
const HEALTH_CHECK_TIMEOUT_MS = 5000 // 5 second health check timeout
const MAX_RETRIES = 1 // Only retry once for network/5xx errors

// Cache for health status
let cachedHealthStatus: ExecutorHealthStatus | null = null
let lastHealthCheck: number = 0
const HEALTH_CACHE_TTL_MS = 30000 // 30 seconds

/**
 * Generate a unique request ID for tracing
 */
export function generateRequestId(): string {
  return randomUUID()
}

/**
 * Structured logger for executor operations
 */
export function logExecutorEvent(
  event: string,
  data: Record<string, unknown>
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    service: "executor",
    event,
    ...data,
  }
  console.log(JSON.stringify(logEntry))
}

/**
 * Check if executor service is healthy
 */
export async function checkExecutorHealth(): Promise<ExecutorHealthStatus> {
  const now = Date.now()

  // Return cached status if fresh
  if (cachedHealthStatus && now - lastHealthCheck < HEALTH_CACHE_TTL_MS) {
    return cachedHealthStatus
  }

  // Check if executor is configured
  if (!EXECUTOR_URL || !EXECUTOR_SECRET) {
    const status: ExecutorHealthStatus = {
      healthy: false,
      message: "Executor not configured",
      checkedAt: new Date(),
    }
    cachedHealthStatus = status
    lastHealthCheck = now
    return status
  }

  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS)

    const response = await fetch(`${EXECUTOR_URL}/health`, {
      method: "GET",
      headers: {
        "X-Executor-Token": EXECUTOR_SECRET,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const latencyMs = Date.now() - startTime

    if (response.ok) {
      const status: ExecutorHealthStatus = {
        healthy: true,
        message: "Executor is healthy",
        latencyMs,
        checkedAt: new Date(),
      }
      cachedHealthStatus = status
      lastHealthCheck = now
      return status
    }

    const status: ExecutorHealthStatus = {
      healthy: false,
      message: `Executor returned ${response.status}`,
      latencyMs,
      checkedAt: new Date(),
    }
    cachedHealthStatus = status
    lastHealthCheck = now
    return status
  } catch (error) {
    const latencyMs = Date.now() - startTime
    const message = error instanceof Error
      ? (error.name === "AbortError" ? "Health check timeout" : error.message)
      : "Unknown error"

    const status: ExecutorHealthStatus = {
      healthy: false,
      message,
      latencyMs,
      checkedAt: new Date(),
    }
    cachedHealthStatus = status
    lastHealthCheck = now
    return status
  }
}

/**
 * Check if an error is retryable (network or 5xx errors)
 */
function isRetryableError(error: unknown, response?: Response): boolean {
  // Network errors are retryable
  if (error instanceof TypeError) {
    return true
  }

  // 5xx errors are retryable
  if (response && response.status >= 500) {
    return true
  }

  return false
}

/**
 * Execute Java code with proper error handling, timeouts, and retries
 */
export async function executeCode(
  code: string,
  testCases: TestCase[],
  requestId?: string
): Promise<ExecutionResponse> {
  const reqId = requestId || generateRequestId()
  const startTime = Date.now()

  // Log start
  logExecutorEvent("execution_start", {
    requestId: reqId,
    testCount: testCases.length,
    codeLength: code.length,
  })

  // Check if executor is configured
  if (!EXECUTOR_URL || !EXECUTOR_SECRET) {
    logExecutorEvent("execution_error", {
      requestId: reqId,
      error: "executor_not_configured",
      durationMs: Date.now() - startTime,
    })

    return {
      status: "error",
      passed: false,
      tests: testCases.map((tc, i) => ({
        name: `Test ${i + 1}`,
        passed: false,
        message: "Execution service not configured",
        isHidden: tc.isHidden,
      })),
      stdout: "",
      stderr: "Execution service not configured. Please contact support.",
      compileError: undefined,
      runtimeError: undefined,
      durationMs: Date.now() - startTime,
      requestId: reqId,
    }
  }

  let lastError: Error | null = null
  let lastResponse: Response | null = null
  let attempt = 0

  while (attempt <= MAX_RETRIES) {
    attempt++

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), EXECUTION_TIMEOUT_MS)

      const response = await fetch(`${EXECUTOR_URL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Executor-Token": EXECUTOR_SECRET,
          "X-Request-Id": reqId,
        },
        body: JSON.stringify({ code, testCases }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      lastResponse = response

      if (response.ok) {
        const result = await response.json()
        const durationMs = Date.now() - startTime

        // Normalize response to standard format
        const normalizedResult = normalizeExecutorResponse(result, testCases, reqId, durationMs)

        logExecutorEvent("execution_success", {
          requestId: reqId,
          status: normalizedResult.status,
          passed: normalizedResult.passed,
          testsPassed: normalizedResult.tests.filter(t => t.passed).length,
          testsTotal: normalizedResult.tests.length,
          durationMs,
          attempt,
        })

        return normalizedResult
      }

      // Handle non-OK response
      const errorText = await response.text().catch(() => "Unknown error")

      // Check if retryable
      if (isRetryableError(null, response) && attempt <= MAX_RETRIES) {
        logExecutorEvent("execution_retry", {
          requestId: reqId,
          status: response.status,
          attempt,
          reason: `HTTP ${response.status}`,
        })
        continue
      }

      // Not retryable, return error
      const durationMs = Date.now() - startTime
      logExecutorEvent("execution_error", {
        requestId: reqId,
        status: response.status,
        error: errorText.substring(0, 200),
        durationMs,
        attempt,
      })

      return {
        status: "error",
        passed: false,
        tests: testCases.map((tc, i) => ({
          name: `Test ${i + 1}`,
          passed: false,
          message: `Execution failed: ${response.status}`,
          isHidden: tc.isHidden,
        })),
        stdout: "",
        stderr: `Execution service error (${response.status}): ${errorText}`,
        runtimeError: errorText,
        durationMs,
        requestId: reqId,
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Handle timeout
      if (lastError.name === "AbortError") {
        const durationMs = Date.now() - startTime
        logExecutorEvent("execution_timeout", {
          requestId: reqId,
          durationMs,
          attempt,
        })

        return {
          status: "error",
          passed: false,
          tests: testCases.map((tc, i) => ({
            name: `Test ${i + 1}`,
            passed: false,
            message: "Execution timed out",
            isHidden: tc.isHidden,
          })),
          stdout: "",
          stderr: "Code execution timed out. Please check for infinite loops or optimize your solution.",
          runtimeError: "Execution timeout",
          durationMs,
          requestId: reqId,
        }
      }

      // Check if retryable
      if (isRetryableError(lastError) && attempt <= MAX_RETRIES) {
        logExecutorEvent("execution_retry", {
          requestId: reqId,
          error: lastError.message,
          attempt,
          reason: "network_error",
        })
        continue
      }

      // Not retryable, break out
      break
    }
  }

  // All retries exhausted
  const durationMs = Date.now() - startTime
  const errorMessage = lastError?.message || "Unknown error"

  logExecutorEvent("execution_failed", {
    requestId: reqId,
    error: errorMessage,
    durationMs,
    attempts: attempt,
  })

  return {
    status: "error",
    passed: false,
    tests: testCases.map((tc, i) => ({
      name: `Test ${i + 1}`,
      passed: false,
      message: "Execution service unavailable",
      isHidden: tc.isHidden,
    })),
    stdout: "",
    stderr: "Execution service unavailable. Please try again later.",
    runtimeError: errorMessage,
    durationMs,
    requestId: reqId,
  }
}

/**
 * Normalize executor response to standard format
 */
function normalizeExecutorResponse(
  result: unknown,
  testCases: TestCase[],
  requestId: string,
  durationMs: number
): ExecutionResponse {
  // Handle various response formats from executor
  const r = result as Record<string, unknown>

  // Check for compile error
  if (r.compileError || r.status === "COMPILE_ERROR") {
    return {
      status: "error",
      passed: false,
      tests: testCases.map((tc, i) => ({
        name: `Test ${i + 1}`,
        passed: false,
        message: "Compilation failed",
        isHidden: tc.isHidden,
      })),
      stdout: String(r.stdout || ""),
      stderr: String(r.stderr || ""),
      compileError: String(r.compileError || "Compilation error"),
      durationMs: Number(r.executionMs || r.durationMs || durationMs),
      requestId,
    }
  }

  // Check for runtime error
  if (r.status === "RUNTIME_ERROR" || r.runtimeError) {
    return {
      status: "error",
      passed: false,
      tests: normalizeTestResults(r.testResults || r.tests, testCases),
      stdout: String(r.stdout || ""),
      stderr: String(r.stderr || ""),
      runtimeError: String(r.runtimeError || "Runtime error"),
      durationMs: Number(r.executionMs || r.durationMs || durationMs),
      requestId,
    }
  }

  // Check for timeout
  if (r.status === "TIMEOUT" || r.status === "MEMORY_EXCEEDED") {
    return {
      status: "error",
      passed: false,
      tests: testCases.map((tc, i) => ({
        name: `Test ${i + 1}`,
        passed: false,
        message: r.status === "TIMEOUT" ? "Execution timed out" : "Memory limit exceeded",
        isHidden: tc.isHidden,
      })),
      stdout: String(r.stdout || ""),
      stderr: String(r.stderr || ""),
      runtimeError: String(r.status),
      durationMs: Number(r.executionMs || r.durationMs || durationMs),
      requestId,
    }
  }

  // Normal response
  const tests = normalizeTestResults(r.testResults || r.tests, testCases)
  const passed = tests.length > 0 && tests.every(t => t.passed)

  return {
    status: passed ? "ok" : "error",
    passed,
    tests,
    stdout: String(r.stdout || ""),
    stderr: String(r.stderr || ""),
    compileError: r.compileError ? String(r.compileError) : undefined,
    runtimeError: r.runtimeError ? String(r.runtimeError) : undefined,
    durationMs: Number(r.executionMs || r.durationMs || durationMs),
    requestId,
  }
}

/**
 * Normalize test results from various formats
 */
function normalizeTestResults(
  results: unknown,
  testCases: TestCase[]
): TestResult[] {
  if (!Array.isArray(results) || results.length === 0) {
    return testCases.map((tc, i) => ({
      name: `Test ${i + 1}`,
      passed: false,
      message: "No result received",
      isHidden: tc.isHidden,
    }))
  }

  return results.map((r: unknown, i: number) => {
    const result = r as Record<string, unknown>
    const tc = testCases[i]

    return {
      name: String(result.name || `Test ${i + 1}`),
      passed: Boolean(result.passed),
      expected: tc?.isHidden ? "[hidden]" : String(result.expected || result.expectedOutput || tc?.expectedOutput || ""),
      received: tc?.isHidden ? "[hidden]" : String(result.received || result.actual || ""),
      message: result.error ? String(result.error) : undefined,
      durationMs: result.durationMs ? Number(result.durationMs) : undefined,
      isHidden: tc?.isHidden || false,
    }
  })
}

/**
 * Get cached executor status for UI display
 */
export function getExecutorStatus(): ExecutorHealthStatus | null {
  return cachedHealthStatus
}

/**
 * Check if executor is currently available (uses cache)
 */
export function isExecutorAvailable(): boolean {
  if (!cachedHealthStatus) return true // Assume available if not checked yet

  const now = Date.now()
  // If cache is stale, assume available (will be rechecked)
  if (now - lastHealthCheck > HEALTH_CACHE_TTL_MS * 2) return true

  return cachedHealthStatus.healthy
}
