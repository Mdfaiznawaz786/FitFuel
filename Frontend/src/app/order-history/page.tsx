"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mergeShoppingHistory, readLocalShoppingHistory, syncReceiptRecords, type ShoppingRecord } from "@/lib/receipt-records"

export default function ShoppingHistoryPage() {
  const [records, setRecords] = useState<ShoppingRecord[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    setRecords(readLocalShoppingHistory())
    void syncReceiptRecords()
      .then((receipts) => setRecords(mergeShoppingHistory(readLocalShoppingHistory(), receipts)))
      .catch(() => setError("Receipt notes could not be synced with your account. Local store searches are still shown below."))
  }, [])

  return (
    <main className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div><h1 className="text-3xl font-bold">Shopping history</h1><p className="mt-2 text-muted-foreground">Store searches are saved in this browser. Receipt notes are saved to your account. These are not verified retailer orders or deliveries.</p></div>
      {error && <p role="alert" className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800">{error}</p>}
      {records.length === 0 ? (
        <Card><CardContent className="space-y-4 p-6"><p>No shopping activity has been saved yet. Opening a store link from your shopping list will appear here.</p><Button asChild><Link href="/checkout">Open shopping list</Link></Button></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {records.map((record, index) => (
            <Card key={`${record.date}-${index}`}>
              <CardHeader><CardTitle className="text-lg">{record.store} - {record.kind === "store-search" ? "Store search opened" : "Shopping note saved"}</CardTitle></CardHeader>
              <CardContent className="space-y-1 text-sm"><p className="text-muted-foreground">{new Date(record.date).toLocaleString()}</p><ul className="list-inside list-disc">{record.items?.map((item, itemIndex) => <li key={itemIndex}>{item.name} ({item.quantity})</li>)}</ul>{record.amountPaid && <p>Amount you recorded: ${record.amountPaid.toFixed(2)}</p>}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
