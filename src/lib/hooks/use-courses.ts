"use client"

import { useQuery } from "@tanstack/react-query"

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
  })
}

export function useCourse(slug: string) {
  const { data: courses, ...rest } = useCourses()
  const course = courses?.find((c) => c.slug === slug)
  return { data: course, ...rest }
}
