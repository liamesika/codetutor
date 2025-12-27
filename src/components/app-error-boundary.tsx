"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error("AppErrorBoundary caught an error:", error, errorInfo)

    // In production, you could send this to an error tracking service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to Sentry or similar
      try {
        const Sentry = require("@sentry/nextjs")
        Sentry.captureException(error, { extra: errorInfo })
      } catch {
        // Sentry not available
      }
    }
  }

  handleRefresh = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.href = "/dashboard"
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26] flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-[#1E1B4B]/80 border-red-500/30 backdrop-blur-xl">
            <CardContent className="p-8 text-center">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="size-10 text-red-400" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-white mb-2">
                Something went wrong
              </h1>

              {/* Description */}
              <p className="text-[#9CA3AF] mb-6">
                We encountered an unexpected error. Please try refreshing the page
                or go back to the dashboard.
              </p>

              {/* Error details (development only) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mb-6 p-4 rounded-lg bg-[#0F0E26]/80 text-left">
                  <p className="text-xs font-mono text-red-400 break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleRefresh}
                  className="gap-2 bg-[#4F46E5] hover:bg-[#4F46E5]/80"
                >
                  <RefreshCw className="size-4" />
                  Refresh Page
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="gap-2 border-[#4F46E5]/30"
                >
                  <Home className="size-4" />
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional wrapper for easier use
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <AppErrorBoundary fallback={fallback}>
        <Component {...props} />
      </AppErrorBoundary>
    )
  }
}
