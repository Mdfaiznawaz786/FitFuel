/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import type { UserProfile } from "../hooks/use-diet-plan"
import { useEffect } from "react"

const formSchema = z.object({
  dietName: z.string().min(1, { message: "Diet name is required" }),
  height: z.string().min(1, { message: "Height is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  age: z.string().min(1, { message: "Age is required" }),
  goal: z.enum(["weight loss", "weight gain", "lean muscle", "maintenance"]),
  gender: z.enum(["male", "female", "other"]),
  activityLevel: z.enum(["none", "light", "moderate", "high", "very high"]),
  diseases: z.array(z.string()).optional(),
  otherDisease: z.string().optional(),
})

const diseases = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension" },
  { id: "heart-disease", label: "Heart Disease" },
  { id: "kidney-disease", label: "Kidney Disease" },
  { id: "celiac", label: "Celiac Disease" },
  { id: "lactose", label: "Lactose Intolerance" },
]

interface ProfileFormProps {
  onSubmit: (values: UserProfile) => void
  isGenerating: boolean
  generationProgress: number
  initialProfile?: UserProfile
  updateProfileField?: (field: keyof UserProfile, value: any) => void
}

export function ProfileForm({ onSubmit, isGenerating, generationProgress, initialProfile, updateProfileField }: ProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: initialProfile?.height || "",
      weight: initialProfile?.weight || "",
      age: initialProfile?.age || "",
      goal: (initialProfile?.goal as "weight loss" | "weight gain" | "lean muscle" | "maintenance") || "lean muscle",
      gender: (initialProfile?.gender as "male" | "female" | "other") || "male",
      activityLevel: (initialProfile?.activityLevel as "none" | "light" | "moderate" | "high" | "very high") || "none",
      diseases: initialProfile?.diseases || [],
      otherDisease: initialProfile?.otherDisease || "",
      dietName: initialProfile?.dietName || "",
    },
  })
  useEffect(() => {
    if (initialProfile) {
      console.log("Setting form values from initialProfile:", initialProfile);
      form.reset({
        height: initialProfile.height || "",
        weight: initialProfile.weight || "",
        age: initialProfile.age || "",
        goal: initialProfile.goal as any || "lean muscle",
        gender: initialProfile.gender as any || "male",
        activityLevel: initialProfile.activityLevel as any || "none",
        diseases: initialProfile.diseases || [],
        otherDisease: initialProfile.otherDisease || "",
        dietName: initialProfile.dietName || "",
      });
    }
  }, [initialProfile, form]);

  const handleFieldChange = (field: keyof UserProfile, value: any) => {
    if (updateProfileField) {
      updateProfileField(field, value);
    }
  };

  console.log("Initial Profile:", initialProfile)
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      height: values.height,
      weight: values.weight,
      age: values.age,
      gender: values.gender,
      goal: values.goal,
      activityLevel: values.activityLevel,
      diseases: values.diseases || [],
      otherDisease: values.otherDisease || "",
      dietName: values.dietName,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FormField
  control={form.control}
  name="dietName"
  render={({ field }) => (
    <FormItem className="col-span-1 md:col-span-3">
      <FormLabel className="text-lg">Diet Plan Name</FormLabel>
      <FormControl>
        <Input 
          placeholder="e.g. My Summer Diet Plan" 
          {...field} 
          className="h-14 text-lg" 
          onChange={(e) => {
            field.onChange(e);
            handleFieldChange('dietName', e.target.value);
          }}
        />
      </FormControl>
      <FormDescription className="text-base">
        Give your diet plan a meaningful name to easily identify it later
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Height</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 5.10 ft or 178 cm" {...field} className="h-14 text-lg" onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('height', e.target.value);
                  }}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Weight</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 75 kg or 165 lbs" {...field} className="h-14 text-lg" onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('weight', e.target.value);
                  }}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Age</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 25" {...field} className="h-14 text-lg" type="number" min="1" max="120" onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('age', e.target.value);
                  }}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Gender</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFieldChange('gender', value);
                  }} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-14 text-lg w-full sm:w-64 truncate">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male" className="text-lg">
                      Male
                    </SelectItem>
                    <SelectItem value="female" className="text-lg">
                      Female
                    </SelectItem>
                    <SelectItem value="other" className="text-lg">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Goal</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFieldChange('goal', value);
                  }} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-14 text-lg w-full sm:w-64 truncate">
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weight loss" className="text-lg">
                      Weight Loss
                    </SelectItem>
                    <SelectItem value="weight gain" className="text-lg">
                      Weight Gain
                    </SelectItem>
                    <SelectItem value="lean muscle" className="text-lg">
                      Lean Muscle
                    </SelectItem>
                    <SelectItem value="maintenance" className="text-lg">
                      Maintenance
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="activityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Activity Level</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFieldChange('activityLevel', value);
                  }} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-14 text-lg w-full sm:w-64 truncate">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none" className="text-lg">
                      None
                    </SelectItem>
                    <SelectItem value="light" className="text-lg">
                      Light (1-2 days/week)
                    </SelectItem>
                    <SelectItem value="moderate" className="text-lg">
                      Moderate (3-4 days/week)
                    </SelectItem>
                    <SelectItem value="high" className="text-lg">
                      High (5-6 days/week)
                    </SelectItem>
                    <SelectItem value="very high" className="text-lg">
                      Very High (7+ days/week)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="diseases"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-lg">Health Conditions</FormLabel>
                <FormDescription className="text-base">
                  Select any health conditions that may affect your diet
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {diseases.map((disease) => (
                  <FormField
                    key={disease.id}
                    control={form.control}
                    name="diseases"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={disease.id}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-gray-50"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(disease.id)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...(field.value || []), disease.id]
                                  : field.value?.filter((value) => value !== disease.id);
                                field.onChange(updatedValue);
                                handleFieldChange('diseases', updatedValue);
                              }}
                              className="h-6 w-6"
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-lg">{disease.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>

              {/* Add Other Health Condition field */}
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="otherDisease"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Other Health Condition</FormLabel>
                      <FormControl>
                        <Input placeholder="Specify any other health condition" {...field} className="h-14 text-lg" onChange={(e) => {
                          field.onChange(e);
                          handleFieldChange('otherDisease', e.target.value);
                        }}/>
                      </FormControl>
                      <FormDescription className="text-base">
                        If you have any other health condition not listed above, please specify it here
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-16 text-xl font-semibold bg-purple-600 hover:bg-purple-500 text-white"
          disabled={isGenerating}
        >
          {isGenerating ? "Generating Diet Plan..." : "Generate Diet Plan"}
        </Button>

        {isGenerating && (
          <div className="space-y-2">
            <Progress value={generationProgress} className="h-2" />
            <p className="text-center text-sm text-gray-500">
              Analyzing your profile and creating a personalized diet plan...
            </p>
          </div>
        )}
      </form>
    </Form>
  )
}