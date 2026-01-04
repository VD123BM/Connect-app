"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, Zap, MessageCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseBrowser } from "@/lib/supabaseBrowser"

export const dynamic = "force-dynamic"

/* ---------------- Wrapper (Suspense-safe) ---------------- */

function HomeWithSearchParams() {
  const searchParams = useSearchParams()
  return <HomeClient searchParams={searchParams} />
}

/* ---------------- Main Client Component ---------------- */

function HomeClient({
  searchParams,
}: {
  searchParams: ReturnType<typeof useSearchParams>
}) {
  const [loginType, setLoginType] = useState<"creator" | "brand">("creator")
  const [formData, setFormData] = useState({
    creator: { email: "", password: "" },
    brand: { email: "", password: "" },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()

  useEffect(() => {
    const registered = searchParams.get("registered")
    if (registered === "creator" || registered === "brand") {
      setSuccess(
        `${registered === "creator" ? "Creator" : "Brand"} account created successfully. You can sign in now.`
      )
    } else {
      setSuccess("")
    }
  }, [searchParams])

  const handleInputChange = (
    type: "creator" | "brand",
    field: "email" | "password",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }))
    setError("")
  }

  const validateForm = (type: "creator" | "brand") => {
    const { email, password } = formData[type]
    if (!email || !password) {
      setError("Please fill in all fields")
      return false
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    return true
  }

  const handleLogin = async (type: "creator" | "brand") => {
    if (!validateForm(type)) return

    setIsLoading(true)
    setError("")

    try {
      const supabase = getSupabaseBrowser()
      const { email, password } = formData[type]

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      try {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type }),
        })
      } catch {}

      window.location.href =
        type === "creator" ? "/creator/dashboard" : "/brand/dashboard"
    } catch (err: any) {
      setError(String(err?.message || "Login failed. Please try again."))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = (type: "creator" | "brand") => {
    router.push(type === "creator" ? "/signup/creator" : "/signup/brand")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-3 md:px-6 py-3 md:py-4 flex justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="h-5 w-5 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-black">Connect</h1>
          </div>
          <Badge variant="secondary">Beta</Badge>
        </div>
      </header>

      <main className="container mx-auto px-3 md:px-6 py-6 md:py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif font-bold">
              Join Connect
            </CardTitle>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs
              value={loginType}
              onValueChange={(v) => setLoginType(v as any)}
            >
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="creator">
                  <Users className="h-4 w-4 mr-2" /> Creator
                </TabsTrigger>
                <TabsTrigger value="brand">
                  <Briefcase className="h-4 w-4 mr-2" /> Brand
                </TabsTrigger>
              </TabsList>

              {/* Creator */}
              <TabsContent value="creator" className="space-y-4">
                <Label>Email</Label>
                <Input
                  value={formData.creator.email}
                  onChange={(e) =>
                    handleInputChange("creator", "email", e.target.value)
                  }
                />
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.creator.password}
                  onChange={(e) =>
                    handleInputChange("creator", "password", e.target.value)
                  }
                />
                <Button
                  className="w-full"
                  onClick={() => handleLogin("creator")}
                  disabled={isLoading}
                >
                  Sign In as Creator
                </Button>
              </TabsContent>

              {/* Brand */}
              <TabsContent value="brand" className="space-y-4">
                <Label>Email</Label>
                <Input
                  value={formData.brand.email}
                  onChange={(e) =>
                    handleInputChange("brand", "email", e.target.value)
                  }
                />
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.brand.password}
                  onChange={(e) =>
                    handleInputChange("brand", "password", e.target.value)
                  }
                />
                <Button
                  className="w-full"
                  onClick={() => handleLogin("brand")}
                  disabled={isLoading}
                >
                  Sign In as Brand
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

/* ---------------- Page ---------------- */

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeWithSearchParams />
    </Suspense>
  )
}
