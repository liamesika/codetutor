"use client"

import { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { DashboardShell } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useCourses } from "@/lib/hooks"
import { getCourseDisplay } from "@/lib/course-config"
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
  Lock,
} from "lucide-react"

interface AssignmentQuestion {
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

interface Assignment {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  week: {
    id: string
    weekNumber: number
    title: string
  }
  questions: AssignmentQuestion[]
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

export default function HomeworkAssignmentPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>
}) {
  const { assignmentId } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: courses } = useCourses()
  const activeCourse = courses?.find((c) => c.isEnrolled && !c.isLocked)
  const courseDisplay = getCourseDisplay(activeCourse?.slug)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [submittedGrade, setSubmittedGrade] = useState<number | null>(null)

  // Fetch assignment details - refetch on window focus for fresh data
  const { data: assignment, isLoading, refetch } = useQuery<Assignment>({
    queryKey: ["assignment", assignmentId],
    queryFn: async () => {
      const res = await fetch(`/api/assignments/${assignmentId}`)
      if (!res.ok) throw new Error("Failed to fetch assignment")
      return res.json()
    },
    refetchOnWindowFocus: true,
    staleTime: 0, // Always consider data stale to ensure fresh progress
  })

  // Submit assignment mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: "POST",
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to submit")
      }
      return res.json()
    },
    onSuccess: (data) => {
      setShowSubmitDialog(false)
      setSubmittedGrade(data.submission.grade)
      setShowResultDialog(true)
      queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="skeleton h-8 w-48 rounded mb-4" />
          <div className="skeleton h-4 w-64 rounded mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (!assignment) {
    return (
      <DashboardShell>
        <div className="p-6 max-w-4xl mx-auto">
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2">Assignment Not Found</h2>
              <p className="text-muted-foreground mb-4">
                This assignment may not exist or is not available.
              </p>
              <Link href="/dashboard">
                <Button>Back to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    )
  }

  const isSubmitted = assignment.submission?.status === "SUBMITTED"
  const canSubmit = !isSubmitted

  return (
    <DashboardShell>
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              onClick={(e) => {
                e.preventDefault()
                router.back()
              }}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline">{courseDisplay.unitLabel} {assignment.week.weekNumber}</Badge>
              {isSubmitted ? (
                <Badge className="bg-green-500 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Submitted
                </Badge>
              ) : assignment.progress.passed > 0 ? (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  In Progress
                </Badge>
              ) : (
                <Badge variant="outline">Not Started</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold">{assignment.title}</h1>
            {assignment.description && (
              <p className="text-muted-foreground mt-2">{assignment.description}</p>
            )}
          </div>

          {/* Grade or Submit button */}
          <div className="text-right shrink-0">
            {isSubmitted && assignment.submission?.grade !== null && assignment.submission?.grade !== undefined ? (
              <div className="text-center p-4 rounded-xl bg-card border">
                <p className="text-sm text-muted-foreground mb-1">Your Grade</p>
                <p
                  className={cn(
                    "text-4xl font-bold",
                    (assignment.submission?.grade ?? 0) >= 70
                      ? "text-green-500"
                      : (assignment.submission?.grade ?? 0) >= 50
                      ? "text-yellow-500"
                      : "text-red-500"
                  )}
                >
                  {assignment.submission?.grade}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Submitted {new Date(assignment.submission?.submittedAt!).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setShowSubmitDialog(true)}
                disabled={!canSubmit}
              >
                <Send className="h-4 w-4" />
                Submit Assignment
              </Button>
            )}
          </div>
        </div>

        {/* Progress card */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">
                  {assignment.progress.passed} / {assignment.progress.total} questions passed
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold gradient-neon-text">
                  {assignment.progress.percentage}%
                </p>
              </div>
            </div>
            <Progress value={assignment.progress.percentage} className="h-3" />
            {assignment.dueDate && (
              <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Due: {new Date(assignment.dueDate).toLocaleDateString()} at{" "}
                {new Date(assignment.dueDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Questions list */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Questions</h2>
          {assignment.questions.map((aq, index) => (
            <motion.div
              key={aq.questionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/practice/${aq.questionId}?assignment=${assignmentId}`}>
                <Card
                  className={cn(
                    "glass-card glass-card-hover overflow-hidden",
                    aq.isPassed && "border-green-500/30"
                  )}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                        aq.isPassed ? "bg-green-500/20" : "bg-muted"
                      )}
                    >
                      {aq.isPassed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{aq.question.title}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <Badge variant="outline" className="text-xs">
                          {aq.question.type.replace("_", " ")}
                        </Badge>
                        <span>Difficulty: {aq.question.difficulty}/5</span>
                        <span>{aq.question.estimatedMinutes} min</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {aq.isPassed ? (
                        <Badge className="bg-green-500">Passed</Badge>
                      ) : isSubmitted ? (
                        <Badge variant="destructive">Not Passed</Badge>
                      ) : (
                        <Button size="sm" variant="ghost" className="gap-1">
                          <Play className="h-4 w-4" />
                          Solve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Submit button at bottom if not submitted */}
        {canSubmit && (
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              className="gap-2 gradient-neon text-white px-8"
              onClick={() => setShowSubmitDialog(true)}
            >
              <Send className="h-4 w-4" />
              Submit Assignment for Grading
            </Button>
          </div>
        )}

        {/* Submit confirmation dialog */}
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Assignment?</DialogTitle>
              <DialogDescription>
                You are about to submit "{assignment.title}" for grading.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Current Progress</p>
                  <p className="text-sm text-muted-foreground">
                    {assignment.progress.passed} of {assignment.progress.total} questions passed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{assignment.progress.percentage}%</p>
                  <p className="text-xs text-muted-foreground">Estimated grade</p>
                </div>
              </div>
              {assignment.progress.percentage < 100 && (
                <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-500">
                    You haven't passed all questions. Your grade will be calculated based on the
                    questions you've passed. Once submitted, you cannot resubmit.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending}
                className="gap-2"
              >
                {submitMutation.isPending ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Result dialog after submission */}
        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent className="text-center">
            <div className="py-6">
              <div
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
                  submittedGrade !== null && submittedGrade >= 70
                    ? "bg-green-500/20"
                    : submittedGrade !== null && submittedGrade >= 50
                    ? "bg-yellow-500/20"
                    : "bg-red-500/20"
                )}
              >
                {submittedGrade !== null && submittedGrade >= 70 ? (
                  <Trophy className="h-10 w-10 text-green-500" />
                ) : submittedGrade !== null && submittedGrade >= 50 ? (
                  <CheckCircle2 className="h-10 w-10 text-yellow-500" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">Assignment Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Your assignment has been submitted for grading.
              </p>
              <div className="p-6 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Your Grade</p>
                <p
                  className={cn(
                    "text-5xl font-bold",
                    submittedGrade !== null && submittedGrade >= 70
                      ? "text-green-500"
                      : submittedGrade !== null && submittedGrade >= 50
                      ? "text-yellow-500"
                      : "text-red-500"
                  )}
                >
                  {submittedGrade}%
                </p>
              </div>
            </div>
            <DialogFooter className="justify-center">
              <Button onClick={() => setShowResultDialog(false)}>Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}
