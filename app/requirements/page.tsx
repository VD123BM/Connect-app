"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin, Clock, DollarSign, Users, Heart, Bookmark, ExternalLink } from "lucide-react"

export default function RequirementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBudget, setSelectedBudget] = useState("all")

  // Mock requirements data
  const requirements = [
    {
      id: 1,
      title: "Summer Fashion Collection Launch",
      brand: {
        name: "EcoFashion Co.",
        logo: "/eco-fashion-logo.png",
        verified: true,
      },
      description:
        "We're launching our new sustainable summer collection and looking for fashion creators who align with our eco-friendly values. Perfect for creators passionate about sustainable fashion and lifestyle content.",
      budget: { min: 500, max: 2000 },
      categories: ["Fashion", "Lifestyle", "Sustainability"],
      platforms: ["Instagram", "YouTube"],
      requirements: {
        minFollowers: "10K+",
        minEngagement: "3%+",
        location: "US, Canada",
      },
      deliverables: ["2 Instagram Posts", "1 YouTube Video", "3 Instagram Stories"],
      deadline: "Dec 25, 2024",
      contentDeadline: "Jan 15, 2025",
      applications: 12,
      postedDate: "2 days ago",
      featured: true,
    },
    {
      id: 2,
      title: "Tech Product Review Campaign",
      brand: {
        name: "TechStart Inc.",
        logo: "/placeholder.svg",
        verified: true,
      },
      description:
        "Looking for tech reviewers to showcase our new smart home device. We want authentic, detailed reviews that help consumers make informed decisions.",
      budget: { min: 800, max: 1500 },
      categories: ["Tech", "Reviews", "Lifestyle"],
      platforms: ["YouTube", "TikTok"],
      requirements: {
        minFollowers: "25K+",
        minEngagement: "4%+",
        location: "Global",
      },
      deliverables: ["1 YouTube Review", "2 TikTok Videos"],
      deadline: "Dec 30, 2024",
      contentDeadline: "Jan 20, 2025",
      applications: 8,
      postedDate: "1 day ago",
      featured: false,
    },
    {
      id: 3,
      title: "Beauty Brand Partnership",
      brand: {
        name: "Pure Beauty",
        logo: "/placeholder.svg",
        verified: false,
      },
      description:
        "Seeking beauty influencers for our new natural skincare line. Looking for creators who focus on clean beauty and authentic product experiences.",
      budget: { min: 300, max: 800 },
      categories: ["Beauty", "Skincare", "Lifestyle"],
      platforms: ["Instagram", "TikTok"],
      requirements: {
        minFollowers: "5K+",
        minEngagement: "2%+",
        location: "US only",
      },
      deliverables: ["3 Instagram Posts", "5 Instagram Stories", "2 TikTok Videos"],
      deadline: "Jan 5, 2025",
      contentDeadline: "Jan 25, 2025",
      applications: 15,
      postedDate: "3 days ago",
      featured: false,
    },
    {
      id: 4,
      title: "Fitness App Launch Campaign",
      brand: {
        name: "FitLife App",
        logo: "/placeholder.svg",
        verified: true,
      },
      description:
        "Launching our new fitness tracking app and need fitness influencers to showcase the features. Perfect for creators in the health and wellness space.",
      budget: { min: 1000, max: 3000 },
      categories: ["Fitness", "Health", "Tech"],
      platforms: ["Instagram", "YouTube", "TikTok"],
      requirements: {
        minFollowers: "50K+",
        minEngagement: "5%+",
        location: "Global",
      },
      deliverables: ["1 YouTube Video", "2 Instagram Posts", "3 TikTok Videos"],
      deadline: "Jan 10, 2025",
      contentDeadline: "Feb 1, 2025",
      applications: 6,
      postedDate: "5 hours ago",
      featured: true,
    },
  ]

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.categories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || req.categories.includes(selectedCategory)

    const matchesBudget =
      selectedBudget === "all" ||
      (selectedBudget === "500-1000" && req.budget.max <= 1000) ||
      (selectedBudget === "1000-2000" && req.budget.min >= 1000 && req.budget.max <= 2000) ||
      (selectedBudget === "2000+" && req.budget.min >= 2000)

    return matchesSearch && matchesCategory && matchesBudget
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Browse Requirements</h1>
            <p className="text-muted-foreground">Discover exciting collaboration opportunities from top brands</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Beauty">Beauty</SelectItem>
                <SelectItem value="Tech">Tech</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedBudget} onValueChange={setSelectedBudget}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Budget Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                <SelectItem value="2000+">$2,000+</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredRequirements.length} of {requirements.length} campaigns
          </p>
          <Select defaultValue="newest">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="budget-high">Highest Budget</SelectItem>
              <SelectItem value="budget-low">Lowest Budget</SelectItem>
              <SelectItem value="deadline">Deadline Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requirements Grid */}
        <div className="space-y-6">
          {filteredRequirements.map((requirement) => (
            <Card
              key={requirement.id}
              className={`hover:shadow-lg transition-shadow ${requirement.featured ? "ring-2 ring-primary/20" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={requirement.brand.logo || "/placeholder.svg"} alt={requirement.brand.name} />
                      <AvatarFallback>
                        {requirement.brand.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-bold">{requirement.title}</h3>
                        {requirement.featured && (
                          <Badge variant="default" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{requirement.brand.name}</span>
                        {requirement.brand.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                        <span>•</span>
                        <span>{requirement.postedDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">{requirement.description}</p>

                {/* Categories and Platforms */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {requirement.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                  {requirement.platforms.map((platform) => (
                    <Badge key={platform} variant="outline">
                      {platform}
                    </Badge>
                  ))}
                </div>

                {/* Requirements Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">
                        ${requirement.budget.min} - ${requirement.budget.max}
                      </div>
                      <div className="text-xs text-muted-foreground">Budget</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{requirement.requirements.minFollowers}</div>
                      <div className="text-xs text-muted-foreground">Min Followers</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{requirement.requirements.location}</div>
                      <div className="text-xs text-muted-foreground">Location</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{requirement.deadline}</div>
                      <div className="text-xs text-muted-foreground">Apply by</div>
                    </div>
                  </div>
                </div>

                {/* Deliverables */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Deliverables:</h4>
                  <div className="flex flex-wrap gap-2">
                    {requirement.deliverables.map((deliverable, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">{requirement.applications} applications</div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button>Apply Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequirements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No campaigns match your current filters.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedBudget("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
