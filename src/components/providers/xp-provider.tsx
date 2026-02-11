"use client"

import { createContext, useContext, useCallback, useMemo, ReactNode } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface XpState {
  xp: number
  level: number
  xpToNextLevel: number
  xpProgress: number
  currentStreak: number
  bestStreak: number
  totalSolved: number
}

interface XpContextValue {
  state: XpState | null
  isLoading: boolean
  error: Error | null
  refreshXp: () => Promise<void>
  canAfford: (cost: number) => boolean
}

const defaultState: XpState = {
  xp: 0,
  level: 1,
  xpToNextLevel: 250,
  xpProgress: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalSolved: 0,
}

const XpContext = createContext<XpContextValue>({
  state: null,
  isLoading: true,
  error: null,
  refreshXp: async () => {},
  canAfford: () => false,
})

export function XpProvider({ children }: { children: ReactNode }) {
  const { status } = useSession()
  const queryClient = useQueryClient()
  const isAuthenticated = status === "authenticated"

  const {
    data: state,
    isLoading,
    error,
    refetch,
  } = useQuery<XpState>({
    queryKey: ["user-xp"],
    queryFn: async () => {
      const res = await fetch("/api/progression")
      if (!res.ok) throw new Error("Failed to fetch XP")
      return res.json()
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Sync every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  })

  const refreshXp = useCallback(async () => {
    // Invalidate and refetch ALL XP-related queries to keep everything in sync
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["user-xp"] }),
      queryClient.invalidateQueries({ queryKey: ["user-progress"] }),
      queryClient.invalidateQueries({ queryKey: ["user-stats"] }),
      queryClient.invalidateQueries({ queryKey: ["userStats"] }),
    ])
  }, [queryClient])

  const canAfford = useCallback((cost: number) => {
    return (state?.xp ?? 0) >= cost
  }, [state?.xp])

  const value = useMemo(() => ({
    state: state ?? (isLoading ? null : defaultState),
    isLoading,
    error: error as Error | null,
    refreshXp,
    canAfford,
  }), [state, isLoading, error, refreshXp, canAfford])

  return (
    <XpContext.Provider value={value}>
      {children}
    </XpContext.Provider>
  )
}

export function useXp() {
  const context = useContext(XpContext)
  if (!context) {
    throw new Error("useXp must be used within an XpProvider")
  }

  // Return a flat interface for easier consumption
  return {
    // Individual values from state
    xp: context.state?.xp,
    level: context.state?.level,
    xpToNextLevel: context.state?.xpToNextLevel,
    xpProgress: context.state?.xpProgress,
    streak: context.state?.currentStreak,
    bestStreak: context.state?.bestStreak,
    totalSolved: context.state?.totalSolved,
    // Methods and meta
    isLoading: context.isLoading,
    error: context.error,
    refreshXp: context.refreshXp,
    canAfford: context.canAfford,
  }
}

// Hook for hint cost calculation
export function useHintCost(usedHintCount: number) {
  return 10 * (usedHintCount + 1)
}

// Hook for solution cost
export function useSolutionCost() {
  return 50
}
