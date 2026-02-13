/**
 * Public exercises helper — extracts questions from marathon curriculum
 * for the public /exercises page (with solutions & explanations).
 */

import { marathonCurriculum } from "@/content/curriculum/marathon-curriculum"

export interface TestExample {
  input: string
  expectedOutput: string
  description?: string
}

export interface ExerciseItem {
  slug: string
  title: string
  prompt: string
  constraints?: string
  type: string
  starterCode: string
  solutionCode: string
  hints: string[]
  explanation?: string
  tags: string[]
  difficulty: number
  estimatedMinutes: number
  topicTitle: string
  examples: TestExample[]
}

export interface DayExerciseGroup {
  dayNumber: number
  dayTitle: string
  dayDescription: string
  topics: {
    slug: string
    title: string
    description: string
    exercises: ExerciseItem[]
  }[]
  totalExercises: number
  totalMinutes: number
}

export function getExerciseGroups(): DayExerciseGroup[] {
  return marathonCurriculum.weeks.map((week) => {
    const topics = week.topics.map((topic) => ({
      slug: topic.slug,
      title: topic.title,
      description: topic.description,
      exercises: topic.questions.map((q) => ({
        slug: q.slug,
        title: q.title,
        prompt: q.prompt,
        constraints: q.constraints,
        type: q.type,
        starterCode: q.starterCode,
        solutionCode: q.solutionCode,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        difficulty: q.difficulty,
        estimatedMinutes: q.estimatedMinutes,
        topicTitle: topic.title,
        examples: (q.tests as Array<TestExample & { isHidden?: boolean }>)
          .filter((t) => !t.isHidden)
          .slice(0, 2)
          .map((t) => ({
            input: t.input,
            expectedOutput: t.expectedOutput,
            description: t.description,
          })),
      })),
    }))

    const totalExercises = topics.reduce((sum, t) => sum + t.exercises.length, 0)
    const totalMinutes = topics.reduce(
      (sum, t) => sum + t.exercises.reduce((s, e) => s + e.estimatedMinutes, 0),
      0
    )

    return {
      dayNumber: week.weekNumber,
      dayTitle: week.title,
      dayDescription: week.description,
      topics,
      totalExercises,
      totalMinutes,
    }
  })
}
