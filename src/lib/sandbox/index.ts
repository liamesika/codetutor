import { executeJavaCode as executeViaRemote, TestCase, FullExecutionResult } from "./remote-executor"
import { executeJavaCode as executeViaJDoodle } from "./jdoodle-executor"

export type { TestCase, FullExecutionResult, TestResult } from "./remote-executor"

export async function executeJavaCode(
  code: string,
  testCases: TestCase[]
): Promise<FullExecutionResult> {
  // Try remote executor first (if configured)
  if (process.env.EXECUTOR_URL && process.env.EXECUTOR_SECRET) {
    return executeViaRemote(code, testCases)
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
