'use client'
import DietPlanner from "./components/diet-planner"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-4 md:p-8 flex-1 w-full justify-end">
      <div className="w-full max-w-7xl mx-auto">
        <DietPlanner dietId={""} />
      </div>
    </main>
  )
}