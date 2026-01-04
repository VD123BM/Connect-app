import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabaseServer"

// GET /api/creators -> list all registered creators from profiles
export async function GET() {
  try {
    const supabase = getSupabaseServer()
    // RLS should allow listing creators publicly; if blocked, return empty array to avoid UI break
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, username, bio, avatar_url, location, type, updated_at")
      .eq("type", "creator")
      .order("updated_at", { ascending: false })

    if (error) return NextResponse.json({ creators: [] })

    // Map to a shape the UI can use easily
    const creators = (data ?? []).map((p) => ({
      id: p.id,
      name: p.name ?? p.username ?? "Creator",
      username: p.username ?? "",
      avatar: p.avatar_url ?? "",
      location: p.location ?? "",
      followers: "-",
      engagement: "-",
      rating: 0,
      categories: [],
      bio: p.bio ?? "",
      rates: { min: 0, max: 0 },
    }))

    return NextResponse.json({ creators })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}
