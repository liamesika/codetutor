import { spawn } from "child_process"
import { writeFile, mkdir, rm } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"
import os from "os"

export interface TestCase {
  input: string
  expected: string
}

export interface ExecutionResult {
  status: "PASS" | "FAIL" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TIMEOUT" | "MEMORY_EXCEEDED"
  stdout: string | null
  stderr: string | null
  compileError: string | null
  executionMs: number | null
  testResults: {
    testIndex: number
    input: string
    expected: string
    actual: string | null
    passed: boolean
    error: string | null
  }[]
}

const TIMEOUT_MS = 10000 // 10 seconds
const MAX_OUTPUT_SIZE = 50000 // 50KB

// Extract class name from Java code
function extractClassName(code: string): string | null {
  const match = code.match(/public\s+class\s+(\w+)/)
  return match ? match[1] : null
}

// Execute a command with timeout
async function executeCommand(
  command: string,
  args: string[],
  options: {
    cwd: string
    input?: string
    timeout?: number
  }
): Promise<{ stdout: string; stderr: string; exitCode: number | null; timedOut: boolean }> {
  return new Promise((resolve) => {
    const timeout = options.timeout || TIMEOUT_MS
    let stdout = ""
    let stderr = ""
    let timedOut = false

    const proc = spawn(command, args, {
      cwd: options.cwd,
      timeout,
    })

    if (options.input) {
      proc.stdin.write(options.input)
      proc.stdin.end()
    }

    proc.stdout.on("data", (data) => {
      stdout += data.toString()
      if (stdout.length > MAX_OUTPUT_SIZE) {
        stdout = stdout.slice(0, MAX_OUTPUT_SIZE) + "\n... (output truncated)"
        proc.kill()
      }
    })

    proc.stderr.on("data", (data) => {
      stderr += data.toString()
      if (stderr.length > MAX_OUTPUT_SIZE) {
        stderr = stderr.slice(0, MAX_OUTPUT_SIZE) + "\n... (output truncated)"
        proc.kill()
      }
    })

    const timeoutHandle = setTimeout(() => {
      timedOut = true
      proc.kill("SIGKILL")
    }, timeout)

    proc.on("close", (code) => {
      clearTimeout(timeoutHandle)
      resolve({ stdout, stderr, exitCode: code, timedOut })
    })

    proc.on("error", (err) => {
      clearTimeout(timeoutHandle)
      resolve({ stdout, stderr: err.message, exitCode: 1, timedOut: false })
    })
  })
}

export async function executeJavaCode(
  code: string,
  testCases: TestCase[],
  runOnly: boolean = false
): Promise<ExecutionResult> {
  const startTime = Date.now()
  const workDir = join(os.tmpdir(), "codetutor", randomUUID())

  try {
    // Create work directory
    await mkdir(workDir, { recursive: true })

    // Extract class name
    const className = extractClassName(code)
    if (!className) {
      return {
        status: "COMPILE_ERROR",
        stdout: null,
        stderr: null,
        compileError: "Could not find a public class declaration. Make sure your code contains 'public class ClassName'.",
        executionMs: Date.now() - startTime,
        testResults: [],
      }
    }

    // Write Java file
    const javaFile = join(workDir, `${className}.java`)
    await writeFile(javaFile, code)

    // Compile
    const compileResult = await executeCommand("javac", ["-encoding", "UTF-8", `${className}.java`], {
      cwd: workDir,
      timeout: 30000, // 30s compile timeout
    })

    if (compileResult.exitCode !== 0) {
      return {
        status: "COMPILE_ERROR",
        stdout: null,
        stderr: null,
        compileError: compileResult.stderr || "Compilation failed",
        executionMs: Date.now() - startTime,
        testResults: [],
      }
    }

    // If run only (no test cases), just execute once
    if (runOnly || testCases.length === 0) {
      const runResult = await executeCommand("java", ["-Xmx128m", className], {
        cwd: workDir,
        timeout: TIMEOUT_MS,
      })

      if (runResult.timedOut) {
        return {
          status: "TIMEOUT",
          stdout: runResult.stdout || null,
          stderr: "Execution timed out",
          compileError: null,
          executionMs: Date.now() - startTime,
          testResults: [],
        }
      }

      return {
        status: runResult.exitCode === 0 ? "PASS" : "RUNTIME_ERROR",
        stdout: runResult.stdout || null,
        stderr: runResult.stderr || null,
        compileError: null,
        executionMs: Date.now() - startTime,
        testResults: [],
      }
    }

    // Run test cases
    const testResults: ExecutionResult["testResults"] = []
    let allPassed = true

    for (let i = 0; i < testCases.length; i++) {
      const test = testCases[i]
      const args = test.input.split(/\s+/).filter(Boolean)

      const runResult = await executeCommand("java", ["-Xmx128m", className, ...args], {
        cwd: workDir,
        timeout: TIMEOUT_MS,
      })

      if (runResult.timedOut) {
        testResults.push({
          testIndex: i,
          input: test.input,
          expected: test.expected,
          actual: null,
          passed: false,
          error: "Execution timed out",
        })
        allPassed = false
        continue
      }

      if (runResult.exitCode !== 0 && runResult.stderr) {
        testResults.push({
          testIndex: i,
          input: test.input,
          expected: test.expected,
          actual: runResult.stdout || null,
          passed: false,
          error: runResult.stderr,
        })
        allPassed = false
        continue
      }

      // Compare output
      const actual = runResult.stdout?.trim() || ""
      const expected = test.expected.trim()
      const passed = actual === expected

      testResults.push({
        testIndex: i,
        input: test.input,
        expected: test.expected,
        actual,
        passed,
        error: null,
      })

      if (!passed) {
        allPassed = false
      }
    }

    return {
      status: allPassed ? "PASS" : "FAIL",
      stdout: null,
      stderr: null,
      compileError: null,
      executionMs: Date.now() - startTime,
      testResults,
    }
  } catch (error) {
    console.error("Execution error:", error)
    return {
      status: "RUNTIME_ERROR",
      stdout: null,
      stderr: error instanceof Error ? error.message : "Unknown error",
      compileError: null,
      executionMs: Date.now() - startTime,
      testResults: [],
    }
  } finally {
    // Clean up work directory
    try {
      await rm(workDir, { recursive: true, force: true })
    } catch {
      // Ignore cleanup errors
    }
  }
}

