"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { NeonButton } from "@/components/ui/neon-button"
import { LegalFooter } from "@/components/shared/legal-footer"
import { PublicHeader } from "@/components/shared/public-header"
import { LanguageProvider, useLanguage } from "@/lib/i18n"
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Rocket,
  Code2,
  Crown,
  Calendar,
  GraduationCap,
  Check,
  X,
} from "lucide-react"

/* ─── Translations ─── */

const en = {
  badge: "CS Exam Marathon 2026",
  heroTitle: "10 Days to",
  heroHighlight: "Exam Ready",
  heroSub:
    "An intensive 10-day Java exam preparation marathon. Daily practice, structured topics, real test cases, and optional AI mentoring to ace your CS exam.",
  ctaPrimary: "Start the Marathon",
  ctaSecondary: "View Pricing",
  ctaNote: "Day 1 is free. No credit card required.",
  trust: [
    "10 Structured Days",
    "87+ Questions",
    "Real Java Sandbox",
    "Instant Feedback",
  ],
  stats: [
    { value: "10", label: "Practice Days" },
    { value: "87+", label: "Questions" },
    { value: "21", label: "Topics Covered" },
    { value: "5", label: "Difficulty Levels" },
  ],
  daysTitle: "Your 10-Day",
  daysHighlight: "Battle Plan",
  daysSub:
    "Each day covers specific exam topics, building from fundamentals to advanced OOP.",
  dayFree: "FREE",
  days: [
    { title: "Fundamentals", topics: ["Variables", "Data Types", "I/O"] },
    { title: "Control Flow", topics: ["Conditionals", "Basic Loops"] },
    { title: "Advanced Loops", topics: ["Nested Loops", "Patterns"] },
    { title: "Arrays", topics: ["1D Arrays", "2D Arrays"] },
    { title: "Functions", topics: ["Methods", "Scope", "Returns"] },
    { title: "Graphics", topics: ["Drawing", "Events"] },
    { title: "OOP Basics", topics: ["Classes", "Objects"] },
    { title: "OOP Advanced", topics: ["Encapsulation", "Design"] },
    { title: "Inheritance", topics: ["Polymorphism", "Interfaces"] },
    { title: "Integration", topics: ["Mixed Topics", "Exam Prep"] },
  ],
  plansTitle: "Two Plans,",
  plansHighlight: "One Goal",
  plansSub: "Choose the plan that fits your preparation style.",
  basic: {
    name: "BASIC",
    desc: "Full marathon access",
    price: "79",
    features: [
      "All 10 days of content",
      "87+ practice questions",
      "Real Java execution",
      "Progress tracking & streaks",
      "Leaderboards",
    ],
    cta: "Get Basic Access",
    noMentor: "No AI Mentor",
  },
  pro: {
    name: "PRO",
    desc: "Marathon + AI Mentor",
    price: "149",
    badge: "RECOMMENDED",
    features: [
      "Everything in Basic",
      "Personal AI Mentor",
      "Error diagnosis & hints",
      "Progressive hint system",
      "Guided debugging",
    ],
    cta: "Upgrade to PRO",
  },
  currency: "₪",
  oneTime: "one-time",
  howTitle: "How It",
  howHighlight: "Works",
  howSub: "Three simple steps to marathon success",
  steps: [
    {
      title: "Pick Your Day",
      desc: "Follow the 10-day structured plan — each day covers specific exam topics.",
    },
    {
      title: "Code & Submit",
      desc: "Write Java in our browser editor. Get instant compilation and test feedback.",
    },
    {
      title: "Level Up",
      desc: "Track progress, reveal hints when stuck, and use AI Mentor (PRO) for guided help.",
    },
  ],
  videoTitle: "See It in",
  videoHighlight: "Action",
  videoSub: "A quick look at what the marathon experience looks like.",
  finalTitle: "Ready to Ace Your",
  finalHighlight: "CS Exam",
  finalSub: "Join the marathon and start practicing today.",
  finalCta: "Start the Marathon",
  finalNote: "Day 1 is free. No credit card required.",
}

