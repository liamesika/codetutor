"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NeonButton } from "@/components/ui/neon-button"
import { LegalFooter } from "@/components/shared/legal-footer"
import { cn } from "@/lib/utils"
import {
  Code2,
  Zap,
  Target,
  Brain,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Trophy,
  Play,
  BarChart3,
  GraduationCap,
  Rocket,
  Users,
  Star,
  ChevronRight,
} from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Feature tabs data
const featureTabs = [
  {
    id: "practice",
    label: "Practice",
    icon: Code2,
    title: "In-Browser Code Editor",
    description:
      "Write, compile, and run Java code directly in your browser with our Monaco-powered editor. Get instant feedback with real test case validation.",
    features: [
      "Syntax highlighting & auto-completion",
      "Real-time compilation with error messages",
      "Test cases with pass/fail feedback",
      "Resizable editor panels",
    ],
  },
  {
    id: "courses",
    label: "Courses",
    icon: BookOpen,
    title: "Structured Curriculum",
    description:
      "Follow a proven path from beginner to proficient Java developer. 13 weeks of university-level material organized into digestible topics.",
    features: [
      "200+ curated questions",
      "Progressive difficulty levels",
      "Topics aligned with CS curriculum",
      "Unlock content as you progress",
    ],
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: Trophy,
    title: "Gamified Learning",
    description:
      "Stay motivated with XP points, streaks, and achievements. Track your progress and compete with yourself to master Java.",
    features: [
      "Earn XP for every solved problem",
      "Maintain daily streaks",
      "Unlock badges and achievements",
      "Track skill levels per topic",
    ],
  },
  {
    id: "stats",
    label: "Stats",
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Understand your learning patterns with comprehensive statistics. Identify weak areas and focus your practice where it matters most.",
    features: [
      "Pass rate tracking per topic",
      "Skill level visualization",
      "Weak areas identification",
      "Progress over time charts",
    ],
  },
]

// How it works steps
const howItWorksSteps = [
  {
    step: 1,
    title: "Pick a Topic",
    description:
      "Choose from 13 weeks of curated Java content, from command line basics to advanced OOP concepts.",
    icon: BookOpen,
  },
  {
    step: 2,
    title: "Code & Submit",
    description:
      "Write your solution in our Monaco editor and submit for instant compilation and test validation.",
    icon: Code2,
  },
  {
    step: 3,
    title: "Learn & Level Up",
    description:
      "Get detailed feedback, use hints when stuck, and earn XP as you progress toward mastery.",
    icon: Rocket,
  },
]

// Social proof stats
const socialProofStats = [
  { value: "200+", label: "Practice Questions" },
  { value: "13", label: "Week Curriculum" },
  { value: "5", label: "Difficulty Levels" },
  { value: "∞", label: "Learning Potential" },
]

