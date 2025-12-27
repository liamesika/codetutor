"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ErrorFallbackProps {
  error?: Error | null
  resetErrorBoundary?: () => void
  title?: string
  description?: string
  showHomeLink?: boolean
  showReportLink?: boolean
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again.",
  showHomeLink = true,
  showReportLink = false,
}: ErrorFallbackProps) {
  // Log error for debugging
  useEffect(() => {
    if (error) {
      console.error("Error caught by ErrorFallback:", error)
    }
  }, [error])

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card overflow-hidden">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-4"
            >
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </motion.div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-base">{description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error details (only in development) */}
            {error && process.env.NODE_ENV === "development" && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-xs font-mono text-destructive break-all">
                  {error.message}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {resetErrorBoundary && (
                <Button
                  onClick={resetErrorBoundary}
                  className="flex-1 gap-2 gradient-neon text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              )}

              {showHomeLink && (
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                </Link>
              )}
            </div>

            {showReportLink && (
              <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground">
                <Bug className="h-4 w-4" />
                Report Issue
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Smaller inline error component
export function InlineError({
  message = "Failed to load",
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20"
    >
      <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
      <p className="text-sm text-destructive">{message}</p>
      {onRetry && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onRetry}
          className="shrink-0 h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/20"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      )}
    </motion.div>
  )
}

// Empty state component
export function EmptyState({
  icon: Icon = AlertTriangle,
  title = "Nothing here yet",
  description = "Start exploring to see content here.",
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title?: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button className="gradient-neon text-white">{action.label}</Button>
          </Link>
        ) : (
          <Button onClick={action.onClick} className="gradient-neon text-white">
            {action.label}
          </Button>
        )
      )}
    </motion.div>
  )
}

// Loading timeout error
export function LoadingTimeoutError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorFallback
      title="Taking too long"
      description="The request is taking longer than expected. Please check your connection and try again."
      resetErrorBoundary={onRetry}
      showHomeLink={false}
    />
  )
}

// Network error
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorFallback
      title="Connection lost"
      description="Unable to connect to the server. Please check your internet connection."
      resetErrorBoundary={onRetry}
      showHomeLink={false}
    />
  )
}

// Not found error
export function NotFoundError({
  resource = "page",
}: {
  resource?: string
}) {
  return (
    <ErrorFallback
      title={`${resource.charAt(0).toUpperCase() + resource.slice(1)} not found`}
      description={`The ${resource} you're looking for doesn't exist or has been moved.`}
      showReportLink={false}
    />
  )
}
