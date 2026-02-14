"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { NeonButton } from "@/components/ui/neon-button"
import { CheckCircle2, Sparkles, ArrowRight, Loader2, LogIn } from "lucide-react"

export default function UpgradeSuccessPage() {
  const { status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [upgradeStatus, setUpgradeStatus] = useState<
    "loading" | "need-login" | "success" | "error" | "no-token"
  >("loading")

  useEffect(() => {
    if (status === "loading") return

    const token = sessionStorage.getItem("upgradeInitiated")
    if (!token) {
      setUpgradeStatus("no-token")
      return
    }

    // User paid but isn't logged in — prompt them to log in
    if (status === "unauthenticated") {
      setUpgradeStatus("need-login")
      return
    }

    // Authenticated + has token — complete the upgrade
    sessionStorage.removeItem("upgradeInitiated")

    fetch("/api/upgrade/complete", { method: "POST" })
      .then(async (res) => {
        if (res.ok || res.status === 409) {
          setUpgradeStatus("success")
          queryClient.invalidateQueries({ queryKey: ["entitlement"] })
        } else {
          setUpgradeStatus("error")
        }
      })
      .catch(() => {
        setUpgradeStatus("error")
      })
  }, [status, queryClient])

  useEffect(() => {
    if (upgradeStatus === "no-token") {
      router.replace("/upgrade")
    }
  }, [upgradeStatus, router])

  if (status === "loading" || upgradeStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center p-4" dir="rtl">
        <div className="text-center">
          <Loader2 className="size-10 text-[#8B5CF6] animate-spin mx-auto mb-4" />
          <p className="text-[#9CA3AF]">מעדכנים את החשבון...</p>
        </div>
      </div>
    )
  }

  if (upgradeStatus === "no-token") return null

  // User paid without being logged in — ask them to log in to activate
  if (upgradeStatus === "need-login") {
    return (
      <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-8 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.08) 100%)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              boxShadow: "0 0 40px rgba(139, 92, 246, 0.15)",
            }}
          >
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-[#8B5CF6]/20 border border-[#8B5CF6]/30">
              <LogIn className="size-8 text-[#8B5CF6]" />
            </div>

            <h2 className="text-2xl font-black text-white mb-3">
              התשלום התקבל!
            </h2>
            <p className="text-[#9CA3AF] mb-6">
              התחברו לחשבון שלכם כדי להפעיל את השדרוג
            </p>

            <NeonButton
              onClick={() => signIn(undefined, { callbackUrl: "/upgrade/success" })}
              className="w-full py-4 text-base"
              rightIcon={<LogIn className="size-4" />}
            >
              התחברו להפעלת השדרוג
            </NeonButton>
          </motion.div>
        </div>
      </div>
    )
  }

  if (upgradeStatus === "error") {
    return (
      <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl p-8 bg-red-500/10 border border-red-500/30">
            <h2 className="text-xl font-bold text-white mb-3">שגיאה בשדרוג</h2>
            <p className="text-[#9CA3AF] mb-6">
              משהו השתבש. אם שילמתם בהצלחה, פנו אלינו ונפעיל את הגישה ידנית.
            </p>
            <NeonButton onClick={() => router.push("/upgrade")} className="w-full">
              חזרה
            </NeonButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-8 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            boxShadow: "0 0 60px rgba(139, 92, 246, 0.2)",
          }}
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-[#10B981]/20 border-2 border-[#10B981]/50"
          >
            <CheckCircle2 className="size-10 text-[#10B981]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 mb-4">
              <Sparkles className="size-4 text-[#8B5CF6]" />
              <span className="text-sm font-medium text-[#8B5CF6]">BASIC</span>
            </div>

            <h1 className="text-3xl font-black text-white mb-3">
              השדרוג בוצע בהצלחה!
            </h1>
            <p className="text-[#9CA3AF] mb-8">
              יש לכם עכשיו גישה מלאה לכל 10 ימי המרתון. בהצלחה!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <NeonButton
              onClick={() => router.push("/dashboard")}
              className="w-full py-4 text-base"
              rightIcon={<ArrowRight className="size-4" />}
            >
              להתחיל ללמוד
            </NeonButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
