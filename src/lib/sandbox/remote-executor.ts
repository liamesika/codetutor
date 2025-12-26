export interface TestCase {
  input: string
  expectedOutput: string
  isHidden?: boolean
}

export interface TestResult {
  testIndex: number
  input: string
  expected: string
  actual: string | null
  passed: boolean
  error: string | null
  isHidden: boolean
}

export interface FullExecutionResult {
  status: "PASS" | "FAIL" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TIMEOUT" | "MEMORY_EXCEEDED"
  stdout: string | null
  stderr: string | null
  compileError: string | null
  executionMs: number | null
  testResults: TestResult[]
}

function getExecutorUrl(): string | null {
  const url = process.env.EXECUTOR_URL
  if (!url) return null
  // Ensure https and no trailing slash
  let normalized = url.trim()
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = `https://${normalized}`
  }
  return normalized.replace(/\/$/, "")
}

const EXECUTOR_URL = getExecutorUrl()
const EXECUTOR_SECRET = process.env.EXECUTOR_SECRET

export async function executeJavaCode(
  code: string,
  testCases: TestCase[]
): Promise<FullExecutionResult> {
  if (!EXECUTOR_URL || !EXECUTOR_SECRET) {
    return {
      status: "COMPILE_ERROR",
      stdout: null,
      stderr: "Code execution service not configured",
      compileError: "Code execution service not configured. Please contact support.",
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

  try {
    const response = await fetch(`${EXECUTOR_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Executor-Token": EXECUTOR_SECRET,
      },
      body: JSON.stringify({ code, testCases }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Executor error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    return result as FullExecutionResult
  } catch (error) {
    console.error("Remote execution error:", error)
    return {
      status: "RUNTIME_ERROR",
      stdout: null,
      stderr: error instanceof Error ? error.message : "Execution service unavailable",
      compileError: null,
      executionMs: null,
      testResults: testCases.map((tc, i) => ({
        testIndex: i,
        input: tc.isHidden ? "[hidden]" : tc.input,
        expected: tc.isHidden ? "[hidden]" : tc.expectedOutput,
        actual: null,
        passed: false,
        error: "Execution service error",
        isHidden: tc.isHidden || false,
      })),
    }
  }
}
