"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  Users,
  Search,
  AlertTriangle,
  TrendingUp,
  FileCheck,
  GraduationCap,
  ChevronRight,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  User,
  XCircle,
} from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  studentExternalId: string | null
  createdAt: string
  submittedCount: number
  totalAssignments: number
  avgGrade: number | null
  lastSubmission: string | null
  isAtRisk: boolean
}

interface StudentsResponse {
  students: Student[]
  semesters: string[]
  kpis: {
    totalStudents: number
    avgGradeOverall: number | null
    atRiskCount: number
    noSubmissionsCount: number
    totalAssignments: number
  }
}

type SortField = "name" | "studentExternalId" | "avgGrade" | "submittedCount" | "lastSubmission"
type SortOrder = "asc" | "desc"

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

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("")
  const [semester, setSemester] = useState("all")
  const [status, setStatus] = useState("all")
  const [gradeMin, setGradeMin] = useState("")
  const [gradeMax, setGradeMax] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  const { data, isLoading } = useQuery<StudentsResponse>({
    queryKey: ["admin-students", search, semester, status, gradeMin, gradeMax],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (semester && semester !== "all") params.set("semester", semester)
      if (status && status !== "all") params.set("status", status)
      if (gradeMin) params.set("gradeMin", gradeMin)
      if (gradeMax) params.set("gradeMax", gradeMax)

      const res = await fetch(`/api/admin/students?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch students")
      return res.json()
    },
  })

  // Sort students
  const sortedStudents = [...(data?.students || [])].sort((a, b) => {
    const multiplier = sortOrder === "asc" ? 1 : -1

    switch (sortField) {
      case "name":
        return multiplier * (a.name || "").localeCompare(b.name || "")
      case "studentExternalId":
        return multiplier * (a.studentExternalId || "").localeCompare(b.studentExternalId || "")
      case "avgGrade":
        if (a.avgGrade === null && b.avgGrade === null) return 0
        if (a.avgGrade === null) return 1
        if (b.avgGrade === null) return -1
        return multiplier * (a.avgGrade - b.avgGrade)
      case "submittedCount":
        return multiplier * (a.submittedCount - b.submittedCount)
      case "lastSubmission":
        if (!a.lastSubmission && !b.lastSubmission) return 0
        if (!a.lastSubmission) return 1
        if (!b.lastSubmission) return -1
        return multiplier * (new Date(a.lastSubmission).getTime() - new Date(b.lastSubmission).getTime())
      default:
        return 0
    }
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={cn(
          "h-3 w-3",
          sortField === field ? "text-purple-500" : "text-muted-foreground"
        )} />
      </div>
    </TableHead>
  )

  const clearFilters = () => {
    setSearch("")
    setSemester("all")
    setStatus("all")
    setGradeMin("")
    setGradeMax("")
  }

  const hasActiveFilters = search || semester !== "all" || status !== "all" || gradeMin || gradeMax

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded" />
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Student Progress Center</h1>
        </div>
        <p className="text-muted-foreground ml-[52px]">
          Monitor student performance, submissions, and identify at-risk students
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Total Students</span>
            </div>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {data?.kpis.totalStudents ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Class Average</span>
            </div>
            <p className={cn("text-3xl font-bold", getGradeColor(data?.kpis?.avgGradeOverall ?? null))}>
              {data?.kpis?.avgGradeOverall != null ? `${data.kpis.avgGradeOverall}%` : "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border-red-200/50 dark:border-red-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">At Risk</span>
            </div>
            <p className="text-3xl font-bold text-red-700 dark:text-red-300">
              {data?.kpis.atRiskCount ?? 0}
            </p>
            <p className="text-xs text-red-600/70 dark:text-red-400/70">Avg &lt;60 or missing</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200/50 dark:border-orange-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
              <XCircle className="h-4 w-4" />
              <span className="text-xs font-medium">No Submissions</span>
            </div>
            <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
              {data?.kpis.noSubmissionsCount ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
              <GraduationCap className="h-4 w-4" />
              <span className="text-xs font-medium">Assignments</span>
            </div>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
              {data?.kpis.totalAssignments ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or student ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="w-full md:w-[150px]">
              <label className="text-sm font-medium mb-2 block text-muted-foreground">Semester</label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="All semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {data?.semesters.map((sem) => (
                    <SelectItem key={sem} value={sem}>
                      {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-[150px]">
              <label className="text-sm font-medium mb-2 block text-muted-foreground">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="passing">Passing (≥60%)</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
                  <SelectItem value="no_submissions">No Submissions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[100px]">
              <label className="text-sm font-medium mb-2 block text-muted-foreground">Min Grade</label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={gradeMin}
                onChange={(e) => setGradeMin(e.target.value)}
              />
            </div>

            <div className="w-[100px]">
              <label className="text-sm font-medium mb-2 block text-muted-foreground">Max Grade</label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="100"
                value={gradeMax}
                onChange={(e) => setGradeMax(e.target.value)}
              />
            </div>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Student Records</CardTitle>
              <CardDescription>
                {sortedStudents.length} students
                {hasActiveFilters && " (filtered)"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {sortedStudents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No students found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-[50px]">#</TableHead>
                    <SortableHeader field="name">Name</SortableHeader>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <SortableHeader field="submittedCount">
                      Submissions
                    </SortableHeader>
                    <SortableHeader field="avgGrade">Avg Grade</SortableHeader>
                    <TableHead>Risk Level</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStudents.map((student, index) => (
                    <TableRow
                      key={student.id}
                      className={cn(
                        "hover:bg-muted/30 transition-colors",
                        student.isAtRisk && "bg-red-50/50 dark:bg-red-950/20"
                      )}
                    >
                      <TableCell className="text-muted-foreground text-sm">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            student.isAtRisk
                              ? "bg-red-100 dark:bg-red-900/50"
                              : "bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50"
                          )}>
                            <User className={cn(
                              "h-4 w-4",
                              student.isAtRisk
                                ? "text-red-600 dark:text-red-400"
                                : "text-purple-600 dark:text-purple-400"
                            )} />
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-sm block truncate">{student.name}</span>
                            <span className="text-xs text-muted-foreground md:hidden truncate block">{student.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell text-sm">
                        {student.email}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className={cn(
                            "font-bold",
                            student.submittedCount === student.totalAssignments
                              ? "text-green-600 dark:text-green-400"
                              : student.submittedCount === 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-orange-600 dark:text-orange-400"
                          )}>
                            {student.submittedCount}
                          </span>
                          <span className="text-muted-foreground">/{student.totalAssignments}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.avgGrade !== null ? (
                          <span className={cn("font-bold text-sm px-2 py-1 rounded", getGradeBadgeClass(student.avgGrade))}>
                            {student.avgGrade}%
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.isAtRisk ? (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800 gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            At Risk
                          </Badge>
                        ) : student.submittedCount === 0 ? (
                          <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-800 gap-1">
                            <XCircle className="h-3 w-3" />
                            No Activity
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800 gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            OK
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/students/${student.id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-purple-100 dark:hover:bg-purple-900/30">
                            <ChevronRight className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
