"use client"

import { FilterIcon } from "lucide-react"
import { useContext } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FilterContext } from "../components/filter-context-provider"

export function DietHistoryFilter() {
  const { filters, toggleDietType, toggleDietGoal } = useContext(FilterContext)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-10">
          <FilterIcon className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Diet Types</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={filters.dietTypes.has("all")} onCheckedChange={() => toggleDietType("all")}>
          All
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.dietTypes.has("keto")}
          onCheckedChange={() => toggleDietType("keto")}
        >
          Keto
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.dietTypes.has("low-carb")}
          onCheckedChange={() => toggleDietType("low-carb")}
        >
          Low Carb
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.dietTypes.has("mediterranean")}
          onCheckedChange={() => toggleDietType("mediterranean")}
        >
          Mediterranean
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.dietTypes.has("vegetarian")}
          onCheckedChange={() => toggleDietType("vegetarian")}
        >
          Vegetarian
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.dietTypes.has("vegan")}
          onCheckedChange={() => toggleDietType("vegan")}
        >
          Vegan
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.dietTypes.has("paleo")}
          onCheckedChange={() => toggleDietType("paleo")}
        >
          Paleo
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Goals</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={filters.dietGoals.has("weight-loss")}
          onCheckedChange={() => toggleDietGoal("weight-loss")}
        >
          Weight Loss
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.dietGoals.has("muscle-gain")}
          onCheckedChange={() => toggleDietGoal("muscle-gain")}
        >
          Muscle Gain
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.dietGoals.has("maintenance")}
          onCheckedChange={() => toggleDietGoal("maintenance")}
        >
          Maintenance
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.dietGoals.has("health-improvement")}
          onCheckedChange={() => toggleDietGoal("health-improvement")}
        >
          Health Improvement
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
