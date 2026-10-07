"use client"

import { useState, useEffect } from "react"

type Recommendation = {
  id: string
  title: string
  description: string
  icon: string
  actionText: string
  actionUrl: string
}

// Default recommendations
const defaultRecommendations: Recommendation[] = [
  {
    id: "default-1",
    title: "Start your journey",
    description: "Set up your profile to get personalized recommendations.",
    icon: "utensils",
    actionText: "Set up profile",
    actionUrl: "/profile",
  },
]

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(defaultRecommendations)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // useEffect(() => {
  //   async function fetchRecommendations() {
  //     try {
  //       // In a real app, replace this with an actual API call
  //      // const response = await fetch("/api/recommendations")
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch recommendations")
  //       }
  //       const data = await response.json()
  //       setRecommendations(data)
  //     } catch (err) {
  //       setError(err instanceof Error ? err : new Error("An error occurred"))
  //       // Keep using default recommendations on error
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchRecommendations()
  // }, [])

  return { recommendations, isLoading, error }
}
