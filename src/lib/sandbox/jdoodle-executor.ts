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

const JDOODLE_CLIENT_ID = process.env.JDOODLE_CLIENT_ID
const JDOODLE_CLIENT_SECRET = process.env.JDOODLE_CLIENT_SECRET
const JDOODLE_API_URL = "https://api.jdoodle.com/v1/execute"

interface JDoodleResponse {
  output: string
  statusCode: number
  memory: string
  cpuTime: string
  compilationStatus?: string
}

async function runJDoodle(code: string, input: string): Promise<{
  success: boolean
  output?: string
  error?: string
  isCompileError?: boolean
  executionMs?: number
}> {
  if (!JDOODLE_CLIENT_ID || !JDOODLE_CLIENT_SECRET) {
    return {
      success: false,
      error: "JDoodle API not configured. Set JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET.",
    }
  }

  try {
    const startTime = Date.now()
    const response = await fetch(JDOODLE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: JDOODLE_CLIENT_ID,
        clientSecret: JDOODLE_CLIENT_SECRET,
        script: code,
        stdin: input,
        language: "java",
        versionIndex: "4", // Java 17
      }),
    })

    const executionMs = Date.now() - startTime

    if (!response.ok) {
      return {
        success: false,
        error: `API error: ${response.status}`,
        executionMs,
      }
    }

    const result: JDoodleResponse = await response.json()

    // Check for compile errors
    if (result.statusCode === 400 || result.output?.includes("error:")) {
      const errorOutput = result.output || "Compilation failed"
      // Check if it's a compile error vs runtime error
      if (errorOutput.includes(".java:") || errorOutput.includes("error:")) {
        return {
          success: false,
          error: errorOutput,
          isCompileError: true,
          executionMs,
        }
      }
    }

    // Check for timeout
    if (result.statusCode === 408) {
      return {
        success: false,
        error: "Execution timed out",
        executionMs,
      }
    }

    // Check for memory limit
    if (result.statusCode === 413) {
      return {
        success: false,
        error: "Memory limit exceeded",
        executionMs,
      }
    }

    // Check for runtime errors
    if (result.statusCode !== 200 && result.statusCode !== undefined) {
      return {
        success: false,
        error: result.output || `Execution failed with status ${result.statusCode}`,
        executionMs,
      }
    }

    // Check for Exception in output
    if (result.output?.includes("Exception in thread") || result.output?.includes("Error:")) {
      return {
        success: false,
        error: result.output,
        executionMs,
      }
    }

    return {
      success: true,
      output: result.output || "",
      executionMs,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function executeJavaCode(
  code: string,
  testCases: TestCase[]
): Promise<FullExecutionResult> {
  const testResults: TestResult[] = []
  let totalExecutionMs = 0
  let hasTimeout = false
  let hasRuntimeError = false
  let firstError: string | null = null

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i]
    const result = await runJDoodle(code, tc.input || "")

    if (result.executionMs) {
      totalExecutionMs += result.executionMs
    }

    if (!result.success) {
      // Compile error - fail all remaining tests
      if (result.isCompileError) {
        const compileError = result.error || "Compilation failed"
        for (let j = i; j < testCases.length; j++) {
          testResults.push({
            testIndex: j,
            input: testCases[j].isHidden ? "[hidden]" : testCases[j].input,
            expected: testCases[j].isHidden ? "[hidden]" : testCases[j].expectedOutput,
            actual: null,
            passed: false,
            error: compileError,
            isHidden: testCases[j].isHidden || false,
          })
        }
        return {
          status: "COMPILE_ERROR",
          stdout: null,
          stderr: compileError,
          compileError,
          executionMs: totalExecutionMs,
          testResults,
        }
      }

      if (result.error?.includes("timed out")) {
        hasTimeout = true
      }

      hasRuntimeError = true
      if (!firstError) {
        firstError = result.error || "Runtime error"
      }

      testResults.push({
        testIndex: i,
        input: tc.isHidden ? "[hidden]" : tc.input,
        expected: tc.isHidden ? "[hidden]" : tc.expectedOutput,
        actual: null,
        passed: false,
        error: result.error || "Execution failed",
        isHidden: tc.isHidden || false,
      })
      continue
    }

    const actual = (result.output || "").trim()
    const expected = (tc.expectedOutput || "").trim()
    const passed = actual === expected

    testResults.push({
      testIndex: i,
      input: tc.isHidden ? "[hidden]" : tc.input,
      expected: tc.isHidden ? "[hidden]" : expected,
      actual: tc.isHidden && !passed ? "[hidden]" : actual,
      passed,
      error: null,
      isHidden: tc.isHidden || false,
    })
  }

  const allPassed = testResults.every(t => t.passed)
  let status: FullExecutionResult["status"]
  if (allPassed) {
    status = "PASS"
  } else if (hasTimeout) {
    status = "TIMEOUT"
  } else if (hasRuntimeError) {
    status = "RUNTIME_ERROR"
  } else {
    status = "FAIL"
  }

  return {
    status,
    stdout: testResults.find(t => t.actual)?.actual || null,
    stderr: firstError,
    compileError: null,
    executionMs: totalExecutionMs,
    testResults,
  }
}
