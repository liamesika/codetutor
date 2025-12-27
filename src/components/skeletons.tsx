"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Base shimmer animation for skeleton cards
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <Card className={cn("bg-[#1E1B4B]/30 border-[#4F46E5]/10", className)}>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-24 bg-[#4F46E5]/20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 bg-[#4F46E5]/20" />
      </CardContent>
    </Card>
  )
}

// Dashboard page skeleton
export function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto animate-in fade-in-50 duration-300">
      {/* Welcome header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-64 bg-[#4F46E5]/20 mb-2" />
          <Skeleton className="h-4 w-48 bg-[#4F46E5]/10" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg bg-[#4F46E5]/20" />
      </div>

      {/* Tab navigation skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-xl bg-[#4F46E5]/20 shrink-0" />
        ))}
      </div>

      {/* Progress header skeleton */}
      <div className="p-4 md:p-6 rounded-2xl bg-gradient-to-r from-[#1E1B4B]/80 to-[#4F46E5]/20 border border-[#4F46E5]/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl bg-[#4F46E5]/20" />
            <div>
              <Skeleton className="h-6 w-32 bg-[#4F46E5]/20 mb-2" />
              <Skeleton className="h-4 w-24 bg-[#4F46E5]/10" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 bg-[#4F46E5]/20" />
        </div>
        <Skeleton className="h-3 w-full rounded-full bg-[#4F46E5]/20" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-xl bg-[#4F46E5]/20" />
              <div>
                <Skeleton className="h-5 w-32 bg-[#4F46E5]/20 mb-2" />
                <Skeleton className="h-4 w-24 bg-[#4F46E5]/10" />
              </div>
            </div>
            <Skeleton className="h-4 w-full bg-[#4F46E5]/10 mb-2" />
            <Skeleton className="h-4 w-3/4 bg-[#4F46E5]/10" />
          </CardContent>
        </Card>
        <Card className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-xl bg-[#4F46E5]/20" />
              <div>
                <Skeleton className="h-5 w-32 bg-[#4F46E5]/20 mb-2" />
                <Skeleton className="h-4 w-24 bg-[#4F46E5]/10" />
              </div>
            </div>
            <Skeleton className="h-4 w-full bg-[#4F46E5]/10 mb-2" />
            <Skeleton className="h-4 w-3/4 bg-[#4F46E5]/10" />
          </CardContent>
        </Card>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 bg-[#4F46E5]/20" />
                <Skeleton className="h-8 w-8 rounded-lg bg-[#4F46E5]/20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 bg-[#4F46E5]/20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course progress skeleton */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg bg-[#4F46E5]/20" />
            <Skeleton className="h-6 w-40 bg-[#4F46E5]/20" />
          </div>
          <Skeleton className="h-6 w-32 rounded-full bg-[#4F46E5]/20" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-5 w-24 bg-[#4F46E5]/20 mb-2" />
                    <Skeleton className="h-4 w-32 bg-[#4F46E5]/10" />
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full bg-[#4F46E5]/20" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-2 w-full rounded-full bg-[#4F46E5]/20 mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32 bg-[#4F46E5]/10" />
                  <Skeleton className="h-8 w-24 rounded-lg bg-[#4F46E5]/20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Learn/Topic page skeleton
export function LearnSkeleton() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto animate-in fade-in-50 duration-300">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20 bg-[#4F46E5]/20" />
        <Skeleton className="h-4 w-4 bg-[#4F46E5]/10" />
        <Skeleton className="h-4 w-16 bg-[#4F46E5]/20" />
        <Skeleton className="h-4 w-4 bg-[#4F46E5]/10" />
        <Skeleton className="h-4 w-32 bg-[#4F46E5]/20" />
      </div>

      {/* Header skeleton */}
      <div className="space-y-4">
        <div>
          <Skeleton className="h-8 w-64 bg-[#4F46E5]/20 mb-2" />
          <Skeleton className="h-4 w-full max-w-md bg-[#4F46E5]/10" />
        </div>

        {/* Progress card skeleton */}
        <Card className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16 bg-[#4F46E5]/20" />
                  <Skeleton className="h-4 w-24 bg-[#4F46E5]/20" />
                </div>
                <Skeleton className="h-2 w-full rounded-full bg-[#4F46E5]/20" />
              </div>
              <div className="flex items-center gap-6">
                <Skeleton className="h-6 w-20 bg-[#4F46E5]/20" />
                <Skeleton className="h-6 w-24 bg-[#4F46E5]/20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start button skeleton */}
        <Skeleton className="h-12 w-full md:w-48 rounded-lg bg-[#4F46E5]/30" />
      </div>

      {/* Questions list skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40 bg-[#4F46E5]/20" />
        <div className="grid gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
              <CardHeader className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded-full bg-[#4F46E5]/20" />
                    <div>
                      <Skeleton className="h-5 w-48 bg-[#4F46E5]/20 mb-2" />
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-12 bg-[#4F46E5]/10" />
                        <Skeleton className="h-4 w-16 bg-[#4F46E5]/10" />
                        <Skeleton className="h-4 w-14 bg-[#4F46E5]/10" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full bg-[#4F46E5]/20" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Practice page skeleton
export function PracticeSkeleton() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background animate-in fade-in-50 duration-300">
      {/* Header skeleton */}
      <div className="border-b border-border/50 bg-background/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-lg bg-[#4F46E5]/20" />
          <Skeleton className="h-5 w-64 bg-[#4F46E5]/20 hidden md:block" />
          <Skeleton className="h-5 w-32 bg-[#4F46E5]/20 md:hidden" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20 rounded-full bg-[#4F46E5]/20" />
          <Skeleton className="h-6 w-16 bg-[#4F46E5]/20 hidden sm:block" />
          <Skeleton className="h-6 w-16 bg-[#4F46E5]/20 hidden sm:block" />
        </div>
      </div>

      {/* Main content - Desktop */}
      <div className="flex-1 hidden lg:flex p-4 gap-4 overflow-hidden">
        {/* Editor panel skeleton */}
        <div className="flex-1 flex flex-col glass-card overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-border/50">
            <Skeleton className="h-8 w-8 rounded bg-[#4F46E5]/20" />
            <Skeleton className="h-6 w-32 bg-[#4F46E5]/20" />
          </div>
          <div className="flex-1 p-4 space-y-2">
            {/* Code lines */}
            {[...Array(15)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-5 bg-[#4F46E5]/10"
                style={{ width: `${Math.random() * 50 + 30}%` }}
              />
            ))}
          </div>
        </div>

        {/* Side panel skeleton */}
        <div className="w-[400px] xl:w-[480px] glass-card flex flex-col">
          <div className="flex items-center gap-2 p-4 border-b border-border/50">
            <Skeleton className="h-9 w-24 rounded-lg bg-[#4F46E5]/20" />
            <Skeleton className="h-9 w-20 rounded-lg bg-[#4F46E5]/20" />
          </div>
          <div className="flex-1 p-4 space-y-4">
            <Skeleton className="h-6 w-48 bg-[#4F46E5]/20" />
            <Skeleton className="h-4 w-full bg-[#4F46E5]/10" />
            <Skeleton className="h-4 w-full bg-[#4F46E5]/10" />
            <Skeleton className="h-4 w-3/4 bg-[#4F46E5]/10" />
            <div className="mt-6 p-4 rounded-lg bg-[#1E1B4B]/30 space-y-3">
              <Skeleton className="h-5 w-24 bg-[#4F46E5]/20" />
              <Skeleton className="h-4 w-full bg-[#4F46E5]/10" />
              <Skeleton className="h-4 w-2/3 bg-[#4F46E5]/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content - Mobile */}
      <div className="flex-1 flex flex-col lg:hidden overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-border/50">
          <Skeleton className="h-9 w-20 rounded-lg bg-[#4F46E5]/20" />
          <Skeleton className="h-9 w-16 rounded-lg bg-[#4F46E5]/20" />
          <Skeleton className="h-9 w-20 rounded-lg bg-[#4F46E5]/20" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-6 w-48 bg-[#4F46E5]/20" />
          <Skeleton className="h-4 w-full bg-[#4F46E5]/10" />
          <Skeleton className="h-4 w-full bg-[#4F46E5]/10" />
          <Skeleton className="h-4 w-3/4 bg-[#4F46E5]/10" />
        </div>
      </div>

      {/* Action bar skeleton */}
      <div className="glass-card border-t-0 rounded-t-none p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-lg bg-[#4F46E5]/20" />
            <Skeleton className="h-9 w-20 rounded-lg bg-[#4F46E5]/20" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl bg-[#4F46E5]/30" />
        </div>
      </div>
    </div>
  )
}

// Skills page skeleton
export function SkillsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26] animate-in fade-in-50 duration-300">
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-10 w-10 rounded-xl bg-[#4F46E5]/20" />
            <div>
              <Skeleton className="h-7 w-32 bg-[#4F46E5]/20 mb-2" />
              <Skeleton className="h-4 w-48 bg-[#4F46E5]/10" />
            </div>
          </div>
          {/* Progress bar skeleton */}
          <div className="p-4 rounded-2xl bg-[#1E1B4B]/50 border border-[#4F46E5]/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl bg-[#4F46E5]/20" />
                <div>
                  <Skeleton className="h-5 w-24 bg-[#4F46E5]/20 mb-1" />
                  <Skeleton className="h-4 w-16 bg-[#4F46E5]/10" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 bg-[#4F46E5]/20" />
            </div>
            <Skeleton className="h-2 w-full rounded-full bg-[#4F46E5]/20" />
          </div>
        </div>

        {/* Skill tree skeleton */}
        <div className="rounded-2xl bg-[#1E1B4B]/30 border border-[#4F46E5]/20 p-8 min-h-[60vh]">
          <div className="flex flex-col items-center gap-6">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex items-center gap-8">
                {[1, 2, 3].map((col) => (
                  <Skeleton
                    key={col}
                    className="h-20 w-20 rounded-2xl bg-[#4F46E5]/20"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Achievements page skeleton
export function AchievementsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26] animate-in fade-in-50 duration-300">
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-10 w-10 rounded-xl bg-[#4F46E5]/20" />
            <div>
              <Skeleton className="h-7 w-36 bg-[#4F46E5]/20 mb-2" />
              <Skeleton className="h-4 w-48 bg-[#4F46E5]/10" />
            </div>
          </div>
          {/* Stats bar skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#1E1B4B]/50 border border-[#4F46E5]/20">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-12 mx-auto bg-[#4F46E5]/20 mb-1" />
                <Skeleton className="h-4 w-16 mx-auto bg-[#4F46E5]/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Achievement cards skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-[#4F46E5]/20 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Skeleton className="h-5 w-32 bg-[#4F46E5]/20" />
                      <Skeleton className="h-5 w-16 rounded-full bg-[#4F46E5]/20" />
                    </div>
                    <Skeleton className="h-4 w-full bg-[#4F46E5]/10 mb-3" />
                    <Skeleton className="h-4 w-20 bg-[#4F46E5]/10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Leaderboard page skeleton
export function LeaderboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26] animate-in fade-in-50 duration-300">
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl bg-[#4F46E5]/20" />
              <div>
                <Skeleton className="h-7 w-36 bg-[#4F46E5]/20 mb-2" />
                <Skeleton className="h-4 w-48 bg-[#4F46E5]/10" />
              </div>
            </div>
            <Skeleton className="h-9 w-24 rounded-lg bg-[#4F46E5]/20" />
          </div>

          {/* Stats bar skeleton */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#1E1B4B]/50 border border-[#4F46E5]/20 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-12 mx-auto bg-[#4F46E5]/20 mb-1" />
                <Skeleton className="h-4 w-16 mx-auto bg-[#4F46E5]/10" />
              </div>
            ))}
          </div>

          {/* Tabs skeleton */}
          <Skeleton className="h-10 w-72 rounded-lg bg-[#4F46E5]/20" />
        </div>

        {/* Leaderboard entries skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Card key={i} className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl bg-[#4F46E5]/20" />
                  <Skeleton className="w-10 h-10 rounded-full bg-[#4F46E5]/20" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-5 w-32 bg-[#4F46E5]/20 mb-2" />
                    <Skeleton className="h-4 w-16 bg-[#4F46E5]/10" />
                  </div>
                  <Skeleton className="h-6 w-20 bg-[#4F46E5]/20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Admin curriculum skeleton
export function CurriculumSkeleton() {
  return (
    <div className="p-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-7 w-56 bg-[#4F46E5]/20 mb-2" />
          <Skeleton className="h-4 w-80 bg-[#4F46E5]/10" />
        </div>
        <Skeleton className="h-10 w-28 rounded-lg bg-[#4F46E5]/20" />
      </div>

      {/* Course header skeleton */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 rounded-lg">
        <Skeleton className="h-6 w-6 rounded bg-[#4F46E5]/20" />
        <div>
          <Skeleton className="h-5 w-48 bg-[#4F46E5]/20 mb-1" />
          <Skeleton className="h-4 w-32 bg-[#4F46E5]/10" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full bg-[#4F46E5]/20 ml-auto" />
      </div>

      {/* Week sections skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 bg-[#4F46E5]/20" />
              <Skeleton className="h-5 w-5 rounded bg-[#4F46E5]/20" />
              <Skeleton className="h-5 w-48 bg-[#4F46E5]/20" />
              <Skeleton className="h-6 w-36 rounded-full bg-[#4F46E5]/10" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-full bg-[#4F46E5]/20" />
              <Skeleton className="h-5 w-10 rounded-full bg-[#4F46E5]/20" />
            </div>
          </div>
          <div className="pl-4 space-y-2">
            {[1, 2].map((j) => (
              <Card key={j} className="bg-card/50">
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 bg-[#4F46E5]/20" />
                      <Skeleton className="h-5 w-40 bg-[#4F46E5]/20" />
                      <Skeleton className="h-5 w-32 rounded-full bg-[#4F46E5]/10" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 bg-[#4F46E5]/20" />
                      <Skeleton className="h-5 w-10 rounded-full bg-[#4F46E5]/20" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Generic page shell skeleton (for dashboard wrapper)
export function DashboardShellSkeleton({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex w-64 border-r border-border/50 bg-card/50 flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg bg-[#4F46E5]/20" />
            <Skeleton className="h-6 w-24 bg-[#4F46E5]/20" />
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 p-4 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg bg-[#4F46E5]/10" />
          ))}
        </div>

        {/* User section */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full bg-[#4F46E5]/20" />
            <div>
              <Skeleton className="h-4 w-24 bg-[#4F46E5]/20 mb-1" />
              <Skeleton className="h-3 w-16 bg-[#4F46E5]/10" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
