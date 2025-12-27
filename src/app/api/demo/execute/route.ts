import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  executeCode,
  generateRequestId,
  logExecutorEvent,
  getExecutorConfig,
  type TestCase,
} from "@/lib/executor"
import { checkDemoRateLimit } from "@/lib/redis"

// Force Node.js runtime
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const demoExecuteSchema = z.object({
  code: z.string().max(10000, "Code too long for demo"),
})

// Dangerous patterns that must be blocked
const DANGEROUS_PATTERNS = [
  /Runtime\.getRuntime\(\)/,
  /ProcessBuilder/,
  /System\.exit/,
  /java\.lang\.reflect/,
  /java\.net\./,
  /java\.nio\.file\.Files/,
  /ClassLoader/,
  /SecurityManager/,
  /java\.awt/,
  /javax\.swing/,
  /Thread\.sleep\s*\(\s*\d{4,}\s*\)/, // Sleep > 1 second
]

function sanitizeCode(code: string): { safe: boolean; reason?: string } {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return {
        safe: false,
        reason: `Blocked: ${pattern.source.substring(0, 30)}...`,
      }
    }
  }
  return { safe: true }
}

// Demo test case - just runs the code and captures output
const DEMO_TEST_CASE: TestCase = {
  input: "",
  expectedOutput: "",
  isHidden: false,
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()

  try {
    // Get client IP for rate limiting (anonymous)
    const forwardedFor = req.headers.get("x-forwarded-for")
    const clientIp = forwardedFor?.split(",")[0] || "anonymous"
    const clientId = `demo:${clientIp}`

    // Check executor config
    const executorConfig = getExecutorConfig()
    if (!executorConfig.isConfigured || !process.env.EXECUTOR_SECRET) {
      return NextResponse.json(
        {
          error: "EXECUTOR_NOT_CONFIGURED",
          message: "Code execution service is currently unavailable.",
          requestId,
        },
        { status: 503 }
      )
    }

    // Rate limiting for demo (stricter than authenticated)
    const rateLimit = await checkDemoRateLimit(clientId)
    if (!rateLimit.allowed) {
      logExecutorEvent("demo_rate_limit_exceeded", {
        requestId,
        clientId: clientId.substring(0, 20) + "...",
        retryAfter: Math.ceil(rateLimit.resetMs / 1000),
      })

      return NextResponse.json(
        {
          error: "Demo rate limit reached. Sign up for more executions!",
          retryAfter: Math.ceil(rateLimit.resetMs / 1000),
          requestId,
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          },
        }
      )
    }

    const body = await req.json()
    const { code } = demoExecuteSchema.parse(body)

    // Sanitize code
    const validation = sanitizeCode(code)
    if (!validation.safe) {
      logExecutorEvent("demo_code_blocked", {
        requestId,
        reason: validation.reason,
      })

      return NextResponse.json(
        {
          error: `Code contains restricted operations: ${validation.reason}`,
          requestId,
        },
        { status: 400 }
      )
    }

    logExecutorEvent("demo_execute_start", {
      requestId,
      codeLength: code.length,
    })

    // Execute code - demo mode just captures output, no test validation
    const result = await executeCode(code, [DEMO_TEST_CASE], requestId)

    const durationMs = Date.now() - startTime

    logExecutorEvent("demo_execute_complete", {
      requestId,
      durationMs,
      success: result.status === "ok",
    })

    // Return simplified result for demo
    return NextResponse.json({
      success: result.status === "ok" && !result.compileError,
      output: result.stdout || "",
      error: result.stderr || result.runtimeError || "",
      compileError: result.compileError || null,
      durationMs: result.durationMs,
      requestId,
    })
  } catch (error) {
    logExecutorEvent("demo_execute_error", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues, requestId },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Execution failed. Please try again.", requestId },
      { status: 500 }
    )
  }
}
