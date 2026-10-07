/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TableSkeleton from "@/components/ui/table-skeleton"

interface PaymentData {
  id: string
  paymentId: string
  amount: string
  paymentMethod: string
  status: string
  date: string
}

interface PaymentHistoryTableProps {
  data: PaymentData[]
  isLoading: boolean
  selectedPayment: PaymentData | null
  onPaymentSelect: (payment: PaymentData) => void
}

export default function PaymentHistoryTable({ data, isLoading, selectedPayment, onPaymentSelect }: PaymentHistoryTableProps) {
  // Pagination state
  console.log(data)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Filtering state
  const [filters, setFilters] = useState<{
    paymentId: string
    paymentMethod: string[]
    status: string[]
    amount: string
    date: string
  }>({
    paymentId: "",
    paymentMethod: [],
    status: [],
    amount: "",
    date: "",
  })

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  })

  // Apply filters to data
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Payment ID filter
      if (filters.paymentId && !row.paymentId.toLowerCase().includes(filters.paymentId.toLowerCase())) {
        return false
      }

      // Payment Method filter (multi-select)
      if (filters.paymentMethod.length > 0 && !filters.paymentMethod.includes(row.paymentMethod)) {
        return false
      }

      // Status filter (multi-select)
      if (filters.status.length > 0 && !filters.status.includes(row.status)) {
        return false
      }

      // Amount filter (simple text search for now)
      if (filters.amount) {
        const amount = Number.parseFloat(row.amount.replace(/[^0-9.-]+/g, ""))
        const filterAmount = Number.parseFloat(filters.amount.replace(/[^0-9.-]+/g, ""))
        if (isNaN(filterAmount) || amount !== filterAmount) {
          return false
        }
      }

      // Date filter (simple text search for now)
      if (filters.date && !row.date.includes(filters.date)) {
        return false
      }

      return true
    })
  }, [data, filters])

  // Apply sorting to filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      if (sortConfig.key === "amount") {
        const amountA = Number.parseFloat((a[sortConfig.key] as string).replace(/[^0-9.-]+/g, ""))
        const amountB = Number.parseFloat((b[sortConfig.key] as string).replace(/[^0-9.-]+/g, ""))
        return sortConfig.direction === "ascending" ? amountA - amountB : amountB - amountA
      }

      if (sortConfig.key && a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (sortConfig.key && a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  // Handle filter changes
  const handleFilterChange = (key:any, value:any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Handle sort
  const requestSort = (key:any) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Handle filter toggle for multi-select filters
  const toggleFilter = (key: keyof typeof filters, value: string) => {
      setFilters((prev) => {
        const currentValues = prev[key] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v:any) => v !== value)
        : [...currentValues, value]

      return {
        ...prev,
        [key]: newValues,
      }
    })
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      paymentId: "",
      paymentMethod: [],
      status: [],
      amount: "",
      date: "",
    })
    setCurrentPage(1)
  }

  // Check if any filters are active
  const hasActiveFilters =
    filters.paymentId || filters.paymentMethod.length > 0 || filters.status.length > 0 || filters.amount || filters.date

  // Get unique payment methods and statuses for filters
  const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Apple Pay", "Google Pay"]
  const statuses = ["Completed", "Pending", "Failed", "Refunded"]

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Select a payment to view detailed information</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search payments..."
                className="pl-8 pr-4 py-2 w-full rounded-md border border-input bg-background"
                disabled={isLoading}
              />
            </div>
            
          </div>
          <TableSkeleton />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Select a payment to view detailed information</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search payment ID..."
                className="pl-8 pr-4 py-2 w-full rounded-md border border-input bg-background"
                value={filters.paymentId}
                onChange={(e) => handleFilterChange("paymentId", e.target.value)}
              />
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                <X className="h-4 w-4 mr-1" /> Clear filters
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-1">
                      <span>Payment ID</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => requestSort("paymentId")}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Filter ID..."
                      value={filters.paymentId}
                      onChange={(e) => handleFilterChange("paymentId", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-1">
                      <span>Amount</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => requestSort("amount")}>
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Filter amount..."
                      value={filters.amount}
                      onChange={(e) => handleFilterChange("amount", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-1">
                      <span>Payment Method</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {paymentMethods.map((method) => (
                            <DropdownMenuCheckboxItem
                              key={method}
                              checked={filters.paymentMethod.includes(method)}
                              onCheckedChange={() => toggleFilter("paymentMethod", method)}
                            >
                              {method}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {filters.paymentMethod.length === 0 ? (
                        <span className="text-xs text-muted-foreground">All methods</span>
                      ) : (
                        filters.paymentMethod.map((method) => (
                          <div key={method} className="bg-muted text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            {method}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => toggleFilter("paymentMethod", method)}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TableHead>
                <TableHead className="py-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {statuses.map((status) => (
                            <DropdownMenuCheckboxItem
                              key={status}
                              checked={filters.status.includes(status)}
                              onCheckedChange={() => toggleFilter("status", status)}
                            >
                              {status}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {filters.status.length === 0 ? (
                        <span className="text-xs text-muted-foreground">All statuses</span>
                      ) : (
                        filters.status.map((status) => (
                          <div key={status} className="bg-muted text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            {status}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter("status", status)} />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TableHead>
                <TableHead className="py-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => requestSort("date")}>
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="YYYY-MM-DD"
                      value={filters.date}
                      onChange={(e) => handleFilterChange("date", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No results found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow
                    key={row.id}
                    className={
                      selectedPayment && selectedPayment.id === row.id ? "bg-muted cursor-pointer" : "cursor-pointer"
                    }
                    onClick={() => onPaymentSelect(row)}
                  >
                    <TableCell className="font-medium py-3">{row.paymentId}</TableCell>
                    <TableCell className="py-3">{row.amount}</TableCell>
                    <TableCell className="py-3">{row.paymentMethod}</TableCell>
                    <TableCell className="py-3">
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          row.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : row.status === "Pending"
                              ? "bg-blue-100 text-blue-800"
                              : row.status === "Failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {row.status}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">{row.date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="5 per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length}{" "}
              items
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(1, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
