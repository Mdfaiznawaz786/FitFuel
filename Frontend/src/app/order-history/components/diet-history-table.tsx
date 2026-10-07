"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
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

export interface DietHistoryRow {
  id: string
  diet: string
  status: string
  transactionId: string
  deliveryDate: string
}

interface DietHistoryTableProps {
  data: DietHistoryRow[]
  isLoading: boolean
  selectedRow: DietHistoryRow | null
  onRowSelect: (row: DietHistoryRow) => void
}

export default function DietHistoryTable({ data, isLoading, selectedRow, onRowSelect }: DietHistoryTableProps) {
  // Pagination state
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Filtering state
  const [filters, setFilters] = useState<{
    diet: string
    status: string[]
    transactionId: string
    deliveryDate: string
  }>({
    diet: "",
    status: [],
    transactionId: "",
    deliveryDate: "",
  })
  const redirectToOrderConfirmation = (orderId: string) => {
    router.push(`/order-confirmation/${orderId}`)
  }

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DietHistoryRow | null
    direction: "ascending" | "descending"
  }>({
    key: null,
    direction: "ascending",
  })

  // Apply filters to data
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Diet filter (case-insensitive text search)
      if (filters.diet && !row.diet.toLowerCase().includes(filters.diet.toLowerCase())) {
        return false
      }

      // Status filter (multi-select)
      if (filters.status.length > 0 && !filters.status.includes(row.status)) {
        return false
      }

      // Transaction ID filter (case-insensitive text search)
      if (filters.transactionId && !row.transactionId.toLowerCase().includes(filters.transactionId.toLowerCase())) {
        return false
      }

      // Delivery date filter (simple text search for now)
      if (filters.deliveryDate && !row.deliveryDate.includes(filters.deliveryDate)) {
        return false
      }

      return true
    })
  }, [data, filters])

  // Apply sorting to filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
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
  const handleFilterChange = (key: keyof typeof filters, value: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Handle sort
  const requestSort = (key: keyof DietHistoryRow) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Handle status filter toggle
  const toggleStatusFilter = (status: string) => {
    setFilters((prev) => {
      const newStatuses = prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status]

      return {
        ...prev,
        status: newStatuses,
      }
    })
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      diet: "",
      status: [],
      transactionId: "",
      deliveryDate: "",
    })
    setCurrentPage(1)
  }

  // Check if any filters are active
  const hasActiveFilters = filters.diet || filters.status.length > 0 || filters.transactionId || filters.deliveryDate

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Diet History</CardTitle>
          <CardDescription>Select a row to view detailed analysis</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search diets..."
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
        <CardTitle>Diet History</CardTitle>
        <CardDescription>Select a row to view detailed analysis</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search diets..."
                className="pl-8 pr-4 py-2 w-full rounded-md border border-input bg-background"
                value={filters.diet}
                onChange={(e) => handleFilterChange("diet", e.target.value)}
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
                      <span>Ordered Diet</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => requestSort("diet")}>
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Filter diets..."
                      value={filters.diet}
                      onChange={(e) => handleFilterChange("diet", e.target.value)}
                      className="h-8 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    />
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
                          <DropdownMenuCheckboxItem
                            checked={filters.status.includes("Delivered")}
                            onCheckedChange={() => toggleStatusFilter("Delivered")}
                          >
                            Delivered
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={filters.status.includes("Processing")}
                            onCheckedChange={() => toggleStatusFilter("Processing")}
                          >
                            Processing
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={filters.status.includes("Cancelled")}
                            onCheckedChange={() => toggleStatusFilter("Cancelled")}
                          >
                            Cancelled
                          </DropdownMenuCheckboxItem>
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
                            <X className="h-3 w-3 cursor-pointer" onClick={() => toggleStatusFilter(status)} />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TableHead>
                <TableHead className="py-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-1">
                      <span>Transaction ID</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => requestSort("transactionId")}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Filter IDs..."
                      value={filters.transactionId}
                      onChange={(e) => handleFilterChange("transactionId", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-1">
                      <span>Delivery Date</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => requestSort("deliveryDate")}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="YYYY-MM-DD"
                      value={filters.deliveryDate}
                      onChange={(e) => handleFilterChange("deliveryDate", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No results found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow
                    key={row.id}
                    className={selectedRow && selectedRow.id === row.id ? "bg-muted cursor-pointer" : "cursor-pointer"}
                    onClick={() => onRowSelect(row)}
                  >
                    <TableCell className="font-medium py-3">
                      <span 
                        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering row selection
                          redirectToOrderConfirmation(row.id);
                        }}
                      >
                        {row.diet}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          row.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : row.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {row.status}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">{row.transactionId}</TableCell>
                    <TableCell className="py-3">{row.deliveryDate}</TableCell>
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