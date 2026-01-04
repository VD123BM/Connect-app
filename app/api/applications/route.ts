import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabaseServer"

// POST: creator applies to a campaign
// Body: { campaign_id: string, message?: string }
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { campaign_id, message } = (await req.json()) as { campaign_id?: string; message?: string }
    if (!campaign_id) return NextResponse.json({ error: "campaign_id is required" }, { status: 400 })

    // Ensure user is a creator
    const { data: prof } = await supabase.from("profiles").select("type").eq("id", user.id).maybeSingle()
    if (!prof || prof.type !== "creator") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const payload = {
      campaign_id,
      creator_id: user.id,
      message: message ?? null,
      status: "Pending",
    }

    const { data, error } = await supabase.from("applications").insert(payload).select().limit(1)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ application: data?.[0] ?? null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}

// GET: list applications
// - For brand: ?brand_all=true -> all applications to campaigns owned by the brand
// - For creator: ?mine=true -> my applications
// - Optional: ?campaign_id=... -> filter by campaign
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const brandAll = searchParams.get("brand_all") === "true"
    const mine = searchParams.get("mine") === "true"
    const campaignId = searchParams.get("campaign_id")

    if (brandAll) {
      // Fetch campaigns owned by this brand
      const { data: campRows, error: campErr } = await supabase
        .from("campaigns")
        .select("id")
        .eq("brand_id", user.id)
      if (campErr) return NextResponse.json({ error: campErr.message }, { status: 400 })
      const ids = (campRows ?? []).map((c: any) => c.id)
      if (ids.length === 0) return NextResponse.json({ applications: [] })
      const query = supabase
        .from("applications")
        .select("id, campaign_id, creator_id, status, message, created_at")
        .in("campaign_id", ids)
        .order("created_at", { ascending: false })
      const { data, error } = await query
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ applications: data ?? [] })
    }

    if (mine) {
      const { data, error } = await supabase
        .from("applications")
        .select("id, campaign_id, creator_id, status, message, created_at")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ applications: data ?? [] })
    }

    if (campaignId) {
      const { data, error } = await supabase
        .from("applications")
        .select("id, campaign_id, creator_id, status, message, created_at")
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: false })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ applications: data ?? [] })
    }

    return NextResponse.json({ applications: [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}

// PATCH: brand updates application status
// Body: { id: string, status: 'Accepted'|'Rejected'|'Shortlisted'|'Pending' }
export async function PATCH(req: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { id, status } = (await req.json()) as { id?: string; status?: string }
    if (!id || !status) return NextResponse.json({ error: "id and status are required" }, { status: 400 })

    // Verify the application belongs to a campaign owned by the brand
    const { data: app, error: appErr } = await supabase
      .from("applications")
      .select("campaign_id")
      .eq("id", id)
      .maybeSingle()
    if (appErr) return NextResponse.json({ error: appErr.message }, { status: 400 })
    if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const { data: camp, error: campErr } = await supabase
      .from("campaigns")
      .select("brand_id")
      .eq("id", app.campaign_id)
      .maybeSingle()
    if (campErr) return NextResponse.json({ error: campErr.message }, { status: 400 })
    if (!camp || camp.brand_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id)
      .select()
      .limit(1)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ application: data?.[0] ?? null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}
