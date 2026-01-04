import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
// Use server (anon/session) client so no service role key is required

function getClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {},
        remove() {},
      },
    }
  )
}

// Public campaigns visible to all creators
// GET: list all non-draft campaigns (optionally filter by status)
export async function GET() {
  try {
    const supabase = getClient()
    const { data, error } = await supabase
      .from("campaigns")
      .select("id, title, status, budget, applications, deadline, description, created_at, brand_id")
      .neq("status", "Draft")
      .order("created_at", { ascending: false })

    if (error) {
      // Avoid breaking the UI if RLS blocks; return empty array
      return NextResponse.json({ campaigns: [] })
    }
    return NextResponse.json({ campaigns: data ?? [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}
