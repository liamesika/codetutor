import { DashboardShellSkeleton, SkillsSkeleton } from "@/components/skeletons"

export default function SkillsLoading() {
  return (
    <DashboardShellSkeleton>
      <SkillsSkeleton />
    </DashboardShellSkeleton>
  )
}
