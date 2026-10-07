/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import type { MealItem } from "../hooks/use-diet-plan"

interface CartDialogProps {
  cartItems: MealItem[]
  showCartDialog: boolean
  setShowCartDialog: (show: boolean) => void
  removeFromCart: (itemId: string) => void
  proceedToCheckout: () => void
}

export function CartDialog({
  cartItems,
  showCartDialog,
  setShowCartDialog,
  removeFromCart,
  proceedToCheckout,
}: CartDialogProps) {
  return (
    <Dialog open={showCartDialog} onOpenChange={setShowCartDialog}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-lg"
          onClick={() => setShowCartDialog(true)}
        >
          <ShoppingCart className="h-7 w-7" />
          {cartItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 h-7 w-7 flex items-center justify-center text-lg font-bold">
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Shopping Cart</DialogTitle>
          <DialogDescription className="text-lg">Review your list, then search for items at a store</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-lg">Your cart is empty</div>
          ) : (
            <>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium text-lg">{item.name}</p>
                        <p className="text-gray-500">{item.quantity}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-400 capitalize">{item.mealType}</p>
                          <p className="text-sm text-gray-400">• {item.deliveryTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="h-10 w-10 rounded-full"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <p className="border-t pt-4 text-sm text-muted-foreground">Store prices and availability appear on the retailer website.</p>
            </>
          )}
          
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline" className="text-lg h-12">
              Continue Shopping
            </Button>
          </DialogClose>
          <Button
            className="bg-purple-600 hover:bg-purple-500 text-white text-lg h-12"
            disabled={cartItems.length === 0}
            onClick={proceedToCheckout}
          >
            Find items at a store
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
