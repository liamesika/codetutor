import { spawn } from "child_process"
import { promises as fs } from "fs"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { tmpdir } from "os"

export interface ExecutionConfig {
  code: string
  input: string
  timeLimit?: number // seconds
  memoryLimit?: number // MB
}

export interface ExecutionResult {
  success: boolean
  phase: "parse" | "compile" | "runtime" | "complete"
  output?: string
  error?: string
  executionMs?: number
}

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

const DOCKER_IMAGE = "codetutor-java-sandbox:latest"
const DEFAULT_TIME_LIMIT = 5 // seconds
const DEFAULT_MEMORY_LIMIT = 128 // MB

// Security patterns to block
const DANGEROUS_PATTERNS = [
  /Runtime\.getRuntime\(\)/,
  /ProcessBuilder/,
  /java\.lang\.reflect/,
  /java\.net\./,
  /java\.nio\.file\.Files/,
  /java\.io\.File(?!NotFoundException|Reader|Writer|InputStream|OutputStream)/,
  /System\.exit/,
  /ClassLoader/,
  /SecurityManager/,
  /java\.awt/,
  /javax\.swing/,
  /Thread\.sleep\s*\(\s*\d{5,}\s*\)/, // Sleep > 10 seconds
]

function sanitizeCode(code: string): { safe: boolean; reason?: string } {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return {
        safe: false,
        reason: `Blocked pattern detected: ${pattern.toString()}`,
      }
    }
  }
  return { safe: true }
}

async function executeInDocker(config: ExecutionConfig): Promise<ExecutionResult> {
  const { code, input, timeLimit = DEFAULT_TIME_LIMIT, memoryLimit = DEFAULT_MEMORY_LIMIT } = config

  // Validate code
  const validation = sanitizeCode(code)
  if (!validation.safe) {
    return {
      success: false,
      phase: "parse",
      error: validation.reason,
    }
  }

  // Create temp directory for this execution
  const execId = uuidv4()
  const workDir = join(tmpdir(), "codetutor", execId)
  await fs.mkdir(workDir, { recursive: true })

  try {
    // Write code and input files
    const codeFile = join(workDir, "Solution.java")
    const inputFile = join(workDir, "input.txt")
    await fs.writeFile(codeFile, code)
    await fs.writeFile(inputFile, input)

    // Run Docker container
    const result = await new Promise<ExecutionResult>((resolve) => {
      const args = [
        "run",
        "--rm",
        "--network=none", // No network access
        "--memory=" + memoryLimit + "m",
        "--memory-swap=" + memoryLimit + "m", // No swap
        "--cpus=0.5", // Limit CPU
        "--pids-limit=50", // Limit processes
        "--read-only", // Read-only root filesystem
        "--tmpfs=/sandbox/work:rw,noexec,nosuid,size=50m", // Temp filesystem
        "-v", `${codeFile}:/sandbox/code.java:ro`,
        "-v", `${inputFile}:/sandbox/input.txt:ro`,
        DOCKER_IMAGE,
        "/sandbox/code.java",
        "/sandbox/input.txt",
        timeLimit.toString(),
        memoryLimit.toString(),
      ]

      const docker = spawn("docker", args, {
        timeout: (timeLimit + 15) * 1000, // Extra time for container startup
      })

      let stdout = ""
      let stderr = ""

      docker.stdout.on("data", (data) => {
        stdout += data.toString()
      })

      docker.stderr.on("data", (data) => {
        stderr += data.toString()
      })

      docker.on("close", (code) => {
        try {
          // Parse JSON output from container
          const result = JSON.parse(stdout.trim())
          resolve(result)
        } catch {
          if (stderr.includes("OOM") || stderr.includes("memory")) {
            resolve({
              success: false,
              phase: "runtime",
              error: "Memory limit exceeded",
            })
          } else if (code === 124 || stderr.includes("timeout")) {
            resolve({
              success: false,
              phase: "runtime",
              error: `Execution timed out after ${timeLimit}s`,
            })
          } else {
            resolve({
              success: false,
              phase: "runtime",
              error: stderr || stdout || "Unknown execution error",
            })
          }
        }
      })

      docker.on("error", (err) => {
        resolve({
          success: false,
          phase: "runtime",
          error: `Docker error: ${err.message}`,
        })
      })
    })

    return result
  } finally {
    // Cleanup temp files
    try {
      await fs.rm(workDir, { recursive: true, force: true })
    } catch {
      // Ignore cleanup errors
    }
  }
}

export async function executeJavaCode(
  code: string,
  testCases: TestCase[]
): Promise<FullExecutionResult> {
  const testResults: TestResult[] = []
  let firstError: string | null = null
  let compileError: string | null = null
  let totalExecutionMs = 0
  let hasTimeout = false
  let hasMemoryExceeded = false

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i]

    const result = await executeInDocker({
      code,
      input: testCase.input,
      timeLimit: 5,
      memoryLimit: 128,
    })

    if (!result.success) {
      if (result.phase === "compile") {
        compileError = result.error || "Compilation failed"
        // All tests fail on compile error
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
          executionMs: result.executionMs || null,
          testResults,
        }
      }

      if (result.error?.includes("timed out")) {
        hasTimeout = true
      }
      if (result.error?.includes("Memory limit")) {
        hasMemoryExceeded = true
      }

      if (!firstError) {
        firstError = result.error || "Runtime error"
      }

      testResults.push({
        testIndex: i,
        input: testCase.isHidden ? "[hidden]" : testCase.input,
        expected: testCase.isHidden ? "[hidden]" : testCase.expectedOutput,
        actual: null,
        passed: false,
        error: result.error || "Execution failed",
        isHidden: testCase.isHidden || false,
      })
    } else {
      totalExecutionMs += result.executionMs || 0
      const actual = (result.output || "").trim()
      const expected = testCase.expectedOutput.trim()
      const passed = actual === expected

      testResults.push({
        testIndex: i,
        input: testCase.isHidden ? "[hidden]" : testCase.input,
        expected: testCase.isHidden ? "[hidden]" : expected,
        actual: testCase.isHidden && !passed ? "[hidden]" : actual,
        passed,
        error: null,
        isHidden: testCase.isHidden || false,
      })
    }
  }

  const allPassed = testResults.every((t) => t.passed)

  let status: FullExecutionResult["status"]
  if (allPassed) {
    status = "PASS"
  } else if (hasTimeout) {
    status = "TIMEOUT"
  } else if (hasMemoryExceeded) {
    status = "MEMORY_EXCEEDED"
  } else if (firstError) {
    status = "RUNTIME_ERROR"
  } else {
    status = "FAIL"
  }

  return {
    status,
    stdout: testResults.find((t) => t.actual)?.actual || null,
    stderr: firstError,
    compileError: null,
    executionMs: totalExecutionMs,
    testResults,
  }
}

// Build Docker image on startup
export async function ensureSandboxImage(): Promise<boolean> {
  return new Promise((resolve) => {
    const build = spawn("docker", [
      "build",
      "-t",
      DOCKER_IMAGE,
      "./docker/java-sandbox",
    ], {
      cwd: process.cwd(),
      timeout: 120000,
    })

    build.on("close", (code) => {
      resolve(code === 0)
    })

    build.on("error", () => {
      resolve(false)
    })
  })
}

// Check if Docker is available
export async function isDockerAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const docker = spawn("docker", ["info"], { timeout: 5000 })
    docker.on("close", (code) => resolve(code === 0))
    docker.on("error", () => resolve(false))
  })
}
