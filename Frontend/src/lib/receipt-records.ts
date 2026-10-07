import API from "@/utils/api"

export type ShoppingRecord = {
  id?: string
  date: string
  store: string
  items: { name: string; quantity: string }[]
  kind?: "store-search" | "self-reported"
  amountPaid?: number
  synced?: boolean
}

export function shoppingHistoryKey(): string {
  try {
    const token = sessionStorage.getItem("token")
    const payload = token ? JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) : null
    if (typeof payload?.sub === "string" && /^[0-9a-f-]{36}$/i.test(payload.sub)) return `fitfuelShoppingHistory:${payload.sub}`
  } catch { /* A missing or invalid token has no account-specific browser history. */ }
  return "fitfuelShoppingHistory:anonymous"
}

export function readLocalShoppingHistory(): ShoppingRecord[] {
  try {
    const key = shoppingHistoryKey()
    if (key !== "fitfuelShoppingHistory:anonymous" && !localStorage.getItem(key)) {
      const legacy = localStorage.getItem("fitfuelShoppingHistory")
      if (legacy) {
        localStorage.setItem(key, legacy)
        localStorage.removeItem("fitfuelShoppingHistory")
      }
    }
    const value = JSON.parse(localStorage.getItem(key) || "[]")
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("token")}` }
}

export async function saveReceipt(input: ShoppingRecord): Promise<ShoppingRecord> {
  const response = await fetch(API.SHOPPING_RECORDS, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ clientId: input.id, date: input.date, store: input.store, amountPaid: input.amountPaid, items: input.items }),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(typeof result.message === "string" ? result.message : "Could not save receipt amount to your account")
  return { ...result, synced: true }
}

export async function syncReceiptRecords(): Promise<ShoppingRecord[]> {
  const local = readLocalShoppingHistory()
  for (const record of local) {
    if (record.kind !== "self-reported" || !record.amountPaid || record.synced) continue
    record.id ||= crypto.randomUUID()
    localStorage.setItem(shoppingHistoryKey(), JSON.stringify(local))
    await saveReceipt(record)
    record.synced = true
    localStorage.setItem(shoppingHistoryKey(), JSON.stringify(local))
  }
  const response = await fetch(API.SHOPPING_RECORDS, { headers: authHeaders() })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !Array.isArray(data)) throw new Error("Could not load receipt amounts from your account")
  return data as ShoppingRecord[]
}

export function mergeShoppingHistory(local: ShoppingRecord[], receipts: ShoppingRecord[]): ShoppingRecord[] {
  const remoteIds = new Set(receipts.map((record) => record.id))
  return [...receipts, ...local.filter((record) => !record.id || !remoteIds.has(record.id))]
    .sort((a, b) => b.date.localeCompare(a.date))
}
