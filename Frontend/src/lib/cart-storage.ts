import type { CartItem } from "@/app/createDiet/hooks/use-cart"

const legacyKey = "dietPlannerCart"

export function cartStorageKey(): string {
  try {
    const token = sessionStorage.getItem("token")
    const payload = token ? JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) : null
    if (typeof payload?.sub === "string" && /^[0-9a-f-]{36}$/i.test(payload.sub)) return `dietPlannerCart:${payload.sub}`
  } catch { /* A missing token uses the anonymous browser list. */ }
  return "dietPlannerCart:anonymous"
}

export function readCart(): CartItem[] {
  try {
    const key = cartStorageKey()
    let stored = localStorage.getItem(key)
    if (stored === null) {
      stored = localStorage.getItem(legacyKey)
      if (stored !== null) {
        localStorage.setItem(key, stored)
        localStorage.removeItem(legacyKey)
      }
    }
    const parsed = JSON.parse(stored || "[]")
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]): void {
  localStorage.setItem(cartStorageKey(), JSON.stringify(items))
}

export function clearCart(): void {
  localStorage.removeItem(cartStorageKey())
}
