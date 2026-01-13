"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
          sortField === field ? "text-primary" : "text-muted-foreground"
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-muted-foreground">
          View and manage student grades and submissions
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.kpis.totalStudents ?? "-"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              data?.kpis?.avgGradeOverall != null && data.kpis.avgGradeOverall >= 70
                ? "text-green-500"
                : data?.kpis?.avgGradeOverall != null && data.kpis.avgGradeOverall >= 60
                ? "text-yellow-500"
                : "text-red-500"
            )}>
              {data?.kpis?.avgGradeOverall != null ? `${data.kpis.avgGradeOverall}%` : "-"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {data?.kpis.atRiskCount ?? "-"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Submissions</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.kpis.noSubmissionsCount ?? "-"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.kpis.totalAssignments ?? "-"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Search</label>
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

            <div className="w-[150px]">
              <label className="text-sm font-medium mb-2 block">Semester</label>
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

            <div className="w-[150px]">
              <label className="text-sm font-medium mb-2 block">Status</label>
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
              <label className="text-sm font-medium mb-2 block">Min Grade</label>
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
              <label className="text-sm font-medium mb-2 block">Max Grade</label>
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
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton h-12 rounded" />
              ))}
            </div>
          ) : sortedStudents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No students found matching your criteria.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableHeader field="studentExternalId">
                      Student ID
                    </SortableHeader>
                    <SortableHeader field="name">Name</SortableHeader>
                    <TableHead>Email</TableHead>
                    <SortableHeader field="submittedCount">
                      Submitted
                    </SortableHeader>
                    <SortableHeader field="avgGrade">Avg Grade</SortableHeader>
                    <SortableHeader field="lastSubmission">
                      Last Submission
                    </SortableHeader>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <TableCell className="font-mono text-sm">
                        {student.studentExternalId || "-"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.email}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{student.submittedCount}</span>
                        <span className="text-muted-foreground">
                          /{student.totalAssignments}
                        </span>
                      </TableCell>
                      <TableCell>
                        {student.avgGrade !== null ? (
                          <Badge
                            variant={
                              student.avgGrade >= 70
                                ? "default"
                                : student.avgGrade >= 60
                                ? "secondary"
                                : "destructive"
                            }
                            className={cn(
                              student.avgGrade >= 70 && "bg-green-500"
                            )}
                          >
                            {student.avgGrade}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {student.lastSubmission
                          ? new Date(student.lastSubmission).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {student.isAtRisk ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            At Risk
                          </Badge>
                        ) : student.submittedCount === 0 ? (
                          <Badge variant="outline">No Activity</Badge>
                        ) : (
                          <Badge className="bg-green-500">On Track</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/students/${student.id}`}>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </motion.tr>
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
