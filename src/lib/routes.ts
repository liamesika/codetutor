/**
 * Centralized routes helper for CodeTutor
 * All internal navigation should use these helpers to prevent broken links
 */

export const routes = {
  // Auth routes
  login: () => "/login" as const,
  signup: () => "/signup" as const,

  // Dashboard routes
  dashboard: () => "/dashboard" as const,

  // Learning routes
  learn: (topicId: string) => `/learn/${topicId}` as const,

  // Practice route - CANONICAL
  practice: (questionId: string) => `/practice/${questionId}` as const,

  // Daily challenge
  dailyChallenge: () => "/dashboard" as const, // Daily challenge is on dashboard

  // Progression routes
  skills: () => "/skills" as const,
  achievements: () => "/achievements" as const,
  leaderboard: () => "/leaderboard" as const,

  // Settings
  settings: () => "/settings" as const,

  // System
  status: () => "/status" as const,

  // Admin routes
  admin: {
    root: () => "/admin" as const,
    questions: () => "/admin/questions" as const,
    topics: () => "/admin/topics" as const,
    analytics: () => "/admin/analytics" as const,
    settings: () => "/admin/settings" as const,
    adaptive: () => "/admin/adaptive" as const,
  },

  // API routes (for reference, not navigation)
  api: {
    questions: (questionId: string) => `/api/questions/${questionId}` as const,
    execute: () => "/api/execute" as const,
    drafts: () => "/api/drafts" as const,
    hint: (questionId: string) => `/api/questions/${questionId}/hint` as const,
    solution: (questionId: string) => `/api/questions/${questionId}/solution` as const,
    progression: () => "/api/progression" as const,
    skillTree: () => "/api/skill-tree" as const,
    achievements: () => "/api/achievements" as const,
    leaderboard: () => "/api/progression/leaderboard" as const,
    status: () => "/api/status" as const,
  },
} as const

// Type for route values
export type AppRoute =
  | ReturnType<typeof routes.login>
  | ReturnType<typeof routes.signup>
  | ReturnType<typeof routes.dashboard>
  | ReturnType<typeof routes.practice>
  | ReturnType<typeof routes.skills>
  | ReturnType<typeof routes.achievements>
  | ReturnType<typeof routes.leaderboard>
  | ReturnType<typeof routes.settings>
  | ReturnType<typeof routes.status>
