"use client"

import { useEffect, useState, useCallback, use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { routes } from "@/lib/routes"
import { useInvalidateStats, useIsExecutorAvailable, useInvalidateProgression, useForceHealthCheck } from "@/lib/hooks"
import { useLevelUpContext } from "@/components/providers/level-up-provider"
import { useXp } from "@/components/providers/xp-provider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExecutorStatusBadge } from "@/components/executor-status-banner"
import { ExecutionDebugPanel } from "@/components/execution-debug-panel"
import { Card, CardContent } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  CodeEditor,
  QuestionPanel,
  ResultsPanel,
  ActionBar,
} from "@/components/practice"
import { deriveResultState } from "@/components/practice/results-panel"
import {
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
  Code2,
  FileQuestion,
  MessageSquare,
  Zap,
  Clock,
  AlertTriangle,
  Home,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { SubscriptionGate } from "@/components/subscription/subscription-gate"
import { ExecutionOverlay } from "@/components/overlays/execution-overlay"

interface SubscriptionCheck {
  isLocked: boolean
  weekNumber?: number
  message?: string
}

interface Question {
  id: string
  title: string
  type: string
  prompt: string
  constraints: string | null
  starterCode: string
  difficulty: number
  estimatedMinutes: number
  points: number
  hints: string[]
  hintsUsed: number
  draft: string | null
  attemptCount: number
  hasPassed: boolean
  topic: {
    id: string
    title: string
    slug: string
    week: {
      id: string
      weekNumber: number
      title: string
    }
  }
  tags: string[]
}

interface ExecutionResult {
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
  pointsEarned: number
  progression?: {
    xpAwarded: number
    xpBreakdown: { label: string; amount: number }[]
    isFirstPass: boolean
    leveledUp: boolean
    previousLevel: number
    newLevel: number
    newXp: number
    streak: number
    dailyChallengeBonus: number
  } | null
}

interface NextQuestionResponse {
  questionId: string | null
  topicId?: string
  topicTitle?: string
  questionTitle?: string
  difficulty?: number
  reason?: string
  message?: string
  weekComplete?: boolean
  weekNumber?: number
  error?: string
}

// Not found component - displayed when question doesn't exist
function QuestionNotFound() {
  return (
    <div className="h-dvh bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1E1B4B]/80 border-amber-500/30 backdrop-blur-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="size-10 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Question Not Found
          </h1>
          <p className="text-[#9CA3AF] mb-6">
            This question doesn&apos;t exist or may have been removed.
            Please go back to the dashboard to find another challenge.
          </p>
          <Link href={routes.dashboard()}>
            <Button className="gap-2 bg-[#4F46E5] hover:bg-[#4F46E5]/80">
              <Home className="size-4" />
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="h-dvh flex flex-col bg-background">
      <div className="p-4 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="skeleton h-8 w-8 rounded-lg bg-[#4F46E5]/20" />
          <div className="skeleton h-5 w-64 rounded bg-[#4F46E5]/20" />
        </div>
      </div>
      <div className="flex-1 flex p-4 gap-4 min-h-0">
        <div className="flex-1 glass-card p-4 flex flex-col">
          <div className="skeleton h-8 w-48 rounded mb-4 bg-[#4F46E5]/20" />
          <div className="flex-1 skeleton rounded-lg bg-[#4F46E5]/20" />
        </div>
        <div className="w-[400px] glass-card p-4 hidden lg:flex flex-col gap-4">
          <div className="skeleton h-6 w-32 rounded bg-[#4F46E5]/20" />
          <div className="skeleton h-4 w-full rounded bg-[#4F46E5]/20" />
          <div className="skeleton h-4 w-3/4 rounded bg-[#4F46E5]/20" />
          <div className="skeleton h-32 w-full rounded-lg mt-4 bg-[#4F46E5]/20" />
        </div>
      </div>
      <div className="glass-card border-t-0 rounded-t-none p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="skeleton h-9 w-20 rounded-lg bg-[#4F46E5]/20" />
            <div className="skeleton h-9 w-20 rounded-lg bg-[#4F46E5]/20" />
          </div>
          <div className="skeleton h-10 w-36 rounded-xl bg-[#4F46E5]/20" />
        </div>
      </div>
    </div>
  )
}

export default function PracticePage({
  params,
}: {
  params: Promise<{ questionId: string }>
}) {
  // Unwrap params first (React 19 async params)
  const { questionId } = use(params)

  // ALL useState calls MUST be at the top level, before any conditions
  const [code, setCode] = useState("")
  const [originalCode, setOriginalCode] = useState("")
  const [hintsUsed, setHintsUsed] = useState(0)
  const [solutionRevealed, setSolutionRevealed] = useState(false)
  const [solutionCode, setSolutionCode] = useState<string>()
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [activeTab, setActiveTab] = useState("question")
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [nextError, setNextError] = useState<string | null>(null)
  const [isLoadingNext, setIsLoadingNext] = useState(false)

  // Hooks
  const { status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const isExecutorAvailable = useIsExecutorAvailable()
  const invalidateStats = useInvalidateStats()
  const invalidateProgression = useInvalidateProgression()
  const forceHealthCheck = useForceHealthCheck()
  const { triggerLevelUp } = useLevelUpContext()

  // Force health check on page mount to ensure fresh status
  useEffect(() => {
    forceHealthCheck()
  }, [forceHealthCheck])

  // Fetch question data - with proper error handling
  const {
    data: question,
    isLoading,
    isError,
  } = useQuery<Question>({
    queryKey: ["question", questionId],
    queryFn: async () => {
      if (!questionId) throw new Error("No question ID provided")
      const res = await fetch(routes.api.questions(questionId))
      if (!res.ok) {
        if (res.status === 404) throw new Error("Question not found")
        throw new Error("Failed to fetch question")
      }
      return res.json()
    },
    enabled: !!questionId && status === "authenticated",
    retry: false, // Don't retry on 404
  })

  // Check subscription access
  const { data: subscriptionCheck } = useQuery<SubscriptionCheck>({
    queryKey: ["subscriptionCheck", "question", questionId],
    queryFn: async () => {
      const res = await fetch("/api/subscription/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId }),
      })
      if (!res.ok) return { isLocked: false }
      return res.json()
    },
    enabled: !!questionId && status === "authenticated",
  })

  // Initialize code from draft or starter
  useEffect(() => {
    if (question) {
      const initialCode = question.draft || question.starterCode
      setCode(initialCode)
      setOriginalCode(question.starterCode)
      setHintsUsed(question.hintsUsed)
    }
  }, [question])

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (draftCode: string) => {
      const res = await fetch(routes.api.drafts(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, code: draftCode }),
      })
      if (!res.ok) throw new Error("Failed to save draft")
    },
    onSuccess: () => {
      toast.success("Draft saved")
    },
  })

  // Execute code mutation
  const executeMutation = useMutation({
    mutationFn: async ({ runOnly }: { runOnly: boolean }) => {
      const res = await fetch(routes.api.execute(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, code, runOnly }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to execute")
      }
      return res.json() as Promise<ExecutionResult>
    },
    onSuccess: (data) => {
      setResult(data)
      setActiveTab("feedback")
      if (data.status === "PASS") {
        toast.success(`Great job! +${data.pointsEarned} XP`)
        invalidateStats()
        invalidateProgression()
        queryClient.invalidateQueries({ queryKey: ["courses"] })

        // Check for level up and trigger ceremony
        if (data.progression?.leveledUp && data.progression.previousLevel && data.progression.newLevel) {
          setTimeout(() => {
            triggerLevelUp(data.progression!.previousLevel, data.progression!.newLevel)
          }, 500)
        }
      }
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  // Use XP provider for refreshing after transactions
  const { refreshXp } = useXp()

  // Use hint mutation
  const hintMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(routes.api.hint(questionId), {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) {
        // Handle INSUFFICIENT_XP error specially
        if (data.error === "INSUFFICIENT_XP") {
          throw new Error(`Not enough XP! You need ${data.required} XP but only have ${data.available} XP.`)
        }
        throw new Error(data.error || "Failed to get hint")
      }
      return data
    },
    onSuccess: (data) => {
      setHintsUsed((prev) => prev + 1)
      toast.info(`Hint ${data.hintIndex + 1}: -${data.pointsDeducted} XP`)
      queryClient.invalidateQueries({ queryKey: ["question", questionId] })
      // Refresh XP state globally
      refreshXp()
    },
    onError: (err) => {
      toast.error(err.message)
      // Refresh XP to ensure UI is in sync
      refreshXp()
    },
  })

  // Reveal solution mutation
  const revealMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(routes.api.solution(questionId), {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) {
        // Handle INSUFFICIENT_XP error specially
        if (data.error === "INSUFFICIENT_XP") {
          throw new Error(`Not enough XP! You need ${data.required} XP but only have ${data.available} XP.`)
        }
        throw new Error(data.error || "Failed to reveal solution")
      }
      return data
    },
    onSuccess: (data) => {
      setSolutionRevealed(true)
      setSolutionCode(data.solutionCode)
      toast.info(`Solution revealed: -${data.pointsDeducted} XP`)
      // Refresh XP state globally
      refreshXp()
    },
    onError: (err) => {
      toast.error(err.message)
      // Refresh XP to ensure UI is in sync
      refreshXp()
    },
  })

  // Handle save (Ctrl+S)
  useEffect(() => {
    const handleSave = () => {
      if (code !== originalCode && code !== question?.draft) {
        saveDraftMutation.mutate(code)
      }
    }

    document.addEventListener("editor-save", handleSave)
    return () => document.removeEventListener("editor-save", handleSave)
  }, [code, originalCode, question?.draft, saveDraftMutation])

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!question || code === question.starterCode) return

    const interval = setInterval(() => {
      if (code !== question.draft) {
        saveDraftMutation.mutate(code)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [code, question, saveDraftMutation])

  // Action handlers
  const handleRun = useCallback(() => {
    executeMutation.mutate({ runOnly: true })
  }, [executeMutation])

  const handleCheck = useCallback(() => {
    executeMutation.mutate({ runOnly: false })
  }, [executeMutation])

  const handleHint = useCallback(() => {
    hintMutation.mutate()
  }, [hintMutation])

  const handleReset = useCallback(() => {
    if (originalCode) {
      setCode(originalCode)
      setResult(null)
      toast.info("Code reset to starter")
    }
  }, [originalCode])

  const handleSave = useCallback(() => {
    saveDraftMutation.mutate(code)
  }, [code, saveDraftMutation])

  // FIXED: Next button contract - NO fallback redirect, show error inline instead
  const handleNextQuestion = useCallback(async () => {
    setNextError(null)
    setIsLoadingNext(true)

    try {
      // Fetch next question from adaptive algorithm with current topic context
      const res = await fetch(`/api/next-question?topicId=${question?.topic?.id || ""}`)
      const data: NextQuestionResponse = await res.json()

      if (!res.ok) {
        // API returned error - show inline, don't redirect
        setNextError(data.error || "Failed to get next question")
        setIsLoadingNext(false)
        return
      }

      if (data.questionId) {
        // Navigate to the next question
        router.push(routes.practice(data.questionId))
      } else if (data.weekComplete || data.message?.includes("completed")) {
        // Sequence is finished - show completion and go to dashboard
        toast.success(data.message || "Great job! All questions completed!")
        router.push(routes.dashboard())
      } else {
        // No more questions - show completion
        toast.success(data.message || "All questions completed!")
        router.push(routes.dashboard())
      }
    } catch (err) {
      // Network/unknown error - show inline, don't redirect
      setNextError("Network error. Please try again.")
      setIsLoadingNext(false)
    }
  }, [router, question?.topic?.id])

  // Retry next question (used after error)
  const handleRetryNext = useCallback(() => {
    setNextError(null)
    handleNextQuestion()
  }, [handleNextQuestion])

  const handleRetry = useCallback(() => {
    setResult(null)
    setActiveTab("code")
  }, [])

  // Back to week handler
  const handleBackToWeek = useCallback(() => {
    if (question?.topic?.id) {
      router.push(routes.learn(question.topic.id))
    } else {
      router.push(routes.dashboard())
    }
  }, [router, question?.topic?.id])

  // RENDER CONDITIONS - after all hooks are called

  // Show loading state
  if (status === "loading" || isLoading) {
    return <LoadingSkeleton />
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push(routes.login())
    return <LoadingSkeleton />
  }

  // Show not found if question doesn't exist or error occurred
  if (isError || !question) {
    return <QuestionNotFound />
  }

  // Check if content is locked
  const isLocked = subscriptionCheck?.isLocked ?? false
  const weekNumber = subscriptionCheck?.weekNumber ?? question.topic?.week?.weekNumber

  // Show subscription gate if locked
  if (isLocked) {
    return (
      <div className="h-dvh bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26]">
        <SubscriptionGate isLocked={true} weekNumber={weekNumber}>
          <div className="h-screen" />
        </SubscriptionGate>
      </div>
    )
  }

  // Computed values
  const hasChanges = code !== originalCode && code !== (question.draft || "")
  const hintsAvailable = question.hints.length - hintsUsed

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-background">
      {/* Header - shrink-0 to prevent flex growth */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border-b border-border/50 bg-background/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between shrink-0"
      >
        <div className="flex items-center gap-4">
          <Link href={question.topic?.id ? routes.learn(question.topic.id) : routes.dashboard()}>
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent/50">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={routes.dashboard()} className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {question.topic && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={routes.learn(question.topic.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Week {question.topic.week?.weekNumber || "?"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">{question.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="md:hidden">
            <h1 className="font-semibold truncate">{question.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ExecutorStatusBadge />
          <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary" />
              <span>{question.points} XP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>~{question.estimatedMinutes}m</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex hover:bg-accent/50"
            onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            aria-label={isPanelCollapsed ? "Show panel" : "Hide panel"}
          >
            {isPanelCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.header>

      {/* Desktop layout - flex-1 with min-h-0 for proper overflow */}
      <div className="flex-1 hidden lg:flex overflow-hidden p-4 gap-4 min-h-0">
        {/* Code editor panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 flex flex-col min-w-0 min-h-0 glass-card overflow-hidden"
        >
          <div className="flex-1 overflow-hidden rounded-t-2xl min-h-0">
            <CodeEditor
              value={code}
              onChange={setCode}
              language="java"
            />
          </div>
          <ActionBar
            onRun={handleRun}
            onCheck={handleCheck}
            onHint={handleHint}
            onReset={handleReset}
            onSave={handleSave}
            isRunning={executeMutation.isPending && executeMutation.variables?.runOnly}
            isChecking={executeMutation.isPending && !executeMutation.variables?.runOnly}
            isSaving={saveDraftMutation.isPending}
            hintsAvailable={hintsAvailable}
            hasChanges={hasChanges}
            executorAvailable={isExecutorAvailable}
          />
        </motion.div>

        {/* Side panel - bounded height with internal scroll */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={cn(
            "glass-card flex flex-col transition-all duration-300 overflow-hidden min-h-0",
            isPanelCollapsed
              ? "w-0 overflow-hidden opacity-0"
              : activeTab === "feedback" && deriveResultState(result) === "FAILURE"
                ? "flex-1"
                : "w-[400px] xl:w-[480px]"
          )}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent px-4 pt-2 shrink-0">
              <TabsTrigger
                value="question"
                className="gap-2 data-[state=active]:bg-accent/50 data-[state=active]:shadow-none rounded-lg"
              >
                <FileQuestion className="h-4 w-4" />
                Question
              </TabsTrigger>
              <TabsTrigger
                value="feedback"
                className={cn(
                  "gap-2 data-[state=active]:bg-accent/50 data-[state=active]:shadow-none rounded-lg",
                  result?.status === "PASS" && "data-[state=active]:bg-green-500/20",
                  result?.status === "FAIL" && "data-[state=active]:bg-red-500/20"
                )}
              >
                <MessageSquare className="h-4 w-4" />
                Results
                {result && (
                  <Badge
                    variant={result.status === "PASS" ? "default" : "destructive"}
                    className="ml-1 h-5 px-1.5 text-[10px]"
                  >
                    {result.status === "PASS" ? "PASS" : "!"}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="solution"
                className="gap-2 data-[state=active]:bg-accent/50 data-[state=active]:shadow-none rounded-lg"
              >
                <Eye className="h-4 w-4" />
                Solution
              </TabsTrigger>
            </TabsList>

            {/* Tab content with its own scroll container */}
            <TabsContent value="question" className="flex-1 mt-0 overflow-y-auto min-h-0">
              <QuestionPanel
                question={{
                  ...question,
                  hints: question.hints,
                }}
                hintsUsed={hintsUsed}
                onUseHint={handleHint}
                onRevealSolution={() => revealMutation.mutate()}
                solutionRevealed={solutionRevealed}
                solutionCode={solutionCode}
                hideSolution={true}
              />
            </TabsContent>
            <TabsContent value="feedback" className="flex-1 mt-0 overflow-y-auto min-h-0">
              <ResultsPanel
                result={result}
                isLoading={executeMutation.isPending}
                onNextQuestion={handleNextQuestion}
                onRetryNext={handleRetryNext}
                onRetry={handleRetry}
                onBackToWeek={handleBackToWeek}
                nextError={nextError}
                isLoadingNext={isLoadingNext}
                questionId={questionId}
                code={code}
              />
            </TabsContent>
            <TabsContent value="solution" className="flex-1 mt-0 overflow-y-auto min-h-0">
              <QuestionPanel
                question={{
                  ...question,
                  hints: question.hints,
                }}
                hintsUsed={hintsUsed}
                onUseHint={handleHint}
                onRevealSolution={() => revealMutation.mutate()}
                solutionRevealed={solutionRevealed}
                solutionCode={solutionCode}
                showOnlySolution={true}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Mobile layout - proper tab-based scrolling with safe areas */}
      <div className="flex-1 flex flex-col overflow-hidden lg:hidden min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent px-2 shrink-0">
            <TabsTrigger
              value="question"
              className="gap-1 data-[state=active]:bg-accent/50 data-[state=active]:shadow-none rounded-lg text-xs px-2"
            >
              <FileQuestion className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Question</span>
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="gap-1 data-[state=active]:bg-accent/50 data-[state=active]:shadow-none rounded-lg text-xs px-2"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Code</span>
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className={cn(
                "gap-1 data-[state=active]:bg-accent/50 data-[state=active]:shadow-none rounded-lg text-xs px-2",
                result?.status === "PASS" && "data-[state=active]:bg-green-500/20",
                result?.status === "FAIL" && "data-[state=active]:bg-red-500/20"
              )}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Results</span>
              {result && (
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    result.status === "PASS" ? "bg-green-500" : "bg-red-500"
                  )}
                />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="solution"
              className="gap-1 data-[state=active]:bg-accent/50 data-[state=active]:shadow-none rounded-lg text-xs px-2"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Solution</span>
            </TabsTrigger>
          </TabsList>

          {/* Each tab content has its own scroll container */}
          <TabsContent value="question" className="flex-1 mt-0 overflow-y-auto min-h-0">
            <QuestionPanel
              question={{
                ...question,
                hints: question.hints,
              }}
              hintsUsed={hintsUsed}
              onUseHint={handleHint}
              onRevealSolution={() => revealMutation.mutate()}
              solutionRevealed={solutionRevealed}
              solutionCode={solutionCode}
              hideSolution={true}
            />
          </TabsContent>

          <TabsContent value="code" className="flex-1 mt-0 overflow-hidden flex flex-col min-h-0">
            <div className="flex-1 overflow-hidden min-h-0">
              <CodeEditor
                value={code}
                onChange={setCode}
                language="java"
              />
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="flex-1 mt-0 overflow-y-auto min-h-0">
            <ResultsPanel
              result={result}
              isLoading={executeMutation.isPending}
              onNextQuestion={handleNextQuestion}
              onRetryNext={handleRetryNext}
              onRetry={handleRetry}
              onBackToWeek={handleBackToWeek}
              nextError={nextError}
              isLoadingNext={isLoadingNext}
              questionId={questionId}
              code={code}
            />
          </TabsContent>

          <TabsContent value="solution" className="flex-1 mt-0 overflow-y-auto min-h-0">
            <QuestionPanel
              question={{
                ...question,
                hints: question.hints,
              }}
              hintsUsed={hintsUsed}
              onUseHint={handleHint}
              onRevealSolution={() => revealMutation.mutate()}
              solutionRevealed={solutionRevealed}
              solutionCode={solutionCode}
              showOnlySolution={true}
            />
          </TabsContent>
        </Tabs>

        {/* Mobile action bar - shrink-0 with safe area padding */}
        <div className="shrink-0 pb-safe">
          <ActionBar
            onRun={handleRun}
            onCheck={handleCheck}
            onHint={handleHint}
            onReset={handleReset}
            onSave={handleSave}
            isRunning={executeMutation.isPending && executeMutation.variables?.runOnly}
            isChecking={executeMutation.isPending && !executeMutation.variables?.runOnly}
            isSaving={saveDraftMutation.isPending}
            hintsAvailable={hintsAvailable}
            hasChanges={hasChanges}
            executorAvailable={isExecutorAvailable}
          />
        </div>

      </div>

      {/* Dev-only debug panel */}
      <ExecutionDebugPanel />

      {/* Execution immersion overlay */}
      <ExecutionOverlay isExecuting={executeMutation.isPending} />
    </div>
  )
}
