"use client"

import { use } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  User,
  Mail,
  Hash,
  Calendar,
  Trophy,
  Target,
  Flame,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileQuestion,
} from "lucide-react"

interface QuestionStatus {
  questionId: string
  title: string
  difficulty: number
  points: number
  isPassed: boolean
  orderIndex: number
}

interface Submission {
  id: string
  assignmentId: string
  status: string
  grade: number | null
  submittedAt: string | null
  assignment: {
    id: string
    title: string
    description: string | null
    dueDate: string | null
    semester: string | null
    week: {
      id: string
      weekNumber: number
      title: string
    }
  }
  questions: QuestionStatus[]
  progress: {
    passed: number
    total: number
    percentage: number
  }
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
  }
  submissions: Submission[]
  stats: {
    totalAssignments: number
    submittedCount: number
    avgGrade: number | null
    completionRate: number
    inProgressCount: number
    notStartedCount: number
  }
}

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
        <div className="skeleton h-8 w-48 rounded" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-24 rounded-lg" />
          ))}
        </div>
        <div className="skeleton h-64 rounded-lg" />
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

  const { student, submissions, stats } = data
  const isAtRisk = (stats.avgGrade !== null && stats.avgGrade < 60) || stats.completionRate < 50

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
            {isAtRisk ? (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                At Risk
              </Badge>
            ) : (
              <Badge className="bg-green-500">On Track</Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

        {stats.avgGrade !== null && (
          <div className="text-center p-4 rounded-xl bg-card border">
            <p className="text-sm text-muted-foreground mb-1">Overall Grade</p>
            <p
              className={cn(
                "text-4xl font-bold",
                stats.avgGrade >= 70
                  ? "text-green-500"
                  : stats.avgGrade >= 60
                  ? "text-yellow-500"
                  : "text-red-500"
              )}
            >
              {stats.avgGrade}%
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.submittedCount} of {stats.totalAssignments} submitted
            </p>
            <Progress value={stats.completionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressCount}</div>
            <p className="text-xs text-muted-foreground">assignments started</p>
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
                <CardTitle className="text-sm font-medium">Not Started</CardTitle>
                <FileQuestion className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.notStartedCount}</div>
                <p className="text-xs text-muted-foreground">assignments pending</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">no activity yet</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment History</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No assignments found for this student.
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub, index) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={cn(
                      "overflow-hidden",
                      sub.status === "SUBMITTED" && sub.grade !== null
                        ? sub.grade >= 70
                          ? "border-green-500/30"
                          : sub.grade >= 60
                          ? "border-yellow-500/30"
                          : "border-red-500/30"
                        : ""
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                              Week {sub.assignment.week.weekNumber}
                            </Badge>
                            {sub.assignment.semester && (
                              <Badge variant="secondary">{sub.assignment.semester}</Badge>
                            )}
                            {sub.status === "SUBMITTED" ? (
                              <Badge className="bg-green-500 gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Submitted
                              </Badge>
                            ) : sub.status === "IN_PROGRESS" ? (
                              <Badge variant="secondary" className="gap-1">
                                <Clock className="h-3 w-3" />
                                In Progress
                              </Badge>
                            ) : (
                              <Badge variant="outline">Not Started</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold">{sub.assignment.title}</h3>
                          {sub.assignment.dueDate && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Due: {new Date(sub.assignment.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          {sub.status === "SUBMITTED" && sub.grade !== null ? (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Grade</p>
                              <p
                                className={cn(
                                  "text-3xl font-bold",
                                  sub.grade >= 70
                                    ? "text-green-500"
                                    : sub.grade >= 60
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                )}
                              >
                                {sub.grade}%
                              </p>
                              {sub.submittedAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(sub.submittedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Progress</p>
                              <p className="text-3xl font-bold">{sub.progress.percentage}%</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Questions breakdown */}
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">
                          Questions ({sub.progress.passed}/{sub.progress.total} passed)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {sub.questions
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map((q, qIndex) => (
                              <div
                                key={q.questionId}
                                className={cn(
                                  "flex items-center gap-1 px-2 py-1 rounded text-sm",
                                  q.isPassed
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {q.isPassed ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <XCircle className="h-3 w-3" />
                                )}
                                Q{qIndex + 1}
                              </div>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
