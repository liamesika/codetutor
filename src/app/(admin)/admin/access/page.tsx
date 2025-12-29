"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  Shield,
  Clock,
  Check,
  X,
  UserPlus,
  Loader2,
  Mail,
  Search,
  Ban,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface Entitlement {
  id: string
  userId: string
  plan: "FREE" | "BASIC" | "PRO"
  status: "ACTIVE" | "EXPIRED" | "REVOKED"
  grantedAt: string
  expiresAt: string | null
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  grantedBy: {
    name: string | null
    email: string
  } | null
}

interface AccessRequest {
  id: string
  userId: string
  fullName: string
  email: string
  message: string | null
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  user: {
    name: string | null
    email: string
    image: string | null
  }
}

const STATUS_COLORS = {
  ACTIVE: "bg-green-500/10 text-green-500 border-green-500/20",
  EXPIRED: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  REVOKED: "bg-red-500/10 text-red-500 border-red-500/20",
  PENDING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  APPROVED: "bg-green-500/10 text-green-500 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
}

const PLAN_COLORS: Record<"FREE" | "BASIC" | "PRO", string> = {
  FREE: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  BASIC: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  PRO: "bg-amber-500/10 text-amber-500 border-amber-500/20",
}

export default function AdminAccessPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("requests")
  const [searchQuery, setSearchQuery] = useState("")
  const [showGrantDialog, setShowGrantDialog] = useState(false)
  const [grantEmail, setGrantEmail] = useState("")
  const [grantPlan, setGrantPlan] = useState<"FREE" | "BASIC" | "PRO">("BASIC")
  const [processingId, setProcessingId] = useState<string | null>(null)

  const { data: entitlements, isLoading: entitlementsLoading } = useQuery<{
    entitlements: Entitlement[]
    total: number
  }>({
    queryKey: ["adminEntitlements"],
    queryFn: async () => {
      const res = await fetch("/api/admin/entitlements")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
  })

  const { data: requests, isLoading: requestsLoading } = useQuery<{
    requests: AccessRequest[]
    total: number
  }>({
    queryKey: ["adminAccessRequests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/access-requests")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
  })

  const processRequestMutation = useMutation({
    mutationFn: async ({
      requestId,
      approve,
    }: {
      requestId: string
      approve: boolean
    }) => {
      const res = await fetch("/api/admin/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, approve }),
      })
      if (!res.ok) throw new Error("Failed to process request")
      return res.json()
    },
    onSuccess: (_, { approve }) => {
      toast.success(approve ? "Access granted" : "Request rejected")
      queryClient.invalidateQueries({ queryKey: ["adminAccessRequests"] })
      queryClient.invalidateQueries({ queryKey: ["adminEntitlements"] })
      setProcessingId(null)
    },
    onError: () => {
      toast.error("Failed to process request")
      setProcessingId(null)
    },
  })

  const grantAccessMutation = useMutation({
    mutationFn: async ({
      email,
      plan,
    }: {
      email: string
      plan: string
    }) => {
      // First find user by email
      const userRes = await fetch(`/api/admin/users/by-email?email=${encodeURIComponent(email)}`)
      if (!userRes.ok) {
        const error = await userRes.json()
        throw new Error(error.error || "User not found")
      }
      const { user } = await userRes.json()

      const res = await fetch("/api/admin/entitlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan }),
      })
      if (!res.ok) throw new Error("Failed to grant access")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Access granted successfully")
      queryClient.invalidateQueries({ queryKey: ["adminEntitlements"] })
      setShowGrantDialog(false)
      setGrantEmail("")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to grant access")
    },
  })

  const revokeAccessMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch("/api/admin/entitlements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, reason: "Manually revoked by admin" }),
      })
      if (!res.ok) throw new Error("Failed to revoke access")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Access revoked")
      queryClient.invalidateQueries({ queryKey: ["adminEntitlements"] })
    },
    onError: () => {
      toast.error("Failed to revoke access")
    },
  })

  const pendingRequests = requests?.requests.filter((r) => r.status === "PENDING") || []
  const filteredEntitlements = entitlements?.entitlements.filter(
    (e) =>
      e.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Access Management</h1>
          <p className="text-muted-foreground">
            Manage user access and review requests
          </p>
        </div>
        <Button onClick={() => setShowGrantDialog(true)}>
          <UserPlus className="size-4 mr-2" />
          Grant Access
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Shield className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {entitlements?.entitlements.filter((e) => e.status === "ACTIVE").length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              With active entitlements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Entitlements</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entitlements?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time granted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="requests" className="gap-2">
            <Clock className="size-4" />
            Requests
            {pendingRequests.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="entitlements" className="gap-2">
            <Shield className="size-4" />
            Entitlements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4 mt-4">
          {requestsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Check className="size-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending requests</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="size-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{request.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.email}
                          </p>
                          {request.message && (
                            <p className="text-sm mt-2 p-2 bg-muted/50 rounded-lg">
                              {request.message}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(request.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => {
                            setProcessingId(request.id)
                            processRequestMutation.mutate({
                              requestId: request.id,
                              approve: false,
                            })
                          }}
                          disabled={processingId === request.id}
                        >
                          {processingId === request.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <X className="size-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setProcessingId(request.id)
                            processRequestMutation.mutate({
                              requestId: request.id,
                              approve: true,
                            })
                          }}
                          disabled={processingId === request.id}
                        >
                          {processingId === request.id ? (
                            <Loader2 className="size-4 animate-spin mr-2" />
                          ) : (
                            <Check className="size-4 mr-2" />
                          )}
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="entitlements" className="space-y-4 mt-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {entitlementsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : filteredEntitlements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="size-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No entitlements found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredEntitlements.map((entitlement) => (
                <Card key={entitlement.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Shield className="size-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {entitlement.user.name || entitlement.user.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {entitlement.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={PLAN_COLORS[entitlement.plan]}
                        >
                          {entitlement.plan}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={STATUS_COLORS[entitlement.status]}
                        >
                          {entitlement.status}
                        </Badge>
                        {entitlement.status === "ACTIVE" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() =>
                              revokeAccessMutation.mutate(entitlement.userId)
                            }
                          >
                            <Ban className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Grant access dialog */}
      <Dialog open={showGrantDialog} onOpenChange={setShowGrantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant Access</DialogTitle>
            <DialogDescription>
              Grant access to a user by their email address
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select
                value={grantPlan}
                onValueChange={(v) => setGrantPlan(v as typeof grantPlan)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="BASIC">Basic</SelectItem>
                  <SelectItem value="PRO">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGrantDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                grantAccessMutation.mutate({ email: grantEmail, plan: grantPlan })
              }
              disabled={!grantEmail || grantAccessMutation.isPending}
            >
              {grantAccessMutation.isPending && (
                <Loader2 className="size-4 mr-2 animate-spin" />
              )}
              Grant Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
