"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";

// Generate diet distribution data
const getDietDistribution = (data: { diet: string }[]) => {
  const dietCounts: Record<string, number> = {};

  data.forEach((item) => {
    if (dietCounts[item.diet]) {
      dietCounts[item.diet]++;
    } else {
      dietCounts[item.diet] = 1;
    }
  });

  return Object.keys(dietCounts).map((diet) => ({
    name: diet,
    value: dietCounts[diet],
  }));
};

// Generate status distribution data
const getStatusDistribution = (data: { status: string }[]) => {
  const statusCounts: Record<string, number> = {};

  data.forEach((item) => {
    if (statusCounts[item.status]) {
      statusCounts[item.status]++;
    } else {
      statusCounts[item.status] = 1;
    }
  });

  return Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));
};

// Process API response into dietHistoryData format
interface DietItem {
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  mealType: string;
}

interface Order {
  orderid: string;
  ordername?: string;
  diet: DietItem[];
  status?: string;
  transactionid: string;
  startdate?: string;
}

const processDietHistoryData = (apiData: Order[]) => {
  return apiData.map((order) => {
    // Calculate nutrition totals from diet items
    const nutritionTotals = order.diet.reduce(
      (acc, item) => {
        acc.calories += item.calories || 0;
        acc.protein += item.protein || 0;
        acc.carbs += item.carbs || 0;
        acc.fat += item.fats || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Determine diet name (use first item's meal type or "Custom Diet Plan")
    const dietType =
      order.ordername ||
      (order.diet.length > 0
        ? `${
            order.diet[0].mealType.charAt(0).toUpperCase() +
            order.diet[0].mealType.slice(1)
          } Plan`
        : "Custom Diet Plan");

    return {
      id: order.orderid,
      diet: dietType,
      status: order.status || "Processing",
      transactionId: order.transactionid,
      deliveryDate: order.startdate
        ? new Date(order.startdate).toISOString().split("T")[0]
        : "N/A",
      calories: nutritionTotals.calories,
      protein: nutritionTotals.protein,
      carbs: nutritionTotals.carbs,
      fat: nutritionTotals.fat,
    };
  });
};

// Process API response into monthlyTrendData format
interface MonthlyOrder {
  month: string;
  orders?: number;
}

const processMonthlyTrendData = (apiData: MonthlyOrder[]) => {
  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthCounts: Record<string, number> = {};

  // Initialize all months with zero
  monthOrder.forEach((month) => {
    monthCounts[month] = 0;
  });

  // Count orders by month
  apiData.forEach((order) => {
    if (order.month && monthCounts.hasOwnProperty(order.month)) {
      monthCounts[order.month] += order.orders || 1;
    }
  });

  // Convert to array format sorted by month
  return monthOrder.map((month) => ({
    month,
    orders: monthCounts[month],
  }));
};

export function useDietData() {
  const [selectedRow, setSelectedRow] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    deliveryDate: string;
    transactionId: string;
    id: string;
    diet: string;
    status: string;
  } | null>(null);
  const [dietHistoryData, setDietHistoryData] = useState<
    {
      id: string;
      diet: string;
      status: string;
      transactionId: string;
      deliveryDate: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }[]
  >([]);
  const [dietDistribution, setDietDistribution] = useState<
    { name: string; value: number }[]
  >([]);
  const [statusDistribution, setStatusDistribution] = useState<
    { name: string; value: number }[]
  >([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState<
    { month: string; orders: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Handle row selection
  const handleRowSelect = (row: {
    id: string;
    diet: string;
    status: string;
    transactionId: string;
    deliveryDate: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => {
    if (selectedRow && selectedRow.id === row.id) {
      // Deselect if already selected
      setSelectedRow(null);
      setDietDistribution(getDietDistribution(dietHistoryData));
      setStatusDistribution(getStatusDistribution(dietHistoryData));
    } else {
      setSelectedRow(row);
      // When a single row is selected, we'll show 100% for that diet type
      setDietDistribution([{ name: row.diet, value: 1 }]);
      setStatusDistribution([{ name: row.status, value: 1 }]);
    }
  };

  useEffect(() => {
    fetch(API.ORDER_ORDERHISTORY, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          if (response.status === 401) {
            // Handle unauthorized access
            console.error("Unauthorized access. Please log in again.");
            // Redirect to login or show a message
            window.location.href = "/";
          }
        }
      })
      .then((data) => {
        console.log("Fetched data:", data);

        // Process API data into required formats
        const processedDietData = processDietHistoryData(data);
        const processedMonthlyData = processMonthlyTrendData(data);

        // Update state with processed data
        setDietHistoryData(processedDietData);
        setMonthlyTrendData(processedMonthlyData);
        setDietDistribution(getDietDistribution(processedDietData));
        setStatusDistribution(getStatusDistribution(processedDietData));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        // Fallback to mock data if API fails
        setDietHistoryData([]); // You can set mock data here if needed
        setMonthlyTrendData([]);
        setDietDistribution([]);
        setStatusDistribution([]);
        setIsLoading(false);
      });
  }, []);

  return {
    dietHistoryData,
    dietDistribution,
    statusDistribution,
    monthlyTrendData,
    selectedRow,
    handleRowSelect,
    isLoading,
  };
}
