"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/layout"
import { useCourses } from "@/lib/hooks"
import { NeonButton } from "@/components/ui/neon-button"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CreditCard,
  Calendar,
  Check,
  Zap,
  Crown,
  ExternalLink,
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock,
  Shield,
  ChevronRight,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface SubscriptionData {
  subscription: {
    status: string
    planId: string
    hasAccess: boolean
    currentPeriodEnd?: string
    cancelAtPeriodEnd?: boolean
    lastPaymentStatus?: string
  }
  plans: {
    id: string
    name: string
    price: number
    currency: string
    features: string[]
  }[]
}

function BillingLoadingSkeleton() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto space-y-8">
      <div>
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  )
}

export default function BillingPage() {
  const { status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: courses } = useCourses()
  const [isManaging, setIsManaging] = useState(false)
  const [manageError, setManageError] = useState<string | null>(null)

  // Invalidate subscription cache on mount
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["subscription"] })
  }, [queryClient])

  const { data, isLoading, refetch, isRefetching } = useQuery<SubscriptionData>({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await fetch("/api/subscription")
      if (!res.ok) throw new Error("Failed to fetch subscription")
      return res.json()
    },
    enabled: status === "authenticated",
    refetchOnMount: "always",
    staleTime: 0,
  })

  const handleManageSubscription = async () => {
    setIsManaging(true)
    setManageError(null)

    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to open billing portal")
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No portal URL returned")
      }
    } catch (error) {
      console.error("Manage subscription error:", error)
      setManageError(
        error instanceof Error ? error.message : "Failed to open billing portal"
      )
      setIsManaging(false)
    }
  }

  const activeCourse = courses?.find((c) => c.isEnrolled && !c.isLocked)
  const weeks = activeCourse?.weeks || []

  if (status === "loading" || isLoading) {
    return (
      <DashboardShell>
        <BillingLoadingSkeleton />
      </DashboardShell>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const subscription = data?.subscription
  const currentPlan = data?.plans?.find((p) => p.id === subscription?.planId)
  const isActive = subscription?.status === "ACTIVE"
  const isCanceled = subscription?.cancelAtPeriodEnd
  const renewalDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd)
    : null
  const paymentFailed = subscription?.lastPaymentStatus === "payment_failed"

  return (
    <DashboardShell weeks={weeks} currentCourse={activeCourse?.name}>
      <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
              Billing & Subscription
            </h1>
            <p className="text-[#9CA3AF]">Manage your plan and payment settings</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-2 bg-transparent border-[#4F46E5]/30 hover:bg-[#4F46E5]/10"
          >
            <RefreshCw className={cn("size-4", isRefetching && "animate-spin")} />
            Refresh
          </Button>
        </motion.div>

        {/* Payment failed banner */}
        {paymentFailed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3"
          >
            <AlertCircle className="size-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-400">Payment Failed</p>
              <p className="text-sm text-red-400/80 mt-1">
                Your last payment failed. Please update your payment method to
                keep your subscription active.
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleManageSubscription}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Update Payment
            </Button>
          </motion.div>
        )}

        {/* Manage error */}
        {manageError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
          >
            <AlertCircle className="size-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{manageError}</p>
          </motion.div>
        )}

        {/* Current plan card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)",
            border: "1px solid rgba(79, 70, 229, 0.3)",
          }}
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Plan info */}
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)",
                    boxShadow: "0 0 30px rgba(79, 70, 229, 0.4)",
                  }}
                >
                  {isActive ? (
                    <Zap className="size-7 text-white" />
                  ) : (
                    <Crown className="size-7 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">
                      {currentPlan?.name || "Free"} Plan
                    </h2>
                    {isActive && !isCanceled && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: "rgba(16, 185, 129, 0.2)",
                          color: "#10B981",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        ACTIVE
                      </span>
                    )}
                    {isCanceled && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: "rgba(245, 158, 11, 0.2)",
                          color: "#F59E0B",
                          border: "1px solid rgba(245, 158, 11, 0.3)",
                        }}
                      >
                        CANCELING
                      </span>
                    )}
                  </div>
                  {isActive && currentPlan && (
                    <p className="text-[#9CA3AF] mt-1">
                      ₪{currentPlan.price}/month
                    </p>
                  )}
                  {!isActive && (
                    <p className="text-[#9CA3AF] mt-1">
                      Week 1 free access only
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isActive ? (
                  <Button
                    onClick={handleManageSubscription}
                    disabled={isManaging}
                    className="gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                  >
                    {isManaging ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CreditCard className="size-4" />
                    )}
                    Manage Subscription
                    <ExternalLink className="size-3" />
                  </Button>
                ) : (
                  <NeonButton
                    onClick={() => router.push("/pricing")}
                    rightIcon={<ChevronRight className="size-5" />}
                  >
                    Upgrade to Basic
                  </NeonButton>
                )}
              </div>
            </div>

            {/* Renewal info */}
            {isActive && renewalDate && (
              <div className="mt-6 pt-6 border-t border-[#4F46E5]/20">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-[#4F46E5]/20 flex items-center justify-center">
                      <Calendar className="size-5 text-[#4F46E5]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#9CA3AF]">
                        {isCanceled ? "Access ends" : "Next billing date"}
                      </p>
                      <p className="font-medium text-white">
                        {format(renewalDate, "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="sm:ml-auto">
                    <p className="text-sm text-[#9CA3AF]">
                      {formatDistanceToNow(renewalDate, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {isCanceled && (
                  <p className="text-sm text-[#F59E0B] mt-4">
                    Your subscription will end on{" "}
                    {format(renewalDate, "MMMM d, yyyy")}. You can resubscribe
                    anytime to keep your access.
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Features included */}
        {isActive && currentPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: "rgba(30, 27, 75, 0.5)",
              border: "1px solid rgba(79, 70, 229, 0.2)",
            }}
          >
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Check className="size-5 text-[#10B981]" />
              Your Plan Includes
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {currentPlan.features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="size-6 rounded-full bg-[#10B981]/20 flex items-center justify-center shrink-0">
                    <Check className="size-3 text-[#10B981]" />
                  </div>
                  <span className="text-[#E5E7EB]">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Security notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-[#1E1B4B]/50 border border-[#4F46E5]/20"
        >
          <div className="size-10 rounded-lg bg-[#4F46E5]/20 flex items-center justify-center shrink-0">
            <Shield className="size-5 text-[#4F46E5]" />
          </div>
          <div>
            <p className="font-medium text-white text-sm">Secure Payments</p>
            <p className="text-xs text-[#9CA3AF]">
              All payments are securely processed by Stripe. We never store your
              card details.
            </p>
          </div>
        </motion.div>

        {/* FAQ section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="font-bold text-white">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {[
              {
                q: "How do I cancel my subscription?",
                a: "Click 'Manage Subscription' above to access the billing portal where you can cancel anytime.",
              },
              {
                q: "Will I lose my progress if I cancel?",
                a: "No, your progress is saved. If you resubscribe later, you'll pick up where you left off.",
              },
              {
                q: "Can I get a refund?",
                a: "We offer a 7-day money-back guarantee. Contact support within 7 days of purchase for a full refund.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#1E1B4B]/30 border border-[#4F46E5]/10"
              >
                <p className="font-medium text-white text-sm mb-1">{item.q}</p>
                <p className="text-xs text-[#9CA3AF]">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardShell>
  )
}
