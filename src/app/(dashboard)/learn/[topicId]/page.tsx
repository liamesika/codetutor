"use client"

import { use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { DashboardShell } from "@/components/layout"
import { useCourses } from "@/lib/hooks"
import { routes } from "@/lib/routes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  Play,
  ArrowRight,
  Target,
  BookOpen,
} from "lucide-react"

interface TopicDetails {
  id: string
  title: string
  slug: string
  description: string | null
  week: {
    id: string
    weekNumber: number
    title: string
  }
  questions: {
    id: string
    title: string
    type: string
    difficulty: number
    estimatedMinutes: number
    points: number
    isPassed: boolean
    attemptCount: number
  }[]
  lessons: {
    id: string
    title: string
    slug: string
  }[]
  stats: {
    totalQuestions: number
    passedQuestions: number
    progress: number
    totalPoints: number
    earnedPoints: number
  }
}

const difficultyLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Easy", color: "text-green-500" },
  2: { label: "Medium", color: "text-yellow-500" },
  3: { label: "Hard", color: "text-orange-500" },
  4: { label: "Very Hard", color: "text-red-500" },
  5: { label: "Expert", color: "text-purple-500" },
}

export default function TopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>
}) {
  const { topicId } = use(params)
  const { status } = useSession()
  const router = useRouter()
  const { data: courses } = useCourses()

  const { data: topic, isLoading } = useQuery<TopicDetails>({
    queryKey: ["topic", topicId],
    queryFn: async () => {
      const res = await fetch(`/api/topics/${topicId}`)
      if (!res.ok) throw new Error("Failed to fetch topic")
      return res.json()
    },
    enabled: status === "authenticated",
  })

  // Get next question adaptively
  const { data: nextQuestion } = useQuery({
    queryKey: ["nextQuestion", topicId],
    queryFn: async () => {
      const res = await fetch(`/api/next-question?topicId=${topicId}`)
      if (!res.ok) return null
      return res.json()
    },
    enabled: status === "authenticated",
  })

  if (status === "loading" || isLoading) {
    return (
      <DashboardShell>
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
          <div className="grid gap-4 mt-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (status === "unauthenticated") {
    router.push(routes.login())
    return null
  }

  if (!topic) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Topic not found</p>
        </div>
      </DashboardShell>
    )
  }

  const activeCourse = courses?.find((c) => c.isEnrolled && !c.isLocked)
  const weeks = activeCourse?.weeks || []

  return (
    <DashboardShell weeks={weeks} currentCourse={activeCourse?.name}>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">
                Week {topic.week.weekNumber}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{topic.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{topic.title}</h1>
            {topic.description && (
              <p className="text-muted-foreground mt-2">{topic.description}</p>
            )}
          </div>

          {/* Progress card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">
                      {topic.stats.passedQuestions}/{topic.stats.totalQuestions} questions
                    </span>
                  </div>
                  <Progress value={topic.stats.progress} className="h-2" />
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>{topic.stats.progress}% complete</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>{topic.stats.earnedPoints}/{topic.stats.totalPoints} XP</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start practice button */}
          {nextQuestion?.questionId && (
            <Link href={routes.practice(nextQuestion.questionId)}>
              <Button size="lg" className="w-full md:w-auto gap-2">
                <Play className="h-4 w-4" />
                {topic.stats.passedQuestions === 0
                  ? "Start Practice"
                  : "Continue Practice"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Lessons section */}
        {topic.lessons.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Lessons
            </h2>
            <div className="grid gap-3">
              {topic.lessons.map((lesson) => (
                <Link key={lesson.id} href={`/learn/${topicId}/lesson/${lesson.slug}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base">{lesson.title}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Questions list */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Practice Questions</h2>
          <div className="grid gap-3">
            {topic.questions.map((question, index) => {
              const difficulty = difficultyLabels[question.difficulty] || {
                label: "Unknown",
                color: "text-muted-foreground",
              }

              return (
                <Link
                  key={question.id}
                  href={routes.practice(question.id)}
                >
                  <Card
                    className={`hover:border-primary/50 transition-colors cursor-pointer ${
                      question.isPassed ? "bg-success/5 border-success/20" : ""
                    }`}
                  >
                    <CardHeader className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {question.isPassed ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {index + 1}. {question.title}
                            </CardTitle>
                            <CardDescription className="mt-1 flex flex-wrap items-center gap-3">
                              <span className={difficulty.color}>
                                {difficulty.label}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {question.estimatedMinutes} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap className="h-3.5 w-3.5" />
                                {question.points} XP
                              </span>
                              {question.attemptCount > 0 && (
                                <span className="text-xs">
                                  {question.attemptCount} attempt{question.attemptCount !== 1 ? "s" : ""}
                                </span>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {question.type.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
