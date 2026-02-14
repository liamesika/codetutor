"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Clock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react"

const PROMO_END = new Date("2026-02-15T19:00:00+02:00")

const loginSchema = z.object({
  email: z.string().email("נא להזין כתובת אימייל תקינה"),
  password: z.string().min(1, "נא להזין סיסמה"),
})

type LoginForm = z.infer<typeof loginSchema>

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

function MiniTimer({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    <span className="tabular-nums font-bold text-[#EF4444]">
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  )
}

export default function PromoLoginPage() {
  const { status } = useSession()
  const router = useRouter()
  const { hours, minutes, seconds, expired } = useCountdown(PROMO_END)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/promo-basic-24h")
    }
  }, [status, router])

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("אימייל או סיסמה שגויים. נסו שוב.")
        setIsLoading(false)
        return
      }

      router.push("/promo-basic-24h")
      router.refresh()
    } catch {
      setError("משהו השתבש. נסו שוב.")
      setIsLoading(false)
    }
  }

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center">
        <div className="size-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center px-4 py-10" dir="rtl">
      <div className="w-full max-w-sm">

        {/* Promo header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30 mb-4">
            <Clock className="size-3.5 text-[#EF4444]" />
            <span className="text-xs font-semibold text-[#EF4444]">מבצע 24 שעות בלבד</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1.5">
            שדרגו ל-BASIC ב-
            <span className="text-[#8B5CF6]">₪39</span>
            <span className="text-sm text-[#6B7280] line-through mr-1.5">₪79</span>
          </h1>

          {!expired && (
            <div className="flex items-center justify-center gap-1.5 text-sm text-[#9CA3AF]">
              <span>נגמר בעוד</span>
              <MiniTimer hours={hours} minutes={minutes} seconds={seconds} />
            </div>
          )}

          {expired && (
            <p className="text-sm text-[#6B7280]">המבצע הסתיים</p>
          )}
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-[#0F0F23]/80 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(79,70,229,0.08)]"
        >
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white mb-1">התחברו לחשבון</h2>
            <p className="text-xs text-[#9CA3AF]">כדי לממש את המבצע, התחברו קודם</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/25 flex items-start gap-2"
            >
              <AlertCircle className="size-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-[#E5E7EB]">
                אימייל
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
                {...register("email")}
                aria-invalid={!!errors.email}
                className="h-11 bg-[#1F1F3A] border-white/10 text-white placeholder:text-[#6B7280] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
                dir="ltr"
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-[#E5E7EB]">
                סיסמה
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="הזינו סיסמה"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  className="h-11 bg-[#1F1F3A] border-white/10 text-white placeholder:text-[#6B7280] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20 pl-11"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors"
                  aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  מתחבר...
                </>
              ) : (
                <>
                  התחברו והמשיכו למבצע
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  )
}
