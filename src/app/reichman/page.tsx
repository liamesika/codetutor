"use client"

import Link from "next/link"
import { useRef, memo } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { useSession } from "next-auth/react"
import { NeonButton } from "@/components/ui/neon-button"
import { SiteHeader } from "@/components/shared/site-header"
import { LegalFooter } from "@/components/shared/legal-footer"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
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

// Memoized Timeline Step Component - prevents re-renders
const TimelineStep = memo(function TimelineStep({
  step,
  heading,
  body,
  whyItMatters,
  icon: Icon,
  index,
  isLeft,
  totalSteps,
}: {
  step: number
  heading: string
  body: string
  whyItMatters: string
  icon: React.ComponentType<{ className?: string }>
  index: number
  isLeft: boolean
  totalSteps: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      ref={ref}
      className={cn(
        "relative",
        // Mobile: single column with line on left
        "pl-14 md:pl-0",
        // Desktop: alternating layout
        "md:flex md:items-start",
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Mobile timeline marker - fixed position */}
      <div className="absolute left-0 top-0 md:hidden flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10 bg-background transition-colors duration-300",
            isInView
              ? "border-[#4F46E5] text-[#4F46E5]"
              : "border-border text-muted-foreground"
          )}
        >
          {String(step).padStart(2, "0")}
        </div>
        {/* Connecting line */}
        {index < totalSteps - 1 && (
          <div className="w-0.5 h-full min-h-[8rem] bg-border absolute top-10 left-1/2 -translate-x-1/2" />
        )}
      </div>

      {/* Desktop layout spacer + marker */}
      <div className="hidden md:flex md:w-[calc(50%-2.5rem)] md:justify-end">
        {isLeft && (
          <motion.div
            className="w-full pr-8"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <TimelineCard
              step={step}
              heading={heading}
              body={body}
              whyItMatters={whyItMatters}
              Icon={Icon}
              isInView={isInView}
              alignRight
            />
          </motion.div>
        )}
      </div>

      {/* Desktop center marker */}
      <div className="hidden md:flex items-center justify-center w-20 shrink-0 relative">
        <div
          className={cn(
            "w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold z-10 bg-background transition-all duration-300",
            isInView
              ? "border-[#4F46E5] text-[#4F46E5] shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              : "border-border text-muted-foreground"
          )}
        >
          {String(step).padStart(2, "0")}
        </div>
        {/* Center line segment */}
        {index < totalSteps - 1 && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%+3rem)] bg-gradient-to-b from-[#4F46E5]/40 to-border" />
        )}
      </div>

      {/* Desktop right side content */}
      <div className="hidden md:flex md:w-[calc(50%-2.5rem)]">
        {!isLeft && (
          <motion.div
            className="w-full pl-8"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <TimelineCard
              step={step}
              heading={heading}
              body={body}
              whyItMatters={whyItMatters}
              Icon={Icon}
              isInView={isInView}
            />
          </motion.div>
        )}
      </div>

      {/* Mobile card - simple fade in, no x movement to prevent layout shift */}
      <motion.div
        className="md:hidden w-full"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <TimelineCard
          step={step}
          heading={heading}
          body={body}
          whyItMatters={whyItMatters}
          Icon={Icon}
          isInView={isInView}
        />
      </motion.div>
    </div>
  )
})

// Card component
function TimelineCard({
  heading,
  body,
  whyItMatters,
  Icon,
  isInView,
  alignRight,
}: {
  step: number
  heading: string
  body: string
  whyItMatters: string
  Icon: React.ComponentType<{ className?: string }>
  isInView: boolean
  alignRight?: boolean
}) {
  return (
    <div
      className={cn(
        "p-5 md:p-6 rounded-2xl border bg-card/80 backdrop-blur-sm transition-all duration-300",
        isInView
          ? "border-[#4F46E5]/30 shadow-[0_0_30px_rgba(79,70,229,0.08)]"
          : "border-border/50"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300",
          isInView ? "bg-[#4F46E5]/15" : "bg-muted",
          alignRight && "md:ml-auto"
        )}
      >
        <Icon
          className={cn(
            "w-5 h-5 transition-colors duration-300",
            isInView ? "text-[#4F46E5]" : "text-muted-foreground"
          )}
        />
      </div>

      {/* Heading */}
      <h3
        className={cn(
          "text-base md:text-lg font-semibold mb-2 transition-colors duration-300",
          alignRight && "md:text-right"
        )}
      >
        {heading}
      </h3>

      {/* Body */}
      <p className={cn("text-sm text-muted-foreground mb-4 leading-relaxed", alignRight && "md:text-right")}>
        {body}
      </p>

      {/* Why it matters */}
      <div
        className={cn(
          "flex items-start gap-2 pt-3 border-t border-border/50",
          alignRight && "md:flex-row-reverse md:text-right"
        )}
      >
        <span className="text-xs font-medium text-[#22D3EE] uppercase tracking-wide shrink-0">
          Why it matters:
        </span>
        <span className="text-xs text-muted-foreground">{whyItMatters}</span>
      </div>
    </div>
  )
}

export default function ReichmanPage() {
  const { data: session } = useSession()
  const shouldReduceMotion = useReducedMotion()
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Shared Header with Mobile Drawer */}
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section ref={heroRef} className="relative py-12 md:py-20 px-4 overflow-hidden">
          {/* Background - simplified for performance */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.08),transparent_60%)]" />
          </div>

          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/30 text-sm font-medium text-foreground mb-6">
                <GraduationCap className="h-4 w-4 text-[#4F46E5]" />
                CodeTutor for Reichman University
              </div>
            </motion.div>

            <motion.h1
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Transforming CS Education
              <br />
              <span className="gradient-neon-text">From Day One</span>
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              A 10-step narrative showing how CodeTutor brings innovation into learning,
              improves measurement accuracy, and positions Reichman as a leader in modern CS assessment.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
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
        <section id="timeline" className="py-12 md:py-20 px-4 scroll-mt-16">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              className="text-center mb-12 md:mb-16"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-3">
                The <span className="gradient-neon-text">10-Step</span> Vision
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
                A strategic narrative for modernizing CS education at Reichman University
              </p>
            </motion.div>

            {/* Timeline container */}
            <div className="relative space-y-6 md:space-y-10">
              {timelineSteps.map((step, index) => (
                <TimelineStep
                  key={`step-${step.step}`}
                  {...step}
                  index={index}
                  isLeft={index % 2 === 0}
                  totalSteps={timelineSteps.length}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20 px-4 bg-card/30">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              className="text-center p-6 md:p-10 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#22D3EE] flex items-center justify-center mx-auto mb-5 shadow-[0_0_25px_rgba(79,70,229,0.35)]">
                <Rocket className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
                Ready for a <span className="gradient-neon-text">Pilot</span>?
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-lg mx-auto">
                See the system in action. Explore the admin gradebook or experience the student homework flow firsthand.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
              <p className="text-xs text-muted-foreground mt-5">
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
