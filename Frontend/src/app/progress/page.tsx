"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Activity, ArrowRight, BookOpen, ShoppingBasket, Utensils } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import API from "@/utils/api"
import { mergeShoppingHistory, readLocalShoppingHistory, type ShoppingRecord } from "@/lib/receipt-records"

type Profile = {
  user?: { name?: string | null }
  vitals?: { weight?: string | number | null }
  weightHistory?: Array<{ date?: string; weight?: string | number }>
}

type SavedPlan = {
  id: string
  title?: string | null
  date?: string | null
  duration?: number | null
  diet?: unknown
}

type DashboardData = {
  profile: Profile | null
  plans: SavedPlan[] | null
  receipts: ShoppingRecord[]
  profileError: boolean
  plansError: boolean
  receiptsError: boolean
  loading: boolean
}

const initialData: DashboardData = {
  profile: null,
  plans: null,
  receipts: [],
  profileError: false,
  plansError: false,
  receiptsError: false,
  loading: true,
}

function dateLabel(value: string | null | undefined): string {
  if (!value) return "Date unavailable"
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value)
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

function dailyPlanCalories(entry: SavedPlan | undefined): number | null {
  if (!entry?.diet) return null
  try {
    const parsed: unknown = typeof entry.diet === "string" ? JSON.parse(entry.diet) : entry.diet
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null
    const meals = Object.values(parsed).filter(Array.isArray).flat() as Array<{ calories?: unknown }>
    if (!meals.length) return null
    const calories = meals.reduce((total, meal) => total + (Number(meal?.calories) || 0), 0)
    return calories > 0 ? Math.round(calories) : null
  } catch {
    return null
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(initialData)

  useEffect(() => {
    const controller = new AbortController()
    const localReceipts = readLocalShoppingHistory().filter((record) => record.kind === "self-reported")
    const token = sessionStorage.getItem("token")
    const request = async (url: string): Promise<unknown> => {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      const body = await response.json()
      if (!response.ok || body.success === false) throw new Error("Account data unavailable")
      return body
    }

    void Promise.allSettled([
      request(API.PROFILE_GETPROFILE),
      request(API.DIET_DIETHISTORY),
      request(API.SHOPPING_RECORDS),
    ]).then(([profileResult, plansResult, receiptsResult]) => {
      if (controller.signal.aborted) return
      const profileBody = profileResult.status === "fulfilled" ? profileResult.value as { data?: Profile } : null
      const plansBody = plansResult.status === "fulfilled" ? plansResult.value as { data?: SavedPlan[] } : null
      const remoteReceipts = receiptsResult.status === "fulfilled" && Array.isArray(receiptsResult.value)
        ? receiptsResult.value as ShoppingRecord[]
        : []

      setData({
        profile: profileBody?.data ?? null,
        plans: Array.isArray(plansBody?.data) ? plansBody.data : null,
        receipts: mergeShoppingHistory(localReceipts, remoteReceipts).filter((record) => record.kind === "self-reported"),
        profileError: profileResult.status === "rejected" || !profileBody?.data,
        plansError: plansResult.status === "rejected" || !Array.isArray(plansBody?.data),
        receiptsError: receiptsResult.status === "rejected",
        loading: false,
      })
    })

    return () => controller.abort()
  }, [])

  const weightEntries = useMemo(() => (data.profile?.weightHistory ?? [])
    .map((entry) => ({ date: entry.date ?? "", weight: Number(entry.weight) }))
    .filter((entry) => entry.date && Number.isFinite(entry.weight) && entry.weight > 0)
    .sort((a, b) => a.date.localeCompare(b.date)), [data.profile])
  const profileWeight = Number(data.profile?.vitals?.weight)
  const currentWeight = Number.isFinite(profileWeight) && profileWeight > 0
    ? profileWeight
    : weightEntries.at(-1)?.weight
  const weightChange = weightEntries.length > 1
    ? weightEntries.at(-1)!.weight - weightEntries[0].weight
    : null
  const latestPlan = data.plans?.[0]
  const planCalories = dailyPlanCalories(latestPlan)
  const receiptTotal = data.receipts.reduce((sum, receipt) => sum + (Number(receipt.amountPaid) || 0), 0)

  const nextStep = !currentWeight
    ? { text: "Add your weight and health details to start your dashboard.", label: "Edit profile", href: "/profile" }
    : data.plans?.length === 0
      ? { text: "Save a generated diet to see its daily plan estimate here.", label: "Create a plan", href: "/createDiet" }
      : data.receipts.length === 0
        ? { text: "After shopping, record the amount you paid to track grocery spending.", label: "Open shopping list", href: "/checkout" }
        : { text: "Your profile, saved plans, and recorded purchases are ready to review.", label: "View diet history", href: "/diet-history" }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your dashboard</h1>
        <p className="mt-2 text-muted-foreground">Your profile measurements, saved diet plans, and grocery receipts in one place.</p>
      </div>

      {(data.profileError || data.plansError) && !data.loading && (
        <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          Some account data could not be loaded. Check that the API is running, then refresh this page.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Activity} label="Current weight" value={data.loading ? "Loading…" : currentWeight ? `${currentWeight} kg` : "—"}
          detail={weightChange === null ? "Save your weight in Profile to start a trend" : `${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)} kg since first entry`} />
        <MetricCard icon={BookOpen} label="Saved diet plans" value={data.loading ? "Loading…" : data.plans === null ? "—" : String(data.plans.length)}
          detail={latestPlan ? `Latest: ${latestPlan.title || "Untitled plan"}` : "Save a generated plan to see it here"} />
        <MetricCard icon={Utensils} label="Latest plan estimate" value={data.loading ? "Loading…" : planCalories === null ? "—" : `${planCalories.toLocaleString()} kcal/day`}
          detail={latestPlan ? "Sum of foods in your latest saved plan; not food eaten" : "No saved plan yet"} />
        <MetricCard icon={ShoppingBasket} label="Recorded grocery spending" value={data.loading ? "Loading…" : data.receiptsError && !data.receipts.length ? "—" : `$${receiptTotal.toFixed(2)}`}
          detail={data.receiptsError && !data.receipts.length ? "Receipt records unavailable" : `${data.receipts.length} self-reported receipt${data.receipts.length === 1 ? "" : "s"}${data.receiptsError ? " · local records only" : ""}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weight trend</CardTitle>
            <CardDescription>Entries are recorded when you save a new weight in your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            {weightEntries.length > 1 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightEntries} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value: string) => dateLabel(value).replace(/, \d{4}$/, "")} />
                    <YAxis unit=" kg" domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip labelFormatter={(value) => dateLabel(String(value))} formatter={(value) => [`${value} kg`, "Weight"]} />
                    <Line type="monotone" dataKey="weight" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
                <p>{weightEntries.length ? "Your first weight is recorded. Save another weight later to see a trend." : "No weight entries yet. Save your weight in Profile to begin."}</p>
                <Button asChild variant="outline" size="sm"><Link href="/profile">Edit profile</Link></Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest saved plan</CardTitle>
            <CardDescription>Saved plans are available from your diet history.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestPlan ? (
              <>
                <div>
                  <p className="font-medium">{latestPlan.title || "Untitled plan"}</p>
                  <p className="text-sm text-muted-foreground">Saved {dateLabel(latestPlan.date)}{latestPlan.duration ? ` · ${latestPlan.duration} days` : ""}</p>
                </div>
                <Button asChild variant="outline"><Link href={`/createDiet/${latestPlan.id}`}>Open plan <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </>
            ) : (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>{data.loading ? "Loading saved plans…" : data.plansError ? "Saved plans are unavailable right now." : "You have not saved a diet plan yet."}</p>
                <Button asChild variant="outline" size="sm"><Link href="/createDiet">Create a plan</Link></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent grocery receipts</CardTitle><CardDescription>Amounts you recorded after shopping; retailer payments are not linked.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {data.receipts.length ? data.receipts.slice(0, 3).map((receipt, index) => (
              <div key={receipt.id || index} className="flex items-center justify-between border-b pb-3 text-sm last:border-0">
                <div><p className="font-medium">{receipt.store}</p><p className="text-muted-foreground">{dateLabel(receipt.date)}</p></div>
                <span className="font-semibold">${Number(receipt.amountPaid || 0).toFixed(2)}</span>
              </div>
            )) : <p className="text-sm text-muted-foreground">No grocery receipts recorded yet.</p>}
            <Button asChild variant="link" className="px-0"><Link href="/payment-history">View recorded spending <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Next step</CardTitle><CardDescription>What you can do with FitFuel today.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{nextStep.text}</p>
            <Button asChild><Link href={nextStep.href}>{nextStep.label} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, detail }: { icon: typeof Activity; label: string; value: string; detail: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent><p className="text-2xl font-bold">{value}</p><p className="mt-2 text-xs text-muted-foreground">{detail}</p></CardContent>
    </Card>
  )
}
