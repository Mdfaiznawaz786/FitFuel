/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import API from "@/utils/api";

// Transform API data to match our app's format
const transformPaymentData = (apiData:any) => {
  if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }
  
  return apiData.map((item, index) => ({
    id: (index + 1).toString(),
    paymentId: 'PAY-'+item.paymentid.toString(36).substring(0,5) || `PAY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    amount: `$${parseFloat(item.amount).toFixed(2)}`,
    paymentMethod: item.paymentmethod || "Credit Card", // Default value if null
    status: item.status || "Completed", // Default value if null
    date: item.date || new Date().toISOString().split('T')[0],
  }));
}

// Transform and aggregate monthly data
const transformMonthlyData = (apiData:any) => {
  if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }
  
  // Create a map to aggregate totals by month
  const monthlyTotals = new Map();
  
  apiData.forEach(item => {
    if (item.month && item.monthtotal) {
      // If we already have an entry for this month, use the same total
      // (since monthtotal is the same for all entries in the same month)
      monthlyTotals.set(item.month, parseFloat(item.monthtotal));
    }
  });
  
  // If we don't have data for all months, add placeholder data
  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return allMonths.map(month => {
    // If we have data for this month, use it; otherwise use 0
    const amount = monthlyTotals.has(month) ? monthlyTotals.get(month) : 0;
    return {
      month,
      amount: Math.round(amount) // Round to nearest integer
    };
  });
}

export function usePaymentData() {
  const [selectedPayment, setSelectedPayment] = useState<{ id: string; paymentMethod: string; status: string } | null>(null)
  const [paymentData, setPaymentData] = useState<{ id: string; paymentId: string; amount: string; paymentMethod: any; status: any; date: any }[]>([])
  const [paymentMethodDistribution, setPaymentMethodDistribution] = useState<{ name: string; value: number }[]>([])
  const [paymentStatusDistribution, setPaymentStatusDistribution] = useState<{ name: string; value: number }[]>([])
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Handle payment selection
  const handlePaymentSelect = (payment:any) => {
    if (selectedPayment && selectedPayment.id === payment.id) {
      // Deselect if already selected
      setSelectedPayment(null)
      setPaymentMethodDistribution(getPaymentMethodDistribution(paymentData))
      setPaymentStatusDistribution(getPaymentStatusDistribution(paymentData))
    } else {
      setSelectedPayment(payment)
      // When a single payment is selected, we'll show 100% for that payment method and status
      setPaymentMethodDistribution([{ name: payment.paymentMethod, value: 1 }])
      setPaymentStatusDistribution([{ name: payment.status, value: 1 }])
    }
  }

  // Add debug logging to see what's happening with the data
useEffect(() => {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    
    fetch(API.TRANSACTION_HISTORY, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch payment history: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
     console.log("Payment history response:", responseData);
      
      // Check the structure and adapt accordingly
      let dataArray;
      if (responseData && Array.isArray(responseData)) {
        // Direct array
        dataArray = responseData;
      } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
        // Nested inside data property
        dataArray = responseData.data;
      } else {
        console.error("Unexpected data format:", responseData);
        dataArray = [];
      }
      
      // Transform the data regardless of source structure
      const transformedPayments = transformPaymentData(dataArray);
      const transformedMonthly = transformMonthlyData(dataArray);
      
      setPaymentData(transformedPayments);
      setMonthlyData(transformedMonthly);
      setPaymentMethodDistribution(getPaymentMethodDistribution(transformedPayments));
      setPaymentStatusDistribution(getPaymentStatusDistribution(transformedPayments));
      
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching payment history:", error);
      setError(error.message || "Failed to load payment data");
      setLoading(false);
    });
  }, []);

  return {
    paymentHistoryData: paymentData,
    paymentMethodDistribution,
    paymentStatusDistribution,
    monthlyPaymentData: monthlyData,
    selectedPayment,
    handlePaymentSelect,
    loading,
    error
  }
}

// Generate payment method distribution data
function getPaymentMethodDistribution(data:any) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  const methodCounts: Record<string, number> = {}

  data.forEach((item) => {
    if (item.paymentMethod) {
      if (methodCounts[item.paymentMethod]) {
        methodCounts[item.paymentMethod]++
      } else {
        methodCounts[item.paymentMethod] = 1
      }
    }
  })

  return Object.keys(methodCounts).map((method) => ({
    name: method,
    value: methodCounts[method],
  }))
}

// Generate payment status distribution data
function getPaymentStatusDistribution(data:any) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  const statusCounts: Record<string, number> = {}

  data.forEach((item) => {
    if (item.status) {
      if (statusCounts[item.status]) {
        statusCounts[item.status]++
      } else {
        statusCounts[item.status] = 1
      }
    }
  })

  return Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }))
}