"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  CheckCircle2,
  XCircle,
  Activity,
  Calendar,
  RefreshCw,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface AnalyticsData {
  overview: {
    totalUsers: number
    newUsersThisWeek: number
    activeUsersToday: number
    activeUsersThisWeek: number
    totalAttempts: number
    attemptsThisWeek: number
    overallPassRate: number
    avgSessionDuration: number
  }
  dailyActivity: {
    date: string
    attempts: number
    passes: number
    users: number
  }[]
  topicPerformance: {
    topicId: string
    topicTitle: string
    weekNumber: number
    totalAttempts: number
    passRate: number
    avgHintsUsed: number
    avgTimeMs: number
  }[]
  questionPerformance: {
    questionId: string
    questionTitle: string
    topicTitle: string
    difficulty: number
    attempts: number
    passRate: number
    avgHints: number
  }[]
  userLeaderboard: {
    userId: string
    userName: string | null
    email: string
    totalPoints: number
    questionsCompleted: number
    passRate: number
    streak: number
  }[]
  errorBreakdown: {
    status: string
    count: number
    percentage: number
  }[]
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  const { data, isLoading, refetch, isRefetching } = useQuery<AnalyticsData>({
    queryKey: ["adminAnalytics", timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (!res.ok) throw new Error("Failed to fetch analytics")
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Platform usage metrics and performance insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isRefetching}
          >
            <RefreshCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {data && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Users className="h-4 w-4" />
                  Active Users
                </div>
                <p className="text-2xl font-bold mt-1">
                  {data.overview.activeUsersToday}
                </p>
                <p className="text-xs text-muted-foreground">
                  {data.overview.activeUsersThisWeek} this week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Activity className="h-4 w-4" />
                  Attempts
                </div>
                <p className="text-2xl font-bold mt-1">
                  {data.overview.attemptsThisWeek}
                </p>
                <p className="text-xs text-muted-foreground">
                  {data.overview.totalAttempts} total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Target className="h-4 w-4" />
                  Pass Rate
                </div>
                <p className="text-2xl font-bold mt-1">
                  {data.overview.overallPassRate}%
                </p>
                <div className="flex items-center gap-1 text-xs">
                  {data.overview.overallPassRate >= 50 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className="text-muted-foreground">overall</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Users className="h-4 w-4" />
                  New Users
                </div>
                <p className="text-2xl font-bold mt-1">
                  {data.overview.newUsersThisWeek}
                </p>
                <p className="text-xs text-muted-foreground">
                  this week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="topics" className="space-y-4">
            <TabsList>
              <TabsTrigger value="topics">Topic Performance</TabsTrigger>
              <TabsTrigger value="questions">Question Analysis</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="errors">Error Breakdown</TabsTrigger>
            </TabsList>

            {/* Topic Performance */}
            <TabsContent value="topics">
              <Card>
                <CardHeader>
                  <CardTitle>Topic Performance</CardTitle>
                  <CardDescription>
                    Pass rates and engagement by topic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Topic</TableHead>
                          <TableHead>Week</TableHead>
                          <TableHead>Attempts</TableHead>
                          <TableHead>Pass Rate</TableHead>
                          <TableHead>Avg Hints</TableHead>
                          <TableHead>Avg Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.topicPerformance.map((topic) => (
                          <TableRow key={topic.topicId}>
                            <TableCell className="font-medium">
                              {topic.topicTitle}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">W{topic.weekNumber}</Badge>
                            </TableCell>
                            <TableCell>{topic.totalAttempts}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      "h-full rounded-full",
                                      topic.passRate >= 70
                                        ? "bg-green-500"
                                        : topic.passRate >= 40
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    )}
                                    style={{ width: `${topic.passRate}%` }}
                                  />
                                </div>
                                <span className="text-sm">{topic.passRate}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{topic.avgHintsUsed.toFixed(1)}</TableCell>
                            <TableCell>
                              {topic.avgTimeMs > 0
                                ? `${Math.round(topic.avgTimeMs)}ms`
                                : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Question Analysis */}
            <TabsContent value="questions">
              <Card>
                <CardHeader>
                  <CardTitle>Question Performance</CardTitle>
                  <CardDescription>
                    Individual question statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Question</TableHead>
                          <TableHead>Topic</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Attempts</TableHead>
                          <TableHead>Pass Rate</TableHead>
                          <TableHead>Avg Hints</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.questionPerformance.map((q) => (
                          <TableRow key={q.questionId}>
                            <TableCell className="font-medium max-w-xs truncate">
                              {q.questionTitle}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {q.topicTitle}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  q.difficulty <= 2
                                    ? "default"
                                    : q.difficulty <= 3
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                Level {q.difficulty}
                              </Badge>
                            </TableCell>
                            <TableCell>{q.attempts}</TableCell>
                            <TableCell>
                              <span
                                className={cn(
                                  "font-medium",
                                  q.passRate >= 70
                                    ? "text-green-500"
                                    : q.passRate >= 40
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                )}
                              >
                                {q.passRate}%
                              </span>
                            </TableCell>
                            <TableCell>{q.avgHints.toFixed(1)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leaderboard */}
            <TabsContent value="leaderboard">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>
                    Users ranked by points and completion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rank</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Points</TableHead>
                          <TableHead>Completed</TableHead>
                          <TableHead>Pass Rate</TableHead>
                          <TableHead>Streak</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.userLeaderboard.map((user, index) => (
                          <TableRow key={user.userId}>
                            <TableCell>
                              <Badge
                                variant={index < 3 ? "default" : "outline"}
                                className={cn(
                                  index === 0 && "bg-yellow-500",
                                  index === 1 && "bg-gray-400",
                                  index === 2 && "bg-amber-600"
                                )}
                              >
                                #{index + 1}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {user.userName || "Anonymous"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold">
                              {user.totalPoints.toLocaleString()} XP
                            </TableCell>
                            <TableCell>{user.questionsCompleted}</TableCell>
                            <TableCell>
                              <span
                                className={cn(
                                  user.passRate >= 70
                                    ? "text-green-500"
                                    : user.passRate >= 40
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                )}
                              >
                                {user.passRate}%
                              </span>
                            </TableCell>
                            <TableCell>
                              {user.streak > 0 && (
                                <span className="flex items-center gap-1">
                                  🔥 {user.streak}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Error Breakdown */}
            <TabsContent value="errors">
              <Card>
                <CardHeader>
                  <CardTitle>Error Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of submission outcomes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {data.errorBreakdown.map((error) => (
                        <div key={error.status} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {error.status === "PASS" ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="font-medium">
                                {error.status.replace("_", " ")}
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              {error.count} ({error.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                error.status === "PASS"
                                  ? "bg-green-500"
                                  : error.status === "FAIL"
                                  ? "bg-red-500"
                                  : error.status === "COMPILE_ERROR"
                                  ? "bg-amber-500"
                                  : error.status === "RUNTIME_ERROR"
                                  ? "bg-orange-500"
                                  : "bg-yellow-500"
                              )}
                              style={{ width: `${error.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="text-6xl font-bold text-primary">
                          {data.overview.overallPassRate}%
                        </div>
                        <div className="text-muted-foreground">
                          Overall Pass Rate
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Based on {data.overview.totalAttempts.toLocaleString()} attempts
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
