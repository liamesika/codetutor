"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQueryClient } from "@tanstack/react-query"
import { useCourses, useUserStats } from "@/lib/hooks"
import { DashboardShell } from "@/components/layout"
import { PurchaseSuccessOverlay } from "@/components/overlays/purchase-success-overlay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  LayoutDashboard,
  Calendar,
  Award,
  Activity,
  Lock,
  Star,
  GitBranch,
  ClipboardList,
  type LucideIcon,
} from "lucide-react"
import { getSafeIcon } from "@/lib/ui-contract"
import { formatDistanceToNow } from "date-fns"
import { ProgressHeader } from "@/components/progression/progress-header"
import { DailyChallengeCard } from "@/components/progression/daily-challenge-card"

// Tab configuration
const dashboardTabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "weeks", label: "Weeks", icon: Calendar },
  { id: "homework", label: "Homework", icon: ClipboardList },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "activity", label: "Activity", icon: Activity },
]

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
  expanded = false,
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
  expanded?: boolean
}) {
  const completedTopics = week.topics.filter((t) => t.isCompleted).length
  const isComplete = week.progress === 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
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
              transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
              className={cn(
                "absolute h-full rounded-full",
                isComplete ? "bg-green-500" : "gradient-neon"
              )}
            />
          </div>

          {/* Topics list for expanded view */}
          {expanded && (
            <div className="space-y-2 mb-4">
              {week.topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/learn/${topic.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    {topic.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
                    )}
                    <span className="text-sm group-hover:text-primary transition-colors">
                      {topic.title}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {topic.questionCount} Q
                  </Badge>
                </Link>
              ))}
            </div>
          )}

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

