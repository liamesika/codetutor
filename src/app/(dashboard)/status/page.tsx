"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  Activity,
  Database,
  Server,
  Shield,
  Terminal,
  Wifi,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface HealthCheck {
  name: string
  status: "healthy" | "degraded" | "unhealthy" | "unknown"
  latency?: number
  message?: string
  lastChecked: string
}

interface SystemStatus {
  version: string
  environment: string
  uptime: string
  checks: HealthCheck[]
  overallStatus: "healthy" | "degraded" | "unhealthy"
}

const statusConfig = {
  healthy: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
    label: "Operational",
  },
  degraded: {
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    border: "border-amber-500/30",
    icon: AlertCircle,
    label: "Degraded",
  },
  unhealthy: {
    color: "text-red-400",
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    icon: XCircle,
    label: "Down",
  },
  unknown: {
    color: "text-gray-400",
    bg: "bg-gray-500/20",
    border: "border-gray-500/30",
    icon: AlertCircle,
    label: "Unknown",
  },
}

const serviceIcons: Record<string, typeof Activity> = {
  api: Server,
  database: Database,
  executor: Terminal,
  auth: Shield,
  redis: Wifi,
}

function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
        config.bg,
        config.color
      )}
    >
      <Icon className="size-4" />
      {config.label}
    </div>
  )
}

function HealthCheckCard({ check }: { check: HealthCheck }) {
  const config = statusConfig[check.status]
  const Icon = serviceIcons[check.name.toLowerCase()] || Activity
  const StatusIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-xl border backdrop-blur-sm",
        config.border,
        "bg-[#1E1B4B]/40"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", config.bg)}>
            <Icon className={cn("size-5", config.color)} />
          </div>
          <div>
            <h3 className="font-semibold text-white capitalize">{check.name}</h3>
            {check.latency !== undefined && (
              <p className="text-xs text-[#9CA3AF]">{check.latency}ms latency</p>
            )}
          </div>
        </div>
        <StatusIcon className={cn("size-5", config.color)} />
      </div>
      {check.message && (
        <p className="text-sm text-[#9CA3AF] mb-2">{check.message}</p>
      )}
      <div className="flex items-center gap-1 text-xs text-[#6B7280]">
        <Clock className="size-3" />
        <span>Last checked: {check.lastChecked}</span>
      </div>
    </motion.div>
  )
}

function HealthCheckSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-[#4F46E5]/20 bg-[#1E1B4B]/40">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-lg" />
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="size-5 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export default function StatusPage() {
  const {
    data: status,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<SystemStatus>({
    queryKey: ["system-status"],
    queryFn: async () => {
      const res = await fetch("/api/status")
      if (!res.ok) throw new Error("Failed to fetch status")
      return res.json()
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  })

  const overallConfig = status
    ? statusConfig[status.overallStatus]
    : statusConfig.unknown

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#4F46E5]/20">
                <Activity className="size-6 text-[#818CF8]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">System Status</h1>
                <p className="text-sm sm:text-base text-[#9CA3AF]">
                  Real-time health monitoring
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2 border-[#4F46E5]/30 hover:bg-[#4F46E5]/20 w-full sm:w-auto"
            >
              <RefreshCw
                className={cn("size-4", isFetching && "animate-spin")}
              />
              Refresh
            </Button>
          </div>

          {/* Overall Status Banner */}
          <Card
            className={cn(
              "border-2 backdrop-blur-xl",
              isLoading
                ? "border-[#4F46E5]/30 bg-[#1E1B4B]/60"
                : cn(overallConfig.border, overallConfig.bg)
            )}
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {isLoading ? (
                    <>
                      <Skeleton className="size-12 rounded-full" />
                      <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </>
                  ) : error ? (
                    <>
                      <div className="p-3 rounded-full bg-red-500/20">
                        <XCircle className="size-6 text-red-400" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white">
                          Status Unavailable
                        </h2>
                        <p className="text-sm text-[#9CA3AF]">
                          Unable to fetch system status
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={cn("p-3 rounded-full", overallConfig.bg)}>
                        {(() => {
                          const Icon = overallConfig.icon
                          return (
                            <Icon
                              className={cn("size-6", overallConfig.color)}
                            />
                          )
                        })()}
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white">
                          {status?.overallStatus === "healthy"
                            ? "All Systems Operational"
                            : status?.overallStatus === "degraded"
                              ? "Some Systems Degraded"
                              : "System Issues Detected"}
                        </h2>
                        <p className="text-sm text-[#9CA3AF]">
                          {status?.checks.filter((c) => c.status === "healthy")
                            .length || 0}{" "}
                          of {status?.checks.length || 0} services operational
                        </p>
                      </div>
                    </>
                  )}
                </div>
                {status && <StatusBadge status={status.overallStatus} />}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Info */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <Card className="bg-[#1E1B4B]/60 border-[#4F46E5]/20">
              <CardContent className="p-4">
                <p className="text-xs text-[#9CA3AF] mb-1">Version</p>
                <p className="font-mono text-white">{status.version}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#1E1B4B]/60 border-[#4F46E5]/20">
              <CardContent className="p-4">
                <p className="text-xs text-[#9CA3AF] mb-1">Environment</p>
                <p className="font-mono text-white capitalize">
                  {status.environment}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[#1E1B4B]/60 border-[#4F46E5]/20">
              <CardContent className="p-4">
                <p className="text-xs text-[#9CA3AF] mb-1">Uptime</p>
                <p className="font-mono text-white">{status.uptime}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Health Checks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-[#1E1B4B]/60 border-[#4F46E5]/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="size-5 text-[#818CF8]" />
                Service Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {isLoading ? (
                  <>
                    <HealthCheckSkeleton />
                    <HealthCheckSkeleton />
                    <HealthCheckSkeleton />
                    <HealthCheckSkeleton />
                  </>
                ) : error ? (
                  <div className="col-span-2 text-center py-8">
                    <XCircle className="size-12 text-red-400 mx-auto mb-4" />
                    <p className="text-[#9CA3AF]">
                      Failed to load health checks
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  status?.checks.map((check, index) => (
                    <motion.div
                      key={check.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <HealthCheckCard check={check} />
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-[#6B7280] mt-8"
        >
          Auto-refreshes every 30 seconds
        </motion.p>
      </div>
    </div>
  )
}
