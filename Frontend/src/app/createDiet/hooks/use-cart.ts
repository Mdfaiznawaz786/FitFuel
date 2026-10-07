"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { MealItem } from "./use-diet-plan"
import { cartStorageKey, readCart, writeCart } from "@/lib/cart-storage"

export type CartItem = MealItem & { sourceMealId?: string }

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCartDialog, setShowCartDialog] = useState(false)
  const [cartLoaded, setCartLoaded] = useState(false)

  // Load cart items from localStorage on component mount
  useEffect(() => {
    setCartItems(readCart())
    setCartLoaded(true)
    const onStorage = (event: StorageEvent) => {
      if (event.key === cartStorageKey()) setCartItems(readCart())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (cartLoaded) writeCart(cartItems)
  }, [cartItems, cartLoaded])

  const addToCart = (item: MealItem, deliveryTime: string) => {
    // Make sure the item has a mealType and deliveryTime
    const itemWithDetails = {
      ...item,
      id: crypto.randomUUID(),
      sourceMealId: item.id,
      mealType: item.mealType || "snacks", // Default to snacks if no meal type
      deliveryTime: deliveryTime,
    }

    setCartItems((previous) => [...previous, itemWithDetails])

    // Show a toast notification
   
    toast.success(`${item.name} has been added to your cart!`, {
      duration: 3000,
      action: {
        label: "View Cart",
        onClick: () => setShowCartDialog(true),
      },
    })
  }

  const removeFromCart = (itemId: string) => {
    setCartItems((previous) => previous.filter((item) => item.id !== itemId))
  }

  return {
    cartItems,
    showCartDialog,
    setShowCartDialog,
    addToCart,
    removeFromCart,
    setCartItems,
  }
}
