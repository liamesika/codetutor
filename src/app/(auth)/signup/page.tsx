"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  Sparkles,
  Crown,
  Code2,
  BookOpen,
  Target,
  Shield,
} from "lucide-react"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupForm = z.infer<typeof signupSchema>

const basicFeatures = [
  { icon: BookOpen, text: "All 10 days + past exams" },
  { icon: Code2, text: "All exercises & practice" },
  { icon: Target, text: "XP / Levels / Streak" },
]

const proFeatures = [
  { icon: BookOpen, text: "All 10 days + past exams" },
  { icon: Sparkles, text: "AI-powered explanations" },
  { icon: Shield, text: "Missions & AI Mentor" },
]

function SignupFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan")
  const isPro = planParam === "pro"
  const selectedPlan = isPro ? "pro" : "basic"

  // Redirect to pricing if no valid plan selected
  useEffect(() => {
    if (!planParam || (planParam !== "basic" && planParam !== "pro")) {
      router.replace("/pricing")
    }
  }, [planParam, router])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const password = watch("password", "")

  const passwordChecks = [
    { label: "8+ characters", valid: password.length >= 8 },
    { label: "Uppercase", valid: /[A-Z]/.test(password) },
    { label: "Lowercase", valid: /[a-z]/.test(password) },
    { label: "Number", valid: /[0-9]/.test(password) },
  ]

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if email is already taken before redirecting to payment
      const checkRes = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      })
      if (checkRes.ok) {
        const checkResult = await checkRes.json()
        if (checkResult.exists) {
          setError("An account with this email already exists")
          setIsLoading(false)
          return
        }
      }

      // Save signup data to sessionStorage — account will be created after payment
      sessionStorage.setItem(
        "pendingSignup",
        JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          plan: selectedPlan,
        })
      )

      // Redirect to PayPlus payment page
      const paymentUrl = isPro
        ? process.env.NEXT_PUBLIC_PAYPLUS_PRO_URL
        : process.env.NEXT_PUBLIC_PAYPLUS_BASIC_URL

      if (paymentUrl) {
        window.location.href = paymentUrl
      } else {
        setError("Payment is not configured. Please contact support.")
        setIsLoading(false)
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  const features = isPro ? proFeatures : basicFeatures
  const planLabel = isPro ? "PRO" : "BASIC"
  const planColor = isPro ? "#F59E0B" : "#8B5CF6"

  return (
    <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Left side - Plan info (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:block"
      >
        <div className="mb-8">
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4">
            {isPro ? (
              <>
                Unlock{" "}
                <span className="bg-linear-to-r from-[#F59E0B] to-[#EF4444] bg-clip-text text-transparent">
                  PRO Power
                </span>
              </>
            ) : (
              <>
                Get{" "}
                <span className="bg-linear-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
                  Full Practice
                </span>
              </>
            )}
          </h1>
          <p className="text-lg text-[#9CA3AF]">
            {isPro
              ? "All 10 days, past exams, and AI Mentor — everything you need."
              : "All 10 days of practice plus past exams to ace your test."}
          </p>
        </div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${planColor}20`,
                  border: `1px solid ${planColor}30`
                }}
              >
                <feature.icon className="h-6 w-6" style={{ color: planColor }} />
              </div>
              <div>
                <h3 className="font-semibold text-white">{feature.text}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Plan comparison CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors"
          >
            <span>Compare all plans</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Right side - Signup form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto lg:mx-0"
      >
        <div className="rounded-2xl border border-white/10 bg-[#0F0F23]/80 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(79,70,229,0.1)]">
          {/* Plan badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${planColor}20`,
                border: `1px solid ${planColor}30`,
                color: planColor
              }}
            >
              {isPro ? <Crown className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
              Selected plan: {planLabel}
            </div>
          </motion.div>

          {/* Mobile header */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-[#9CA3AF]">
              {isPro ? "Get full PRO access" : "Get full practice access"}
            </p>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-[#9CA3AF]">Enter your details to get started</p>
          </div>

          {/* Error alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#E5E7EB]">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                disabled={isLoading}
                {...register("name")}
                aria-invalid={!!errors.name}
                className="h-12 bg-[#1F1F3A] border-white/10 text-white placeholder:text-[#6B7280] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#E5E7EB]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
                {...register("email")}
                aria-invalid={!!errors.email}
                className="h-12 bg-[#1F1F3A] border-white/10 text-white placeholder:text-[#6B7280] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#E5E7EB]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  className="h-12 bg-[#1F1F3A] border-white/10 text-white placeholder:text-[#6B7280] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {password && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {passwordChecks.map((check) => (
                    <div
                      key={check.label}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        check.valid ? "text-green-400" : "text-[#6B7280]"
                      }`}
                    >
                      <Check
                        className={`h-3 w-3 transition-opacity ${
                          check.valid ? "opacity-100" : "opacity-30"
                        }`}
                      />
                      {check.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#E5E7EB]">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                  className="h-12 bg-[#1F1F3A] border-white/10 text-white placeholder:text-[#6B7280] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <NeonButton
              type="submit"
              className="w-full h-12 mt-2"
              disabled={isLoading}
              rightIcon={!isLoading && <ArrowRight className="h-4 w-4" />}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </NeonButton>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-[#9CA3AF]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#22D3EE] hover:text-[#4F46E5] font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Switch plan link */}
          <div className="mt-4 text-center">
            <Link
              href="/pricing"
              className="text-sm text-[#6B7280] hover:text-white transition-colors"
            >
              View all plans
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function SignupFormFallback() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-white/10 bg-[#0F0F23]/80 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-white/10 rounded-full" />
          <div className="space-y-2">
            <div className="h-6 w-40 bg-white/10 rounded" />
            <div className="h-4 w-56 bg-white/5 rounded" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-16 bg-white/10 rounded" />
              <div className="h-12 w-full bg-white/5 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-white/10 rounded" />
              <div className="h-12 w-full bg-white/5 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-white/10 rounded" />
              <div className="h-12 w-full bg-white/5 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="h-12 w-full bg-white/5 rounded-xl" />
            </div>
          </div>
          <div className="h-12 w-full bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupFormFallback />}>
      <SignupFormContent />
    </Suspense>
  )
}
