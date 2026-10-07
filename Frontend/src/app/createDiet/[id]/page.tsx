'use client'
import DietPlanner from "../components/diet-planner";
import {useParams} from "next/navigation";

export default function Home() {
  const params = useParams();
  const {id} = params;
  console.log("ID from params:", id);
  return (
    <main className="min-h-screen w-full flex p-0 md:p-4 bg-gradient-to-b from-white to-gray-50">
      <div className="flex-1 overflow-auto">
        <DietPlanner dietId={id}/>
      </div>
    </main>
  )
}