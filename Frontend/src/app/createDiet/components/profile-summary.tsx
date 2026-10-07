import { Badge } from "@/components/ui/badge"
import type { UserProfile } from "../hooks/use-diet-plan"

interface ProfileSummaryProps {
  profile: UserProfile
  diseases: { id: string; label: string }[]
}

export function ProfileSummary({ profile, diseases }: ProfileSummaryProps) {
  return (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
      <h3 className="text-xl font-semibold text-purple-700 mb-3">Your Profile</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-3 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500 font-medium">Height</div>
          <div className="text-lg font-bold">{profile.height || "Not specified"}</div>
        </div>
        <div className="bg-white p-3 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500 font-medium">Weight</div>
          <div className="text-lg font-bold">{profile.weight || "Not specified"}</div>
        </div>
        <div className="bg-white p-3 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500 font-medium">Goal</div>
          <div className="text-lg font-bold capitalize">{profile.goal}</div>
        </div>
        <div className="bg-white p-3 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500 font-medium">Activity Level</div>
          <div className="text-lg font-bold capitalize">{profile.activityLevel}</div>
        </div>
      </div>

      {/* Display health conditions if any */}
      {(profile.diseases.length > 0 || profile.otherDisease) && (
        <div className="mt-4">
          <div className="text-sm text-gray-500 font-medium mb-2">Health Conditions</div>
          <div className="flex flex-wrap gap-2">
            {profile.diseases.map((disease) => (
              <Badge key={disease} variant="outline" className="px-3 py-1 text-base bg-white">
                {diseases.find((d) => d.id === disease)?.label || disease}
              </Badge>
            ))}
            {profile.otherDisease && (
              <Badge variant="outline" className="px-3 py-1 text-base bg-white">
                {profile.otherDisease}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

