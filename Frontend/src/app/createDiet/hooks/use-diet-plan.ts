/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import API from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

export type MealItem = {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType?: string;
  deliveryTime?: string;
};

export type UserProfile = {
  height: string;
  weight: string;
  age?: string;
  gender: string;
  goal: string;
  activityLevel: string;
  diseases: string[];
  otherDisease?: string;
  dietName?: string;
};

export const mealColors = {
  breakfast: {
    bg: "bg-amber-100",
    border: "border-amber-200",
    text: "text-amber-800",
    accent: "bg-amber-500",
  },
  lunch: {
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    text: "text-emerald-800",
    accent: "bg-emerald-500",
  },
  dinner: {
    bg: "bg-indigo-100",
    border: "border-indigo-200",
    text: "text-indigo-800",
    accent: "bg-indigo-500",
  },
  snacks: {
    bg: "bg-rose-100",
    border: "border-rose-200",
    text: "text-rose-800",
    accent: "bg-rose-500",
  },
};

export function useDietPlan(dietId: { dietId: string }) {
  const profileRef = useRef<UserProfile>({
    height: "",
    weight: "",
    gender: "male",
    goal: "lean muscle",
    activityLevel: "none",
    diseases: [],
    otherDisease: "",
  });

  const [dietPlan, setDietPlan] = useState<{ [key: string]: MealItem[] }>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });
  // Add this after the other state variables
  const [hasDietChanged, setHasDietChanged] = useState(false);
  const [originalDietPlan, setOriginalDietPlan] = useState<any>(null);
  const [showDietPlan, setShowDietPlan] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [dietDuration, setDietDuration] = useState(7);
  const [originalDietDuration, setOriginalDietDuration] = useState<number>(7);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [profileVersion, setProfileVersion] = useState(0);
  const [loading, setLoading] = useState(false);

  const [deliveryTimes, setDeliveryTimes] = useState({
    breakfast: "08:00",
    lunch: "12:30",
    dinner: "19:00",
    snacks: "16:00",
  });

  const router = useRouter();
  const updateDeliveryTime = (mealType: string, time: string) => {
    setDeliveryTimes((prev) => ({
      ...prev,
      [mealType]: time,
    }));
  };

  const addMealItem = (mealType: string) => {
    const newItem: MealItem = {
      id: Math.random().toString(36).substring(7),
      name: "",
      quantity: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      mealType: mealType,
    };
    setDietPlan({
      ...dietPlan,
      [mealType]: [...dietPlan[mealType], newItem],
    });
  };

  const removeMealItem = (mealType: string, itemId: string) => {
    setDietPlan({
      ...dietPlan,
      [mealType]: dietPlan[mealType].filter((item) => item.id !== itemId),
    });
  };

  const updateMealItem = (
    mealType: string,
    itemId: string,
    field: keyof MealItem,
    value: any
  ) => {
    setDietPlan({
      ...dietPlan,
      [mealType]: dietPlan[mealType].map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    });
  };

  const calculateTotals = (items: MealItem[]) => {
    return items.reduce(
      (acc, item) => {
        return {
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fats: acc.fats + item.fats,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const calculateDailyTotals = () => {
    const allItems = [
      ...dietPlan.breakfast,
      ...dietPlan.lunch,
      ...dietPlan.dinner,
      ...dietPlan.snacks,
    ];
    return calculateTotals(allItems);
  };

  const generateDietPlan = async (profile: UserProfile) => {
    profileRef.current = profile;
    setProfileVersion((prev) => prev + 1);
    setIsGenerating(true);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => Math.min(prev + 5, 95));
    }, 100);

    try {
      // Prepare API request data
      const apiData = {
        age: parseInt(profile.age || "0", 10),
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        goal: profile.goal,
        activity_level: profile.activityLevel,
        diseases: profile.diseases,
        restrictions: "",
        otherDisease: profile.otherDisease,
      };

      // Make API call
      const response = await fetch(API.GENERATE_DIETPLAN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({}));
        throw new Error(
          typeof errorResponse.message === "string"
            ? errorResponse.message
            : `Diet generation failed (${response.status}). Please try again.`
        );
      }
      const apiResponse = await response.json();

      // Transform API response to our app format
      const dietPlanJson = apiResponse?.data?.data?.diet_plan;
      if (typeof dietPlanJson !== "string") {
        throw new Error("Diet generator returned an unexpected response. Please try again.");
      }
      const transformedDietPlan = transformApiResponse(JSON.parse(dietPlanJson));
      if (Object.values(transformedDietPlan).every((meals) => meals.length === 0)) {
        throw new Error("Diet generator returned no meals. Please try again.");
      }

      // Update app state with the transformed data
      setDietPlan(transformedDietPlan);
      setShowDietPlan(true);
      setGenerationProgress(100);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Diet generation failed. Please try again.";
      toast.error(message);
      setGenerationProgress(0);
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  // Helper function to transform API response to app format
  // Helper function to transform API response to app format
const transformApiResponse = (apiResponse: any) => {
  // Initialize empty meal categories
  const transformedPlan = {
    breakfast: [] as MealItem[],
    lunch: [] as MealItem[],
    dinner: [] as MealItem[],
    snacks: [] as MealItem[],
  };

  // Track meal names we've already added to prevent duplicates
  const addedMealNames: Record<string, Set<string>> = {
    breakfast: new Set(),
    lunch: new Set(),
    dinner: new Set(),
    snacks: new Set(),
  };

  try {
    console.log("Transforming API response:", apiResponse);
    // Extract daily targets for reference (could be used elsewhere in the app)
    const dailyTargets = apiResponse.daily_targets;

    // Process the first day's meal plan (can be expanded to handle multiple days)
    if (apiResponse.meal_plan && apiResponse.meal_plan.length > 0) {
      const day1 = apiResponse.meal_plan[0];
      let globalIdCounter = 0;

      day1.meals.forEach((meal: any) => {
        const mealType = meal.meal_type.toLowerCase();

        // Map API meal types to our app meal types
        let appMealType: keyof typeof transformedPlan = "snacks"; // Default
        if (mealType.includes("breakfast")) appMealType = "breakfast";
        else if (mealType.includes("lunch")) appMealType = "lunch";
        else if (mealType.includes("dinner")) appMealType = "dinner";
        else if (mealType.includes("dessert") || mealType.includes("snack"))
          appMealType = "snacks";

        // Process foods in this meal
        meal.foods.forEach((food: any, index: number) => {
          globalIdCounter++;
          
          // Skip this food if it's already in this meal category
          if (addedMealNames[appMealType].has(food.name.toLowerCase())) {
            console.log(`Skipping duplicate food "${food.name}" in ${appMealType}`);
            return;
          }
          
          // Add to tracking set
          addedMealNames[appMealType].add(food.name.toLowerCase());
          
          const mealItem: MealItem = {
            id: `${appMealType}-${Date.now()}-${globalIdCounter}-${index}`, // Generate unique ID
            name: food.name,
            quantity: food.portion || "1 serving",
            calories: food.calories || 0,
            protein: food.protein || 0,
            carbs: food.carbs || 0,
            fats: food.fats || 0,
            mealType: appMealType,
            deliveryTime:
              deliveryTimes[appMealType as keyof typeof deliveryTimes],
          };

          // Add to the appropriate meal category
          transformedPlan[appMealType].push(mealItem);
        });
      });
    }
    console.log("Transformed diet plan:", transformedPlan);
    return transformedPlan;
  } catch (error) {
    console.error("Error transforming API response:", error);
    // Return default structure if transformation fails
    return transformedPlan;
  }
};

  const createUserSpecification = async (id: string) => {
    const apiData = profileRef.current;

    const response = await fetch(
      `${API.USERSPEC_CREATEUSERSPEC}/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(apiData),
      }
    );

    if (!(response?.ok ?? false)) {
      throw new Error(`Network response was not ok: ${response?.status ?? "unknown"}`);
    }

    const data = await response?.json?.() ?? {};
    console.log("Diet plan saved successfully:", data);
    //createUserSpecification();
  };
  const createdDiet = async(id:string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API.DIET_GETDIETCHARTBYID}/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          }
        }
      );
      if (!(response?.ok ?? false)) {
        throw new Error(`Network response was not ok: ${response?.status ?? "unknown"}`);
      }
      const data = await response?.json?.() ?? {};
      //console.log("Loaded diet data:", data);
      if (!data.data?.[0]) throw new Error("This saved diet plan could not be found.");
      profileRef.current = { ...profileRef.current, dietName: data.data[0].name || "" };
      
      // Properly map the user specifications to the profile format
      if (data.data[0]["User Specifications"] && data.data[0]["User Specifications"].length > 0) {
        const userSpec = data.data[0]["User Specifications"][0];
        //console.log( data.data[0].dietName)
        if (userSpec) {
          const profile: UserProfile = {
            height: userSpec.height || "",
            weight: userSpec.weight || "",
            age: userSpec.age?.toString() || "",
            gender: userSpec.gender || "male",
            goal: userSpec.goal || "lean muscle",
            activityLevel: userSpec.activityLevel || "none",
            diseases: userSpec.diseases || [],
            otherDisease: userSpec.otherDisease || "",
            dietName: data.data[0].name || "",
          };
          
          profileRef.current = profile;
          setOriginalProfile(JSON.parse(JSON.stringify(profile))); // Store deep copy
        }
      }
      
      // Set the diet plan data
      if (data.data[0].diet) {
        const parsedDiet = JSON.parse(data.data[0].diet);
        setDietPlan(parsedDiet);
        // Store original plan for change detection
        setOriginalDietPlan(JSON.parse(JSON.stringify(parsedDiet)));
        setHasDietChanged(false);
      }
      
      setShowDietPlan(true);
      setIsGenerating(false);
      setGenerationProgress(100);
      setDietDuration(data.data[0].days || 7);
      setOriginalDietDuration(data.data[0].days || 7);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load the diet plan.");
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (dietId.dietId)
    {
      createdDiet(dietId.dietId);
    }
  }, [dietId.dietId]);
  const saveDietPlan = async (days: number) => {
    try {
      const apiData = {
        diet: dietPlan,
        days: days,
        name: profileRef.current.dietName,
      };
      setLoading(true);
      const response = await fetch(
        API.DIET_CREATEDIETPLAN,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify(apiData),
        }
      );
      //console.log(response.ok)
      //console.log(await response.json());
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(typeof body.message === "string" ? body.message : `Could not save diet plan (${response.status}).`);
      }

      const data = await response.json();
      const id = data?.data?.[0]?.id;
      if (!id) throw new Error("The server did not return a saved plan ID.");
      try {
        await createUserSpecification(id);
      } catch {
        toast.warning("Diet saved, but your profile details could not be linked. You can still open the saved plan.");
      }
      localStorage.setItem("dietDuration", days.toString());
      toast.success("Diet plan saved");
      router.push(`/createDiet/${data.data[0].id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the diet plan.");
    } finally {
      setLoading(false);
    }
  };

  const updateDietPlan = async () => {
    try {
      setLoading(true);
      const apiData = {
        diet: dietPlan,
        days: dietDuration,
        profile: profileRef.current,
      };
      const response = await fetch(
        `${API.DIET_UPDATEDIETCHARTBYID}/${dietId.dietId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify(apiData),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.statusCode === 404 || !data.data?.length) {
        throw new Error(typeof data.message === "string" ? data.message : "Could not update this diet plan.");
      }

      setOriginalDietPlan(JSON.parse(JSON.stringify(dietPlan)));
      setOriginalDietDuration(dietDuration);
      setOriginalProfile(JSON.parse(JSON.stringify(profileRef.current)));
      setHasDietChanged(false);
      toast.success("Diet plan updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the diet plan.");
    } finally {
      setLoading(false);
    }
  };

  // Add this right after getting the hook values
  const trackChanges = useCallback(() => {
    if (originalDietPlan && dietPlan) {
      const planChanged = JSON.stringify(originalDietPlan) !== JSON.stringify(dietPlan);
      const durationChanged = originalDietDuration !== dietDuration;
      
      // Properly check for profile changes
      let profileChanged = false;
      if (originalProfile && profileRef.current) {
        profileChanged = JSON.stringify(originalProfile) !== JSON.stringify(profileRef.current);
      }
      
      // Update hasDietChanged based on any change
      setHasDietChanged(planChanged || durationChanged || profileChanged);
    }
  }, [dietPlan, originalDietPlan, dietDuration, originalDietDuration, originalProfile]);
  

  // Add useEffect to store the original plan when it's first loaded
  useEffect(() => {
    if (dietPlan && !originalDietPlan) {
      setOriginalDietPlan(JSON.parse(JSON.stringify(dietPlan)));
    }
  }, [dietPlan, originalDietPlan]);

  // Add useEffect to track changes whenever dietPlan or dietDuration changes
  useEffect(() => {
    trackChanges();
  }, [dietPlan, dietDuration, trackChanges, profileVersion]);

  const updateProfileField = (field: keyof UserProfile, value: any) => {
    if (profileRef.current) {
      profileRef.current = {
        ...profileRef.current,
        [field]: value
      };
      setProfileVersion(prev => prev + 1); // Trigger change detection
    }
  };

  return {
    profileRef,
    dietPlan,
    showDietPlan,
    isGenerating,
    generationProgress,
    dietDuration,
    deliveryTimes,
    setDietDuration,
    updateDeliveryTime,
    addMealItem,
    removeMealItem,
    updateMealItem,
    calculateTotals,
    calculateDailyTotals,
    generateDietPlan,
    saveDietPlan,
    updateDietPlan,
    hasDietChanged, // Add this line
    setHasDietChanged, // Add this line
    originalDietPlan, // Add this line
    setOriginalDietPlan, // Add this line
    updateProfileField,
    profileVersion,
    loading,
  };
}
