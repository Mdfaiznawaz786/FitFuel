"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { syncReceiptRecords, type ShoppingRecord } from "@/lib/receipt-records"

export default function PaymentHistoryPage() {
  const [notes, setNotes] = useState<ShoppingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    void syncReceiptRecords()
      .then((records) => setNotes(records.filter((record) => record.kind === "self-reported" && typeof record.amountPaid === "number" && Number.isFinite(record.amountPaid) && record.amountPaid > 0)))
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load saved receipt amounts"))
      .finally(() => setLoading(false))
  }, [])

  const total = notes.reduce((sum, record) => sum + (record.amountPaid || 0), 0)

  return (
    <main className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div><h1 className="text-3xl font-bold">Payment history</h1><p className="mt-2 text-muted-foreground">FitFuel does not charge for groceries or receive payment details from retailers. These are receipt amounts you recorded to your FitFuel account.</p></div>
      {loading ? <p role="status">Loading saved receipt amounts...</p> : error ? <Card><CardContent className="p-6 text-red-700" role="alert">{error}</CardContent></Card> : notes.length === 0 ? (
        <Card><CardContent className="space-y-4 p-6"><p>No spending notes have been saved to your account yet. After shopping, enter the receipt total on your shopping list. Your actual payment history stays with the retailer.</p><Button asChild><Link href="/checkout">Open shopping list</Link></Button></CardContent></Card>
      ) : (
        <><Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total amounts you recorded to your account</p><p className="text-3xl font-bold">${total.toFixed(2)}</p><p className="mt-2 text-sm text-muted-foreground">Self-reported only; not a verified payment total.</p></CardContent></Card><div className="space-y-4">{notes.map((record, index) => <Card key={record.id || `${record.date}-${index}`}><CardHeader><CardTitle className="text-lg">{record.store}</CardTitle></CardHeader><CardContent className="flex justify-between gap-4 text-sm"><span>{new Date(record.date).toLocaleString()}</span><span className="font-semibold">${record.amountPaid?.toFixed(2)}</span></CardContent></Card>)}</div></>
      )}
    </main>
  )
}
