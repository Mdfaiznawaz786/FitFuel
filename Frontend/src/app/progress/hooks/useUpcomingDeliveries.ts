/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import API from "@/utils/api"

type Delivery = {
  id: string
  name: string
  description: string
  date: string
}

type NextDeliveryInfo = {
  date: string
  days: number
}

export function useUpcomingDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [nextDelivery, setNextDelivery] = useState<NextDeliveryInfo>({
    date: "",
    days: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchUpcomingDeliveries() {
      try {
        const response = await fetch(API.CART_UPCOMINGDELIVERIES, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch upcoming deliveries")
        }
        
        const data = await response.json()
        console.log("Raw delivery data:", data)
        
        const formattedDeliveries = processDeliveries(data.data)
        setDeliveries(formattedDeliveries)
        
        // Calculate next delivery information
        const nextDeliveryInfo = calculateNextDelivery(data.data)
        setNextDelivery(nextDeliveryInfo)
      } catch (err) {
        console.error("Error fetching deliveries:", err)
        setError(err instanceof Error ? err : new Error("An error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchUpcomingDeliveries()
  }, [])

  const calculateNextDelivery = (rawData: any[]): NextDeliveryInfo => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return { date: "No upcoming deliveries", days: 0 }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time for consistent comparison
    
    // Get all start dates that are in the future
    const futureDates = rawData
      .filter(item => new Date(item.startdate) > today)
      .map(item => ({
        date: new Date(item.startdate),
        data: item
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
    
    // If no future dates, check if we're in the middle of any delivery periods
    if (futureDates.length === 0) {
      const currentPeriods = rawData.filter(item => {
        const startDate = new Date(item.startdate)
        const endDate = new Date(item.enddate)
        return today >= startDate && today <= endDate
      })
      
      if (currentPeriods.length > 0) {
        return { 
          date: "Today", 
          days: 0 
        }
      }
      
      return { date: "No upcoming deliveries", days: 0 }
    }
    
    // Get the closest future date
    const nextDate = futureDates[0].date
    
    // Calculate days until next delivery
    const timeDiff = nextDate.getTime() - today.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    
    // Format the date
    const formattedDate = nextDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
    
    return {
      date: formattedDate,
      days: daysDiff
    }
  }

  const processDeliveries = (rawData: any[]): Delivery[] => {
    if (!Array.isArray(rawData)) {
      console.warn("Expected rawData to be an array but received:", typeof rawData)
      return []
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time part for date comparison
    
    return rawData.map((item, index) => {
      // Parse the diet items
      let dietItems: any[] = []
      try {
        dietItems = typeof item.diet === 'string' ? JSON.parse(item.diet) : item.diet
      } catch (err) {
        console.error("Error parsing diet JSON:", err)
      }
      
      // Parse dates
      const startDate = new Date(item.startdate)
      const endDate = new Date(item.enddate)
      
      // Determine the display date
      let displayDate: Date
      if (today >= startDate && today <= endDate) {
        // If today is between start and end date, use today
        displayDate = today
      } else {
        // Otherwise use the start date
        displayDate = startDate
      }
      
      // Count items by meal type
      const mealCounts: Record<string, number> = {}
      dietItems.forEach(foodItem => {
        const mealType = foodItem.mealType || 'other'
        mealCounts[mealType] = (mealCounts[mealType] || 0) + 1
      })
      
      // Create description based on meal counts
      const mealDescriptions = []
      if (mealCounts.breakfast) {
        mealDescriptions.push(`${mealCounts.breakfast} breakfast item${mealCounts.breakfast !== 1 ? 's' : ''}`)
      }
      if (mealCounts.lunch) {
        mealDescriptions.push(`${mealCounts.lunch} lunch item${mealCounts.lunch !== 1 ? 's' : ''}`)
      }
      if (mealCounts.dinner) {
        mealDescriptions.push(`${mealCounts.dinner} dinner item${mealCounts.dinner !== 1 ? 's' : ''}`)
      }
      if (mealCounts.snacks) {
        mealDescriptions.push(`${mealCounts.snacks} snack${mealCounts.snacks !== 1 ? 's' : ''}`)
      }
      
      // Format the date
      const formattedDate = displayDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
      
      // Generate a name if not provided
      const deliveryName = item.name || 
        `Meal Plan ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      
      return {
        id: `delivery-${index}-${Date.now()}`, // Generate a unique ID
        name: deliveryName,
        description: mealDescriptions.join(', '),
        date: formattedDate
      }
    })
  }

  return { 
    deliveries, 
    nextDelivery, // Include the next delivery information
    isLoading, 
    error 
  }
}