import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabaseServer"

// GET /api/brands -> list all registered brands from profiles
export async function GET() {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, username, bio, avatar_url, location, website, type, updated_at")
      .eq("type", "brand")
      .order("updated_at", { ascending: false })

    if (error) return NextResponse.json({ brands: [] })

    const brands = (data ?? []).map((p) => ({
      id: p.id,
      name: p.name ?? p.username ?? "Brand",
      username: p.username ?? "",
      avatar: p.avatar_url ?? "",
      location: p.location ?? "",
      website: p.website ?? "",
      bio: p.bio ?? "",
    }))

    return NextResponse.json({ brands })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}
