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
  Activity,
  CheckCircle2,
  ChevronRight,
  ArrowUpDown,
  Filter,
  User,
  XCircle,
  Code2,
  Clock,
} from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  studentExternalId: string | null
  createdAt: string
  questionsSolved: number
  totalAttempts: number
  lastActive: string | null
  plan: string | null
  xp: number
  level: number
  isNoActivity: boolean
}

interface StudentsResponse {
  students: Student[]
  kpis: {
    totalStudents: number
    activeToday: number
    totalQuestionsSolved: number
    noActivityCount: number
  }
}

type SortField = "name" | "questionsSolved" | "totalAttempts" | "lastActive" | "plan"
type SortOrder = "asc" | "desc"

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return "—"
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
    case "PRO": return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800"
    case "BASIC": return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800"
    case "FREE": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    default: return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  }
}

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [sortField, setSortField] = useState<SortField>("lastActive")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const { data, isLoading } = useQuery<StudentsResponse>({
    queryKey: ["admin-students", search, status],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (status && status !== "all") params.set("status", status)

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
      case "questionsSolved":
        return multiplier * (a.questionsSolved - b.questionsSolved)
      case "totalAttempts":
        return multiplier * (a.totalAttempts - b.totalAttempts)
      case "lastActive":
        if (!a.lastActive && !b.lastActive) return 0
        if (!a.lastActive) return 1
        if (!b.lastActive) return -1
        return multiplier * (new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime())
      case "plan":
        return multiplier * (a.plan || "").localeCompare(b.plan || "")
      default:
        return 0
    }
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
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
    setStatus("all")
  }

  const hasActiveFilters = search || status !== "all"

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
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
          <h1 className="text-2xl md:text-3xl font-bold">Student Activity Center</h1>
        </div>
        <p className="text-muted-foreground ml-[52px]">
          Monitor student progress, practice activity, and identify inactive students
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium">Active Today</span>
            </div>
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
              {data?.kpis.activeToday ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Questions Solved</span>
            </div>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
              {data?.kpis.totalQuestionsSolved ?? 0}
            </p>
            <p className="text-xs text-purple-600/70 dark:text-purple-400/70">across all students</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200/50 dark:border-orange-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
              <XCircle className="h-4 w-4" />
              <span className="text-xs font-medium">No Activity</span>
            </div>
            <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
              {data?.kpis.noActivityCount ?? 0}
            </p>
            <p className="text-xs text-orange-600/70 dark:text-orange-400/70">zero attempts</p>
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

            <div className="w-full md:w-[180px]">
              <label className="text-sm font-medium mb-2 block text-muted-foreground">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="active">Active Today</SelectItem>
                  <SelectItem value="no_activity">No Activity</SelectItem>
                </SelectContent>
              </Select>
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
                    <SortableHeader field="questionsSolved">
                      Solved
                    </SortableHeader>
                    <SortableHeader field="totalAttempts">
                      Attempts
                    </SortableHeader>
                    <SortableHeader field="lastActive">Last Active</SortableHeader>
                    <SortableHeader field="plan">Plan</SortableHeader>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStudents.map((student, index) => (
                    <TableRow
                      key={student.id}
                      className={cn(
                        "hover:bg-muted/30 transition-colors",
                        student.isNoActivity && "bg-orange-50/50 dark:bg-orange-950/20"
                      )}
                    >
                      <TableCell className="text-muted-foreground text-sm">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            student.isNoActivity
                              ? "bg-orange-100 dark:bg-orange-900/50"
                              : "bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50"
                          )}>
                            <User className={cn(
                              "h-4 w-4",
                              student.isNoActivity
                                ? "text-orange-600 dark:text-orange-400"
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
                        <div className="flex items-center gap-1.5">
                          <Code2 className={cn(
                            "h-3.5 w-3.5",
                            student.questionsSolved > 0
                              ? "text-green-500"
                              : "text-muted-foreground"
                          )} />
                          <span className={cn(
                            "font-bold",
                            student.questionsSolved > 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-muted-foreground"
                          )}>
                            {student.questionsSolved}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {student.totalAttempts}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className={cn(
                            "text-sm",
                            !student.lastActive
                              ? "text-muted-foreground"
                              : new Date(student.lastActive) > new Date(Date.now() - 86400000)
                              ? "text-green-600 dark:text-green-400"
                              : "text-muted-foreground"
                          )}>
                            {formatRelativeDate(student.lastActive)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", getPlanBadgeClass(student.plan))}>
                          {student.plan || "—"}
                        </Badge>
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
