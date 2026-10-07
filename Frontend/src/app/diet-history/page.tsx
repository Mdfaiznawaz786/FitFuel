"use client"

import { CalendarIcon, ChevronDownIcon, SearchIcon } from "lucide-react"
import Link from "next/link"

import { DietHistoryCard } from "./components/diet-history-card"
import { DietHistoryFilter } from "./components/diet-history-filter"
import { FilterContextProvider } from "./components/filter-context-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useContext } from "react"
import { FilterContext } from "./components/filter-context-provider"
import { useDietFilters } from "./hooks/use-diet-filters"

// Sample diet history data


function DietHistoryContent() {
    
  const { filters, setStatus, setSearchQuery, filteredPlans} = useContext(FilterContext)
 
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Diet Plan History</h1>
          <p className="text-muted-foreground">View and manage your past diet plans and recommendations.</p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search diet plans..."
                className="h-10 pl-10"
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button variant="outline" size="sm" className="h-10">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Date Range
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
            <DietHistoryFilter />
            <Button variant="default" size="sm" className="h-10">
              <Link href="/createDiet" className="flex items-center">
                Get New Recommendation
              </Link>
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          className="w-full"
          value={filters.status}
          onValueChange={(value) => setStatus(value as "all" | "active" | "completed")}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => <DietHistoryCard key={plan.id} plan={plan} />)
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">No diet plans match your filters.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setStatus("all")}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="active" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => <DietHistoryCard key={plan.id} plan={plan} />)
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">No active diet plans match your filters.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setStatus("all")}>
                    View All Plans
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => <DietHistoryCard key={plan.id} plan={plan} />)
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">No completed diet plans match your filters.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setStatus("all")}>
                    View All Plans
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {filteredPlans.length > 5 && (
          <div className="flex items-center justify-center py-4">
            <Button variant="outline" size="sm">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DietHistoryPage() {
    const {dietData} = useDietFilters();
  return (
    <FilterContextProvider initialPlans={dietData}>
      <DietHistoryContent />
    </FilterContextProvider>
  )
}
