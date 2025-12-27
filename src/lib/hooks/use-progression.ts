import { useQuery, useQueryClient } from "@tanstack/react-query"

interface UserProgressData {
  xp: number
  level: number
  xpToNextLevel: number
  xpProgress: number
  currentStreak: number
  bestStreak: number
  totalSolved: number
}

interface DailyChallengeData {
  challenge: {
    id: string
    date: string
    bonusXp: number
    question: {
      id: string
      title: string
      slug: string
      difficulty: number
      type: string
      estimatedMinutes: number
      points: number
      topic: {
        id: string
        title: string
        weekNumber: number
      }
    }
    isCompleted: boolean
    completedAt?: string
    xpEarned?: number
  } | null
  streak: number
}

export function useUserProgress() {
  return useQuery<UserProgressData>({
    queryKey: ["user-progress"],
    queryFn: async () => {
      const res = await fetch("/api/progression")
      if (!res.ok) throw new Error("Failed to load progress")
      return res.json()
    },
    refetchInterval: 30000,
    staleTime: 10000,
  })
}

export function useDailyChallenge() {
  return useQuery<DailyChallengeData>({
    queryKey: ["daily-challenge"],
    queryFn: async () => {
      const res = await fetch("/api/daily-challenge")
      if (!res.ok) throw new Error("Failed to load daily challenge")
      return res.json()
    },
    refetchInterval: 60000,
    staleTime: 30000,
  })
}

export function useInvalidateProgression() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: ["user-progress"] })
    queryClient.invalidateQueries({ queryKey: ["daily-challenge"] })
    queryClient.invalidateQueries({ queryKey: ["skill-tree"] })
  }
}
