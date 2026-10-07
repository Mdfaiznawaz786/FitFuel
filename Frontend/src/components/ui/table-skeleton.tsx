export default function TableSkeleton() {
    return (
      <div className="rounded-md border overflow-hidden">
        <div className="bg-muted p-3 border-b">
          <div className="flex items-center">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="ml-auto h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="bg-card">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-3 border-b last:border-0">
              <div className="flex-1 space-y-1">
                <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  