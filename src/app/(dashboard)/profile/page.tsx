"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { DashboardShell } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useCourses, useUserStats } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import {
  User,
  Trophy,
  Flame,
  Zap,
  Target,
  Calendar,
  Star,
  Crown,
  Shield,
  Gem,
  Diamond,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  Check,
  Lock,
  Rocket,
} from "lucide-react"
import Link from "next/link"
import { NeonButton } from "@/components/ui/neon-button"
import { RANK_CONFIG } from "@/lib/ranks"
import type { Rank, EntitlementPlan } from "@prisma/client"

interface ProfileData {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    memberSince: string
  }
  stats: {
    xp: number
    level: number
    xpProgress: number
    xpToNextLevel: number
    totalSolved: number
    currentStreak: number
    bestStreak: number
    topicsCompleted: number
    totalAttempts: number
    totalPassed: number
  }
  rank: {
    xp: number
    level: number
    currentRank: Rank
    nextRank: Rank | null
    progress: number
    xpToNext: number
    xpInCurrentRank: number
    rankConfig: typeof RANK_CONFIG.BRONZE
    nextRankConfig: typeof RANK_CONFIG.BRONZE | null
    league: {
      weeklyXp: number
      position: number | null
      promoted: boolean
      demoted: boolean
    }
  }
  daily: {
    hasLoggedToday: boolean
    streak: number
    lastLogin: string | null
    bonusXp: number
    bonusType: string
    nextBonusXp: number
    milestones: {
      current: number
      next: number | null
      achieved: number[]
    }
  }
  achievements: Array<{
    id: string
    code: string
    name: string
    description: string
    icon: string
    points: number
    earnedAt: string
  }>
  entitlement: {
    plan: EntitlementPlan
    status: string | null
    maxWeek: number | "unlimited"
    features: {
      hasLearningExplanations: boolean
      hasMissions: boolean
      hasAnalytics: boolean
      hasAIMentor: boolean
      hasXPBoost: boolean
    }
  }
}

// Plan configuration
const PLAN_CONFIG: Record<EntitlementPlan, {
  name: string
  description: string
  color: string
  bgColor: string
  borderColor: string
  icon: typeof Crown
}> = {
  FREE: {
    name: "Free",
    description: "Week 1 access",
    color: "#22D3EE",
    bgColor: "rgba(34, 211, 238, 0.1)",
    borderColor: "rgba(34, 211, 238, 0.3)",
    icon: Zap,
  },
  BASIC: {
    name: "Basic",
    description: "Weeks 1–10 (practice-only)",
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.1)",
    borderColor: "rgba(139, 92, 246, 0.3)",
    icon: BookOpen,
  },
  PRO: {
    name: "Pro",
    description: "Unlimited access + premium features",
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    icon: Crown,
  },
}

async function fetchProfile(): Promise<ProfileData> {
  const res = await fetch("/api/profile")
  if (!res.ok) throw new Error("Failed to fetch profile")
  return res.json()
}

function getRankIcon(rank: Rank) {
  switch (rank) {
    case "DIAMOND":
      return Diamond
    case "PLATINUM":
      return Gem
    case "GOLD":
      return Crown
    default:
      return Shield
  }
}

function RankBadge({ rank, size = "md" }: { rank: Rank; size?: "sm" | "md" | "lg" }) {
  const config = RANK_CONFIG[rank]
  const RankIcon = getRankIcon(rank)

  const sizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  const iconSizes = {
    sm: "size-5",
    md: "size-8",
    lg: "size-12",
  }

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Glow */}
      <div
        className="absolute -inset-2 rounded-2xl blur-xl opacity-50"
        style={{ backgroundColor: config.glowColor }}
      />

      {/* Badge */}
      <div
        className={cn(
          sizes[size],
          "relative rounded-2xl flex items-center justify-center",
          `bg-gradient-to-br ${config.bgGradient}`,
          "border-2"
        )}
        style={{
          borderColor: config.color,
          boxShadow: `0 0 30px ${config.glowColor}`,
        }}
      >
        <RankIcon className={iconSizes[size]} style={{ color: config.color }} />
      </div>
    </motion.div>
  )
}

