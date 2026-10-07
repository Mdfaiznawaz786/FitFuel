"use client"

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useChartConfig } from "../../order-history/hooks/use-chart-config"
import ChartSkeleton from "@/components/ui/chart-skeleton"

interface MonthlyPaymentData {
  month: string;
  amount: number;
}

export default function MonthlyPaymentChart({ data, isLoading }: { data: MonthlyPaymentData[]; isLoading: boolean }) {
  const { CustomTooltip } = useChartConfig()

  if (isLoading) {
    return (
      <Card className="mb-10 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Monthly Payment Trends</CardTitle>
          <CardDescription>Total payment amount per month</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartSkeleton />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-10 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Monthly Payment Trends</CardTitle>
        <CardDescription>Total payment amount per month</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[320px] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="month"
                padding={{ left: 20, right: 20 }}
                axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <YAxis
                padding={{ top: 20, bottom: 20 }}
                axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Area
                type="monotone"
                dataKey="amount"
                name="Payment Amount"
                stroke="#0088FE"
                strokeWidth={3}
                fill="#0088FE"
                fillOpacity={0.3}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#0088FE" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
