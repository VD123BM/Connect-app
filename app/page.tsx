"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Briefcase,
  Zap,
  MessageCircle,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Github,
  Mail,
} from "lucide-react"
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
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,theme(colors.secondary)/20,transparent_60%),radial-gradient(1000px_500px_at_110%_10%,theme(colors.primary)/20,transparent_60%)]">
      {/* Navbar */}
      <header className="sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between rounded-b-xl border border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-accent/90 ring-1 ring-accent/40 flex items-center justify-center shadow">
              <Zap className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-serif font-extrabold tracking-tight">Connect</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Secure by Supabase
            </div>
            <Badge variant="secondary">Beta</Badge>
          </div>
        </div>
      </header>

      {/* Main grid */}
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left: Marketing panel */}
          <section className="relative hidden md:flex flex-col justify-center rounded-2xl border border-border bg-card/60 p-8 overflow-hidden shadow-sm">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-gradient-to-tr from-secondary/25 to-primary/25 blur-3xl" />
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-sm w-max">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Built for creators & brands
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-extrabold tracking-tight mb-3">
              Collaborate smarter.
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Manage deals, chat securely, and grow your partnerships with a modern workspace designed for both creators and brands.
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Users className="mt-0.5 h-4 w-4 text-primary" />
                <span><b>Creator-first</b> profiles and proposals.</span>
              </li>
              <li className="flex items-start gap-3">
                <Briefcase className="mt-0.5 h-4 w-4 text-primary" />
                <span><b>Brand pipelines</b> to track sponsorships.</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 text-primary" />
                <span><b>Fast messaging</b> with rich context.</span>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full bg-primary/20 ring-2 ring-background" />
                <div className="h-7 w-7 rounded-full bg-secondary/20 ring-2 ring-background" />
                <div className="h-7 w-7 rounded-full bg-foreground/10 ring-2 ring-background" />
              </div>
              Trusted by early adopters
            </div>
          </section>

          {/* Right: Auth card */}
          <section className="flex items-center justify-center">
            <Card className="w-full max-w-md rounded-2xl border border-border/80 bg-background/80 shadow-xl backdrop-blur">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-serif font-bold">Join Connect</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Welcome back. Choose your role to continue.</p>
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

                <Tabs value={loginType} onValueChange={(v) => setLoginType(v as any)}>
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
                    <div>
                      <Label>Email</Label>
                      <Input
                        placeholder="you@studio.dev"
                        value={formData.creator.email}
                        onChange={(e) => handleInputChange("creator", "email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={formData.creator.password}
                        onChange={(e) => handleInputChange("creator", "password", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>By continuing you agree to our terms.</span>
                      <a className="text-primary hover:underline" href="#">Forgot password?</a>
                    </div>
                    <Button className="w-full group" onClick={() => handleLogin("creator")} disabled={isLoading}>
                      <span className="mr-1">Sign In as Creator</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                    <div className="relative text-center">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border" />
                      <span className="relative bg-background px-2 text-[10px] text-muted-foreground">OR CONTINUE WITH</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button type="button" variant="outline" className="w-full">
                        <Mail className="h-4 w-4 mr-2" /> Email Link
                      </Button>
                      <Button type="button" variant="outline" className="w-full">
                        <Github className="h-4 w-4 mr-2" /> GitHub
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Brand */}
                  <TabsContent value="brand" className="space-y-4">
                    <div>
                      <Label>Email</Label>
                      <Input
                        placeholder="you@brand.com"
                        value={formData.brand.email}
                        onChange={(e) => handleInputChange("brand", "email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={formData.brand.password}
                        onChange={(e) => handleInputChange("brand", "password", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>By continuing you agree to our terms.</span>
                      <a className="text-primary hover:underline" href="#">Need an account?</a>
                    </div>
                    <Button className="w-full group" onClick={() => handleLogin("brand")} disabled={isLoading}>
                      <span className="mr-1">Sign In as Brand</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                    <div className="relative text-center">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border" />
                      <span className="relative bg-background px-2 text-[10px] text-muted-foreground">OR CONTINUE WITH</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button type="button" variant="outline" className="w-full">
                        <Mail className="h-4 w-4 mr-2" /> Email Link
                      </Button>
                      <Button type="button" variant="outline" className="w-full">
                        <Github className="h-4 w-4 mr-2" /> GitHub
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                  New here? <a className="text-primary hover:underline" onClick={() => handleSignup(loginType)}>Create an account</a>
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
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
