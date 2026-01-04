import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabaseServer"

// POST: create or fetch a conversation between current user and a brand for a campaign
// Body: { brand_id: string, campaign_id?: string }
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body = (await req.json()) as { other_user_id?: string; brand_id?: string; campaign_id?: string | null }
    const other_user_id = body.other_user_id || body.brand_id
    const campaign_id = body.campaign_id ?? null
    if (!other_user_id) return NextResponse.json({ error: "other_user_id is required" }, { status: 400 })

    // Ensure deterministic participant ordering to avoid duplicates
    const participants = [user.id, other_user_id].sort()

    // Try to find existing conversation (robust contains match for the two participants)
    const { data: existingList, error: findErr } = await supabase
      .from("conversations")
      .select("id, participants, campaign_id, created_at")
      .contains("participants", participants)
      .order("created_at", { ascending: false })
      .limit(1)

    if (findErr) {
      return NextResponse.json({ error: findErr.message }, { status: 400 })
    }

    const existing = Array.isArray(existingList) && existingList.length > 0 ? existingList[0] : null
    if (existing) return NextResponse.json({ conversation: existing })

    const payload = {
      participants,
      campaign_id,
      created_by: user.id,
    }

    const { data, error } = await supabase.from("conversations").insert(payload).select().limit(1)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ conversation: data?.[0] ?? null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}

// GET: list conversations for current user
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const conversation_id = searchParams.get("conversation_id")

    // If a specific conversation is requested, return it with basic metadata for header
    if (conversation_id) {
      const { data: conv, error: convErr } = await supabase
        .from("conversations")
        .select("id, participants, campaign_id, created_at")
        .eq("id", conversation_id)
        .maybeSingle()
      if (convErr) return NextResponse.json({ error: convErr.message }, { status: 400 })
      if (!conv || !Array.isArray(conv.participants) || !conv.participants.includes(user.id)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      // Find the other participant (brand or creator)
      const otherId = conv.participants.find((pid: string) => pid !== user.id) as string | undefined
      let otherProfile: any = null
      if (otherId) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("id, name, username, type")
          .eq("id", otherId)
          .maybeSingle()
        otherProfile = prof ?? null
      }

      let campaign: any = null
      if (conv.campaign_id) {
        const { data: camp } = await supabase
          .from("campaigns")
          .select("id, title")
          .eq("id", conv.campaign_id)
          .maybeSingle()
        campaign = camp ?? null
      }

      return NextResponse.json({ conversation: conv, other_profile: otherProfile, campaign })
    }

    // Else, list conversations for current user (limited for performance)
    const { data, error } = await supabase
      .from("conversations")
      .select("id, participants, campaign_id, created_at")
      .contains("participants", [user.id])
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ conversations: data ?? [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}