const he = {
  badge: "מרתון מבחנים CS 2026",
  heroTitle: "מרתון 10 ימים",
  heroHighlight: "ואתם מוכנים למבחן",
  heroSub:
    "מרתון הכנה אינטנסיבי בן 10 ימים למבחן Java. תרגול יומי, נושאים מובנים, טסטים אמיתיים וליווי AI אופציונלי.",
  ctaPrimary: "התחילו את המרתון",
  ctaSecondary: "צפו במחירון",
  ctaNote: "יום 1 חינם. ללא צורך בכרטיס אשראי.",
  trust: [
    "10 ימים מובנים",
    "87+ שאלות",
    "סביבת Java אמיתית",
    "פידבק מיידי",
  ],
  stats: [
    { value: "10", label: "ימי תרגול" },
    { value: "87+", label: "שאלות" },
    { value: "21", label: "נושאים" },
    { value: "5", label: "רמות קושי" },
  ],
  daysTitle: "תוכנית הקרב",
  daysHighlight: "10 ימים",
  daysSub: "כל יום מכסה נושאים ספציפיים, מיסודות ועד OOP מתקדם.",
  dayFree: "חינם",
  days: [
    { title: "יסודות", topics: ["משתנים", "טיפוסים", "קלט/פלט"] },
    { title: "בקרת זרימה", topics: ["תנאים", "לולאות"] },
    { title: "לולאות מתקדמות", topics: ["מקוננות", "תבניות"] },
    { title: "מערכים", topics: ["חד-ממדי", "דו-ממדי"] },
    { title: "פונקציות", topics: ["מתודות", "Scope", "החזרה"] },
    { title: "גרפיקה", topics: ["ציור", "אירועים"] },
    { title: "OOP בסיסי", topics: ["מחלקות", "אובייקטים"] },
    { title: "OOP מתקדם", topics: ["אנקפסולציה", "עיצוב"] },
    { title: "ירושה", topics: ["פולימורפיזם", "ממשקים"] },
    { title: "אינטגרציה", topics: ["נושאים משולבים", "הכנה למבחן"] },
  ],
  plansTitle: "שתי תוכניות,",
  plansHighlight: "מטרה אחת",
  plansSub: "בחרו את התוכנית שמתאימה לכם.",
  basic: {
    name: "BASIC",
    desc: "גישה מלאה למרתון",
    price: "79",
    features: [
      "כל 10 ימי התוכן",
      "87+ שאלות תרגול",
      "הרצת Java אמיתית",
      "מעקב התקדמות ורצפים",
      "לוחות תוצאות",
    ],
    cta: "קבלו גישה Basic",
    noMentor: "ללא AI Mentor",
  },
  pro: {
    name: "PRO",
    desc: "מרתון + AI Mentor",
    price: "149",
    badge: "מומלץ",
    features: [
      "הכל ב-Basic",
      "AI Mentor אישי",
      "אבחון שגיאות ורמזים",
      "רמזים מדורגים",
      "ניפוי באגים מודרך",
    ],
    cta: "שדרגו ל-PRO",
  },
  currency: "₪",
  oneTime: "חד-פעמי",
  howTitle: "איך זה",
  howHighlight: "עובד",
  howSub: "שלושה צעדים פשוטים להצלחה",
  steps: [
    {
      title: "בחרו יום",
      desc: "עקבו אחר תוכנית 10 הימים המובנית — מיסודות ועד OOP.",
    },
    {
      title: "כתבו והגישו",
      desc: "כתבו Java בעורך שלנו עם קומפילציה ופידבק מיידי.",
    },
    {
      title: "התקדמו",
      desc: "עקבו אחר ההתקדמות והשתמשו ב-AI Mentor (PRO) כשנתקעים.",
    },
  ],
  videoTitle: "צפו במערכת",
  videoHighlight: "בפעולה",
  videoSub: "הצצה קצרה לחוויית המרתון מבפנים.",
  finalTitle: "מוכנים להצליח",
  finalHighlight: "במבחן CS",
  finalSub: "הצטרפו למרתון והתחילו לתרגל היום.",
  finalCta: "התחילו את המרתון",
  finalNote: "יום 1 חינם. ללא צורך בכרטיס אשראי.",
}

const stepIcons = [Calendar, Code2, Rocket]

export default function HomePage() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  )
}

