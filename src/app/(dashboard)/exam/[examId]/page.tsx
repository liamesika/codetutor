"use client"

import { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { DashboardShell } from "@/components/layout"
import { SubscriptionGate } from "@/components/subscription/subscription-gate"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Send,
  Trophy,
  AlertTriangle,
  FileQuestion,
  ArrowRight,
} from "lucide-react"

interface ExamQuestion {
  questionId: string
  orderIndex: number
  isPassed: boolean
  question: {
    id: string
    title: string
    difficulty: number
    points: number
    estimatedMinutes: number
    type: string
  }
}

interface Exam {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  week: {
    id: string
    weekNumber: number
    title: string
  }
  questions: ExamQuestion[]
  submission: {
    id: string
    status: string
    grade: number | null
    submittedAt: string | null
  } | null
  progress: {
    passed: number
    total: number
    percentage: number
  }
}

interface SubmitResult {
  success: boolean
  submission: {
    id: string
    status: string
    grade: number | null
    submittedAt: string | null
  }
  details: {
    passedQuestions: number
    totalQuestions: number
    questionResults: {
      questionId: string
      title: string
      passed: boolean
    }[]
  }
}

export default function ExamPage({
  params,
}: {
  params: Promise<{ examId: string }>
}) {
  const { examId } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)
  const [lockedWeekNumber, setLockedWeekNumber] = useState<number | null>(null)

  // Fetch exam details
  const { data: exam, isLoading, refetch } = useQuery<Exam>({
    queryKey: ["assignment", examId],
    queryFn: async () => {
      const res = await fetch(`/api/assignments/${examId}`)
      if (res.status === 403) {
        const data = await res.json()
        setLockedWeekNumber(data.weekNumber ?? 0)
        throw new Error("Content locked")
      }
      if (!res.ok) throw new Error("Failed to fetch exam")
      return res.json()
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: (failureCount, error) => {
      if (error.message === "Content locked") return false
      return failureCount < 3
    },
  })

  // Submit exam mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/exams/${examId}/submit`, {
        method: "POST",
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to submit")
      }
      return res.json() as Promise<SubmitResult>
    },
    onSuccess: (data) => {
      setShowSubmitDialog(false)
      setSubmitResult(data)
      setShowResultDialog(true)
      queryClient.invalidateQueries({ queryKey: ["assignment", examId] })
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      toast.success(`Exam submitted! Grade: ${data.submission.grade}%`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  if (isLoading) {
    return (
      <DashboardShell hideSidebar>
        <div className="p-6 max-w-5xl mx-auto">
          <div className="space-y-4">
            <div className="skeleton h-8 w-64 rounded" />
            <div className="skeleton h-4 w-96 rounded" />
            <div className="grid grid-cols-5 gap-3 mt-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="skeleton h-14 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (lockedWeekNumber !== null) {
    return (
      <DashboardShell hideSidebar>
        <SubscriptionGate isLocked weekNumber={lockedWeekNumber}>
          <div className="p-6 max-w-5xl mx-auto py-20" />
        </SubscriptionGate>
      </DashboardShell>
    )
  }

  if (!exam) {
    return (
      <DashboardShell hideSidebar>
        <div className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center py-20">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Exam Not Found</h2>
          <p className="text-muted-foreground mb-4">This exam may not be available yet.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </DashboardShell>
    )
  }

  const isSubmitted = exam.submission?.status === "SUBMITTED"
  const sortedQuestions = [...exam.questions].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <DashboardShell hideSidebar>
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{exam.title}</h1>
              {exam.description && (
                <p className="text-muted-foreground mt-1">{exam.description}</p>
              )}
              {exam.dueDate && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Due: {new Date(exam.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              {isSubmitted && exam.submission?.grade != null ? (
                <div>
                  <p className="text-sm text-muted-foreground">Grade</p>
                  <p className={cn(
                    "text-3xl font-bold",
                    exam.submission.grade >= 70 ? "text-green-500" :
                    exam.submission.grade >= 50 ? "text-yellow-500" :
                    "text-red-500"
                  )}>
                    {exam.submission.grade}%
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold">
                    {exam.progress.passed}/{exam.progress.total}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Progress value={exam.progress.percentage} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {exam.progress.passed} of {exam.progress.total} questions passed
          </p>
        </motion.div>

        {/* Question navigator grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileQuestion className="h-5 w-5" />
            Questions
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {sortedQuestions.map((q, index) => (
              <motion.div
                key={q.questionId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
              >
                <Link href={`/practice/${q.questionId}`}>
                  <Card className={cn(
                    "glass-card glass-card-hover cursor-pointer transition-all",
                    q.isPassed && "border-green-500/40 bg-green-500/5",
                    !q.isPassed && "hover:border-primary/40"
                  )}>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        {q.isPassed ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : (
                          <span className="text-2xl font-bold text-muted-foreground">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {q.question.title}
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {Array.from({ length: q.question.difficulty }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              q.question.difficulty <= 2 ? "bg-green-500" :
                              q.question.difficulty <= 3 ? "bg-yellow-500" :
                              "bg-red-500"
                            )}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Submit button */}
        {!isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center pt-4"
          >
            <Button
              size="lg"
              className="gap-2 gradient-neon text-white shadow-lg hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all px-8"
              onClick={() => setShowSubmitDialog(true)}
            >
              <Send className="h-5 w-5" />
              Submit Exam
            </Button>
          </motion.div>
        )}

        {/* Already submitted notice */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="border-green-500/30 bg-green-500/5">
              <CardContent className="p-6 flex items-center gap-4">
                <Trophy className="h-8 w-8 text-green-500 shrink-0" />
                <div>
                  <p className="font-semibold">Exam Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    Submitted on {exam.submission?.submittedAt
                      ? new Date(exam.submission.submittedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Submit confirmation dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam?</DialogTitle>
            <DialogDescription>
              You have passed {exam.progress.passed} out of {exam.progress.total} questions.
              {exam.progress.passed < exam.progress.total && (
                <span className="block mt-2 text-yellow-600 dark:text-yellow-400">
                  {exam.progress.total - exam.progress.passed} question(s) are not yet passed.
                  You can still submit, but your grade will reflect only passed questions.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Expected Grade</span>
              <span className={cn(
                "text-2xl font-bold",
                exam.progress.percentage >= 70 ? "text-green-500" :
                exam.progress.percentage >= 50 ? "text-yellow-500" :
                "text-red-500"
              )}>
                {exam.progress.percentage}%
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Keep Working
            </Button>
            <Button
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
              className="gap-2"
            >
              {submitMutation.isPending ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Exam
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Exam Results
            </DialogTitle>
          </DialogHeader>
          {submitResult && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className={cn(
                  "text-5xl font-bold",
                  (submitResult.submission.grade ?? 0) >= 70 ? "text-green-500" :
                  (submitResult.submission.grade ?? 0) >= 50 ? "text-yellow-500" :
                  "text-red-500"
                )}>
                  {submitResult.submission.grade}%
                </p>
                <p className="text-muted-foreground mt-1">
                  {submitResult.details.passedQuestions}/{submitResult.details.totalQuestions} questions passed
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {submitResult.details.questionResults.map((qr, i) => (
                  <div
                    key={qr.questionId}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-6">{i + 1}.</span>
                      <span className="text-sm">{qr.title}</span>
                    </div>
                    {qr.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => {
              setShowResultDialog(false)
              router.push("/dashboard")
            }}>
              Back to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
