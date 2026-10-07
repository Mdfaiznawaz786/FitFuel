export default function ChartSkeleton() {
    return (
      <div className="h-[320px] p-2 flex items-center justify-center">
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 relative overflow-hidden bg-gray-100 rounded-lg">
            {/* Animated gradient for chart skeleton */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            ></div>
  
            {/* Chart elements skeleton */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end h-4/5">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 bg-gray-200 rounded-t-md mx-1"
                  style={{
                    height: `${Math.random() * 60 + 20}%`,
                    opacity: 0.7,
                  }}
                ></div>
              ))}
            </div>
  
            {/* Legend skeleton */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <div className="w-16 h-3 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
  
          {/* X-axis skeleton */}
          <div className="h-6 mt-2 flex justify-around">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-8 h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  