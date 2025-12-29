"use client"

import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface Week {
  id: string
  weekNumber: number
  title: string
  isLocked: boolean
  topics: {
    id: string
    title: string
    slug: string
    isLocked: boolean
    progress?: number
    isCompleted?: boolean
  }[]
  progress?: number
}

interface DashboardShellProps {
  children: React.ReactNode
  weeks?: Week[]
  currentCourse?: string
  userStats?: {
    streak: number
    totalPoints: number
  }
  hideSidebar?: boolean
  className?: string
}

export function DashboardShell({
  children,
  weeks = [],
  currentCourse,
  userStats,
  hideSidebar = false,
  className,
}: DashboardShellProps) {
  return (
    <div className="min-h-dvh flex flex-col overflow-x-hidden">
      <Header
        weeks={weeks}
        currentCourse={currentCourse}
        userStats={userStats}
      />
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        {!hideSidebar && (
          <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar shrink-0 overflow-y-auto">
            <Sidebar
              weeks={weeks}
              currentCourse={currentCourse}
              isLoading={weeks.length === 0}
            />
          </aside>
        )}
        {/* Main content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden min-w-0",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
