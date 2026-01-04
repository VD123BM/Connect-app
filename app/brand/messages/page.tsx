"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Conversation {
  id: string
  participants: string[]
  campaign_id: string | null
  created_at: string
}

export default function BrandMessagesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/conversations", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load conversations")
      setConversations(Array.isArray(json.conversations) ? json.conversations : [])
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Conversations with creators</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={load}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
          {error && <div className="text-sm text-destructive">{error}</div>}
          {!loading && !error && conversations.length === 0 && (
            <div className="text-sm text-muted-foreground">No conversations yet.</div>
          )}
          <div className="space-y-3">
            {conversations.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium">Conversation</div>
                  <div className="text-xs text-muted-foreground">Created: {new Date(c.created_at).toLocaleString()}</div>
                  {c.campaign_id && (
                    <div className="text-xs text-muted-foreground mt-1">Campaign: {c.campaign_id}</div>
                  )}
                </div>
                <Button size="sm" onClick={() => router.push(`/brand/chat/${c.id}`)}>
                  Open
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
