"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowser } from "@/lib/supabaseBrowser"

type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}

export default function ChatPage() {
  const params = useParams<{ id: string }>()
  const conversationId = params.id
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    })
  }

  const loadMessages = async () => {
    try {
      const res = await fetch(`/api/messages?conversation_id=${conversationId}`, { cache: "no-store" })
      const json = await res.json()
      if (res.ok) {
        setMessages(json.messages ?? [])
      }
    } finally {
      setLoading(false)
      scrollToBottom()
    }
  }

  useEffect(() => {
    if (!conversationId) return
    loadMessages()
    const t = setInterval(loadMessages, 3000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  // Resolve current user id for alignment (sender right, receiver left)
  useEffect(() => {
    const resolve = async () => {
      try {
        const supabase = getSupabaseBrowser()
        const { data } = await supabase.auth.getUser()
        setCurrentUserId(data.user?.id ?? null)
      } catch {}
    }
    resolve()
  }, [])

  const send = async () => {
    const content = text.trim()
    if (!content) return
    setText("")
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation_id: conversationId, content }),
    })
    if (res.ok) {
      loadMessages()
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card className="p-4 h-[70vh] flex flex-col">
        <div ref={listRef} className="flex-1 overflow-y-auto space-y-3">
          {loading && <div className="text-muted-foreground text-center">Loading…</div>}
          {!loading && messages.length === 0 && (
            <div className="text-muted-foreground text-center">No messages yet. Say hi!</div>
          )}
          {messages.map((m) => {
            const mine = currentUserId && m.sender_id === currentUserId
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`${mine ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"} px-3 py-2 rounded-lg max-w-[75%] whitespace-pre-wrap`}
                >
                  {m.content}
                  <div className="text-[10px] opacity-70 mt-1">{new Date(m.created_at).toLocaleTimeString()}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
          />
          <Button onClick={send}>Send</Button>
        </div>
      </Card>
    </div>
  )
}
