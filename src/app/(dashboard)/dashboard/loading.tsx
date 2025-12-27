import { DashboardShellSkeleton, DashboardSkeleton } from "@/components/skeletons"

export default function DashboardLoading() {
  return (
    <DashboardShellSkeleton>
      <DashboardSkeleton />
    </DashboardShellSkeleton>
  )
}
