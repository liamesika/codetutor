"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { DashboardShell } from "@/components/layout"
import { useCourses, useUserStats } from "@/lib/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  Trophy,
  Medal,
  Crown,
  Zap,
  Flame,
  Target,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"

interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar?: string
  xp: number
  level: number
  streak: number
  passCount: number
  isCurrentUser: boolean
}

interface LeaderboardData {
  entries: LeaderboardEntry[]
  currentUserRank?: number
  totalUsers: number
  period: string
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="size-5 text-yellow-400" />
    case 2:
      return <Medal className="size-5 text-gray-300" />
    case 3:
      return <Medal className="size-5 text-amber-600" />
    default:
      return null
  }
}

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
    case 2:
      return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30"
    case 3:
      return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30"
    default:
      return "bg-[#1E1B4B]/50 border-[#4F46E5]/20"
  }
}

function LeaderboardRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const rankIcon = getRankIcon(entry.rank)
  const rankStyle = getRankStyle(entry.rank)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300",
          rankStyle,
          entry.isCurrentUser && "ring-2 ring-[#22D3EE] ring-offset-2 ring-offset-[#0F0E26]"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Rank */}
            <div className="w-12 h-12 rounded-xl bg-[#0F0E26]/50 flex items-center justify-center shrink-0">
              {rankIcon || (
                <span className="text-lg font-bold text-[#6B7280]">
                  {entry.rank}
                </span>
              )}
            </div>

            {/* Avatar and name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0",
                  entry.rank === 1
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                    : entry.rank === 2
                    ? "bg-gradient-to-br from-gray-300 to-gray-500"
                    : entry.rank === 3
                    ? "bg-gradient-to-br from-amber-500 to-amber-700"
                    : "bg-gradient-to-br from-[#4F46E5] to-[#22D3EE]"
                )}
              >
                {entry.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-semibold truncate",
                    entry.isCurrentUser ? "text-[#22D3EE]" : "text-white"
                  )}
                >
                  {entry.name}
                  {entry.isCurrentUser && (
                    <span className="text-xs text-[#22D3EE] ml-2">(You)</span>
                  )}
                </p>
                <p className="text-sm text-[#6B7280]">Level {entry.level}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden md:flex items-center gap-1 text-sm text-[#6B7280]">
                <Flame className="size-4 text-orange-500" />
                <span>{entry.streak}</span>
              </div>
              <div className="hidden md:flex items-center gap-1 text-sm text-[#6B7280]">
                <Target className="size-4 text-green-500" />
                <span>{entry.passCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="size-4 text-[#22D3EE]" />
                <span className="font-bold text-white">{entry.xp.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <Card key={i} className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-24" />
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
          <Users className="size-10 text-[#4F46E5]" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No entries yet</h3>
        <p className="text-[#9CA3AF] text-center max-w-md mb-6">
          Be the first to climb the leaderboard by solving problems!
        </p>
      </CardContent>
    </Card>
  )
}

export default function LeaderboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { data: courses } = useCourses()
  const { data: userStats } = useUserStats()
  const [period, setPeriod] = useState<"daily" | "weekly" | "alltime">("weekly")

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<LeaderboardData>({
    queryKey: ["leaderboard", period],
    queryFn: async () => {
      const res = await fetch(`/api/progression/leaderboard?period=${period}`)
      if (!res.ok) {
        if (res.status === 404) {
          return { entries: [], totalUsers: 0, period }
        }
        throw new Error("Failed to load leaderboard")
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
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/20 border border-[#F59E0B]/30">
                  <Trophy className="size-6 text-[#F59E0B]" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                    Leaderboard
                    <Sparkles className="size-5 text-[#F59E0B] animate-pulse" />
                  </h1>
                  <p className="text-[#9CA3AF] text-sm">
                    Compete with other learners
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="gap-2 border-[#4F46E5]/30"
              >
                <RefreshCw className="size-4" />
                Refresh
              </Button>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#1E1B4B]/50 backdrop-blur-sm border border-[#4F46E5]/20 mb-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {data?.totalUsers || 0}
                </p>
                <p className="text-xs md:text-sm text-[#9CA3AF]">Total Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-[#22D3EE]">
                  #{data?.currentUserRank || "-"}
                </p>
                <p className="text-xs md:text-sm text-[#9CA3AF]">Your Rank</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="size-5 text-[#10B981]" />
                  <p className="text-2xl md:text-3xl font-bold text-[#10B981]">
                    {data?.entries?.[0]?.xp?.toLocaleString() || 0}
                  </p>
                </div>
                <p className="text-xs md:text-sm text-[#9CA3AF]">Top XP</p>
              </div>
            </div>

            {/* Period tabs */}
            <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
              <TabsList className="bg-[#1E1B4B]/50 border border-[#4F46E5]/20">
                <TabsTrigger value="daily" className="data-[state=active]:bg-[#4F46E5]">
                  Today
                </TabsTrigger>
                <TabsTrigger value="weekly" className="data-[state=active]:bg-[#4F46E5]">
                  This Week
                </TabsTrigger>
                <TabsTrigger value="alltime" className="data-[state=active]:bg-[#4F46E5]">
                  All Time
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Error state */}
          {error && (
            <Card className="bg-red-500/10 border-red-500/30 mb-6">
              <CardContent className="flex items-center justify-between p-4">
                <p className="text-red-400">Failed to load leaderboard</p>
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
            <LeaderboardSkeleton />
          ) : !data?.entries?.length ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {data.entries.map((entry, index) => (
                <LeaderboardRow key={entry.userId} entry={entry} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
