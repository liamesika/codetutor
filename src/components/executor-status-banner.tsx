"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, RefreshCw, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useExecutorHealth } from "@/lib/hooks"

export function ExecutorStatusBanner() {
  const { data, isLoading, isError, refetch, isFetching } = useExecutorHealth()

  // Don't show anything while loading or if healthy
  if (isLoading) return null
  if (!isError && data?.executor?.healthy) return null

  const message = isError
    ? "Unable to check execution service status"
    : data?.executor?.message || "Execution service unavailable"

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-warning/10 border-b border-warning/30 px-4 py-2"
      >
        <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-warning/20 flex items-center justify-center shrink-0">
              <Server className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-warning">
                Execution Service Unavailable
              </p>
              <p className="text-xs text-muted-foreground">{message}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 border-warning/30 hover:border-warning hover:bg-warning/10"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Retry
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Compact version for practice pages
export function ExecutorStatusBadge() {
  const { data, isLoading, isError, refetch, isFetching } = useExecutorHealth()

  if (isLoading) return null
  if (!isError && data?.executor?.healthy) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/30"
    >
      <AlertTriangle className="h-4 w-4 text-warning" />
      <span className="text-xs text-warning font-medium">Service unavailable</span>
      <button
        onClick={() => refetch()}
        disabled={isFetching}
        className="p-1 rounded hover:bg-warning/20 transition-colors"
      >
        <RefreshCw className={`h-3 w-3 text-warning ${isFetching ? "animate-spin" : ""}`} />
      </button>
    </motion.div>
  )
}
