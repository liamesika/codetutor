"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  FileQuestion,
  Plus,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  title: string
  difficulty: string
  type: string
  isPublished: boolean
  xpReward: number
}

interface Lesson {
  id: string
  title: string
  order: number
  isPublished: boolean
  questions: Question[]
}

interface Topic {
  id: string
  title: string
  order: number
  isPublished: boolean
  lessons: Lesson[]
}

interface Week {
  id: string
  weekNumber: number
  title: string
  isPublished: boolean
  topics: Topic[]
}

interface Course {
  id: string
  name: string
  slug: string
  isPublished: boolean
  weeks: Week[]
}

interface CurriculumData {
  courses: Course[]
}

async function fetchCurriculum(): Promise<CurriculumData> {
  const res = await fetch("/api/admin/curriculum")
  if (!res.ok) throw new Error("Failed to fetch curriculum")
  return res.json()
}

async function togglePublish(type: string, id: string, isPublished: boolean) {
  const res = await fetch(`/api/admin/curriculum/${type}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished }),
  })
  if (!res.ok) throw new Error("Failed to update")
  return res.json()
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    EASY: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    HARD: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }
  return (
    <Badge variant="outline" className={colors[difficulty] || ""}>
      {difficulty}
    </Badge>
  )
}

function QuestionRow({ question }: { question: Question }) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (published: boolean) => togglePublish("question", question.id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["curriculum"] }),
  })

  return (
    <div className="flex items-center justify-between py-2 px-4 hover:bg-muted/50 rounded-md">
      <div className="flex items-center gap-3">
        <FileQuestion className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{question.title}</span>
        <DifficultyBadge difficulty={question.difficulty} />
        <Badge variant="secondary" className="text-xs">
          {question.type}
        </Badge>
        <span className="text-xs text-muted-foreground">+{question.xpReward} XP</span>
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/admin/curriculum/question/${question.id}`}>
          <Button variant="ghost" size="sm">
            <Pencil className="h-3 w-3" />
          </Button>
        </Link>
        <Switch
          checked={question.isPublished}
          onCheckedChange={(checked) => mutation.mutate(checked)}
          disabled={mutation.isPending}
        />
      </div>
    </div>
  )
}

function LessonSection({ lesson }: { lesson: Lesson }) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (published: boolean) => togglePublish("lesson", lesson.id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["curriculum"] }),
  })

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between py-2 px-3 hover:bg-muted/30 rounded-md">
        <CollapsibleTrigger className="flex items-center gap-2 flex-1">
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{lesson.title}</span>
          <Badge variant="outline" className="text-xs">
            {lesson.questions.length} questions
          </Badge>
        </CollapsibleTrigger>
        <div className="flex items-center gap-2">
          {lesson.isPublished ? (
            <Eye className="h-3 w-3 text-green-600" />
          ) : (
            <EyeOff className="h-3 w-3 text-muted-foreground" />
          )}
          <Switch
            checked={lesson.isPublished}
            onCheckedChange={(checked) => mutation.mutate(checked)}
            disabled={mutation.isPending}
          />
        </div>
      </div>
      <CollapsibleContent className="pl-6 border-l ml-2">
        {lesson.questions.map((question) => (
          <QuestionRow key={question.id} question={question} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

function TopicSection({ topic }: { topic: Topic }) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (published: boolean) => togglePublish("topic", topic.id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["curriculum"] }),
  })

  const totalQuestions = topic.lessons.reduce(
    (sum, lesson) => sum + lesson.questions.length,
    0
  )

  return (
    <Card className="mb-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex items-center gap-2 flex-1">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <CardTitle className="text-base">{topic.title}</CardTitle>
              <Badge variant="secondary">
                {topic.lessons.length} lessons • {totalQuestions} questions
              </Badge>
            </CollapsibleTrigger>
            <div className="flex items-center gap-2">
              {topic.isPublished ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch
                checked={topic.isPublished}
                onCheckedChange={(checked) => mutation.mutate(checked)}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {topic.lessons.map((lesson) => (
              <LessonSection key={lesson.id} lesson={lesson} />
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

function WeekSection({ week }: { week: Week }) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (published: boolean) => togglePublish("week", week.id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["curriculum"] }),
  })

  const totalTopics = week.topics.length
  const totalQuestions = week.topics.reduce(
    (sum, topic) =>
      sum + topic.lessons.reduce((s, l) => s + l.questions.length, 0),
    0
  )

  return (
    <div className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-2">
          <CollapsibleTrigger className="flex items-center gap-3 flex-1">
            {isOpen ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold">
              Week {week.weekNumber}: {week.title}
            </span>
            <Badge>
              {totalTopics} topics • {totalQuestions} questions
            </Badge>
          </CollapsibleTrigger>
          <div className="flex items-center gap-3">
            {week.isPublished ? (
              <Badge variant="default" className="bg-green-600">Published</Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
            <Switch
              checked={week.isPublished}
              onCheckedChange={(checked) => mutation.mutate(checked)}
              disabled={mutation.isPending}
            />
          </div>
        </div>
        <CollapsibleContent className="pl-4">
          {week.topics.map((topic) => (
            <TopicSection key={topic.id} topic={topic} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function CurriculumSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <Skeleton className="h-16 w-full rounded-lg mb-2" />
          <div className="pl-4 space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CurriculumPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["curriculum"],
    queryFn: fetchCurriculum,
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Curriculum Management</h1>
          <p className="text-muted-foreground">
            Manage your course content, weeks, topics, and questions
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Week
        </Button>
      </div>

      {isLoading && <CurriculumSkeleton />}

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <p className="text-destructive">Failed to load curriculum data</p>
          </CardContent>
        </Card>
      )}

      {data?.courses?.map((course) => (
        <div key={course.id}>
          <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 rounded-lg">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <h2 className="font-semibold">{course.name}</h2>
              <p className="text-sm text-muted-foreground">
                Slug: {course.slug}
              </p>
            </div>
            <Badge variant={course.isPublished ? "default" : "secondary"} className="ml-auto">
              {course.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
          {course.weeks?.map((week) => (
            <WeekSection key={week.id} week={week} />
          ))}
        </div>
      ))}

      {data?.courses?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No curriculum found</h3>
            <p className="text-muted-foreground mb-4">
              Run the seed script to populate the curriculum
            </p>
            <code className="bg-muted px-3 py-1 rounded text-sm">
              npm run seed:curriculum
            </code>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
