/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import API from "@/utils/api"

export type DietPlan = {
  id: string
  title: string
  date: string
  status: string
  duration: string
  calories: number
  protein: number
  carbs: number
  fat: number
  tags: string[]
}

export type FilterStatus = "all" | "active" | "completed"
export type DietType = "all" | "keto" | "low-carb" | "mediterranean" | "vegetarian" | "vegan" | "paleo"
export type DietGoal = "weight-loss" | "muscle-gain" | "maintenance" | "health-improvement"

export interface FilterState {
  status: FilterStatus
  searchQuery: string
  dietTypes: Set<DietType>
  dietGoals: Set<DietGoal>
}

export function useDietFilters(initialPlans: DietPlan[] = []) {
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    searchQuery: "",
    dietTypes: new Set(["all"]),
    dietGoals: new Set(),
  })
  const [dietData, setDietData] = useState<DietPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const setStatus = (status: FilterStatus) => {
    setFilters((prev) => ({ ...prev, status }))
  }

  const setSearchQuery = (searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }))
  }

  const toggleDietType = (dietType: DietType) => {
    setFilters((prev) => {
      const newDietTypes = new Set(prev.dietTypes)

      if (dietType === "all") {
        // If "all" is selected, clear other selections
        return { ...prev, dietTypes: new Set(["all"]) }
      } else {
        // If a specific type is selected, remove "all"
        newDietTypes.delete("all")

        if (newDietTypes.has(dietType)) {
          newDietTypes.delete(dietType)
          // If no specific types are selected, add "all" back
          if (newDietTypes.size === 0) {
            newDietTypes.add("all")
          }
        } else {
          newDietTypes.add(dietType)
        }

        return { ...prev, dietTypes: newDietTypes }
      }
    })
  }

  const toggleDietGoal = (goal: DietGoal) => {
    setFilters((prev) => {
      const newDietGoals = new Set(prev.dietGoals)

      if (newDietGoals.has(goal)) {
        newDietGoals.delete(goal)
      } else {
        newDietGoals.add(goal)
      }

      return { ...prev, dietGoals: newDietGoals }
    })
  }

  // Process API response into DietPlan format
 // Process API response into DietPlan format
const processDietData = (apiData: any[]): DietPlan[] => {
    return apiData.map((item, index) => {
      // Parse the diet JSON string
      let dietObject;
      try {
        dietObject = typeof item.diet === 'string' ? JSON.parse(item.diet) : item.diet;
      } catch (err) {
        console.error("Error parsing diet JSON:", err);
        dietObject = { breakfast: [], lunch: [], dinner: [], snacks: [] };
      }
  
      // Calculate nutrition totals
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
  
      // Process all meal types
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
        if (Array.isArray(dietObject[mealType])) {
          dietObject[mealType].forEach(food => {
            totalCalories += Number(food.calories) || 0;
            totalProtein += Number(food.protein) || 0;
            totalCarbs += Number(food.carbs) || 0;
            totalFat += Number(food.fats) || 0;
          });
        }
      });
  
      // Extract tags (convert string to array if needed)
      const tagsList = item.tags ? 
        (typeof item.tags === 'string' ? item.tags.split(/,\s*/) : item.tags) : 
        [];
  
      // Format date
      const formattedDate = item.date ? 
        new Date(item.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 
        '';
  
      // Generate a truly unique ID by adding both an index and a random string
      const uniqueId = `${item.id || 'diet'}-${index}-${Math.random().toString(36).substring(2, 10)}`;
  
      return {
        id: uniqueId,
        dietid:item.id,
        title: item.title || `Diet Plan (${formattedDate})`,
        date: formattedDate,
        status: (item.status == "Processing")?"active":"completed",
        duration: item.duration ? `${item.duration} days` : "7 days",
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fat: Math.round(totalFat),
        tags: tagsList,
      };
    });
  };

  // Fetch diet history data from API
  useEffect(() => {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    fetch(API.DIET_DIETHISTORY, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        const processedData = processDietData(Array.isArray(data) ? data : (data.data || []));
        console.log("Processed Diet Data:", processedData);

        setDietData(processedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching diet plans:", error);
        setError(error.message || "Failed to load diet history");
        setLoading(false);
      });
  }, []);

  // Use dietData instead of initialPlans for filtering
  const plansToFilter = dietData.length > 0 ? dietData : initialPlans;

  const filteredPlans = plansToFilter.filter((plan) => {
    // Filter by status
    if (filters.status !== "all" && plan.status !== filters.status) {
      return false
    }

    // Filter by search query
    if (
      filters.searchQuery &&
      !plan.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !plan.tags.some((tag) => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    ) {
      return false
    }

    // Filter by diet type
    if (!filters.dietTypes.has("all")) {
      const planDietTypes = plan.tags.filter((tag) =>
        ["keto", "low-carb", "mediterranean", "vegetarian", "vegan", "paleo"].includes(tag.toLowerCase()),
      )

      if (planDietTypes.length === 0 || !planDietTypes.some((type) => filters.dietTypes.has(type.toLowerCase() as DietType))) {
        return false
      }
    }

    // Filter by diet goal
    if (filters.dietGoals.size > 0) {
      const planGoals = plan.tags.filter((tag) =>
        ["weight loss", "muscle gain", "maintenance", "health improvement", "weight-loss", "muscle-gain", "health-improvement"].includes(tag.toLowerCase()),
      )

      const normalizedPlanGoals = planGoals.map((goal) => {
        const lowerGoal = goal.toLowerCase();
        if (lowerGoal === "weight loss") return "weight-loss"
        if (lowerGoal === "muscle gain") return "muscle-gain"
        if (lowerGoal === "health improvement") return "health-improvement"
        return lowerGoal
      })

      if (planGoals.length === 0 || !normalizedPlanGoals.some((goal) => filters.dietGoals.has(goal as DietGoal))) {
        return false
      }
    }

    return true
  })

  return {
    filters,
    setStatus,
    setSearchQuery,
    toggleDietType,
    toggleDietGoal,
    filteredPlans,
    loading,
    error,
    dietData
  }
}