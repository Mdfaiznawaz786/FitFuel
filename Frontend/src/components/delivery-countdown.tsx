"use client"

import { useState, useEffect } from "react"

interface DeliveryCountdownProps {
  deliveryTime: string // Format: "HH:MM"
  mealType: string
  deliveryDate: Date
}

export function DeliveryCountdown({ deliveryTime, mealType, deliveryDate }: DeliveryCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    total: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })
  
  useEffect(() => {
    // Parse delivery time
    const [hours, minutes] = deliveryTime.split(":").map(Number)
    
    // Create a target date based on the passed deliveryDate and set the time
    const targetDate = new Date(deliveryDate)
    targetDate.setHours(hours, minutes, 0, 0)
    
    console.log("Countdown target:", targetDate)
    console.log("Current time:", new Date())
    
    // Update the countdown every second
    const timer = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()
      
      // If the delivery time has passed
      if (difference <= 0) {
        clearInterval(timer)
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })
        return
      }
      
      // Calculate remaining time components
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)
      
      setTimeRemaining({ days, hours, minutes, seconds, total: difference })
    }, 1000)
    
    // Cleanup the interval on component unmount
    return () => clearInterval(timer)
  }, [deliveryTime, deliveryDate])
  
  // Display the countdown
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 my-4">
        <div className="flex flex-col items-center">
          <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-purple-800">{timeRemaining.days}</span>
          </div>
          <span className="text-xs mt-1 text-gray-600">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-purple-800">{timeRemaining.hours}</span>
          </div>
          <span className="text-xs mt-1 text-gray-600">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-purple-800">{timeRemaining.minutes}</span>
          </div>
          <span className="text-xs mt-1 text-gray-600">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-purple-800">{timeRemaining.seconds}</span>
          </div>
          <span className="text-xs mt-1 text-gray-600">Seconds</span>
        </div>
      </div>
      
      <p className="text-center text-gray-700">
        Your {mealType} will be delivered at {deliveryTime} on{" "}
        {deliveryDate.toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })}.
      </p>
    </div>
  )
}