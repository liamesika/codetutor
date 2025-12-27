"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { DashboardShell } from "@/components/layout"
import { useCourses, useUserStats } from "@/lib/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  Trophy,
  Lock,
  Star,
  CheckCircle2,
  Flame,
  Target,
  Calendar,
  Zap,
  Award,
  Sparkles,
  RefreshCw,
} from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  rarity: string
  isUnlocked: boolean
  unlockedAt?: string
  progress?: number
  requirement?: number
}

interface AchievementsData {
  achievements: Achievement[]
  totalUnlocked: number
  totalPoints: number
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Star,
  CheckCircle2,
  Flame,
  Target,
  Calendar,
  Zap,
  Award,
}

const rarityColors: Record<string, string> = {
  common: "from-gray-400 to-gray-600",
  uncommon: "from-green-400 to-green-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-500",
}

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const Icon = iconMap[achievement.icon] || Trophy
  const rarityGradient = rarityColors[achievement.rarity] || rarityColors.common

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300",
          achievement.isUnlocked
            ? "bg-gradient-to-br from-[#1E1B4B]/80 to-[#4F46E5]/20 border-[#4F46E5]/30 hover:border-[#4F46E5]/50"
            : "bg-[#1E1B4B]/30 border-[#4F46E5]/10 opacity-60"
        )}
      >
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={cn(
                "relative shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center",
                achievement.isUnlocked
                  ? `bg-gradient-to-br ${rarityGradient} shadow-lg`
                  : "bg-[#0F0E26]/80"
              )}
            >
              {achievement.isUnlocked ? (
                <Icon className="size-7 md:size-8 text-white" />
              ) : (
                <Lock className="size-6 text-[#4F46E5]/50" />
              )}
              {achievement.isUnlocked && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    boxShadow: `0 0 20px ${achievement.rarity === "legendary" ? "rgba(245,158,11,0.5)" : "rgba(79,70,229,0.3)"}`,
                  }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3
                  className={cn(
                    "font-semibold text-base md:text-lg",
                    achievement.isUnlocked ? "text-white" : "text-[#6B7280]"
                  )}
                >
                  {achievement.name}
                </h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 capitalize text-xs",
                    achievement.isUnlocked
                      ? `border-current bg-gradient-to-r ${rarityGradient} bg-clip-text text-transparent`
                      : "text-[#6B7280] border-[#6B7280]/30"
                  )}
                >
                  {achievement.rarity}
                </Badge>
              </div>
              <p className="text-sm text-[#9CA3AF] mb-3">{achievement.description}</p>

              {/* Progress bar for locked achievements */}
              {!achievement.isUnlocked && achievement.progress !== undefined && achievement.requirement && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-[#6B7280] mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.requirement}</span>
                  </div>
                  <div className="h-1.5 bg-[#0F0E26] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#4F46E5] to-[#22D3EE]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    />
                  </div>
                </div>
              )}

              {/* Points and unlock date */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-[#22D3EE]">
                  <Zap className="size-3.5" />
                  <span>{achievement.points} XP</span>
                </div>
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <span className="text-[#6B7280]">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function AchievementsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="w-16 h-16 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="bg-[#1E1B4B]/30 border-[#4F46E5]/20">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 rounded-2xl bg-[#4F46E5]/20 flex items-center justify-center mb-6">
          <Trophy className="size-10 text-[#4F46E5]" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No achievements yet</h3>
        <p className="text-[#9CA3AF] text-center max-w-md mb-6">
          Start solving problems to earn achievements and unlock rewards!
        </p>
      </CardContent>
    </Card>
  )
}

export default function AchievementsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { data: courses } = useCourses()
  const { data: userStats } = useUserStats()

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<AchievementsData>({
    queryKey: ["achievements"],
    queryFn: async () => {
      const res = await fetch("/api/achievements")
      if (!res.ok) {
        if (res.status === 404) {
          return { achievements: [], totalUnlocked: 0, totalPoints: 0 }
        }
        throw new Error("Failed to load achievements")
      }
      return res.json()
    },
    retry: 1,
  })

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

  const unlockedAchievements = data?.achievements?.filter((a) => a.isUnlocked) || []
  const lockedAchievements = data?.achievements?.filter((a) => !a.isUnlocked) || []

  return (
    <DashboardShell
      weeks={weeks}
      currentCourse={activeCourse?.name}
      userStats={
        userStats
          ? { streak: userStats.streak, totalPoints: userStats.totalPoints }
          : undefined
      }
    >
      <div className="min-h-screen bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26]">
        <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#4F46E5]/20 to-[#22D3EE]/20 border border-[#4F46E5]/30">
                  <Trophy className="size-6 text-[#22D3EE]" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                    Achievements
                    <Sparkles className="size-5 text-[#F59E0B] animate-pulse" />
                  </h1>
                  <p className="text-[#9CA3AF] text-sm">
                    Track your progress and earn rewards
                  </p>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#1E1B4B]/50 backdrop-blur-sm border border-[#4F46E5]/20">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {data?.totalUnlocked || 0}
                </p>
                <p className="text-xs md:text-sm text-[#9CA3AF]">Unlocked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-[#22D3EE]">
                  {data?.totalPoints || 0}
                </p>
                <p className="text-xs md:text-sm text-[#9CA3AF]">XP Earned</p>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <p className="text-2xl md:text-3xl font-bold text-[#F59E0B]">
                  {data?.achievements?.length || 0}
                </p>
                <p className="text-xs md:text-sm text-[#9CA3AF]">Total</p>
              </div>
            </div>
          </motion.div>

          {/* Error state */}
          {error && (
            <Card className="bg-red-500/10 border-red-500/30 mb-6">
              <CardContent className="flex items-center justify-between p-4">
                <p className="text-red-400">Failed to load achievements</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="gap-2"
                >
                  <RefreshCw className="size-4" />
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          {isLoading ? (
            <AchievementsSkeleton />
          ) : !data?.achievements?.length ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {/* Unlocked achievements */}
              {unlockedAchievements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Star className="size-5 text-[#F59E0B]" />
                    Unlocked ({unlockedAchievements.length})
                  </h2>
                  <div className="space-y-4">
                    {unlockedAchievements.map((achievement, index) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Locked achievements */}
              {lockedAchievements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-lg font-semibold text-[#6B7280] mb-4 flex items-center gap-2">
                    <Lock className="size-5" />
                    Locked ({lockedAchievements.length})
                  </h2>
                  <div className="space-y-4">
                    {lockedAchievements.map((achievement, index) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        index={index + unlockedAchievements.length}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
