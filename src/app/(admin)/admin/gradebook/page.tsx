"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileQuestion,
  User,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  TrendingUp,
  AlertTriangle,
  BarChart3,
} from "lucide-react"

interface Student {
  id: string
  email: string
  name: string | null
}

interface GradeEntry {
  student: Student
  status: string
  grade: number | null
  submittedAt: string | null
  submissionId: string | null
}

interface AssignmentGradebook {
  assignment: {
    id: string
    title: string
    weekNumber: number
    weekTitle: string
    dueDate: string | null
    questionCount: number
  }
  grades: GradeEntry[]
  stats: {
    totalStudents: number
    submitted: number
    inProgress: number
    notStarted: number
    averageGrade: number | null
  }
}

interface GradebookResponse {
  gradebook: AssignmentGradebook[]
  students: Student[]
  totalAssignments: number
}

interface SubmissionDetail {
  submission: {
    id: string
    status: string
    grade: number | null
    submittedAt: string | null
    createdAt: string
  }
  user: Student
  assignment: {
    id: string
    title: string
    week: {
      weekNumber: number
      title: string
    }
  }
  questionResults: {
    question: {
      id: string
      title: string
      difficulty: number
      points: number
      type: string
    }
    orderIndex: number
    isPassed: boolean
    attemptCount: number
    latestAttempt: {
      id: string
      status: string
      code: string
      stdout: string | null
      stderr: string | null
      compileError: string | null
      executionMs: number | null
      createdAt: string
      testResults: {
        testIndex: number
        input: string
        expected: string
        actual: string | null
        passed: boolean
        error: string | null
      }[]
    } | null
  }[]
  summary: {
    passed: number
    total: number
    percentage: number
  }
}

type SortField = "name" | "email" | "status" | "grade" | "submittedAt"
type SortDirection = "asc" | "desc"

