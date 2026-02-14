"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

export default function PromoSuccessPage() {
  const { status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.replace("/promo-basic-24h/login")
      return
    }

    fetch("/api/upgrade/complete", { method: "POST" })
      .then(async (res) => {
        if (res.ok || res.status === 409) {
          queryClient.invalidateQueries({ queryKey: ["entitlement"] })
          router.replace("/dashboard")
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
  }, [status, router, queryClient])

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center px-4" dir="rtl">
        <div className="w-full max-w-sm rounded-2xl p-6 bg-red-500/10 border border-red-500/30 text-center">
          <p className="text-sm font-semibold text-white mb-2">שגיאה בשדרוג</p>
          <p className="text-xs text-[#9CA3AF] mb-4">
            אם שילמתם בהצלחה, פנו אלינו ונפעיל את הגישה ידנית.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors"
          >
            לדשבורד
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <Loader2 className="size-8 text-[#8B5CF6] animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#9CA3AF]">משדרגים את החשבון...</p>
      </div>
    </div>
  )
}
