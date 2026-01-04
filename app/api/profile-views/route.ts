import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabaseServer"

// POST: record a profile view
// Body: { viewed_id: string }
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { viewed_id } = (await req.json()) as { viewed_id?: string }
    if (!viewed_id) return NextResponse.json({ error: "viewed_id is required" }, { status: 400 })
    if (viewed_id === user.id) return NextResponse.json({ ok: true })

    const payload = { viewer_id: user.id, viewed_id }
    const { error } = await supabase.from("profile_views").insert(payload)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}

// GET: for creators to see counts or list
// /api/profile-views?aggregate=count | recent=true
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const aggregate = searchParams.get("aggregate")
    const recent = searchParams.get("recent")

    if (aggregate === "count") {
      const { count, error } = await supabase
        .from("profile_views")
        .select("id", { count: "exact", head: true })
        .eq("viewed_id", user.id)
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ count: count ?? 0 })
    }

    if (recent === "true") {
      const { data, error } = await supabase
        .from("profile_views")
        .select("id, viewer_id, created_at")
        .eq("viewed_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ views: data ?? [] })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}
