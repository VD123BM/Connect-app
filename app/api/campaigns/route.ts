import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// Campaigns API
// GET: list campaigns for authenticated brand user
// POST: create a new campaign for authenticated brand user

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

export async function GET() {
  try {
    const supabase = getClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { data, error } = await supabase
      .from("campaigns")
      .select("id, title, status, budget, spent, applications, deadline, reach, engagement, description, created_at")
      .eq("brand_id", user.id)
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ campaigns: data ?? [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    const body = await req.json()
    const { title, status = "Draft", budget = 0, deadline = null, description = "" } = body as {
      title?: string
      status?: string
      budget?: number
      deadline?: string | null
      description?: string
    }

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "title is required" }, { status: 400 })
    }

    

    const payload = {
      brand_id: user.id,
      title: title.trim(),
      status,
      budget,
      spent: 0,
      applications: 0,
      deadline,
      reach: null,
      engagement: null,
      description,
    }

    const { data, error } = await supabase.from("campaigns").insert(payload).select().limit(1)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ campaign: data?.[0] ?? null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}
