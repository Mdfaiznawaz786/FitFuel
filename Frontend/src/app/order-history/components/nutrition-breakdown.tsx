/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useChartConfig } from "../hooks/use-chart-config"
import ChartSkeleton from "@/components/ui/chart-skeleton"

interface SelectedRow {
  diet: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function NutritionBreakdown({ selectedRow, isLoading }: { selectedRow: SelectedRow; isLoading: boolean }) {
  const { COLORS, CustomTooltip, renderLegend, calculatePercentages } = useChartConfig()
  const [selectedPieSegment, setSelectedPieSegment] = useState<number | null>(null)
  const [selectedBarSegment, setSelectedBarSegment] = useState<number | null>(null)

  // Prepare nutrition data for the selected row
  const getNutritionData = (row: SelectedRow | null) => {
    if (!row) return []
    return [
      { name: "Protein", value: row.protein * 4 },
      { name: "Carbs", value: row.carbs * 4 },
      { name: "Fat", value: row.fat * 9 },
    ]
  }

  const nutritionData = getNutritionData(selectedRow)
  const nutritionDataWithPercent = calculatePercentages(nutritionData)

  const macroData = [
    { name: "Protein", value: selectedRow?.protein || 0 },
    { name: "Carbs", value: selectedRow?.carbs || 0 },
    { name: "Fat", value: selectedRow?.fat || 0 },
  ]

  const handlePieClick = (_: any, index: number) => {
    if (selectedPieSegment === index) {
      setSelectedPieSegment(null)
    } else {
      setSelectedPieSegment(index)
    }
  }

  const handleBarClick = (_: unknown, index: number) => {
    if (selectedBarSegment === index) {
      setSelectedBarSegment(null)
    } else {
      setSelectedBarSegment(index)
    }
  }

  const pieColors = ["#0088FE", "#00C49F", "#FFBB28"]

  if (isLoading) {
    return (
      <Card className="mt-10 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Nutrition Breakdown</CardTitle>
          <CardDescription>Loading nutritional information...</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted rounded-lg p-6 text-center shadow-sm animate-pulse">
                <div className="h-6 w-24 bg-gray-200 rounded mx-auto mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded mx-auto mb-1"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
          <ChartSkeleton />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-10 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Nutrition Breakdown for {selectedRow.diet}</CardTitle>
        <CardDescription>Detailed nutritional information</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-muted rounded-lg p-6 text-center shadow-sm">
            <h3 className="text-lg font-medium mb-2">Calories</h3>
            <p className="text-3xl font-bold mb-1">{selectedRow.calories}</p>
            <p className="text-sm text-muted-foreground">kcal per day</p>
          </div>
          <div className="bg-muted rounded-lg p-6 text-center shadow-sm">
            <h3 className="text-lg font-medium mb-2">Protein</h3>
            <p className="text-3xl font-bold mb-1">{selectedRow.protein}g</p>
            <p className="text-sm text-muted-foreground">
              {Math.round(((selectedRow.protein * 4) / selectedRow.calories) * 100)}% of calories
            </p>
          </div>
          <div className="bg-muted rounded-lg p-6 text-center shadow-sm">
            <h3 className="text-lg font-medium mb-2">Carbs</h3>
            <p className="text-3xl font-bold mb-1">{selectedRow.carbs}g</p>
            <p className="text-sm text-muted-foreground">
              {Math.round(((selectedRow.carbs * 4) / selectedRow.calories) * 100)}% of calories
            </p>
          </div>
        </div>

        <div className="mt-8 mb-8">
          <h3 className="text-lg font-medium mb-4 px-2">Macronutrient Distribution</h3>
          <div className="h-[320px] p-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <Pie
                  data={nutritionDataWithPercent}
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
                  {nutritionDataWithPercent.map((entry: { name: string; value: number; percent: number }, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index]}
                      stroke={selectedPieSegment === index ? "#fff" : pieColors[index]}
                      strokeWidth={selectedPieSegment === index ? 2 : 1}
                      style={{
                        cursor: "pointer",
                        opacity: selectedPieSegment === null || selectedPieSegment === index ? 1 : 0.6,
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
                  content={(props) => renderLegend(props, selectedPieSegment, setSelectedPieSegment)}
                  wrapperStyle={{ right: 0, width: "40%", paddingLeft: 20 }}
                />
              </PieChart>
            </ResponsiveContainer>

            {selectedPieSegment !== null && (
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-3 rounded-md shadow-md border border-gray-200">
                <p className="font-medium text-lg" style={{ color: pieColors[selectedPieSegment] }}>
                  {nutritionDataWithPercent[selectedPieSegment].name}
                </p>
                <p className="text-lg font-bold">
                  {(nutritionDataWithPercent[selectedPieSegment].percent * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-gray-500">({nutritionDataWithPercent[selectedPieSegment].value} calories)</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 px-2">Macronutrient Breakdown (grams)</h3>
          <div className="h-[320px] p-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={macroData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  padding={{ left: 20, right: 20 }}
                  axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis
                  padding={{ top: 20, bottom: 20 }}
                  axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  onClick={(data) => {
                    const index = macroData.findIndex((item) => item.name === data.payload?.value)
                    setSelectedBarSegment(index === selectedBarSegment ? null : index)
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} isAnimationActive={true} onClick={handleBarClick}>
                  {macroData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index]}
                      style={{
                        cursor: "pointer",
                        opacity: selectedBarSegment === null || selectedBarSegment === index ? 1 : 0.6,
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {selectedBarSegment !== null && (
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-3 rounded-md shadow-md border border-gray-200">
                <p className="font-medium text-lg" style={{ color: pieColors[selectedBarSegment] }}>
                  {macroData[selectedBarSegment].name}
                </p>
                <p className="text-lg font-bold">{macroData[selectedBarSegment].value}g</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
