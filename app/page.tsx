"use client"

export const dynamic = "force-dynamic"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, Zap, MessageCircle, Star, TrendingUp, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseBrowser } from "@/lib/supabaseBrowser"

function HomeClient() {
  const [loginType, setLoginType] = useState<"creator" | "brand">("creator")
  const [formData, setFormData] = useState({
    creator: { email: "", password: "" },
    brand: { email: "", password: "" },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const registered = searchParams.get("registered")
    if (registered === "creator" || registered === "brand") {
      setSuccess(`${registered === "creator" ? "Creator" : "Brand"} account created successfully. You can sign in now.`)
    } else {
      setSuccess("")
    }

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeClient />
    </Suspense>
  )
}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])
  const router = useRouter()

  const handleInputChange = (type: "creator" | "brand", field: "email" | "password", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }))
    setError("") // Clear error when user types
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
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      try {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type }),
        })
      } catch {}

      // Force a full reload so server layouts can see the auth cookie immediately
      if (typeof window !== "undefined") {
        window.location.href = type === "creator" ? "/creator/dashboard" : "/brand/dashboard"
      } else {
        router.push(type === "creator" ? "/creator/dashboard" : "/brand/dashboard")
      }
    } catch (err: any) {
      const msg = String(err?.message || "Login failed. Please try again.")
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = (type: "creator" | "brand") => {
    router.push(type === "creator" ? "/signup/creator" : "/signup/brand")
  }

  return (
    <Suspense fallback={null}>
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <Zap className="h-5 w-5 text-accent-foreground" />
              </div>
              <h1 className="text-2xl font-serif font-black text-foreground">Connect</h1>
            </div>
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-4">
            Where Creators Meet
            <span className="text-accent"> Brands</span>
          </h2>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">10K+</div>
              <div className="text-sm text-muted-foreground">Active Creators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">500+</div>
              <div className="text-sm text-muted-foreground">Partner Brands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">$2M+</div>
              <div className="text-sm text-muted-foreground">Deals Closed</div>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif font-bold">Join Connect</CardTitle>
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

              <Tabs value={loginType} onValueChange={(value) => setLoginType(value as "creator" | "brand")}>
                <TabsList className="mb-6 w-full overflow-x-auto whitespace-nowrap no-scrollbar grid grid-cols-2 sm:grid-cols-2">
                  <TabsTrigger value="creator" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Creator</span>
                  </TabsTrigger>
                  <TabsTrigger value="brand" className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Brand</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="creator" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="creator-email">Email</Label>
                      <Input
                        id="creator-email"
                        type="email"
                        placeholder="creator@example.com"
                        value={formData.creator.email}
                        onChange={(e) => handleInputChange("creator", "email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="creator-password">Password</Label>
                      <Input
                        id="creator-password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.creator.password}
                        onChange={(e) => handleInputChange("creator", "password", e.target.value)}
                      />
                    </div>
                    <Button className="w-full" size="lg" onClick={() => handleLogin("creator")} disabled={isLoading}>
                      {isLoading ? "Signing In..." : "Sign In as Creator"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push("/signup/creator")}
                      disabled={isLoading}
                    >
                      Create Creator Account
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="brand" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="brand-email">Business Email</Label>
                      <Input
                        id="brand-email"
                        type="email"
                        placeholder="marketing@company.com"
                        value={formData.brand.email}
                        onChange={(e) => handleInputChange("brand", "email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand-password">Password</Label>
                      <Input
                        id="brand-password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.brand.password}
                        onChange={(e) => handleInputChange("brand", "password", e.target.value)}
                      />
                    </div>
                    <Button className="w-full" size="lg" onClick={() => handleLogin("brand")} disabled={isLoading}>
                      {isLoading ? "Signing In..." : "Sign In as Brand"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleSignup("brand")}
                      disabled={isLoading}
                    >
                      Create Brand Account
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="text-center border-0 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="font-serif font-bold">Direct Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect directly with creators and brands without intermediaries. Build authentic partnerships.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="font-serif font-bold">In-App Messaging</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Seamless communication tools to discuss collaboration details and negotiate deals.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="font-serif font-bold">Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                AI-powered recommendations to find the perfect creator-brand matches based on audience and goals.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </Suspense>
  )
}
