"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
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
  Zap,
  Flame,
  Brain,
  Trophy,
  ArrowRight,
  Play,
} from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginForm = z.infer<typeof loginSchema>

const features = [
  {
    icon: Zap,
    title: "Real-time Code Execution",
    description: "Write and run Java code instantly in your browser",
  },
  {
    icon: Flame,
    title: "Daily Streaks & XP",
    description: "Build habits and track your progress over time",
  },
  {
    icon: Brain,
    title: "Adaptive Learning",
    description: "Personalized practice based on your skill level",
  },
]

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
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
        setError("Invalid email or password. Please try again.")
        setIsLoading(false)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Left side - Brand message (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:block"
      >
        <div className="mb-8">
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4">
            Welcome back to{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
              CodeTutor
            </span>
          </h1>
          <p className="text-lg text-[#9CA3AF]">
            Continue your Java mastery journey where you left off.
          </p>
        </div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/20 border border-[#4F46E5]/30 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-6 w-6 text-[#22D3EE]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-[#6B7280]">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-[#4F46E5]/10 to-[#22D3EE]/5 border border-[#4F46E5]/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-5 w-5 text-[#F59E0B]" />
            <span className="text-sm font-medium text-white">Pro Tip</span>
          </div>
          <p className="text-sm text-[#9CA3AF]">
            Complete daily challenges to maintain your streak and earn bonus XP rewards!
          </p>
        </motion.div>
      </motion.div>

      {/* Right side - Login form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto lg:mx-0"
      >
        <div className="rounded-2xl border border-white/10 bg-[#0F0F23]/80 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(79,70,229,0.1)]">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-[#9CA3AF]">Sign in to continue learning</p>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-[#9CA3AF]">Enter your credentials to continue</p>
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#E5E7EB]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <NeonButton
              type="submit"
              className="w-full h-12"
              disabled={isLoading}
              rightIcon={!isLoading && <ArrowRight className="h-4 w-4" />}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Continue"
              )}
            </NeonButton>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-[#9CA3AF]">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#22D3EE] hover:text-[#4F46E5] font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo CTA */}
          <div className="mt-6">
            <Link href="/demo">
              <button className="w-full h-11 rounded-xl border border-white/10 bg-white/5 text-[#E5E7EB] hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                <Play className="h-4 w-4" />
                Continue as Demo
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function LoginFormFallback() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-white/10 bg-[#0F0F23]/80 p-8">
        <div className="animate-pulse space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-white/10 rounded" />
            <div className="h-4 w-48 bg-white/5 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 bg-white/10 rounded" />
            <div className="h-12 w-full bg-white/5 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-white/10 rounded" />
            <div className="h-12 w-full bg-white/5 rounded-xl" />
          </div>
          <div className="h-12 w-full bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginFormContent />
    </Suspense>
  )
}
