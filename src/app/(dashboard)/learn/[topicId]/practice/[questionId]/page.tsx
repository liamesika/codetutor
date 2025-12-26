"use client"

import { useEffect, useState, useCallback, use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
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
import {
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
  Code2,
  FileQuestion,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

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
}

export default function PracticePage({
  params,
}: {
  params: Promise<{ topicId: string; questionId: string }>
}) {
  const { questionId } = use(params)
  const { status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [code, setCode] = useState("")
  const [originalCode, setOriginalCode] = useState("")
  const [hintsUsed, setHintsUsed] = useState(0)
  const [solutionRevealed, setSolutionRevealed] = useState(false)
  const [solutionCode, setSolutionCode] = useState<string>()
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [activeTab, setActiveTab] = useState("question")
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)

  // Fetch question data
  const { data: question, isLoading } = useQuery<Question>({
    queryKey: ["question", questionId],
    queryFn: async () => {
      const res = await fetch(`/api/questions/${questionId}`)
      if (!res.ok) throw new Error("Failed to fetch question")
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
    mutationFn: async (code: string) => {
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, code }),
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
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, code, runOnly }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to execute")
      }
      return res.json() as Promise<ExecutionResult>
    },
    onSuccess: (data) => {
      setResult(data)
      setActiveTab("feedback")
      if (data.status === "PASS") {
        toast.success(`Great job! +${data.pointsEarned} XP`)
        queryClient.invalidateQueries({ queryKey: ["userStats"] })
        queryClient.invalidateQueries({ queryKey: ["courses"] })
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Use hint mutation
  const hintMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/questions/${questionId}/hint`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Failed to get hint")
      return res.json()
    },
    onSuccess: (data) => {
      setHintsUsed((prev) => prev + 1)
      toast.info(`Hint ${data.hintIndex + 1}: -${data.pointsDeducted} XP`)
      queryClient.invalidateQueries({ queryKey: ["question", questionId] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Reveal solution mutation
  const revealMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/questions/${questionId}/solution`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Failed to reveal solution")
      return res.json()
    },
    onSuccess: (data) => {
      setSolutionRevealed(true)
      setSolutionCode(data.solutionCode)
      toast.info(`Solution revealed: -${data.pointsDeducted} XP`)
    },
    onError: (error) => {
      toast.error(error.message)
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

  const handleNextQuestion = useCallback(() => {
    router.push(`/learn/${question?.topic.id}/practice`)
  }, [router, question?.topic.id])

  const handleRetry = useCallback(() => {
    setResult(null)
    setActiveTab("code")
  }, [])

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-64" />
        </div>
        <div className="flex-1 flex">
          <div className="flex-1 p-4">
            <Skeleton className="h-full" />
          </div>
          <div className="w-96 border-l p-4 hidden lg:block">
            <Skeleton className="h-full" />
          </div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Question not found</p>
      </div>
    )
  }

  const hasChanges = code !== originalCode && code !== (question.draft || "")
  const hintsAvailable = question.hints.length - hintsUsed

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b bg-background px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/learn/${question.topic.id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/learn/${question.topic.id}`}>
                  Week {question.topic.week.weekNumber}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/learn/${question.topic.id}`}>
                  {question.topic.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{question.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="font-semibold truncate md:hidden">{question.title}</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          aria-label={isPanelCollapsed ? "Show panel" : "Hide panel"}
        >
          {isPanelCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </header>

      {/* Desktop layout */}
      <div className="flex-1 flex overflow-hidden hidden lg:flex">
        {/* Code editor panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-hidden">
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
          />
        </div>

        {/* Side panel */}
        <div
          className={cn(
            "border-l bg-card flex flex-col transition-all duration-200",
            isPanelCollapsed ? "w-0 overflow-hidden" : "w-[400px] xl:w-[480px]"
          )}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4">
              <TabsTrigger value="question" className="gap-2">
                <FileQuestion className="h-4 w-4" />
                Question
              </TabsTrigger>
              <TabsTrigger value="feedback" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Results
              </TabsTrigger>
            </TabsList>
            <TabsContent value="question" className="flex-1 mt-0 overflow-hidden">
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
              />
            </TabsContent>
            <TabsContent value="feedback" className="flex-1 mt-0 overflow-hidden">
              <ResultsPanel
                result={result}
                isLoading={executeMutation.isPending}
                onNextQuestion={handleNextQuestion}
                onRetry={handleRetry}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex-1 flex flex-col overflow-hidden lg:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 shrink-0">
            <TabsTrigger value="question" className="gap-2">
              <FileQuestion className="h-4 w-4" />
              <span className="hidden sm:inline">Question</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code2 className="h-4 w-4" />
              <span className="hidden sm:inline">Code</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="question" className="flex-1 mt-0 overflow-hidden">
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
            />
          </TabsContent>

          <TabsContent value="code" className="flex-1 mt-0 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                value={code}
                onChange={setCode}
                language="java"
              />
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="flex-1 mt-0 overflow-hidden">
            <ResultsPanel
              result={result}
              isLoading={executeMutation.isPending}
              onNextQuestion={handleNextQuestion}
              onRetry={handleRetry}
            />
          </TabsContent>
        </Tabs>

        {/* Mobile action bar */}
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
        />
      </div>
    </div>
  )
}
