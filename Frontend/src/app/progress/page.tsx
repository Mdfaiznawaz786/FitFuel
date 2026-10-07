"use client"

import { ArrowUpRight, Calendar, ChevronDown, Clock, Package, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useUserStats } from "./hooks/useUserStats"
import { useWeightProgress } from "./hooks/useWeightProgress"
import { useNutritionBreakdown } from "./hooks/useNutritionBreakdown"
import { useUpcomingDeliveries } from "./hooks/useUpcomingDeliveries"
import { useRecommendations } from "./hooks/useRecommendations"

export default function DashboardPage() {
  const { stats } = useUserStats()
  const { weightData } = useWeightProgress()
  const { nutritionData } = useNutritionBreakdown()
  const { deliveries } = useUpcomingDeliveries()
  const { recommendations } = useRecommendations()

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Progress Dashboard</h1>
            <p className="text-muted-foreground">Track your diet plan progress and manage your upcoming deliveries</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
                <Utensils className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.currentWeight} kg</div>
                <div className="flex items-center text-xs text-green-500">
                  <ChevronDown className="h-4 w-4" />
                  <span>{stats.weightChange} kg from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calories Today</CardTitle>
                <Utensils className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.caloriesConsumed}</div>
                <div className="flex items-center text-xs text-green-500">
                  <ChevronDown className="h-4 w-4" />
                  <span>{stats.caloriesDifference} below target</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Delivery</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.nextDelivery.days} days</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>{stats.nextDelivery.date}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
                <CardDescription>Your weight trend over the last 3 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <WeightChart data={weightData} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
  <CardHeader>
    <CardTitle>Nutrition Breakdown</CardTitle>
    <CardDescription>Today&apos;s macronutrient distribution</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {nutritionData && nutritionData.length > 0 ? (
        <>
          <div key={nutritionData[0].name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className={`mr-2 h-3 w-3 rounded-full bg-blue-500`}></div>
                <span>{nutritionData[0].name}</span>
              </div>
              <div>
                {nutritionData[0].current}g / {nutritionData[0].target}g
              </div>
            </div>
            <Progress
              value={(nutritionData[0].current / nutritionData[0].target) * 100}
              className="h-2 bg-muted [&>div]:bg-blue-500"
            />
          </div>
          <div key={nutritionData[1].name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className={`mr-2 h-3 w-3 rounded-full bg-green-500`}></div>
                <span>{nutritionData[1].name}</span>
              </div>
              <div>
                {nutritionData[1].current}g / {nutritionData[1].target}g
              </div>
            </div>
            <Progress
              value={(nutritionData[1].current / nutritionData[1].target) * 100}
              className="h-2 bg-muted [&>div]:bg-green-500"
            />
          </div>
          <div key={nutritionData[2].name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className={`mr-2 h-3 w-3 rounded-full bg-yellow-500`}></div>
                <span>{nutritionData[2].name}</span>
              </div>
              <div>
                {nutritionData[2].current}g / {nutritionData[2].target}g
              </div>
            </div>
            <Progress
              value={(nutritionData[2].current / nutritionData[2].target) * 100}
              className="h-2 bg-muted [&>div]:bg-yellow-500"
            />
          </div>
          <div key={nutritionData[3].name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className={`mr-2 h-3 w-3 rounded-full bg-red-500`}></div>
                <span>{nutritionData[3].name}</span>
              </div>
              <div>
                {nutritionData[3].current}g / {nutritionData[3].target}g
              </div>
            </div>
            <Progress
              value={(nutritionData[3].current / nutritionData[3].target) * 100}
              className="h-2 bg-muted [&>div]:bg-red-500"
            />
          </div>
        </>
      ) : (
        <div className="flex h-[200px] w-full items-center justify-center">
          <p className="text-muted-foreground">No nutrition data available</p>
        </div>
      )}
    </div>
  </CardContent>
</Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Deliveries</CardTitle>
                <CardDescription>Your next scheduled deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveries.map((delivery, index) => (
                    <div
                      key={delivery.id}
                      className={`flex items-center justify-between ${index !== deliveries.length - 1 ? "border-b pb-4" : ""}`}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{delivery.name}</p>
                        <p className="text-sm text-muted-foreground">{delivery.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{delivery.date}</span>
                        </div>
          
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Based on your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((recommendation) => (
                    <div key={recommendation.id} className="rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded-full bg-${recommendation.icon === "utensils" ? "green" : "blue"}-100 p-1.5 text-${recommendation.icon === "utensils" ? "green" : "blue"}-600`}
                        >
                          {recommendation.icon === "utensils" ? (
                            <Utensils className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <p className="text-sm font-medium">{recommendation.title}</p>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{recommendation.description}</p>
                      <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs" onClick={() => window.location.href = recommendation.actionUrl}>
                        {recommendation.actionText} <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/createDiet"}>
                  Get Personalized Plan
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function WeightChart({ data }: { data: { date: string; weight: number }[] }) {
  // If no data is available, show a placeholder chart
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <p className="text-muted-foreground">No weight data available</p>
      </div>
    )
  }

  // Calculate min and max values with padding
  const weights = data.map(item => item.weight)
  const minWeight = Math.floor(Math.min(...weights) - 2) // Add some padding below
  const maxWeight = Math.ceil(Math.max(...weights) + 2) // Add some padding above
  
  // Create y-axis scale
  const yRange = maxWeight - minWeight
  const yScale = (weight: number) => {
    // Map weight value to y coordinate (180 is max height, 20 is top padding)
    return 180 - ((weight - minWeight) / yRange * 160) + 20
  }
  
  // Calculate equally spaced y-axis labels
  const yLabels = []
  const stepSize = Math.ceil(yRange / 4) // Divide range into ~4 steps
  for (let i = 0; i <= 4; i++) {
    const value = minWeight + (stepSize * i)
    if (value <= maxWeight) {
      yLabels.push(value)
    }
  }

  // Generate x-axis labels from actual data if available
  const generateXLabels = () => {
    if (data.length <= 1) {
      return (
        <>
          <text x="0" y="215" fontSize="10" fill="#64748b" textAnchor="start">Feb</text>
          <text x="125" y="215" fontSize="10" fill="#64748b" textAnchor="middle">Mar</text>
          <text x="250" y="215" fontSize="10" fill="#64748b" textAnchor="middle">Apr</text>
          <text x="375" y="215" fontSize="10" fill="#64748b" textAnchor="middle">May</text>
        </>
      )
    }
    
    // Choose evenly spaced points for labels
    const labelIndexes = []
    if (data.length <= 4) {
      // If 4 or fewer points, show all
      for (let i = 0; i < data.length; i++) {
        labelIndexes.push(i)
      }
    } else {
      // Otherwise show first, last, and 2 in between
      labelIndexes.push(0)
      labelIndexes.push(Math.floor(data.length / 3))
      labelIndexes.push(Math.floor(data.length * 2 / 3))
      labelIndexes.push(data.length - 1)
    }
    
    return labelIndexes.map(index => {
      const point = data[index]
      const date = new Date(point.date)
      const month = date.toLocaleString('default', { month: 'short' })
      const day = date.getDate()
      const x = (index / (data.length - 1)) * 500
      
      return (
        <text 
          key={`x-label-${index}`}
          x={x} 
          y="215" 
          fontSize="10" 
          fill="#64748b"
          textAnchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"}
        >
          {`${month} ${day}`}
        </text>
      )
    })
  }

  // Implement the chart using the data prop
  return (
    <div className="h-[200px] w-full">
      {/* Changed viewBox to include space for both x and y-axis labels */}
      <svg viewBox="-50 -10 550 235" className="h-full w-full">
        {/* Grid lines */}
        {yLabels.map((label, i) => (
          <line 
            key={`grid-${i}`}
            x1="0" 
            y1={yScale(label)} 
            x2="500" 
            y2={yScale(label)} 
            stroke="#f1f5f9" 
            strokeWidth="1" 
          />
        ))}

        {/* X-axis line */}
        <line
          x1="0"
          y1="200"
          x2="500"
          y2="200"
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* X-axis labels */}
        {generateXLabels()}

        {/* Y-axis labels */}
        {yLabels.map((label, i) => (
          <text 
            key={`y-label-${i}`}
            x="-20" 
            y={yScale(label) + 4} // +4 for vertical alignment
            fontSize="10" 
            fill="#64748b"
            textAnchor="end"
          >
            {label}kg
          </text>
        ))}

        {/* Weight line - use actual data if available */}
        {data.length > 1 ? (
          <path
            d={generatePathFromData(data)}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
        ) : (
          <path
            d="M0,140 C20,138 40,135 60,130 C80,125 100,120 120,115 C140,110 160,105 180,100 C200,95 220,92 240,90 C260,88 280,85 300,83 C320,81 340,80 360,78 C380,76 400,74 420,72 C440,70 460,68 480,65 L500,63"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
        )}

        {/* Area under the line */}
        {data.length > 1 ? (
          <path
            d={generateAreaPathFromData(data)}
            fill="hsl(var(--primary))"
            fillOpacity="0.1"
          />
        ) : (
          <path
            d="M0,140 C20,138 40,135 60,130 C80,125 100,120 120,115 C140,110 160,105 180,100 C200,95 220,92 240,90 C260,88 280,85 300,83 C320,81 340,80 360,78 C380,76 400,74 420,72 C440,70 460,68 480,65 L500,63 V200 H0 Z"
            fill="hsl(var(--primary))"
            fillOpacity="0.1"
          />
        )}

        {/* Data points - use actual data if available */}
        {data.length > 1 ? (
          data.map((point, index) => {
            const x = (index / (data.length - 1)) * 500;
            const y = yScale(point.weight);
            return (
              <circle key={index} cx={x} cy={y} r="3" fill="hsl(var(--primary))" />
            );
          })
        ) : (
          <>
            <circle cx="0" cy="140" r="3" fill="hsl(var(--primary))" />
            <circle cx="60" cy="130" r="3" fill="hsl(var(--primary))" />
            <circle cx="120" cy="115" r="3" fill="hsl(var(--primary))" />
            <circle cx="180" cy="100" r="3" fill="hsl(var(--primary))" />
            <circle cx="240" cy="90" r="3" fill="hsl(var(--primary))" />
            <circle cx="300" cy="83" r="3" fill="hsl(var(--primary))" />
            <circle cx="360" cy="78" r="3" fill="hsl(var(--primary))" />
            <circle cx="420" cy="72" r="3" fill="hsl(var(--primary))" />
            <circle cx="480" cy="65" r="3" fill="hsl(var(--primary))" />
          </>
        )}
      </svg>
    </div>
  )
}

// Helper function to generate SVG path from data points
function generatePathFromData(data: { date: string; weight: number }[]): string {
  if (data.length < 2) return "";
  
  // Calculate min and max values with padding
  const weights = data.map(item => item.weight)
  const minWeight = Math.floor(Math.min(...weights) - 2)
  const maxWeight = Math.ceil(Math.max(...weights) + 2)
  
  // Create y-axis scale
  const yRange = maxWeight - minWeight
  const yScale = (weight: number) => {
    return 180 - ((weight - minWeight) / yRange * 160) + 20
  }
  
  let path = "";
  data.forEach((point, index) => {
    const x = (index / (data.length - 1)) * 500;
    const y = yScale(point.weight);
    
    if (index === 0) {
      path += `M${x},${y} `;
    } else {
      path += `L${x},${y} `;
    }
  });
  
  return path;
}

// Helper function to generate area path from data points
function generateAreaPathFromData(data: { date: string; weight: number }[]): string {
  if (data.length < 2) return "";
  
  const linePath = generatePathFromData(data);
  return `${linePath} L500,200 L0,200 Z`;
}
