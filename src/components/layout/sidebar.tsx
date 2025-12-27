"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Code2,
  Lock,
  CheckCircle2,
  Circle,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Trophy,
  GitBranch,
} from "lucide-react"

interface Topic {
  id: string
  title: string
  slug: string
  isLocked: boolean
  progress?: number
  isCompleted?: boolean
}

interface Week {
  id: string
  weekNumber: number
  title: string
  isLocked: boolean
  topics: Topic[]
  progress?: number
}

interface SidebarProps {
  weeks: Week[]
  currentCourse?: string
  isLoading?: boolean
}

export function Sidebar({ weeks, currentCourse, isLoading }: SidebarProps) {
  const pathname = usePathname()
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>(() => {
    // Auto-expand the first unlocked week
    const firstUnlocked = weeks.find((w) => !w.isLocked)
    return firstUnlocked ? [firstUnlocked.id] : []
  })

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekId)
        ? prev.filter((id) => id !== weekId)
        : [...prev, weekId]
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-3/4 ml-4" />
              <Skeleton className="h-6 w-2/3 ml-4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo and course selector */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Code2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">CodeTutor</span>
        </Link>
        {currentCourse && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-sidebar-accent text-sm">
            <GraduationCap className="h-4 w-4 text-sidebar-primary" />
            <span className="truncate">{currentCourse}</span>
          </div>
        )}
      </div>

      {/* Navigation links */}
      <div className="px-3 py-2 space-y-1">
        <Link href="/dashboard">
          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/skills">
          <Button
            variant={pathname === "/skills" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <GitBranch className="mr-2 h-4 w-4" />
            Skill Tree
          </Button>
        </Link>
        <Link href="/achievements">
          <Button
            variant={pathname === "/achievements" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Achievements
          </Button>
        </Link>
      </div>

      {/* Weeks and Topics */}
      <ScrollArea className="flex-1 px-3">
        <div className="py-2">
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" />
            Course Content
          </div>
          <div className="space-y-1 mt-2">
            {weeks.map((week) => {
              const isExpanded = expandedWeeks.includes(week.id)
              const hasActiveTopic = week.topics.some((t) =>
                pathname.includes(t.slug)
              )

              return (
                <div key={week.id}>
                  <button
                    onClick={() => !week.isLocked && toggleWeek(week.id)}
                    disabled={week.isLocked}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors",
                      "hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      week.isLocked && "opacity-50 cursor-not-allowed",
                      hasActiveTopic && "bg-sidebar-accent"
                    )}
                  >
                    {week.isLocked ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="flex-1 text-left font-medium">
                      Week {week.weekNumber}
                    </span>
                    {week.progress !== undefined && week.progress > 0 && (
                      <Badge
                        variant={week.progress === 100 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {week.progress}%
                      </Badge>
                    )}
                  </button>

                  {isExpanded && !week.isLocked && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-4 animate-fade-in">
                      {week.topics.map((topic) => {
                        const isActive = pathname.includes(topic.slug)
                        return (
                          <Link
                            key={topic.id}
                            href={
                              topic.isLocked
                                ? "#"
                                : `/learn/${topic.id}`
                            }
                            className={cn(
                              "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                              "hover:bg-sidebar-accent",
                              isActive && "bg-sidebar-accent text-sidebar-primary font-medium",
                              topic.isLocked && "opacity-50 pointer-events-none"
                            )}
                          >
                            {topic.isLocked ? (
                              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : topic.isCompleted ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            ) : (
                              <Circle className="h-3.5 w-3.5" />
                            )}
                            <span className="truncate">{topic.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>

      {/* Settings */}
      <div className="p-3 border-t border-sidebar-border">
        <Link href="/settings">
          <Button
            variant={pathname === "/settings" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}
