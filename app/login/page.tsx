"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabaseBrowser"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowser()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const user = data.user
    if (user?.email) {
      try {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        })
      } catch {}
    }

    router.push("/creator/dashboard")
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow bg-white">
      <h2 className="text-xl font-bold text-center mb-4">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button onClick={handleLogin} disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  )
}
