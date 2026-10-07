"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type MedicalHistoryData = {
  user?: { name?: string | null; age?: number | null; gender?: string | null; email?: string | null }
  vitals?: { height?: string | number | null; weight?: string | number | null; bmi?: number | null; bloodPressure?: string | null; heartRate?: string | number | null; bloodSugar?: string | number | null }
  conditions?: Array<{ name?: string; diagnosed?: string | null; severity?: string | null; controlled?: boolean | null } | string>
  medications?: Array<{ name?: string; dosage?: string | null; frequency?: string | null; startDate?: string | null } | string>
  dietaryRestrictions?: string[]
  dietaryPreferences?: string[]
  allergies?: string[]
  weightHistory?: Array<{ date?: string; weight?: number | string }>
}

const shown = (value: string | number | null | undefined, suffix = "") =>
  value === null || value === undefined || value === "" ? "Not provided" : `${value}${suffix}`

const nameOf = (value: string | { name?: string }) => typeof value === "string" ? value : value.name || "Unnamed"

export function MedicalHistoryClient({ data }: { data: MedicalHistoryData | null }) {
  if (!data) {
    return <Card><CardContent className="space-y-4 p-6"><p>No profile information is available yet.</p><Button asChild><Link href="/profile">Add profile information</Link></Button></CardContent></Card>
  }

  const conditions = Array.isArray(data.conditions) ? data.conditions : []
  const medications = Array.isArray(data.medications) ? data.medications : []
  const weights = Array.isArray(data.weightHistory) ? data.weightHistory : []

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card><CardHeader><CardTitle>Personal information</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p>Name: {shown(data.user?.name)}</p><p>Age: {shown(data.user?.age)}</p><p>Gender: {shown(data.user?.gender)}</p><p>Email: {shown(data.user?.email)}</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Measurements you entered</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p>Height: {shown(data.vitals?.height, " cm")}</p><p>Weight: {shown(data.vitals?.weight, " kg")}</p><p>Blood pressure: {shown(data.vitals?.bloodPressure)}</p><p>Heart rate: {shown(data.vitals?.heartRate, " bpm")}</p><p>Blood sugar: {shown(data.vitals?.bloodSugar)}</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Conditions</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{conditions.length ? conditions.map((condition, index) => <div key={index} className="border-b pb-2"><p className="font-medium">{nameOf(condition)}</p>{typeof condition !== "string" && condition.diagnosed && <p className="text-muted-foreground">Recorded diagnosis date: {condition.diagnosed}</p>}</div>) : <p className="text-muted-foreground">No conditions added to your profile.</p>}</CardContent></Card>
      <Card><CardHeader><CardTitle>Medications</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{medications.length ? medications.map((medication, index) => <div key={index} className="border-b pb-2"><p className="font-medium">{nameOf(medication)}</p>{typeof medication !== "string" && <p className="text-muted-foreground">{[medication.dosage, medication.frequency].filter(Boolean).join(" / ")}</p>}</div>) : <p className="text-muted-foreground">No medications added to your profile.</p>}</CardContent></Card>
      <Card><CardHeader><CardTitle>Food considerations</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p><strong>Allergies:</strong> {data.allergies?.length ? data.allergies.join(", ") : "None recorded"}</p><p><strong>Dietary restrictions:</strong> {data.dietaryRestrictions?.length ? data.dietaryRestrictions.join(", ") : "None recorded"}</p><p><strong>Preferences:</strong> {data.dietaryPreferences?.length ? data.dietaryPreferences.join(", ") : "None recorded"}</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Recorded weights</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{weights.length ? weights.map((entry, index) => <p key={index}>{shown(entry.date)}: {shown(entry.weight, " kg")}</p>) : <p className="text-muted-foreground">No weight entries recorded yet.</p>}</CardContent></Card>
    </div>
  )
}
