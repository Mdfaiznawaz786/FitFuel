"use client"

import { Button } from "@/components/ui/button"

interface DurationSelectorProps {
  duration: number
  onDurationChange: (duration: number) => void
  goal: string
}

export function DurationSelector({ duration, onDurationChange, goal }: DurationSelectorProps) {
  return (
    <div className="rounded-xl border-2 bg-purple-50 p-6 shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Diet Plan Duration</h3>
      <div className="space-y-4">
        <p className="text-lg text-gray-600">Choose how long you intend to follow this meal plan:</p>
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4">
        <Button
            variant={duration === 1 ? "default" : "outline"}
            onClick={() => onDurationChange(1)}
            className={`h-12 w-20 text-lg ${duration === 1 ? "bg-purple-600" : ""}`}
          >
            1 Day
          </Button>
          <Button
            variant={duration === 7 ? "default" : "outline"}
            onClick={() => onDurationChange(7)}
            className={`h-12 w-20 text-lg ${duration === 7 ? "bg-purple-600" : ""}`}
          >
            7 Days
          </Button>
          <Button
            variant={duration === 14 ? "default" : "outline"}
            onClick={() => onDurationChange(14)}
            className={`h-12 w-20 text-lg ${duration === 14 ? "bg-purple-600" : ""}`}
          >
            14 Days
          </Button>
          <Button
            variant={duration === 30 ? "default" : "outline"}
            onClick={() => onDurationChange(30)}
            className={`h-12 w-20 text-lg ${duration === 30 ? "bg-purple-600" : ""}`}
          >
            30 Days
          </Button>
          <Button
            variant={duration === 90 ? "default" : "outline"}
            onClick={() => onDurationChange(90)}
            className={`h-12 w-20 text-lg ${duration === 90 ? "bg-purple-600" : ""}`}
          >
            90 Days
          </Button>
        </div>
        <div className="mt-4 p-4 bg-purple-100 rounded-lg border border-purple-200">
          <p className="text-lg font-medium text-purple-800">
            {duration} day{duration === 1 ? "" : "s"} for your {goal} goal. This duration is saved with the plan and shown in Diet History. The meals are a daily template; selecting more days does not generate new meals or track what you eat.
          </p>
        </div>
      </div>
    </div>
  )
}
