"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import API from "@/utils/api"
import type { MealItem } from "./use-diet-plan"

type Plan = Record<string, MealItem[]>
type Message = { role: "user" | "assistant"; content: string }

export function useChat(plan: Plan, goal: string) {
  const [showChatBot, setShowChatBot] = useState(false)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  const startChat = () => {
    setShowChatBot(true)
    setChatMessages([{ role: "assistant", content: "I'm an AI fitness guide. I can answer questions about your current meal plan and fitness goals. What would you like to know?" }])
  }

  const ask = async (question: string) => {
    if (isReplying) return
    setChatMessages((previous) => [...previous, { role: "user", content: question }])
    setIsReplying(true)
    try {
      const response = await fetch(API.ASK_TRAINER, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        body: JSON.stringify({ question, plan, goal }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(typeof data.message === "string" ? data.message : "The AI guide is unavailable.")
      setChatMessages((previous) => [...previous, { role: "assistant", content: data.reply }])
    } catch (error) {
      const message = error instanceof Error ? error.message : "The AI guide is unavailable."
      toast.error(message)
      setChatMessages((previous) => [...previous, { role: "assistant", content: "I couldn't answer that just now. Please try again." }])
    } finally {
      setIsReplying(false)
    }
  }

  const handleChatSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const question = messageInput.trim()
    if (!question || isReplying) return
    setMessageInput("")
    void ask(question)
  }

  const shareDietPlan = () => {
    void ask("Please review my current meal plan for my fitness goal and suggest one practical improvement based on the actual foods and quantities in it.")
  }

  return { showChatBot, setShowChatBot, chatMessages, messageInput, setMessageInput, isReplying, startChat, handleChatSubmit, shareDietPlan }
}
