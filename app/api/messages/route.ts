import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabaseServer"

// GET /api/messages?conversation_id=...
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const conversation_id = searchParams.get("conversation_id")
    if (!conversation_id) return NextResponse.json({ error: "conversation_id is required" }, { status: 400 })

    // Verify the user is a participant
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("id, participants")
      .eq("id", conversation_id)
      .maybeSingle()

    if (convErr) return NextResponse.json({ error: convErr.message }, { status: 400 })
    if (!conv || !Array.isArray(conv.participants) || !conv.participants.includes(user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_id, content, created_at")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ messages: data ?? [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}

// POST /api/messages
// Body: { conversation_id: string, content: string }
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { conversation_id, content } = (await req.json()) as { conversation_id?: string; content?: string }
    if (!conversation_id || !content || content.trim().length === 0) {
      return NextResponse.json({ error: "conversation_id and content are required" }, { status: 400 })
    }

    // Verify the user is a participant
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("id, participants")
      .eq("id", conversation_id)
      .maybeSingle()

    if (convErr) return NextResponse.json({ error: convErr.message }, { status: 400 })
    if (!conv || !Array.isArray(conv.participants) || !conv.participants.includes(user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const payload = {
      conversation_id,
      sender_id: user.id,
      content: content.trim(),
    }

    const { data, error } = await supabase.from("messages").insert(payload).select().limit(1)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ message: data?.[0] ?? null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}
