"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { NeonButton } from "@/components/ui/neon-button"
import { LegalFooter } from "@/components/shared/legal-footer"
import {
  Check,
  X,
  Crown,
  Zap,
  Sparkles,
  Play,
  CreditCard,
  ArrowRight,
  BookOpen,
  Target,
  Rocket,
  Star,
  Shield,
  Brain,
} from "lucide-react"

const plans = [
  {
    id: "free",
    name: "FREE",
    description: "Get started with Java basics",
    price: "$0",
    priceILS: "0",
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
      { text: "Weeks 2-10 curriculum", included: false },
      { text: "Learning explanations", included: false },
      { text: "Missions & challenges", included: false },
      { text: "AI Mentor", included: false },
    ],
    cta: "Start Free",
    ctaLink: "/signup?plan=free",
    popular: false,
    badge: null,
  },
  {
    id: "basic",
    name: "BASIC",
    description: "Full practice access",
    price: "$9.99",
    priceILS: "30",
    period: "/month",
    icon: BookOpen,
    color: "#8B5CF6",
    bgGradient: "from-[#8B5CF6]/10 to-[#6366F1]/5",
    borderColor: "border-[#8B5CF6]/30",
    features: [
      { text: "Weeks 1-10 curriculum", included: true },
      { text: "All exercises & practice", included: true },
      { text: "XP / Levels / Streak", included: true },
      { text: "Leaderboards", included: true },
      { text: "Learning explanations", included: false },
      { text: "Missions & challenges", included: false },
      { text: "Advanced analytics", included: false },
      { text: "AI Mentor", included: false },
    ],
    cta: "Get Basic",
    ctaLink: "/signup?plan=basic",
    popular: false,
    badge: "Practice Only",
  },
  {
    id: "pro",
    name: "PRO",
    description: "Complete learning experience",
    price: "$21.90",
    priceILS: "75",
    period: "/month",
    icon: Crown,
    color: "#F59E0B",
    bgGradient: "from-[#F59E0B]/15 to-[#EF4444]/5",
    borderColor: "border-[#F59E0B]/40",
    features: [
      { text: "All weeks (unlimited)", included: true },
      { text: "Full learning explanations", included: true },
      { text: "Missions & challenges", included: true },
      { text: "Advanced analytics", included: true },
      { text: "PRO badge & XP boosts", included: true },
      { text: "Premium challenges", included: true },
      { text: "Priority support", included: true },
      { text: "AI Mentor (coming soon)", included: true },
    ],
    cta: "Upgrade to PRO",
    ctaLink: "/signup?plan=pro",
    popular: true,
    badge: "Best Value",
  },
]

const comparisonFeatures = [
  {
    category: "Content Access",
    items: [
      { name: "Week 1: Java Fundamentals", free: true, basic: true, pro: true },
      { name: "Weeks 2-10: Core Curriculum", free: false, basic: true, pro: true },
      { name: "Weeks 11+: Advanced Topics", free: false, basic: false, pro: true },
    ],
  },
  {
    category: "Practice Features",
    items: [
      { name: "Real-time Java execution", free: true, basic: true, pro: true },
      { name: "Progress tracking", free: true, basic: true, pro: true },
      { name: "Daily streaks", free: true, basic: true, pro: true },
      { name: "XP & Leveling system", free: true, basic: true, pro: true },
      { name: "Leaderboards", free: true, basic: true, pro: true },
    ],
  },
  {
    category: "Learning Features",
    items: [
      { name: "Topic introductions", free: false, basic: false, pro: true },
      { name: "Conceptual explanations", free: false, basic: false, pro: true },
      { name: "Code examples", free: false, basic: false, pro: true },
    ],
  },
  {
    category: "PRO Features",
    items: [
      { name: "Missions & challenges", free: false, basic: false, pro: true },
      { name: "Advanced analytics", free: false, basic: false, pro: true },
      { name: "PRO badge", free: false, basic: false, pro: true },
      { name: "XP boosts", free: false, basic: false, pro: true },
      { name: "AI Mentor (coming soon)", free: false, basic: false, pro: true },
    ],
  },
]

