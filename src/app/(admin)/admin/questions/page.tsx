"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Play,
  Loader2,
} from "lucide-react"

interface Question {
  id: string
  title: string
  type: string
  difficulty: number
  points: number
  isActive: boolean
  topic: {
    id: string
    title: string
  }
  _count: {
    attempts: number
  }
}

interface Topic {
  id: string
  title: string
  week: {
    weekNumber: number
  }
}

export default function AdminQuestionsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [filterTopic, setFilterTopic] = useState<string>("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ["adminQuestions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/questions")
      if (!res.ok) throw new Error("Failed to fetch questions")
      return res.json()
    },
  })

  const { data: topics } = useQuery<Topic[]>({
    queryKey: ["adminTopics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/topics")
      if (!res.ok) throw new Error("Failed to fetch topics")
      return res.json()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
    },
    onSuccess: () => {
      toast.success("Question deleted")
      queryClient.invalidateQueries({ queryKey: ["adminQuestions"] })
    },
    onError: () => {
      toast.error("Failed to delete question")
    },
  })

  const filteredQuestions = questions?.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase())
    const matchesTopic = filterTopic === "all" || q.topic.id === filterTopic
    return matchesSearch && matchesTopic
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Questions</h1>
          <p className="text-muted-foreground">
            Manage practice questions across all topics
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <QuestionForm
              topics={topics || []}
              onSuccess={() => {
                setIsCreateOpen(false)
                queryClient.invalidateQueries({ queryKey: ["adminQuestions"] })
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterTopic} onValueChange={setFilterTopic}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {topics?.map((topic) => (
              <SelectItem key={topic.id} value={topic.id}>
                W{topic.week.weekNumber}: {topic.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Questions table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions?.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {question.title}
                  </TableCell>
                  <TableCell>{question.topic.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {question.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        question.difficulty <= 2
                          ? "default"
                          : question.difficulty <= 3
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      Level {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>{question.points} XP</TableCell>
                  <TableCell>{question._count.attempts}</TableCell>
                  <TableCell>
                    <Badge variant={question.isActive ? "default" : "secondary"}>
                      {question.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Delete this question?")) {
                            deleteMutation.mutate(question.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {editingQuestion && (
            <QuestionForm
              question={editingQuestion}
              topics={topics || []}
              onSuccess={() => {
                setEditingQuestion(null)
                queryClient.invalidateQueries({ queryKey: ["adminQuestions"] })
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function QuestionForm({
  question,
  topics,
  onSuccess,
}: {
  question?: Question
  topics: Topic[]
  onSuccess: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    topicId: question?.topic.id || "",
    type: question?.type || "FULL_PROGRAM",
    title: question?.title || "",
    prompt: "",
    constraints: "",
    starterCode: "",
    solutionCode: "",
    hints: [""],
    tests: [{ input: "", expected: "" }],
    difficulty: question?.difficulty || 1,
    points: question?.points || 100,
    estimatedMinutes: 10,
    isActive: question?.isActive ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = question
        ? `/api/admin/questions/${question.id}`
        : "/api/admin/questions"
      const method = question ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hints: formData.hints.filter((h) => h.trim()),
          tests: formData.tests.filter((t) => t.expected.trim()),
        }),
      })

      if (!res.ok) throw new Error("Failed to save")

      toast.success(question ? "Question updated" : "Question created")
      onSuccess()
    } catch {
      toast.error("Failed to save question")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {question ? "Edit Question" : "Create Question"}
        </DialogTitle>
        <DialogDescription>
          {question
            ? "Update the question details"
            : "Add a new practice question"}
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="space-y-6 py-4">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Topic</Label>
              <Select
                value={formData.topicId}
                onValueChange={(v) => setFormData({ ...formData, topicId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      W{topic.week.weekNumber}: {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_PROGRAM">Full Program</SelectItem>
                  <SelectItem value="FUNCTION">Function</SelectItem>
                  <SelectItem value="FIX_BUG">Fix Bug</SelectItem>
                  <SelectItem value="PREDICT_OUTPUT">Predict Output</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Question title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              placeholder="Question prompt (supports markdown)"
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Constraints (optional)</Label>
            <Textarea
              value={formData.constraints}
              onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
              placeholder="Any constraints or requirements"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Starter Code</Label>
              <Textarea
                value={formData.starterCode}
                onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
                placeholder="public class Solution { ... }"
                rows={8}
                className="font-mono text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Solution Code</Label>
              <Textarea
                value={formData.solutionCode}
                onChange={(e) => setFormData({ ...formData, solutionCode: e.target.value })}
                placeholder="Correct solution"
                rows={8}
                className="font-mono text-sm"
                required
              />
            </div>
          </div>

          {/* Hints */}
          <div className="space-y-2">
            <Label>Hints</Label>
            {formData.hints.map((hint, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={hint}
                  onChange={(e) => {
                    const newHints = [...formData.hints]
                    newHints[i] = e.target.value
                    setFormData({ ...formData, hints: newHints })
                  }}
                  placeholder={`Hint ${i + 1}`}
                />
                {i === formData.hints.length - 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({ ...formData, hints: [...formData.hints, ""] })
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Test cases */}
          <div className="space-y-2">
            <Label>Test Cases</Label>
            {formData.tests.map((test, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <Input
                  value={test.input}
                  onChange={(e) => {
                    const newTests = [...formData.tests]
                    newTests[i].input = e.target.value
                    setFormData({ ...formData, tests: newTests })
                  }}
                  placeholder="Input (space-separated args)"
                />
                <div className="flex gap-2">
                  <Input
                    value={test.expected}
                    onChange={(e) => {
                      const newTests = [...formData.tests]
                      newTests[i].expected = e.target.value
                      setFormData({ ...formData, tests: newTests })
                    }}
                    placeholder="Expected output"
                  />
                  {i === formData.tests.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          tests: [...formData.tests, { input: "", expected: "" }],
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Difficulty (1-5)</Label>
              <Select
                value={formData.difficulty.toString()}
                onValueChange={(v) =>
                  setFormData({ ...formData, difficulty: parseInt(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((d) => (
                    <SelectItem key={d} value={d.toString()}>
                      Level {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Points</Label>
              <Input
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: parseInt(e.target.value) })
                }
                min={10}
                max={500}
              />
            </div>
            <div className="space-y-2">
              <Label>Est. Minutes</Label>
              <Input
                type="number"
                value={formData.estimatedMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedMinutes: parseInt(e.target.value),
                  })
                }
                min={1}
                max={60}
              />
            </div>
          </div>
        </div>
      </ScrollArea>

      <DialogFooter className="mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {question ? "Update Question" : "Create Question"}
        </Button>
      </DialogFooter>
    </form>
  )
}
