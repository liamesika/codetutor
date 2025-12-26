import { executeJavaCode as executeViaRemote, TestCase, FullExecutionResult } from "./remote-executor"
import { executeJavaCode as executeViaJDoodle } from "./jdoodle-executor"

export type { TestCase, FullExecutionResult, TestResult } from "./remote-executor"

export async function executeJavaCode(
  code: string,
  testCases: TestCase[]
): Promise<FullExecutionResult> {
  // Try remote executor first (if configured with valid URL)
  const executorUrl = process.env.EXECUTOR_URL
  const executorSecret = process.env.EXECUTOR_SECRET
  if (executorUrl && executorSecret && !executorUrl.includes("vercel.app")) {
    // Only use remote executor if URL doesn't point to Vercel (which can't run Docker)
    try {
      const result = await executeViaRemote(code, testCases)
      // If remote executor returns service not configured, fall through to JDoodle
      if (result.compileError?.includes("not configured")) {
        console.log("Remote executor not available, falling back to JDoodle")
      } else {
        return result
      }
    } catch (error) {
      console.error("Remote executor failed, falling back to JDoodle:", error)
    }
  }

  // Fallback to JDoodle API
  if (process.env.JDOODLE_CLIENT_ID && process.env.JDOODLE_CLIENT_SECRET) {
    return executeViaJDoodle(code, testCases)
  }

  // No executor configured
  return {
    status: "COMPILE_ERROR",
    stdout: null,
    stderr: "Code execution service not configured",
    compileError: "Code execution service not available. Please contact support.",
    executionMs: null,
    testResults: testCases.map((tc, i) => ({
      testIndex: i,
      input: tc.isHidden ? "[hidden]" : tc.input,
      expected: tc.isHidden ? "[hidden]" : tc.expectedOutput,
      actual: null,
      passed: false,
      error: "Execution service not configured",
      isHidden: tc.isHidden || false,
    })),
  }
}
