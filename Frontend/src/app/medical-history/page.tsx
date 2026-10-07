'use client'
import { MedicalHistoryClient } from "./components/medical-history-client"
import { useMedicalHistory } from "./hooks/medical-history"
import Loading from "./components/loading"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// This is a Server Component
export default function MedicalHistoryPage() {
  const { isLoading, medicalHistoryData, error } = useMedicalHistory()
 if(isLoading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight">Medical History</h1><p className="mt-2 text-muted-foreground">A summary of the health information you entered in your profile. This is not a clinician&apos;s medical record. Conditions entered only while generating a diet are kept with that diet plan; add them to your profile to see them here.</p></div><Button asChild variant="outline"><Link href="/profile">Edit profile</Link></Button></div>
      {error ? <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">{error}</p> : <MedicalHistoryClient data={medicalHistoryData}/>}
    </div>
  )
}
