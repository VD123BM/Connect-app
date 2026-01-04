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

function HomeClient() {
  const [loginType, setLoginType] = useState<"creator" | "brand">("creator")
  const [formData, setFormData] = useState({
    creator: { email: "", password: "" },
    brand: { email: "", password: "" },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()

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

  // rest of your handlers + JSX stay exactly the same
  // ...
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeClient />
    </Suspense>
  )
}