export default function HomePage() {
  const [activeFeatureTab, setActiveFeatureTab] = useState("practice")
  const activeFeature = featureTabs.find((t) => t.id === activeFeatureTab)!

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/logo.png"
              alt="CodeTutor"
              width={150}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/demo"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              Try Demo
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <NeonButton variant="ghost" size="sm">
                Log in
              </NeonButton>
            </Link>
            <Link href="/signup">
              <NeonButton variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Get Started
              </NeonButton>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-4 overflow-hidden">
          {/* Animated gradient mesh background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.1),transparent_50%)]" />
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4F46E5]/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#22D3EE]/20 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>

          <div className="container mx-auto max-w-5xl text-center">
            <motion.div {...fadeInUp}>
              <Badge
                variant="outline"
                className="mb-6 bg-[#4F46E5]/10 border-[#4F46E5]/30 text-foreground px-4 py-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 mr-2 text-[#22D3EE]" />
                Java Mastery for CS Students
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Learn Java the{" "}
              <span className="gradient-neon-text">Smart Way</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Master Java programming with adaptive learning, real-time code execution,
              and personalized feedback. Perfect for CS students from week 1 to mastery.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
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
                <NeonButton variant="secondary" size="lg" leftIcon={<Play className="h-5 w-5" />}>
                  Try Demo
                </NeonButton>
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center justify-center gap-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-muted-foreground">No credit card required</span>
              <span className="text-muted-foreground/50">|</span>
              <Link href="/pricing" className="text-[#22D3EE] hover:text-[#4F46E5] transition-colors">
                View pricing
              </Link>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#22D3EE]" />
                <span>Real Java Sandbox</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#22D3EE]" />
                <span>Adaptive Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#22D3EE]" />
                <span>200+ Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#22D3EE]" />
                <span>Instant Feedback</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Social Proof Stats */}
        <section className="py-12 border-y border-border/50 bg-card/30">
          <div className="container mx-auto max-w-5xl px-4">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {socialProofStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold gradient-neon-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Feature Tabs Section */}
        <section id="features" className="py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to <span className="gradient-neon-text">Succeed</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built by educators, for students. Our platform adapts to your learning style.
              </p>
            </motion.div>

            {/* Tab buttons */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {featureTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeFeatureTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFeatureTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-[#4F46E5] text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                        : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </motion.div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeatureTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-8 items-center"
              >
                <div className="order-2 md:order-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{activeFeature.title}</h3>
                  <p className="text-muted-foreground mb-6">{activeFeature.description}</p>
                  <ul className="space-y-3">
                    {activeFeature.features.map((feature, index) => (
                      <motion.li
                        key={feature}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-5 h-5 rounded-full bg-[#4F46E5]/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-3 w-3 text-[#22D3EE]" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href="/signup">
                      <NeonButton
                        variant="secondary"
                        size="md"
                        rightIcon={<ChevronRight className="h-4 w-4" />}
                      >
                        Get Started
                      </NeonButton>
                    </Link>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="glass-card p-8 aspect-video flex items-center justify-center">
                    <activeFeature.icon className="h-24 w-24 text-[#4F46E5]/50" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-28 px-4 bg-card/30">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It <span className="gradient-neon-text">Works</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to level up your Java skills
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorksSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.step}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {index < howItWorksSteps.length - 1 && (
                      <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[#4F46E5]/50 to-transparent" />
                    )}
                    <div className="glass-card glass-card-hover p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#4F46E5]/20 text-[#4F46E5] font-bold text-sm mb-3">
                        {step.step}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section id="curriculum" className="py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Structured <span className="gradient-neon-text">Curriculum</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Follow a proven path from beginner to proficient Java developer.
              </p>
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  week: 1,
                  title: "Getting Started",
                  topics: ["Command Line", "Compile & Run", "Git Basics", "Error Types"],
                },
                {
                  week: 2,
                  title: "Strings & Control Flow",
                  topics: ["String Methods", "Conditionals", "Loops", "Variable Scope"],
                },
                {
                  week: 3,
                  title: "Functions & Methods",
                  topics: ["Function Basics", "Return Values", "Overloading", "Validation"],
                },
                {
                  week: 4,
                  title: "Arrays",
                  topics: ["Array Basics", "Array Operations", "Command Line Args", "Pass by Value"],
                },
                {
                  week: 5,
                  title: "2D Arrays & I/O",
                  topics: ["2D Arrays", "Standard I/O", "File Reading", "Final Keyword"],
                },
              ].map((week, index) => (
                <motion.div
                  key={week.week}
                  variants={fadeInUp}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="glass-card glass-card-hover overflow-hidden">
                    <CardHeader className="flex flex-row items-center gap-4 p-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                        {week.week}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{week.title}</CardTitle>
                        <CardDescription className="flex flex-wrap gap-2 mt-2">
                          {week.topics.map((topic) => (
                            <Badge
                              key={topic}
                              variant="secondary"
                              className="bg-[#4F46E5]/10 text-foreground border-none"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </CardDescription>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-[#22D3EE]" />
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}

              <motion.div variants={fadeInUp}>
                <Card className="glass-card border-dashed border-[#4F46E5]/30">
                  <CardHeader className="flex flex-row items-center gap-4 p-5">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-bold text-lg shrink-0 text-muted-foreground">
                      6+
                    </div>
                    <div>
                      <CardTitle className="text-lg text-muted-foreground">
                        Weeks 6-13 Coming Soon
                      </CardTitle>
                      <CardDescription>OOP, Recursion, Data Structures, and more</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-28 px-4 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4F46E5]/10 to-[#4F46E5]/5" />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4F46E5]/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <motion.div
            className="container mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-10 md:p-14">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(79,70,229,0.4)]">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Master <span className="gradient-neon-text">Java</span>?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">
                Join CS students who are already learning smarter, not harder. Start your
                journey today.
              </p>
              <Link href="/signup">
                <NeonButton
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Start Learning Now
                </NeonButton>
              </Link>
              <p className="text-sm text-muted-foreground mt-6">
                Free forever for Weeks 1-5. No credit card required.
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <LegalFooter />
    </div>
  )
}
