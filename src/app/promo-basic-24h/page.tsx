"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Check, Clock, Shield, Zap, BookOpen, Code2, Brain } from "lucide-react"

const PAYPLUS_URL =
  "https://payments.payplus.co.il/l/8d987218-3909-4cb7-8c87-15454024521d"

const PROMO_END = new Date("2026-02-15T19:00:00+02:00")

const FEATURES = [
  { icon: BookOpen, text: "גישה מלאה לכל 10 הימים" },
  { icon: Code2, text: "כל התרגילים והאתגרים" },
  { icon: Brain, text: "סיכומי תיאוריה מלאים" },
  { icon: Zap, text: "הרצת קוד ישירות באתר" },
]

function useCountdown(endDate: Date) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const diff = Math.max(0, endDate.getTime() - now)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { hours, minutes, seconds, expired: diff <= 0 }
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
        <span className="text-2xl font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] text-[#6B7280] mt-1">{label}</span>
    </div>
  )
}

export default function PromoBasic24hPage() {
  const { status } = useSession()
  const router = useRouter()
  const { hours, minutes, seconds, expired } = useCountdown(PROMO_END)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/promo-basic-24h/login")
    }
  }, [status, router])

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center">
        <div className="size-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center px-4 py-10" dir="rtl">
      <div className="w-full max-w-sm">

        {/* Urgency badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-5"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30">
            <Clock className="size-3.5 text-[#EF4444]" />
            <span className="text-xs font-semibold text-[#EF4444]">מבצע 24 שעות בלבד</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center mb-5"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
            מבצע מיוחד{" "}
            <span className="text-[#8B5CF6]">ל-24 שעות</span>
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            שדרגו לחבילת BASIC וקבלו גישה מלאה למרתון
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-5"
        >
          {!expired ? (
            <div className="rounded-xl p-3.5 bg-[#EF4444]/8 border border-[#EF4444]/20 text-center">
              <p className="text-[10px] font-semibold text-[#EF4444] mb-2 tracking-wide uppercase">
                המבצע נגמר בעוד
              </p>
              <div className="flex items-center justify-center gap-1.5" dir="ltr">
                <TimeBlock value={hours} label="שעות" />
                <span className="text-lg font-bold text-[#EF4444]/40 mt-[-14px]">:</span>
                <TimeBlock value={minutes} label="דקות" />
                <span className="text-lg font-bold text-[#EF4444]/40 mt-[-14px]">:</span>
                <TimeBlock value={seconds} label="שניות" />
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-4 bg-[#6B7280]/10 border border-[#6B7280]/20 text-center">
              <p className="text-sm font-semibold text-[#6B7280]">המבצע הסתיים</p>
            </div>
          )}
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.05) 100%)",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow: "0 0 40px rgba(139,92,246,0.08)",
          }}
        >
          {/* Price */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-base text-[#6B7280] line-through">₪79</span>
              <span className="text-5xl font-black text-white">₪39</span>
            </div>
            <p className="text-xs text-[#F59E0B] font-semibold mt-1.5">50% הנחה — תשלום חד פעמי</p>
          </div>

          {/* Features */}
          <ul className="space-y-2.5 mb-6">
            {FEATURES.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.04 }}
                className="flex items-center gap-2.5 text-[13px] text-[#D1D5DB]"
              >
                <div className="size-5 rounded-full flex items-center justify-center flex-shrink-0 bg-[#8B5CF6]/15">
                  <Check className="size-2.5 text-[#8B5CF6]" />
                </div>
                {f.text}
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          {!expired ? (
            <a
              href={PAYPLUS_URL}
              className="block w-full py-3.5 rounded-xl text-center text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors shadow-[0_0_24px_rgba(139,92,246,0.35)]"
            >
              לרכישה ב-₪39
            </a>
          ) : (
            <button
              disabled
              className="block w-full py-3.5 rounded-xl text-center text-sm font-semibold text-[#6B7280] bg-[#1F2937] cursor-not-allowed"
            >
              המבצע הסתיים
            </button>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-1.5 mt-5 text-[11px] text-[#6B7280]"
        >
          <Shield className="size-3" />
          <span>תשלום מאובטח דרך PayPlus</span>
        </motion.div>

      </div>
    </div>
  )
}
