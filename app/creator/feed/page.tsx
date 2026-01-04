"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Star,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

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

export default function CreatorFeed() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [budgetFilter, setBudgetFilter] = useState("all")
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/campaigns/public", { cache: "no-store" })
        const json = await res.json()
        if (res.ok) setCampaigns(json.campaigns ?? [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleMessageBrand = async (brandId: string, campaignId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_id: brandId, campaign_id: campaignId }),
      })
      const json = await res.json()
      if (res.ok && json.conversation?.id) {
        router.push(`/creator/chat/${json.conversation.id}`)
      }
    } catch (e) {
      // noop
    }
  }

  const handleLike = (id: number) => {
    setLikedPosts((prev) => (prev.includes(id) ? prev.filter((postId) => postId !== id) : [...prev, id]))
  }

  const handleBookmark = (id: number) => {
    setBookmarkedPosts((prev) => (prev.includes(id) ? prev.filter((postId) => postId !== id) : [...prev, id]))
  }

  const filteredRequirements = campaigns.filter((c) => {
    const matchesSearch =
      (c.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" // placeholder; add real categories later
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-foreground">Requirements Feed</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">{filteredRequirements.length} Active</span>
                <span className="sm:hidden">{filteredRequirements.length}</span>
              </Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search requirements, brands, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border h-12 text-base"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="flex-1 sm:w-40 bg-card border-border h-12">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="health & fitness">Health & Fitness</SelectItem>
                  <SelectItem value="food & beverage">Food & Beverage</SelectItem>
                </SelectContent>
              </Select>
              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger className="flex-1 sm:w-32 bg-card border-border h-12">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Budgets</SelectItem>
                  <SelectItem value="low">Under $1K</SelectItem>
                  <SelectItem value="medium">$1K - $3K</SelectItem>
                  <SelectItem value="high">$3K+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          {loading && <div className="text-center text-muted-foreground">Loading campaigns...</div>}
          {!loading && filteredRequirements.length === 0 && (
            <div className="text-center text-muted-foreground">No campaigns found</div>
          )}
          {filteredRequirements.map((req) => (
            <Card key={req.id} className="bg-card border-border hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-14 h-14 sm:w-12 sm:h-12 border-2 border-border">
                      <AvatarImage src={"/abstract-tech-logo.png"} alt={req.title} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">BR</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif font-bold text-foreground truncate">{req.title}</h3>
                        {req.status && (
                          <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs">
                            {req.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{new Date(req.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBookmark(Number(req.id))}
                    className="text-muted-foreground hover:text-accent min-w-[44px] min-h-[44px] p-2"
                  >
                    <Bookmark
                      className={`w-5 h-5 ${bookmarkedPosts.includes(Number(req.id)) ? "fill-current text-accent" : ""}`}
                    />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-lg sm:text-xl font-serif font-bold text-foreground mb-2">{req.title}</h4>
                  <p className="text-foreground leading-relaxed text-sm sm:text-base">{req.description}</p>
                </div>

                {/* Tags placeholder - categories not implemented yet */}
                <div className="flex flex-wrap gap-2" />

                {/* Requirements Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 p-3 sm:p-4 bg-secondary/30 rounded-lg border border-border">
                  <div className="text-center">
                    <DollarSign className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="font-semibold text-xs sm:text-sm text-foreground">{req.budget ?? 0}</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <p className="text-xs text-muted-foreground">Followers</p>
                    <p className="font-semibold text-xs sm:text-sm text-foreground">-</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="font-semibold text-xs sm:text-sm text-foreground">{req.deadline ?? "TBD"}</p>
                  </div>
                  <div className="text-center">
                    <MapPin className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold text-xs sm:text-sm text-foreground">Remote</p>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <button
                      onClick={() => handleLike(Number(req.id))}
                      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors group min-h-[44px] py-2"
                    >
                      <Heart
                        className={`w-5 h-5 group-hover:scale-110 transition-transform ${likedPosts.includes(Number(req.id)) ? "fill-current text-accent" : ""}`}
                      />
                      <span className="text-sm font-medium">-</span>
                    </button>
                    <div className="flex items-center gap-2 text-muted-foreground py-2">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium hidden sm:inline">{req.applications ?? 0} applied</span>
                      <span className="text-sm font-medium sm:hidden">{req.applications ?? 0}</span>
                    </div>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors min-h-[44px] py-2">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <Button
                    onClick={() => handleMessageBrand(req.brand_id, req.id)}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold min-h-[44px] px-4 sm:px-6"
                  >
                    Message Brand
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
