"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"

interface WeakTopic {
  topicId: string
  topicTitle: string
  topicSlug: string
  skillLevel: number
  passRate: number
}

interface RecentAttempt {
  id: string
  questionId: string
  questionTitle: string
  topicTitle: string
  status: string
  pointsEarned: number
  createdAt: string
}

interface UserStats {
  totalPoints: number
  streak: number
  attemptsCount: number
  passCount: number
  passRate: number
  achievementsCount: number
  weakTopics: WeakTopic[]
  recentAttempts: RecentAttempt[]
}

// Cache configuration - stats can be slightly stale
const STATS_STALE_TIME = 2 * 60 * 1000 // 2 minutes
const STATS_GC_TIME = 10 * 60 * 1000 // 10 minutes

export function useUserStats() {
  return useQuery<UserStats>({
    queryKey: ["userStats"],
    queryFn: async () => {
      const response = await fetch("/api/user/stats")
      if (!response.ok) {
        throw new Error("Failed to fetch user stats")
      }
      return response.json()
    },
    staleTime: STATS_STALE_TIME,
    gcTime: STATS_GC_TIME,
    refetchOnWindowFocus: false, // Prevent refetch loops
    refetchOnMount: false, // Use cache on mount if available
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  })
}

// Invalidate stats after code execution
export function useInvalidateStats() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ["userStats"] })
}

// Prefetch stats for dashboard navigation
export function usePrefetchStats() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.prefetchQuery({
      queryKey: ["userStats"],
      queryFn: async () => {
        const response = await fetch("/api/user/stats")
        if (!response.ok) throw new Error("Failed to fetch user stats")
        return response.json()
      },
      staleTime: STATS_STALE_TIME,
    })
  }
}