// Achievement card component
function AchievementCard({
  title,
  description,
  icon,
  unlocked,
  progress,
  index = 0,
}: {
  title: string
  description: string
  icon?: LucideIcon | string | null
  unlocked: boolean
  progress?: number
  index?: number
}) {
  // Use safe icon with fallback
  const Icon = getSafeIcon(icon, "achievement")

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className={cn(
        "glass-card overflow-hidden transition-all duration-300",
        unlocked ? "glass-card-hover" : "opacity-60"
      )}>
        <CardContent className="p-4 flex items-center gap-4">
          <motion.div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
              unlocked
                ? "bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                : "bg-muted"
            )}
            whileHover={unlocked ? { scale: 1.05 } : {}}
            whileTap={unlocked ? { scale: 0.95 } : {}}
          >
            {unlocked ? (
              <Icon className="h-6 w-6 text-white" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "font-medium",
              !unlocked && "text-muted-foreground"
            )}>
              {title}
            </p>
            <p className="text-xs text-muted-foreground">{description}</p>
            {!unlocked && progress !== undefined && (
              <div className="mt-2 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-neon rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
            )}
          </div>
          {unlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
            >
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Sample achievements data
const sampleAchievements = [
  { id: "first-pass", title: "First Steps", description: "Pass your first question", icon: CheckCircle2, unlocked: true },
  { id: "streak-3", title: "On Fire", description: "Maintain a 3-day streak", icon: Flame, unlocked: true },
  { id: "streak-7", title: "Week Warrior", description: "Maintain a 7-day streak", icon: Flame, unlocked: false, progress: 43 },
  { id: "pass-10", title: "Getting Started", description: "Pass 10 questions", icon: Target, unlocked: true },
  { id: "pass-50", title: "Problem Solver", description: "Pass 50 questions", icon: Target, unlocked: false, progress: 60 },
  { id: "pass-100", title: "Century Club", description: "Pass 100 questions", icon: Trophy, unlocked: false, progress: 30 },
  { id: "week-complete", title: "Week Master", description: "Complete an entire week", icon: Calendar, unlocked: true },
  { id: "perfect-topic", title: "Perfectionist", description: "100% on any topic", icon: Star, unlocked: false, progress: 85 },
]

// Homework list component
interface HomeworkAssignment {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  week: {
    id: string
    weekNumber: number
    title: string
  }
  questions: {
    questionId: string
    isPassed: boolean
    question: {
      id: string
      title: string
      difficulty: number
      points: number
    }
  }[]
  submission: {
    id: string
    status: string
    grade: number | null
    submittedAt: string | null
  } | null
  progress: {
    passed: number
    total: number
    percentage: number
  }
  status: string
}

function HomeworkList({
  weeks,
}: {
  weeks: {
    id: string
    weekNumber: number
    title: string
  }[]
}) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [assignments, setAssignments] = useState<HomeworkAssignment[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch assignments for each week
  useEffect(() => {
    const fetchAllAssignments = async () => {
      setLoading(true)
      try {
        const allAssignments: HomeworkAssignment[] = []
        for (const week of weeks) {
          const res = await fetch(`/api/assignments?weekNumber=${week.weekNumber}`)
          if (res.ok) {
            const data = await res.json()
            allAssignments.push(...data)
          }
        }
        setAssignments(allAssignments)
      } catch (error) {
        console.error("Failed to fetch assignments:", error)
      } finally {
        setLoading(false)
      }
    }
    if (weeks.length > 0) {
      fetchAllAssignments()
    }
  }, [weeks])

  const filteredAssignments = selectedWeek
    ? assignments.filter((a) => a.week.weekNumber === selectedWeek)
    : assignments

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-6">
              <div className="skeleton h-6 w-48 rounded mb-2" />
              <div className="skeleton h-4 w-32 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (assignments.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4">
            <ClipboardList className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-muted-foreground text-center mb-2">
            No homework assignments yet
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Your instructors will publish assignments here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Week filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedWeek === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedWeek(null)}
        >
          All Weeks
        </Button>
        {weeks.map((week) => (
          <Button
            key={week.id}
            variant={selectedWeek === week.weekNumber ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedWeek(week.weekNumber)}
          >
            Week {week.weekNumber}
          </Button>
        ))}
      </div>

      {/* Assignments list */}
      {filteredAssignments.map((assignment, index) => (
        <motion.div
          key={assignment.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link href={`/homework/${assignment.id}`}>
            <Card className={cn(
              "glass-card glass-card-hover overflow-hidden",
              assignment.submission?.status === "SUBMITTED" && "border-green-500/30"
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Week {assignment.week.weekNumber}</Badge>
                      {assignment.submission?.status === "SUBMITTED" ? (
                        <Badge className="bg-green-500 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Submitted
                        </Badge>
                      ) : assignment.status === "IN_PROGRESS" ? (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          In Progress
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Started</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{assignment.title}</h3>
                    {assignment.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {assignment.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{assignment.progress.total} questions</span>
                      {assignment.dueDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {assignment.submission?.grade !== null && assignment.submission?.grade !== undefined ? (
                      <div>
                        <p className="text-sm text-muted-foreground">Grade</p>
                        <p className={cn(
                          "text-2xl font-bold",
                          assignment.submission.grade >= 70 ? "text-green-500" :
                          assignment.submission.grade >= 50 ? "text-yellow-500" :
                          "text-red-500"
                        )}>
                          {assignment.submission.grade}%
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <p className="text-xl font-semibold">
                          {assignment.progress.passed}/{assignment.progress.total}
                        </p>
                        <div className="w-20 h-2 bg-muted/50 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full gradient-neon rounded-full"
                            style={{ width: `${assignment.progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { data: courses, isLoading: coursesLoading } = useCourses()
  const { data: stats, isLoading: statsLoading } = useUserStats()
  const [activeTab, setActiveTab] = useState("overview")
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false)

  // Check for purchase success
  const purchaseSuccess = searchParams.get("purchase") === "success"

  useEffect(() => {
    if (purchaseSuccess) {
      // Show success overlay
      setShowPurchaseSuccess(true)

      // Invalidate all subscription-related queries
      queryClient.invalidateQueries({ queryKey: ["subscription"] })
      queryClient.invalidateQueries({ queryKey: ["subscriptionCheck"] })
      queryClient.invalidateQueries({ queryKey: ["courses"] })

      // Remove the query param from URL without reload
      const url = new URL(window.location.href)
      url.searchParams.delete("purchase")
      window.history.replaceState({}, "", url.pathname)
    }
  }, [purchaseSuccess, queryClient])

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

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Progress header with XP bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 md:p-6 rounded-2xl bg-gradient-to-r from-[#1E1B4B]/80 to-[#4F46E5]/20 border border-[#4F46E5]/30"
            >
              <ProgressHeader />
            </motion.div>

            {/* Daily Challenge + Skill Tree Quick Access */}
            <div className="grid md:grid-cols-2 gap-6">
              <DailyChallengeCard />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link href="/skills" className="block">
                  <Card className="glass-card glass-card-hover h-full overflow-hidden group">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-[#4F46E5]/20 to-[#22D3EE]/20 group-hover:from-[#4F46E5]/30 group-hover:to-[#22D3EE]/30 transition-colors">
                            <GitBranch className="size-6 text-[#22D3EE]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">Skill Tree</h3>
                            <p className="text-sm text-muted-foreground">Master skills, unlock topics</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Progress through the skill tree to unlock new learning paths and earn bonus XP.
                        </p>
                      </div>
                      <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/10">
                        <span>View Skill Tree</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </div>

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
                    {weeks.slice(0, 4).map((week, index) => (
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

                {weeks.length > 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center"
                  >
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab("weeks")}
                      className="gap-2 hover:bg-primary/10"
                    >
                      View All Weeks
                      <ArrowRight className="h-4 w-4" />
                    </Button>
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
                        {stats.weakTopics.slice(0, 3).map((topic, index) => (
                          <motion.div
                            key={topic.topicId}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <Link
                              href={`/learn/${topic.topicId}`}
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

                {/* Quick achievements preview */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="glass-card overflow-hidden">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-purple-500" />
                        </div>
                        Recent Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      {sampleAchievements.filter(a => a.unlocked).slice(0, 3).map((achievement) => {
                        const AchIcon = getSafeIcon(achievement.icon, "achievement")
                        return (
                          <motion.div
                            key={achievement.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/30 transition-colors"
                            whileHover={{ x: 4 }}
                          >
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center shadow-[0_0_12px_rgba(79,70,229,0.3)]">
                              <AchIcon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{achievement.title}</p>
                              <p className="text-xs text-muted-foreground">{achievement.description}</p>
                            </div>
                          </motion.div>
                        )
                      })}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("achievements")}
                        className="w-full mt-2 gap-2"
                      >
                        View All
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        )

      case "weeks":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                All Weeks
              </h2>
              {activeCourse && (
                <Badge variant="outline" className="bg-accent/50">
                  {activeCourse.name}
                </Badge>
              )}
            </div>

            {coursesLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {weeks.map((week, index) => (
                  <WeekProgress
                    key={week.id}
                    week={week}
                    courseId={activeCourse?.id || ""}
                    index={index}
                    expanded
                  />
                ))}
              </div>
            ) : (
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
            )}
          </div>
        )

      case "homework":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <ClipboardList className="h-4 w-4 text-orange-500" />
                </div>
                Homework Assignments
              </h2>
            </div>

            <HomeworkList weeks={weeks} />
          </div>
        )

      case "achievements":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Award className="h-4 w-4 text-purple-500" />
                </div>
                Achievements
              </h2>
              <Badge variant="outline" className="bg-accent/50">
                {sampleAchievements.filter(a => a.unlocked).length}/{sampleAchievements.length} Unlocked
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleAchievements.map((achievement, index) => (
                <AchievementCard
                  key={achievement.id}
                  title={achievement.title}
                  description={achievement.description}
                  icon={achievement.icon}
                  unlocked={achievement.unlocked}
                  progress={achievement.progress}
                  index={index}
                />
              ))}
            </div>
          </div>
        )

      case "activity":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                Recent Activity
              </h2>
            </div>

            {stats?.recentAttempts && stats.recentAttempts.length > 0 ? (
              <div className="space-y-3">
                {stats.recentAttempts.map((attempt, index) => (
                  <motion.div
                    key={attempt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass-card glass-card-hover">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                          attempt.status === "PASS" ? "bg-green-500/20" : "bg-red-500/20"
                        )}>
                          {attempt.status === "PASS" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {attempt.questionTitle}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {attempt.topicTitle}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          {attempt.status === "PASS" && attempt.pointsEarned > 0 && (
                            <Badge variant="secondary" className="bg-primary/20 text-primary mb-1">
                              +{attempt.pointsEarned} XP
                            </Badge>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(attempt.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-center mb-4">
                    No activity yet. Start practicing to see your progress!
                  </p>
                  <Link href="/courses">
                    <Button className="gradient-neon text-white">Start Learning</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )

      default:
        return null
    }
  }

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
              <Link href={`/learn/${stats.weakTopics[0].topicId}`}>
                <Button className="gap-2 gradient-neon text-white shadow-lg hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all">
                  <Play className="h-4 w-4" />
                  Practice Weak Areas
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin"
          role="tablist"
          aria-label="Dashboard sections"
        >
          {dashboardTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300",
                  isActive
                    ? "bg-[#4F46E5] text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                    : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Purchase success overlay */}
      <PurchaseSuccessOverlay
        isVisible={showPurchaseSuccess}
        onClose={() => setShowPurchaseSuccess(false)}
        planName="Basic"
      />
    </DashboardShell>
  )
}
