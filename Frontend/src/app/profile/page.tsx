'use client'
import { Suspense } from "react"
import ProfileForm from "./components/profile-form"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  return (
    <div className="flex-1 w-full max-w-full">
      <div className="container px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Your Profile</h1>
        <p className="text-muted-foreground mb-8">
          Update your profile information to generate personalized diet plans and view your medical history.
        </p>
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileForm />
        </Suspense>
      </div>
    </div>
  )
}

// ProfileSkeleton component remains the same
function ProfileSkeleton() {
  return (
    <div className="space-y-8 ">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(i === 3 ? 1 : 2)
                .fill(0)
                .map((_, j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
            </div>
          </div>
        ))}
      <Skeleton className="h-10 w-32" />
    </div>
  )
}