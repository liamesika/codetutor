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
import { RedeemCodeModal } from "@/components/modals/redeem-code-modal"
import { AccessUnlockedOverlay } from "@/components/overlays/access-unlocked-overlay"
import {
  Check,
  Crown,
  Zap,
  Shield,
  Key,
  Calendar,
  Clock,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { EntitlementPlan, EntitlementStatus } from "@prisma/client"
import { formatDistanceToNow, format } from "date-fns"

interface EntitlementData {
  entitlement: {
    status: EntitlementStatus | null
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

const STATUS_CONFIG = {
  ACTIVE: {
    label: "Active",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.1)",
  },
  EXPIRED: {
    label: "Expired",
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
  REVOKED: {
    label: "Revoked",
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
  },
}

const PLAN_CONFIG = {
  BASIC: {
    name: "Basic Access",
    color: "#4F46E5",
    gradient: "linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)",
  },
  PRO: {
    name: "Pro Access",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 179, 8, 0.1) 100%)",
  },
  ELITE: {
    name: "Elite Access",
    color: "#EC4899",
    gradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)",
  },
}

function AccessLoadingSkeleton() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-72" />
      </div>
      <Skeleton className="h-[300px] rounded-2xl" />
    </div>
  )
}

export default function AccountAccessPage() {
  const { status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: courses } = useCourses()

  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false)
  const [unlockedPlan, setUnlockedPlan] = useState<EntitlementPlan>("BASIC")

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["entitlement"] })
  }, [queryClient])

  const { data: entitlementData, isLoading } = useQuery<EntitlementData>({
    queryKey: ["entitlement"],
    queryFn: async () => {
      const res = await fetch("/api/entitlement")
      if (!res.ok) throw new Error("Failed to fetch entitlement")
      return res.json()
    },
    enabled: status === "authenticated",
    refetchOnMount: "always",
  })

  const handleRedeemSuccess = (plan: EntitlementPlan) => {
    setShowRedeemModal(false)
    setUnlockedPlan(plan)
    setShowSuccessOverlay(true)
    queryClient.invalidateQueries({ queryKey: ["entitlement"] })
  }

  const activeCourse = courses?.find((c) => c.isEnrolled && !c.isLocked)
  const weeks = activeCourse?.weeks || []

  if (status === "loading" || isLoading) {
    return (
      <DashboardShell>
        <AccessLoadingSkeleton />
      </DashboardShell>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const entitlement = entitlementData?.entitlement
  const planInfo = entitlementData?.planInfo
  const hasAccess = entitlement?.hasAccess || false

  return (
    <DashboardShell weeks={weeks} currentCourse={activeCourse?.name}>
      <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Your Access
          </h1>
          <p className="text-[#9CA3AF]">
            Manage your course access and entitlements
          </p>
        </motion.div>

        {/* Access Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {hasAccess && entitlement?.plan ? (
            // Active access card
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: PLAN_CONFIG[entitlement.plan].gradient,
                border: `1px solid ${PLAN_CONFIG[entitlement.plan].color}40`,
              }}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="size-14 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${PLAN_CONFIG[entitlement.plan].color}20`,
                        border: `1px solid ${PLAN_CONFIG[entitlement.plan].color}30`,
                      }}
                    >
                      <Crown
                        className="size-7"
                        style={{ color: PLAN_CONFIG[entitlement.plan].color }}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {PLAN_CONFIG[entitlement.plan].name}
                      </h2>
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mt-1"
                        style={{
                          background: STATUS_CONFIG[entitlement.status!].bgColor,
                          color: STATUS_CONFIG[entitlement.status!].color,
                        }}
                      >
                        <Check className="size-3" />
                        {STATUS_CONFIG[entitlement.status!].label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {entitlement.grantedAt && (
                    <div className="p-4 rounded-xl bg-[#1F2937]/30">
                      <div className="flex items-center gap-2 text-[#9CA3AF] text-sm mb-1">
                        <Calendar className="size-4" />
                        Granted
                      </div>
                      <p className="text-white font-medium">
                        {format(new Date(entitlement.grantedAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  )}
                  {entitlement.expiresAt ? (
                    <div className="p-4 rounded-xl bg-[#1F2937]/30">
                      <div className="flex items-center gap-2 text-[#9CA3AF] text-sm mb-1">
                        <Clock className="size-4" />
                        Expires
                      </div>
                      <p className="text-white font-medium">
                        {format(new Date(entitlement.expiresAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#1F2937]/30">
                      <div className="flex items-center gap-2 text-[#9CA3AF] text-sm mb-1">
                        <Clock className="size-4" />
                        Duration
                      </div>
                      <p className="text-white font-medium">Never expires</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {(planInfo?.features || []).map((feature, i) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-[#E5E7EB]"
                    >
                      <div
                        className="size-5 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: `${PLAN_CONFIG[entitlement.plan!].color}20`,
                        }}
                      >
                        <Check
                          className="size-3"
                          style={{ color: PLAN_CONFIG[entitlement.plan!].color }}
                        />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <NeonButton
                  onClick={() => router.push("/dashboard")}
                  className="w-full sm:w-auto"
                  rightIcon={<ChevronRight className="size-4" />}
                >
                  Continue Learning
                </NeonButton>
              </div>
            </div>
          ) : (
            // No access card
            <div
              className="rounded-2xl p-8"
              style={{
                background: "linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.05) 100%)",
                border: "1px solid rgba(107, 114, 128, 0.2)",
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="size-12 rounded-xl bg-[#374151]/50 flex items-center justify-center">
                  <Shield className="size-6 text-[#6B7280]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    Free Access
                  </h2>
                  <p className="text-[#9CA3AF]">
                    Week 1 is available for free
                  </p>
                </div>
              </div>

              {entitlement?.status === "EXPIRED" && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 mb-6">
                  <AlertTriangle className="size-5 text-[#F59E0B] shrink-0" />
                  <p className="text-sm text-[#F59E0B]">
                    Your access has expired. Redeem a new code to continue.
                  </p>
                </div>
              )}

              {entitlement?.status === "REVOKED" && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                  <AlertTriangle className="size-5 text-red-400 shrink-0" />
                  <p className="text-sm text-red-400">
                    Your access has been revoked. Contact support for help.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <NeonButton
                  onClick={() => router.push("/upgrade")}
                  className="flex-1"
                  rightIcon={<ChevronRight className="size-4" />}
                >
                  Get Access
                </NeonButton>
                <button
                  onClick={() => setShowRedeemModal(true)}
                  className="flex-1 py-3 px-6 rounded-xl font-semibold text-[#E5E7EB] bg-[#1F2937]/50 border border-[#374151]/50 hover:bg-[#374151]/50 hover:border-[#4B5563]/50 transition-all flex items-center justify-center gap-2"
                >
                  <Key className="size-4" />
                  Redeem Code
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Help section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-[#6B7280]">
            Need help?{" "}
            <a
              href="mailto:support@codetutor.dev"
              className="text-[#4F46E5] hover:text-[#6366F1] transition-colors"
            >
              Contact support
            </a>
          </p>
        </motion.div>
      </div>

      {/* Modals */}
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
