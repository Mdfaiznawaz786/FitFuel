/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import API from "@/utils/api"

type NutrientData = {
  name: string
  current: number
  target: number
  color: string
}

// Type for breakdown by delivery time
type TimeBreakdown = {
  [time: string]: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    count: number; // Track number of items per time slot
  }
}

// Type for daily totals
type DailyTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export function useNutritionBreakdown() {
  const [nutritionData, setNutritionData] = useState<NutrientData[]>([])
  const [timeBreakdown, setTimeBreakdown] = useState<TimeBreakdown>({})
  const [totalCalories, setTotalCalories] = useState(0)
  const [caloriesConsumed, setCaloriesConsumed] = useState(0)
  const [dailyTotals, setDailyTotals] = useState<DailyTotals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  })
  const [consumedNutrients, setConsumedNutrients] = useState<DailyTotals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchNutritionBreakdown() {
      try {
        const response = await fetch(API.DIET_NUTRITIONBREAKDOWN, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch nutrition breakdown")
        }
        
        const data = await response.json()
        console.log("Nutrition Breakdown Data:", data)
        
        // Process the data by delivery time for today only
        const breakdown: TimeBreakdown = {}
        const totals = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0
        }
        
        const consumed = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0
        }

        // Get today's date in YYYY-MM-DD format for comparison
        const today = new Date().toISOString().split('T')[0];
        // Get current time once for consistent comparison
        const currentTime = new Date();
        
        // Process each diet entry
        if (Array.isArray(data.data)) {
          data.data.forEach((entry: any) => {
            try {
              // Parse JSON string into array of food items
              const dietItems = typeof entry.diet === 'string' ? 
                JSON.parse(entry.diet) : entry.diet
              
              // Get delivery date from the entry if available
              const deliveryDate = entry.date ? 
                new Date(entry.date).toISOString().split('T')[0] : today;
                
              // Only process items scheduled for today
              if (deliveryDate === today) {
                // Process each food item in the diet
                dietItems.forEach((item :any)=> {
                  const time = item.deliveryTime || "unknown"
                  
                  if (!breakdown[time]) {
                    breakdown[time] = {
                      calories: 0,
                      protein: 0,
                      carbs: 0,
                      fats: 0,
                      count: 0
                    }
                  }
                  
                  // Add the nutritional values
                  const calories = Number(item.calories) || 0
                  const protein = Number(item.protein) || 0
                  const carbs = Number(item.carbs) || 0
                  const fats = Number(item.fats) || 0
                  
                  breakdown[time].calories += calories
                  breakdown[time].protein += protein
                  breakdown[time].carbs += carbs
                  breakdown[time].fats += fats
                  breakdown[time].count++
                  
                  // Add to daily totals
                  totals.calories += calories
                  totals.protein += protein
                  totals.carbs += carbs
                  totals.fats += fats
                  
                  if (time !== "unknown") {
                    // Parse the delivery time (format: "HH:MM")
                    const [hours, minutes] = time.split(':').map(Number);
                    const deliveryTime = new Date();
                    deliveryTime.setHours(hours, minutes, 0, 0);
                    
                    // If the current time is past the delivery time, count as consumed
                    if (currentTime >= deliveryTime) {
                      consumed.calories += calories;
                      consumed.protein += protein;
                      consumed.carbs += carbs;
                      consumed.fats += fats;
                    }
                  }
                })
              }
            } catch (e) {
              console.error("Error processing diet entry:", e)
            }
          })
        }
        
        // Save the results to state
        setTimeBreakdown(breakdown)
        setDailyTotals(totals)
        setTotalCalories(Math.round(totals.calories))
        setCaloriesConsumed(Math.round(consumed.calories))
        setConsumedNutrients(consumed)
        
        // Format data for visualization
        const formattedData: NutrientData[] = [
          {
            name: "Calories",
            current: Math.round(consumed.calories),
            target: Math.round(totals.calories),
            color: "blue"
          },
          {
            name: "Protein",
            current: Math.round(consumed.protein),
            target: Math.round(totals.protein),
            color: "yellow"
          },
          {
            name: "Carbs",
            current: Math.round(consumed.carbs),
            target: Math.round(totals.carbs),
            color: "green"
          },
          {
            name: "Fats",
            current: Math.round(consumed.fats),
            target: Math.round(totals.fats),
            color: "red"
          }
        ]
        
        setNutritionData(formattedData)
      } catch (err) {
        console.error("Error in useNutritionBreakdown:", err)
        setError(err instanceof Error ? err : new Error("An error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchNutritionBreakdown()
  }, [])

  return { 
    nutritionData, 
    timeBreakdown, 
    dailyTotals,
    consumedNutrients,
    isLoading, 
    error,
    totalCalories,
    caloriesConsumed,
  }
}