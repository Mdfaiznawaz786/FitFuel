/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { createContext, type ReactNode } from "react"
import { useDietFilters, type FilterState, type DietType, type DietGoal } from "../hooks/use-diet-filters"

interface FilterContextType {
  filters: FilterState
  setStatus: (status: "all" | "active" | "completed") => void
  setSearchQuery: (query: string) => void
  toggleDietType: (type: DietType) => void
  toggleDietGoal: (goal: DietGoal) => void
  filteredPlans: any[]
}

export const FilterContext = createContext<FilterContextType>({
  filters: {
    status: "all",
    searchQuery: "",
    dietTypes: new Set(["all"]),
    dietGoals: new Set(),
  },
  setStatus: () => {},
  setSearchQuery: () => {},
  toggleDietType: () => {},
  toggleDietGoal: () => {},
  filteredPlans: [],
})

interface FilterContextProviderProps {
  children: ReactNode
  initialPlans: any[]
}

export function FilterContextProvider({ children, initialPlans }: FilterContextProviderProps) {
  const filterState = useDietFilters(initialPlans)

  return <FilterContext.Provider value={filterState}>{children}</FilterContext.Provider>
}
