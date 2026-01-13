"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { useSession } from "next-auth/react"
import { NeonButton } from "@/components/ui/neon-button"
import { LegalFooter } from "@/components/shared/legal-footer"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Play,
  Lightbulb,
  AlertTriangle,
  Target,
  Shield,
  MessageSquare,
  HelpCircle,
  ClipboardList,
  LayoutDashboard,
  Layers,
  Rocket,
  GraduationCap,
  BookOpen,
} from "lucide-react"

// Timeline step data - exact 10-step narrative
const timelineSteps = [
  {
    step: 1,
    heading: "Bring Innovation Into the Learning Method",
    body: "Lia is a CS student presenting a practical innovation that brings the university's AI/innovation DNA into day-to-day learning and assessment, not just extracurricular tools.",
    whyItMatters: "Positions Reichman as a visible leader in modern CS education.",
    icon: Lightbulb,
  },
  {
    step: 2,
    heading: "Students Get Stuck Before They Even Start",
    body: "Many first-year students—especially with zero background—struggle with Git, downloading assignments, running code, reading errors, and knowing what went wrong.",
    whyItMatters: "Removes friction so assessment reflects capability, not setup struggles.",
    icon: AlertTriangle,
  },
  {
    step: 3,
    heading: "A Correct Solution Can Still Get a Zero",
    body: "Students can solve the logic correctly and still fail due to formatting, casing, or tiny technical constraints in the submission pipeline.",
    whyItMatters: "Improves measurement accuracy without lowering academic rigor.",
    icon: Target,
  },
  {
    step: 4,
    heading: "This Is Not About Making It Easier",
    body: "The point is cleaner measurement, real-time visibility, and better use of staff time—less wasted effort on technical noise, more on real reasoning.",
    whyItMatters: "Protects rigor while improving operational efficiency and oversight.",
    icon: Shield,
  },
  {
    step: 5,
    heading: "Feedback Loops Create Stronger Engineers",
    body: "With immediate feedback and structured trial-and-error, students build confidence, learn from mistakes, and rely less on shortcuts.",
    whyItMatters: "Higher quality learning outcomes with fewer 'silent failures'.",
    icon: MessageSquare,
  },
  {
    step: 6,
    heading: "Do We Have Real-Time Visibility Today?",
    body: "Ask: Do we see who is falling behind during the semester? How much failure is technical vs conceptual? Do we want to lead how CS is taught in the AI era?",
    whyItMatters: "Frames the discussion as leadership and academic strategy.",
    icon: HelpCircle,
  },
  {
    step: 7,
    heading: "Weekly Homework, Aligned With Lectures",
    body: "Each week opens lecture-aligned topics and a formal Homework tab. Students write and run code in one place, get test feedback, and finish with a grade.",
    whyItMatters: "Turns homework into a controlled, measurable academic workflow.",
    icon: ClipboardList,
  },
  {
    step: 8,
    heading: "A Real Gradebook With Insights",
    body: "Admin sees submissions, grades, progress statuses, and class-level weak points in real time.",
    whyItMatters: "Enables proactive teaching decisions—not end-of-semester surprises.",
    icon: LayoutDashboard,
  },
  {
    step: 9,
    heading: "Homework + Practice Layer = Higher Rigor, Less Noise",
    body: "Submissions happen in-system. Practice, quizzes, and explanations prepare students from basics to advanced so the challenge is reasoning—not tooling. Office hours become logic-focused.",
    whyItMatters: "Maintains high standards while scaling support intelligently.",
    icon: Layers,
  },
  {
    step: 10,
    heading: "Run a Short Pilot and Measure What Matters",
    body: "Pilot in one Java course for a few weeks. Track submission rates, grade distribution, reduction in technical zeros, and real-time visibility of class pain points.",
    whyItMatters: "A low-risk path to becoming the first mover in modern CS assessment.",
    icon: Rocket,
  },
]

