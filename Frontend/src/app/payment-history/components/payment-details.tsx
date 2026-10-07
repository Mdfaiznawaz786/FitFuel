"use client"

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useChartConfig } from "../../order-history/hooks/use-chart-config"
import ChartSkeleton from "@/components/ui/chart-skeleton"
import { CalendarIcon, CreditCard, FileText, RefreshCw } from "lucide-react"

interface PaymentDetailsProps {
  selectedPayment: {
    baseAmount: number;
    tax: number;
    shipping: number;
    discount: number;
    paymentId: string;
    paymentMethod: string;
    cardDetails?: string;
    invoiceNumber: string;
    reference: string;
    date: string;
    time: string;
    timeline: Array<{
      type: string;
      title: string;
      time: string;
      description: string;
    }>;
    dietPlan: {
      name: string;
      duration: string;
      price: string;
      status: string;
    };
  };
  isLoading: boolean;
}

export default function PaymentDetails({ selectedPayment, isLoading }: PaymentDetailsProps) {
  const { CustomTooltip } = useChartConfig()

  if (isLoading) {
    return (
      <Card className="mt-10 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Loading payment information...</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartSkeleton />
        </CardContent>
      </Card>
    )
  }

  // Prepare data for the breakdown chart
  const breakdownData = [
    {
      name: "Base Amount",
      value: selectedPayment.baseAmount,
    },
    {
      name: "Tax",
      value: selectedPayment.tax,
    },
    {
      name: "Shipping",
      value: selectedPayment.shipping,
    },
    {
      name: "Discount",
      value: -selectedPayment.discount, // Negative for visual representation
    },
  ]

  return (
    <Card className="mt-10 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Payment Details for {selectedPayment.paymentId}</CardTitle>
        <CardDescription>Detailed payment information</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-muted rounded-lg p-6 text-center shadow-sm">
            <div className="flex justify-center mb-2">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Payment Method</h3>
            <p className="text-xl font-bold mb-1">{selectedPayment.paymentMethod}</p>
            <p className="text-sm text-muted-foreground">{selectedPayment.cardDetails || "N/A"}</p>
          </div>
          <div className="bg-muted rounded-lg p-6 text-center shadow-sm">
            <div className="flex justify-center mb-2">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Invoice</h3>
            <p className="text-xl font-bold mb-1">{selectedPayment.invoiceNumber}</p>
            <p className="text-sm text-muted-foreground">Reference: {selectedPayment.reference}</p>
          </div>
          <div className="bg-muted rounded-lg p-6 text-center shadow-sm">
            <div className="flex justify-center mb-2">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Date</h3>
            <p className="text-xl font-bold mb-1">{selectedPayment.date}</p>
            <p className="text-sm text-muted-foreground">{selectedPayment.time}</p>
          </div>
        </div>

        <div className="mt-8 mb-8">
          <h3 className="text-lg font-medium mb-4 px-2">Payment Breakdown</h3>
          <div className="h-[320px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                  tickFormatter={(value) => `$${Math.abs(value)}`}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  formatter={(value) => [`$${Math.abs(value as number)}`, (value as number) < 0 ? "Discount" : ""]}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {breakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "Base Amount"
                          ? "#0088FE"
                          : entry.name === "Tax"
                            ? "#00C49F"
                            : entry.name === "Shipping"
                              ? "#FFBB28"
                              : "#FF8042"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Payment Timeline</h3>
          <div className="space-y-4">
            {selectedPayment.timeline.map((event, index) => (
              <div key={index} className="flex items-start">
                <div
                  className={`mt-1 rounded-full p-1 ${
                    event.type === "created"
                      ? "bg-blue-100 text-blue-600"
                      : event.type === "processed"
                        ? "bg-yellow-100 text-yellow-600"
                        : event.type === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                  }`}
                >
                  <RefreshCw className="h-4 w-4" />
                </div>
                <div className="ml-4">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.time}</p>
                  <p className="text-sm mt-1">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Associated Diet Plan</h3>
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{selectedPayment.dietPlan.name}</p>
                <p className="text-sm text-muted-foreground">Duration: {selectedPayment.dietPlan.duration}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{selectedPayment.dietPlan.price}</p>
                <p className="text-sm text-muted-foreground">Status: {selectedPayment.dietPlan.status}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
