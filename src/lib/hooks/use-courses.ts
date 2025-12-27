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

// Cache configuration - courses data is relatively stable
const COURSES_STALE_TIME = 5 * 60 * 1000 // 5 minutes
const COURSES_GC_TIME = 30 * 60 * 1000 // 30 minutes

export function useCourses() {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await fetch("/api/courses")
      if (!response.ok) {
        throw new Error("Failed to fetch courses")
      }
      return response.json()
    },
    staleTime: COURSES_STALE_TIME,
    gcTime: COURSES_GC_TIME,
    refetchOnWindowFocus: false, // Prevent refetch loops
    refetchOnMount: false, // Use cache on mount if available
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
