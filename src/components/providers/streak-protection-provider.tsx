"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { StreakProtectionOverlay } from "@/components/overlays/streak-protection-overlay"
import { toast } from "sonner"

interface StreakData {
  streakAtRisk: boolean
  currentStreak: number
  hoursRemaining: number
  minutesRemaining: number
}

interface StreakProtectionContextType {
  streakData: StreakData | null
  isLoading: boolean
  checkStreakStatus: () => Promise<void>
  showProtectionOverlay: () => void
  hasShield: boolean
  isPro: boolean
}

const StreakProtectionContext = createContext<StreakProtectionContextType | null>(null)

export function useStreakProtection() {
  const context = useContext(StreakProtectionContext)
  if (!context) {
    throw new Error("useStreakProtection must be used within StreakProtectionProvider")
  }
  return context
}

export function StreakProtectionProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [hasShield, setHasShield] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [hasShownThisSession, setHasShownThisSession] = useState(false)

  // Check if we've shown the overlay this session
  const checkSessionDisplay = useCallback(() => {
    if (typeof window === "undefined") return false
    const sessionKey = "codetutor_streak_warning_shown"
    return sessionStorage.getItem(sessionKey) !== "true"
  }, [])

  const markSessionDisplayed = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("codetutor_streak_warning_shown", "true")
    }
    setHasShownThisSession(true)
  }, [])

  const checkStreakStatus = useCallback(async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      // Check activity status
      const activityRes = await fetch("/api/activity")
      if (!activityRes.ok) throw new Error("Failed to fetch activity")
      const activityData = await activityRes.json()

      // Check pro profile for shield
      const proRes = await fetch("/api/pro-profile")
      if (proRes.ok) {
        const proData = await proRes.json()
        setIsPro(proData.isPro)
        setHasShield(!proData.shieldUsedThisMonth)
      }

      const streakInfo: StreakData = {
        streakAtRisk: activityData.streakAtRisk,
        currentStreak: activityData.currentStreak,
        hoursRemaining: activityData.streakCountdown?.hoursRemaining || 0,
        minutesRemaining: activityData.streakCountdown?.minutesRemaining || 0,
      }

      setStreakData(streakInfo)
    } catch (error) {
      console.error("Failed to check streak status:", error)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  // Check on mount
  useEffect(() => {
    if (status === "authenticated") {
      checkStreakStatus()
    }
  }, [status, checkStreakStatus])

  // Auto-show overlay when streak is at risk
  useEffect(() => {
    if (
      streakData?.streakAtRisk &&
      streakData.currentStreak > 0 &&
      checkSessionDisplay() &&
      !hasShownThisSession
    ) {
      // Delay to not conflict with daily login/mission overlays
      const timer = setTimeout(() => {
        setOverlayOpen(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [streakData, checkSessionDisplay, hasShownThisSession])

  const showProtectionOverlay = useCallback(() => {
    setOverlayOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOverlayOpen(false)
    markSessionDisplayed()
  }, [markSessionDisplayed])

  const handleStartPractice = useCallback(() => {
    setOverlayOpen(false)
    markSessionDisplayed()
    router.push("/practice")
  }, [router, markSessionDisplayed])

  const handleUseShield = useCallback(async () => {
    try {
      const res = await fetch("/api/pro-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "use-shield" }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Failed to use shield")
        return
      }

      const data = await res.json()
      setHasShield(false)
      setOverlayOpen(false)
      markSessionDisplayed()

      toast.success("🛡️ Streak Shield Activated!", {
        description: "Your streak is protected for 24 hours",
      })
    } catch (error) {
      console.error("Failed to use shield:", error)
      toast.error("Failed to use shield")
    }
  }, [markSessionDisplayed])

  const handleUpgrade = useCallback(() => {
    setOverlayOpen(false)
    router.push("/upgrade")
  }, [router])

  return (
    <StreakProtectionContext.Provider
      value={{
        streakData,
        isLoading,
        checkStreakStatus,
        showProtectionOverlay,
        hasShield,
        isPro,
      }}
    >
      {children}

      {streakData && (
        <StreakProtectionOverlay
          isOpen={overlayOpen}
          currentStreak={streakData.currentStreak}
          hoursRemaining={streakData.hoursRemaining}
          minutesRemaining={streakData.minutesRemaining}
          hasShield={hasShield}
          isPro={isPro}
          onClose={handleClose}
          onStartPractice={handleStartPractice}
          onUseShield={handleUseShield}
          onUpgrade={handleUpgrade}
        />
      )}
    </StreakProtectionContext.Provider>
  )
}
