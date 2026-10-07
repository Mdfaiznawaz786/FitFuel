"use client"

import { useState } from "react"
import { User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// This is a Client Component that handles the dialog state
export function NoMedicalDataDialog() {
  const [open, setOpen] = useState(true)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>No Medical History Found</DialogTitle>
          <DialogDescription>
            We couldn&apos;t find any medical history data for your profile. Please update your profile information to view
            your medical history.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <div className="rounded-full bg-muted p-8">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button asChild>
            <Link href="/profile">Update Profile</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// This is a wrapper component that will be rendered by the Server Component
export default function NoMedicalDataWrapper() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <NoMedicalDataDialog />
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">No Medical History Available</h2>
        <p className="text-muted-foreground mb-4">Please update your profile to view your medical history.</p>
        <Button asChild>
          <Link href="/profile">Update Profile</Link>
        </Button>
      </div>
    </div>
  )
}
