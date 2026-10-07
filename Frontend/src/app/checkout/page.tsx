"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import API from "@/utils/api"
import type { CartItem } from "../createDiet/hooks/use-cart"
import { clearCart, readCart } from "@/lib/cart-storage"
import { mergeShoppingHistory, readLocalShoppingHistory, saveReceipt, shoppingHistoryKey, syncReceiptRecords, type ShoppingRecord } from "@/lib/receipt-records"

type PriceEstimate = { name: string; low: number | null; high: number | null; matches: number; sourceUrl: string }

const stores = [
  { name: "Walmart", icon: "/stores/walmart.ico", search: (term: string) => `https://www.walmart.com/search?q=${term}` },
  { name: "Wegmans", icon: "/stores/wegmans.ico", search: (term: string) => `https://www.wegmans.com/shop/search?query=${term}` },
  { name: "Target", icon: "/stores/target.png", search: (term: string) => `https://www.target.com/s/${term}` },
  { name: "Kroger", icon: "/stores/kroger.ico", search: (term: string) => `https://www.kroger.com/search?query=${term}` },
  { name: "Walgreens", icon: "/stores/walgreens.png", search: (term: string) => `https://www.walgreens.com/q/${term}` },
] as const

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [history, setHistory] = useState<ShoppingRecord[]>([])
  const [selectedStore, setSelectedStore] = useState("Walmart")
  const [amountPaid, setAmountPaid] = useState("")
  const [savingReceipt, setSavingReceipt] = useState(false)
  const [finishAfterReceipt, setFinishAfterReceipt] = useState(true)
  const [estimates, setEstimates] = useState<Record<string, PriceEstimate>>({})
  const [pricesLoading, setPricesLoading] = useState(false)
  const [priceError, setPriceError] = useState("")
  const [pricesCheckedAt, setPricesCheckedAt] = useState("")
  const [observedPrices, setObservedPrices] = useState<Record<string, Record<string, number>>>({})
  const [observedLoaded, setObservedLoaded] = useState(false)
  const [priceStores, setPriceStores] = useState<Record<string, string>>({})

  useEffect(() => {
    try {
      setItems(readCart())
      setHistory(readLocalShoppingHistory())
      const observed = JSON.parse(localStorage.getItem("fitfuelObservedPrices") || "{}")
      if (observed && typeof observed === "object") setObservedPrices(observed)
    } catch {
      toast.error("Could not load your saved shopping list")
    } finally {
      setObservedLoaded(true)
    }
  }, [])

  useEffect(() => {
    void syncReceiptRecords()
      .then((receipts) => setHistory((previous) => mergeShoppingHistory(previous, receipts)))
      .catch(() => toast.error("Could not sync receipt notes with your account"))
  }, [])

  useEffect(() => {
    if (observedLoaded) localStorage.setItem("fitfuelObservedPrices", JSON.stringify(observedPrices))
  }, [observedPrices, observedLoaded])

  useEffect(() => {
    const names = [...new Set(items.map((item) => item.name.trim()).filter((name) => name && name.length <= 100))].slice(0, 30)
    if (!names.length) return
    const controller = new AbortController()
    setPricesLoading(true)
    fetch(API.PRICE_ESTIMATES, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      body: JSON.stringify({ names }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not check online listings")
        return response.json() as Promise<{ items: PriceEstimate[]; checkedAt: string }>
      })
      .then((result) => { setEstimates(Object.fromEntries(result.items.map((estimate) => [estimate.name, estimate]))); setPricesCheckedAt(result.checkedAt) })
      .catch((error) => { if (error.name !== "AbortError") setPriceError("Online estimates are unavailable right now. You can still check store prices using the links below.") })
      .finally(() => { if (!controller.signal.aborted) setPricesLoading(false) })
    return () => controller.abort()
  }, [items])

  const offersFor = (item: CartItem) => {
    const prices = Object.entries(observedPrices[item.id] || {}).filter(([, value]) => Number.isFinite(value) && value > 0)
    const result = prices.map(([, value]) => ({ low: value, high: value }))
    const kroger = estimates[item.name]
    if (kroger?.low !== null && kroger?.low !== undefined && kroger.high !== null && !observedPrices[item.id]?.Kroger) result.push({ low: kroger.low, high: kroger.high })
    return result
  }
  const covered = items.map(offersFor).filter((offers) => offers.length)
  const totalLow = covered.reduce((sum, offers) => sum + Math.min(...offers.map((offer) => offer.low)), 0)
  const totalHigh = covered.reduce((sum, offers) => sum + Math.max(...offers.map((offer) => offer.high)), 0)
  const money = (value: number) => `$${value.toFixed(2)}`
  const storePrice = (item: CartItem, storeName: string) => {
    const observed = observedPrices[item.id]?.[storeName]
    if (observed) return money(observed)
    const estimate = estimates[item.name]
    if (storeName === "Kroger" && estimate && estimate.low !== null && estimate.high !== null) return `${money(estimate.low)}-${money(estimate.high)}`
    return null
  }
  const setObservedPrice = (itemId: string, store: string, value: string) => {
    const price = Number(value)
    setObservedPrices((previous) => {
      const updated = { ...previous[itemId] }
      if (value === "" || !Number.isFinite(price) || price <= 0 || price > 500) delete updated[store]
      else updated[store] = price
      return { ...previous, [itemId]: updated }
    })
  }

  const listText = items.map((item) => `${item.name} - ${item.quantity}`).join("\n")

  const copyList = async () => {
    try {
      await navigator.clipboard.writeText(listText)
      toast.success("Shopping list copied")
    } catch {
      toast.error("Could not copy the list")
    }
  }

  const recordShopping = async () => {
    const amount = Number(amountPaid)
    if (!amountPaid || !Number.isFinite(amount) || amount <= 0 || amount > 10000) {
      toast.error("Enter the receipt total between $0.01 and $10,000")
      return
    }
    const record: ShoppingRecord = { id: crypto.randomUUID(), date: new Date().toISOString(), store: selectedStore, kind: "self-reported", amountPaid: amount, items: items.map(({ name, quantity }) => ({ name, quantity })) }
    setSavingReceipt(true)
    try {
      const saved = await saveReceipt(record)
      try { localStorage.setItem(shoppingHistoryKey(), JSON.stringify([saved, ...readLocalShoppingHistory()])) } catch { /* The receipt is already stored in Supabase. */ }
      setHistory((previous) => [saved, ...previous])
      setAmountPaid("")
      if (finishAfterReceipt) {
        clearCart()
        setItems([])
        toast.success("Receipt saved and shopping list cleared for your next plan")
      } else {
        toast.success("Receipt saved; your shopping list is still available")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the receipt amount")
    } finally {
      setSavingReceipt(false)
    }
  }

  const recordStoreSearch = (store: string, item: CartItem) => {
    const record: ShoppingRecord = { date: new Date().toISOString(), store, kind: "store-search", items: [{ name: item.name, quantity: item.quantity }] }
    localStorage.setItem(shoppingHistoryKey(), JSON.stringify([record, ...readLocalShoppingHistory()]))
    setHistory((previous) => [record, ...previous])
  }

  const finishShopping = () => {
    clearCart()
    setItems([])
    toast.success("Shopping list cleared for your next plan")
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/createDiet"><ArrowLeft className="mr-2 h-4 w-4" />Back to diet planner</Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Shop your diet plan</h1>
          <p className="mt-2 text-muted-foreground">
            Select a store next to each item to find it, then choose an available product and check out on the store website. Your FitFuel list stays here until you finish shopping; it does not transfer into a store cart.
          </p>
        </div>

        {items.length === 0 ? (
          <Card><CardContent className="p-6">Your shopping list is empty. Add foods from your diet plan first.</CardContent></Card>
        ) : (
          <>
            <Card>
              <CardHeader><CardTitle>Shopping list ({items.length})</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={copyList}><Copy className="mr-2 h-4 w-4" />Copy full list</Button>
                  <span className="self-center text-sm text-muted-foreground">Prices vary by store and location. Estimates exclude tax and delivery.</span>
                </div>

                {pricesLoading && <p role="status" className="text-sm text-muted-foreground">Checking public Kroger listings for rough prices...</p>}
                {pricesCheckedAt && <p className="text-sm text-muted-foreground">Automatic ranges come from matched Kroger online listings checked {new Date(pricesCheckedAt).toLocaleString()}. Other stores show a price only after you enter one you found. Prices may differ at your location.</p>}
                {priceError && <p role="status" className="text-sm text-amber-800">{priceError}</p>}

                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex flex-col gap-3 border-t pt-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
                    <div className="min-w-0 lg:max-w-[32%]">
                      <p className="break-words font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity} / {item.mealType || "food"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2" aria-label={`Stores for ${item.name}`}>
                      {stores.map((store) => (
                        <a
                          key={store.name}
                          href={store.search(encodeURIComponent(item.name))}
                          onClick={() => recordStoreSearch(store.name, item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Search ${item.name} at ${store.name} (opens a new tab)`}
                          title={`Search at ${store.name}`}
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border bg-white px-2.5 py-1.5 text-xs font-medium shadow-sm transition-colors hover:border-purple-400 hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
                        >
                          {/* The retailer favicons are served locally. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={store.icon} alt="" width={20} height={20} className="h-5 w-5 shrink-0 object-contain" />
                          <span>{store.name}</span>
                          {storePrice(item, store.name) && <span className="text-emerald-700">{storePrice(item, store.name)}</span>}
                        </a>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground lg:basis-full">
                      <label htmlFor={`price-${item.id}`}>Price you found:</label>
                      <select aria-label={`Store for ${item.name} price`} value={priceStores[item.id] || "Walmart"} onChange={(event) => setPriceStores((previous) => ({ ...previous, [item.id]: event.target.value }))} className="rounded border bg-white px-2 py-1">
                        {stores.map((store) => <option key={store.name}>{store.name}</option>)}
                      </select>
                      <input id={`price-${item.id}`} aria-label={`Price found for ${item.name}`} type="number" min="0.01" max="500" step="0.01" placeholder="0.00" value={observedPrices[item.id]?.[priceStores[item.id] || "Walmart"] ?? ""} onChange={(event) => setObservedPrice(item.id, priceStores[item.id] || "Walmart", event.target.value)} className="w-20 rounded border bg-white px-2 py-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>{covered.length === items.length ? "Rough grocery total" : "Partial grocery estimate"}</CardTitle></CardHeader><CardContent className="space-y-2"><p className="text-2xl font-bold">{covered.length ? `${money(totalLow)} - ${money(totalHigh)}` : "No price estimate yet"}</p><p className="text-sm text-muted-foreground">Based on one store package per item row, using matched Kroger online listings and any store prices you entered. {items.length - covered.length} of {items.length} item rows still need a price. Store checkout totals may differ.</p></CardContent></Card>

            <Card>
              <CardHeader><CardTitle>Keep a shopping record</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">After you finish at a store, enter the receipt total to save a spending note to your FitFuel account. FitFuel cannot verify payment, delivery, or order status.</p>
                <div className="flex flex-wrap items-center gap-3">
                  <label htmlFor="store" className="text-sm font-medium">Store</label>
                  <select id="store" value={selectedStore} onChange={(event) => setSelectedStore(event.target.value)} className="rounded-md border bg-white px-3 py-2">
                    {stores.map((store) => <option key={store.name}>{store.name}</option>)}
                    <option>Other</option>
                  </select>
                  <label htmlFor="amount-paid" className="text-sm font-medium">Receipt total</label>
                  <input id="amount-paid" type="number" min="0.01" max="10000" step="0.01" placeholder="$0.00" value={amountPaid} onChange={(event) => setAmountPaid(event.target.value)} className="w-28 rounded-md border bg-white px-3 py-2" />
                  <Button onClick={() => void recordShopping()} disabled={savingReceipt}><CheckCircle2 className="mr-2 h-4 w-4" />{savingReceipt ? "Saving..." : "Save receipt amount"}</Button>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="finish-after-receipt" checked={finishAfterReceipt} onCheckedChange={(checked) => setFinishAfterReceipt(checked === true)} />
                  <label htmlFor="finish-after-receipt" className="text-sm">This receipt completes my shopping list; clear it after saving</label>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="outline">Finish shopping without a receipt</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Finish this shopping list?</AlertDialogTitle>
                      <AlertDialogDescription>This clears the items from this browser for your next plan. No payment will be recorded.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep list</AlertDialogCancel>
                      <AlertDialogAction onClick={finishShopping}>Finish and clear list</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </>
        )}

        {history.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Saved shopping notes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {history.map((record, index) => (
                <div key={`${record.date}-${index}`} className="border-t pt-3 text-sm">
                  <p className="font-medium">{record.store} / {record.kind === "store-search" ? "Search opened" : "Shopping note"} / {new Date(record.date).toLocaleString()}</p>
                  <p className="text-muted-foreground">{record.items.map((item) => item.name).join(", ")}</p>
                  {record.amountPaid && <p className="text-muted-foreground">Amount you recorded: {money(record.amountPaid)}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
