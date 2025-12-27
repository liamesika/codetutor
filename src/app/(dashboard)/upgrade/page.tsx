"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/layout"
import { useCourses } from "@/lib/hooks"
import { NeonButton } from "@/components/ui/neon-button"
import { Skeleton } from "@/components/ui/skeleton"
import { RequestAccessModal } from "@/components/modals/request-access-modal"
import { RedeemCodeModal } from "@/components/modals/redeem-code-modal"
import { AccessUnlockedOverlay } from "@/components/overlays/access-unlocked-overlay"
import {
  Check,
  Crown,
  Zap,
  Sparkles,
  Star,
  Flame,
  Trophy,
  Target,
  Key,
  Send,
  Shield,
} from "lucide-react"
import { EntitlementPlan } from "@prisma/client"

interface EntitlementData {
  entitlement: {
    status: string | null
    plan: EntitlementPlan | null
    hasAccess: boolean
    expiresAt: string | null
    grantedAt: string | null
  }
  planInfo: {
    name: string
    description: string
    features: string[]
  } | null
  freeAccess: {
    maxWeek: number
  }
}

interface AccessRequestData {
  request: {
    id: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAt: string
  } | null
}

const PLAN_COLORS = {
  BASIC: {
    primary: "#4F46E5",
    glow: "rgba(79, 70, 229, 0.4)",
    gradient: "linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)",
  },
  PRO: {
    primary: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.4)",
    gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 179, 8, 0.1) 100%)",
  },
  ELITE: {
    primary: "#EC4899",
    glow: "rgba(236, 72, 153, 0.4)",
    gradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)",
  },
}

function ActiveAccessCard({
  entitlement,
  planInfo,
}: {
  entitlement: EntitlementData["entitlement"]
  planInfo: EntitlementData["planInfo"]
}) {
  const router = useRouter()
  const colors = PLAN_COLORS[entitlement.plan || "BASIC"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: colors.gradient,
          border: `1px solid ${colors.primary}40`,
          boxShadow: `0 0 40px ${colors.glow}`,
        }}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}CC 100%)`,
            boxShadow: `0 0 30px ${colors.glow}`,
          }}
        >
          <Crown className="size-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {planInfo?.name || "Basic Access"} Active
        </h2>
        <p className="text-[#9CA3AF] mb-6">
          You have full access to all course content
        </p>

        {/* Features */}
        <div className="space-y-3 mb-8 text-left">
          {(planInfo?.features || []).map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-3 text-sm text-[#E5E7EB]"
            >
              <div
                className="size-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${colors.primary}20` }}
              >
                <Check className="size-3" style={{ color: colors.primary }} />
              </div>
              {feature}
            </motion.div>
          ))}
        </div>

        {/* Granted info */}
        {entitlement.grantedAt && (
          <p className="text-xs text-[#6B7280] mb-4">
            Granted on {new Date(entitlement.grantedAt).toLocaleDateString()}
          </p>
        )}

        <NeonButton onClick={() => router.push("/dashboard")} className="w-full">
          Continue Learning
        </NeonButton>
      </div>
    </motion.div>
  )
}

function PendingRequestCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(234, 179, 8, 0.08) 100%)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{
            background: "rgba(245, 158, 11, 0.2)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
          }}
        >
          <Send className="size-7 text-[#F59E0B]" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Request Pending</h2>
        <p className="text-[#9CA3AF] mb-4">
          Your access request is being reviewed. We&apos;ll notify you once it&apos;s processed.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30">
          <div className="size-2 rounded-full bg-[#F59E0B] animate-pulse" />
          <span className="text-sm text-[#F59E0B]">Awaiting Review</span>
        </div>
      </div>
    </motion.div>
  )
}

function AccessOptionsCard({
  onRequestAccess,
  onRedeemCode,
}: {
  onRequestAccess: () => void
  onRedeemCode: () => void
}) {
  const features = [
    "Full access to all 9 weeks",
    "All challenges & exercises",
    "Daily streak & leagues",
    "Achievements & rank system",
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="max-w-lg mx-auto"
    >
      <div
        className="rounded-2xl p-8"
        style={{
          background: PLAN_COLORS.BASIC.gradient,
          border: `1px solid ${PLAN_COLORS.BASIC.primary}40`,
          boxShadow: `0 0 40px ${PLAN_COLORS.BASIC.glow}`,
        }}
      >
        {/* Recommended badge */}
        <div className="flex justify-center mb-6">
          <div
            className="px-4 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: PLAN_COLORS.BASIC.primary,
              color: "white",
              boxShadow: `0 0 20px ${PLAN_COLORS.BASIC.glow}`,
            }}
          >
            BASIC ACCESS
          </div>
        </div>

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center"
          style={{
            background: `${PLAN_COLORS.BASIC.primary}20`,
            border: `1px solid ${PLAN_COLORS.BASIC.primary}30`,
          }}
        >
          <Zap className="size-8" style={{ color: PLAN_COLORS.BASIC.primary }} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Unlock Full Course
        </h2>
        <p className="text-[#9CA3AF] text-center mb-8">
          Get access to all premium content
        </p>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex items-center gap-3 text-sm text-[#E5E7EB]"
            >
              <div
                className="size-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${PLAN_COLORS.BASIC.primary}20` }}
              >
                <Check
                  className="size-3"
                  style={{ color: PLAN_COLORS.BASIC.primary }}
                />
              </div>
              {feature}
            </motion.li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <NeonButton
            onClick={onRequestAccess}
            className="w-full py-4"
            rightIcon={<Send className="size-4" />}
          >
            Request Basic Access
          </NeonButton>

          <button
            onClick={onRedeemCode}
            className="w-full py-4 rounded-xl font-semibold text-[#E5E7EB] bg-[#1F2937]/50 border border-[#374151]/50 hover:bg-[#374151]/50 hover:border-[#4B5563]/50 transition-all flex items-center justify-center gap-2"
          >
            <Key className="size-4" />
            I Have an Access Code
          </button>
        </div>
      </div>
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
      <div className="max-w-lg mx-auto">
        <Skeleton className="h-[450px] rounded-2xl" />
      </div>
    </div>
  )
}

