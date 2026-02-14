"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
      <div className="w-[72px] h-[72px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
        <span className="text-3xl font-black text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[11px] text-[#9CA3AF] mt-1.5">{label}</span>
    </div>
  )
}

export default function PromoBasic24hPage() {
  const { hours, minutes, seconds, expired } = useCountdown(PROMO_END)

  return (
    <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center px-4 py-12" dir="rtl">
      <div className="w-full max-w-md">

        {/* Urgency badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/40">
            <Clock className="size-4 text-[#EF4444]" />
            <span className="text-sm font-bold text-[#EF4444]">מבצע 24 שעות בלבד</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">
            מבצע מיוחד
            <br />
            <span className="text-[#8B5CF6]">ל-24 שעות</span>
          </h1>
          <p className="text-[#9CA3AF] text-lg">
            שדרגו לחבילת BASIC וקבלו גישה מלאה למרתון
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {!expired ? (
            <div className="rounded-2xl p-5 bg-[#EF4444]/8 border border-[#EF4444]/25 text-center">
              <p className="text-xs font-semibold text-[#EF4444] mb-3 tracking-wide">
                המבצע נגמר בעוד
              </p>
              <div className="flex items-center justify-center gap-2" dir="ltr">
                <TimeBlock value={hours} label="שעות" />
                <span className="text-2xl font-bold text-[#EF4444]/60 mt-[-18px]">:</span>
                <TimeBlock value={minutes} label="דקות" />
                <span className="text-2xl font-bold text-[#EF4444]/60 mt-[-18px]">:</span>
                <TimeBlock value={seconds} label="שניות" />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-6 bg-[#6B7280]/10 border border-[#6B7280]/25 text-center">
              <p className="text-lg font-bold text-[#9CA3AF]">המבצע הסתיים</p>
            </div>
          )}
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 100%)",
            border: "1px solid rgba(139,92,246,0.25)",
            boxShadow: "0 0 50px rgba(139,92,246,0.12)",
          }}
        >
          {/* Price */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-xl text-[#6B7280] line-through">₪79</span>
              <span className="text-6xl font-black text-white">₪39</span>
            </div>
            <p className="text-sm text-[#F59E0B] font-semibold mt-2">50% הנחה — תשלום חד פעמי</p>
          </div>

          {/* Features */}
          <ul className="space-y-3.5 mb-8">
            {FEATURES.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center gap-3 text-[15px] text-[#E5E7EB]"
              >
                <div className="size-6 rounded-full flex items-center justify-center flex-shrink-0 bg-[#8B5CF6]/20">
                  <Check className="size-3 text-[#8B5CF6]" />
                </div>
                {f.text}
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          {!expired ? (
            <a
              href={PAYPLUS_URL}
              className="block w-full py-4 rounded-xl text-center text-lg font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors shadow-[0_0_30px_rgba(139,92,246,0.4)]"
            >
              לרכישה ב-₪39
            </a>
          ) : (
            <button
              disabled
              className="block w-full py-4 rounded-xl text-center text-lg font-bold text-[#6B7280] bg-[#1F2937] cursor-not-allowed"
            >
              המבצע הסתיים
            </button>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-6 text-xs text-[#6B7280]"
        >
          <Shield className="size-3.5" />
          <span>תשלום מאובטח דרך PayPlus</span>
        </motion.div>

      </div>
    </div>
  )
}
