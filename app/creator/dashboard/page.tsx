"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Settings, TrendingUp, DollarSign, MessageCircle, Calendar, Star, Upload, Eye } from "lucide-react"
import { getSupabaseBrowser } from "@/lib/supabaseBrowser"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function CreatorDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("deals")
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [website, setWebsite] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  type Campaign = {
    id: string
    title: string
    status: string | null
    budget: number | null
    applications: number | null
    deadline: string | null
    description: string | null
    created_at: string
    brand_id: string
  }

  const applyToCampaign = async (camp: Campaign) => {
    if (applyingId === camp.id) return
    setApplyingId(camp.id)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: camp.id }),
      })
      const json = await res.json()
      if (res.ok && json?.application) {
        setMyApplications((prev) => [json.application, ...prev])
      } else {
        toast({ title: "Could not apply", description: json?.error || `Status ${res.status}` })
      }
    } catch {
      toast({ title: "Network error", description: "Please try again." })
    } finally {
      setApplyingId(null)
    }
  }
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loadingCampaigns, setLoadingCampaigns] = useState<boolean>(true)
  const [campaignsError, setCampaignsError] = useState<string | null>(null)

  // Applications state (creator side)
  type Application = {
    id: string
    campaign_id: string
    creator_id: string
    status: string
    message: string | null
    created_at: string
  }
  const [myApplications, setMyApplications] = useState<Application[]>([])
  const [applyingId, setApplyingId] = useState<string | null>(null)

  // Conversations state for Messages tab
  type Conversation = {
    id: string
    participants: string[]
    campaign_id: string | null
    created_at: string
  }
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingConversations, setLoadingConversations] = useState<boolean>(false)
  const [conversationsError, setConversationsError] = useState<string | null>(null)

  // Inline chat state within Messages tab
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  type ChatMessage = {
    id: string
    conversation_id: string
    sender_id: string
    content: string
    created_at: string
  }
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatText, setChatText] = useState("")
  const [loadingChat, setLoadingChat] = useState(false)
  const chatListRef = useRef<HTMLDivElement>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Brands discovery state
  type Brand = {
    id: string
    name: string | null
    username: string | null
    avatar_url: string | null
    bio: string | null
  }
  const [brands, setBrands] = useState<Brand[]>([])
  const [loadingBrands, setLoadingBrands] = useState(false)
  const [brandsError, setBrandsError] = useState<string | null>(null)
  const loadBrands = async () => {
    setLoadingBrands(true)
    setBrandsError(null)
    try {
      const supabase = getSupabaseBrowser()
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, username, avatar_url, bio, type")
        .eq("type", "brand")
        .order("name", { ascending: true })
      if (error) throw error
      const mapped: Brand[] = (data || []).map((p: any) => {
        const name = (p.name ?? "").trim()
        const username = (p.username ?? "").trim()
        return {
          id: p.id,
          name: name || username || null,
          username,
          avatar_url: p.avatar_url,
          bio: p.bio,
        }
      })
      setBrands(mapped)
    } catch (e: any) {
      setBrandsError(e?.message ?? "Unexpected error")
      setBrands([])
    } finally {
      setLoadingBrands(false)
    }
  }
  useEffect(() => {
    if (activeTab === "brands") {
      loadBrands()
    }
  }, [activeTab])
  const messageBrandDirect = async (brandId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ other_user_id: brandId }),
      })
      const json = await res.json()
      if (res.ok && json?.conversation?.id) {
        setActiveTab("messages")
        setSelectedConversationId(json.conversation.id)
        loadConversations()
      }
    } catch {}
  }

  // Modal chat state (opens directly from Deals -> Message Brand)
  const [chatOpen, setChatOpen] = useState(false)
  const [modalConversationId, setModalConversationId] = useState<string | null>(null)
  const [modalMessages, setModalMessages] = useState<ChatMessage[]>([])
  const [modalText, setModalText] = useState("")
  const [loadingModalChat, setLoadingModalChat] = useState(false)
  const modalListRef = useRef<HTMLDivElement>(null)
  type ModalProfile = { id: string; name: string | null; username: string | null; type: string | null } | null
  type ModalCampaign = { id: string; title: string | null } | null
  const [modalOtherProfile, setModalOtherProfile] = useState<ModalProfile>(null)
  const [modalCampaign, setModalCampaign] = useState<ModalCampaign>(null)
  const [loadingModalHeader, setLoadingModalHeader] = useState(false)

  // Empty defaults (no mock data)
  const stats = {
    totalEarnings: "$0",
    activeDeals: 0,
    profileViews: "0",
    messages: 0,
    completionRate: 0,
    rating: 0,
  }

  const recentDeals: Array<{
    id: number
    brand: string
    title: string
    status: string
    amount: string
    deadline: string
  }> = []

  // Profile views count
  const [profileViewsCount, setProfileViewsCount] = useState<string>("0")
  useEffect(() => {
    const loadViews = async () => {
      try {
        const res = await fetch("/api/profile-views?aggregate=count", { cache: "no-store" })
        const json = await res.json()
        if (res.ok && typeof json.count === "number") {
          setProfileViewsCount(String(json.count))
        }
      } catch {}
    }
    loadViews()
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/profile", { method: "GET" })
        if (!res.ok) return
        const json = await res.json()
        const p = json?.profile
        if (p) {
          if (p.name) setName(p.name)
          if (p.username) setUsername(p.username)
          if (p.bio) setBio(p.bio)
          if (p.location) setLocation(p.location)
          if (p.website) setWebsite(p.website)
        }
      } catch {}
    }
    load()
  }, [])

  // Resolve current user id for aligning chat bubbles
  useEffect(() => {
    const resolveUser = async () => {
      try {
        const supabase = getSupabaseBrowser()
        const { data } = await supabase.auth.getUser()
        setCurrentUserId(data.user?.id ?? null)
      } catch {}
    }
    resolveUser()
  }, [])

  // Load public campaigns (extracted so we can call on demand)
  const loadCampaigns = async () => {
    setLoadingCampaigns(true)
    setCampaignsError(null)
    try {
      const res = await fetch("/api/campaigns/public", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) {
        setCampaignsError(json?.error ?? "Failed to load campaigns")
        setCampaigns([])
      } else {
        const arr = Array.isArray(json.campaigns) ? json.campaigns : []
        setCampaigns(arr)
        // Fallback: if API returns empty, query Supabase directly from the browser
        if (arr.length === 0) {
          try {
            const supabase = getSupabaseBrowser()
            const { data, error } = await supabase
              .from("campaigns")
              .select("id, title, status, budget, applications, deadline, description, created_at, brand_id")
              .neq("status", "Draft")
              .order("created_at", { ascending: false })
            if (!error && Array.isArray(data) && data.length > 0) {
              setCampaigns(data as any)
            }
          } catch {}
        }
      }
    } catch (e: any) {
      setCampaignsError(e?.message ?? "Unexpected error")
      setCampaigns([])
    } finally {
      setLoadingCampaigns(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadCampaigns()
  }, [])

  // Refetch whenever Deals tab is opened
  useEffect(() => {
    if (activeTab === "deals") {
      loadCampaigns()
      ;(async () => {
        try {
          const res = await fetch("/api/applications?mine=true", { cache: "no-store" })
          const json = await res.json()
          if (res.ok) setMyApplications(Array.isArray(json.applications) ? json.applications : [])
        } catch {}
      })()
    }
  }, [activeTab])

  // Accept deep links via URL to open Messages tab and a conversation
  useEffect(() => {
    const t = searchParams.get("tab")
    if (t && (t === "messages" || t === "deals" || t === "overview" || t === "profile")) {
      setActiveTab(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    const act = searchParams.get("tab")
    if (activeTab !== "messages" && act !== "messages") return
    const conversationId = searchParams.get("conversation")
    const brandId = searchParams.get("brand_id")
    const campaignId = searchParams.get("campaign_id")
    const open = async () => {
      await loadConversations()
      if (conversationId) {
        setSelectedConversationId(conversationId)
        return
      }
      if (brandId && campaignId) {
        // Try to create or fetch, then select
        try {
          const loadingToast = toast({ title: "Starting chat…", description: "Creating conversation" })
          const res = await fetch("/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ brand_id: brandId, campaign_id: campaignId }),
          })
          const json = await res.json()
          if (res.ok && json?.conversation?.id) {
            setSelectedConversationId(json.conversation.id)
            // update URL to carry conversation id for refresh safety
            router.replace(`/creator/dashboard?tab=messages&conversation=${json.conversation.id}`)
            loadingToast.update({ id: loadingToast.id, title: "Chat ready", description: "You can start typing now." })
          }
        } catch {}
      }
    }
    open()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchParams])

  // Load conversations (creator is a participant)
  const loadConversations = async () => {
    setLoadingConversations(true)
    setConversationsError(null)
    try {
      const res = await fetch("/api/conversations", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) {
        setConversationsError(json?.error ?? "Failed to load conversations")
        setConversations([])
        return [] as Conversation[]
      } else {
        const list = Array.isArray(json.conversations) ? json.conversations : []
        setConversations(list)
        return list as Conversation[]
      }
    } catch (e: any) {
      setConversationsError(e?.message ?? "Unexpected error")
      setConversations([])
      return [] as Conversation[]
    } finally {
      setLoadingConversations(false)
    }
  }

  // Fetch conversations when Messages tab opens
  useEffect(() => {
    if (activeTab === "messages") {
      loadConversations()
    }
  }, [activeTab])

  const scrollChatToBottom = () => {
    requestAnimationFrame(() => {
      chatListRef.current?.scrollTo({ top: chatListRef.current.scrollHeight, behavior: "smooth" })
    })
  }

  const loadChatMessages = async (conversationId: string) => {
    setLoadingChat(true)
    try {
      const res = await fetch(`/api/messages?conversation_id=${conversationId}`, { cache: "no-store" })
      const json = await res.json()
      if (res.ok) setChatMessages(json.messages ?? [])
    } finally {
      setLoadingChat(false)
      scrollChatToBottom()
    }
  }

  // Modal chat helpers
  const scrollModalToBottom = () => {
    requestAnimationFrame(() => {
      modalListRef.current?.scrollTo({ top: modalListRef.current.scrollHeight, behavior: "smooth" })
    })
  }

  const loadModalMessages = async (conversationId: string) => {
    setLoadingModalChat(true)
    try {
      const res = await fetch(`/api/messages?conversation_id=${conversationId}`, { cache: "no-store" })
      const json = await res.json()
      if (res.ok) setModalMessages(json.messages ?? [])
    } finally {
      setLoadingModalChat(false)
      scrollModalToBottom()
    }
  }

  const loadModalHeader = async (conversationId: string) => {
    setLoadingModalHeader(true)
    try {
      const res = await fetch(`/api/conversations?conversation_id=${conversationId}`, { cache: "no-store" })
      const json = await res.json()
      if (res.ok) {
        setModalOtherProfile(json.other_profile ?? null)
        setModalCampaign(json.campaign ?? null)
      }
    } finally {
      setLoadingModalHeader(false)
    }
  }

  // Poll chat when a conversation is selected
  useEffect(() => {
    if (!selectedConversationId) return
    loadChatMessages(selectedConversationId)
    const t = setInterval(() => loadChatMessages(selectedConversationId), 3000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId])

  // Poll modal chat when modal is open
  useEffect(() => {
    if (!chatOpen || !modalConversationId) return
    loadModalMessages(modalConversationId)
    loadModalHeader(modalConversationId)
    const t = setInterval(() => loadModalMessages(modalConversationId), 3000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatOpen, modalConversationId])

  const sendChat = async () => {
    if (!selectedConversationId) return
    const content = chatText.trim()
    if (!content) return
    setChatText("")
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation_id: selectedConversationId, content }),
    })
    if (res.ok) {
      loadChatMessages(selectedConversationId)
    }
  }

  const sendModalChat = async () => {
    if (!modalConversationId) return
    const content = modalText.trim()
    if (!content) return
    setModalText("")
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation_id: modalConversationId, content }),
    })
    if (res.ok) {
      loadModalMessages(modalConversationId)
    }
  }

  const [creatingConversation, setCreatingConversation] = useState<string | null>(null)
  const messageBrand = async (camp: Campaign) => {
    if (creatingConversation === camp.id) return
    setCreatingConversation(camp.id)
    try {
      const loadingToast = toast({ title: "Starting chat…", description: "Creating conversation" })
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_id: camp.brand_id, campaign_id: camp.id }),
      })
      const json = await res.json()
      if (res.ok && json?.conversation?.id) {
        // Open modal directly for this conversation
        setModalConversationId(json.conversation.id)
        setChatOpen(true)
        // Preload messages and header
        loadModalMessages(json.conversation.id)
        loadModalHeader(json.conversation.id)
        loadingToast.update({ id: loadingToast.id, title: "Chat ready", description: "You can start typing now." })
        // Also refresh the conversations list in background (optional)
        loadConversations()
      } else {
        // Surface server error to user
        toast({ title: "Couldn't start chat", description: json?.error ?? `Status ${res.status}` })
        // If API didn't return conversation, refresh list and try to match by campaign
        const list = await loadConversations()
        const conv = list.find((x) => x.campaign_id === camp.id)
        if (conv) {
          setModalConversationId(conv.id)
          setChatOpen(true)
          loadModalMessages(conv.id)
          loadModalHeader(conv.id)
        }
      }
    } catch {
      toast({ title: "Network error", description: "Could not start chat. Please try again." })
    } finally {
      setCreatingConversation(null)
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    setSaveMsg(null)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, bio, location, website, type: "creator" }),
      })
      const json = await res.json()
      if (!res.ok) {
        setSaveMsg(`Error: ${json?.error ?? "Failed to save profile"}`)
      } else {
        setSaveMsg("Profile saved")
      }
    } catch (e: any) {
      setSaveMsg(e?.message ?? "Unexpected error")
    } finally {
      setSaving(false)
    }
  }

  const messages: Array<{ id: number; brand: string; message: string; time: string; unread: boolean }> = []

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowser()
      await supabase.auth.signOut()
    } catch {
      // ignore
    } finally {
      window.location.href = "/"
    }
  }

  return (
    <>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold">Creator Dashboard</h1>
              <p className="text-muted-foreground">Manage your profile and collaborations</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 md:px-6 py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full overflow-x-auto no-scrollbar flex gap-2">
            <TabsTrigger className="shrink-0" value="overview">Overview</TabsTrigger>
            <TabsTrigger className="shrink-0" value="deals">Deals</TabsTrigger>
            <TabsTrigger className="shrink-0" value="brands">Brands</TabsTrigger>
            <TabsTrigger className="shrink-0" value="messages">Messages</TabsTrigger>
            <TabsTrigger className="shrink-0" value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalEarnings}</div>
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.activeDeals}</div>
                  <div className="text-sm text-muted-foreground">Active Deals</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{profileViewsCount}</div>
                  <div className="text-sm text-muted-foreground">Profile Views</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageCircle className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.messages}</div>
                  <div className="text-sm text-muted-foreground">New Messages</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.rating}</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Deals</CardTitle>
                  <CardDescription>Your latest collaboration projects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium">{deal.title}</h4>
                        <p className="text-sm text-muted-foreground">{deal.brand}</p>
                        <p className="text-xs text-muted-foreground">Due: {deal.deadline}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{deal.amount}</div>
                        <Badge
                          variant={
                            deal.status === "Completed"
                              ? "default"
                              : deal.status === "In Progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {deal.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>Latest conversations with brands</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{msg.brand.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{msg.brand}</h4>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                      </div>
                      {msg.unread && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="brands" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>Brands</CardTitle>
                    <CardDescription>Discover brands and start a conversation</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {!loadingBrands && !brandsError && (
                      <Badge variant="secondary">{brands.length} brands</Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={loadBrands}>Refresh</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingBrands && (
                  <div className="text-sm text-muted-foreground">Loading brands…</div>
                )}
                {brandsError && (
                  <div className="text-sm text-destructive">{brandsError}</div>
                )}
                {!loadingBrands && !brandsError && brands.length === 0 && (
                  <div className="text-sm text-muted-foreground">No brands found.</div>
                )}
                <div className="space-y-3">
                  {brands.map((b) => (
                    <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={b.avatar_url || "/placeholder.svg"}
                            alt={(b.name && b.name.trim()) || (b.username && b.username.trim()) || (b.id ? b.id.slice(0, 8) : "Brand")}
                          />
                          <AvatarFallback>
                            {(((b.name && b.name.trim()) || (b.username && b.username.trim()) || (b.id ? b.id.slice(0, 2) : "B")) as string)
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{(b.name && b.name.trim()) || (b.username && b.username.trim()) || (b.id ? b.id.slice(0, 8) : "Brand")}</div>
                          {b.username && <div className="text-xs text-muted-foreground truncate">@{b.username}</div>}
                          {b.bio && <div className="text-sm text-muted-foreground truncate">{b.bio}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:justify-end">
                        <Button size="sm" onClick={() => messageBrandDirect(b.id)}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>All Deals</CardTitle>
                    <CardDescription>All active brand campaigns you can apply to</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {!loadingCampaigns && !campaignsError && (
                      <Badge variant="secondary">{campaigns.length} campaigns</Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={loadCampaigns}>
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingCampaigns && (
                  <div className="text-sm text-muted-foreground">Loading campaigns…</div>
                )}
                {campaignsError && (
                  <div className="text-sm text-destructive">{campaignsError}</div>
                )}
                {!loadingCampaigns && !campaignsError && campaigns.length === 0 && (
                  <div className="text-sm text-muted-foreground">No campaigns yet.</div>
                )}
                <div className="space-y-4">
                  {campaigns.map((c) => (
                    <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{c.title}</h4>
                        <p className="text-sm text-muted-foreground">Status: {c.status ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">Deadline: {c.deadline ?? "—"}</p>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 sm:flex-nowrap flex-wrap">
                        <div className="text-right min-w-[110px]">
                          <div className="font-bold text-primary">${"" + (c.budget ?? 0)}</div>
                          <Badge variant="outline">Applications: {c.applications ?? 0}</Badge>
                        </div>
                        {/* Apply button */}
                        {(() => {
                          const mine = myApplications.find((a) => a.campaign_id === c.id)
                          return mine ? (
                            <Badge variant="secondary">{mine.status}</Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => applyToCampaign(c)}
                              disabled={applyingId === c.id}
                            >
                              {applyingId === c.id ? "Applying…" : "Apply"}
                            </Button>
                          )
                        })()}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => messageBrand(c)}
                          disabled={creatingConversation === c.id}
                        >
                          {creatingConversation === c.id ? "Starting…" : "Message Brand"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>Messages</CardTitle>
                      <CardDescription>Your conversations with brands</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {!loadingConversations && !conversationsError && (
                        <Badge variant="secondary">{conversations.length} conversations</Badge>
                      )}
                      <Button variant="outline" size="sm" onClick={loadConversations}>Refresh</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingConversations && (
                    <div className="text-sm text-muted-foreground">Loading conversations…</div>
                  )}
                  {conversationsError && (
                    <div className="text-sm text-destructive">{conversationsError}</div>
                  )}
                  {!loadingConversations && !conversationsError && conversations.length === 0 && (
                    <div className="text-sm text-muted-foreground">No conversations yet.</div>
                  )}
                  <div className="space-y-2">
                    {conversations.map((c) => (
                      <button
                        key={c.id}
                        className={`w-full text-left p-3 rounded-lg border hover:bg-muted/50 ${selectedConversationId === c.id ? "bg-muted/50" : ""}`}
                        onClick={() => setSelectedConversationId(c.id)}
                      >
                        <div className="font-medium">Conversation</div>
                        <div className="text-xs text-muted-foreground">Created: {new Date(c.created_at).toLocaleString()}</div>
                        {c.campaign_id && (
                          <div className="text-xs text-muted-foreground mt-1">Campaign: {c.campaign_id}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 p-3 md:p-4 flex flex-col min-h-[60vh]">
                {!selectedConversationId ? (
                  <div className="text-center text-muted-foreground my-auto">Select a conversation or start one from Deals.</div>
                ) : (
                  <>
                    <div ref={chatListRef} className="flex-1 overflow-y-auto space-y-3">
                      {loadingChat && <div className="text-muted-foreground text-center">Loading…</div>}
                      {!loadingChat && chatMessages.length === 0 && (
                        <div className="text-muted-foreground text-center">No messages yet. Say hi!</div>
                      )}
                      {chatMessages.map((m) => {
                        const mine = currentUserId && m.sender_id === currentUserId
                        return (
                          <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`${mine ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"} px-3 py-2 rounded-lg max-w-[75%] whitespace-pre-wrap`}
                            >
                              {m.content}
                              <div className="text-[10px] opacity-70 mt-1">{new Date(m.created_at).toLocaleTimeString()}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="sticky bottom-0 left-0 right-0 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t mt-3 p-2 md:p-3 pb-[env(safe-area-inset-bottom)]">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message"
                          value={chatText}
                          onChange={(e) => setChatText(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              sendChat()
                            }
                          }}
                        />
                        <Button onClick={sendChat}>Send</Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your creator profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/professional-woman-headshot.png" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                  {saveMsg && <span className="text-sm text-muted-foreground">{saveMsg}</span>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>

    {/* Chat modal opened directly from Deals */}
    <Dialog open={chatOpen} onOpenChange={(o) => { setChatOpen(o); if (!o) { setModalText(""); setModalMessages([]); setModalOtherProfile(null); setModalCampaign(null) } }}>
      <DialogContent className="sm:max-w-[700px] p-0">
        <div className="border-b px-4 py-3">
          {loadingModalHeader ? (
            <div className="text-sm text-muted-foreground">Loading chat info…</div>
          ) : (
            <div>
              <div className="font-semibold">
                {modalOtherProfile?.name || modalOtherProfile?.username || "Conversation"}
              </div>
              {modalCampaign?.title && (
                <div className="text-xs text-muted-foreground">Campaign: {modalCampaign.title}</div>
              )}
            </div>
          )}
        </div>
        <div className="p-4 h-[65vh] flex flex-col">
          <div ref={modalListRef} className="flex-1 overflow-y-auto space-y-3 px-2">
            {loadingModalChat && <div className="text-muted-foreground text-center">Loading…</div>}
            {!loadingModalChat && modalMessages.length === 0 && (
              <div className="text-muted-foreground text-center">No messages yet. Say hi!</div>
            )}
            {modalMessages.map((m) => {
              const mine = currentUserId && m.sender_id === currentUserId
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`${mine ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"} px-3 py-2 rounded-lg max-w-[75%] whitespace-pre-wrap`}
                  >
                    {m.content}
                    <div className="text-[10px] opacity-70 mt-1">{new Date(m.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex gap-2 px-2 pb-2">
            <Input
              placeholder="Type a message"
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendModalChat()
                }
              }}
            />
            <Button onClick={sendModalChat} disabled={!modalConversationId}>Send</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
