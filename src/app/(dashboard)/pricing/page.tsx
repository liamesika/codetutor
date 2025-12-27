"use client"

import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/layout"
import { useCourses } from "@/lib/hooks"
import { NeonButton } from "@/components/ui/neon-button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Check,
  Crown,
  Zap,
  Sparkles,
  Lock,
  ChevronRight,
  Star,
  Flame,
  Trophy,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  features: string[]
  isActive: boolean
}

interface SubscriptionData {
  subscription: {
    status: string
    planId: string
    hasAccess: boolean
  }
  plans: Plan[]
}

const PLAN_ICONS: Record<string, typeof Crown> = {
  basic: Zap,
  pro: Crown,
  elite: Trophy,
}

const PLAN_COLORS: Record<string, { primary: string; glow: string; gradient: string }> = {
  basic: {
    primary: "#4F46E5",
    glow: "rgba(79, 70, 229, 0.4)",
    gradient: "linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)",
  },
  pro: {
    primary: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.4)",
    gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 179, 8, 0.1) 100%)",
  },
  elite: {
    primary: "#EC4899",
    glow: "rgba(236, 72, 153, 0.4)",
    gradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)",
  },
}

function PlanCard({
  plan,
  isCurrentPlan,
  isRecommended,
  index,
}: {
  plan: Plan
  isCurrentPlan: boolean
  isRecommended: boolean
  index: number
}) {
  const Icon = PLAN_ICONS[plan.id] || Zap
  const colors = PLAN_COLORS[plan.id] || PLAN_COLORS.basic
  const isLocked = plan.id !== "basic"

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1, type: "spring", damping: 20 }}
      className={cn(
        "relative rounded-2xl p-6 md:p-8 flex flex-col",
        isRecommended && "ring-2 ring-[#4F46E5]"
      )}
      style={{
        background: colors.gradient,
        border: `1px solid ${colors.primary}40`,
        boxShadow: isRecommended ? `0 0 40px ${colors.glow}` : undefined,
      }}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
          style={{
            background: colors.primary,
            color: "white",
            boxShadow: `0 0 20px ${colors.glow}`,
          }}
        >
          RECOMMENDED
        </div>
      )}

      {/* Locked overlay for pro/elite */}
      {isLocked && (
        <div className="absolute top-4 right-4">
          <div
            className="size-8 rounded-full flex items-center justify-center"
            style={{
              background: `${colors.primary}20`,
              border: `1px solid ${colors.primary}40`,
            }}
          >
            <Lock className="size-4" style={{ color: colors.primary }} />
          </div>
        </div>
      )}

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: `${colors.primary}20`,
          border: `1px solid ${colors.primary}30`,
        }}
      >
        <Icon className="size-7" style={{ color: colors.primary }} />
      </div>

      {/* Plan name */}
      <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-3xl md:text-4xl font-black text-white">
          ₪{plan.price}
        </span>
        <span className="text-[#9CA3AF]">/month</span>
      </div>

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-6">
        {plan.features.map((feature, i) => (
          <motion.li
            key={feature}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-start gap-3 text-sm text-[#E5E7EB]"
          >
            <div
              className="size-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: `${colors.primary}20`,
              }}
            >
              <Check className="size-3" style={{ color: colors.primary }} />
            </div>
            {feature}
          </motion.li>
        ))}
      </ul>

      {/* CTA */}
      {plan.id === "basic" ? (
        <NeonButton
          className="w-full py-4"
          rightIcon={<ChevronRight className="size-5" />}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? "Current Plan" : "Unlock Full Course"}
        </NeonButton>
      ) : (
        <button
          disabled
          className="w-full py-4 rounded-xl font-semibold text-[#6B7280] bg-[#1F2937]/50 border border-[#374151]/50 cursor-not-allowed"
        >
          Coming Soon
        </button>
      )}
    </motion.div>
  )
}

function PricingLoadingSkeleton() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[500px] rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export default function PricingPage() {
  const { status } = useSession()
  const router = useRouter()
  const { data: courses } = useCourses()

  const { data, isLoading } = useQuery<SubscriptionData>({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await fetch("/api/subscription")
      if (!res.ok) throw new Error("Failed to fetch subscription")
      return res.json()
    },
    enabled: status === "authenticated",
  })

  const activeCourse = courses?.find((c) => c.isEnrolled && !c.isLocked)
  const weeks = activeCourse?.weeks || []

  if (status === "loading" || isLoading) {
    return (
      <DashboardShell>
        <PricingLoadingSkeleton />
      </DashboardShell>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const plans = data?.plans || []
  const currentPlanId = data?.subscription?.planId || "basic"
  const hasAccess = data?.subscription?.hasAccess || false

  return (
    <DashboardShell weeks={weeks} currentCourse={activeCourse?.name}>
      <div className="p-6 md:p-8 lg:p-12 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F46E5]/20 border border-[#4F46E5]/30 mb-6">
            <Sparkles className="size-4 text-[#4F46E5]" />
            <span className="text-sm font-medium text-[#4F46E5]">
              Choose Your Plan
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
            Unlock Your Full Potential
          </h1>

          <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
            Start with Week 1 for free, then unlock full access to all lessons,
            challenges, and features.
          </p>
        </motion.div>

        {/* Free tier info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-[#10B981]/10 to-[#22D3EE]/10 border border-[#10B981]/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                <Target className="size-6 text-[#10B981]" />
              </div>
              <div>
                <h3 className="font-bold text-white">Free Access</h3>
                <p className="text-sm text-[#9CA3AF]">
                  Week 1 is completely free — no credit card required
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-[#10B981]">
                <Check className="size-4" />
                <span>All Week 1 lessons</span>
              </div>
              <div className="flex items-center gap-2 text-[#10B981]">
                <Check className="size-4" />
                <span>Daily challenges</span>
              </div>
              <div className="flex items-center gap-2 text-[#10B981]">
                <Check className="size-4" />
                <span>Streak tracking</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={hasAccess && currentPlanId === plan.id}
              isRecommended={plan.id === "basic"}
              index={index}
            />
          ))}
        </div>

        {/* FAQ or features section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-xl font-bold text-white mb-6">
            What&apos;s included in Basic?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Target, label: "All 5 Weeks", desc: "Complete curriculum" },
              { icon: Flame, label: "Daily Streak", desc: "Track your progress" },
              { icon: Trophy, label: "Leagues", desc: "Weekly competitions" },
              { icon: Star, label: "Achievements", desc: "Earn badges & XP" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-4 rounded-xl bg-[#1E1B4B]/50 border border-[#4F46E5]/20"
              >
                <item.icon className="size-6 text-[#4F46E5] mx-auto mb-2" />
                <p className="font-semibold text-white">{item.label}</p>
                <p className="text-xs text-[#9CA3AF]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Payment notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-[#6B7280] mt-12"
        >
          Payment processing coming soon. For now, enjoy Week 1 completely free!
        </motion.p>
      </div>
    </DashboardShell>
  )
}
