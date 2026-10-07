"use client"

import { useState } from "react"
import { Clipboard, Stethoscope, Dumbbell } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { MealItem, UserProfile } from "../hooks/use-diet-plan"

interface ProfessionalCardsProps {
  onStartChat: () => void
  plan: Record<string, MealItem[]>
  profile: UserProfile
}

export function ProfessionalCards({ onStartChat, plan, profile }: ProfessionalCardsProps) {
  const [showDoctorSummary, setShowDoctorSummary] = useState(false)
  const summary = `FitFuel diet plan for clinician review\nGoal: ${profile.goal}\n${Object.entries(plan).map(([meal, foods]) => `${meal}: ${foods.map((food) => `${food.name} (${food.quantity})`).join(", ")}`).join("\n")}\n\nPlease review this plan with your own clinician before making changes for a medical condition.`

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      toast.success("Plan summary copied")
    } catch {
      toast.error("Could not copy the summary. Please select and copy it manually.")
    }
  }

  return (
    <div className="mt-8 rounded-xl border-2 bg-purple-100 p-6">
      <h3 className="mb-2 text-2xl font-bold">Get help with your plan</h3>
      <p className="mb-6 text-gray-600">Share a summary with your clinician or ask the AI fitness guide about your current plan.</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <button type="button" className="text-left" onClick={() => setShowDoctorSummary(true)}>
          <Card className="h-full border-2 transition-shadow hover:shadow-xl"><CardContent className="flex items-center gap-4 bg-blue-50 p-6"><Stethoscope className="h-10 w-10 shrink-0 text-blue-700" /><div><h4 className="text-xl font-bold">Share with your doctor</h4><p className="text-gray-600">Copy a summary to discuss with your own clinician</p></div></CardContent></Card>
        </button>
        <button type="button" className="text-left" onClick={onStartChat}>
          <Card className="h-full border-2 transition-shadow hover:shadow-xl"><CardContent className="flex items-center gap-4 bg-green-50 p-6"><Dumbbell className="h-10 w-10 shrink-0 text-green-700" /><div><h4 className="text-xl font-bold">Ask AI Fitness Guide</h4><p className="text-gray-600">Ask questions about your current diet plan</p></div></CardContent></Card>
        </button>
      </div>
      <Dialog open={showDoctorSummary} onOpenChange={setShowDoctorSummary}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto">
          <DialogHeader><DialogTitle>Share your plan with a doctor</DialogTitle><DialogDescription>This prepares a summary for your own clinician. FitFuel does not connect you to a doctor.</DialogDescription></DialogHeader>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted p-4 text-sm">{summary}</pre>
          <Button type="button" onClick={copySummary}><Clipboard className="mr-2 h-4 w-4" />Copy summary</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