export default function AdminGradebookPage() {
  const [selectedWeek, setSelectedWeek] = useState<string>("all")
  const [selectedAssignment, setSelectedAssignment] = useState<string>("all")
  const [viewingSubmission, setViewingSubmission] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Fetch gradebook data
  const { data, isLoading } = useQuery<GradebookResponse>({
    queryKey: ["adminGradebook"],
    queryFn: async () => {
      const res = await fetch("/api/admin/gradebook")
      if (!res.ok) throw new Error("Failed to fetch gradebook")
      return res.json()
    },
  })

  // Fetch submission details
  const { data: submissionDetail, isLoading: loadingDetail } = useQuery<SubmissionDetail>({
    queryKey: ["submissionDetail", viewingSubmission],
    queryFn: async () => {
      const res = await fetch(`/api/admin/gradebook/${viewingSubmission}`)
      if (!res.ok) throw new Error("Failed to fetch submission")
      return res.json()
    },
    enabled: !!viewingSubmission,
  })

  // Compute unique weeks for filter
  const weeks = useMemo(() => {
    if (!data?.gradebook) return []
    return [...new Set(data.gradebook.map((g) => g.assignment.weekNumber))].sort()
  }, [data?.gradebook])

  // Filter assignments by week
  const filteredGradebook = useMemo(() => {
    if (!data?.gradebook) return []
    let filtered = data.gradebook
    if (selectedWeek !== "all") {
      filtered = filtered.filter((g) => g.assignment.weekNumber === parseInt(selectedWeek))
    }
    if (selectedAssignment !== "all") {
      filtered = filtered.filter((g) => g.assignment.id === selectedAssignment)
    }
    return filtered
  }, [data?.gradebook, selectedWeek, selectedAssignment])

  // Compute overall KPIs
  const kpis = useMemo(() => {
    if (!data?.gradebook || data.gradebook.length === 0) {
      return { totalStudents: 0, totalSubmissions: 0, avgGrade: null, missingCount: 0, submissionRate: 0 }
    }

    const totalStudents = data.students.length
    const totalSubmissions = data.gradebook.reduce((acc, g) => acc + g.stats.submitted, 0)
    const totalPossibleSubmissions = totalStudents * data.gradebook.length
    const missingCount = data.gradebook.reduce((acc, g) => acc + g.stats.notStarted, 0)

    const allGrades = data.gradebook
      .flatMap((g) => g.grades)
      .filter((g) => g.grade !== null)
      .map((g) => g.grade as number)

    const avgGrade = allGrades.length > 0
      ? Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length)
      : null

    const submissionRate = totalPossibleSubmissions > 0
      ? Math.round((totalSubmissions / totalPossibleSubmissions) * 100)
      : 0

    return { totalStudents, totalSubmissions, avgGrade, missingCount, submissionRate }
  }, [data])

  // Sort and filter grades for selected assignment
  const sortedAndFilteredGrades = useMemo(() => {
    if (filteredGradebook.length === 0) return []

    // Flatten all grades across filtered assignments
    const allGrades = filteredGradebook.flatMap((entry) =>
      entry.grades.map((g) => ({
        ...g,
        assignmentId: entry.assignment.id,
        assignmentTitle: entry.assignment.title,
        weekNumber: entry.assignment.weekNumber,
      }))
    )

    // Apply search filter
    let filtered = allGrades.filter((g) => {
      const searchLower = searchQuery.toLowerCase()
      return (
        g.student.name?.toLowerCase().includes(searchLower) ||
        g.student.email.toLowerCase().includes(searchLower)
      )
    })

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((g) => g.status === statusFilter)
    }

    // Apply grade filter
    if (gradeFilter !== "all") {
      if (gradeFilter === "passing") {
        filtered = filtered.filter((g) => g.grade !== null && g.grade >= 60)
      } else if (gradeFilter === "failing") {
        filtered = filtered.filter((g) => g.grade !== null && g.grade < 60)
      } else if (gradeFilter === "missing") {
        filtered = filtered.filter((g) => g.grade === null)
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "name":
          comparison = (a.student.name || "").localeCompare(b.student.name || "")
          break
        case "email":
          comparison = a.student.email.localeCompare(b.student.email)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "grade":
          comparison = (a.grade ?? -1) - (b.grade ?? -1)
          break
        case "submittedAt":
          const aDate = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
          const bDate = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
          comparison = aDate - bDate
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }, [filteredGradebook, searchQuery, statusFilter, gradeFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gradebook</h1>
          <p className="text-muted-foreground">
            View student submissions and grades for all assignments
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">{kpis.submissionRate}% rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Average Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {kpis.avgGrade !== null ? `${kpis.avgGrade}%` : "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Missing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{kpis.missingCount}</div>
            <p className="text-xs text-muted-foreground">not started</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cyan-500" />
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totalAssignments || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Row */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Week Filter */}
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Weeks</SelectItem>
                {weeks.map((week) => (
                  <SelectItem key={week} value={week.toString()}>
                    Week {week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Assignment Filter */}
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Assignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignments</SelectItem>
                {(selectedWeek !== "all"
                  ? data?.gradebook.filter((g) => g.assignment.weekNumber === parseInt(selectedWeek))
                  : data?.gradebook
                )?.map((g) => (
                  <SelectItem key={g.assignment.id} value={g.assignment.id}>
                    {g.assignment.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
              </SelectContent>
            </Select>

            {/* Grade Filter */}
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="passing">Passing (60+)</SelectItem>
                <SelectItem value="failing">Failing (&lt;60)</SelectItem>
                <SelectItem value="missing">No Grade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Gradebook Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Grades</CardTitle>
          <CardDescription>
            {sortedAndFilteredGrades.length} records
            {searchQuery && ` matching "${searchQuery}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Student
                    <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    <SortIcon field="email" />
                  </div>
                </TableHead>
                {selectedAssignment === "all" && <TableHead>Assignment</TableHead>}
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    <SortIcon field="status" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("grade")}
                >
                  <div className="flex items-center">
                    Grade
                    <SortIcon field="grade" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("submittedAt")}
                >
                  <div className="flex items-center">
                    Submitted
                    <SortIcon field="submittedAt" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredGrades.map((grade, index) => (
                <TableRow key={`${grade.assignmentId}-${grade.student.id}-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{grade.student.name || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {grade.student.email}
                  </TableCell>
                  {selectedAssignment === "all" && (
                    <TableCell>
                      <Badge variant="outline">
                        W{grade.weekNumber}: {grade.assignmentTitle}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    <StatusBadge status={grade.status} />
                  </TableCell>
                  <TableCell>
                    {grade.grade !== null ? (
                      <span
                        className={`font-bold ${
                          grade.grade >= 70
                            ? "text-green-500"
                            : grade.grade >= 50
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {grade.grade}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {grade.submittedAt ? (
                      <span className="text-sm">
                        {new Date(grade.submittedAt).toLocaleDateString()}{" "}
                        {new Date(grade.submittedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {grade.submissionId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingSubmission(grade.submissionId)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {sortedAndFilteredGrades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No matching records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {(!data?.gradebook || data.gradebook.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Assignments Yet</h3>
            <p className="text-muted-foreground">
              Create and publish assignments to see student grades here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Submission Detail Dialog */}
      <Dialog
        open={!!viewingSubmission}
        onOpenChange={(open) => !open && setViewingSubmission(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            {submissionDetail && (
              <DialogDescription>
                {submissionDetail.user.name || submissionDetail.user.email} &bull;{" "}
                {submissionDetail.assignment.title}
              </DialogDescription>
            )}
          </DialogHeader>

          {loadingDetail ? (
            <div className="py-8 text-center">Loading...</div>
          ) : submissionDetail ? (
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-4">
                {/* Summary */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Grade</p>
                        <p
                          className={`text-3xl font-bold ${
                            (submissionDetail.submission.grade || 0) >= 70
                              ? "text-green-500"
                              : (submissionDetail.submission.grade || 0) >= 50
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {submissionDetail.submission.grade}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Questions Passed</p>
                        <p className="text-xl font-semibold">
                          {submissionDetail.summary.passed} / {submissionDetail.summary.total}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Question Results */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Question Results</h3>
                  {submissionDetail.questionResults.map((qr, index) => (
                    <Card key={qr.question.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm flex items-center gap-2">
                            {qr.isPassed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            Q{index + 1}: {qr.question.title}
                          </CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline">Lv.{qr.question.difficulty}</Badge>
                            <Badge variant={qr.isPassed ? "default" : "destructive"}>
                              {qr.isPassed ? "PASSED" : "FAILED"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      {qr.latestAttempt && (
                        <CardContent className="text-sm space-y-2">
                          <p className="text-muted-foreground">
                            {qr.attemptCount} attempt(s) &bull; Last:{" "}
                            {new Date(qr.latestAttempt.createdAt).toLocaleString()}
                          </p>
                          {qr.latestAttempt.compileError && (
                            <div className="p-2 bg-red-500/10 rounded text-red-500 font-mono text-xs">
                              {qr.latestAttempt.compileError}
                            </div>
                          )}
                          {qr.latestAttempt.testResults.length > 0 && (
                            <div className="space-y-1">
                              {qr.latestAttempt.testResults.map((tr) => (
                                <div
                                  key={tr.testIndex}
                                  className={`p-2 rounded text-xs ${
                                    tr.passed
                                      ? "bg-green-500/10"
                                      : "bg-red-500/10"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {tr.passed ? (
                                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <XCircle className="h-3 w-3 text-red-500" />
                                    )}
                                    <span>Test {tr.testIndex + 1}</span>
                                  </div>
                                  {!tr.passed && (
                                    <div className="mt-1 pl-5 font-mono">
                                      <p>Expected: {tr.expected}</p>
                                      <p>Actual: {tr.actual || "(empty)"}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      )}
                      {!qr.latestAttempt && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            No attempts recorded
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "SUBMITTED":
      return (
        <Badge className="bg-green-500 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Submitted
        </Badge>
      )
    case "IN_PROGRESS":
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          In Progress
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="gap-1">
          <XCircle className="h-3 w-3" />
          Not Started
        </Badge>
      )
  }
}
