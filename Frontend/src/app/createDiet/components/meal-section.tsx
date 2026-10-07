/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Plus, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type MealItem, mealColors } from "../hooks/use-diet-plan"

interface MealSectionProps {
  mealType: string
  items: MealItem[]
  deliveryTime: string
  onUpdateDeliveryTime: (time: string) => void
  onAddItem: () => void
  onRemoveItem: (itemId: string) => void
  onUpdateItem: (itemId: string, field: keyof MealItem, value: any) => void
  onAddToCart: (item: MealItem) => void
  calculateTotals: (items: MealItem[]) => { calories: number; protein: number; carbs: number; fats: number }
  cartCounts: Record<string, number>
}

export function MealSection({
  mealType,
  items,
  deliveryTime,
  onUpdateDeliveryTime,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onAddToCart,
  calculateTotals,
  cartCounts={},
}: MealSectionProps) {
  return (
    <div className="space-y-4">
      <div
        className={`p-4 rounded-lg border-2 ${mealColors[mealType as keyof typeof mealColors].bg} ${mealColors[mealType as keyof typeof mealColors].border} ${mealColors[mealType as keyof typeof mealColors].text}`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-full ${mealColors[mealType as keyof typeof mealColors].accent} flex items-center justify-center`}
            >
              <span className="text-white font-bold">{mealType.charAt(0).toUpperCase()}</span>
            </div>
            <h3 className="text-xl font-bold capitalize">{mealType}</h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Delivery Time:</span>
              <Select value={deliveryTime} onValueChange={onUpdateDeliveryTime}>
                <SelectTrigger className="w-28 h-9">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {mealType === "breakfast" && (
                    <>
                      <SelectItem value="07:00">7:00 AM</SelectItem>
                      <SelectItem value="07:30">7:30 AM</SelectItem>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="08:30">8:30 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                    </>
                  )}
                  {mealType === "lunch" && (
                    <>
                      <SelectItem value="11:30">11:30 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="12:30">12:30 PM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="13:30">1:30 PM</SelectItem>
                    </>
                  )}
                  {mealType === "dinner" && (
                    <>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                      <SelectItem value="18:30">6:30 PM</SelectItem>
                      <SelectItem value="19:00">7:00 PM</SelectItem>
                      <SelectItem value="19:30">7:30 PM</SelectItem>
                      <SelectItem value="20:00">8:00 PM</SelectItem>
                    </>
                  )}
                  {mealType === "snacks" && (
                    <>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="15:30">3:30 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="16:30">4:30 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={onAddItem}
              className={`flex items-center gap-2 border-2 h-9 ${mealColors[mealType as keyof typeof mealColors].bg} ${mealColors[mealType as keyof typeof mealColors].border} ${mealColors[mealType as keyof typeof mealColors].text} border-current`}
            >
              <Plus className="h-5 w-5" />
              Add Item
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-lg border-2 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px] text-base md:text-lg">Food Item</TableHead>
              <TableHead className="text-base md:text-lg">Quantity</TableHead>
              <TableHead className="text-right text-base md:text-lg">Calories</TableHead>
              <TableHead className="text-right text-base md:text-lg">Protein (g)</TableHead>
              <TableHead className="text-right text-base md:text-lg">Carbs (g)</TableHead>
              <TableHead className="text-right text-base md:text-lg">Fats (g)</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input
                    value={item.name}
                    onChange={(e) => onUpdateItem(item.id, "name", e.target.value)}
                    className="border-0 p-0 h-10 text-base md:text-lg focus-visible:ring-0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(item.id, "quantity", e.target.value)}
                    className="border-0 p-0 h-10 text-base md:text-lg focus-visible:ring-0 w-28"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={item.calories}
                    onChange={(e) => onUpdateItem(item.id, "calories", Number.parseInt(e.target.value) || 0)}
                    className="border-0 p-0 h-10 text-base md:text-lg focus-visible:ring-0 w-20 text-right ml-auto"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={item.protein}
                    onChange={(e) => onUpdateItem(item.id, "protein", Number.parseInt(e.target.value) || 0)}
                    className="border-0 p-0 h-10 text-base md:text-lg focus-visible:ring-0 w-20 text-right ml-auto"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={item.carbs}
                    onChange={(e) => onUpdateItem(item.id, "carbs", Number.parseInt(e.target.value) || 0)}
                    className="border-0 p-0 h-10 text-base md:text-lg focus-visible:ring-0 w-20 text-right ml-auto"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={item.fats}
                    onChange={(e) => onUpdateItem(item.id, "fats", Number.parseInt(e.target.value) || 0)}
                    className="border-0 p-0 h-10 text-base md:text-lg focus-visible:ring-0 w-20 text-right ml-auto"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onAddToCart(item)}
                      className="h-10 w-10 rounded-full relative"
                      title="Add to cart"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {cartCounts[item.id] && cartCounts[item.id] > 0 && (
                        <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {cartCounts[item.id]}
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-10 w-10 rounded-full"
                      title="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length > 0 && (
              <TableRow className={`${mealColors[mealType as keyof typeof mealColors].bg}`}>
                <TableCell colSpan={2} className="font-bold text-base md:text-lg">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold text-base md:text-lg">{calculateTotals(items).calories}</TableCell>
                <TableCell className="text-right font-bold text-base md:text-lg">{calculateTotals(items).protein}g</TableCell>
                <TableCell className="text-right font-bold text-base md:text-lg">{calculateTotals(items).carbs}g</TableCell>
                <TableCell className="text-right font-bold text-base md:text-lg">{calculateTotals(items).fats}g</TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500 text-base md:text-lg">
                  No items added. Click &quot;Add Item&quot; to add food to this meal.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}