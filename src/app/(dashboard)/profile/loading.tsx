import { DashboardShellSkeleton } from "@/components/skeletons"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0E26] via-[#1E1B4B]/50 to-[#0F0E26]">
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <Skeleton className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-[#4F46E5]/20" />
          <div className="space-y-4 flex-1 text-center md:text-left">
            <Skeleton className="h-8 w-48 mx-auto md:mx-0 bg-[#4F46E5]/20" />
            <Skeleton className="h-4 w-32 mx-auto md:mx-0 bg-[#4F46E5]/10" />
            <div className="flex gap-2 justify-center md:justify-start">
              <Skeleton className="h-6 w-20 rounded-full bg-[#4F46E5]/20" />
              <Skeleton className="h-6 w-24 rounded-full bg-[#4F46E5]/20" />
              <Skeleton className="h-6 w-28 rounded-full bg-[#4F46E5]/20" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl bg-[#4F46E5]/20" />
                  <div>
                    <Skeleton className="h-6 w-16 bg-[#4F46E5]/20 mb-1" />
                    <Skeleton className="h-3 w-20 bg-[#4F46E5]/10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Streak Milestones */}
        <Card className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
          <CardHeader>
            <Skeleton className="h-6 w-40 bg-[#4F46E5]/20" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="w-16 h-20 rounded-xl bg-[#4F46E5]/20 shrink-0" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-[#1E1B4B]/30 border-[#4F46E5]/10">
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-[#4F46E5]/20" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-24 rounded-xl bg-[#4F46E5]/20" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProfileLoading() {
  return (
    <DashboardShellSkeleton>
      <ProfilePageSkeleton />
    </DashboardShellSkeleton>
  )
}
