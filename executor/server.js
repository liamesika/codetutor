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

// Version info (cached at startup)
let nodeVersion = process.version;
let javaVersion = 'unknown';
let javacVersion = 'unknown';
let startupTime = null;

// Get Java version synchronously at startup
function getJavaVersion() {
  try {
    const result = execSync('java -version 2>&1', { encoding: 'utf8' });
    const match = result.match(/version "([^"]+)"/);
    return match ? match[1] : result.split('\n')[0];
  } catch (e) {
    return 'not available';
  }
}

function getJavacVersion() {
  try {
    const result = execSync('javac -version 2>&1', { encoding: 'utf8' });
    return result.trim();
  } catch (e) {
    return 'not available';
  }
}

function isJavaAvailable() {
  try {
    execSync('javac -version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

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
      return { safe: false, reason: 'Blocked pattern: ' + pattern.source.substring(0, 30) + '...' };
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

// Root health check
app.get('/', function(req, res) {
  res.json({
    status: 'ok',
    service: 'codetutor-executor',
    nodeVersion: nodeVersion,
    javaVersion: javaVersion,
    javaAvailable: isJavaAvailable(),
    uptime: process.uptime(),
    startupTime: startupTime
  });
});

// Enhanced health check with full version info
app.get('/health', function(req, res) {
  var javaOk = isJavaAvailable();
  var nodeOk = parseInt(nodeVersion.slice(1).split('.')[0], 10) >= 18;

  res.json({
    status: javaOk && nodeOk ? 'ok' : 'degraded',
    service: 'codetutor-executor',
    nodeVersion: nodeVersion,
    javaVersion: javaVersion,
    javacVersion: javacVersion,
    javaAvailable: javaOk,
    nodeVersionOk: nodeOk,
    uptime: process.uptime(),
    startupTime: startupTime,
    memory: {
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    },
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development',
      JAVA_HOME: process.env.JAVA_HOME || 'not set',
      platform: process.platform,
      arch: process.arch
    }
  });
});

// Execute Java code
app.post('/execute', authMiddleware, async function(req, res) {
  var code = req.body.code;
  var testCases = req.body.testCases;

  if (!code || !testCases || !Array.isArray(testCases)) {
    return res.status(400).json({ error: 'Invalid request: code and testCases required' });
  }

  var validation = sanitizeCode(code);
  if (!validation.safe) {
    return res.json({
      status: 'COMPILE_ERROR',
      stdout: null,
      stderr: validation.reason,
      compileError: validation.reason,
      executionMs: 0,
      testResults: testCases.map(function(tc, i) {
        return {
          testIndex: i,
          input: tc.isHidden ? '[hidden]' : tc.input,
          expected: tc.isHidden ? '[hidden]' : tc.expectedOutput,
          actual: null,
          passed: false,
          error: validation.reason,
          isHidden: tc.isHidden || false
        };
      })
    });
  }

  var execId = uuidv4();
  var execDir = path.join(WORK_DIR, execId);

  try {
    await fs.mkdir(execDir, { recursive: true });

    var classNameMatch = code.match(/public\s+class\s+(\w+)/);
    var className = classNameMatch ? classNameMatch[1] : 'Solution';
    var javaFile = path.join(execDir, className + '.java');

    await fs.writeFile(javaFile, code);

    // Compile
    var compileResult = await runCommand('javac', [javaFile], execDir, 30000);

    if (compileResult.exitCode !== 0) {
      var compileError = compileResult.stderr || compileResult.stdout || 'Compilation failed';
      return res.json({
        status: 'COMPILE_ERROR',
        stdout: null,
        stderr: compileError,
        compileError: compileError,
        executionMs: compileResult.executionMs,
        testResults: testCases.map(function(tc, i) {
          return {
            testIndex: i,
            input: tc.isHidden ? '[hidden]' : tc.input,
            expected: tc.isHidden ? '[hidden]' : tc.expectedOutput,
            actual: null,
            passed: false,
            error: compileError,
            isHidden: tc.isHidden || false
          };
        })
      });
    }

    // Run tests
    var testResults = [];
    var totalExecutionMs = 0;
    var hasTimeout = false;
    var hasRuntimeError = false;
    var firstError = null;

    for (var i = 0; i < testCases.length; i++) {
      var tc = testCases[i];

      var runResult = await runCommand('java', ['-cp', execDir, className], execDir, 5000, tc.input);
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
          isHidden: tc.isHidden || false
        });
        continue;
      }

      if (runResult.exitCode !== 0) {
        hasRuntimeError = true;
        var error = runResult.stderr || 'Runtime error';
        if (!firstError) firstError = error;
        testResults.push({
          testIndex: i,
          input: tc.isHidden ? '[hidden]' : tc.input,
          expected: tc.isHidden ? '[hidden]' : tc.expectedOutput,
          actual: null,
          passed: false,
          error: error,
          isHidden: tc.isHidden || false
        });
        continue;
      }

      var actual = (runResult.stdout || '').trim();
      var expected = (tc.expectedOutput || '').trim();
      var passed = actual === expected;

      testResults.push({
        testIndex: i,
        input: tc.isHidden ? '[hidden]' : tc.input,
        expected: tc.isHidden ? '[hidden]' : expected,
        actual: tc.isHidden && !passed ? '[hidden]' : actual,
        passed: passed,
        error: null,
        isHidden: tc.isHidden || false
      });
    }

    var allPassed = testResults.every(function(t) { return t.passed; });
    var status;
    if (allPassed) {
      status = 'PASS';
    } else if (hasTimeout) {
      status = 'TIMEOUT';
    } else if (hasRuntimeError) {
      status = 'RUNTIME_ERROR';
    } else {
      status = 'FAIL';
    }

    var stdoutResult = null;
    for (var j = 0; j < testResults.length; j++) {
      if (testResults[j].actual) {
        stdoutResult = testResults[j].actual;
        break;
      }
    }

    res.json({
      status: status,
      stdout: stdoutResult,
      stderr: firstError,
      compileError: null,
      executionMs: totalExecutionMs,
      testResults: testResults
    });
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ error: 'Internal execution error' });
  } finally {
    try {
      await fs.rm(execDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
});

function runCommand(cmd, args, cwd, timeout, stdin) {
  stdin = stdin || '';
  return new Promise(function(resolve) {
    var startTime = Date.now();
    var stdout = '';
    var stderr = '';
    var timedOut = false;

    var proc = spawn(cmd, args, {
      cwd: cwd,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    var timer = setTimeout(function() {
      timedOut = true;
      proc.kill('SIGKILL');
    }, timeout);

    proc.stdout.on('data', function(data) {
      stdout += data.toString();
      if (stdout.length > 100000) {
        proc.kill('SIGKILL');
      }
    });

    proc.stderr.on('data', function(data) {
      stderr += data.toString();
    });

    if (stdin) {
      proc.stdin.write(stdin);
    }
    proc.stdin.end();

    proc.on('close', function(code) {
      clearTimeout(timer);
      resolve({
        exitCode: timedOut ? -1 : (code || 0),
        stdout: stdout.slice(0, 50000),
        stderr: stderr.slice(0, 50000),
        timeout: timedOut,
        executionMs: Date.now() - startTime
      });
    });

    proc.on('error', function(err) {
      clearTimeout(timer);
      resolve({
        exitCode: -1,
        stdout: '',
        stderr: err.message,
        timeout: false,
        executionMs: Date.now() - startTime
      });
    });
  });
}

// Startup function
function startup() {
  // Get version info
  javaVersion = getJavaVersion();
  javacVersion = getJavacVersion();
  startupTime = new Date().toISOString();

  // Log startup info
  console.log('========================================');
  console.log('  CodeTutor Executor Starting');
  console.log('========================================');
  console.log('NODE_VERSION: ' + nodeVersion);
  console.log('JAVA_VERSION: ' + javaVersion);
  console.log('JAVAC_VERSION: ' + javacVersion);
  console.log('JAVA_HOME: ' + (process.env.JAVA_HOME || 'not set'));
  console.log('NODE_ENV: ' + (process.env.NODE_ENV || 'development'));
  console.log('PORT: ' + PORT);
  console.log('WORK_DIR: ' + WORK_DIR);
  console.log('PLATFORM: ' + process.platform + ' ' + process.arch);
  console.log('EXECUTOR_SECRET: ' + (EXECUTOR_SECRET ? '[configured]' : '[NOT SET - WARNING]'));
  console.log('========================================');

  // Verify Node version is 18+
  var nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  if (nodeMajor < 18) {
    console.error('CRITICAL: Node version ' + nodeVersion + ' is below v18!');
    console.error('This executor requires Node.js 18 or higher.');
    process.exit(1);
  }
  console.log('Node version check: PASSED (v18+ required)');

  // Verify Java is available
  if (!isJavaAvailable()) {
    console.error('WARNING: Java/javac not available!');
    console.error('Code execution will fail.');
  } else {
    console.log('Java availability check: PASSED');
  }

  console.log('========================================');

  // Start server
  app.listen(PORT, '0.0.0.0', function() {
    console.log('CodeTutor Executor listening on port ' + PORT);
    console.log('Health check: http://localhost:' + PORT + '/health');
    console.log('========================================');
  });
}

// Run startup
startup();
