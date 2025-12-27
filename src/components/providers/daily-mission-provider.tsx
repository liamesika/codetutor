"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DailyMissionOverlay, FloatingMissionCard } from "@/components/overlays/daily-mission-overlay"

interface Mission {
  id: string
  missionId: string
  title: string
  description: string
  xpReward: number
  type: string
  targetValue: number
  progress: number
  isPremiumOnly: boolean
  difficulty: string
  completed: boolean
}

interface DailyMissionContextType {
  missions: Mission[]
  isLoading: boolean
  refreshMissions: () => Promise<void>
  updateProgress: (missionId: string, progress: number) => Promise<void>
  showMissionOverlay: () => void
  isPro: boolean
}

const DailyMissionContext = createContext<DailyMissionContextType | null>(null)

export function useDailyMissions() {
  const context = useContext(DailyMissionContext)
  if (!context) {
    throw new Error("useDailyMissions must be used within DailyMissionProvider")
  }
  return context
}

export function DailyMissionProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [floatingVisible, setFloatingVisible] = useState(false)
  const [hasShownThisSession, setHasShownThisSession] = useState(false)

  // Check if we should show the floating card
  const checkSessionDisplay = useCallback(() => {
    if (typeof window === "undefined") return false
    const sessionKey = "codetutor_daily_mission_shown"
    return sessionStorage.getItem(sessionKey) !== "true"
  }, [])

  const markSessionDisplayed = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("codetutor_daily_mission_shown", "true")
    }
    setHasShownThisSession(true)
  }, [])

  const refreshMissions = useCallback(async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/daily-missions")
      if (!res.ok) throw new Error("Failed to fetch missions")

      const data = await res.json()
      setMissions(data.missions || [])
      setIsPro(data.isPro || false)
    } catch (error) {
      console.error("Failed to fetch daily missions:", error)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  // Load missions on auth
  useEffect(() => {
    if (status === "authenticated") {
      refreshMissions()
    }
  }, [status, refreshMissions])

  // Show floating card after delay when authenticated
  useEffect(() => {
    if (status === "authenticated" && missions.length > 0 && checkSessionDisplay() && !hasShownThisSession) {
      // Show floating card after daily login overlay would have closed
      const timer = setTimeout(() => {
        setFloatingVisible(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status, missions.length, checkSessionDisplay, hasShownThisSession])

  const updateProgress = useCallback(async (missionId: string, progress: number) => {
    if (!session?.user?.id) return

    try {
      const res = await fetch("/api/daily-missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId, progress }),
      })

      if (!res.ok) throw new Error("Failed to update progress")

      const data = await res.json()

      // Update local state
      setMissions(prev =>
        prev.map(m =>
          m.missionId === missionId
            ? { ...m, progress: data.progress, completed: data.completed }
            : m
        )
      )

      // If just completed, could trigger celebration
      if (data.completed && data.xpAwarded) {
        // Could integrate with dopamine provider here
        console.log(`Mission completed! +${data.xpAwarded} XP`)
      }
    } catch (error) {
      console.error("Failed to update mission progress:", error)
    }
  }, [session?.user?.id])

  const showMissionOverlay = useCallback(() => {
    setOverlayOpen(true)
    setFloatingVisible(false)
  }, [])

  const handleCloseOverlay = useCallback(() => {
    setOverlayOpen(false)
    markSessionDisplayed()
  }, [markSessionDisplayed])

  const handleDismissFloating = useCallback(() => {
    setFloatingVisible(false)
    markSessionDisplayed()
  }, [markSessionDisplayed])

  const handleExpandFloating = useCallback(() => {
    setFloatingVisible(false)
    setOverlayOpen(true)
  }, [])

  const handleStartMission = useCallback((missionId: string) => {
    // Navigate to practice or learn page based on mission type
    const mission = missions.find(m => m.missionId === missionId)
    if (!mission) return

    // Close overlay
    setOverlayOpen(false)
    markSessionDisplayed()

    // Navigate based on mission type
    if (mission.type === "SOLVE" || mission.type === "PERFECT" || mission.type === "ACCURACY") {
      router.push("/practice")
    } else if (mission.type === "REVIEW") {
      router.push("/learn")
    } else {
      router.push("/practice")
    }
  }, [missions, router, markSessionDisplayed])

  const handleUpgrade = useCallback(() => {
    setOverlayOpen(false)
    router.push("/pricing")
  }, [router])

  return (
    <DailyMissionContext.Provider
      value={{
        missions,
        isLoading,
        refreshMissions,
        updateProgress,
        showMissionOverlay,
        isPro,
      }}
    >
      {children}

      {/* Daily Mission Overlay */}
      <DailyMissionOverlay
        isOpen={overlayOpen}
        missions={missions}
        isPro={isPro}
        onClose={handleCloseOverlay}
        onStartMission={handleStartMission}
        onUpgrade={handleUpgrade}
      />

      {/* Floating Card */}
      {floatingVisible && (
        <FloatingMissionCard
          missions={missions}
          isPro={isPro}
          onExpand={handleExpandFloating}
          onDismiss={handleDismissFloating}
        />
      )}
    </DailyMissionContext.Provider>
  )
}