// Timeline Step Component
function TimelineStep({
  step,
  heading,
  body,
  whyItMatters,
  icon: Icon,
  index,
  isLeft,
}: {
  step: number
  heading: string
  body: string
  whyItMatters: string
  icon: React.ComponentType<{ className?: string }>
  index: number
  isLeft: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px -100px 0px" })
  const shouldReduceMotion = useReducedMotion()

  const cardInitial = shouldReduceMotion ? undefined : { opacity: 0, y: 30, x: isLeft ? -20 : 20 }
  const cardAnimate = shouldReduceMotion
    ? undefined
    : isInView
      ? { opacity: 1, y: 0, x: 0 }
      : { opacity: 0, y: 30, x: isLeft ? -20 : 20 }
  const cardTransition = shouldReduceMotion ? undefined : { duration: 0.6, delay: 0.1, ease: "easeOut" as const }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex items-start gap-4 md:gap-8",
        // Desktop: alternate left/right
        "md:w-[calc(50%-2rem)]",
        isLeft ? "md:mr-auto md:pr-8 md:text-right" : "md:ml-auto md:pl-8 md:text-left",
        // Mobile: all on one side
        "w-full pl-12 md:pl-0"
      )}
    >
      {/* Mobile: Line marker on left */}
      <div className="absolute left-0 top-0 md:hidden">
        <motion.div
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500",
            isInView
              ? "border-[#4F46E5] bg-[#4F46E5]/20 text-[#4F46E5]"
              : "border-border bg-background text-muted-foreground"
          )}
          animate={isInView && !shouldReduceMotion ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {String(step).padStart(2, "0")}
        </motion.div>
        {index < timelineSteps.length - 1 && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%+2rem)] bg-border" />
        )}
      </div>

      {/* Desktop: Center line marker */}
      <div
        className={cn(
          "absolute top-0 hidden md:flex items-center justify-center",
          isLeft ? "-right-12" : "-left-12"
        )}
      >
        <motion.div
          className={cn(
            "w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-500 z-10 bg-background",
            isInView
              ? "border-[#4F46E5] text-[#4F46E5] shadow-[0_0_20px_rgba(79,70,229,0.4)]"
              : "border-border text-muted-foreground"
          )}
          animate={isInView && !shouldReduceMotion ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {String(step).padStart(2, "0")}
        </motion.div>
        {/* Pulse effect */}
        {isInView && !shouldReduceMotion && (
          <motion.div
            className="absolute w-10 h-10 rounded-full border-2 border-[#4F46E5]/50"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1, repeat: 1 }}
          />
        )}
      </div>

      {/* Card Content */}
      <motion.div
        className={cn(
          "flex-1 p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500",
          isInView && "border-[#4F46E5]/30 bg-card/80 shadow-[0_0_30px_rgba(79,70,229,0.1)]"
        )}
        initial={cardInitial}
        animate={cardAnimate}
        transition={cardTransition}
      >
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-500",
            isInView ? "bg-[#4F46E5]/20" : "bg-muted",
            isLeft ? "md:ml-auto" : ""
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5 transition-colors duration-500",
              isInView ? "text-[#4F46E5]" : "text-muted-foreground"
            )}
          />
        </div>

        {/* Heading */}
        <h3
          className={cn(
            "text-lg md:text-xl font-semibold mb-3 transition-colors duration-500",
            isInView ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {heading}
        </h3>

        {/* Body */}
        <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">{body}</p>

        {/* Why it matters */}
        <div
          className={cn(
            "flex items-start gap-2 pt-3 border-t border-border/50",
            isLeft ? "md:justify-end" : ""
          )}
        >
          <span className="text-xs font-medium text-[#22D3EE] uppercase tracking-wide shrink-0">
            Why it matters:
          </span>
          <span className="text-xs text-muted-foreground">{whyItMatters}</span>
        </div>
      </motion.div>
    </div>
  )
}

export default function ReichmanPage() {
  const { data: session } = useSession()
  const shouldReduceMotion = useReducedMotion()
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true })

  const fadeInUp = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }

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
              href="/#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/reichman"
              className="text-sm font-medium text-[#4F46E5] hover:text-[#22D3EE] transition-colors"
            >
              Reichman
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {session?.user ? (
              <Link href="/dashboard">
                <NeonButton variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Dashboard
                </NeonButton>
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden border-t border-border/30 px-4 py-2 flex items-center justify-center gap-6 overflow-x-auto">
          <Link
            href="/demo"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
          >
            Demo
          </Link>
          <Link
            href="/pricing"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
          >
            Pricing
          </Link>
          <Link
            href="/reichman"
            className="text-xs font-medium text-[#4F46E5] whitespace-nowrap"
          >
            Reichman
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section ref={heroRef} className="relative py-16 md:py-24 px-4 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.1),transparent_60%)]" />
            {!shouldReduceMotion && (
              <motion.div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#4F46E5]/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>

          <div className="container mx-auto max-w-4xl text-center">
            <motion.div {...fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/30 text-sm font-medium text-foreground mb-6">
                <GraduationCap className="h-4 w-4 text-[#4F46E5]" />
                Dean Pitch — CodeTutor for Reichman University
              </div>
            </motion.div>

            <motion.h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Transforming CS Education
              <br />
              <span className="gradient-neon-text">From Day One</span>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              A 10-step narrative showing how CodeTutor brings innovation into learning,
              improves measurement accuracy, and positions Reichman as a leader in modern CS assessment.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="#timeline">
                <NeonButton variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  View the Journey
                </NeonButton>
              </Link>
              <Link href={session ? "/admin/gradebook" : "/login?callbackUrl=/admin/gradebook"}>
                <NeonButton variant="secondary" size="lg" leftIcon={<BookOpen className="h-5 w-5" />}>
                  See Admin Dashboard
                </NeonButton>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="py-16 md:py-24 px-4 scroll-mt-20">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              className="text-center mb-16"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                The <span className="gradient-neon-text">10-Step</span> Vision
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A strategic narrative for modernizing CS education at Reichman University
              </p>
            </motion.div>

            {/* Timeline container */}
            <div className="relative">
              {/* Desktop center line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4F46E5]/50 via-[#4F46E5]/30 to-transparent -translate-x-1/2" />

              {/* Steps */}
              <div className="space-y-8 md:space-y-12">
                {timelineSteps.map((step, index) => (
                  <TimelineStep
                    key={step.step}
                    {...step}
                    index={index}
                    isLeft={index % 2 === 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4 bg-card/30">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              className="text-center p-8 md:p-12 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(79,70,229,0.4)]">
                <Rocket className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready for a <span className="gradient-neon-text">Pilot</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                See the system in action. Explore the admin gradebook or experience the student homework flow firsthand.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={
                    session?.user?.role === "ADMIN"
                      ? "/admin/gradebook"
                      : "/login?callbackUrl=/admin/gradebook"
                  }
                >
                  <NeonButton
                    variant="primary"
                    size="lg"
                    leftIcon={<LayoutDashboard className="h-5 w-5" />}
                  >
                    View Admin Gradebook
                  </NeonButton>
                </Link>
                <Link href={session ? "/dashboard" : "/login?callbackUrl=/dashboard"}>
                  <NeonButton
                    variant="secondary"
                    size="lg"
                    leftIcon={<BookOpen className="h-5 w-5" />}
                  >
                    Explore Homework Flow
                  </NeonButton>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                Admin access required for gradebook. Login as admin@codetutor.dev / admin123 for demo.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <LegalFooter />
    </div>
  )
}
