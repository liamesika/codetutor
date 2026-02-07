"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { NeonButton } from "@/components/ui/neon-button"
import { LegalFooter } from "@/components/shared/legal-footer"
import { PublicHeader } from "@/components/shared/public-header"
import { LanguageProvider, useLanguage } from "@/lib/i18n"
import {
  Check,
  X,
  Crown,
  Sparkles,
  Play,
  ArrowRight,
  BookOpen,
  Rocket,
  Target,
} from "lucide-react"

/* ─── Translations ─── */

const en = {
  badge: "Simple Pricing",
  title: "Choose Your",
  titleHighlight: "Marathon Plan",
  subtitle:
    "Full marathon access with Basic, or add a personal AI Mentor with Pro.",
  basic: {
    name: "BASIC",
    desc: "Full marathon access",
    price: "79",
    period: "one-time",
    features: [
      { text: "All 10 days of content", included: true },
      { text: "87+ practice questions", included: true },
      { text: "Real-time Java execution", included: true },
      { text: "Progress tracking & streaks", included: true },
      { text: "Leaderboards & achievements", included: true },
      { text: "Personal AI Mentor", included: false },
      { text: "Error diagnosis & hints", included: false },
      { text: "Guided debugging", included: false },
    ],
    cta: "Get Basic Access",
  },
  pro: {
    name: "PRO",
    desc: "Marathon + AI Mentor",
    price: "149",
    period: "one-time",
    badge: "RECOMMENDED",
    features: [
      { text: "All 10 days of content", included: true },
      { text: "87+ practice questions", included: true },
      { text: "Real-time Java execution", included: true },
      { text: "Progress tracking & streaks", included: true },
      { text: "Leaderboards & achievements", included: true },
      { text: "Personal AI Mentor", included: true },
      { text: "Error diagnosis & hints", included: true },
      { text: "Guided debugging", included: true },
    ],
    cta: "Upgrade to PRO",
  },
  compare: {
    title: "Compare Plans",
    subtitle: "See exactly what's included in each tier",
    categories: [
      {
        name: "Content",
        items: [
          { name: "Day 1 (free preview)", basic: true, pro: true },
          { name: "Days 2-10 full content", basic: true, pro: true },
          { name: "87+ practice questions", basic: true, pro: true },
        ],
      },
      {
        name: "Practice Features",
        items: [
          { name: "Real-time Java execution", basic: true, pro: true },
          { name: "Progress tracking", basic: true, pro: true },
          { name: "Daily streaks & XP", basic: true, pro: true },
          { name: "Leaderboards", basic: true, pro: true },
        ],
      },
      {
        name: "AI Mentor",
        items: [
          { name: "Personal AI mentor", basic: false, pro: true },
          { name: "Error diagnosis", basic: false, pro: true },
          { name: "Progressive hints", basic: false, pro: true },
          { name: "Guided debugging", basic: false, pro: true },
          { name: "Guiding questions", basic: false, pro: true },
        ],
      },
    ],
  },
  faq: {
    title: "Common Questions",
    items: [
      {
        q: "What's the difference between Basic and Pro?",
        a: "Basic gives you full access to all 10 days of practice content. Pro adds a personal AI Mentor that analyzes your mistakes, gives progressive hints, and guides you through debugging — without revealing the answer.",
      },
      {
        q: "How does payment work?",
        a: "Payment is processed externally via PayPlus. After payment, you'll receive an access code to activate your plan.",
      },
      {
        q: "Can I upgrade from Basic to Pro?",
        a: "Yes! You can upgrade anytime. Your progress will be preserved.",
      },
      {
        q: "Is Day 1 really free?",
        a: "Yes. Day 1 is completely free with no credit card required. Experience the full platform before committing.",
      },
    ],
  },
  cta: {
    title: "Ready to start preparing?",
    subtitle: "Join the marathon and ace your CS exam.",
    primary: "Get PRO Access",
    secondary: "Try Demo",
  },
  highlights: [
    { value: "10", label: "Days of content" },
    { value: "87+", label: "Practice questions" },
    { value: "5", label: "Difficulty levels" },
  ],
}