function XpRingProgress({
  progress,
  xpToNext,
  currentRank,
  nextRank,
}: {
  progress: number
  xpToNext: number
  currentRank: Rank
  nextRank: Rank | null
}) {
  const config = RANK_CONFIG[currentRank]
  const circumference = 2 * Math.PI * 70

  return (
    <div className="relative w-48 h-48 md:w-56 md:h-56">
      {/* Background ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="70"
          fill="none"
          stroke="rgba(79, 70, 229, 0.2)"
          strokeWidth="12"
        />
        {/* Progress ring */}
        <motion.circle
          cx="50%"
          cy="50%"
          r="70"
          fill="none"
          stroke={config.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - progress / 100) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 10px ${config.glowColor})`,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <RankBadge rank={currentRank} size="md" />
        <p className="mt-3 text-sm text-[#9CA3AF]">
          {nextRank ? (
            <>
              <span className="font-bold text-white">{xpToNext}</span> XP to{" "}
              <span style={{ color: RANK_CONFIG[nextRank].color }}>
                {RANK_CONFIG[nextRank].name}
              </span>
            </>
          ) : (
            <span className="text-[#818CF8]">Max Rank!</span>
          )}
        </p>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay = 0,
}: {
  icon: typeof Trophy
  label: string
  value: string | number
  color: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="bg-[#1E1B4B]/30 border-[#4F46E5]/20 hover:border-[#4F46E5]/40 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="size-5" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-[#9CA3AF]">{label}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function AchievementBadge({
  achievement,
  index,
}: {
  achievement: ProfileData["achievements"][0]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#1E1B4B]/30 border border-[#4F46E5]/20 hover:border-[#4F46E5]/40 transition-colors"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/20 flex items-center justify-center">
        <Award className="size-6 text-[#F59E0B]" />
      </div>
      <p className="text-xs text-center text-white font-medium line-clamp-2">
        {achievement.name}
      </p>
    </motion.div>
  )
}

function PlanCard({ entitlement }: { entitlement: ProfileData["entitlement"] }) {
  const plan = entitlement.plan
  const config = PLAN_CONFIG[plan]
  const PlanIcon = config.icon
  const isPro = plan === "PRO"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mb-8"
    >
      <Card className="bg-[#1E1B4B]/30 border-[#4F46E5]/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Plan info section */}
            <div className="flex-1 p-6">
              <div className="flex items-start gap-4">
                {/* Plan icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: config.bgColor,
                    border: `1px solid ${config.borderColor}`,
                  }}
                >
                  <PlanIcon className="size-7" style={{ color: config.color }} />
                </div>

                {/* Plan details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-[#9CA3AF]">Current Plan</span>
                    {isPro && (
                      <Badge
                        className="gap-1 text-xs"
                        style={{
                          backgroundColor: config.bgColor,
                          borderColor: config.borderColor,
                          color: config.color,
                        }}
                      >
                        <Crown className="size-3" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <h3
                    className="text-2xl font-bold mb-1"
                    style={{ color: config.color }}
                  >
                    {config.name}
                  </h3>
                  <p className="text-sm text-[#9CA3AF]">{config.description}</p>

                  {/* Feature highlights for PRO */}
                  {isPro && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {entitlement.features.hasLearningExplanations && (
                        <span className="inline-flex items-center gap-1 text-xs text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">
                          <Check className="size-3" /> Learning
                        </span>
                      )}
                      {entitlement.features.hasMissions && (
                        <span className="inline-flex items-center gap-1 text-xs text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">
                          <Check className="size-3" /> Missions
                        </span>
                      )}
                      {entitlement.features.hasXPBoost && (
                        <span className="inline-flex items-center gap-1 text-xs text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">
                          <Check className="size-3" /> XP Boost
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upgrade CTA section (only for non-PRO) */}
            {!isPro && (
              <div
                className="p-6 flex flex-col justify-center items-center gap-3 md:border-l border-t md:border-t-0 border-[#4F46E5]/20"
                style={{
                  background: "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%)",
                }}
              >
                <div className="text-center md:text-left">
                  <p className="text-sm text-[#9CA3AF] mb-1">Unlock all features</p>
                  <p className="text-lg font-bold text-white">Upgrade to PRO</p>
                </div>
                <Link href="/pricing" className="w-full md:w-auto">
                  <NeonButton
                    className="w-full md:w-auto gap-2"
                    rightIcon={<ArrowRight className="size-4" />}
                  >
                    <Rocket className="size-4" />
                    Upgrade Now
                  </NeonButton>
                </Link>
                <Link
                  href="/pricing"
                  className="text-xs text-[#6B7280] hover:text-white transition-colors"
                >
                  Compare all plans →
                </Link>
              </div>
            )}

            {/* Manage plan section (for PRO users) */}
            {isPro && (
              <div className="p-6 flex flex-col justify-center items-center gap-2 md:border-l border-t md:border-t-0 border-[#4F46E5]/20">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <Check className="size-6 text-[#10B981]" />
                </div>
                <p className="text-sm font-medium text-[#10B981]">You're on PRO</p>
                <Link
                  href="/pricing"
                  className="text-xs text-[#6B7280] hover:text-white transition-colors"
                >
                  View plan details
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function MobileUpgradeBar({ plan }: { plan: EntitlementPlan }) {
  if (plan === "PRO") return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-20 left-0 right-0 z-40 md:hidden px-4 pb-4"
    >
      <Link href="/pricing">
        <div
          className="flex items-center justify-between gap-3 p-4 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.2)",
              }}
            >
              <Rocket className="size-5 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Upgrade to PRO</p>
              <p className="text-xs text-[#9CA3AF]">Unlock all weeks & features</p>
            </div>
          </div>
          <ArrowRight className="size-5 text-[#F59E0B]" />
        </div>
      </Link>
    </motion.div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Skeleton className="w-48 h-48 rounded-full bg-[#4F46E5]/20" />
        <div className="space-y-4 flex-1">
          <Skeleton className="h-8 w-48 bg-[#4F46E5]/20" />
          <Skeleton className="h-4 w-32 bg-[#4F46E5]/10" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full bg-[#4F46E5]/20" />
            <Skeleton className="h-6 w-24 rounded-full bg-[#4F46E5]/20" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-20 rounded-xl bg-[#4F46E5]/20" />
        ))}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { data: courses } = useCourses()
  const { data: userStats } = useUserStats()

  const { data, isLoading, error } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: status === "authenticated",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return null
  }

  const activeCourse = courses?.find(c => c.isEnrolled && !c.isLocked)
  const weeks = activeCourse?.weeks || []

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
        {isLoading ? (
          <ProfileSkeleton />
        ) : error ? (
          <div className="p-8 text-center text-red-400">Failed to load profile</div>
        ) : data ? (
          <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-8"
            >
              {/* XP Ring with Rank */}
              <XpRingProgress
                progress={data.rank.progress}
                xpToNext={data.rank.xpToNext}
                currentRank={data.rank.currentRank}
                nextRank={data.rank.nextRank}
              />

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {data.user.name || "Coder"}
                  </h1>
                  <Sparkles className="size-5 text-[#F59E0B]" />
                </div>

                <p className="text-[#9CA3AF] mb-4">{data.user.email}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <Badge
                    className="gap-1"
                    style={{
                      backgroundColor: `${data.rank.rankConfig.color}20`,
                      borderColor: data.rank.rankConfig.color,
                      color: data.rank.rankConfig.color,
                    }}
                  >
                    {(() => {
                      const RankIcon = getRankIcon(data.rank.currentRank)
                      return <RankIcon className="size-3" />
                    })()}
                    {data.rank.rankConfig.name}
                  </Badge>

                  <Badge variant="outline" className="gap-1 border-[#4F46E5]/30">
                    <Zap className="size-3 text-[#22D3EE]" />
                    Level {data.stats.level}
                  </Badge>

                  <Badge variant="outline" className="gap-1 border-[#4F46E5]/30">
                    <Flame className="size-3 text-[#EF4444]" />
                    {data.daily.streak} day streak
                  </Badge>
                </div>

                {/* League position */}
                {data.rank.league.position && (
                  <motion.div
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E1B4B]/50 border border-[#4F46E5]/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <TrendingUp className="size-4 text-[#10B981]" />
                    <span className="text-sm text-[#9CA3AF]">
                      #{data.rank.league.position} this week •{" "}
                      <span className="text-[#22D3EE] font-medium">
                        {data.rank.league.weeklyXp} XP
                      </span>
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={Zap}
                label="Total XP"
                value={data.stats.xp.toLocaleString()}
                color="#22D3EE"
                delay={0.1}
              />
              <StatCard
                icon={Target}
                label="Problems Solved"
                value={data.stats.totalSolved}
                color="#10B981"
                delay={0.15}
              />
              <StatCard
                icon={Flame}
                label="Best Streak"
                value={data.stats.bestStreak}
                color="#EF4444"
                delay={0.2}
              />
              <StatCard
                icon={Calendar}
                label="Topics Completed"
                value={data.stats.topicsCompleted}
                color="#F59E0B"
                delay={0.25}
              />
            </div>

            {/* Current Plan */}
            <PlanCard entitlement={data.entitlement} />

            {/* Streak Milestones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <Card className="bg-[#1E1B4B]/30 border-[#4F46E5]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Flame className="size-5 text-[#EF4444]" />
                    Streak Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    {[3, 7, 14, 30, 60, 100].map(milestone => {
                      const achieved = data.daily.milestones.achieved.includes(milestone)
                      return (
                        <div
                          key={milestone}
                          className={cn(
                            "flex flex-col items-center gap-1 p-3 rounded-xl shrink-0",
                            achieved
                              ? "bg-gradient-to-br from-[#EF4444]/20 to-[#F59E0B]/20 border border-[#EF4444]/30"
                              : "bg-[#0F0E26]/50 border border-[#4F46E5]/10 opacity-50"
                          )}
                        >
                          <Flame
                            className={cn(
                              "size-6",
                              achieved ? "text-[#EF4444]" : "text-[#6B7280]"
                            )}
                          />
                          <span
                            className={cn(
                              "text-lg font-bold",
                              achieved ? "text-white" : "text-[#6B7280]"
                            )}
                          >
                            {milestone}
                          </span>
                          <span className="text-xs text-[#6B7280]">days</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-[#1E1B4B]/30 border-[#4F46E5]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="size-5 text-[#F59E0B]" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.achievements.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {data.achievements.map((achievement, index) => (
                        <AchievementBadge
                          key={achievement.id}
                          achievement={achievement}
                          index={index}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="size-12 mx-auto text-[#4F46E5]/30 mb-3" />
                      <p className="text-[#6B7280]">No achievements yet</p>
                      <p className="text-sm text-[#4F46E5]/50">
                        Solve problems to unlock achievements!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : null}

        {/* Mobile sticky upgrade bar */}
        {data && <MobileUpgradeBar plan={data.entitlement.plan} />}
      </div>
    </DashboardShell>
  )
}
