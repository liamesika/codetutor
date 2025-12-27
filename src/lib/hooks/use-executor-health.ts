"use client"

import { useQuery } from "@tanstack/react-query"

interface ExecutorHealth {
  executor: {
    healthy: boolean
    message: string
    latencyMs?: number
    checkedAt: string
  }
}

// Check health every 30 seconds
const HEALTH_CHECK_INTERVAL = 30 * 1000

export function useExecutorHealth() {
  return useQuery<ExecutorHealth>({
    queryKey: ["executorHealth"],
    queryFn: async () => {
      const response = await fetch("/api/execute", { method: "GET" })
      if (!response.ok) {
        throw new Error("Failed to check executor health")
      }
      return response.json()
    },
    staleTime: HEALTH_CHECK_INTERVAL,
    gcTime: HEALTH_CHECK_INTERVAL * 2,
    refetchInterval: HEALTH_CHECK_INTERVAL,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

export function useIsExecutorAvailable() {
  const { data, isLoading, isError } = useExecutorHealth()

  // During loading, assume available
  if (isLoading) return true

  // On error, assume available (will fail gracefully on execute)
  if (isError) return true

  return data?.executor?.healthy ?? true
}