const platformHighlights = [
  { icon: BookOpen, value: "10+", label: "Weeks of curriculum" },
  { icon: Rocket, value: "200+", label: "Practice questions" },
  { icon: Target, value: "5", label: "Difficulty levels" },
]

export default function PricingPage() {
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
            <Image
              src="/images/logo.png"
              alt="CodeTutor"
              width={150}
              height={40}
              className="h-10 w-auto"
              priority
            />
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
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F46E5]/20 border border-[#4F46E5]/30">
                <CreditCard className="h-4 w-4 text-[#4F46E5]" />
                <span className="text-sm font-medium text-[#4F46E5]">Simple, Transparent Pricing</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
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
              className="text-base md:text-xl text-[#9CA3AF] max-w-2xl mx-auto"
            >
              Start free with Week 1, practice with Basic, or unlock everything with PRO.
            </motion.p>
          </div>
        </section>

        {/* Plans - 3 column grid */}
        <section className="pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="relative"
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-1.5">
                        <Star className="h-3 w-3" />
                        BEST VALUE
                      </div>
                    </div>
                  )}

                  {/* Plan badge (non-popular) */}
                  {plan.badge && !plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium border"
                        style={{
                          backgroundColor: `${plan.color}20`,
                          borderColor: `${plan.color}40`,
                          color: plan.color,
                        }}
                      >
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-6 lg:p-8 h-full bg-gradient-to-br ${plan.bgGradient} border ${plan.borderColor} ${
                      plan.popular ? "shadow-[0_0_60px_rgba(245,158,11,0.15)] ring-2 ring-[#F59E0B]/30" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                      style={{
                        background: `${plan.color}20`,
                        border: `1px solid ${plan.color}40`,
                      }}
                    >
                      <plan.icon className="h-6 w-6" style={{ color: plan.color }} />
                    </div>

                    {/* Plan name */}
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-sm text-[#9CA3AF] mb-4">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl lg:text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-[#9CA3AF] text-sm">{plan.period}</span>
                      </div>
                      {plan.priceILS !== "0" && (
                        <p className="text-xs text-[#6B7280] mt-1">or {plan.priceILS} ILS/month</p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature.text} className="flex items-start gap-2.5">
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
                    <Link href={plan.ctaLink} className="block">
                      <NeonButton
                        className="w-full h-11"
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

        {/* Quick summary cards */}
        <section className="py-12 px-4 border-y border-white/5 bg-[#0F0F23]/50">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-center"
              >
                <Zap className="h-8 w-8 text-[#22D3EE] mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">FREE</h3>
                <p className="text-sm text-[#9CA3AF]">Week 1 only. Taste the system.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-center"
              >
                <BookOpen className="h-8 w-8 text-[#8B5CF6] mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">BASIC</h3>
                <p className="text-sm text-[#9CA3AF]">Weeks 1-10. Practice only.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-center"
              >
                <Crown className="h-8 w-8 text-[#F59E0B] mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">PRO</h3>
                <p className="text-sm text-[#9CA3AF]">Everything. Forever.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Platform highlights */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {platformHighlights.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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

        {/* Feature comparison - Desktop table */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Compare All Plans</h2>
              <p className="text-[#9CA3AF]">See exactly what&apos;s included in each tier</p>
            </motion.div>

            {/* Desktop table view */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="hidden md:block rounded-2xl border border-white/10 bg-[#0F0F23]/80 overflow-hidden"
            >
              {/* Header */}
              <div className="grid grid-cols-4 gap-4 p-6 border-b border-white/10 bg-white/5">
                <div className="text-sm font-medium text-[#9CA3AF]">Feature</div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-[#22D3EE]">
                    <Zap className="h-4 w-4" />
                    <span className="font-semibold">FREE</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-[#8B5CF6]">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-semibold">BASIC</span>
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
                  <div className="px-6 py-3 bg-white/5 border-b border-white/5">
                    <span className="text-sm font-semibold text-white">{category.category}</span>
                  </div>

                  {category.items.map((item, itemIndex) => (
                    <div
                      key={item.name}
                      className={`grid grid-cols-4 gap-4 px-6 py-4 ${
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
                        {item.basic ? (
                          <Check className="h-5 w-5 text-[#8B5CF6]" />
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:hidden space-y-6"
            >
              {comparisonFeatures.map((category) => (
                <div
                  key={category.category}
                  className="rounded-2xl border border-white/10 bg-[#0F0F23]/80 overflow-hidden"
                >
                  <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                    <span className="text-sm font-semibold text-white">{category.category}</span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {category.items.map((item) => (
                      <div key={item.name} className="p-4">
                        <p className="text-sm text-[#E5E7EB] mb-3">{item.name}</p>
                        <div className="flex gap-2">
                          <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg ${
                            item.free ? "bg-[#22D3EE]/10 border border-[#22D3EE]/20" : "bg-[#374151]/20 border border-[#374151]/30"
                          }`}>
                            {item.free ? (
                              <Check className="h-4 w-4 text-[#22D3EE]" />
                            ) : (
                              <X className="h-4 w-4 text-[#4B5563]" />
                            )}
                            <span className={`text-xs font-medium ${item.free ? "text-[#22D3EE]" : "text-[#6B7280]"}`}>FREE</span>
                          </div>
                          <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg ${
                            item.basic ? "bg-[#8B5CF6]/10 border border-[#8B5CF6]/20" : "bg-[#374151]/20 border border-[#374151]/30"
                          }`}>
                            {item.basic ? (
                              <Check className="h-4 w-4 text-[#8B5CF6]" />
                            ) : (
                              <X className="h-4 w-4 text-[#4B5563]" />
                            )}
                            <span className={`text-xs font-medium ${item.basic ? "text-[#8B5CF6]" : "text-[#6B7280]"}`}>BASIC</span>
                          </div>
                          <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg ${
                            item.pro ? "bg-[#F59E0B]/10 border border-[#F59E0B]/20" : "bg-[#374151]/20 border border-[#374151]/30"
                          }`}>
                            {item.pro ? (
                              <Check className="h-4 w-4 text-[#F59E0B]" />
                            ) : (
                              <X className="h-4 w-4 text-[#4B5563]" />
                            )}
                            <span className={`text-xs font-medium ${item.pro ? "text-[#F59E0B]" : "text-[#6B7280]"}`}>PRO</span>
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
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl p-8 bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/10 border border-[#F59E0B]/30"
            >
              <Crown className="h-10 w-10 text-[#F59E0B] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">Ready to unlock everything?</h2>
              <p className="text-[#9CA3AF] mb-6">
                Get full access to all curriculum, learning explanations, and PRO features.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signup?plan=pro">
                  <NeonButton
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    Get PRO Access
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

        {/* FAQ-style quick answers */}
        <section className="py-16 px-4 border-t border-white/5">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Common Questions</h2>
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-[#0F0F23]/80 border border-white/10">
                <h3 className="font-semibold text-white mb-2">What&apos;s the difference between BASIC and PRO?</h3>
                <p className="text-sm text-[#9CA3AF]">
                  BASIC gives you practice access to Weeks 1-10 (exercises only). PRO adds learning explanations, missions, analytics, and all future weeks.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#0F0F23]/80 border border-white/10">
                <h3 className="font-semibold text-white mb-2">Can I upgrade from FREE to BASIC or PRO?</h3>
                <p className="text-sm text-[#9CA3AF]">
                  Yes! You can upgrade anytime. Your progress will be preserved.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#0F0F23]/80 border border-white/10">
                <h3 className="font-semibold text-white mb-2">Is there a student discount?</h3>
                <p className="text-sm text-[#9CA3AF]">
                  Contact us with your student ID for special pricing options.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <LegalFooter variant="compact" />
    </div>
  )
}
