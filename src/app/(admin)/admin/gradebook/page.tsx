"use client"

import { useState, useMemo, useCallback } from "react"
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
  Download,
  Filter,
  GraduationCap,
} from "lucide-react"

interface Student {
  id: string
  email: string
  name: string | null
  studentExternalId?: string | null
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

// Grade color helper
function getGradeColor(grade: number | null): string {
  if (grade === null) return "text-gray-400"
  if (grade >= 90) return "text-green-600 dark:text-green-400"
  if (grade >= 75) return "text-blue-600 dark:text-blue-400"
  if (grade >= 60) return "text-orange-600 dark:text-orange-400"
  return "text-red-600 dark:text-red-400"
}

function getGradeBadgeClass(grade: number | null): string {
  if (grade === null) return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
  if (grade >= 90) return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
  if (grade >= 75) return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
  if (grade >= 60) return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
  return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
}

export default function AdminGradebookPage() {
  const [selectedAssignment, setSelectedAssignment] = useState<string>("all")
  const [viewingSubmission, setViewingSubmission] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [weekFilter, setWeekFilter] = useState<string>("all")
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

  // Get selected assignment data
  const selectedAssignmentData = useMemo(() => {
    if (!data?.gradebook || selectedAssignment === "all") return null
    return data.gradebook.find((g) => g.assignment.id === selectedAssignment)
  }, [data?.gradebook, selectedAssignment])

  // Compute KPIs based on selection
  const kpis = useMemo(() => {
    if (!data?.gradebook || data.gradebook.length === 0) {
      return { totalStudents: 0, submitted: 0, missing: 0, avgGrade: null, medianGrade: null, submissionRate: 0 }
    }

    const totalStudents = data.students.length

    if (selectedAssignment !== "all" && selectedAssignmentData) {
      const grades = selectedAssignmentData.grades
      const submitted = grades.filter((g) => g.status === "SUBMITTED").length
      const missing = grades.filter((g) => g.status === "NOT_STARTED").length
      const submittedGrades = grades.filter((g) => g.grade !== null).map((g) => g.grade as number).sort((a, b) => a - b)

      const avgGrade = submittedGrades.length > 0
        ? Math.round(submittedGrades.reduce((a, b) => a + b, 0) / submittedGrades.length)
        : null

      const medianGrade = submittedGrades.length > 0
        ? submittedGrades.length % 2 === 0
          ? Math.round((submittedGrades[submittedGrades.length / 2 - 1] + submittedGrades[submittedGrades.length / 2]) / 2)
          : submittedGrades[Math.floor(submittedGrades.length / 2)]
        : null

      const submissionRate = totalStudents > 0 ? Math.round((submitted / totalStudents) * 100) : 0

      return { totalStudents, submitted, missing, avgGrade, medianGrade, submissionRate }
    }

    const submitted = data.gradebook.reduce((acc, g) => acc + g.stats.submitted, 0)
    const missing = data.gradebook.reduce((acc, g) => acc + g.stats.notStarted, 0)
    const totalPossibleSubmissions = totalStudents * data.gradebook.length

    const allGrades = data.gradebook
      .flatMap((g) => g.grades)
      .filter((g) => g.grade !== null)
      .map((g) => g.grade as number)
      .sort((a, b) => a - b)

    const avgGrade = allGrades.length > 0
      ? Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length)
      : null

    const medianGrade = allGrades.length > 0
      ? allGrades.length % 2 === 0
        ? Math.round((allGrades[allGrades.length / 2 - 1] + allGrades[allGrades.length / 2]) / 2)
        : allGrades[Math.floor(allGrades.length / 2)]
      : null

    const submissionRate = totalPossibleSubmissions > 0
      ? Math.round((submitted / totalPossibleSubmissions) * 100)
      : 0

    return { totalStudents, submitted, missing, avgGrade, medianGrade, submissionRate }
  }, [data, selectedAssignment, selectedAssignmentData])

