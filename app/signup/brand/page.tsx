"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabaseBrowser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function BrandSignupPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [company, setCompany] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error

      const user = data.user
      if (user?.email) {
        try {
          await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              type: "brand",
              name: company,
              username,
              bio,
            }),
          })
        } catch (e) {
          // non-critical upsert failure can be retried post-login
        }
      }

      router.push("/?registered=brand")
    } catch (e: any) {
      setError(e?.message ?? "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create Brand Account</CardTitle>
          <CardDescription>Register your brand to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." />
          </div>
          <div>
            <Label htmlFor="username">Handle</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@acme" />
          </div>
          <div>
            <Label htmlFor="bio">About</Label>
            <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What does your brand do?" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="brand@example.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button className="w-full" onClick={handleSignup} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
