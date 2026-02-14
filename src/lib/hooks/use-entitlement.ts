"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface EntitlementResponse {
  entitlement: {
    status: string | null
    plan: "FREE" | "BASIC" | "PRO"
    hasAccess: boolean
    expiresAt: string | null
    grantedAt: string | null
    isAdmin?: boolean
  }
}

export function useEntitlement() {
  const { status } = useSession()
  const isAuthenticated = status === "authenticated"

  const { data, isLoading } = useQuery<EntitlementResponse>({
    queryKey: ["entitlement"],
    queryFn: async () => {
      const res = await fetch("/api/entitlement")
      if (!res.ok) throw new Error("Failed to fetch entitlement")
      return res.json()
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const isAdmin = data?.entitlement.isAdmin ?? false

  return {
    plan: data?.entitlement.plan ?? "FREE",
    isPro: data?.entitlement.plan === "PRO" || isAdmin,
    isAdmin,
    isLoading,
  }
}
