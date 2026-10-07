"use client"

import type React from "react"
import { Send, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ChatDialogProps {
  showChatBot: boolean
  setShowChatBot: (show: boolean) => void
  chatMessages: { role: string; content: string }[]
  messageInput: string
  setMessageInput: (input: string) => void
  isReplying: boolean
  handleChatSubmit: (e: React.FormEvent) => void
  shareDietPlan: () => void
}

export function ChatDialog({ showChatBot, setShowChatBot, chatMessages, messageInput, setMessageInput, isReplying, handleChatSubmit, shareDietPlan }: ChatDialogProps) {
  return (
    <Dialog open={showChatBot} onOpenChange={setShowChatBot}>
      <DialogContent className="flex h-[min(600px,85dvh)] w-[calc(100vw-2rem)] max-w-md min-w-0 flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b px-5 py-4 pr-12">
          <DialogTitle>AI Fitness Guide</DialogTitle>
          <DialogDescription>Answers use your current meal plan. This is AI guidance, not medical advice.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="min-h-0 min-w-0 flex-1 px-4 py-4">
          <div className="space-y-4 pr-3">
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex min-w-0 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <p className={`max-w-[85%] min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-2xl px-4 py-3 text-sm ${message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800"}`}>{message.content}</p>
              </div>
            ))}
            {isReplying && <p className="text-sm text-muted-foreground">Thinking...</p>}
          </div>
        </ScrollArea>
        <form onSubmit={handleChatSubmit} className="flex min-w-0 shrink-0 gap-2 border-t p-4">
          <Textarea aria-label="Message" maxLength={1000} placeholder="Ask about your plan..." className="min-w-0 flex-1 resize-none" value={messageInput} onChange={(event) => setMessageInput(event.target.value)} />
          <div className="flex flex-col gap-2">
            <Button type="submit" size="icon" disabled={isReplying || !messageInput.trim()} aria-label="Send message"><Send className="h-4 w-4" /></Button>
            <Button type="button" size="icon" variant="outline" onClick={shareDietPlan} disabled={isReplying} aria-label="Ask AI to review plan"><Share2 className="h-4 w-4" /></Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
