import { DashboardShellSkeleton, AchievementsSkeleton } from "@/components/skeletons"

export default function AchievementsLoading() {
  return (
    <DashboardShellSkeleton>
      <AchievementsSkeleton />
    </DashboardShellSkeleton>
  )
}
