"use client"

import { useQuery } from "@tanstack/react-query"

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
  })
}
