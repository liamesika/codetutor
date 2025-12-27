"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardShell } from "@/components/layout"
import { SkillTreeMap } from "@/components/skill-tree/skill-tree-map"
import { ProgressHeader } from "@/components/progression/progress-header"
import { useCourses, useUserStats } from "@/lib/hooks"
import { GitBranch, Sparkles } from "lucide-react"

export default function SkillsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { data: courses } = useCourses()
  const { data: stats } = useUserStats()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading" || status === "unauthenticated") {
    return null
  }

  const activeCourse = courses?.find((c) => c.isEnrolled && !c.isLocked)
  const weeks = activeCourse?.weeks || []

  return (
    <DashboardShell
      weeks={weeks}
      currentCourse={activeCourse?.name}
      userStats={
        stats
          ? { streak: stats.streak, totalPoints: stats.totalPoints }
          : undefined
      }
    >
      <div className="min-h-screen bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26]">
        <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#4F46E5]/20 to-[#22D3EE]/20 border border-[#4F46E5]/30">
                <GitBranch className="size-6 text-[#22D3EE]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  Skill Tree
                  <Sparkles className="size-5 text-[#22D3EE] animate-pulse" />
                </h1>
                <p className="text-[#9CA3AF] text-sm">
                  Master skills, unlock new topics, and build your expertise
                </p>
              </div>
            </div>

            {/* Progress header */}
            <div className="p-4 rounded-2xl bg-[#1E1B4B]/50 backdrop-blur-sm border border-[#4F46E5]/20">
              <ProgressHeader />
            </div>
          </motion.div>

          {/* Skill tree */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-[#1E1B4B]/30 backdrop-blur-sm border border-[#4F46E5]/20 min-h-[60vh]"
          >
            <SkillTreeMap />
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  )
}
