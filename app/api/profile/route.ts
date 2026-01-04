import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// Upsert profile into 'profiles' table.
// Expected JSON body: { email, type, name, username, bio, avatar_url, location, website }

// Fetch the authenticated user's profile
export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, type, name, username, bio, avatar_url, location, website, updated_at")
      .eq("id", user.id)
      .limit(1)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ profile: data ?? null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}
export async function POST(req: NextRequest) {
  try {
    // Create an authenticated Supabase client using cookies
    const cookieStore = cookies()
    const supabase = createServerClient(
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

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const body = await req.json()
    const {
      type,
      name,
      username,
      bio,
      avatar_url,
      location,
      website,
    }: {
      type?: "creator" | "brand"
      name?: string
      username?: string
      bio?: string
      avatar_url?: string
      location?: string
      website?: string
    } = body

    const payload = {
      id: user.id,
      type: type ?? null,
      name: name ?? null,
      username: username ?? null,
      bio: bio ?? null,
      avatar_url: avatar_url ?? null,
      location: location ?? null,
      website: website ?? null,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" })
      .select()
      .limit(1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, profile: data?.[0] ?? null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}
