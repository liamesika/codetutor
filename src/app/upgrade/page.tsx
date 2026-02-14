"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { NeonButton } from "@/components/ui/neon-button"
import {
  Check,
  Crown,
  BookOpen,
  Code2,
  Brain,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  LogIn,
} from "lucide-react"

const PAYPLUS_URL =
  "https://payments.payplus.co.il/l/8d987218-3909-4cb7-8c87-15454024521d"

// Set the promo end time (change this when sending a new campaign)
const PROMO_END = new Date("2026-02-15T23:59:59+02:00")

const BASIC_FEATURES = [
  { icon: BookOpen, text: "גישה מלאה לכל 10 הימים" },
  { icon: Code2, text: "כל התרגילים והאתגרים" },
  { icon: Brain, text: "סיכומי תיאוריה מלאים" },
  { icon: Zap, text: "הרצת קוד ישירות באתר" },
]

function useCountdown(endDate: Date) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = endDate.getTime() - Date.now()
    return Math.max(0, diff)
  })

  useEffect(() => {
    if (timeLeft <= 0) return
    const interval = setInterval(() => {
      const diff = endDate.getTime() - Date.now()
      setTimeLeft(Math.max(0, diff))
    }, 1000)
    return () => clearInterval(interval)
  }, [endDate, timeLeft])

  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
  const expired = timeLeft <= 0

  return { hours, minutes, seconds, expired }
}

interface EntitlementData {
  entitlement: {
    plan: string | null
    hasAccess: boolean
  }
}

export default function UpgradePage() {
  const { status } = useSession()
  const router = useRouter()
  const isAuthenticated = status === "authenticated"
  const { hours, minutes, seconds, expired } = useCountdown(PROMO_END)

  const { data } = useQuery<EntitlementData>({
    queryKey: ["entitlement"],
    queryFn: async () => {
      const res = await fetch("/api/entitlement")
      if (!res.ok) throw new Error("Failed to fetch entitlement")
      return res.json()
    },
    enabled: isAuthenticated,
  })

  const plan = data?.entitlement.plan
  const alreadyUpgraded = plan === "BASIC" || plan === "PRO"

  useEffect(() => {
    if (alreadyUpgraded) {
      router.replace("/dashboard")
    }
  }, [alreadyUpgraded, router])

  const handlePay = () => {
    sessionStorage.setItem("upgradeInitiated", Date.now().toString())
    window.location.href = PAYPLUS_URL
  }

  const handleLogin = () => {
    signIn(undefined, { callbackUrl: "/upgrade" })
  }

  if (alreadyUpgraded) return null

  return (
    <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Promo Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F59E0B]/20 to-[#EF4444]/20 border border-[#F59E0B]/40">
            <Clock className="size-4 text-[#F59E0B]" />
            <span className="text-sm font-bold text-[#F59E0B]">מבצע מוגבל בזמן</span>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            שדרגו ל-BASIC
          </h1>
          <p className="text-[#9CA3AF]">
            גישה מלאה לכל תכני המרתון — 10 ימים של תרגול אינטנסיבי
          </p>
        </motion.div>

        {/* Countdown Timer */}
        {!expired && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="rounded-xl p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 text-center">
              <p className="text-xs text-[#EF4444] font-medium mb-2">המבצע נגמר בעוד</p>
              <div className="flex items-center justify-center gap-3" dir="ltr">
                <TimeUnit value={hours} label="שעות" />
                <span className="text-2xl font-bold text-[#EF4444]">:</span>
                <TimeUnit value={minutes} label="דקות" />
                <span className="text-2xl font-bold text-[#EF4444]">:</span>
                <TimeUnit value={seconds} label="שניות" />
              </div>
            </div>
          </motion.div>
        )}

        {expired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 rounded-xl p-4 bg-[#6B7280]/10 border border-[#6B7280]/30 text-center"
          >
            <p className="text-sm text-[#9CA3AF]">המבצע הסתיים</p>
          </motion.div>
        )}

        {/* Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.08) 100%)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.15)",
          }}
        >
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]">
              BASIC
            </div>
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center bg-[#8B5CF6]/20 border border-[#8B5CF6]/30">
            <Crown className="size-8 text-[#8B5CF6]" />
          </div>

          {/* Price */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-lg text-[#6B7280] line-through">₪79</span>
              <span className="text-5xl font-black text-white">₪39</span>
            </div>
            <p className="text-sm text-[#F59E0B] font-medium mt-1">50% הנחה — תשלום חד פעמי</p>
          </div>

          {/* Features */}
          <ul className="space-y-4 mb-8">
            {BASIC_FEATURES.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center gap-3 text-sm text-[#E5E7EB]"
              >
                <div className="size-6 rounded-full flex items-center justify-center flex-shrink-0 bg-[#8B5CF6]/20">
                  <Check className="size-3 text-[#8B5CF6]" />
                </div>
                {feature.text}
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          {!expired && (
            <div className="space-y-3">
              {isAuthenticated ? (
                <NeonButton
                  onClick={handlePay}
                  className="w-full py-4 text-base"
                  rightIcon={<ArrowRight className="size-4" />}
                >
                  לתשלום ושדרוג — ₪39
                </NeonButton>
              ) : (
                <>
                  <NeonButton
                    onClick={handleLogin}
                    className="w-full py-4 text-base"
                    rightIcon={<LogIn className="size-4" />}
                  >
                    התחברו לחשבון ושדרגו
                  </NeonButton>
                  <button
                    onClick={handlePay}
                    className="w-full py-3 rounded-xl text-sm font-medium text-[#9CA3AF] bg-[#1F2937]/50 border border-[#374151]/50 hover:bg-[#374151]/50 hover:border-[#4B5563]/50 transition-all"
                  >
                    לתשלום ישיר (התחברו אח״כ)
                  </button>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 space-y-3"
        >
          <p className="text-sm text-[#6B7280]">
            כרגע יש לכם גישה חינמית ליום 1 בלבד
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-[#6B7280]">
            <Shield className="size-3.5" />
            <span>תשלום מאובטח דרך PayPlus</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-black text-white tabular-nums min-w-[48px]">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-[#9CA3AF]">{label}</span>
    </div>
  )
}
