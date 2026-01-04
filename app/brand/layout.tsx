import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getSupabaseServer } from "@/lib/supabaseServer"

export default async function BrandLayout({ children }: { children: ReactNode }) {
  const supabase = getSupabaseServer()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  // Enforce role: must be brand
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/")
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("type")
    .eq("id", user.id)
    .maybeSingle()
  if (!profile || profile.type !== "brand") {
    redirect("/")
  }

  return <>{children}</>
}
