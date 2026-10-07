/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useChartConfig } from "../hooks/use-chart-config"
import ChartSkeleton from "@/components/ui/chart-skeleton"

interface ChartData {
  name: string
  value: number
}

interface DietDistributionChartProps {
  data: ChartData[]
  isLoading: boolean
  selectedRow?: { diet: string }
}

export default function DietDistributionChart({ data, isLoading, selectedRow }: DietDistributionChartProps) {
  const { COLORS, CustomTooltip, renderLegend, calculatePercentages } = useChartConfig()
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null)

  const chartData = calculatePercentages(data)

  const handlePieClick = (_: any, index: number) => {
    if (selectedSegment === index) {
      setSelectedSegment(null)
    } else {
      setSelectedSegment(index)
    }
  }

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Diet Distribution</CardTitle>
          <CardDescription>Distribution of ordered diet plans</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartSkeleton />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Diet Distribution</CardTitle>
        <CardDescription>
          {selectedRow ? `Showing data for ${selectedRow.diet}` : "Distribution of ordered diet plans"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[320px] p-2 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Pie
                data={chartData}
                cx="40%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={80}
                innerRadius={30}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                isAnimationActive={true}
                onClick={handlePieClick}
              >
                {chartData.map((entry: ChartData, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={selectedSegment === index ? "#fff" : COLORS[index % COLORS.length]}
                    strokeWidth={selectedSegment === index ? 2 : 1}
                    style={{
                      cursor: "pointer",
                      opacity: selectedSegment === null || selectedSegment === index ? 1 : 0.6,
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip showPercentage={true} active={undefined} payload={undefined} label={undefined} />}
                wrapperStyle={{ zIndex: 100 }}
                cursor={false}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                content={(props) => renderLegend(props, selectedSegment, setSelectedSegment)}
                wrapperStyle={{ right: 0, width: "40%", paddingLeft: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>

          {selectedSegment !== null && (
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-3 rounded-md shadow-md border border-gray-200">
              <p className="font-medium text-lg" style={{ color: COLORS[selectedSegment % COLORS.length] }}>
                {chartData[selectedSegment].name}
              </p>
              <p className="text-lg font-bold">{(chartData[selectedSegment].percent * 100).toFixed(0)}%</p>
              <p className="text-sm text-gray-500">({chartData[selectedSegment].value} orders)</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
