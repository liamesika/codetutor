"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Settings,
  Shield,
  Clock,
  Database,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Server,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SystemSettings {
  maintenance: boolean
  signupEnabled: boolean
  executionTimeoutMs: number
  maxDailyAttempts: number
  rateLimitWindow: number
  rateLimitMax: number
  dockerEnabled: boolean
  sentryEnabled: boolean
}

interface SystemHealth {
  database: "healthy" | "degraded" | "down"
  redis: "healthy" | "degraded" | "down"
  docker: "healthy" | "degraded" | "down"
  uptime: number
  version: string
}

export default function AdminSettingsPage() {
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)

  const { data: settings, isLoading: settingsLoading } = useQuery<SystemSettings>({
    queryKey: ["adminSettings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings")
      if (!res.ok) throw new Error("Failed to fetch settings")
      return res.json()
    },
  })

  const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useQuery<SystemHealth>({
    queryKey: ["systemHealth"],
    queryFn: async () => {
      const res = await fetch("/api/admin/health")
      if (!res.ok) throw new Error("Failed to fetch health")
      return res.json()
    },
    refetchInterval: 30000, // Refresh every 30s
  })

  const [formData, setFormData] = useState<SystemSettings>({
    maintenance: false,
    signupEnabled: true,
    executionTimeoutMs: 10000,
    maxDailyAttempts: 100,
    rateLimitWindow: 60000,
    rateLimitMax: 20,
    dockerEnabled: true,
    sentryEnabled: true,
  })

  // Update form when settings load
  useState(() => {
    if (settings) {
      setFormData(settings)
    }
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success("Settings saved")
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] })
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusBadge = (status: "healthy" | "degraded" | "down") => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-green-500 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Healthy
          </Badge>
        )
      case "degraded":
        return (
          <Badge className="bg-yellow-500 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Degraded
          </Badge>
        )
      case "down":
        return (
          <Badge className="bg-red-500 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Down
          </Badge>
        )
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          System Settings
        </h1>
        <p className="text-muted-foreground">
          Configure platform behavior and monitor system health
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Health
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => refetchHealth()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Real-time status of system components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : health ? (
              <>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span>Database (PostgreSQL)</span>
                  </div>
                  {getStatusBadge(health.database)}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span>Redis Cache</span>
                  </div>
                  {getStatusBadge(health.redis)}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span>Docker Sandbox</span>
                  </div>
                  {getStatusBadge(health.docker)}
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Uptime</p>
                    <p className="font-medium">
                      {Math.floor(health.uptime / 3600)}h{" "}
                      {Math.floor((health.uptime % 3600) / 60)}m
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Version</p>
                    <p className="font-medium">{health.version}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Unable to fetch health status
              </p>
            )}
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Platform Settings
            </CardTitle>
            <CardDescription>
              Control access and behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Disable access for non-admin users
                </p>
              </div>
              <Switch
                checked={formData.maintenance}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, maintenance: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Signups</Label>
                <p className="text-sm text-muted-foreground">
                  Enable new user registration
                </p>
              </div>
              <Switch
                checked={formData.signupEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, signupEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Docker Execution</Label>
                <p className="text-sm text-muted-foreground">
                  Use Docker for code execution
                </p>
              </div>
              <Switch
                checked={formData.dockerEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, dockerEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Sentry Error Tracking</Label>
                <p className="text-sm text-muted-foreground">
                  Send errors to Sentry
                </p>
              </div>
              <Switch
                checked={formData.sentryEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, sentryEnabled: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Execution Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Execution Limits
            </CardTitle>
            <CardDescription>
              Configure code execution timeouts and limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Execution Timeout (ms)</Label>
              <Input
                type="number"
                value={formData.executionTimeoutMs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    executionTimeoutMs: parseInt(e.target.value),
                  })
                }
                min={1000}
                max={60000}
              />
              <p className="text-xs text-muted-foreground">
                Maximum time for code execution (1000-60000ms)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Max Daily Attempts per User</Label>
              <Input
                type="number"
                value={formData.maxDailyAttempts}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxDailyAttempts: parseInt(e.target.value),
                  })
                }
                min={10}
                max={1000}
              />
            </div>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Rate Limiting
            </CardTitle>
            <CardDescription>
              Protect the platform from abuse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Window Duration (ms)</Label>
              <Select
                value={formData.rateLimitWindow.toString()}
                onValueChange={(v) =>
                  setFormData({ ...formData, rateLimitWindow: parseInt(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60000">1 minute</SelectItem>
                  <SelectItem value="300000">5 minutes</SelectItem>
                  <SelectItem value="900000">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Max Requests per Window</Label>
              <Input
                type="number"
                value={formData.rateLimitMax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rateLimitMax: parseInt(e.target.value),
                  })
                }
                min={5}
                max={100}
              />
            </div>

            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <p className="text-muted-foreground">
                Current limit: {formData.rateLimitMax} requests per{" "}
                {formData.rateLimitWindow / 60000} minute(s)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
