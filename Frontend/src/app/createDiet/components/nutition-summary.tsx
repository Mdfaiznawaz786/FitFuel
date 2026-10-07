"use client"

interface NutritionSummaryProps {
  calories: number
  protein: number
  carbs: number
  fats: number
}

export function NutritionSummary({ calories, protein, carbs, fats }: NutritionSummaryProps) {
  return (
    <div className="rounded-xl border-2 bg-white p-4 md:p-5 lg:p-6 shadow-lg">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-4">Daily Nutrition Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        {/* Calories Card */}
        <div className="bg-amber-100 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md border-2 border-amber-200">
          <div className="text-xs sm:text-sm md:text-base text-amber-700 font-medium">
            Total Calories
          </div>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-800">
            {calories}
          </div>
        </div>
        
        {/* Protein Card */}
        <div className="bg-emerald-100 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md border-2 border-emerald-200">
          <div className="text-xs sm:text-sm md:text-base text-emerald-700 font-medium">
            Protein
          </div>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-emerald-800">
            {protein}g
          </div>
        </div>
        
        {/* Carbs Card */}
        <div className="bg-indigo-100 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md border-2 border-indigo-200">
          <div className="text-xs sm:text-sm md:text-base text-indigo-700 font-medium">
            Carbs
          </div>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-indigo-800">
            {carbs}g
          </div>
        </div>
        
        {/* Fats Card */}
        <div className="bg-rose-100 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md border-2 border-rose-200">
          <div className="text-xs sm:text-sm md:text-base text-rose-700 font-medium">
            Fats
          </div>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-rose-800">
            {fats}g
          </div>
        </div>
      </div>
    </div>
  )
}