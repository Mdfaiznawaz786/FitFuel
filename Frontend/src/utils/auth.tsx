// src/components/auth/auth-check.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { showToast } from "@/lib/toast" // Assuming you have this utility

// List of public paths that don't require authentication
const PUBLIC_PATHS = ['/', '/login', '/signup']

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  
  useEffect(() => {
    // Check if the current path is public
    const isPublicPath = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith('/auth/'))
    
    // Get token from sessionStorage
    const token = sessionStorage.getItem('token')
    
    // If not a public path and no token exists, redirect to home
    if (!isPublicPath && !token) {
      showToast.error("Please login to continue")
      router.push('/')
    }
    
    setIsAuthChecked(true)
  }, [pathname, router])
  
  // Show nothing until we've checked auth
  if (!isAuthChecked && !PUBLIC_PATHS.some(path => pathname === path)) {
    return null
  }
  
  return <>{children}</>
}