const he = {
  badge: "מחירון פשוט",
  title: "בחרו את",
  titleHighlight: "תוכנית המרתון",
  subtitle:
    "גישה מלאה למרתון עם Basic, או הוסיפו AI Mentor אישי עם Pro.",
  basic: {
    name: "BASIC",
    desc: "גישה מלאה למרתון",
    price: "79",
    period: "חד-פעמי",
    features: [
      { text: "כל 10 ימי התוכן", included: true },
      { text: "87+ שאלות תרגול", included: true },
      { text: "הרצת Java בזמן אמת", included: true },
      { text: "מעקב התקדמות ורצפים", included: true },
      { text: "לוחות תוצאות והישגים", included: true },
      { text: "AI Mentor אישי", included: false },
      { text: "אבחון שגיאות ורמזים", included: false },
      { text: "ניפוי באגים מודרך", included: false },
    ],
    cta: "קבלו גישה Basic",
  },
  pro: {
    name: "PRO",
    desc: "מרתון + AI Mentor",
    price: "149",
    period: "חד-פעמי",
    badge: "מומלץ",
    features: [
      { text: "כל 10 ימי התוכן", included: true },
      { text: "87+ שאלות תרגול", included: true },
      { text: "הרצת Java בזמן אמת", included: true },
      { text: "מעקב התקדמות ורצפים", included: true },
      { text: "לוחות תוצאות והישגים", included: true },
      { text: "AI Mentor אישי", included: true },
      { text: "אבחון שגיאות ורמזים", included: true },
      { text: "ניפוי באגים מודרך", included: true },
    ],
    cta: "שדרגו ל-PRO",
  },
  compare: {
    title: "השוו תוכניות",
    subtitle: "ראו בדיוק מה כלול בכל מסלול",
    categories: [
      {
        name: "תוכן",
        items: [
          { name: "יום 1 (תצוגה מקדימה חינם)", basic: true, pro: true },
          { name: "ימים 2-10 תוכן מלא", basic: true, pro: true },
          { name: "87+ שאלות תרגול", basic: true, pro: true },
        ],
      },
      {
        name: "תכונות תרגול",
        items: [
          { name: "הרצת Java בזמן אמת", basic: true, pro: true },
          { name: "מעקב התקדמות", basic: true, pro: true },
          { name: "רצפים יומיים ו-XP", basic: true, pro: true },
          { name: "לוחות תוצאות", basic: true, pro: true },
        ],
      },
      {
        name: "AI Mentor",
        items: [
          { name: "AI Mentor אישי", basic: false, pro: true },
          { name: "אבחון שגיאות", basic: false, pro: true },
          { name: "רמזים מדורגים", basic: false, pro: true },
          { name: "ניפוי באגים מודרך", basic: false, pro: true },
          { name: "שאלות מכוונות", basic: false, pro: true },
        ],
      },
    ],
  },
  faq: {
    title: "שאלות נפוצות",
    items: [
      {
        q: "מה ההבדל בין Basic ל-Pro?",
        a: "Basic נותן גישה מלאה לכל 10 ימי התרגול. Pro מוסיף AI Mentor אישי שמנתח את הטעויות שלכם, נותן רמזים מדורגים ומדריך אתכם — בלי לחשוף את התשובה.",
      },
      {
        q: "איך התשלום עובד?",
        a: "התשלום מתבצע באופן חיצוני דרך PayPlus. לאחר התשלום תקבלו קוד גישה להפעלת התוכנית.",
      },
      {
        q: "אפשר לשדרג מ-Basic ל-Pro?",
        a: "כן! אפשר לשדרג בכל עת. ההתקדמות שלכם תישמר.",
      },
      {
        q: "יום 1 באמת חינם?",
        a: "כן. יום 1 חינמי לחלוטין ללא צורך בכרטיס אשראי. התנסו בפלטפורמה לפני התחייבות.",
      },
    ],
  },
  cta: {
    title: "מוכנים להתחיל להתכונן?",
    subtitle: "הצטרפו למרתון והצליחו במבחן ה-CS.",
    primary: "קבלו גישה PRO",
    secondary: "נסו דמו",
  },
  highlights: [
    { value: "10", label: "ימי תוכן" },
    { value: "87+", label: "שאלות תרגול" },
    { value: "5", label: "רמות קושי" },
  ],
}

