"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

interface ConfigDiagnostics {
  hasExecutorUrl: boolean
  hasExecutorSecret: boolean
  executorUrlNormalized: string | null
  isConfigured: boolean
  env: string
  vercelEnv: string
}

// New format from /api/execute/health
interface ExecutorHealthDetailed {
  app: "ok" | "fail"
  auth: "ok" | "fail"
  executor: "ok" | "fail" | "not_configured"
  reason?: string
  actionRequired?: string
  config?: ConfigDiagnostics
  details: {
    executorUrl: string | null
    healthUrl: string | null
    httpStatus?: number
    latencyMs?: number
    errorCode?: string
    hasSecret: boolean
  }
}

// Legacy format from /api/execute GET (still supported for backwards compat)
interface ExecutorHealthLegacy {
  executor: {
    healthy: boolean
    message: string
    latencyMs?: number
    checkedAt: string
  }
}

export type ExecutorHealthData = ExecutorHealthDetailed | ExecutorHealthLegacy

// Check health every 15 seconds (reduced from 30 for faster recovery)
const HEALTH_CHECK_INTERVAL = 15 * 1000

export function useExecutorHealth() {
  return useQuery<ExecutorHealthData>({
    queryKey: ["executorHealth"],
    queryFn: async () => {
      // Always use the new detailed endpoint
      const response = await fetch("/api/execute/health", {
        cache: "no-store", // Never use cached responses
      })

      // Even non-200 responses have useful data
      const data = await response.json()
      return data
    },
    staleTime: 0, // Always consider stale - force recheck
    gcTime: HEALTH_CHECK_INTERVAL * 2,
    refetchInterval: HEALTH_CHECK_INTERVAL,
    refetchOnWindowFocus: true, // Recheck when window gets focus
    refetchOnMount: "always", // Always recheck on mount
    retry: 1,
  })
}

/**
 * Hook to force immediate health recheck
 * Use this when entering a practice page
 */
export function useForceHealthCheck() {
  const queryClient = useQueryClient()

  return () => {
    // Invalidate and refetch immediately
    queryClient.invalidateQueries({ queryKey: ["executorHealth"] })
  }
}

// Helper to normalize health data
export function normalizeHealthData(data: ExecutorHealthData | undefined): {
  isHealthy: boolean
  authOk: boolean
  executorOk: boolean
  executorNotConfigured: boolean
  message: string
  actionRequired?: string
  config?: ConfigDiagnostics
} {
  if (!data) {
    return {
      isHealthy: false,
      authOk: false,
      executorOk: false,
      executorNotConfigured: false,
      message: "Health data unavailable",
    }
  }

  // New format
  if ("app" in data) {
    return {
      isHealthy: data.app === "ok" && data.auth === "ok" && data.executor === "ok",
      authOk: data.auth === "ok",
      executorOk: data.executor === "ok",
      executorNotConfigured: data.executor === "not_configured",
      message: data.reason || (data.executor === "ok" ? "All systems operational" : "Executor unavailable"),
      actionRequired: data.actionRequired,
      config: data.config,
    }
  }

  // Legacy format
  return {
    isHealthy: data.executor?.healthy ?? false,
    authOk: true, // Legacy doesn't track auth
    executorOk: data.executor?.healthy ?? false,
    executorNotConfigured: false,
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
