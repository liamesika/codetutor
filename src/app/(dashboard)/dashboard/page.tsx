"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useCourses, useUserStats } from "@/lib/hooks"
import { DashboardShell } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Flame,
  Target,
  Trophy,
  Zap,
  Clock,
  AlertTriangle,
  Play,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconColor,
}: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  description?: string
  iconColor?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconColor || "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

function WeekProgress({
  week,
  courseId,
}: {
  week: {
    id: string
    weekNumber: number
    title: string
    progress: number
    topics: {
      id: string
      title: string
      progress: number
      isCompleted: boolean
      questionCount: number
    }[]
  }
  courseId: string
}) {
  const completedTopics = week.topics.filter((t) => t.isCompleted).length

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Week {week.weekNumber}</CardTitle>
            <CardDescription>{week.title}</CardDescription>
          </div>
          <Badge variant={week.progress === 100 ? "default" : "secondary"}>
            {week.progress}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={week.progress} className="h-2 mb-4" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {completedTopics}/{week.topics.length} topics completed
          </span>
          <Link href={`/learn/${week.topics[0]?.id || ""}`}>
            <Button size="sm" variant="ghost" className="gap-1">
              Continue
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { data: courses, isLoading: coursesLoading } = useCourses()
  const { data: stats, isLoading: statsLoading } = useUserStats()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading" || status === "unauthenticated") {
    return null
  }

  const activeCourse = courses?.find((c) => c.isEnrolled && !c.isLocked)
  const weeks = activeCourse?.weeks || []

  return (
    <DashboardShell
      weeks={weeks}
      currentCourse={activeCourse?.name}
      userStats={
        stats
          ? { streak: stats.streak, totalPoints: stats.totalPoints }
          : undefined
      }
    >
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {session?.user?.name?.split(" ")[0] || "Student"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Continue your Java learning journey
            </p>
          </div>
          {stats?.weakTopics && stats.weakTopics.length > 0 && (
            <Link href={`/learn/${stats.weakTopics[0].topicId}/practice`}>
              <Button className="gap-2">
                <Play className="h-4 w-4" />
                Practice Weak Areas
              </Button>
            </Link>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <StatCard
                title="Day Streak"
                value={stats?.streak || 0}
                icon={Flame}
                iconColor="text-orange-500"
                description="Keep it going!"
              />
              <StatCard
                title="Total XP"
                value={stats?.totalPoints?.toLocaleString() || 0}
                icon={Zap}
                iconColor="text-yellow-500"
              />
              <StatCard
                title="Pass Rate"
                value={`${stats?.passRate || 0}%`}
                icon={Target}
                iconColor="text-green-500"
                description={`${stats?.passCount || 0} passed`}
              />
              <StatCard
                title="Achievements"
                value={stats?.achievementsCount || 0}
                icon={Trophy}
                iconColor="text-purple-500"
              />
            </>
          )}
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Course progress */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Progress
              </h2>
              {activeCourse && (
                <Badge variant="outline">{activeCourse.name}</Badge>
              )}
            </div>

            {coursesLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-2 w-full mb-4" />
                      <Skeleton className="h-4 w-40" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : weeks.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {weeks.slice(0, 6).map((week) => (
                  <WeekProgress
                    key={week.id}
                    week={week}
                    courseId={activeCourse?.id || ""}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    No course enrolled yet.
                  </p>
                  <Link href="/courses" className="mt-4">
                    <Button>Browse Courses</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar content */}
          <div className="space-y-6">
            {/* Weak topics */}
            {stats?.weakTopics && stats.weakTopics.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Focus Areas
                  </CardTitle>
                  <CardDescription>
                    Topics that need more practice
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats.weakTopics.map((topic) => (
                    <Link
                      key={topic.topicId}
                      href={`/learn/${topic.topicId}/practice`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
                        <div>
                          <p className="font-medium text-sm">{topic.topicTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {topic.passRate}% pass rate
                          </p>
                        </div>
                        <Progress
                          value={topic.skillLevel}
                          className="w-16 h-2"
                        />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recent activity */}
            {stats?.recentAttempts && stats.recentAttempts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats.recentAttempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      {attempt.status === "PASS" ? (
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {attempt.questionTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {attempt.topicTitle} •{" "}
                          {formatDistanceToNow(new Date(attempt.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {attempt.status === "PASS" && attempt.pointsEarned > 0 && (
                        <Badge variant="secondary" className="shrink-0">
                          +{attempt.pointsEarned} XP
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
