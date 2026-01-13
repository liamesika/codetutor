"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  FileQuestion,
} from "lucide-react"

interface Week {
  id: string
  weekNumber: number
  title: string
}

interface Question {
  id: string
  title: string
  difficulty: number
  points: number
  type: string
  topic: {
    id: string
    title: string
  }
}

interface AssignmentQuestion {
  id: string
  questionId: string
  orderIndex: number
  question: {
    id: string
    title: string
    difficulty: number
    points: number
  }
}

interface Assignment {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  isPublished: boolean
  createdAt: string
  week: Week
  questions: AssignmentQuestion[]
  _count: {
    submissions: number
  }
}

export default function AdminAssignmentsPage() {
  const queryClient = useQueryClient()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<string>("")

  // Fetch weeks
  const { data: weeks } = useQuery<Week[]>({
    queryKey: ["adminWeeks"],
    queryFn: async () => {
      const res = await fetch("/api/admin/weeks")
      if (!res.ok) throw new Error("Failed to fetch weeks")
      return res.json()
    },
  })

  // Fetch assignments
  const { data: assignments, isLoading } = useQuery<Assignment[]>({
    queryKey: ["adminAssignments"],
    queryFn: async () => {
      const res = await fetch("/api/admin/assignments")
      if (!res.ok) throw new Error("Failed to fetch assignments")
      return res.json()
    },
  })

  // Fetch all questions for selection
  const { data: questions } = useQuery<Question[]>({
    queryKey: ["adminQuestions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/questions")
      if (!res.ok) throw new Error("Failed to fetch questions")
      return res.json()
    },
  })

  // Create assignment mutation
  const createMutation = useMutation({
    mutationFn: async (data: {
      weekId: string
      title: string
      description?: string
      isPublished: boolean
      questionIds: string[]
    }) => {
      const res = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create assignment")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAssignments"] })
      setCreateDialogOpen(false)
      toast.success("Assignment created successfully")
    },
    onError: () => {
      toast.error("Failed to create assignment")
    },
  })

  // Update assignment mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: {
        title?: string
        description?: string | null
        isPublished?: boolean
        questionIds?: string[]
      }
    }) => {
      const res = await fetch(`/api/admin/assignments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update assignment")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAssignments"] })
      setEditingAssignment(null)
      toast.success("Assignment updated successfully")
    },
    onError: () => {
      toast.error("Failed to update assignment")
    },
  })

  // Delete assignment mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/assignments/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete assignment")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAssignments"] })
      toast.success("Assignment deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete assignment")
    },
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Homework Assignments</h1>
          <p className="text-muted-foreground">
            Create and manage homework assignments for each week
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <CreateAssignmentForm
              weeks={weeks || []}
              questions={questions || []}
              onSubmit={(data) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Assignments list */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>
            {assignments?.length || 0} assignments created
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments?.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <Badge variant="outline">
                      Week {assignment.week.weekNumber}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {assignment.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {assignment.questions.length} questions
                    </Badge>
                  </TableCell>
                  <TableCell>{assignment._count.submissions}</TableCell>
                  <TableCell>
                    {assignment.isPublished ? (
                      <Badge className="bg-green-500">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingAssignment(assignment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Delete this assignment?")) {
                            deleteMutation.mutate(assignment.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!assignments || assignments.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No assignments yet. Create your first assignment!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingAssignment}
        onOpenChange={(open) => !open && setEditingAssignment(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {editingAssignment && (
            <EditAssignmentForm
              assignment={editingAssignment}
              questions={questions || []}
              onSubmit={(data) =>
                updateMutation.mutate({ id: editingAssignment.id, data })
              }
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Create Assignment Form Component
function CreateAssignmentForm({
  weeks,
  questions,
  onSubmit,
  isLoading,
}: {
  weeks: Week[]
  questions: Question[]
  onSubmit: (data: {
    weekId: string
    title: string
    description?: string
    isPublished: boolean
    questionIds: string[]
  }) => void
  isLoading: boolean
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [weekId, setWeekId] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const selectedWeek = weeks.find((w) => w.id === weekId)

  // Filter questions by week's topics
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const newIds = [...selectedQuestionIds]
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= newIds.length) return
    ;[newIds[index], newIds[newIndex]] = [newIds[newIndex], newIds[index]]
    setSelectedQuestionIds(newIds)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!weekId || !title || selectedQuestionIds.length === 0) {
      return
    }
    onSubmit({
      weekId,
      title,
      description: description || undefined,
      isPublished,
      questionIds: selectedQuestionIds,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Create New Assignment</DialogTitle>
        <DialogDescription>
          Create a homework assignment by selecting a week and adding questions
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="week">Week</Label>
          <Select value={weekId} onValueChange={setWeekId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a week" />
            </SelectTrigger>
            <SelectContent>
              {weeks.map((week) => (
                <SelectItem key={week.id} value={week.id}>
                  Week {week.weekNumber}: {week.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Week 1 Homework"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Instructions for students..."
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="published"
            checked={isPublished}
            onCheckedChange={setIsPublished}
          />
          <Label htmlFor="published">Publish immediately</Label>
        </div>

        {/* Question selection */}
        <div className="grid gap-2">
          <Label>Select Questions ({selectedQuestionIds.length} selected)</Label>
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="border rounded-lg max-h-48 overflow-y-auto">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  if (selectedQuestionIds.includes(q.id)) {
                    setSelectedQuestionIds(selectedQuestionIds.filter((id) => id !== q.id))
                  } else {
                    setSelectedQuestionIds([...selectedQuestionIds, q.id])
                  }
                }}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    selectedQuestionIds.includes(q.id)
                      ? "bg-primary border-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {selectedQuestionIds.includes(q.id) && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <span className="flex-1 text-sm">{q.title}</span>
                <Badge variant="outline" className="text-xs">
                  {q.topic?.title}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Lv.{q.difficulty}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Selected questions order */}
        {selectedQuestionIds.length > 0 && (
          <div className="grid gap-2">
            <Label>Question Order (drag to reorder)</Label>
            <div className="border rounded-lg">
              {selectedQuestionIds.map((qId, index) => {
                const q = questions.find((q) => q.id === qId)
                if (!q) return null
                return (
                  <div
                    key={qId}
                    className="flex items-center gap-2 p-2 border-b last:border-b-0"
                  >
                    <span className="text-muted-foreground w-6 text-center">
                      {index + 1}.
                    </span>
                    <span className="flex-1 text-sm">{q.title}</span>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveQuestion(index, "up")}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveQuestion(index, "down")}
                        disabled={index === selectedQuestionIds.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          setSelectedQuestionIds(
                            selectedQuestionIds.filter((id) => id !== qId)
                          )
                        }
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading || !weekId || !title || selectedQuestionIds.length === 0}>
          {isLoading ? "Creating..." : "Create Assignment"}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Edit Assignment Form Component
function EditAssignmentForm({
  assignment,
  questions,
  onSubmit,
  isLoading,
}: {
  assignment: Assignment
  questions: Question[]
  onSubmit: (data: {
    title?: string
    description?: string | null
    isPublished?: boolean
    questionIds?: string[]
  }) => void
  isLoading: boolean
}) {
  const [title, setTitle] = useState(assignment.title)
  const [description, setDescription] = useState(assignment.description || "")
  const [isPublished, setIsPublished] = useState(assignment.isPublished)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(
    assignment.questions.map((q) => q.questionId)
  )
  const [searchTerm, setSearchTerm] = useState("")

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const newIds = [...selectedQuestionIds]
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= newIds.length) return
    ;[newIds[index], newIds[newIndex]] = [newIds[newIndex], newIds[index]]
    setSelectedQuestionIds(newIds)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description: description || null,
      isPublished,
      questionIds: selectedQuestionIds,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Edit Assignment</DialogTitle>
        <DialogDescription>
          Update assignment details for Week {assignment.week.weekNumber}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="published"
            checked={isPublished}
            onCheckedChange={setIsPublished}
          />
          <Label htmlFor="published">Published</Label>
        </div>

        {/* Question selection */}
        <div className="grid gap-2">
          <Label>Questions ({selectedQuestionIds.length} selected)</Label>
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="border rounded-lg max-h-48 overflow-y-auto">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  if (selectedQuestionIds.includes(q.id)) {
                    setSelectedQuestionIds(selectedQuestionIds.filter((id) => id !== q.id))
                  } else {
                    setSelectedQuestionIds([...selectedQuestionIds, q.id])
                  }
                }}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    selectedQuestionIds.includes(q.id)
                      ? "bg-primary border-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {selectedQuestionIds.includes(q.id) && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <span className="flex-1 text-sm">{q.title}</span>
                <Badge variant="secondary" className="text-xs">
                  Lv.{q.difficulty}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Selected questions order */}
        {selectedQuestionIds.length > 0 && (
          <div className="grid gap-2">
            <Label>Question Order</Label>
            <div className="border rounded-lg">
              {selectedQuestionIds.map((qId, index) => {
                const q = questions.find((q) => q.id === qId)
                if (!q) return null
                return (
                  <div
                    key={qId}
                    className="flex items-center gap-2 p-2 border-b last:border-b-0"
                  >
                    <span className="text-muted-foreground w-6 text-center">
                      {index + 1}.
                    </span>
                    <span className="flex-1 text-sm">{q.title}</span>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveQuestion(index, "up")}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveQuestion(index, "down")}
                        disabled={index === selectedQuestionIds.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          setSelectedQuestionIds(
                            selectedQuestionIds.filter((id) => id !== qId)
                          )
                        }
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading || !title || selectedQuestionIds.length === 0}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  )
}
