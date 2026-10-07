/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import API from "@/utils/api"

const profileFormSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  dateOfBirth: z.date({ required_error: "Please select a date of birth." }),
  gender: z.string({ required_error: "Please select a gender." }),

  // Vitals
  height: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid height in cm.",
  }),
  weight: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid weight in kg.",
  }),
  bloodPressure: z.string().optional(),
  heartRate: z
    .string()
    .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Please enter a valid heart rate.",
    })
    .optional(),
  bloodSugar: z
    .string()
    .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Please enter a valid blood sugar level.",
    })
    .optional(),

  // Additional Information
  allergies: z.string().optional(),
  dietaryPreferences: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Default values with null instead of undefined for date fields
const defaultValues: Partial<ProfileFormValues> = {
  fullName: "",
  email: "",
  dateOfBirth: undefined,
  gender: "",
  height: "",
  weight: "",
  bloodPressure: "",
  heartRate: "",
  bloodSugar: "",
  allergies: "",
  dietaryPreferences: "",
}

// Helper function to safely parse dates
const safelyParseDate = (dateString: any): Date | undefined => {
  if (!dateString) return undefined;

  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  } catch (e) {
    console.error("Error parsing date:", e);
    return undefined;
  }
}

const listAsText = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string").join(", ");
  }
  return typeof value === "string" ? value : "";
}

