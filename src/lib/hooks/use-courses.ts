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

      // Even on non-2xx, try to parse JSON - our hardened API returns data even on errors
      const data = await response.json().catch(() => [])

      // If response has courses array, return it even if there was an error
      if (Array.isArray(data)) {
        return data
      }

      // If data has a courses property, return it
      if (data?.courses && Array.isArray(data.courses)) {
        return data.courses
      }

      // Return empty array as fallback
      return []
    },
    staleTime: COURSES_STALE_TIME,
    gcTime: COURSES_GC_TIME,
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Always refetch on mount to get fresh entitlement data
    // PREVENT RETRY STORMS: Limited retries with aggressive backoff
    retry: (failureCount, error) => {
      // Max 2 retries
      if (failureCount >= 2) return false
      // Don't retry on 401/403 - user needs to re-authenticate
      if (error instanceof Error && error.message.includes("401")) return false
      if (error instanceof Error && error.message.includes("403")) return false
      return true
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Return empty array on error instead of undefined
    placeholderData: [],
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
        // Parse response, fallback to empty array
        const data = await response.json().catch(() => [])
        return Array.isArray(data) ? data : []
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
