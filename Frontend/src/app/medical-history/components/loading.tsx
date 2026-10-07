import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-6 md:py-10">
      <Skeleton className="h-9 w-64 mb-6" />
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 border rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>

          <div className="flex-1 border rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-2 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex gap-2">
            {["Overview", "Conditions", "Progress", "Medications"].map((tab, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  )
}