export default function ProfileForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);

  // State for medical conditions
  const [conditions, setConditions] = useState<Array<{
    name: string;
    diagnosed: Date | null;
    severity: string
  }>>([])

  // State for medications
  const [medications, setMedications] = useState<Array<{
    name: string;
    dosage: string;
    frequency: string
  }>>([])

  // State for dietary restrictions


  // Initialize form with resolver and defaults
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  // Fetch user profile data
  useEffect(() => {
    setLoading(true);
    const token = sessionStorage.getItem("token");

    if (!token) {
      setLoading(false);
      toast.error("Authentication required");
      return;
    }

    fetch(API.PROFILE_GETPROFILE, {
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
      .then((responseData) => {
        if (responseData.success === false) {
          throw new Error(responseData.message || "Failed to load profile data");
        }
        // Handle different API response structures
        const data = responseData.data || responseData;

        if (data) {
          // Process arrays with safe defaults
          const processedConditions = Array.isArray(data.conditions)
            ? data.conditions.map((c: { name: string; diagnosed: string | null; severity: string }) => ({
              ...c,
              diagnosed: safelyParseDate(c.diagnosed)
            }))
            : [];

          const processedMedications = Array.isArray(data.medications)
            ? data.medications
            : [];
          // Set form data with safe values
          form.reset({
            fullName: data.user?.name || "",
            email: data.user?.email || "",
            dateOfBirth: safelyParseDate(data.dateOfBirth),
            gender: data.user?.gender || "",
            height: data.vitals?.height?.toString() || "",
            weight: data.vitals?.weight?.toString() || "",
            bloodPressure: data.vitals?.bloodPressure || "",
            heartRate: data.vitals?.heartRate?.toString() || "",
            bloodSugar: data.vitals?.bloodSugar?.toString() || "",
            allergies: listAsText(data.allergies),
            dietaryPreferences: listAsText(data.dietaryPreferences),
          });

          // Update state
          setConditions(processedConditions);
          setMedications(processedMedications);

          // Handle dietary restrictions as array
          setDietaryRestrictions(
            Array.isArray(data.dietaryRestrictions) ? data.dietaryRestrictions : []
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [form]);

  // Handle form submission
  function onSubmit(data: ProfileFormValues) {
    const token = sessionStorage.getItem("token");

    if (!token) {
      toast.error("Authentication required");
      return;
    }

    // Prepare payload
    const payload = {
      ...data,
      conditions,
      medications,
      dietaryRestrictions,
    };

    fetch(API.PROFILE_UPDATEPROFILE, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        if (result.success === false) {
          throw new Error(result.message || "Failed to save profile");
        }
        toast.success("Profile saved successfully!", {
          duration: 3000,
          action: {
            label: "View Medical History",
            onClick: () => router.push("/medical-history"),
          },
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error("Failed to save profile");
      });
  }

  // Add a new condition
  function addCondition() {
    setConditions([
      ...conditions,
      {
        name: "",
        diagnosed: null,
        severity: "Mild",
      },
    ]);
  }

  // Remove a condition
  function removeCondition(index: number) {
    setConditions(conditions.filter((_, i) => i !== index));
  }

  // Update a condition field
  function updateCondition(index: number, field: string, value: any) {
    const updatedConditions = [...conditions];
    updatedConditions[index] = {
      ...updatedConditions[index],
      [field]: value,
    };
    setConditions(updatedConditions);
  }

  // Add a new medication
  function addMedication() {
    setMedications([
      ...medications,
      {
        name: "",
        dosage: "",
        frequency: "Once daily",
      },
    ]);
  }

  // Remove a medication
  function removeMedication(index: number) {
    setMedications(medications.filter((_, i) => i !== index));
  }

  // Update a medication field
  function updateMedication(index: number, field: string, value: any) {
    const updatedMedications = [...medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };
    setMedications(updatedMedications);
  }

  // Show loading state
  if (loading) {
    return (
      <Card className="py-10">
        <CardContent className="flex justify-center items-center">
          <div className="text-center">
            <div className="animate-pulse h-4 w-24 bg-muted rounded mb-4 mx-auto"></div>
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...form.register("fullName")} placeholder="Enter your full name" />
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register("email")} placeholder="Enter your email" />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.watch("dateOfBirth") && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("dateOfBirth") &&
                          form.watch("dateOfBirth") instanceof Date &&
                          !isNaN(form.watch("dateOfBirth").getTime()) ? (
                          format(form.watch("dateOfBirth"), "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={form.watch("dateOfBirth") instanceof Date &&
                          !isNaN(form.watch("dateOfBirth").getTime())
                          ? form.watch("dateOfBirth")
                          : undefined}
                        onSelect={(date) => {
                          if (date) {
                            form.setValue("dateOfBirth", date, {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }
                        }}
                        initialFocus
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.dateOfBirth && (
                    <p className="text-sm text-red-500">{form.formState.errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={form.watch("gender") || ""}
                    onValueChange={(value) => form.setValue("gender", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.gender && (
                    <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Vitals */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Vitals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" {...form.register("height")} placeholder="Enter your height in cm" />
                  {form.formState.errors.height && (
                    <p className="text-sm text-red-500">{form.formState.errors.height.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" {...form.register("weight")} placeholder="Enter your weight in kg" />
                  {form.formState.errors.weight && (
                    <p className="text-sm text-red-500">{form.formState.errors.weight.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodPressure">Blood Pressure (optional)</Label>
                  <Input id="bloodPressure" {...form.register("bloodPressure")} placeholder="e.g., 120/80" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (bpm, optional)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    {...form.register("heartRate")}
                    placeholder="Enter your heart rate"
                  />
                  {form.formState.errors.heartRate && (
                    <p className="text-sm text-red-500">{form.formState.errors.heartRate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodSugar">Blood Sugar (mg/dL, optional)</Label>
                  <Input
                    id="bloodSugar"
                    type="number"
                    {...form.register("bloodSugar")}
                    placeholder="Enter your blood sugar level"
                  />
                  {form.formState.errors.bloodSugar && (
                    <p className="text-sm text-red-500">{form.formState.errors.bloodSugar.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Medical Conditions */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Medical Conditions</h2>
                <Button type="button" variant="outline" size="sm" onClick={addCondition}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </Button>
              </div>

              {conditions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No medical conditions added yet.</p>
              ) : (
                <div className="space-y-4">
                  {conditions.map((condition, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => removeCondition(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="space-y-2">
                        <Label>Condition Name</Label>
                        <Input
                          value={condition.name || ""}
                          onChange={(e) => updateCondition(index, "name", e.target.value)}
                          placeholder="e.g., Diabetes, Hypertension"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Diagnosed Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !condition.diagnosed && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {condition.diagnosed instanceof Date && !isNaN(condition.diagnosed.getTime())
                                ? format(condition.diagnosed, "PPP")
                                : <span>Select date</span>
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={condition.diagnosed instanceof Date && !isNaN(condition.diagnosed.getTime())
                                ? condition.diagnosed
                                : undefined}
                              onSelect={(date) => updateCondition(index, "diagnosed", date)}
                              initialFocus
                              disabled={(date) => date > new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Severity</Label>
                        <Select
                          value={condition.severity || "Mild"}
                          onValueChange={(value) => updateCondition(index, "severity", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mild">Mild</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Medications */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Medications</h2>
                <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </div>

              {medications.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No medications added yet.</p>
              ) : (
                <div className="space-y-4">
                  {medications.map((medication, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => removeMedication(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="space-y-2">
                        <Label>Medication Name</Label>
                        <Input
                          value={medication.name || ""}
                          onChange={(e) => updateMedication(index, "name", e.target.value)}
                          placeholder="e.g., Metformin, Lisinopril"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Dosage</Label>
                        <Input
                          value={medication.dosage || ""}
                          onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                          placeholder="e.g., 500mg, 10mg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select
                          value={medication.frequency || "Once daily"}
                          onValueChange={(value) => updateMedication(index, "frequency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Once daily">Once daily</SelectItem>
                            <SelectItem value="Twice daily">Twice daily</SelectItem>
                            <SelectItem value="Three times daily">Three times daily</SelectItem>
                            <SelectItem value="Four times daily">Four times daily</SelectItem>
                            <SelectItem value="As needed">As needed</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Dietary Restrictions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Dietary Restrictions</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[
                  "Low Sodium",
                  "Gluten Free",
                  "Dairy Free",
                  "No Added Sugar",
                  "Vegetarian",
                  "Vegan",
                  "Non Vegetarian"
                ].map((restriction) => (
                  <div key={restriction} className="flex items-center space-x-2">
                    <Checkbox
                      id={restriction.toLowerCase().replace(/\s+/g, '-')}
                      checked={dietaryRestrictions.includes(restriction)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setDietaryRestrictions([...dietaryRestrictions, restriction]);
                        } else {
                          setDietaryRestrictions(
                            dietaryRestrictions.filter((r) => r !== restriction)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={restriction.toLowerCase().replace(/\s+/g, '-')}>{restriction}</Label>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherDietaryRestrictions">Other Dietary Restrictions</Label>
                <Input
                  id="otherDietaryRestrictions"
                  placeholder="Enter any other dietary restrictions (comma separated)"
                  value={dietaryRestrictions
                    .filter((r) => !["Low Sodium", "Gluten Free", "Dairy Free", "No Added Sugar", "Vegetarian", "Vegan", "Non Vegetarian"].includes(r))
                    .join(", ")}
                  onChange={(e) => {
                    // Keep the standard restrictions
                    const standardRestrictions = dietaryRestrictions.filter(r =>
                      ["Low Sodium", "Gluten Free", "Dairy Free", "No Added Sugar", "Vegetarian", "Vegan", "Non Vegetarian"].includes(r)
                    );

                    // Add custom restrictions from input
                    const customRestrictions = e.target.value
                      .split(",")
                      .map(item => item.trim())
                      .filter(item => item.length > 0);

                    setDietaryRestrictions([...standardRestrictions, ...customRestrictions]);
                  }}
                />
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies (optional)</Label>
                  <Textarea
                    id="allergies"
                    {...form.register("allergies")}
                    placeholder="List any allergies you have"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietaryPreferences">Dietary Preferences (optional)</Label>
                  <Textarea
                    id="dietaryPreferences"
                    {...form.register("dietaryPreferences")}
                    placeholder="Describe your dietary preferences"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Save Profile
        </Button>
      </div>
    </form>
  )
}
