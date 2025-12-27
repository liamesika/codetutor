"use client"

import { useMemo } from "react"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"

interface ProgressionData {
  level: number
  currentStreak: number
  totalSolved: number
}

interface RankData {
  currentRank: string
  nextRank: string | null
  xpToNextRank: number
  weeklyXp: number
}

interface CourseData {
  currentWeek: number
  percentComplete: number
}

// Hook for getting personalized user context
export function usePersonalizedContext() {
  const { data: session } = useSession()

  const { data: progression } = useQuery<ProgressionData>({
    queryKey: ["progression"],
    queryFn: async () => {
      const res = await fetch("/api/progression")
      if (!res.ok) return null
      return res.json()
    },
    enabled: !!session?.user,
  })

  const { data: rankData } = useQuery<RankData>({
    queryKey: ["rank"],
    queryFn: async () => {
      const res = await fetch("/api/rank")
      if (!res.ok) return null
      return res.json()
    },
    enabled: !!session?.user,
  })

  const firstName = useMemo(() => {
    if (!session?.user?.name) {
      return session?.user?.email?.split("@")[0] || "there"
    }
    return session.user.name.split(" ")[0]
  }, [session?.user?.name, session?.user?.email])

  return {
    firstName,
    fullName: session?.user?.name || firstName,
    level: progression?.level || 1,
    streak: progression?.currentStreak || 0,
    totalSolved: progression?.totalSolved || 0,
    rank: rankData?.currentRank || "BRONZE",
    nextRank: rankData?.nextRank || null,
    xpToNextRank: rankData?.xpToNextRank || 0,
    weeklyXp: rankData?.weeklyXp || 0,
    challengesToRankUp: Math.ceil((rankData?.xpToNextRank || 100) / 100),
  }
}

// Personalized greeting component
export function PersonalizedGreeting({
  variant = "default",
  className,
}: {
  variant?: "default" | "dashboard" | "practice" | "learn"
  className?: string
}) {
  const ctx = usePersonalizedContext()

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }, [])

  const messages: Record<string, string> = {
    default: `${greeting}, ${ctx.firstName}!`,
    dashboard: `Welcome back, ${ctx.firstName}! Ready to level up?`,
    practice: `Let's code, ${ctx.firstName}!`,
    learn: `Keep learning, ${ctx.firstName}!`,
  }

  return (
    <span className={className}>
      {messages[variant]}
    </span>
  )
}

// Personalized progress message
export function PersonalizedProgress({ className }: { className?: string }) {
  const ctx = usePersonalizedContext()

  const message = useMemo(() => {
    if (ctx.streak >= 7) {
      return `${ctx.firstName}, you're on fire with a ${ctx.streak}-day streak!`
    }
    if (ctx.streak > 0) {
      return `${ctx.streak} day streak going, ${ctx.firstName}!`
    }
    if (ctx.totalSolved > 0) {
      return `You've solved ${ctx.totalSolved} challenges, ${ctx.firstName}!`
    }
    return `Welcome to your journey, ${ctx.firstName}!`
  }, [ctx.firstName, ctx.streak, ctx.totalSolved])

  return <span className={className}>{message}</span>
}

// Personalized rank proximity message
export function PersonalizedRankMessage({ className }: { className?: string }) {
  const ctx = usePersonalizedContext()

  const message = useMemo(() => {
    if (!ctx.nextRank) {
      return `${ctx.firstName}, you're at the highest rank!`
    }
    if (ctx.challengesToRankUp <= 2) {
      return `So close to ${ctx.nextRank}, ${ctx.firstName}!`
    }
    if (ctx.challengesToRankUp <= 5) {
      return `${ctx.challengesToRankUp} challenges to ${ctx.nextRank}!`
    }
    return `Keep pushing toward ${ctx.nextRank}, ${ctx.firstName}!`
  }, [ctx.firstName, ctx.nextRank, ctx.challengesToRankUp])

  return <span className={className}>{message}</span>
}

// Personalized streak message
export function PersonalizedStreakMessage({ className }: { className?: string }) {
  const ctx = usePersonalizedContext()

  const message = useMemo(() => {
    if (ctx.streak === 0) {
      return `Start your streak today, ${ctx.firstName}!`
    }
    if (ctx.streak === 1) {
      return `Day 1 complete, ${ctx.firstName}! Keep it going!`
    }
    if (ctx.streak < 7) {
      return `${ctx.streak} days strong, ${ctx.firstName}!`
    }
    if (ctx.streak < 30) {
      return `Amazing ${ctx.streak}-day streak, ${ctx.firstName}!`
    }
    return `Legendary ${ctx.streak}-day streak! You're unstoppable, ${ctx.firstName}!`
  }, [ctx.firstName, ctx.streak])

  return <span className={className}>{message}</span>
}

// Utility function to interpolate personalized messages
export function interpolateMessage(
  template: string,
  ctx: ReturnType<typeof usePersonalizedContext>
): string {
  return template
    .replace(/{name}/g, ctx.firstName)
    .replace(/{fullName}/g, ctx.fullName)
    .replace(/{level}/g, String(ctx.level))
    .replace(/{streak}/g, String(ctx.streak))
    .replace(/{rank}/g, ctx.rank)
    .replace(/{nextRank}/g, ctx.nextRank || "Top Rank")
    .replace(/{challengesToRankUp}/g, String(ctx.challengesToRankUp))
    .replace(/{weeklyXp}/g, String(ctx.weeklyXp))
    .replace(/{totalSolved}/g, String(ctx.totalSolved))
}

// Generic personalized message component
export function PersonalizedMessage({
  template,
  className,
}: {
  template: string
  className?: string
}) {
  const ctx = usePersonalizedContext()
  const message = useMemo(() => interpolateMessage(template, ctx), [template, ctx])

  return <span className={className}>{message}</span>
}
