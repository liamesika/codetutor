"use client"

import { useQuery } from "@tanstack/react-query"

// Legacy format from /api/execute GET
interface ExecutorHealthLegacy {
  executor: {
    healthy: boolean
    message: string
    latencyMs?: number
    checkedAt: string
  }
}

// New format from /api/execute/health
interface ExecutorHealthDetailed {
  app: "ok" | "fail"
  auth: "ok" | "fail"
  executor: "ok" | "fail" | "not_configured"
  reason?: string
  details?: Record<string, unknown>
}

export type ExecutorHealthData = ExecutorHealthLegacy | ExecutorHealthDetailed

// Check health every 30 seconds
const HEALTH_CHECK_INTERVAL = 30 * 1000

export function useExecutorHealth() {
  return useQuery<ExecutorHealthData>({
    queryKey: ["executorHealth"],
    queryFn: async () => {
      // Try new endpoint first, fall back to legacy
      try {
        const response = await fetch("/api/execute/health")
        if (response.ok) {
          return response.json()
        }
      } catch {
        // Fall through to legacy
      }

      // Legacy fallback
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

// Helper to normalize health data
export function normalizeHealthData(data: ExecutorHealthData | undefined): {
  isHealthy: boolean
  authOk: boolean
  executorOk: boolean
  message: string
} {
  if (!data) {
    return {
      isHealthy: false,
      authOk: false,
      executorOk: false,
      message: "Health data unavailable",
    }
  }

  // New format
  if ("app" in data) {
    return {
      isHealthy: data.app === "ok" && data.auth === "ok" && data.executor === "ok",
      authOk: data.auth === "ok",
      executorOk: data.executor === "ok",
      message: data.reason || (data.executor === "ok" ? "All systems operational" : "Executor unavailable"),
    }
  }

  // Legacy format
  return {
    isHealthy: data.executor?.healthy ?? false,
    authOk: true, // Legacy doesn't track auth
    executorOk: data.executor?.healthy ?? false,
    message: data.executor?.message || "Unknown status",
  }
}

export function useIsExecutorAvailable() {
  const { data, isLoading, isError } = useExecutorHealth()

  // During loading, assume available
  if (isLoading) return true

  // On error, assume unavailable
  if (isError) return false

  const { isHealthy } = normalizeHealthData(data)
  return isHealthy
}

export function useExecutorStatus() {
  const { data, isLoading, isError, refetch, isFetching } = useExecutorHealth()

  const normalized = normalizeHealthData(data)

  return {
    isLoading,
    isError,
    isFetching,
    refetch,
    ...normalized,
  }
}
