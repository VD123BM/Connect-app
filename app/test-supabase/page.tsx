"use client"

import { useEffect } from "react"

export default function TestSupabasePage() {
  useEffect(() => {
    window.location.replace("/")
  }, [])
  return null
}
