/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

// Colors for pie chart
const COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Green
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  "#8884D8", // Purple
  "#82CA9D", // Light Green
  "#FF6B6B", // Red
]

// Custom tooltip for charts
const CustomTooltip = ({
  active,
  payload,
  label,
  showPercentage = false,
}: {
  active?: boolean
  payload?: { name?: string; value: number; color: string; payload?: { percent?: number } }[]
  label?: string
  showPercentage?: boolean
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium mb-1">{label || payload[0].name}</p>
        {payload.map((entry:any, index:any) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name ? `${entry.name}: ` : ""}
            {entry.value}
            {showPercentage && entry.payload && entry.payload.percent
              ? ` (${(entry.payload.percent * 100).toFixed(0)}%)`
              : entry.name === "Protein" || entry.name === "Carbs" || entry.name === "Fat"
                ? "g"
                : ""}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Custom renderer for the pie chart legend
const renderLegend = (props:any, selectedSegment:any, setSelectedSegment:any) => {
  const { payload } = props

  return (
    <ul className="recharts-default-legend" style={{ padding: 0, margin: 0, textAlign: "left" }}>
      {payload.map((entry:any, index:any) => (
        <li
          key={`item-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 10,
            cursor: "pointer",
            opacity: selectedSegment === null || selectedSegment === index ? 1 : 0.6,
            fontWeight: selectedSegment === index ? "bold" : "normal",
          }}
          onClick={() => {
            if (setSelectedSegment) {
              setSelectedSegment(index === selectedSegment ? null : index)
            }
          }}
        >
          <svg width="14" height="14" style={{ marginRight: 8 }}>
            <rect width="14" height="14" fill={entry.color} />
          </svg>
          <span style={{ fontSize: "0.875rem" }}>
            {entry.value} ({entry.payload.percent ? `${(entry.payload.percent * 100).toFixed(0)}%` : ""})
          </span>
        </li>
      ))}
    </ul>
  )
}

// Calculate percentages for pie chart data
const calculatePercentages = (data:any) => {
  const total = data.reduce((sum:any, item:any) => sum + item.value, 0)
  return data.map((item:any) => ({
    ...item,
    percent: item.value / total,
  }))
}

export function useChartConfig() {
  return {
    COLORS,
    CustomTooltip,
    renderLegend,
    calculatePercentages,
  }
}
