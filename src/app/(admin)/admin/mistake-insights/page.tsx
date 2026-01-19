"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
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
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  Target,
  BarChart3,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ClassInsights {
  topMistakes: Array<{ category: string; count: number }>
  mistakesByTopic: Array<{ topic: string; count: number }>
  weeklyTrend: Array<{ week: Date; count: number }>
  studentsNeedingHelp: Array<{ userId: string; recurringMistakes: number }>
  stats: {
    totalFeedback: number
    studentsWithFeedback: number
    avgMistakesPerStudent: number
  }
}

// Format category for display
function formatCategory(category: string): string {
  return category
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

// Get category color
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    LOOP_BOUNDARY: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    LOOP_INITIALIZATION: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    LOOP_INCREMENT: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    CONDITION_LOGIC: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    CONDITION_BOUNDARY: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    ARRAY_INDEXING: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    ARRAY_SIZE: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    EDGE_CASE_EMPTY: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
    EDGE_CASE_SINGLE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
    EDGE_CASE_BOUNDARY: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
    ALGORITHM_APPROACH: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    ALGORITHM_INCOMPLETE: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    OUTPUT_FORMAT: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    PROBLEM_MISREAD: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
  }
  return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
}

export default function MistakeInsightsPage() {
  const [timeRange, setTimeRange] = useState("all")

  const { data, isLoading } = useQuery<ClassInsights>({
    queryKey: ["adminMistakeInsights", timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/admin/mistake-insights?timeRange=${timeRange}`)
      if (!res.ok) throw new Error("Failed to fetch insights")
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  const weeklyChange = data?.weeklyTrend && data.weeklyTrend.length >= 2
    ? ((data.weeklyTrend[0]?.count || 0) - (data.weeklyTrend[1]?.count || 0))
    : 0

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Mistake Insights</h1>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            Analyze student mistakes and identify learning gaps
          </p>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
              <Lightbulb className="h-4 w-4" />
              <span className="text-xs font-medium">Total Feedback</span>
            </div>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
              {data?.stats?.totalFeedback || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Students Analyzed</span>
            </div>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {data?.stats?.studentsWithFeedback || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200/50 dark:border-orange-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">Avg Mistakes/Student</span>
            </div>
            <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
              {data?.stats?.avgMistakesPerStudent || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
              {weeklyChange <= 0 ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
              <span className="text-xs font-medium">Weekly Trend</span>
            </div>
            <p className={cn(
              "text-3xl font-bold",
              weeklyChange <= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-red-600 dark:text-red-400"
            )}>
              {weeklyChange <= 0 ? weeklyChange : `+${weeklyChange}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {weeklyChange <= 0 ? "Improving" : "More mistakes"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Conceptual Mistakes */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-red-500 rounded-full" />
              <CardTitle className="text-lg">Top Conceptual Mistakes</CardTitle>
            </div>
            <CardDescription>Most common learning gaps across all students</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.topMistakes && data.topMistakes.length > 0 ? (
              <div className="space-y-3">
                {data.topMistakes.slice(0, 8).map((mistake, i) => (
                  <div key={mistake.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-5">
                        {i + 1}.
                      </span>
                      <Badge className={cn("font-normal", getCategoryColor(mistake.category))}>
                        {formatCategory(mistake.category)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-muted rounded-full w-24">
                        <div
                          className="h-2 bg-red-500 rounded-full transition-all"
                          style={{
                            width: `${Math.min((mistake.count / (data.topMistakes[0]?.count || 1)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{mistake.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No mistake data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mistakes by Topic */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-purple-500 rounded-full" />
              <CardTitle className="text-lg">Topics Needing Attention</CardTitle>
            </div>
            <CardDescription>Topics with the most student struggles</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.mistakesByTopic && data.mistakesByTopic.length > 0 ? (
              <div className="space-y-3">
                {data.mistakesByTopic.slice(0, 8).map((topic, i) => (
                  <div key={topic.topic} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{topic.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-muted rounded-full w-24">
                        <div
                          className="h-2 bg-purple-500 rounded-full transition-all"
                          style={{
                            width: `${Math.min((topic.count / (data.mistakesByTopic[0]?.count || 1)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{topic.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No topic data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Students Needing Help */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-orange-500 rounded-full" />
                <CardTitle className="text-lg">Students Needing Support</CardTitle>
              </div>
              <CardDescription>Students with recurring mistakes who may need additional help</CardDescription>
            </div>
            <Link href="/admin/students?status=at_risk">
              <Button variant="outline" size="sm" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {data?.studentsNeedingHelp && data.studentsNeedingHelp.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Recurring Mistakes</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.studentsNeedingHelp.slice(0, 10).map((student) => (
                  <TableRow key={student.userId}>
                    <TableCell className="font-mono text-sm">
                      {student.userId.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.recurringMistakes} recurring</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          student.recurringMistakes >= 5
                            ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                            : student.recurringMistakes >= 3
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                        )}
                      >
                        {student.recurringMistakes >= 5
                          ? "High"
                          : student.recurringMistakes >= 3
                          ? "Medium"
                          : "Low"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/students/${student.userId}`}>
                        <Button variant="ghost" size="sm">
                          <Target className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No students with recurring issues</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pedagogical Insights Box */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">About Pedagogical Analysis</h3>
              <p className="text-sm text-muted-foreground mb-3">
                This system analyzes student mistakes beyond technical errors. It identifies conceptual
                misunderstandings like loop boundary errors, condition logic confusion, and edge case
                handling - then provides learning-oriented feedback to help students understand <em>why</em>
                they made the mistake, not just <em>that</em> they made it.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Target className="h-3 w-3" />
                  25+ Conceptual Categories
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <BookOpen className="h-3 w-3" />
                  Guided Learning Hints
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Brain className="h-3 w-3" />
                  Recurring Pattern Detection
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
