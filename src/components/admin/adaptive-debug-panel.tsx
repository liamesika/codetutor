"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  RefreshCw,
  ChevronRight,
  BarChart3,
  Lightbulb,
  Activity,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface MasteryScore {
  topicId: string
  topicTitle: string
  weekNumber: number
  weekTitle: string
  skillLevel: number
  passRate: number
  streak: number
  bestStreak: number
  attemptsCount: number
  passCount: number
  failCount: number
  avgHintsUsed: number
  totalPoints: number
  masteryScore: number
  lastAttemptAt: string | null
  status: "mastered" | "learning" | "needs-work"
}

interface SelectionEvent {
  timestamp: string
  questionId: string
  reason: string
  score: number
  candidatesCount: number
}

interface AttemptInfo {
  id: string
  questionTitle: string
  topicTitle: string
  difficulty: number
  status: string
  hintsUsed: number
  pointsEarned: number
  executionMs: number | null
  createdAt: string
}

interface DifficultyStats {
  difficulty: number
  attempts: number
  passed: number
  passRate: number
}

interface AlgorithmWeight {
  name: string
  value: string | number
  condition: string
  description: string
}

interface DebugData {
  user: {
    id: string
    name: string | null
    email: string
  }
  overview: {
    totalTopicsWithActivity: number
    totalQuestions: number
    passedQuestions: number
    completionRate: number
    overallPassRate: number
    recentAttemptsCount: number
  }
  masteryScores: MasteryScore[]
  attemptsByDifficulty: DifficultyStats[]
  recentAttempts: AttemptInfo[]
  selectionHistory: SelectionEvent[]
  algorithmWeights: {
    description: string
    weights: AlgorithmWeight[]
  }
}

