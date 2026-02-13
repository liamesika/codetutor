"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Mail,
  Hash,
  Calendar,
  Trophy,
  Target,
  Flame,
  CheckCircle2,
  XCircle,
  FileQuestion,
  Code2,
  KeyRound,
  Play,
  Lightbulb,
  Eye,
  Clock,
  ChevronDown,
  ChevronUp,
  Activity,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DayProgress {
  dayNumber: number
  dayTitle: string
  totalQuestions: number
  solvedQuestions: number
  percentage: number
}

interface AttemptItem {
  id: string
  status: string
  hintsUsed: number
  pointsEarned: number
  createdAt: string
}

interface QuestionAttempts {
  questionId: string
  questionTitle: string
  questionSlug: string
  topicTitle: string
  difficulty: number
  attempts: AttemptItem[]
  bestStatus: string
  totalAttempts: number
  attemptsToPass: number | null
  lastAttemptAt: string
}

interface DayAttempts {
  dayNumber: number
  dayTitle: string
  questions: QuestionAttempts[]
}

interface ActivityItem {
  id: string
  activityType: string
  metadata: Record<string, unknown> | null
  createdAt: string
}

interface StudentDetail {
  student: {
    id: string
    name: string
    email: string
    studentExternalId: string | null
    createdAt: string
    progress: {
      xp: number
      level: number
      totalSolved: number
      currentStreak: number
      bestStreak: number
      lastActiveDate: string | null
    } | null
    plan: string | null
  }
  dayProgress: DayProgress[]
  attemptsByDay: DayAttempts[]
  recentActivity: ActivityItem[]
  stats: {
    totalQuestionsSolved: number
    totalQuestionsAvailable: number
    totalAttempts: number
    completionPercentage: number
  }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function getPlanBadgeClass(plan: string | null): string {
  switch (plan) {
    case "PRO": return "bg-purple-500"
    case "BASIC": return "bg-blue-500"
    case "FREE": return "bg-gray-500"
    default: return "bg-gray-400"
  }
}

function getStatusBg(status: string): string {
  switch (status) {
    case "PASS": return "bg-green-500/10 text-green-600 dark:text-green-400"
    case "FAIL": return "bg-red-500/10 text-red-600 dark:text-red-400"
    case "COMPILE_ERROR": return "bg-orange-500/10 text-orange-600 dark:text-orange-400"
    case "RUNTIME_ERROR": return "bg-orange-500/10 text-orange-600 dark:text-orange-400"
    case "TIMEOUT": return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
    default: return "bg-muted text-muted-foreground"
  }
}

const difficultyLabels: Record<number, string> = {
  1: "Easy",
  2: "Easy-Med",
  3: "Medium",
  4: "Hard",
  5: "Expert",
}

const difficultyColors: Record<number, string> = {
  1: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  2: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  3: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  4: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  5: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
}

function getActivityIcon(type: string) {
  switch (type) {
    case "LOGIN": return <KeyRound className="h-4 w-4" />
    case "QUESTION_START": return <Play className="h-4 w-4" />
    case "QUESTION_SUBMIT": return <Code2 className="h-4 w-4" />
    case "HINT_VIEW": return <Lightbulb className="h-4 w-4" />
    case "SOLUTION_VIEW": return <Eye className="h-4 w-4" />
    case "LESSON_VIEW": return <Eye className="h-4 w-4" />
    case "SESSION_START": return <Activity className="h-4 w-4" />
    case "SESSION_END": return <Activity className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

function getActivityLabel(type: string): string {
  switch (type) {
    case "LOGIN": return "Logged in"
    case "QUESTION_START": return "Started question"
    case "QUESTION_SUBMIT": return "Submitted answer"
    case "HINT_VIEW": return "Viewed hint"
    case "SOLUTION_VIEW": return "Viewed solution"
    case "LESSON_VIEW": return "Viewed lesson"
    case "SESSION_START": return "Session started"
    case "SESSION_END": return "Session ended"
    default: return type
  }
}

function getActivityColor(type: string): string {
  switch (type) {
    case "LOGIN": return "text-blue-500"
    case "QUESTION_START": return "text-cyan-500"
    case "QUESTION_SUBMIT": return "text-indigo-500"
    case "HINT_VIEW": return "text-yellow-500"
    case "SOLUTION_VIEW": return "text-orange-500"
    default: return "text-muted-foreground"
  }
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function DayProgressGrid({ days }: { days: DayProgress[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-500" />
          Day Completion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {days.map((day) => (
            <div
              key={day.dayNumber}
              className={cn(
                "rounded-xl border p-3 text-center transition-colors",
                day.percentage === 100
                  ? "border-green-500/30 bg-green-500/5"
                  : day.percentage > 0
                  ? "border-yellow-500/30 bg-yellow-500/5"
                  : "border-border bg-muted/30"
              )}
            >
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Day {day.dayNumber}
              </div>
              <div
                className={cn(
                  "text-2xl font-bold mb-1",
                  day.percentage === 100
                    ? "text-green-500"
                    : day.percentage > 0
                    ? "text-yellow-500"
                    : "text-muted-foreground"
                )}
              >
                {day.percentage}%
              </div>
              <Progress
                value={day.percentage}
                className="h-1.5 mb-1"
              />
              <div className="text-xs text-muted-foreground">
                {day.solvedQuestions}/{day.totalQuestions}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityTimeline({ activities }: { activities: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activity recorded</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto space-y-1 pr-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={cn("shrink-0", getActivityColor(activity.activityType))}>
                  {getActivityIcon(activity.activityType)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">
                    {getActivityLabel(activity.activityType)}
                  </span>
                  {activity.metadata && typeof activity.metadata === "object" && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {(activity.metadata as Record<string, unknown>).questionTitle
                        ? String((activity.metadata as Record<string, unknown>).questionTitle)
                        : ""}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatRelativeDate(activity.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DayAttemptsAccordion({ day }: { day: DayAttempts }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const passedCount = day.questions.filter((q) => q.bestStatus === "PASS").length
  const solvedQuestions = day.questions.filter((q) => q.attemptsToPass !== null)
  const avgAttemptsToPass = solvedQuestions.length > 0
    ? (solvedQuestions.reduce((s, q) => s + (q.attemptsToPass || 0), 0) / solvedQuestions.length).toFixed(1)
    : null

  return (
    <Card className={cn(isExpanded && "border-primary/20")}>
      <CardHeader
        className="cursor-pointer select-none py-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#4F46E5]/20 to-[#22D3EE]/20 flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-500">
                {day.dayNumber}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                Day {day.dayNumber}: {day.dayTitle}
              </h3>
              <p className="text-xs text-muted-foreground">
                {passedCount}/{day.questions.length} passed &middot;{" "}
                {day.questions.reduce((s, q) => s + q.totalAttempts, 0)} attempts
                {avgAttemptsToPass && (
                  <> &middot; avg {avgAttemptsToPass} tries to solve</>
                )}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 space-y-2">
              {day.questions.map((q) => (
                <QuestionAttemptRow key={q.questionId} question={q} />
              ))}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function QuestionAttemptRow({ question }: { question: QuestionAttempts }) {
  const [showAttempts, setShowAttempts] = useState(false)

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {question.bestStatus === "PASS" ? (
            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500 shrink-0" />
          )}
          <span className="text-sm font-medium truncate">{question.questionTitle}</span>
          <Badge
            variant="outline"
            className={cn("text-[10px] px-1.5 shrink-0", difficultyColors[question.difficulty])}
          >
            {difficultyLabels[question.difficulty] || `D${question.difficulty}`}
          </Badge>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {question.attemptsToPass !== null ? (
            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
              Solved in {question.attemptsToPass} {question.attemptsToPass === 1 ? "try" : "tries"}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">
              {question.totalAttempts} {question.totalAttempts === 1 ? "attempt" : "attempts"}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setShowAttempts(!showAttempts)}
          >
            {showAttempts ? "Hide" : "Show"}
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-muted-foreground">{question.topicTitle}</span>
        <span className="text-xs text-muted-foreground">&middot;</span>
        <span className="text-xs text-muted-foreground">
          Last: {formatRelativeDate(question.lastAttemptAt)}
        </span>
        {question.attemptsToPass !== null && question.totalAttempts > question.attemptsToPass && (
          <>
            <span className="text-xs text-muted-foreground">&middot;</span>
            <span className="text-xs text-muted-foreground">
              {question.totalAttempts} total attempts
            </span>
          </>
        )}
      </div>
      <AnimatePresence>
        {showAttempts && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="mt-2 pt-2 border-t space-y-1">
              {question.attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between py-1 px-2 rounded text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("font-medium px-1.5 py-0.5 rounded", getStatusBg(attempt.status))}>
                      {attempt.status}
                    </span>
                    {attempt.hintsUsed > 0 && (
                      <span className="text-muted-foreground flex items-center gap-0.5">
                        <Lightbulb className="h-3 w-3" />
                        {attempt.hintsUsed}
                      </span>
                    )}
                    {attempt.pointsEarned > 0 && (
                      <span className="text-yellow-500">+{attempt.pointsEarned}xp</span>
                    )}
                  </div>
                  <span className="text-muted-foreground">
                    {formatRelativeDate(attempt.createdAt)}
                  </span>
                </div>
              ))}
              {question.totalAttempts > question.attempts.length && (
                <p className="text-xs text-muted-foreground text-center py-1">
                  + {question.totalAttempts - question.attempts.length} more attempts
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = use(params)

  const { data, isLoading } = useQuery<StudentDetail>({
    queryKey: ["admin-student", studentId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/students/${studentId}`)
      if (!res.ok) throw new Error("Failed to fetch student")
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">Student Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This student may not exist or has been removed.
            </p>
            <Link href="/admin/students">
              <Button>Back to Students</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { student, dayProgress, attemptsByDay, recentActivity, stats } = data

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Students
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{student.name}</h1>
            {student.plan && (
              <Badge className={cn(getPlanBadgeClass(student.plan))}>
                {student.plan}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {student.email}
            </span>
            {student.studentExternalId && (
              <span className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                {student.studentExternalId}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {new Date(student.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="text-center p-4 rounded-xl bg-card border hidden sm:block">
          <p className="text-sm text-muted-foreground mb-1">Completion</p>
          <p
            className={cn(
              "text-4xl font-bold",
              stats.completionPercentage >= 70
                ? "text-green-500"
                : stats.completionPercentage >= 30
                ? "text-yellow-500"
                : "text-muted-foreground"
            )}
          >
            {stats.completionPercentage}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalQuestionsSolved}/{stats.totalQuestionsAvailable} questions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Solved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestionsSolved}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalQuestionsAvailable} total
            </p>
            <Progress value={stats.completionPercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
            <Code2 className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttempts}</div>
            <p className="text-xs text-muted-foreground">code submissions</p>
          </CardContent>
        </Card>

        {student.progress && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">XP & Level</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Level {student.progress.level}</div>
                <p className="text-xs text-muted-foreground">
                  {student.progress.xp.toLocaleString()} XP total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <Flame className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{student.progress.currentStreak} days</div>
                <p className="text-xs text-muted-foreground">
                  Best: {student.progress.bestStreak} days
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {!student.progress && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">XP & Level</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground">—</div>
                <p className="text-xs text-muted-foreground">no activity yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground">—</div>
                <p className="text-xs text-muted-foreground">no activity yet</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Day Completion Grid */}
      {dayProgress.length > 0 && <DayProgressGrid days={dayProgress} />}

      {/* Two-column: Activity Timeline + Attempts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Timeline */}
        <ActivityTimeline activities={recentActivity} />

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Progress Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dayProgress.map((day) => (
              <div key={day.dayNumber} className="flex items-center gap-3">
                <span className="text-sm font-medium w-14 shrink-0">
                  Day {day.dayNumber}
                </span>
                <Progress value={day.percentage} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground w-12 text-right shrink-0">
                  {day.solvedQuestions}/{day.totalQuestions}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Question Attempt History */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Code2 className="h-5 w-5 text-indigo-500" />
          Question Attempt History
        </h2>
        {attemptsByDay.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              <Code2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No attempts yet for this student.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {attemptsByDay.map((day) => (
              <DayAttemptsAccordion key={day.dayNumber} day={day} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
