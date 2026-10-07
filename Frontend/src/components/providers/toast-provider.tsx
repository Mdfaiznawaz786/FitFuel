// src/components/providers/toaster-provider.tsx
"use client"

import { Toaster } from 'sonner'

export function ToasterProvider() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        className: 'border border-gray-200',
        style: {
          background: 'white',
          color: 'black',
        },
      }}
    />
  )
}