// Simulated executor for environments without Java
export async function executeJavaCodeSimulated(
  code: string,
  testCases: TestCase[],
  solutionCode: string,
  runOnly: boolean = false
): Promise<ExecutionResult> {
  const startTime = Date.now()

  // Basic syntax checks
  const className = extractClassName(code)
  if (!className) {
    return {
      status: "COMPILE_ERROR",
      stdout: null,
      stderr: null,
      compileError: "Could not find a public class declaration. Make sure your code contains 'public class ClassName'.",
      executionMs: Date.now() - startTime,
      testResults: [],
    }
  }

  // Check for common syntax errors
  const openBraces = (code.match(/\{/g) || []).length
  const closeBraces = (code.match(/\}/g) || []).length
  if (openBraces !== closeBraces) {
    return {
      status: "COMPILE_ERROR",
      stdout: null,
      stderr: null,
      compileError: `Mismatched braces: ${openBraces} opening and ${closeBraces} closing braces`,
      executionMs: Date.now() - startTime,
      testResults: [],
    }
  }

  const openParens = (code.match(/\(/g) || []).length
  const closeParens = (code.match(/\)/g) || []).length
  if (openParens !== closeParens) {
    return {
      status: "COMPILE_ERROR",
      stdout: null,
      stderr: null,
      compileError: `Mismatched parentheses: ${openParens} opening and ${closeParens} closing`,
      executionMs: Date.now() - startTime,
      testResults: [],
    }
  }

  // Check for missing semicolons after statements (simplified)
  if (/System\.out\.print(ln)?\([^)]*\)[^;{}\n]*\n/.test(code)) {
    return {
      status: "COMPILE_ERROR",
      stdout: null,
      stderr: null,
      compileError: "Syntax error: Missing semicolon after statement",
      executionMs: Date.now() - startTime,
      testResults: [],
    }
  }

  // Normalize code for comparison (remove whitespace, comments)
  const normalizeCode = (c: string) => {
    return c
      .replace(/\/\/.*$/gm, "") // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
  }

  const normalizedCode = normalizeCode(code)
  const normalizedSolution = normalizeCode(solutionCode)

  // Simple similarity check
  const similarity = calculateSimilarity(normalizedCode, normalizedSolution)

  if (runOnly) {
    return {
      status: "PASS",
      stdout: "(Simulated run - code appears syntactically valid)",
      stderr: null,
      compileError: null,
      executionMs: Date.now() - startTime,
      testResults: [],
    }
  }

  // Generate test results based on similarity
  const testResults: ExecutionResult["testResults"] = testCases.map((test, i) => {
    // If code is very similar to solution, pass the test
    const passed = similarity > 0.85

    return {
      testIndex: i,
      input: test.input,
      expected: test.expected,
      actual: passed ? test.expected : "(simulated output)",
      passed,
      error: null,
    }
  })

  const allPassed = testResults.every((t) => t.passed)

  return {
    status: allPassed ? "PASS" : "FAIL",
    stdout: null,
    stderr: null,
    compileError: null,
    executionMs: Date.now() - startTime,
    testResults,
  }
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const costs: number[] = []
  for (let i = 0; i <= shorter.length; i++) {
    let lastValue = i
    for (let j = 0; j <= longer.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else if (j > 0) {
        let newValue = costs[j - 1]
        if (shorter.charAt(i - 1) !== longer.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
        }
        costs[j - 1] = lastValue
        lastValue = newValue
      }
    }
    if (i > 0) {
      costs[longer.length] = lastValue
    }
  }

  return (longer.length - costs[longer.length]) / longer.length
}
