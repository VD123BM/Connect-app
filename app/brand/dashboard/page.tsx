"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  Settings,
  TrendingUp,
  DollarSign,
  MessageCircle,
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  BarChart3,
  Target,
} from "lucide-react"
import { CreatorCard } from "@/components/creator-card"
import { getSupabaseBrowser } from "@/lib/supabaseBrowser"

export default function BrandDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  type Campaign = {
    id: string | number
    title: string
    status: string
    budget: number | string | null
    spent: number | string | null
    applications: number | null
    deadline: string | null
    reach: string | number | null
    engagement: string | number | null
    description?: string | null
  }

  // Applications state for brand
  type Application = {
    id: string
    campaign_id: string
    creator_id: string
    status: string
    message: string | null
    created_at: string
  }
  const [applications, setApplications] = useState<Application[]>([])
  const [loadingApplications, setLoadingApplications] = useState(false)
  const [applicationsError, setApplicationsError] = useState<string | null>(null)

  const loadApplications = async () => {
    setLoadingApplications(true)
    setApplicationsError(null)
    try {
      const res = await fetch("/api/applications?brand_all=true", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load applications")
      setApplications(Array.isArray(json.applications) ? json.applications : [])
    } catch (e: any) {
      setApplicationsError(e?.message ?? "Unexpected error")
      setApplications([])
    } finally {
      setLoadingApplications(false)
    }
  }

  useEffect(() => {
    if (activeTab === "applications") {
      loadApplications()
    }
  }, [activeTab])

  const updateApplicationStatus = async (app: Application, status: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: app.id, status }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to update")
      const updated = json.application
      setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    } catch (e: any) {
      setApplicationsError(e?.message ?? "Unexpected error")
    }
  }

  const recordProfileView = async (creatorId: string) => {
    try {
      await fetch("/api/profile-views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewed_id: creatorId }),
      })
    } catch {}
  }
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  // Create form state
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState("Draft")
  const [budget, setBudget] = useState<string>("")
  const [deadline, setDeadline] = useState<string>("")
  const [description, setDescription] = useState("")

  const loadCampaigns = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/campaigns")
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load campaigns")
      setCampaigns(json.campaigns || [])
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns()
  }, [])

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

  // Empty defaults (no mock data)
  const stats = {
    totalSpent: "$0",
    activeCampaigns: 0,
    totalReach: "0",
    applications: 0,
    avgEngagement: "0%",
    completedCampaigns: 0,
  }

  const handleCreate = async () => {
    if (!title.trim()) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          status,
          budget: budget ? Number(budget) : 0,
          deadline: deadline || null,
          description,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to create")
      const created = json.campaign
      setCampaigns((prev) => [created, ...prev])
      // reset form
      setTitle("")
      setStatus("Draft")
      setBudget("")
      setDeadline("")
      setDescription("")
      setActiveTab("campaigns")
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error")
    } finally {
      setCreating(false)
    }
  }

  const recentApplications: Array<{
    id: number
    creator: {
      name: string
      username: string
      avatar?: string
      followers?: string
      engagement?: string
      rating?: number
    }
    campaign: string
    appliedDate: string
    proposedRate: string
    status: string
  }> = []

  type Creator = {
    id: string
    name: string
    username: string
    avatar: string
    location: string
    followers: string
    engagement: string
    rating: number
    categories: string[]
    bio: string
    rates: { min: number; max: number }
  }
  const [creators, setCreators] = useState<Creator[]>([])
  const [loadingCreators, setLoadingCreators] = useState(false)
  const [creatorsError, setCreatorsError] = useState<string | null>(null)

  const loadCreators = async () => {
    setLoadingCreators(true)
    setCreatorsError(null)
    try {
      const res = await fetch("/api/creators", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load creators")
      setCreators(Array.isArray(json.creators) ? json.creators : [])
    } catch (e: any) {
      setCreatorsError(e?.message ?? "Unexpected error")
      setCreators([])
    } finally {
      setLoadingCreators(false)
    }
  }

  useEffect(() => {
    if (activeTab === "creators") {
      loadCreators()
    }
  }, [activeTab])

  const startChatWithCreator = async (creatorId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ other_user_id: creatorId }),
      })
      const json = await res.json()
      if (res.ok && json?.conversation?.id) {
        window.location.href = `/brand/chat/${json.conversation.id}`
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold">Brand Dashboard</h1>
              <p className="text-muted-foreground">Manage campaigns and discover creators</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
              <Button onClick={() => setActiveTab("campaigns")}>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/brand/messages")}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
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
            <TabsTrigger className="shrink-0" value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger className="shrink-0" value="creators">Discover</TabsTrigger>
            <TabsTrigger className="shrink-0" value="applications">Applications</TabsTrigger>
            <TabsTrigger className="shrink-0" value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalSpent}</div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
                  <div className="text-sm text-muted-foreground">Active Campaigns</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalReach}</div>
                  <div className="text-sm text-muted-foreground">Total Reach</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageCircle className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.applications}</div>
                  <div className="text-sm text-muted-foreground">New Applications</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.avgEngagement}</div>
                  <div className="text-sm text-muted-foreground">Avg Engagement</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.completedCampaigns}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Active Campaigns</CardTitle>
                  <CardDescription>Your current running campaigns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaigns
                    .filter((campaign) => campaign.status === "Active")
                    .map((campaign) => (
                      <div key={campaign.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{campaign.title}</h4>
                          <p className="text-sm text-muted-foreground">{campaign.applications} applications</p>
                          <p className="text-xs text-muted-foreground">Due: {campaign.deadline}</p>
                        </div>
                        <div className="text-right min-w-[140px]">
                          <div className="font-bold text-primary">
                            {campaign.spent} / {campaign.budget}
                          </div>
                          <Badge variant="secondary">{campaign.status}</Badge>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest creator applications to review</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentApplications.slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={application.creator.avatar || "/placeholder.svg"}
                          alt={application.creator.name}
                        />
                        <AvatarFallback>
                          {application.creator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{application.creator.name}</h4>
                        <p className="text-xs text-muted-foreground">{application.campaign}</p>
                        <p className="text-xs text-muted-foreground">{application.appliedDate}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary text-sm">{application.proposedRate}</div>
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Campaigns</h2>
                <p className="text-muted-foreground">Manage your marketing campaigns</p>
              </div>
              <Button onClick={() => setActiveTab("campaigns")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>

            {/* Create Campaign Form */}
            <Card>
              <CardHeader>
                <CardTitle>Create Campaign</CardTitle>
                <CardDescription>Define basic details for your new campaign</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                {error && <div className="text-sm text-red-600">{error}</div>}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Drop" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Review">Review</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Budget (USD)</label>
                    <Input type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="5000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deadline</label>
                    <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief about the campaign" />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleCreate} disabled={creating || !title.trim()}>
                    {creating ? "Creating..." : "Create Campaign"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Campaigns List */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  {loading && <div className="text-sm text-muted-foreground">Loading campaigns...</div>}
                  {!loading && campaigns.length === 0 && (
                    <div className="text-sm text-muted-foreground">No campaigns yet. Create your first campaign above.</div>
                  )}
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{campaign.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span>{campaign.applications ?? 0} applications</span>
                          <span>Reach: {campaign.reach ?? "-"}</span>
                          <span>Engagement: {campaign.engagement ?? "-"}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Deadline: {campaign.deadline || "-"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-primary">
                            ${"" + Number(campaign.spent ?? 0).toLocaleString()} / ${"" + Number(campaign.budget ?? 0).toLocaleString()}
                          </div>
                          <Badge
                            variant={
                              campaign.status === "Completed"
                                ? "default"
                                : campaign.status === "Active"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creators" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Discover Creators</h2>
                <p className="text-muted-foreground">Find the perfect creators for your campaigns</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full max-w-[240px] md:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search creators..." className="pl-10" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {loadingCreators && (
                <div className="text-sm text-muted-foreground">Loading creators…</div>
              )}
              {creatorsError && (
                <div className="text-sm text-red-600">{creatorsError}</div>
              )}
              {!loadingCreators && !creatorsError && creators.length === 0 && (
                <div className="text-sm text-muted-foreground">No creators found.</div>
              )}
              {creators.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  onViewProfile={() => recordProfileView(creator.id)}
                  onMessage={() => startChatWithCreator(creator.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Applications</h2>
                <p className="text-muted-foreground">Review creator applications for your campaigns</p>
              </div>
              <Button variant="outline" size="sm" onClick={loadApplications}>Refresh</Button>
            </div>

            <Card>
              <CardContent className="p-4 md:p-6">
                {loadingApplications && (
                  <div className="text-sm text-muted-foreground">Loading applications…</div>
                )}
                {applicationsError && (
                  <div className="text-sm text-destructive">{applicationsError}</div>
                )}
                {!loadingApplications && !applicationsError && applications.length === 0 && (
                  <div className="text-sm text-muted-foreground">No applications yet.</div>
                )}
                <div className="space-y-3">
                  {applications.map((a) => (
                    <div key={a.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 rounded-lg border">
                      <div className="min-w-0">
                        <div className="font-medium">Campaign: {a.campaign_id}</div>
                        <div className="text-xs text-muted-foreground">Applicant: {a.creator_id}</div>
                        {a.message && <div className="text-sm mt-1">{a.message}</div>}
                        <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{a.status}</Badge>
                        <Button size="sm" variant="outline" onClick={() => updateApplicationStatus(a, "Shortlisted")}>Shortlist</Button>
                        <Button size="sm" variant="outline" onClick={() => updateApplicationStatus(a, "Rejected")}>Reject</Button>
                        <Button size="sm" onClick={() => updateApplicationStatus(a, "Accepted")}>Accept</Button>
                        <Button size="sm" variant="outline" onClick={() => startChatWithCreator(a.creator_id)}>Message</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Analytics</h2>
              <p className="text-muted-foreground">Track your campaign performance and ROI</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>Overview of your campaign metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Reach</span>
                      <span className="font-bold">2.8M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Engagement</span>
                      <span className="font-bold">4.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cost per Engagement</span>
                      <span className="font-bold">$0.38</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ROI</span>
                      <span className="font-bold text-green-600">+245%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Utilization</CardTitle>
                  <CardDescription>How your budget is being spent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Budget</span>
                      <span className="font-bold">$50,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Spent</span>
                      <span className="font-bold">$45,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Remaining</span>
                      <span className="font-bold">$4,800</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "90.4%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
