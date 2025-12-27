import { DashboardShellSkeleton, LeaderboardSkeleton } from "@/components/skeletons"

export default function LeaderboardLoading() {
  return (
    <DashboardShellSkeleton>
      <LeaderboardSkeleton />
    </DashboardShellSkeleton>
  )
}
