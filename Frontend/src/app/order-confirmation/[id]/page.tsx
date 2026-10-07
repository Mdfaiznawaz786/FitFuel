"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle, Clock, MapPin, ArrowLeft, Truck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DeliveryCountdown } from "@/components/delivery-countdown"
import { format } from "date-fns"
import { OrderStatus } from "./components/order-status"
import API from "@/utils/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type OrderItem = {
  id: string
  name: string
  quantity: string
  calories: number
  price: number
  mealType?: string
  deliveryTime?: string
}

type DeliveryInfo = {
  mealType: string;
  time: string;
  timeInMinutes: number;
  isToday: boolean;
};

type OrderDetails = {
  orderId: string
  items: OrderItem[]
  customer: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    email: string
    phone: string
  }
  payment: {
    subtotal: number
    tax: number
    deliveryFee: number
    total: number
  }
  deliveryTimes: Record<string, string>
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const params = useParams();
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [breakfastTime, setBreakfastTime] = useState<string>("");
  const [lunchTime, setLunchTime] = useState<string>("");
  const [dinnerTime, setDinnerTime] = useState<string>("");
  const [snackTime, setSnackTime] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<"active" | "delivered" | "cancelled">("active")
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  // Add state for nextDelivery to avoid React hooks error
  const [nextDelivery, setNextDelivery] = useState<DeliveryInfo | null>(null)
  const [allDeliveriesCompleted, setAllDeliveriesCompleted] = useState(false)
  const [isPastDeliveryDate, setIsPastDeliveryDate] = useState(false)

  const orderId = params.id
  // First useEffect - fetch order data
  const showCancelDialog = () => {
    setIsCancelDialogOpen(true)
  }
  useEffect(() => {
    setLoading(true);
    fetch(`${API.ORDER_ORDERCONFIRMATION}/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched order data:", data);

        // Parse the date without timezone conversion
        const rawDate = data.data.cartData.startdate;
        const dateParts = rawDate.split('T')[0].split('-');
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Months are 0-based in JS
        const day = parseInt(dateParts[2], 10);

        // Create date with the exact date parts (no time) to avoid timezone issues
        const deliveryDate = new Date(year, month, day);
        //console.log("Parsed delivery date:", deliveryDate);

        setStartDate(deliveryDate);

        // Extract delivery times directly from order items without defaults
        const deliveryTimes: Record<string, string> = {};

        // Only use actual times from the data
        for (const item of data.data.cartData.diet) {
          if (item.mealType && item.deliveryTime) {
            // Ensure deliveryTime is properly formatted as "HH:MM"
            const formattedTime = item.deliveryTime.includes(':') ?
              item.deliveryTime :
              `${item.deliveryTime.slice(0, 2)}:${item.deliveryTime.slice(2, 4)}`;

            deliveryTimes[item.mealType] = formattedTime;

            // Also update state for component use
            if (item.mealType === "breakfast") setBreakfastTime(formattedTime);
            if (item.mealType === "lunch") setLunchTime(formattedTime);
            if (item.mealType === "dinner") setDinnerTime(formattedTime);
            if (item.mealType === "snack") setSnackTime(formattedTime);
          }

          // Set price for each item
          item.price = item.calories * 0.05;
        }

        const orderDetailsData = {
          orderId: 'ORD' + orderId,
          items: data.data.cartData.diet,
          customer: {
            name: data.data.deliveryData.firstname + " " + data.data.deliveryData.lastname,
            address: data.data.deliveryData.address,
            city: data.data.deliveryData.city,
            state: data.data.deliveryData.state,
            zip: data.data.deliveryData.zipcode,
            email: data.data.deliveryData.email,
            phone: data.data.deliveryData.phonenumber,
          },
          payment: {
            subtotal: parseFloat(data.data.transactionData.subtotal),
            tax: parseFloat(data.data.transactionData.tax),
            deliveryFee: parseFloat(data.data.transactionData.deliveryfee),
            total: parseFloat(data.data.transactionData.totalAmount),
          },
          deliveryTimes: deliveryTimes, // Only use actual times from the data
        };

        console.log("Order details fetched successfully:", orderDetailsData);
        setOrderDetails(orderDetailsData);
        setEndDate(new Date(data.data.cartData.endDate));
        console.log("Order status:", data.data.cartData.status);
        if (data.data.cartData.status == "Cancelled" || data.data.cartData.status == "Delivered") {
          setOrderStatus(data.data.cartData.status.toLowerCase() as "active" | "delivered" | "cancelled");
        } else {
          setOrderStatus("active");
        }
        //setOrderStatus(data.data.cartData && data.data.cartData.status && data.data.cartData.status.toLowerCase() as "active" | "delivered" | "cancelled");
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
      });
  }, [orderId]);

  // Second useEffect - calculate delivery status
  // Second useEffect - calculate delivery status
  useEffect(() => {
    if (!orderDetails || loading) return;

    const now = new Date();
    const startDeliveryDate = new Date(startDate);
    const endDeliveryDate = new Date(endDate);

    // Check if all delivery dates are in the past (i.e., current date is past end date)
    const isAllDeliveryDatesPast = now > endDeliveryDate;

    // Find the next occurrence of delivery date
    let currentDeliveryDate = new Date(startDeliveryDate);

    // If today is after start date but before end date, find the current delivery date
    if (now > startDeliveryDate && now <= endDeliveryDate) {
      // Set to today's date, but keep the original date's time
      currentDeliveryDate = new Date(now);
      currentDeliveryDate.setHours(0, 0, 0, 0);
    }

    // Check if current delivery date is valid (not past end date)
    const isValidDeliveryDate = currentDeliveryDate <= endDeliveryDate;

    // Compare today with the current delivery date
    const isSameDay =
      now.getDate() === currentDeliveryDate.getDate() &&
      now.getMonth() === currentDeliveryDate.getMonth() &&
      now.getFullYear() === currentDeliveryDate.getFullYear();

    // Calculate current time in minutes
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    // Find the next meal to be delivered
    let nextDeliveryInfo: DeliveryInfo | null = null;

    // Track if all deliveries are in the past
    let allCompleted = isAllDeliveryDatesPast;

    if (!isAllDeliveryDatesPast && isValidDeliveryDate) {
      Object.entries(orderDetails.deliveryTimes || {}).forEach(([mealType, time]) => {
        if (!time || !time.includes(':')) return; // Skip invalid time formats

        const [hours, minutes] = time.split(":").map(Number);
        if (isNaN(hours) || isNaN(minutes)) return; // Skip if parsing failed

        const timeInMinutes = hours * 60 + minutes;

        // A delivery is upcoming if either:
        // 1. It's today and the time is in the future, or
        // 2. It's a future date within the delivery period
        const isUpcoming = (isSameDay && timeInMinutes > currentTimeInMinutes) ||
          (!isSameDay && currentDeliveryDate <= endDeliveryDate);

        if (isUpcoming) {
          allCompleted = false; // At least one upcoming delivery

          // Find the next upcoming delivery
          const isToday = isSameDay && timeInMinutes > currentTimeInMinutes;

          // Only update nextDeliveryInfo if this meal happens sooner than the current next delivery
          if (!nextDeliveryInfo || (isToday && timeInMinutes < nextDeliveryInfo.timeInMinutes)) {
            nextDeliveryInfo = {
              mealType,
              time,
              timeInMinutes,
              isToday: isToday
            };
          }
        }
      });
    }

    // If we don't have an upcoming delivery today but we're still within the delivery period,
    // find the next day's first delivery
    if (!nextDeliveryInfo && !isAllDeliveryDatesPast && currentDeliveryDate < endDeliveryDate) {
      // Get the earliest delivery for the next day
      let earliestTime = Number.MAX_SAFE_INTEGER;
      let earliestMealType = '';
      let earliestTimeString = '';

      Object.entries(orderDetails.deliveryTimes || {}).forEach(([mealType, time]) => {
        if (!time || !time.includes(':')) return;

        const [hours, minutes] = time.split(":").map(Number);
        if (isNaN(hours) || isNaN(minutes)) return;

        const timeInMinutes = hours * 60 + minutes;

        if (timeInMinutes < earliestTime) {
          earliestTime = timeInMinutes;
          earliestMealType = mealType;
          earliestTimeString = time;
        }
      });

      if (earliestMealType) {
        // Set for the next day
        const nextDay = new Date(currentDeliveryDate);
        nextDay.setDate(nextDay.getDate() + 1);

        nextDeliveryInfo = {
          mealType: earliestMealType,
          time: earliestTimeString,
          timeInMinutes: earliestTime,
          isToday: false
        };

        allCompleted = false;
      }
    }

    setNextDelivery(nextDeliveryInfo);
    setAllDeliveriesCompleted(allCompleted);
    setIsPastDeliveryDate(isAllDeliveryDatesPast);

  }, [orderDetails, loading, startDate, endDate]);

  // Third useEffect - update order status based on delivery status
  useEffect(() => {
    if ((isPastDeliveryDate || allDeliveriesCompleted) && orderStatus === "active") {
      setOrderStatus("delivered");
    }
  }, [isPastDeliveryDate, allDeliveriesCompleted, orderStatus]);

  // Handle order cancellation
  const handleCancelOrder = async () => {
    try {
      // Implement the API call to cancel the order
      const apiData = {
        status: "Cancelled",
      }
      const response = await fetch(`${API.ORDER_UPDATEORDERSTATUS}/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        setOrderStatus("cancelled");
      } else {
        alert("Failed to cancel order. Please try again or contact support.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("An error occurred while cancelling your order.");
    }
  };
    // Calculate the actual next delivery date
    const nextDeliveryDate = useMemo(() => {
      if (!nextDelivery) return new Date();
      
      const now = new Date();
      let deliveryDate;
      
      if (nextDelivery.isToday) {
        // For today's delivery, use today's date
        deliveryDate = new Date(now);
      } else {
        // For tomorrow's delivery, use tomorrow's date
        deliveryDate = new Date(now);
        deliveryDate.setDate(deliveryDate.getDate() + 1);
      }
      
      return deliveryDate;
    }, [nextDelivery]);
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center p-8">
        <div className="text-center">
          <Progress value={80} className="w-60 h-2 mb-4" />
          <p className="text-gray-500">Loading your order details...</p>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Order details not found</h1>
          <p className="text-gray-500 mb-6">We couldn&apos;t find your order details</p>
          <Button onClick={() => router.push("/")} className="bg-purple-600 hover:bg-purple-500">
            Return to Diet Planner
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-white-50 p-4 md:p-8 w-full">
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Your Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep My Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => router.push("/createDiet")} className="mb-6 flex items-center gap-2 text-lg">
          <ArrowLeft className="h-5 w-5" />
          Return to Diet Plan
        </Button>

        <div className={`border-2 rounded-xl p-6 mb-8 flex items-center gap-4 ${orderStatus === "cancelled"
            ? "bg-red-50 border-red-200"
            : "bg-green-50 border-green-200"
          }`}>
          <div className={`p-3 rounded-full ${orderStatus === "cancelled" ? "bg-red-100" : "bg-green-100"
            }`}>
            {orderStatus === "cancelled" ? (
              <AlertCircle className="h-8 w-8 text-red-600" />
            ) : (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${orderStatus === "cancelled" ? "text-red-800" : "text-green-800"
              }`}>
              {orderStatus === "cancelled"
                ? "Order Cancelled"
                : orderStatus === "delivered"
                  ? "Order Delivered Successfully"
                  : "Order Confirmed!"}
            </h1>
            <p className={orderStatus === "cancelled" ? "text-red-700" : "text-green-700"}>
              {orderStatus === "cancelled"
                ? `Your order #${orderDetails.orderId} has been cancelled.`
                : `Your order #${orderDetails.orderId} has been ${orderStatus === "delivered" ? "delivered successfully" : "placed successfully"
                }. ${orderStatus === "active" ? "You'll receive an email confirmation shortly." : ""}`}
            </p>
          </div>
        </div>

        {/* Show cancel button only for active orders */}
        {orderStatus === "active" && (
          <div className="mb-6">
            <Button
              variant="destructive"
              onClick={showCancelDialog}
              className="hover:bg-red-700"
            >
              Cancel Order
            </Button>
          </div>
        )}

        <div className="mb-8">
          <OrderStatus
            nextDelivery={nextDelivery}
            isToday={nextDelivery?.isToday || false}
            orderStatus={orderStatus}
            orderId={orderId}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Only show next delivery card for active orders with upcoming deliveries */}
            {nextDelivery && orderStatus === "active" && (
              <Card className="border-2 shadow-md bg-gradient-to-r from-purple-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Clock className="h-6 w-6 text-purple-600" />
                    Next Delivery
                  </CardTitle>
                  <CardDescription className="text-base">
                    Your {nextDelivery.mealType} will be delivered at {nextDelivery.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeliveryCountdown
                    deliveryTime={nextDelivery.time}
                    mealType={nextDelivery.mealType}
                    deliveryDate={nextDeliveryDate} // Pass the delivery date
                  />
                </CardContent>
              </Card>
            )}

            <Card className="border-2 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Truck className="h-6 w-6 text-purple-600" />
                  Delivery Schedule
                </CardTitle>
                <CardDescription className="text-base">
                  {orderStatus === "cancelled"
                    ? "Your meals were scheduled for these times"
                    : orderStatus === "delivered"
                      ? "Your meals were delivered at these times"
                      : "Your meals will be delivered at these times daily from " +
                      format(startDate, 'MMM d') + " to " + format(endDate, 'MMM d')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(orderDetails.deliveryTimes).map(([mealType, time]) => (
                  <div key={mealType} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-lg capitalize">{mealType}</p>
                      <p className="text-gray-500">
                        {orderDetails.items.filter((item) => item.mealType === mealType).length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{time}</p>
                      <p className="text-gray-500">
                        {startDate ? format(startDate, 'EEE, MMM d') : 'Loading date...'}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-purple-600" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium text-lg">{orderDetails.customer.name}</p>
                  <p className="text-gray-600">{orderDetails.customer.address}</p>
                  <p className="text-gray-600">
                    {orderDetails.customer.city}, {orderDetails.customer.state} {orderDetails.customer.zip}
                  </p>
                  <p className="text-gray-600 mt-2">{orderDetails.customer.phone}</p>
                  <p className="text-gray-600">{orderDetails.customer.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-2 shadow-md sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl">Order Summary</CardTitle>
                <CardDescription className="text-base">Order #{orderDetails.orderId}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-400 capitalize">{item.mealType}</p>
                          <p className="text-sm text-gray-400">• {item.deliveryTime}</p>
                        </div>
                      </div>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${orderDetails.payment.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${orderDetails.payment.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">${orderDetails.payment.deliveryFee.toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${orderDetails.payment.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}