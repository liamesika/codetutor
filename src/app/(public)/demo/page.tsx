"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { CodeEditor } from "@/components/practice/code-editor"
import { NeonButton } from "@/components/ui/neon-button"
import { LegalFooter } from "@/components/shared/legal-footer"
import {
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Sparkles,
  Zap,
  BookOpen,
  Terminal,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

const HELLO_WORLD_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeTutor!");

        // Try modifying this code!
        String name = "World";
        System.out.println("Welcome to Java, " + name + "!");

        // Basic math
        int a = 5;
        int b = 3;
        System.out.println("5 + 3 = " + (a + b));
    }
}`

const EXAMPLE_SNIPPETS = [
  {
    name: "Hello World",
    code: HELLO_WORLD_CODE,
  },
  {
    name: "For Loop",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Counting from 1 to 5:");

        for (int i = 1; i <= 5; i++) {
            System.out.println("Number: " + i);
        }

        System.out.println("Done!");
    }
}`,
  },
  {
    name: "Array Example",
    code: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40, 50};

        System.out.println("Array elements:");
        for (int num : numbers) {
            System.out.println("- " + num);
        }

        // Calculate sum
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        System.out.println("Sum: " + sum);
    }
}`,
  },
  {
    name: "Method Example",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Testing greet method:");
        greet("Alice");
        greet("Bob");

        System.out.println("\\nTesting add method:");
        System.out.println("3 + 7 = " + add(3, 7));
        System.out.println("10 + 20 = " + add(10, 20));
    }

    public static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }

    public static int add(int a, int b) {
        return a + b;
    }
}`,
  },
]

interface ExecutionResult {
  success: boolean
  output: string
  error: string
  compileError: string | null
  durationMs: number
}