export function AdaptiveDebugPanel() {
  const [userId, setUserId] = useState("")
  const [searchUserId, setSearchUserId] = useState("")

  const { data, isLoading, refetch, isRefetching } = useQuery<DebugData>({
    queryKey: ["adaptiveDebug", searchUserId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchUserId) params.set("userId", searchUserId)
      const res = await fetch(`/api/admin/adaptive-debug?${params}`)
      if (!res.ok) throw new Error("Failed to fetch debug data")
      return res.json()
    },
  })

  const handleSearch = () => {
    setSearchUserId(userId)
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
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
            <Brain className="h-6 w-6 text-primary" />
            Adaptive Algorithm Debug Panel
          </h1>
          <p className="text-muted-foreground">
            Analyze topic mastery, selection reasoning, and algorithm weights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="User ID (blank = current)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleSearch} variant="secondary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isRefetching}
          >
            <RefreshCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
          </Button>
        </div>
      </div>

      {data && (
        <>
          {/* User Info */}
          <Card className="border-primary/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{data.user.name || "Anonymous"}</p>
                  <p className="text-sm text-muted-foreground">{data.user.email}</p>
                  <p className="text-xs text-muted-foreground">ID: {data.user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Target className="h-4 w-4" />
                  Completion Rate
                </div>
                <p className="text-2xl font-bold mt-1">
                  {data.overview.completionRate}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {data.overview.passedQuestions} / {data.overview.totalQuestions} questions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Pass Rate
                </div>
                <p className="text-2xl font-bold mt-1">
                  {data.overview.overallPassRate}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {data.overview.recentAttemptsCount} recent attempts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Activity className="h-4 w-4" />
                  Active Topics
                </div>
                <p className="text-2xl font-bold mt-1">
                  {data.overview.totalTopicsWithActivity}
                </p>
                <p className="text-xs text-muted-foreground">
                  Topics with attempts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Zap className="h-4 w-4" />
                  Selection Events
                </div>
                <p className="text-2xl font-bold mt-1">
                  {data.selectionHistory.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Recent adaptive selections
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="mastery" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 max-w-xl">
              <TabsTrigger value="mastery" className="gap-2">
                <Target className="h-4 w-4" />
                Mastery
              </TabsTrigger>
              <TabsTrigger value="selection" className="gap-2">
                <Brain className="h-4 w-4" />
                Selection
              </TabsTrigger>
              <TabsTrigger value="attempts" className="gap-2">
                <Activity className="h-4 w-4" />
                Attempts
              </TabsTrigger>
              <TabsTrigger value="weights" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Weights
              </TabsTrigger>
            </TabsList>

            {/* Mastery Scores Tab */}
            <TabsContent value="mastery">
              <Card>
                <CardHeader>
                  <CardTitle>Topic Mastery Scores</CardTitle>
                  <CardDescription>
                    Skill levels and pass rates for each topic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.masteryScores.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No topic activity yet
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Topic</TableHead>
                            <TableHead>Week</TableHead>
                            <TableHead>Mastery</TableHead>
                            <TableHead>Skill Level</TableHead>
                            <TableHead>Pass Rate</TableHead>
                            <TableHead>Streak</TableHead>
                            <TableHead>Attempts</TableHead>
                            <TableHead>Hints</TableHead>
                            <TableHead>Last Activity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.masteryScores.map((score) => (
                            <TableRow key={score.topicId}>
                              <TableCell className="font-medium">
                                {score.topicTitle}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  W{score.weekNumber}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Badge
                                        className={cn(
                                          score.status === "mastered" && "bg-green-500",
                                          score.status === "learning" && "bg-yellow-500",
                                          score.status === "needs-work" && "bg-red-500"
                                        )}
                                      >
                                        {score.masteryScore}%
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Mastery = 40% skill + 40% pass rate + 20% streak</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary rounded-full"
                                      style={{ width: `${score.skillLevel}%` }}
                                    />
                                  </div>
                                  <span className="text-sm">{score.skillLevel}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {score.passRate >= 70 ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                  ) : score.passRate >= 40 ? (
                                    <ChevronRight className="h-4 w-4 text-yellow-500" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                  )}
                                  {score.passRate}%
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {score.streak >= 3 && (
                                    <Flame className="h-4 w-4 text-orange-500" />
                                  )}
                                  {score.streak}
                                  <span className="text-muted-foreground text-xs">
                                    (best: {score.bestStreak})
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-green-500">{score.passCount}</span>
                                {" / "}
                                <span className="text-red-500">{score.failCount}</span>
                                <span className="text-muted-foreground">
                                  {" "}({score.attemptsCount} total)
                                </span>
                              </TableCell>
                              <TableCell>
                                {score.avgHintsUsed.toFixed(1)} avg
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {score.lastAttemptAt
                                  ? formatDistanceToNow(new Date(score.lastAttemptAt), {
                                      addSuffix: true,
                                    })
                                  : "Never"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              {/* Difficulty Distribution */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Performance by Difficulty</CardTitle>
                  <CardDescription>
                    Pass rates across difficulty levels (1-5)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    {data.attemptsByDifficulty.map((stat) => (
                      <Card key={stat.difficulty} className="border">
                        <CardContent className="pt-4 text-center">
                          <Badge variant="outline" className="mb-2">
                            Level {stat.difficulty}
                          </Badge>
                          <p className="text-2xl font-bold">{stat.passRate}%</p>
                          <p className="text-xs text-muted-foreground">
                            {stat.passed}/{stat.attempts} passed
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Selection History Tab */}
            <TabsContent value="selection">
              <Card>
                <CardHeader>
                  <CardTitle>Question Selection History</CardTitle>
                  <CardDescription>
                    Why each question was selected by the adaptive algorithm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.selectionHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No selection events logged yet
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {data.selectionHistory.map((event, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 border rounded-lg"
                          >
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Brain className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <code className="text-xs bg-muted px-2 py-0.5 rounded">
                                  {event.questionId.slice(0, 8)}...
                                </code>
                                <Badge variant="secondary">
                                  Score: {event.score}
                                </Badge>
                                <Badge variant="outline">
                                  {event.candidatesCount} candidates
                                </Badge>
                              </div>
                              <p className="text-sm font-medium mt-1">
                                {event.reason}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(event.timestamp), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recent Attempts Tab */}
            <TabsContent value="attempts">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Attempts</CardTitle>
                  <CardDescription>
                    Last 10 question attempts and their outcomes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.recentAttempts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No attempts yet
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Question</TableHead>
                            <TableHead>Topic</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Hints</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>When</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.recentAttempts.map((attempt) => (
                            <TableRow key={attempt.id}>
                              <TableCell>
                                {attempt.status === "PASS" ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : attempt.status === "FAIL" ? (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                )}
                              </TableCell>
                              <TableCell className="font-medium max-w-xs truncate">
                                {attempt.questionTitle}
                              </TableCell>
                              <TableCell>{attempt.topicTitle}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  Level {attempt.difficulty}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {attempt.hintsUsed > 0 && (
                                  <Lightbulb className="h-4 w-4 text-yellow-500 inline mr-1" />
                                )}
                                {attempt.hintsUsed}
                              </TableCell>
                              <TableCell>
                                {attempt.pointsEarned > 0 && (
                                  <span className="text-green-500">
                                    +{attempt.pointsEarned}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {attempt.executionMs !== null && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {attempt.executionMs}ms
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {formatDistanceToNow(new Date(attempt.createdAt), {
                                  addSuffix: true,
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Algorithm Weights Tab */}
            <TabsContent value="weights">
              <Card>
                <CardHeader>
                  <CardTitle>Algorithm Weights</CardTitle>
                  <CardDescription>
                    {data.algorithmWeights.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.algorithmWeights.weights.map((weight, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 font-mono text-sm font-bold",
                            typeof weight.value === "number" || weight.value.startsWith("+")
                              ? "bg-green-500/10 text-green-500"
                              : weight.value.startsWith("-")
                              ? "bg-red-500/10 text-red-500"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {weight.value}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{weight.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {weight.condition}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {weight.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Algorithm Flow Explanation */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Selection Flow</CardTitle>
                  <CardDescription>
                    How the adaptive algorithm selects the next question
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Collect Candidates</p>
                        <p className="text-sm text-muted-foreground">
                          Gather all active, unattempted questions from unlocked topics
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Calculate Topic Stats</p>
                        <p className="text-sm text-muted-foreground">
                          Get user&apos;s pass rate, skill level, and streak for each topic
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Score Each Question</p>
                        <p className="text-sm text-muted-foreground">
                          Apply weights based on difficulty match, topic weakness, streaks, and recent failures
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                        4
                      </div>
                      <div>
                        <p className="font-medium">Add Randomness</p>
                        <p className="text-sm text-muted-foreground">
                          Add 0-20 random points to prevent predictable patterns
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shrink-0">
                        5
                      </div>
                      <div>
                        <p className="font-medium">Select Highest Score</p>
                        <p className="text-sm text-muted-foreground">
                          Pick the question with the highest total score and log the selection
                        </p>
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