const highlightIcons = [BookOpen, Rocket, Target]

export default function PricingPage() {
  return (
    <LanguageProvider>
      <PricingContent />
    </LanguageProvider>
  )
}

function PricingContent() {
  const { locale } = useLanguage()
  const t = locale === "he" ? he : en

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B]">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.08),transparent_50%)]" />
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#F59E0B]/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <PublicHeader />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F46E5]/20 border border-[#4F46E5]/30">
                <Sparkles className="h-4 w-4 text-[#4F46E5]" />
                <span className="text-sm font-medium text-[#4F46E5]">{t.badge}</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              {t.title}{" "}
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
                {t.titleHighlight}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-xl text-[#9CA3AF] max-w-2xl mx-auto"
            >
              {t.subtitle}
            </motion.p>
          </div>
        </section>

        {/* ── Plans ── */}
        <section className="pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* Basic */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl p-6 lg:p-8 h-full bg-gradient-to-br from-[#8B5CF6]/10 to-[#6366F1]/5 border border-[#8B5CF6]/30"
              >
                <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-[#8B5CF6]/20 border border-[#8B5CF6]/40">
                  <BookOpen className="h-6 w-6 text-[#8B5CF6]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{t.basic.name}</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">{t.basic.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl lg:text-4xl font-bold text-white">₪{t.basic.price}</span>
                  <p className="text-xs text-[#6B7280] mt-1">{t.basic.period}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {t.basic.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5">
                      {f.included ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#8B5CF6]/20">
                          <Check className="h-3 w-3 text-[#8B5CF6]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#374151]/50">
                          <X className="h-3 w-3 text-[#6B7280]" />
                        </div>
                      )}
                      <span className={`text-sm ${f.included ? "text-[#E5E7EB]" : "text-[#6B7280]"}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup?plan=basic" className="block">
                  <NeonButton className="w-full h-11" variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    {t.basic.cta}
                  </NeonButton>
                </Link>
              </motion.div>

              {/* Pro */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative rounded-2xl p-6 lg:p-8 h-full bg-gradient-to-br from-[#F59E0B]/15 to-[#EF4444]/5 border border-[#F59E0B]/40 shadow-[0_0_60px_rgba(245,158,11,0.15)] ring-2 ring-[#F59E0B]/30"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="h-3 w-3" />
                    {t.pro.badge}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-[#F59E0B]/20 border border-[#F59E0B]/40">
                  <Crown className="h-6 w-6 text-[#F59E0B]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{t.pro.name}</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">{t.pro.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl lg:text-4xl font-bold text-white">₪{t.pro.price}</span>
                  <p className="text-xs text-[#6B7280] mt-1">{t.pro.period}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {t.pro.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5">
                      {f.included ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#F59E0B]/20">
                          <Check className="h-3 w-3 text-[#F59E0B]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#374151]/50">
                          <X className="h-3 w-3 text-[#6B7280]" />
                        </div>
                      )}
                      <span className={`text-sm ${f.included ? "text-[#E5E7EB]" : "text-[#6B7280]"}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup?plan=pro" className="block">
                  <NeonButton className="w-full h-11" variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    {t.pro.cta}
                  </NeonButton>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Highlights ── */}
        <section className="py-12 px-4 border-y border-white/5 bg-[#0F0F23]/50">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {t.highlights.map((stat, i) => {
                const Icon = highlightIcons[i]
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#4F46E5]/20 border border-[#4F46E5]/30 flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-[#4F46E5]" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-white mb-0.5 md:mb-1">{stat.value}</p>
                    <p className="text-xs md:text-sm text-[#6B7280]">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Comparison — Desktop ── */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t.compare.title}</h2>
              <p className="text-[#9CA3AF]">{t.compare.subtitle}</p>
            </motion.div>

            {/* Desktop table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="hidden md:block rounded-2xl border border-white/10 bg-[#0F0F23]/80 overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10 bg-white/5">
                <div className="text-sm font-medium text-[#9CA3AF]" />
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
              {t.compare.categories.map((cat) => (
                <div key={cat.name}>
                  <div className="px-6 py-3 bg-white/5 border-b border-white/5">
                    <span className="text-sm font-semibold text-white">{cat.name}</span>
                  </div>
                  {cat.items.map((item, idx) => (
                    <div
                      key={item.name}
                      className={`grid grid-cols-3 gap-4 px-6 py-4 ${idx < cat.items.length - 1 ? "border-b border-white/5" : ""}`}
                    >
                      <div className="text-sm text-[#E5E7EB]">{item.name}</div>
                      <div className="flex justify-center">
                        {item.basic ? <Check className="h-5 w-5 text-[#8B5CF6]" /> : <X className="h-5 w-5 text-[#4B5563]" />}
                      </div>
                      <div className="flex justify-center">
                        {item.pro ? <Check className="h-5 w-5 text-[#F59E0B]" /> : <X className="h-5 w-5 text-[#4B5563]" />}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>

            {/* Mobile stacked cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:hidden space-y-6"
            >
              {t.compare.categories.map((cat) => (
                <div key={cat.name} className="rounded-2xl border border-white/10 bg-[#0F0F23]/80 overflow-hidden">
                  <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                    <span className="text-sm font-semibold text-white">{cat.name}</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {cat.items.map((item) => (
                      <div key={item.name} className="p-4">
                        <p className="text-sm text-[#E5E7EB] mb-3">{item.name}</p>
                        <div className="flex gap-2">
                          <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg ${item.basic ? "bg-[#8B5CF6]/10 border border-[#8B5CF6]/20" : "bg-[#374151]/20 border border-[#374151]/30"}`}>
                            {item.basic ? <Check className="h-4 w-4 text-[#8B5CF6]" /> : <X className="h-4 w-4 text-[#4B5563]" />}
                            <span className={`text-xs font-medium ${item.basic ? "text-[#8B5CF6]" : "text-[#6B7280]"}`}>BASIC</span>
                          </div>
                          <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg ${item.pro ? "bg-[#F59E0B]/10 border border-[#F59E0B]/20" : "bg-[#374151]/20 border border-[#374151]/30"}`}>
                            {item.pro ? <Check className="h-4 w-4 text-[#F59E0B]" /> : <X className="h-4 w-4 text-[#4B5563]" />}
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

        {/* ── FAQ ── */}
        <section className="py-16 px-4 border-t border-white/5">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-white text-center mb-8">{t.faq.title}</h2>
            <div className="space-y-4">
              {t.faq.items.map((item, i) => (
                <div key={i} className="p-5 rounded-xl bg-[#0F0F23]/80 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                  <p className="text-sm text-[#9CA3AF]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl p-8 bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/10 border border-[#F59E0B]/30"
            >
              <Crown className="h-10 w-10 text-[#F59E0B] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">{t.cta.title}</h2>
              <p className="text-[#9CA3AF] mb-6">{t.cta.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signup?plan=pro">
                  <NeonButton variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    {t.cta.primary}
                  </NeonButton>
                </Link>
                <Link href="/demo">
                  <NeonButton variant="ghost" size="lg" leftIcon={<Play className="h-5 w-5" />}>
                    {t.cta.secondary}
                  </NeonButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <LegalFooter variant="compact" />
    </div>
  )
}