export default function DemoPage() {
  const [code, setCode] = useState(HELLO_WORLD_CODE)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [executionsRemaining, setExecutionsRemaining] = useState<number | null>(null)

  const runCode = useCallback(async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const response = await fetch("/api/demo/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      // Check rate limit header
      const remaining = response.headers.get("X-RateLimit-Remaining")
      if (remaining !== null) {
        setExecutionsRemaining(parseInt(remaining, 10))
      }

      if (!response.ok) {
        if (response.status === 429) {
          setResult({
            success: false,
            output: "",
            error: data.error || "Rate limit reached. Sign up for unlimited executions!",
            compileError: null,
            durationMs: 0,
          })
        } else {
          setResult({
            success: false,
            output: "",
            error: data.error || "Execution failed",
            compileError: null,
            durationMs: 0,
          })
        }
        return
      }

      setResult({
        success: data.success,
        output: data.output || "",
        error: data.error || "",
        compileError: data.compileError || null,
        durationMs: data.durationMs || 0,
      })
    } catch (error) {
      setResult({
        success: false,
        output: "",
        error: "Failed to execute code. Please try again.",
        compileError: null,
        durationMs: 0,
      })
    } finally {
      setIsRunning(false)
    }
  }, [code])

  const loadSnippet = (snippetCode: string) => {
    setCode(snippetCode)
    setResult(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B]">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.08),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0A0A1B]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/images/logo.png"
              alt="CodeTutor"
              width={150}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/pricing">
              <NeonButton variant="ghost" size="sm" leftIcon={<CreditCard className="h-4 w-4" />}>
                <span className="hidden sm:inline">Pricing</span>
              </NeonButton>
            </Link>
            <Link href="/signup?plan=free">
              <NeonButton size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Sign Up Free
              </NeonButton>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Hero section */}
        <section className="py-8 px-4 border-b border-white/5">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22D3EE]/20 border border-[#22D3EE]/30 mb-4">
                <Play className="h-4 w-4 text-[#22D3EE]" />
                <span className="text-sm font-medium text-[#22D3EE]">Interactive Demo</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Try Java{" "}
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
                  Right Now
                </span>
              </h1>
              <p className="text-[#9CA3AF] max-w-xl mx-auto">
                Write, edit, and run Java code instantly in your browser. No setup required.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Editor section */}
        <section className="flex-1 py-6 px-4">
          <div className="container mx-auto max-w-6xl h-full">
            <div className="grid lg:grid-cols-2 gap-6 h-full min-h-[500px]">
              {/* Editor panel */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#0F0F23]/80 overflow-hidden"
              >
                {/* Editor header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-sm text-[#6B7280]">Main.java</span>
                  </div>
                  <NeonButton
                    size="sm"
                    onClick={runCode}
                    disabled={isRunning}
                    leftIcon={isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  >
                    {isRunning ? "Running..." : "Run Code"}
                  </NeonButton>
                </div>

                {/* Example snippets */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 overflow-x-auto">
                  <span className="text-xs text-[#6B7280] flex-shrink-0">Examples:</span>
                  {EXAMPLE_SNIPPETS.map((snippet) => (
                    <button
                      key={snippet.name}
                      onClick={() => loadSnippet(snippet.code)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0",
                        code === snippet.code
                          ? "bg-[#4F46E5]/20 text-[#4F46E5] border border-[#4F46E5]/30"
                          : "bg-white/5 text-[#9CA3AF] hover:bg-white/10"
                      )}
                    >
                      {snippet.name}
                    </button>
                  ))}
                </div>

                {/* Editor */}
                <div className="flex-1 min-h-[300px]">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    language="java"
                  />
                </div>
              </motion.div>

              {/* Output panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#0F0F23]/80 overflow-hidden"
              >
                {/* Output header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-[#6B7280]" />
                    <span className="text-sm text-[#6B7280]">Output</span>
                  </div>
                  {result && (
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Success
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-400">
                          <XCircle className="h-3.5 w-3.5" />
                          Error
                        </span>
                      )}
                      {result.durationMs > 0 && (
                        <span className="text-xs text-[#6B7280]">{result.durationMs}ms</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Output content */}
                <div className="flex-1 min-h-[300px] p-4 overflow-auto font-mono text-sm">
                  <AnimatePresence mode="wait">
                    {isRunning ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center h-full"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="h-8 w-8 text-[#4F46E5] animate-spin" />
                          <span className="text-[#9CA3AF]">Compiling and running...</span>
                        </div>
                      </motion.div>
                    ) : result ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {result.compileError ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-red-400">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="font-semibold">Compilation Error</span>
                            </div>
                            <pre className="text-red-300 whitespace-pre-wrap">{result.compileError}</pre>
                          </div>
                        ) : result.error ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-red-400">
                              <XCircle className="h-4 w-4" />
                              <span className="font-semibold">Runtime Error</span>
                            </div>
                            <pre className="text-red-300 whitespace-pre-wrap">{result.error}</pre>
                          </div>
                        ) : null}

                        {result.output && (
                          <div className="space-y-2">
                            {!result.compileError && !result.error && (
                              <div className="flex items-center gap-2 text-green-400 mb-2">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="font-semibold">Program Output</span>
                              </div>
                            )}
                            <pre className="text-[#E5E7EB] whitespace-pre-wrap">{result.output}</pre>
                          </div>
                        )}

                        {!result.output && !result.error && !result.compileError && (
                          <div className="text-[#6B7280] italic">
                            Program executed successfully with no output.
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full text-center"
                      >
                        <Play className="h-12 w-12 text-[#4F46E5]/30 mb-4" />
                        <p className="text-[#6B7280] mb-2">
                          Click &quot;Run Code&quot; to see the output
                        </p>
                        <p className="text-xs text-[#4B5563]">
                          Ctrl/Cmd + Enter to run
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Rate limit notice */}
                {executionsRemaining !== null && executionsRemaining <= 3 && (
                  <div className="px-4 py-3 border-t border-white/10 bg-[#F59E0B]/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#F59E0B] text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{executionsRemaining} executions remaining in demo</span>
                      </div>
                      <Link href="/signup?plan=free">
                        <button className="text-xs text-[#22D3EE] hover:underline">
                          Sign up for unlimited
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-12 px-4 border-t border-white/5">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-8 bg-gradient-to-br from-[#4F46E5]/20 to-[#22D3EE]/10 border border-[#4F46E5]/30 text-center"
            >
              <Sparkles className="h-10 w-10 text-[#4F46E5] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">Ready for the full experience?</h2>
              <p className="text-[#9CA3AF] mb-6 max-w-lg mx-auto">
                Get access to 200+ Java challenges, progress tracking, XP system, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signup?plan=free">
                  <NeonButton size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Start Free - Week 1
                  </NeonButton>
                </Link>
                <Link href="/pricing">
                  <NeonButton variant="ghost" size="lg" leftIcon={<BookOpen className="h-5 w-5" />}>
                    View All Plans
                  </NeonButton>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#22D3EE]" />
                  <span>200+ Challenges</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#22D3EE]" />
                  <span>9 Weeks of Content</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-[#22D3EE]" />
                  <span>Track Progress</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <LegalFooter variant="compact" />
    </div>
  )
}
