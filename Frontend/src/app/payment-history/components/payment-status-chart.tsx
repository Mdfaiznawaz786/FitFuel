"use client"

import { useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useChartConfig } from "../../order-history/hooks/use-chart-config"
import ChartSkeleton from "@/components/ui/chart-skeleton"

interface PaymentData {
  name: string;
  value: number;
  percent?: number; // Optional property to avoid errors
}

interface PaymentStatusChartProps {
  data: PaymentData[];
  isLoading: boolean;
  selectedPayment?: { status: string };
}

export default function PaymentStatusChart({ data, isLoading, selectedPayment }: PaymentStatusChartProps) {
  const { COLORS, CustomTooltip, renderLegend, calculatePercentages } = useChartConfig()
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null)

  const chartData: PaymentData[] = calculatePercentages(data)

  const handlePieClick = (_: unknown, index: number) => {
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
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>Distribution of payment statuses</CardDescription>
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
        <CardTitle>Payment Status</CardTitle>
        <CardDescription>
          {selectedPayment ? `Status: ${selectedPayment.status}` : "Distribution of payment statuses"}
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
                {chartData.map((entry, index) => (
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
                content={<CustomTooltip showPercentage={true} />}
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
              <p className="text-lg font-bold">{((chartData[selectedSegment].percent ?? 0) * 100).toFixed(0)}%</p>
              <p className="text-sm text-gray-500">({chartData[selectedSegment].value} payments)</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
