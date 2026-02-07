/**
 * Course display configuration
 * Maps course slugs to UI labels and settings
 */

export interface CourseDisplayConfig {
  unitLabel: string
  unitLabelPlural: string
  subtitle: string
  hasExams: boolean
}

const COURSE_DISPLAY: Record<string, CourseDisplayConfig> = {
  "java-weeks-1-5": {
    unitLabel: "Week",
    unitLabelPlural: "Weeks",
    subtitle: "Continue your Java learning journey",
    hasExams: false,
  },
  "cs-exam-marathon": {
    unitLabel: "Day",
    unitLabelPlural: "Days",
    subtitle: "Your 10-day exam prep marathon",
    hasExams: true,
  },
}

const DEFAULT_SLUG = "cs-exam-marathon"

export function getCourseDisplay(slug?: string): CourseDisplayConfig {
  if (!slug) return COURSE_DISPLAY[DEFAULT_SLUG]
  return COURSE_DISPLAY[slug] || COURSE_DISPLAY[DEFAULT_SLUG]
}