  // Sort and filter grades
  const sortedAndFilteredGrades = useMemo(() => {
    if (!data?.gradebook) return []

    let allGrades: Array<GradeEntry & { assignmentId: string; assignmentTitle: string; weekNumber: number }>

    if (selectedAssignment !== "all" && selectedAssignmentData) {
      allGrades = selectedAssignmentData.grades.map((g) => ({
        ...g,
        assignmentId: selectedAssignmentData.assignment.id,
        assignmentTitle: selectedAssignmentData.assignment.title,
        weekNumber: selectedAssignmentData.assignment.weekNumber,
      }))
    } else {
      allGrades = data.gradebook.flatMap((entry) =>
        entry.grades.map((g) => ({
          ...g,
          assignmentId: entry.assignment.id,
          assignmentTitle: entry.assignment.title,
          weekNumber: entry.assignment.weekNumber,
        }))
      )
    }

    // Apply search filter
    let filtered = allGrades.filter((g) => {
      const searchLower = searchQuery.toLowerCase()
      return (
        g.student.name?.toLowerCase().includes(searchLower) ||
        g.student.email.toLowerCase().includes(searchLower) ||
        g.student.id.toLowerCase().includes(searchLower)
      )
    })

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "MISSING") {
        filtered = filtered.filter((g) => g.status === "NOT_STARTED")
      } else {
        filtered = filtered.filter((g) => g.status === statusFilter)
      }
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

    // Apply week/assignment number filter
    if (weekFilter !== "all" && selectedAssignment === "all") {
      const weekNum = parseInt(weekFilter, 10)
      filtered = filtered.filter((g) => g.weekNumber === weekNum)
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
  }, [data?.gradebook, selectedAssignment, selectedAssignmentData, searchQuery, statusFilter, gradeFilter, weekFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Export CSV function
  const exportCSV = useCallback(() => {
    if (sortedAndFilteredGrades.length === 0) return

    const headers = [
      "studentExternalId",
      "studentName",
      "studentEmail",
      "assignmentTitle",
      "weekNumber",
      "status",
      "grade",
      "submittedAt",
    ]

    const rows = sortedAndFilteredGrades.map((g) => [
      g.student.studentExternalId || "",
      g.student.name || "",
      g.student.email,
      g.assignmentTitle,
      g.weekNumber.toString(),
      g.status,
      g.grade !== null ? g.grade.toString() : "",
      g.submittedAt ? new Date(g.submittedAt).toISOString() : "",
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    const assignmentName = selectedAssignment !== "all" && selectedAssignmentData
      ? selectedAssignmentData.assignment.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()
      : "all-assignments"
    const date = new Date().toISOString().split("T")[0]

    link.href = url
    link.download = `codetutor-gradebook-${assignmentName}-${date}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [sortedAndFilteredGrades, selectedAssignment, selectedAssignmentData])

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
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Gradebook</h1>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            View and export student submissions and grades
          </p>
        </div>
        <Button onClick={exportCSV} disabled={sortedAndFilteredGrades.length === 0} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Section 1: Assignment Focus */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-purple-500 rounded-full" />
          <h2 className="text-lg font-semibold">Assignment Focus</h2>
        </div>
        <Card className="border-purple-200 dark:border-purple-800/50 bg-purple-50/30 dark:bg-purple-950/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-300">
                <Filter className="h-4 w-4" />
                Select Assignment:
              </div>
              <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                <SelectTrigger className="w-full sm:w-[350px] bg-background border-purple-200 dark:border-purple-800">
                  <SelectValue placeholder="Select assignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignments</SelectItem>
                  {data?.gradebook.map((g) => (
                    <SelectItem key={g.assignment.id} value={g.assignment.id}>
                      Week {g.assignment.weekNumber}: {g.assignment.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Class KPIs */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-emerald-500 rounded-full" />
          <h2 className="text-lg font-semibold">Class KPIs</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium">Students</span>
              </div>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{kpis.totalStudents}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">Submitted</span>
              </div>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">{kpis.submitted}</p>
              <p className="text-xs text-green-600/70 dark:text-green-400/70">{kpis.submissionRate}% rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200/50 dark:border-orange-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-medium">Missing</span>
              </div>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{kpis.missing}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium">Average</span>
              </div>
              <p className={`text-3xl font-bold ${getGradeColor(kpis.avgGrade)}`}>
                {kpis.avgGrade !== null ? `${kpis.avgGrade}%` : "—"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-950/30 dark:to-cyan-900/20 border-cyan-200/50 dark:border-cyan-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 mb-1">
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs font-medium">Median</span>
              </div>
              <p className={`text-3xl font-bold ${getGradeColor(kpis.medianGrade)}`}>
                {kpis.medianGrade !== null ? `${kpis.medianGrade}%` : "—"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/30 dark:to-slate-900/20 border-slate-200/50 dark:border-slate-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                <FileQuestion className="h-4 w-4" />
                <span className="text-xs font-medium">Assignments</span>
              </div>
              <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">{data?.totalAssignments || 0}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3: Student Performance Table */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-indigo-500 rounded-full" />
          <h2 className="text-lg font-semibold">Student Performance Table</h2>
        </div>

        {/* Filters */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row flex-wrap gap-3 md:items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="MISSING">Missing</SelectItem>
                </SelectContent>
              </Select>

              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="passing">Passing (60+)</SelectItem>
                  <SelectItem value="failing">Failing (&lt;60)</SelectItem>
                  <SelectItem value="missing">No Grade</SelectItem>
                </SelectContent>
              </Select>

              {/* Assignment Number Filter - only show when "All Assignments" is selected */}
              {selectedAssignment === "all" && data?.gradebook && data.gradebook.length > 0 && (
                <Select value={weekFilter} onValueChange={setWeekFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Assignment #" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Weeks</SelectItem>
                    {[...new Set(data.gradebook.map(g => g.assignment.weekNumber))]
                      .sort((a, b) => a - b)
                      .map((weekNum) => (
                        <SelectItem key={weekNum} value={weekNum.toString()}>
                          Week {weekNum}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {selectedAssignment !== "all" && selectedAssignmentData
                    ? selectedAssignmentData.assignment.title
                    : "All Grades"}
                </CardTitle>
                <CardDescription>
                  {sortedAndFilteredGrades.length} records
                  {searchQuery && ` matching "${searchQuery}"`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 whitespace-nowrap"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Student
                        <SortIcon field="name" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 hidden md:table-cell"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center">
                        Email
                        <SortIcon field="email" />
                      </div>
                    </TableHead>
                    {selectedAssignment === "all" && (
                      <TableHead className="hidden lg:table-cell">Assignment</TableHead>
                    )}
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
                      className="cursor-pointer hover:bg-muted/50 hidden md:table-cell"
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
                    <TableRow key={`${grade.assignmentId}-${grade.student.id}-${index}`} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-sm block truncate">{grade.student.name || "—"}</span>
                            <span className="text-xs text-muted-foreground md:hidden truncate block">{grade.student.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell text-sm">
                        {grade.student.email}
                      </TableCell>
                      {selectedAssignment === "all" && (
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline" className="text-xs font-normal">
                            W{grade.weekNumber}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>
                        <StatusBadge status={grade.status} />
                      </TableCell>
                      <TableCell>
                        {grade.grade !== null ? (
                          <span className={`font-bold text-sm px-2 py-1 rounded ${getGradeBadgeClass(grade.grade)}`}>
                            {grade.grade}%
                          </span>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 border-gray-300 bg-gray-50 dark:bg-gray-900">
                            MISSING
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {grade.submittedAt ? (
                          <span className="text-xs text-muted-foreground">
                            {new Date(grade.submittedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {grade.submissionId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingSubmission(grade.submissionId)}
                            className="h-8 px-2 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                          >
                            <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <span className="hidden md:inline ml-1">View</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {sortedAndFilteredGrades.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <FileQuestion className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <p>No matching records found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      {(!data?.gradebook || data.gradebook.length === 0) && (
        <Card className="border-dashed">
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
                <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Grade</p>
                        <p className={`text-4xl font-bold ${getGradeColor(submissionDetail.submission.grade)}`}>
                          {submissionDetail.submission.grade ?? "—"}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Questions Passed</p>
                        <p className="text-2xl font-semibold">
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
                    <Card key={qr.question.id} className={qr.isPassed ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}>
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
                            <Badge className={qr.isPassed ? "bg-green-500" : "bg-red-500"}>
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
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800 gap-1 text-xs">
          <CheckCircle2 className="h-3 w-3" />
          <span className="hidden sm:inline">Submitted</span>
        </Badge>
      )
    case "IN_PROGRESS":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800 gap-1 text-xs">
          <Clock className="h-3 w-3" />
          <span className="hidden sm:inline">In Progress</span>
        </Badge>
      )
    default:
      return (
        <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700 gap-1 text-xs">
          <XCircle className="h-3 w-3" />
          <span className="hidden sm:inline">Not Started</span>
        </Badge>
      )
  }
}
