"use client"

import { useEffect, useState } from "react"

export type OrderStatus = "Confirmed" | "Preparing" | "Out for delivery" | "Delivered" | "Completed"

interface OrderStatusProps {
  nextDelivery: { 
    mealType: string; 
    time: string; 
    timeInMinutes: number 
  } | null;
  isToday: boolean;
  orderStatus: "active" | "delivered" | "cancelled";
  orderId: string | string[] | undefined;
}

export function OrderStatus({ nextDelivery, isToday, orderStatus, orderId }: OrderStatusProps) {
  const [status, setStatus] = useState<OrderStatus>(() => getInitialStatus())
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  const statusSequence: OrderStatus[] = ["Confirmed", "Preparing", "Out for delivery", "Delivered"]

  // Calculate initial status based on time until next delivery
  function getInitialStatus(): OrderStatus {
    // If order is already marked as delivered or cancelled at the parent level
    if (orderStatus === "delivered") return "Completed"
    if (orderStatus === "cancelled") return "Completed"
    if (!nextDelivery) return "Completed"

    const now = new Date()
    const [hours, minutes] = nextDelivery.time.split(":").map(Number)

    const deliveryDate = new Date()
    deliveryDate.setHours(hours, minutes, 0, 0)

    // If delivery time has passed for today and it's not for tomorrow
    if (deliveryDate < now && isToday) {
      return "Delivered"
    }

    // Calculate minutes until delivery
    const minutesUntilDelivery = isToday
      ? nextDelivery.timeInMinutes - (now.getHours() * 60 + now.getMinutes())
      : 24 * 60 - (now.getHours() * 60 + now.getMinutes()) + nextDelivery.timeInMinutes

    if (minutesUntilDelivery <= 15) {
      return "Out for delivery"
    } else if (minutesUntilDelivery <= 60) {
      return "Preparing"
    } else {
      return "Confirmed"
    }
  }


  // Update status based on time remaining
  useEffect(() => {
    // If order is delivered/cancelled at parent level, don't run the timer
    if (orderStatus === "delivered" || orderStatus === "cancelled") {
      setStatus("Completed")
      setTimeRemaining(0)
      return
    }
    
    if (!nextDelivery) {
       
        return}

    const interval = setInterval(() => {
      const now = new Date()
      const [hours, minutes] = nextDelivery.time.split(":").map(Number)

      const deliveryDate = new Date()
      deliveryDate.setHours(hours, minutes, 0, 0)

      // If delivery is tomorrow
      if (!isToday) {
        deliveryDate.setDate(deliveryDate.getDate() + 1)
      }

      // If delivery time has passed
      if (deliveryDate < now && isToday) {
        setStatus("Delivered")
        setTimeRemaining(0)
        return
      }

      // Calculate minutes until delivery
      const minutesUntilDelivery = Math.floor((deliveryDate.getTime() - now.getTime()) / (1000 * 60))
      setTimeRemaining(minutesUntilDelivery)

      // Update status based on time remaining
      if (minutesUntilDelivery <= 15) {
        setStatus("Out for delivery")
      } else if (minutesUntilDelivery <= 60) {
        setStatus("Preparing")
      } else {
        setStatus("Confirmed")
      }
    }, 30) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [nextDelivery, isToday, orderStatus])

  const getStatusMessage = (currentStatus: OrderStatus) => {
    console.log("Current status:", currentStatus)
    // Special cases for cancelled or delivered orders
    if (orderStatus === "cancelled") {
      return "This order has been cancelled."
    }
    
    if (orderStatus === "delivered" || !nextDelivery) {
      return "All deliveries for this order have been completed."
    }

    // Regular status messages
    switch (currentStatus) {
      case "Confirmed":
        return `Your ${nextDelivery.mealType} order is confirmed and will be prepared ${timeRemaining > 120 ? "closer to delivery time" : "soon"}.`
      case "Preparing":
        return `We're preparing your ${nextDelivery.mealType} with fresh ingredients. It will be ready for delivery soon.`
      case "Out for delivery":
        return `Your ${nextDelivery.mealType} is on the way and will arrive shortly.`
      case "Delivered":
        return `Your ${nextDelivery.mealType} has been delivered. Enjoy your meal!`
      case "Completed":
        return "All deliveries for this order have been completed."
      default:
        return `Your ${nextDelivery.mealType} order is being processed.`
    }
  }
  // If all deliveries are completed or order is cancelled/delivered
  if (!nextDelivery || orderStatus === "delivered" || orderStatus === "cancelled") {
    return (
      <div className="bg-white border-2 rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Order Status</h2>
        <div className={`mt-4 p-3 rounded-lg ${
          orderStatus === "cancelled" 
            ? "bg-red-50 border border-red-100" 
            : "bg-green-50 border border-green-100"
        }`}>
          <p className={orderStatus === "cancelled" ? "text-red-800" : "text-green-800"}>
            {orderStatus === "cancelled"
              ? "This order has been cancelled."
              : "All deliveries for this order have been completed."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-2 rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {nextDelivery.mealType.charAt(0).toUpperCase() + nextDelivery.mealType.slice(1)} Delivery Status
      </h2>
      <div className="relative">
        <div className="flex justify-between mb-2">
          {statusSequence.map((statusStep) => (
            <div key={statusStep} className="text-center flex-1">
              <div
                className={`w-6 h-6 rounded-full mx-auto mb-1 ${
                  status === statusStep
                    ? "bg-purple-600 ring-4 ring-purple-100"
                    : statusSequence.indexOf(statusStep) < statusSequence.indexOf(status)
                      ? "bg-purple-600"
                      : "bg-gray-200"
                }`}
              />
              <p className={`text-xs font-medium ${status === statusStep ? "text-purple-600" : "text-gray-500"}`}>
                {statusStep}
              </p>
            </div>
          ))}
        </div>
        <div className="h-1 absolute top-3 left-0 bg-gray-200 w-full -z-10" />
        <div
          className="h-1 absolute top-3 left-0 bg-purple-600 -z-10 transition-all duration-500"
          style={{
            width: `${(statusSequence.indexOf(status) / (statusSequence.length - 1)) * 100}%`,
          }}
        />
      </div>
      <div className="mt-4 p-3 bg-purple-50 border border-purple-100 rounded-lg">
        <p className="text-purple-800">{getStatusMessage(status)}</p>{status !== "Delivered" && timeRemaining > 0 && (
  <p className="text-sm text-purple-600 mt-1">
    Estimated time until delivery: {Math.floor(timeRemaining / 60) < 24 
      ? `${Math.floor(timeRemaining / 60)} hour${Math.floor(timeRemaining / 60) !== 1 ? 's' : ''} ${timeRemaining % 60} minute${timeRemaining % 60 !== 1 ? 's' : ''}`
      : `${Math.floor(Math.floor(timeRemaining / 60) / 24)} day${Math.floor(Math.floor(timeRemaining / 60) / 24) !== 1 ? 's' : ''} ${Math.floor(timeRemaining / 60) % 24} hour${Math.floor(timeRemaining / 60) % 24 !== 1 ? 's' : ''}`
    }
  </p>
)}
      </div>
    </div>
  )
}