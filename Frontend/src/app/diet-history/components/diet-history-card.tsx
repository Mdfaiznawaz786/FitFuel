/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { CalendarDays, Clock, Flame, Heart, MoreVertical } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

interface DietPlan {
  dietid: any
  id: string
  title: string
  date: string
  status: string
  duration: string
  calories: number
  protein: number
  carbs: number
  fat: number
  tags: string[]
  image: string
}

interface DietHistoryCardProps {
  plan: DietPlan
}

export function DietHistoryCard({ plan }: DietHistoryCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="relative h-12 w-12 overflow-hidden rounded-md">
              <Image src={plan.image || "/placeholder.svg"} alt={plan.title} fill className="object-cover" />
            </div> */}
            <div>
              <CardTitle className="text-lg">{plan.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {plan.date}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">Favorite</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={`/diet-plan/${plan.id}`} className="flex w-full">
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Download PDF</DropdownMenuItem>
                <DropdownMenuItem>Share Plan</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mb-3 flex flex-wrap gap-1">
          <Badge variant={plan.status === "active" ? "default" : "secondary"}>
            {plan.status === "active" ? "Active" : "Completed"}
          </Badge>
          {plan.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{plan.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{plan.calories} kcal</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Protein</span>
              <span>{plan.protein}g</span>
            </div>
            <Progress value={(plan.protein / 200) * 100} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Carbs</span>
              <span>{plan.carbs}g</span>
            </div>
            <Progress value={(plan.carbs / 300) * 100} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Fat</span>
              <span>{plan.fat}g</span>
            </div>
            <Progress value={(plan.fat / 100) * 100} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center p-4 pt-0">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/createDiet/${plan.dietid}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
