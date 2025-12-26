const express = require('express');
const cors = require('cors');
const { spawn, execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const os = require('os');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3001;
const EXECUTOR_SECRET = process.env.EXECUTOR_SECRET || 'dev-secret';
const WORK_DIR = path.join(os.tmpdir(), 'codetutor-executor');

// Ensure work directory exists
fs.mkdir(WORK_DIR, { recursive: true }).catch(() => {});

// Security patterns to block
const DANGEROUS_PATTERNS = [
  /Runtime\.getRuntime\(\)/,
  /ProcessBuilder/,
  /java\.lang\.reflect/,
  /java\.net\./,
  /java\.nio\.file\.Files/,
  /System\.exit/,
  /ClassLoader/,
  /SecurityManager/,
  /java\.awt/,
  /javax\.swing/,
  /Thread\.sleep\s*\(\s*\d{5,}\s*\)/,
];

function sanitizeCode(code) {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return { safe: false, reason: `Blocked pattern: ${pattern.source.substring(0, 30)}...` };
    }
  }
  return { safe: true };
}

function authMiddleware(req, res, next) {
  const token = req.headers['x-executor-token'];
  if (token !== EXECUTOR_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

function isJavaAvailable() {
  try {
    execSync('javac -version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Root health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'executor', java: isJavaAvailable() });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'executor', java: isJavaAvailable() });
});

// Execute Java code
app.post('/execute', authMiddleware, async (req, res) => {
  const { code, testCases } = req.body;

  if (!code || !testCases || !Array.isArray(testCases)) {
    return res.status(400).json({ error: 'Invalid request: code and testCases required' });
  }

  const validation = sanitizeCode(code);
  if (!validation.safe) {
    return res.json({
      status: 'COMPILE_ERROR',
      stdout: null,
      stderr: validation.reason,
      compileError: validation.reason,
      executionMs: 0,
      testResults: testCases.map((tc, i) => ({
        testIndex: i,
        input: tc.isHidden ? '[hidden]' : tc.input,
        expected: tc.isHidden ? '[hidden]' : tc.expectedOutput,
        actual: null,
        passed: false,
        error: validation.reason,
        isHidden: tc.isHidden || false,
      })),
    });
  }

  const execId = uuidv4();
  const execDir = path.join(WORK_DIR, execId);

  try {
    await fs.mkdir(execDir, { recursive: true });

    const classNameMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classNameMatch ? classNameMatch[1] : 'Solution';
    const javaFile = path.join(execDir, `${className}.java`);

    await fs.writeFile(javaFile, code);

    // Compile
    const compileResult = await runCommand('javac', [javaFile], execDir, 30000);

    if (compileResult.exitCode !== 0) {
      const compileError = compileResult.stderr || compileResult.stdout || 'Compilation failed';
      return res.json({
        status: 'COMPILE_ERROR',
        stdout: null,
        stderr: compileError,
        compileError: compileError,
        executionMs: compileResult.executionMs,
        testResults: testCases.map((tc, i) => ({
          testIndex: i,
          input: tc.isHidden ? '[hidden]' : tc.input,
          expected: tc.isHidden ? '[hidden]' : tc.expectedOutput,
          actual: null,
          passed: false,
          error: compileError,
          isHidden: tc.isHidden || false,
        })),
      });
    }

    // Run tests
    const testResults = [];
    let totalExecutionMs = 0;
    let hasTimeout = false;
    let hasRuntimeError = false;
    let firstError = null;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

      const runResult = await runCommand('java', ['-cp', execDir, className], execDir, 5000, tc.input);
      totalExecutionMs += runResult.executionMs;

      if (runResult.timeout) {
        hasTimeout = true;
        testResults.push({
          testIndex: i,
          input: tc.isHidden ? '[hidden]' : tc.input,
          expected: tc.isHidden ? '[hidden]' : tc.expectedOutput,
          actual: null,
          passed: false,
          error: 'Execution timed out (5s limit)',
          isHidden: tc.isHidden || false,
        });
        continue;
      }

      if (runResult.exitCode !== 0) {
        hasRuntimeError = true;
        const error = runResult.stderr || 'Runtime error';
        if (!firstError) firstError = error;
        testResults.push({
          testIndex: i,
          input: tc.isHidden ? '[hidden]' : tc.input,
          expected: tc.isHidden ? '[hidden]' : tc.expectedOutput,
          actual: null,
          passed: false,
          error: error,
          isHidden: tc.isHidden || false,
        });
        continue;
      }

      const actual = (runResult.stdout || '').trim();
      const expected = (tc.expectedOutput || '').trim();
      const passed = actual === expected;

      testResults.push({
        testIndex: i,
        input: tc.isHidden ? '[hidden]' : tc.input,
        expected: tc.isHidden ? '[hidden]' : expected,
        actual: tc.isHidden && !passed ? '[hidden]' : actual,
        passed,
        error: null,
        isHidden: tc.isHidden || false,
      });
    }

    const allPassed = testResults.every(t => t.passed);
    let status;
    if (allPassed) {
      status = 'PASS';
    } else if (hasTimeout) {
      status = 'TIMEOUT';
    } else if (hasRuntimeError) {
      status = 'RUNTIME_ERROR';
    } else {
      status = 'FAIL';
    }

    res.json({
      status,
      stdout: testResults.find(t => t.actual)?.actual || null,
      stderr: firstError,
      compileError: null,
      executionMs: totalExecutionMs,
      testResults,
    });
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ error: 'Internal execution error' });
  } finally {
    try {
      await fs.rm(execDir, { recursive: true, force: true });
    } catch {}
  }
});

function runCommand(cmd, args, cwd, timeout, stdin = '') {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const proc = spawn(cmd, args, {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGKILL');
    }, timeout);

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
      if (stdout.length > 100000) {
        proc.kill('SIGKILL');
      }
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    if (stdin) {
      proc.stdin.write(stdin);
    }
    proc.stdin.end();

    proc.on('close', (code) => {
      clearTimeout(timer);
      resolve({
        exitCode: timedOut ? -1 : (code || 0),
        stdout: stdout.slice(0, 50000),
        stderr: stderr.slice(0, 50000),
        timeout: timedOut,
        executionMs: Date.now() - startTime,
      });
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        exitCode: -1,
        stdout: '',
        stderr: err.message,
        timeout: false,
        executionMs: Date.now() - startTime,
      });
    });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CodeTutor Executor running on port ${PORT}`);
  console.log(`Java available: ${isJavaAvailable()}`);
});
