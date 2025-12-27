import { Skeleton } from "@/components/ui/skeleton"

export default function PricingLoading() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <Skeleton className="h-8 w-32 mx-auto mb-6 rounded-full" />
        <Skeleton className="h-12 w-80 mx-auto mb-4" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* Free tier info */}
      <Skeleton className="h-24 w-full rounded-2xl mb-12" />

      {/* Plans grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-6 md:p-8 bg-[#1E1B4B]/30 border border-[#4F46E5]/10"
          >
            <Skeleton className="h-14 w-14 rounded-xl mb-4" />
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-32 mb-6" />
            <div className="space-y-3 mb-6">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-5 w-full" />
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Features section */}
      <div className="text-center">
        <Skeleton className="h-6 w-48 mx-auto mb-6" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
