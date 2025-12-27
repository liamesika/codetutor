"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { DashboardShell } from "@/components/layout"
import { useCourses, useUserStats } from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Settings,
  User,
  Bell,
  Moon,
  Sun,
  Palette,
  Shield,
  LogOut,
  Save,
  RefreshCw,
  Mail,
  Sparkles,
} from "lucide-react"
import { useTheme } from "next-themes"

interface UserSettings {
  name: string
  email: string
  notifications: {
    dailyChallenge: boolean
    weeklyProgress: boolean
    achievements: boolean
  }
  preferences: {
    codeEditorTheme: string
    fontSize: number
  }
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
      <div className="flex-1">
        <Label className="text-white font-medium">{label}</Label>
        {description && (
          <p className="text-sm text-[#9CA3AF] mt-1">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: courses } = useCourses()
  const { data: userStats } = useUserStats()
  const { theme, setTheme } = useTheme()

  const [name, setName] = useState("")
  const [notifications, setNotifications] = useState({
    dailyChallenge: true,
    weeklyProgress: true,
    achievements: true,
  })

  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useQuery<UserSettings>({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings")
      if (!res.ok) {
        if (res.status === 404) {
          // Return defaults
          return {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            notifications: {
              dailyChallenge: true,
              weeklyProgress: true,
              achievements: true,
            },
            preferences: {
              codeEditorTheme: "vs-dark",
              fontSize: 14,
            },
          }
        }
        throw new Error("Failed to load settings")
      }
      return res.json()
    },
    enabled: !!session,
  })

  useEffect(() => {
    if (settings) {
      setName(settings.name)
      setNotifications(settings.notifications)
    }
  }, [settings])

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<UserSettings>) => {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to save settings")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Settings saved successfully")
      queryClient.invalidateQueries({ queryKey: ["user-settings"] })
    },
    onError: () => {
      toast.error("Failed to save settings")
    },
  })

  const handleSave = () => {
    saveMutation.mutate({
      name,
      notifications,
    })
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading" || status === "unauthenticated") {
    return null
  }

  const activeCourse = courses?.find((c) => c.isEnrolled && !c.isLocked)
  const weeks = activeCourse?.weeks || []

  return (
    <DashboardShell
      weeks={weeks}
      currentCourse={activeCourse?.name}
      userStats={
        userStats
          ? { streak: userStats.streak, totalPoints: userStats.totalPoints }
          : undefined
      }
    >
      <div className="min-h-screen bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26]">
        <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#4F46E5]/20 to-[#22D3EE]/20 border border-[#4F46E5]/30">
                <Settings className="size-6 text-[#22D3EE]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  Settings
                  <Sparkles className="size-5 text-[#22D3EE] animate-pulse" />
                </h1>
                <p className="text-[#9CA3AF] text-sm">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </motion.div>

          {/* Error state */}
          {error && (
            <Card className="bg-red-500/10 border-red-500/30 mb-6">
              <CardContent className="flex items-center justify-between p-4">
                <p className="text-red-400">Failed to load settings</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="gap-2"
                >
                  <RefreshCw className="size-4" />
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <SettingsSkeleton />
          ) : (
            <div className="space-y-6">
              {/* Profile Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-[#1E1B4B]/50 border-[#4F46E5]/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="size-5 text-[#4F46E5]" />
                      Profile
                    </CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-[#9CA3AF]">
                        Display Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 bg-[#0F0E26]/50 border-[#4F46E5]/30 text-white"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-[#9CA3AF]">
                        Email
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="email"
                          value={settings?.email || session?.user?.email || ""}
                          disabled
                          className="bg-[#0F0E26]/50 border-[#4F46E5]/30 text-[#6B7280]"
                        />
                        <Mail className="size-5 text-[#6B7280]" />
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Appearance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-[#1E1B4B]/50 border-[#4F46E5]/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Palette className="size-5 text-[#22D3EE]" />
                      Appearance
                    </CardTitle>
                    <CardDescription>
                      Customize how CodeTutor looks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SettingRow
                      label="Theme"
                      description="Choose between light and dark mode"
                    >
                      <div className="flex items-center gap-2 p-1 bg-[#0F0E26]/50 rounded-lg border border-[#4F46E5]/30">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTheme("light")}
                          className={cn(
                            "gap-2",
                            theme === "light" && "bg-[#4F46E5] text-white"
                          )}
                        >
                          <Sun className="size-4" />
                          Light
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTheme("dark")}
                          className={cn(
                            "gap-2",
                            theme === "dark" && "bg-[#4F46E5] text-white"
                          )}
                        >
                          <Moon className="size-4" />
                          Dark
                        </Button>
                      </div>
                    </SettingRow>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-[#1E1B4B]/50 border-[#4F46E5]/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bell className="size-5 text-[#F59E0B]" />
                      Notifications
                    </CardTitle>
                    <CardDescription>
                      Configure your notification preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="divide-y divide-[#4F46E5]/10">
                    <SettingRow
                      label="Daily Challenge Reminders"
                      description="Get notified about new daily challenges"
                    >
                      <Switch
                        checked={notifications.dailyChallenge}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            dailyChallenge: checked,
                          }))
                        }
                      />
                    </SettingRow>
                    <SettingRow
                      label="Weekly Progress Reports"
                      description="Receive weekly summaries of your progress"
                    >
                      <Switch
                        checked={notifications.weeklyProgress}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            weeklyProgress: checked,
                          }))
                        }
                      />
                    </SettingRow>
                    <SettingRow
                      label="Achievement Notifications"
                      description="Get notified when you unlock achievements"
                    >
                      <Switch
                        checked={notifications.achievements}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            achievements: checked,
                          }))
                        }
                      />
                    </SettingRow>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Account Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-[#1E1B4B]/50 border-[#4F46E5]/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="size-5 text-[#10B981]" />
                      Account
                    </CardTitle>
                    <CardDescription>
                      Manage your account settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                      <Button
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="gap-2 bg-[#4F46E5] hover:bg-[#4F46E5]/80"
                      >
                        {saveMutation.isPending ? (
                          <RefreshCw className="size-4 animate-spin" />
                        ) : (
                          <Save className="size-4" />
                        )}
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <LogOut className="size-4" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
