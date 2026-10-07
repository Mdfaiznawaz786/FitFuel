"use client"

import { useState, useEffect } from "react"
import { useNutritionBreakdown } from "./useNutritionBreakdown"
import { useUpcomingDeliveries } from "./useUpcomingDeliveries"
import { useWeightProgress } from "./useWeightProgress"

type UserStats = {
  currentWeight: number
  weightChange: number
  caloriesConsumed: number
  caloriesDifference: number
  nextDelivery: {
    days: number
    date: string
  }
}

// Default values when no data is available
const defaultStats: UserStats = {
  currentWeight: 0,
  weightChange: 0,
  caloriesConsumed: 0,
  caloriesDifference: 0,
  nextDelivery: {
    days: 0,
    date: "N/A",
  },
}


export function useUserStats() {
  
  const [stats, setStats] = useState<UserStats>(defaultStats)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { 
    totalCalories, 
    caloriesConsumed, 
    isLoading: nutritionLoading, 
    error: nutritionError 
  } = useNutritionBreakdown()
  const {nextDelivery} = useUpcomingDeliveries()
  const {currentWeight, weightChange} = useWeightProgress()
  console.log("Total Calories:", totalCalories)
  console.log("Calories Consumed:", caloriesConsumed)
  useEffect(() => {
    
        setStats({
          currentWeight: currentWeight,
          weightChange: weightChange,
          caloriesConsumed: caloriesConsumed,
          caloriesDifference: totalCalories - caloriesConsumed,
          nextDelivery: {
            days: nextDelivery.days,
            date: nextDelivery.date,
          },
        })
        console.log("User Stats:", stats)
    },[totalCalories, caloriesConsumed, nextDelivery, currentWeight, weightChange])

  return { stats, isLoading, error }
}