function HomeContent() {
  const { locale } = useLanguage()
  const t = locale === "he" ? he : en

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B]">
      <PublicHeader />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative min-h-[100dvh] flex flex-col justify-center py-20 md:py-32 px-4 overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0 -z-10">
            {/* Base gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.2),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.12),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.08),transparent_40%)]" />

            {/* Animated neon orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4F46E5]/25 rounded-full blur-[100px]"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3], x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#22D3EE]/20 rounded-full blur-[100px]"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2], x: [0, -25, 0], y: [0, 15, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[120px]"
              animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />

            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

            {/* Rising neon bubbles */}
            {[...Array(10)].map((_, i) => {
              const sizes = [4, 6, 3, 8, 5, 3, 7, 4, 6, 5]
              const lefts = [8, 22, 38, 52, 68, 82, 15, 45, 72, 92]
              const colors = ["#4F46E5", "#22D3EE", "#8B5CF6", "#22D3EE", "#4F46E5", "#8B5CF6", "#22D3EE", "#4F46E5", "#8B5CF6", "#22D3EE"]
              const durations = [12, 16, 10, 18, 14, 11, 15, 13, 17, 12]
              const size = sizes[i]
              return (
                <motion.div
                  key={`bubble-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    left: `${lefts[i]}%`,
                    bottom: -20,
                    background: `radial-gradient(circle at 30% 30%, ${colors[i]}40, ${colors[i]}15)`,
                    border: `1px solid ${colors[i]}30`,
                    boxShadow: `0 0 ${size * 2}px ${colors[i]}25`,
                  }}
                  animate={{
                    y: [0, -1200],
                    x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 3), 0, (i % 2 === 0 ? -1 : 1) * (8 + i * 2), 0],
                    opacity: [0, 0.7, 0.5, 0.3, 0],
                    scale: [0.5, 1, 1.1, 0.9, 0.6],
                  }}
                  transition={{
                    duration: durations[i],
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: i * 1.5,
                  }}
                />
              )
            })}

            {/* Horizontal neon line accent */}
            <motion.div
              className="absolute top-[15%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4F46E5]/30 to-transparent"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22D3EE]/20 to-transparent"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>

          <div className="container mx-auto max-w-5xl text-center flex-1 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="outline" className="mb-6 bg-[#4F46E5]/10 border-[#4F46E5]/30 text-white px-4 py-1.5 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                <Sparkles className="h-3.5 w-3.5 me-2 text-[#22D3EE]" />
                {t.badge}
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {t.heroTitle}{" "}
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                {t.heroHighlight}
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-[#9CA3AF] max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t.heroSub}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/pricing">
                <NeonButton variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  {t.ctaPrimary}
                </NeonButton>
              </Link>
              <Link href="/pricing">
                <NeonButton variant="secondary" size="lg">
                  {t.ctaSecondary}
                </NeonButton>
              </Link>
            </motion.div>

            <motion.p
              className="text-sm text-[#6B7280]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t.ctaNote}
            </motion.p>

            <motion.div
              className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {t.trust.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                  <CheckCircle2 className="h-4 w-4 text-[#22D3EE] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator for mobile */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:bottom-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
              animate={{ borderColor: ["rgba(255,255,255,0.2)", "rgba(79,70,229,0.5)", "rgba(255,255,255,0.2)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]"
                animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ boxShadow: "0 0 6px 2px rgba(34,211,238,0.5)" }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ── Stats ── */}
        <section className="py-12 border-y border-white/5 bg-[#0F0F23]/50">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {t.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#9CA3AF]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Demo Video ── */}
        <section className="py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t.videoTitle}{" "}
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
                  {t.videoHighlight}
                </span>
              </h2>
              <p className="text-[#9CA3AF] max-w-2xl mx-auto">{t.videoSub}</p>
            </motion.div>

            <motion.div
              className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(79,70,229,0.15)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <video
                src="/images/VID.mov"
                autoPlay
                muted
                loop
                playsInline
                className="w-full"
              />
            </motion.div>
          </div>
        </section>

        {/* ── 10-Day Battle Plan ── */}
        <section className="py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t.daysTitle}{" "}
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
                  {t.daysHighlight}
                </span>
              </h2>
              <p className="text-[#9CA3AF] max-w-2xl mx-auto">{t.daysSub}</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {t.days.map((day, i) => (
                <motion.div
                  key={i}
                  className="relative rounded-xl p-5 bg-white/[0.03] border border-white/10 hover:border-[#4F46E5]/40 transition-colors group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-[0_0_20px_rgba(79,70,229,0.3)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-shadow">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-white">{day.title}</h3>
                        {i === 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/30">
                            {t.dayFree}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {day.topics.map((topic) => (
                          <span
                            key={topic}
                            className="text-xs px-2 py-0.5 rounded-md bg-[#4F46E5]/10 text-[#9CA3AF] border border-[#4F46E5]/20"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Plans ── */}
        <section className="py-20 md:py-28 px-4 bg-[#0F0F23]/50">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t.plansTitle}{" "}
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
                  {t.plansHighlight}
                </span>
              </h2>
              <p className="text-[#9CA3AF] max-w-xl mx-auto">{t.plansSub}</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* Basic */}
              <motion.div
                className="rounded-2xl p-6 lg:p-8 bg-gradient-to-br from-[#8B5CF6]/10 to-[#6366F1]/5 border border-[#8B5CF6]/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-[#8B5CF6]/20 border border-[#8B5CF6]/40">
                  <BookOpen className="h-6 w-6 text-[#8B5CF6]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{t.basic.name}</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">{t.basic.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">₪{t.basic.price}</span>
                  <p className="text-xs text-[#6B7280] mt-1">{t.oneTime}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {t.basic.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#8B5CF6]/20">
                        <Check className="h-3 w-3 text-[#8B5CF6]" />
                      </div>
                      <span className="text-sm text-[#E5E7EB]">{f}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#374151]/50">
                      <X className="h-3 w-3 text-[#6B7280]" />
                    </div>
                    <span className="text-sm text-[#6B7280]">{t.basic.noMentor}</span>
                  </li>
                </ul>
                <Link href="/signup?plan=basic" className="block">
                  <NeonButton className="w-full h-11" variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    {t.basic.cta}
                  </NeonButton>
                </Link>
              </motion.div>

              {/* Pro */}
              <motion.div
                className="relative rounded-2xl p-6 lg:p-8 bg-gradient-to-br from-[#F59E0B]/15 to-[#EF4444]/5 border border-[#F59E0B]/40 shadow-[0_0_60px_rgba(245,158,11,0.15)] ring-2 ring-[#F59E0B]/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
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
                  <span className="text-4xl font-bold text-white">₪{t.pro.price}</span>
                  <p className="text-xs text-[#6B7280] mt-1">{t.oneTime}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {t.pro.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#F59E0B]/20">
                        <Check className="h-3 w-3 text-[#F59E0B]" />
                      </div>
                      <span className="text-sm text-[#E5E7EB]">{f}</span>
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

        {/* ── How It Works ── */}
        <section className="py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t.howTitle}{" "}
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
                  {t.howHighlight}
                </span>
              </h2>
              <p className="text-[#9CA3AF] max-w-2xl mx-auto">{t.howSub}</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {t.steps.map((step, i) => {
                const Icon = stepIcons[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <div className="rounded-2xl p-6 text-center border border-white/10 bg-white/[0.03] hover:border-[#4F46E5]/30 transition-colors">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#4F46E5]/20 text-[#4F46E5] font-bold text-sm mb-3">
                        {i + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-[#9CA3AF]">{step.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-20 md:py-28 px-4 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4F46E5]/10 to-[#4F46E5]/5" />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4F46E5]/20 rounded-full blur-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.div
            className="container mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl p-10 md:p-14 border border-white/10 bg-[#0F0F23]/80 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(79,70,229,0.4)]">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t.finalTitle}{" "}
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] bg-clip-text text-transparent">
                  {t.finalHighlight}
                </span>
                ?
              </h2>
              <p className="text-[#9CA3AF] mb-8 text-lg max-w-xl mx-auto">{t.finalSub}</p>
              <Link href="/pricing">
                <NeonButton variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  {t.finalCta}
                </NeonButton>
              </Link>
              <p className="text-sm text-[#6B7280] mt-6">{t.finalNote}</p>
            </div>
          </motion.div>
        </section>
      </main>

      <LegalFooter variant="compact" />
    </div>
  )
}
