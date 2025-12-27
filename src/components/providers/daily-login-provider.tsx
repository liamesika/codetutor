"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { DailyLoginOverlay } from "@/components/overlays/daily-login-overlay"

interface DailyLoginResult {
  isNewDay: boolean
  streak: number
  streakReset: boolean
  bonusXp: number
  bonusType: string
  previousStreak: number
}

interface DailyLoginContextType {
  checkDailyLogin: () => Promise<void>
  streak: number
  hasChecked: boolean
}

const DailyLoginContext = createContext<DailyLoginContextType | null>(null)

export function useDailyLogin() {
  const context = useContext(DailyLoginContext)
  if (!context) {
    throw new Error("useDailyLogin must be used within DailyLoginProvider")
  }
  return context
}

export function DailyLoginProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [hasChecked, setHasChecked] = useState(false)
  const [streak, setStreak] = useState(0)
  const [overlayData, setOverlayData] = useState<{
    isOpen: boolean
    streak: number
    bonusXp: number
    streakReset: boolean
    previousStreak: number
  }>({
    isOpen: false,
    streak: 0,
    bonusXp: 0,
    streakReset: false,
    previousStreak: 0,
  })

  const checkDailyLogin = useCallback(async () => {
    if (!session?.user?.id || hasChecked) return

    // Check session storage first
    const sessionKey = "codetutor_daily_login_checked"
    if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey) === "true") {
      setHasChecked(true)
      return
    }

    try {
      const res = await fetch("/api/daily-login", { method: "POST" })
      if (!res.ok) return

      const data: DailyLoginResult = await res.json()
      setStreak(data.streak)
      setHasChecked(true)

      // Mark as checked in session
      if (typeof window !== "undefined") {
        sessionStorage.setItem(sessionKey, "true")
      }

      // Only show overlay if it's a new day
      if (data.isNewDay) {
        setOverlayData({
          isOpen: true,
          streak: data.streak,
          bonusXp: data.bonusXp,
          streakReset: data.streakReset,
          previousStreak: data.previousStreak,
        })
      }
    } catch (error) {
      console.error("Daily login check failed:", error)
    }
  }, [session?.user?.id, hasChecked])

  // Auto-check on mount when authenticated
  useEffect(() => {
    if (status === "authenticated" && !hasChecked) {
      // Small delay to let the app settle
      const timer = setTimeout(() => {
        checkDailyLogin()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [status, hasChecked, checkDailyLogin])

  const closeOverlay = useCallback(() => {
    setOverlayData(prev => ({ ...prev, isOpen: false }))
  }, [])

  return (
    <DailyLoginContext.Provider value={{ checkDailyLogin, streak, hasChecked }}>
      {children}
      <DailyLoginOverlay
        isOpen={overlayData.isOpen}
        streak={overlayData.streak}
        bonusXp={overlayData.bonusXp}
        streakReset={overlayData.streakReset}
        previousStreak={overlayData.previousStreak}
        onClose={closeOverlay}
      />
    </DailyLoginContext.Provider>
  )
}
