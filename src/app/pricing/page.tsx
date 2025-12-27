"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { NeonButton } from "@/components/ui/neon-button"
import { LegalFooter } from "@/components/shared/legal-footer"
import {
  Check,
  X,
  Crown,
  Zap,
  Sparkles,
  Code2,
  Play,
  CreditCard,
  ArrowRight,
  BookOpen,
  Target,
  Rocket,
} from "lucide-react"

const plans = [
  {
    id: "free",
    name: "FREE",
    description: "Perfect for getting started",
    price: "$0",
    period: "forever",
    icon: Zap,
    color: "#22D3EE",
    bgGradient: "from-[#22D3EE]/10 to-[#4F46E5]/5",
    borderColor: "border-[#22D3EE]/30",
    features: [
      { text: "Week 1 Java Fundamentals", included: true },
      { text: "Real-time code execution", included: true },
      { text: "Progress tracking", included: true },
      { text: "Daily streak tracking", included: true },
      { text: "Weeks 2-9 curriculum", included: false },
      { text: "PRO Mentor Intelligence", included: false },
      { text: "Adaptive learning engine", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Start Free",
    ctaLink: "/signup?plan=free",
    popular: false,
  },
  {
    id: "pro",
    name: "PRO",
    description: "Full access to everything",
    price: "$9.99",
    originalPrice: "$20",
    period: "/month",
    promoLabel: "Semester A Launch Offer",
    icon: Crown,
    color: "#F59E0B",
    bgGradient: "from-[#F59E0B]/15 to-[#EF4444]/5",
    borderColor: "border-[#F59E0B]/40",
    features: [
      { text: "All 9 weeks of curriculum", included: true },
      { text: "Real-time code execution", included: true },
      { text: "Progress tracking", included: true },
      { text: "Daily streak tracking", included: true },
      { text: "PRO Mentor Intelligence", included: true },
      { text: "Adaptive learning engine", included: true },
      { text: "PRO Missions & Challenges", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Upgrade to PRO",
    ctaLink: "/signup?plan=pro",
    popular: true,
  },
]

const comparisonFeatures = [
  { category: "Content", items: [
    { name: "Week 1: Java Fundamentals", free: true, pro: true },
    { name: "Week 2: Control Flow", free: false, pro: true },
    { name: "Week 3: Arrays & Strings", free: false, pro: true },
    { name: "Week 4: Object-Oriented Programming", free: false, pro: true },
    { name: "Week 5: Collections & Generics", free: false, pro: true },
    { name: "Weeks 6-9: Advanced Topics", free: false, pro: true },
  ]},
  { category: "Features", items: [
    { name: "Real-time Java execution", free: true, pro: true },
    { name: "Progress tracking", free: true, pro: true },
    { name: "Daily streaks", free: true, pro: true },
    { name: "XP & Leveling system", free: true, pro: true },
    { name: "Leaderboards", free: true, pro: true },
  ]},
  { category: "PRO Intelligence", items: [
    { name: "AI Mentor guidance", free: false, pro: true },
    { name: "Adaptive difficulty", free: false, pro: true },
    { name: "Personalized learning path", free: false, pro: true },
    { name: "PRO Daily Missions", free: false, pro: true },
    { name: "Skill gap analysis", free: false, pro: true },
  ]},
]

// Only verified platform stats
const platformHighlights = [
  { icon: BookOpen, value: "9", label: "Weeks of curriculum" },
  { icon: Rocket, value: "5", label: "Difficulty levels" },
  { icon: Target, value: "Week 1", label: "Free forever" },
]

export default function PublicPricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B]">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.08),transparent_50%)]" />
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#F59E0B]/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0A0A1B]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
              CodeTutor
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/demo">
              <NeonButton variant="ghost" size="sm" leftIcon={<Play className="h-4 w-4" />}>
                <span className="hidden sm:inline">Try Demo</span>
              </NeonButton>
            </Link>
            <Link href="/login">
              <NeonButton variant="secondary" size="sm">
                Sign In
              </NeonButton>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F46E5]/20 border border-[#4F46E5]/30">
                <CreditCard className="h-4 w-4 text-[#4F46E5]" />
                <span className="text-sm font-medium text-[#4F46E5]">Simple Pricing</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Choose Your{" "}
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
                Learning Path
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-[#9CA3AF] max-w-2xl mx-auto"
            >
              Start for free with Week 1, or unlock the full Java curriculum with PRO features.
            </motion.p>
          </div>
        </section>

        {/* Plans */}
        <section className="pb-16 px-4 pt-8">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="relative"
                >
                  {/* Coffee micro-banner for PRO */}
                  {plan.id === "pro" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 w-full max-w-[280px] sm:max-w-xs"
                    >
                      <div className="px-4 py-2.5 rounded-xl bg-[#1a1a2e]/95 border border-[#F59E0B]/40 shadow-lg text-center">
                        <span className="text-sm text-[#FCD34D] font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          Only $9.99/month — basically the price of 2 coffees <span className="inline-block">☕☕</span>
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-8 h-full bg-gradient-to-br ${plan.bgGradient} border ${plan.borderColor} ${
                      plan.popular ? "shadow-[0_0_60px_rgba(245,158,11,0.15)]" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center"
                      style={{
                        background: `${plan.color}20`,
                        border: `1px solid ${plan.color}40`,
                      }}
                    >
                      <plan.icon className="h-7 w-7" style={{ color: plan.color }} />
                    </div>

                    {/* Plan name */}
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-[#9CA3AF] mb-6">{plan.description}</p>

                    {/* Price with promo label */}
                    <div className="mb-8">
                      {"promoLabel" in plan && plan.promoLabel && (
                        <div className="inline-block px-3 py-1.5 rounded-full bg-[#1a1a2e] border border-[#F59E0B]/50 mb-3 shadow-md">
                          <span className="text-xs font-bold text-[#FCD34D] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{plan.promoLabel}</span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{plan.price}</span>
                        {"originalPrice" in plan && plan.originalPrice && (
                          <span className="text-lg text-[#9CA3AF] line-through drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{plan.originalPrice}</span>
                        )}
                        <span className="text-[#9CA3AF]">{plan.period}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature.text} className="flex items-start gap-3">
                          {feature.included ? (
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                              style={{ background: `${plan.color}20` }}
                            >
                              <Check className="h-3 w-3" style={{ color: plan.color }} />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#374151]/50">
                              <X className="h-3 w-3 text-[#6B7280]" />
                            </div>
                          )}
                          <span
                            className={`text-sm ${
                              feature.included ? "text-[#E5E7EB]" : "text-[#6B7280]"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link href={plan.ctaLink}>
                      <NeonButton
                        className="w-full h-12"
                        variant={plan.popular ? "primary" : "secondary"}
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                      >
                        {plan.cta}
                      </NeonButton>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform highlights - only verified stats */}
        <section className="py-12 px-4 border-y border-white/5">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {platformHighlights.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#4F46E5]/20 border border-[#4F46E5]/30 flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-[#4F46E5]" />
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-white mb-0.5 md:mb-1">{stat.value}</p>
                  <p className="text-xs md:text-sm text-[#6B7280]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature comparison - Mobile-friendly stacked cards */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Compare Plans</h2>
              <p className="text-[#9CA3AF]">See what&apos;s included in each plan</p>
            </motion.div>

            {/* Desktop table view */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="hidden md:block rounded-2xl border border-white/10 bg-[#0F0F23]/80 overflow-hidden"
            >
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10 bg-white/5">
                <div className="text-sm font-medium text-[#9CA3AF]">Feature</div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-[#22D3EE]">
                    <Zap className="h-4 w-4" />
                    <span className="font-semibold">FREE</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-[#F59E0B]">
                    <Crown className="h-4 w-4" />
                    <span className="font-semibold">PRO</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              {comparisonFeatures.map((category) => (
                <div key={category.category}>
                  {/* Category header */}
                  <div className="px-6 py-3 bg-white/5 border-b border-white/5">
                    <span className="text-sm font-semibold text-white">{category.category}</span>
                  </div>

                  {/* Items */}
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={item.name}
                      className={`grid grid-cols-3 gap-4 px-6 py-4 ${
                        itemIndex < category.items.length - 1 ? "border-b border-white/5" : ""
                      }`}
                    >
                      <div className="text-sm text-[#E5E7EB]">{item.name}</div>
                      <div className="flex justify-center">
                        {item.free ? (
                          <Check className="h-5 w-5 text-[#22D3EE]" />
                        ) : (
                          <X className="h-5 w-5 text-[#4B5563]" />
                        )}
                      </div>
                      <div className="flex justify-center">
                        {item.pro ? (
                          <Check className="h-5 w-5 text-[#F59E0B]" />
                        ) : (
                          <X className="h-5 w-5 text-[#4B5563]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>

            {/* Mobile stacked cards view */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="md:hidden space-y-6"
            >
              {comparisonFeatures.map((category) => (
                <div
                  key={category.category}
                  className="rounded-2xl border border-white/10 bg-[#0F0F23]/80 overflow-hidden"
                >
                  {/* Category header */}
                  <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                    <span className="text-sm font-semibold text-white">{category.category}</span>
                  </div>

                  {/* Items as stacked rows */}
                  <div className="divide-y divide-white/5">
                    {category.items.map((item) => (
                      <div key={item.name} className="p-4">
                        <p className="text-sm text-[#E5E7EB] mb-3">{item.name}</p>
                        <div className="flex gap-4">
                          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/20">
                            {item.free ? (
                              <Check className="h-4 w-4 text-[#22D3EE]" />
                            ) : (
                              <X className="h-4 w-4 text-[#4B5563]" />
                            )}
                            <span className="text-xs font-medium text-[#22D3EE]">FREE</span>
                          </div>
                          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                            {item.pro ? (
                              <Check className="h-4 w-4 text-[#F59E0B]" />
                            ) : (
                              <X className="h-4 w-4 text-[#4B5563]" />
                            )}
                            <span className="text-xs font-medium text-[#F59E0B]">PRO</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="rounded-2xl p-8 bg-gradient-to-br from-[#4F46E5]/20 to-[#22D3EE]/10 border border-[#4F46E5]/30"
            >
              <Sparkles className="h-10 w-10 text-[#4F46E5] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">Ready to start learning?</h2>
              <p className="text-[#9CA3AF] mb-6">
                Begin with Week 1 for free. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signup?plan=free">
                  <NeonButton
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    Start Free
                  </NeonButton>
                </Link>
                <Link href="/demo">
                  <NeonButton variant="ghost" size="lg" leftIcon={<Play className="h-5 w-5" />}>
                    Try Demo First
                  </NeonButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <LegalFooter variant="compact" />
    </div>
  )
}
