"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"

interface Topic {
  id: string
  title: string
  slug: string
  description: string | null
  isLocked: boolean
  questionCount: number
  progress: number
  isCompleted: boolean
}

interface Week {
  id: string
  weekNumber: number
  title: string
  description: string | null
  isLocked: boolean
  topics: Topic[]
  progress: number
}

interface Course {
  id: string
  name: string
  slug: string
  description: string
  language: string
  isLocked: boolean
  isEnrolled: boolean
  weeks: Week[]
}

// Cache configuration - courses data must be fresh to reflect entitlement changes
const COURSES_STALE_TIME = 0 // Always refetch - entitlement can change
const COURSES_GC_TIME = 5 * 60 * 1000 // 5 minutes garbage collection

export function useCourses() {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      // Add cache buster and credentials to bypass HTTP caching and send auth cookies
      const response = await fetch("/api/courses", {
        cache: "no-store",
        credentials: "include", // Ensure cookies are sent for authentication
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch courses")
      }
      return response.json()
    },
    staleTime: COURSES_STALE_TIME,
    gcTime: COURSES_GC_TIME,
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Always refetch on mount to get fresh entitlement data
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  })
}

export function useCourse(slug: string) {
  const { data: courses, ...rest } = useCourses()
  const course = courses?.find((c) => c.slug === slug)
  return { data: course, ...rest }
}

// Prefetch courses for navigation
export function usePrefetchCourses() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.prefetchQuery({
      queryKey: ["courses"],
      queryFn: async () => {
        const response = await fetch("/api/courses")
        if (!response.ok) throw new Error("Failed to fetch courses")
        return response.json()
      },
      staleTime: COURSES_STALE_TIME,
    })
  }
}

// Invalidate courses cache after updates
export function useInvalidateCourses() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ["courses"] })
}
