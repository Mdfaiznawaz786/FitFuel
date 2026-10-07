"use client"

import { useState, useEffect } from "react"
import API from "@/utils/api"

type WeightData = {
  date: string
  weight: number
}

export function useWeightProgress() {
  const [weightData, setWeightData] = useState<WeightData[]>([])
  const [currentWeight, setCurrentWeight] = useState<number>(0)
  const [weightChange, setWeightChange] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchWeightProgress() {
      try {
        const response = await fetch(API.PROFILE_WEIGHTHISTORY, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch weight progress")
        }
        
        const responseData = await response.json()
        console.log("Weight Progress Raw Data:", responseData)
        
        // Process the weight data from the response
        const formattedWeightData: WeightData[] = []
        
        if (Array.isArray(responseData.data)) {
          // Process each item in the array
          responseData.data.forEach((item: { weight?: string }) => {
            if (item.weight) {
              try {
                // Parse the JSON string into an array of weight entries
                const weightEntries = JSON.parse(item.weight)
                
                // Make sure it's an array and add each entry
                if (Array.isArray(weightEntries)) {
                  weightEntries.forEach(entry => {
                    if (entry.date && entry.weight) {
                      formattedWeightData.push({
                        date: entry.date,
                        weight: Number(entry.weight)
                      })
                    }
                  })
                }
              } catch (parseError) {
                console.error("Error parsing weight data:", parseError)
              }
            }
          })
        }
        
        // Sort the weight data by date (oldest to newest)
        formattedWeightData.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        
        console.log("Formatted Weight Data:", formattedWeightData)
        setWeightData(formattedWeightData)
        
        // Calculate current weight and weight change
        if (formattedWeightData.length > 0) {
          // Current weight is the most recent entry
          const mostRecentWeight = formattedWeightData[formattedWeightData.length - 1].weight;
          setCurrentWeight(mostRecentWeight);
          
          // Weight change is the difference between the most recent and the first entry
          if (formattedWeightData.length > 1) {
            const firstWeight = formattedWeightData[0].weight;
            const weightDifference = mostRecentWeight - firstWeight;
            setWeightChange(Number(weightDifference.toFixed(1))); // Round to 1 decimal place
          }
        }
      } catch (err) {
        console.error("Error in useWeightProgress:", err)
        setError(err instanceof Error ? err : new Error("An error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeightProgress()
  }, [])

  return { 
    weightData, 
    currentWeight,
    weightChange,
    isLoading, 
    error 
  }
}