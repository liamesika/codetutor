"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Bug, ChevronDown, ChevronUp, RefreshCw, CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ExecuteHealthResponse {
  app: "ok" | "fail"
  auth: "ok" | "fail"
  executor: "ok" | "fail" | "not_configured"
  reason?: string
  details: {
    executorUrl: string | null
    healthUrl: string | null
    httpStatus?: number
    latencyMs?: number
    errorCode?: string
    hasSecret: boolean
  }
}

// Only show in development mode
const isDev = process.env.NODE_ENV === "development"

export function ExecutionDebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false)

  const { data, isLoading, isError, error, refetch, isFetching, dataUpdatedAt } = useQuery<ExecuteHealthResponse>({
    queryKey: ["execute-health-debug"],
    queryFn: async () => {
      const res = await fetch("/api/execute/health")
      if (!res.ok) {
        throw new Error(`Health check failed: ${res.status}`)
      }
      return res.json()
    },
    refetchInterval: isExpanded ? 10000 : false, // Refetch every 10s when expanded
    staleTime: 5000,
  })

  // Don't render anything in production
  if (!isDev) return null

  const getStatusIcon = (status: "ok" | "fail" | "not_configured" | undefined) => {
    if (status === "ok") return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
    if (status === "fail") return <XCircle className="h-3.5 w-3.5 text-red-500" />
    if (status === "not_configured") return <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
    return <Clock className="h-3.5 w-3.5 text-muted-foreground animate-pulse" />
  }

  const getOverallStatus = () => {
    if (isLoading) return "loading"
    if (isError) return "error"
    if (data?.app === "ok" && data?.auth === "ok" && data?.executor === "ok") return "healthy"
    if (data?.executor === "not_configured") return "not_configured"
    return "unhealthy"
  }

  const overallStatus = getOverallStatus()

  const statusColors = {
    healthy: "bg-green-500/10 border-green-500/30 text-green-500",
    unhealthy: "bg-red-500/10 border-red-500/30 text-red-500",
    not_configured: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
    loading: "bg-blue-500/10 border-blue-500/30 text-blue-500",
    error: "bg-red-500/10 border-red-500/30 text-red-500",
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={cn(
          "rounded-lg border backdrop-blur-xl shadow-lg overflow-hidden",
          statusColors[overallStatus]
        )}
      >
        {/* Header - always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors"
        >
          <Bug className="h-4 w-4" />
          <span className="text-xs font-medium">Executor Debug</span>
          <Badge
            variant="outline"
            className={cn("ml-auto mr-2 text-[10px] h-5", statusColors[overallStatus])}
          >
            {overallStatus === "healthy" ? "OK" : overallStatus === "loading" ? "..." : overallStatus.toUpperCase()}
          </Badge>
          {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 pt-1 border-t border-current/20 space-y-2">
                {/* Status rows */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">App</span>
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(data?.app)}
                      <span>{data?.app || "..."}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Auth</span>
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(data?.auth)}
                      <span>{data?.auth || "..."}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Executor</span>
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(data?.executor)}
                      <span>{data?.executor || "..."}</span>
                    </div>
                  </div>
                </div>

                {/* Reason/Error */}
                {(data?.reason || isError) && (
                  <div className="text-[10px] p-2 rounded bg-black/20 font-mono break-all">
                    {isError ? (error as Error)?.message : data?.reason}
                  </div>
                )}

                {/* Details */}
                {data?.details && (
                  <div className="space-y-1 text-[10px]">
                    {data.details.executorUrl && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">URL</span>
                        <span className="font-mono truncate max-w-[200px]">{data.details.executorUrl}</span>
                      </div>
                    )}
                    {data.details.healthUrl && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Health</span>
                        <span className="font-mono truncate max-w-[200px]">{data.details.healthUrl}</span>
                      </div>
                    )}
                    {data.details.httpStatus !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">HTTP</span>
                        <span className={cn(
                          "font-mono",
                          data.details.httpStatus >= 200 && data.details.httpStatus < 300 ? "text-green-500" : "text-red-500"
                        )}>
                          {data.details.httpStatus}
                        </span>
                      </div>
                    )}
                    {data.details.latencyMs !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Latency</span>
                        <span className="font-mono">{data.details.latencyMs}ms</span>
                      </div>
                    )}
                    {data.details.errorCode && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Error</span>
                        <span className="font-mono text-red-400">{data.details.errorCode}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Secret</span>
                      <span className={cn("font-mono", data.details.hasSecret ? "text-green-500" : "text-yellow-500")}>
                        {data.details.hasSecret ? "set" : "missing"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Last updated */}
                {dataUpdatedAt && (
                  <div className="text-[10px] text-muted-foreground">
                    Last checked: {new Date(dataUpdatedAt).toLocaleTimeString()}
                  </div>
                )}

                {/* Refresh button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="w-full h-7 text-xs gap-1.5 border-current/30"
                >
                  <RefreshCw className={cn("h-3 w-3", isFetching && "animate-spin")} />
                  {isFetching ? "Checking..." : "Refresh"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
