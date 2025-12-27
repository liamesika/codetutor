"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DropOffRecoveryOverlay } from "@/components/overlays/drop-off-recovery-overlay"
import { toast } from "sonner"

interface ResumeQuestion {
  id: string
  title: string
  topicTitle: string
  weekNumber: number
  savedAt: string
}

interface ActivityData {
  inactivityStatus: "active" | "returning_soon" | "returning" | "long_absence"
  hoursInactive: number
  daysInactive: number
  bonusXpAvailable: number
  resumeQuestion: ResumeQuestion | null
}

interface DropOffRecoveryContextType {
  activityData: ActivityData | null
  isLoading: boolean
  checkActivity: () => Promise<void>
  showRecoveryOverlay: () => void
}

const DropOffRecoveryContext = createContext<DropOffRecoveryContextType | null>(null)

export function useDropOffRecovery() {
  const context = useContext(DropOffRecoveryContext)
  if (!context) {
    throw new Error("useDropOffRecovery must be used within DropOffRecoveryProvider")
  }
  return context
}

export function DropOffRecoveryProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activityData, setActivityData] = useState<ActivityData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [hasShownThisSession, setHasShownThisSession] = useState(false)

  // Check if we've shown the overlay this session
  const checkSessionDisplay = useCallback(() => {
    if (typeof window === "undefined") return false
    const sessionKey = "codetutor_recovery_shown"
    return sessionStorage.getItem(sessionKey) !== "true"
  }, [])

  const markSessionDisplayed = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("codetutor_recovery_shown", "true")
    }
    setHasShownThisSession(true)
  }, [])

  const checkActivity = useCallback(async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/activity")
      if (!res.ok) throw new Error("Failed to fetch activity")

      const data = await res.json()
      setActivityData(data)
    } catch (error) {
      console.error("Failed to check activity:", error)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  // Check on mount
  useEffect(() => {
    if (status === "authenticated") {
      checkActivity()
    }
  }, [status, checkActivity])

  // Auto-show overlay for returning users
  useEffect(() => {
    if (
      activityData &&
      activityData.inactivityStatus !== "active" &&
      (activityData.bonusXpAvailable > 0 || activityData.resumeQuestion) &&
      checkSessionDisplay() &&
      !hasShownThisSession
    ) {
      // Delay to not conflict with other overlays
      const timer = setTimeout(() => {
        setOverlayOpen(true)
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [activityData, checkSessionDisplay, hasShownThisSession])

  const showRecoveryOverlay = useCallback(() => {
    setOverlayOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOverlayOpen(false)
    markSessionDisplayed()
  }, [markSessionDisplayed])

  const handleResume = useCallback(() => {
    if (!activityData?.resumeQuestion) return

    setOverlayOpen(false)
    markSessionDisplayed()

    // Navigate to the question
    router.push(`/practice?question=${activityData.resumeQuestion.id}`)
  }, [activityData, router, markSessionDisplayed])

  const handleClaimBonus = useCallback(async () => {
    try {
      const res = await fetch("/api/activity", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "claim-return-bonus" }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Failed to claim bonus")
        return
      }

      const data = await res.json()

      toast.success(`🎉 ${data.message}`, {
        description: `You earned +${data.bonusXp} XP for coming back!`,
      })

      // Update local state
      setActivityData(prev => prev ? {
        ...prev,
        bonusXpAvailable: 0,
      } : null)

      // If there's a resume question, keep overlay open
      // Otherwise close it
      if (!activityData?.resumeQuestion) {
        setOverlayOpen(false)
        markSessionDisplayed()
      }
    } catch (error) {
      console.error("Failed to claim bonus:", error)
      toast.error("Failed to claim bonus")
    }
  }, [activityData, markSessionDisplayed])

  const handleStartFresh = useCallback(() => {
    setOverlayOpen(false)
    markSessionDisplayed()
    router.push("/practice")
  }, [router, markSessionDisplayed])

  return (
    <DropOffRecoveryContext.Provider
      value={{
        activityData,
        isLoading,
        checkActivity,
        showRecoveryOverlay,
      }}
    >
      {children}

      {activityData && activityData.inactivityStatus !== "active" && (
        <DropOffRecoveryOverlay
          isOpen={overlayOpen}
          inactivityStatus={activityData.inactivityStatus as "returning_soon" | "returning" | "long_absence"}
          daysInactive={activityData.daysInactive}
          bonusXpAvailable={activityData.bonusXpAvailable}
          resumeQuestion={activityData.resumeQuestion}
          onClose={handleClose}
          onResume={handleResume}
          onClaimBonus={handleClaimBonus}
          onStartFresh={handleStartFresh}
        />
      )}
    </DropOffRecoveryContext.Provider>
  )
}
