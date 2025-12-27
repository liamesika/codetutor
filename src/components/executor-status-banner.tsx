"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, RefreshCw, Server, LogIn, Shield, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useExecutorStatus } from "@/lib/hooks"
import Link from "next/link"

export function ExecutorStatusBanner() {
  const {
    isLoading,
    isError,
    isFetching,
    refetch,
    isHealthy,
    authOk,
    executorOk,
    message,
  } = useExecutorStatus()

  // Don't show anything while loading or if everything is healthy
  if (isLoading) return null
  if (isHealthy) return null

  // Determine the specific issue
  let title = "Execution Service Unavailable"
  let description = message
  let Icon = Server
  let showRetry = true
  let showLogin = false
  let variant: "warning" | "error" | "info" = "warning"

  if (!authOk) {
    title = "Authentication Required"
    description = "Please log in to run code"
    Icon = LogIn
    showRetry = false
    showLogin = true
    variant = "info"
  } else if (!executorOk) {
    if (message?.includes("401") || message?.includes("403") || message?.includes("authentication")) {
      title = "Deployment Protection Active"
      description = "Vercel SSO is blocking API requests. Disable Deployment Protection in Vercel settings."
      Icon = Shield
      variant = "error"
    } else if (message?.includes("timeout") || message?.includes("unreachable")) {
      title = "Executor Unreachable"
      description = "The code execution service is not responding. Please try again later."
      Icon = WifiOff
    } else {
      title = "Executor Unavailable"
      description = message || "Unable to execute code at this time"
    }
  } else if (isError) {
    title = "Health Check Failed"
    description = "Unable to verify execution service status"
    Icon = AlertTriangle
    variant = "error"
  }

  const bgColor = {
    warning: "bg-warning/10 border-warning/30",
    error: "bg-destructive/10 border-destructive/30",
    info: "bg-primary/10 border-primary/30",
  }[variant]

  const textColor = {
    warning: "text-warning",
    error: "text-destructive",
    info: "text-primary",
  }[variant]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`${bgColor} border-b px-4 py-2`}
      >
        <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
              <Icon className={`h-4 w-4 ${textColor}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${textColor}`}>{title}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showLogin && (
              <Link href="/login">
                <Button size="sm" className="gap-2">
                  <LogIn className="h-3.5 w-3.5" />
                  Log In
                </Button>
              </Link>
            )}
            {showRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="gap-2 border-current/30 hover:bg-current/10"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
                Retry
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Compact version for practice pages
export function ExecutorStatusBadge() {
  const {
    isLoading,
    isHealthy,
    authOk,
    executorOk,
    message,
    refetch,
    isFetching,
  } = useExecutorStatus()

  if (isLoading) return null
  if (isHealthy) return null

  // Determine the specific issue
  let label = "Service unavailable"
  let Icon = AlertTriangle
  let colorClasses = "bg-warning/10 border-warning/30 text-warning"

  if (!authOk) {
    label = "Login required"
    Icon = LogIn
    colorClasses = "bg-primary/10 border-primary/30 text-primary"
  } else if (!executorOk) {
    if (message?.includes("401") || message?.includes("SSO") || message?.includes("authentication")) {
      label = "SSO blocking"
      Icon = Shield
      colorClasses = "bg-destructive/10 border-destructive/30 text-destructive"
    } else {
      label = "Executor down"
      Icon = WifiOff
      colorClasses = "bg-warning/10 border-warning/30 text-warning"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colorClasses}`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium">{label}</span>
      <button
        onClick={() => refetch()}
        disabled={isFetching}
        className="p-1 rounded hover:bg-current/20 transition-colors"
        title="Retry health check"
      >
        <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} />
      </button>
    </motion.div>
  )
}