export default function PricingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: courses } = useCourses()

  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false)
  const [unlockedPlan, setUnlockedPlan] = useState<EntitlementPlan>("BASIC")

  // Invalidate cache on mount
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["entitlement"] })
    queryClient.invalidateQueries({ queryKey: ["accessRequest"] })
  }, [queryClient])

  const { data: entitlementData, isLoading: entitlementLoading } = useQuery<EntitlementData>({
    queryKey: ["entitlement"],
    queryFn: async () => {
      const res = await fetch("/api/entitlement")
      if (!res.ok) throw new Error("Failed to fetch entitlement")
      return res.json()
    },
    enabled: status === "authenticated",
    refetchOnMount: "always",
  })

  const { data: accessRequestData } = useQuery<AccessRequestData>({
    queryKey: ["accessRequest"],
    queryFn: async () => {
      const res = await fetch("/api/access-request")
      if (!res.ok) throw new Error("Failed to fetch access request")
      return res.json()
    },
    enabled: status === "authenticated" && !entitlementData?.entitlement.hasAccess,
    refetchOnMount: "always",
  })

  const handleRedeemSuccess = (plan: EntitlementPlan) => {
    setShowRedeemModal(false)
    setUnlockedPlan(plan)
    setShowSuccessOverlay(true)
    queryClient.invalidateQueries({ queryKey: ["entitlement"] })
    queryClient.invalidateQueries({ queryKey: ["accessRequest"] })
  }

  const activeCourse = courses?.find((c) => c.isEnrolled && !c.isLocked)
  const weeks = activeCourse?.weeks || []

  if (status === "loading" || entitlementLoading) {
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

  const hasAccess = entitlementData?.entitlement.hasAccess || false
  const hasPendingRequest = accessRequestData?.request?.status === "PENDING"

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
              {hasAccess ? "Your Access" : "Get Access"}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
            {hasAccess
              ? "You're All Set!"
              : "Unlock Your Full Potential"}
          </h1>

          <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
            {hasAccess
              ? "Enjoy full access to all premium content and features."
              : "Start with Week 1 for free, then unlock full access to all lessons, challenges, and features."}
          </p>
        </motion.div>

        {/* Free tier info (only show if not having access) */}
        {!hasAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-[#10B981]/10 to-[#22D3EE]/10 border border-[#10B981]/20 max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                  <Target className="size-6 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Free Access</h3>
                  <p className="text-sm text-[#9CA3AF]">
                    Week 1 is completely free
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
        )}

        {/* Main content */}
        {hasAccess ? (
          <ActiveAccessCard
            entitlement={entitlementData!.entitlement}
            planInfo={entitlementData!.planInfo}
          />
        ) : hasPendingRequest ? (
          <PendingRequestCard />
        ) : (
          <AccessOptionsCard
            onRequestAccess={() => setShowRequestModal(true)}
            onRedeemCode={() => setShowRedeemModal(true)}
          />
        )}

        {/* What's included section (only show if not having access) */}
        {!hasAccess && !hasPendingRequest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-16"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              What&apos;s included?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Target, label: "All 9 Weeks", desc: "Complete curriculum" },
                { icon: Flame, label: "Daily Streak", desc: "Track your progress" },
                { icon: Trophy, label: "Leagues", desc: "Weekly competitions" },
                { icon: Star, label: "Achievements", desc: "Earn badges & XP" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="p-4 rounded-xl bg-[#1E1B4B]/50 border border-[#4F46E5]/20"
                >
                  <item.icon className="size-6 text-[#4F46E5] mx-auto mb-2" />
                  <p className="font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-[#9CA3AF]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Security notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Shield className="size-4" />
            <span>Secure access management</span>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <RequestAccessModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        userEmail={session?.user?.email || ""}
        userName={session?.user?.name || ""}
      />

      <RedeemCodeModal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        onSuccess={handleRedeemSuccess}
      />

      <AccessUnlockedOverlay
        isVisible={showSuccessOverlay}
        onClose={() => setShowSuccessOverlay(false)}
        plan={unlockedPlan}
      />
    </DashboardShell>
  )
}
