// src/lib/toast.ts
import { toast } from 'sonner'

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: { 
        backgroundColor: '#f0fdf4', 
        borderColor: '#bbf7d0',
        color: '#166534' 
      },
    })
  },
  error: (message: string) => {
    toast.error(message, {
      style: { 
        backgroundColor: '#fef2f2', 
        borderColor: '#fecaca',
        color: '#b91c1c' 
      },
    })
  },
  info: (message: string) => {
    toast.info(message)
  },
  loading: (message: string) => {
    return toast.loading(message)
  }
}