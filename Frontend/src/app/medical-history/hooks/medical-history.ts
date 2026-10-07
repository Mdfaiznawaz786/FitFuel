"use client"

import { useEffect, useState } from "react"
import API from "@/utils/api"
import type { MedicalHistoryData } from "../components/medical-history-client"

export function useMedicalHistory() {
  const [isLoading, setIsLoading] = useState(true)
  const [medicalHistoryData, setMedicalHistoryData] = useState<MedicalHistoryData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(API.PROFILE_GETPROFILE, {
      method: "GET",
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok || !result.success) throw new Error(result.message || "Could not load your profile")
        return result.data as MedicalHistoryData
      })
      .then(setMedicalHistoryData)
      .catch((cause) => { if (cause.name !== "AbortError") setError(cause instanceof Error ? cause.message : "Could not load your profile") })
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false) })
    return () => controller.abort()
  }, [])

  return { isLoading, medicalHistoryData, error }
}
