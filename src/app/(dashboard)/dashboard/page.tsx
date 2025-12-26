"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { useCourses, useUserStats } from "@/lib/hooks"
import { DashboardShell } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
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
  Sparkles,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconColor,
  index = 0,
}: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  description?: string
  iconColor?: string
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="glass-card glass-card-hover overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center",
            iconColor === "text-orange-500" && "bg-orange-500/20",
            iconColor === "text-yellow-500" && "bg-yellow-500/20",
            iconColor === "text-green-500" && "bg-green-500/20",
            iconColor === "text-purple-500" && "bg-purple-500/20",
            !iconColor && "bg-muted"
          )}>
            <Icon className={cn("h-4 w-4", iconColor || "text-muted-foreground")} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold gradient-neon-text">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function WeekProgress({
  week,
  courseId,
  index = 0,
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
  index?: number
}) {
  const completedTopics = week.topics.filter((t) => t.isCompleted).length
  const isComplete = week.progress === 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
    >
      <Card className={cn(
        "glass-card glass-card-hover overflow-hidden",
        isComplete && "border-green-500/30"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Week {week.weekNumber}
                {isComplete && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </CardTitle>
              <CardDescription>{week.title}</CardDescription>
            </div>
            <Badge
              variant={isComplete ? "default" : "secondary"}
              className={cn(
                isComplete && "bg-green-500 text-white",
                !isComplete && "bg-accent/50"
              )}
            >
              {week.progress}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative h-2 mb-4 bg-muted/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${week.progress}%` }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className={cn(
                "absolute h-full rounded-full",
                isComplete ? "bg-green-500" : "gradient-neon"
              )}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedTopics}/{week.topics.length} topics completed
            </span>
            <Link href={`/learn/${week.topics[0]?.id || ""}`}>
              <Button size="sm" variant="ghost" className="gap-1 hover:bg-primary/10 hover:text-primary">
                Continue
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
      <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              Welcome back,{" "}
              <span className="gradient-neon-text">
                {session?.user?.name?.split(" ")[0] || "Student"}
              </span>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </h1>
            <p className="text-muted-foreground mt-2">
              Continue your Java learning journey
            </p>
          </div>
          {stats?.weakTopics && stats.weakTopics.length > 0 && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href={`/learn/${stats.weakTopics[0].topicId}/practice`}>
                <Button className="gap-2 gradient-neon text-white shadow-lg hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all">
                  <Play className="h-4 w-4" />
                  Practice Weak Areas
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="glass-card">
                  <CardHeader className="pb-2">
                    <div className="skeleton h-4 w-20 rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="skeleton h-8 w-16 rounded" />
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
                index={0}
              />
              <StatCard
                title="Total XP"
                value={stats?.totalPoints?.toLocaleString() || 0}
                icon={Zap}
                iconColor="text-yellow-500"
                index={1}
              />
              <StatCard
                title="Pass Rate"
                value={`${stats?.passRate || 0}%`}
                icon={Target}
                iconColor="text-green-500"
                description={`${stats?.passCount || 0} passed`}
                index={2}
              />
              <StatCard
                title="Achievements"
                value={stats?.achievementsCount || 0}
                icon={Trophy}
                iconColor="text-purple-500"
                index={3}
              />
            </>
          )}
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Course progress */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between"
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                Course Progress
              </h2>
              {activeCourse && (
                <Badge variant="outline" className="bg-accent/50">
                  {activeCourse.name}
                </Badge>
              )}
            </motion.div>

            {coursesLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="glass-card">
                    <CardHeader>
                      <div className="skeleton h-5 w-24 rounded" />
                      <div className="skeleton h-4 w-32 rounded mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="skeleton h-2 w-full rounded mb-4" />
                      <div className="skeleton h-4 w-40 rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : weeks.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {weeks.slice(0, 6).map((week, index) => (
                  <WeekProgress
                    key={week.id}
                    week={week}
                    courseId={activeCourse?.id || ""}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-center mb-4">
                      No course enrolled yet.
                    </p>
                    <Link href="/courses">
                      <Button className="gradient-neon text-white">Browse Courses</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar content */}
          <div className="space-y-6">
            {/* Weak topics */}
            {stats?.weakTopics && stats.weakTopics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass-card overflow-hidden">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-warning/20 flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      </div>
                      Focus Areas
                    </CardTitle>
                    <CardDescription>
                      Topics that need more practice
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-4">
                    {stats.weakTopics.map((topic, index) => (
                      <motion.div
                        key={topic.topicId}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <Link
                          href={`/learn/${topic.topicId}/practice`}
                          className="block"
                        >
                          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 transition-colors group">
                            <div>
                              <p className="font-medium text-sm group-hover:text-primary transition-colors">
                                {topic.topicTitle}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {topic.passRate}% pass rate
                              </p>
                            </div>
                            <div className="w-16 h-2 bg-muted/50 rounded-full overflow-hidden">
                              <div
                                className="h-full gradient-neon rounded-full"
                                style={{ width: `${topic.skillLevel}%` }}
                              />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Recent activity */}
            {stats?.recentAttempts && stats.recentAttempts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="glass-card overflow-hidden">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    {stats.recentAttempts.map((attempt, index) => (
                      <motion.div
                        key={attempt.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-3 text-sm p-2 rounded-lg hover:bg-accent/30 transition-colors"
                      >
                        <div className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center mt-0.5 shrink-0",
                          attempt.status === "PASS" ? "bg-green-500/20" : "bg-red-500/20"
                        )}>
                          {attempt.status === "PASS" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                          )}
                        </div>
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
                          <Badge variant="secondary" className="shrink-0 bg-primary/20 text-primary">
                            +{attempt.pointsEarned} XP
                          </Badge>
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
