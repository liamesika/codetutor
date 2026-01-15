"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Calendar,
  Clock,
  BarChart3,
} from "lucide-react"

interface DashboardStats {
  totalStudents: number
  activeAssignments: number
  submissionsThisWeek: number
  studentsAtRisk: number
  avgGradeOverall: number | null
  recentSubmissions: {
    studentName: string
    assignmentTitle: string
    grade: number | null
    submittedAt: string
  }[]
  upcomingDeadlines: {
    title: string
    dueDate: string
    daysLeft: number
  }[]
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["adminDashboardStats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard-stats")
      if (!res.ok) {
        // Return defaults if API not available
        return {
          totalStudents: 0,
          activeAssignments: 0,
          submissionsThisWeek: 0,
          studentsAtRisk: 0,
          avgGradeOverall: null,
          recentSubmissions: [],
          upcomingDeadlines: [],
        }
      }
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-5 w-96" />
        </div>
        {/* KPI Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
        {/* Nav Tiles Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Academic Control Center
          </h1>
          <Badge variant="secondary" className="hidden sm:flex">
            Live
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Live overview of assignments, submissions and performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-8 -mt-8" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600">
              {stats?.totalStudents ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Enrolled in course
            </p>
          </CardContent>
        </Card>

        {/* Active Assignments */}
        <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -mr-8 -mt-8" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-purple-500" />
              Active Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600">
              {stats?.activeAssignments ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Open for submission
            </p>
          </CardContent>
        </Card>

        {/* Submissions This Week */}
        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -mr-8 -mt-8" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Submissions This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600">
              {stats?.submissionsThisWeek ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              New submissions
            </p>
          </CardContent>
        </Card>

        {/* Students At Risk */}
        <Card className="relative overflow-hidden border-l-4 border-l-red-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full -mr-8 -mt-8" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Students At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-red-600">
              {stats?.studentsAtRisk ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Grade &lt;60 or missing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation Tiles */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Manage Assignments */}
        <Link href="/admin/assignments">
          <Card className="group cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-300 dark:hover:border-purple-700 h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <ClipboardList className="h-7 w-7 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Manage Assignments</h3>
              <p className="text-muted-foreground text-sm flex-1">
                Create, edit, and publish homework assignments. Set due dates and manage question sets for each week.
              </p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Badge variant="secondary" className="text-xs">
                  {stats?.activeAssignments ?? 0} active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* View Gradebook */}
        <Link href="/admin/gradebook">
          <Card className="group cursor-pointer transition-all hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-700 h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-semibold mb-2">View Gradebook</h3>
              <p className="text-muted-foreground text-sm flex-1">
                Review student submissions, grades, and performance. Export data to CSV for academic reporting.
              </p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                {stats?.avgGradeOverall !== null && (
                  <Badge variant="secondary" className="text-xs">
                    Avg: {stats.avgGradeOverall}%
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  Export available
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Bottom Section - Recent Activity & Deadlines */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-purple-500" />
                  Recent Submissions
                </CardTitle>
                <CardDescription>Latest student activity</CardDescription>
              </div>
              <Link href="/admin/gradebook">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {stats.recentSubmissions.slice(0, 5).map((sub, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{sub.studentName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {sub.assignmentTitle}
                      </p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      {sub.grade !== null ? (
                        <Badge
                          className={
                            sub.grade >= 90
                              ? "bg-green-500"
                              : sub.grade >= 75
                              ? "bg-blue-500"
                              : sub.grade >= 60
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }
                        >
                          {sub.grade}%
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No recent submissions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Class Performance Overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-emerald-500" />
                  Performance Overview
                </CardTitle>
                <CardDescription>Class statistics at a glance</CardDescription>
              </div>
              <Link href="/admin/students">
                <Button variant="ghost" size="sm" className="text-xs">
                  View students
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Class Average */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Class Average</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stats?.avgGradeOverall !== null ? `${stats.avgGradeOverall}%` : "—"}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500/50" />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{stats?.totalStudents ?? 0}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold text-red-500">{stats?.studentsAtRisk ?? 0}</p>
                <p className="text-xs text-muted-foreground">Need Attention</p>
              </div>
            </div>

            {/* At Risk Warning */}
            {(stats?.studentsAtRisk ?? 0) > 0 && (
              <Link href="/admin/students?status=at_risk">
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">
                      {stats?.studentsAtRisk} students at risk
                    </span>
                    <ArrowRight className="h-3 w-3 text-red-500 ml-auto" />
                  </div>
                </div>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
