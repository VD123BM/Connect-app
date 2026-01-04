"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { CreatorCard } from "@/components/creator-card"
import { Search, Filter, Sparkles, TrendingUp, Target, MapPin, DollarSign } from "lucide-react"

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState("creators")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [followerRange, setFollowerRange] = useState([10000])
  const [budgetRange, setBudgetRange] = useState([500])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  const categories = ["Fashion", "Beauty", "Tech", "Fitness", "Food", "Travel", "Lifestyle", "Gaming"]
  const platforms = ["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn"]
  const locations = ["United States", "Canada", "United Kingdom", "Australia", "Global"]

  // Mock creators data with match scores
  const creators = [
    {
      id: "1",
      name: "Sarah Johnson",
      username: "@sarahjohnson",
      avatar: "/professional-woman-headshot.png",
      location: "Los Angeles, CA",
      followers: "125K",
      engagement: "4.2%",
      rating: 4.8,
      categories: ["Fashion", "Lifestyle", "Sustainability"],
      bio: "Fashion & Lifestyle Creator | Sustainable Living Advocate | Helping you find your style while caring for our planet",
      rates: { min: 500, max: 800 },
      matchScore: 95,
      platforms: ["Instagram", "YouTube"],
      recentWork: ["EcoFashion Co.", "GreenLife Brand", "Pure Beauty"],
    },
    {
      id: "2",
      name: "Mike Chen",
      username: "@mikechen",
      avatar: "/placeholder.svg",
      location: "New York, NY",
      followers: "89K",
      engagement: "3.9%",
      rating: 4.6,
      categories: ["Tech", "Lifestyle", "Reviews"],
      bio: "Tech reviewer and lifestyle content creator. Helping people make better purchasing decisions.",
      rates: { min: 400, max: 650 },
      matchScore: 87,
      platforms: ["YouTube", "TikTok"],
      recentWork: ["TechStart Inc.", "GadgetWorld", "SmartHome Co."],
    },
    {
      id: "3",
      name: "Emma Davis",
      username: "@emmadavis",
      avatar: "/placeholder.svg",
      location: "Miami, FL",
      followers: "156K",
      engagement: "5.1%",
      rating: 4.9,
      categories: ["Beauty", "Fashion", "Travel"],
      bio: "Beauty and travel enthusiast sharing authentic experiences and honest product reviews.",
      rates: { min: 600, max: 950 },
      matchScore: 92,
      platforms: ["Instagram", "TikTok"],
      recentWork: ["Pure Beauty", "TravelLux", "StyleCo"],
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      username: "@alexfitness",
      avatar: "/placeholder.svg",
      location: "Austin, TX",
      followers: "78K",
      engagement: "6.2%",
      rating: 4.7,
      categories: ["Fitness", "Health", "Lifestyle"],
      bio: "Certified personal trainer and nutrition coach. Inspiring healthy living through fitness and wellness.",
      rates: { min: 350, max: 600 },
      matchScore: 78,
      platforms: ["Instagram", "YouTube", "TikTok"],
      recentWork: ["FitLife App", "HealthyEats", "GymGear Pro"],
    },
  ]

  // Mock brands data
  const brands = [
    {
      id: "1",
      name: "EcoFashion Co.",
      username: "@ecofashionco",
      logo: "/eco-fashion-logo.png",
      industry: "Fashion & Apparel",
      location: "San Francisco, CA",
      description: "Sustainable fashion brand committed to ethical manufacturing and eco-friendly materials.",
      categories: ["Fashion", "Sustainability", "Lifestyle"],
      avgBudget: "$1,200",
      campaignsRun: 24,
      rating: 4.7,
      matchScore: 94,
      activeRequirements: 3,
    },
    {
      id: "2",
      name: "TechStart Inc.",
      username: "@techstartinc",
      logo: "/placeholder.svg",
      industry: "Technology",
      location: "Seattle, WA",
      description: "Innovative tech company developing smart home solutions for modern living.",
      categories: ["Tech", "Innovation", "Lifestyle"],
      avgBudget: "$2,500",
      campaignsRun: 18,
      rating: 4.5,
      matchScore: 89,
      activeRequirements: 2,
    },
    {
      id: "3",
      name: "Pure Beauty",
      username: "@purebeauty",
      logo: "/placeholder.svg",
      industry: "Beauty & Cosmetics",
      location: "Los Angeles, CA",
      description: "Clean beauty brand focused on natural ingredients and sustainable packaging.",
      categories: ["Beauty", "Skincare", "Sustainability"],
      avgBudget: "$800",
      campaignsRun: 31,
      rating: 4.6,
      matchScore: 91,
      activeRequirements: 5,
    },
  ]

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const handleLocationToggle = (location: string) => {
    setSelectedLocations((prev) => (prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Discover & Match</h1>
            <p className="text-muted-foreground">Find your perfect collaboration partners with AI-powered matching</p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search creators, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button>
              <Sparkles className="h-4 w-4 mr-2" />
              Smart Match
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Advanced Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories */}
                  <div>
                    <Label className="text-sm font-medium">Categories</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryToggle(category)}
                          />
                          <Label htmlFor={category} className="text-sm">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platforms */}
                  <div>
                    <Label className="text-sm font-medium">Platforms</Label>
                    <div className="space-y-2 mt-2">
                      {platforms.map((platform) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Checkbox
                            id={platform}
                            checked={selectedPlatforms.includes(platform)}
                            onCheckedChange={() => handlePlatformToggle(platform)}
                          />
                          <Label htmlFor={platform} className="text-sm">
                            {platform}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeTab === "creators" && (
                    <>
                      {/* Follower Range */}
                      <div>
                        <Label className="text-sm font-medium">Minimum Followers</Label>
                        <div className="mt-2">
                          <Slider
                            value={followerRange}
                            onValueChange={setFollowerRange}
                            max={1000000}
                            min={1000}
                            step={1000}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>1K</span>
                            <span>{followerRange[0].toLocaleString()}+</span>
                            <span>1M+</span>
                          </div>
                        </div>
                      </div>

                      {/* Budget Range */}
                      <div>
                        <Label className="text-sm font-medium">Budget Range</Label>
                        <div className="mt-2">
                          <Slider
                            value={budgetRange}
                            onValueChange={setBudgetRange}
                            max={5000}
                            min={100}
                            step={50}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>$100</span>
                            <span>${budgetRange[0]}+</span>
                            <span>$5000+</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Location */}
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <div className="space-y-2 mt-2">
                      {locations.map((location) => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox
                            id={location}
                            checked={selectedLocations.includes(location)}
                            onCheckedChange={() => handleLocationToggle(location)}
                          />
                          <Label htmlFor={location} className="text-sm">
                            {location}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setSelectedCategories([])
                      setSelectedPlatforms([])
                      setSelectedLocations([])
                      setFollowerRange([10000])
                      setBudgetRange([500])
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="creators">Discover Creators</TabsTrigger>
                  <TabsTrigger value="brands">Discover Brands</TabsTrigger>
                </TabsList>
                <Select defaultValue="match-score">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match-score">Best Match</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="followers">Most Followers</SelectItem>
                    <SelectItem value="engagement">Best Engagement</SelectItem>
                    <SelectItem value="recent">Recently Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TabsContent value="creators" className="space-y-6">
                {/* Smart Recommendations */}
                <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>Smart Recommendations</span>
                    </CardTitle>
                    <CardDescription>
                      AI-powered matches based on your brand preferences and past successful collaborations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {creators
                        .filter((creator) => creator.matchScore >= 90)
                        .slice(0, 3)
                        .map((creator) => (
                          <div key={creator.id} className="relative">
                            <Badge className="absolute -top-2 -right-2 z-10 bg-primary">
                              {creator.matchScore}% Match
                            </Badge>
                            <CreatorCard
                              creator={creator}
                              onViewProfile={() => console.log("View profile:", creator.id)}
                              onMessage={() => console.log("Message creator:", creator.id)}
                            />
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* All Creators */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">All Creators</h2>
                    <p className="text-muted-foreground">{creators.length} creators found</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {creators.map((creator) => (
                      <div key={creator.id} className="relative">
                        <Badge
                          variant={creator.matchScore >= 90 ? "default" : "secondary"}
                          className="absolute -top-2 -right-2 z-10"
                        >
                          {creator.matchScore}% Match
                        </Badge>
                        <CreatorCard
                          creator={creator}
                          onViewProfile={() => console.log("View profile:", creator.id)}
                          onMessage={() => console.log("Message creator:", creator.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="brands" className="space-y-6">
                {/* Smart Recommendations for Brands */}
                <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-accent" />
                      <span>Recommended Brands</span>
                    </CardTitle>
                    <CardDescription>
                      Brands that align with your content style and audience demographics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {brands
                        .filter((brand) => brand.matchScore >= 90)
                        .map((brand) => (
                          <Card key={brand.id} className="hover:shadow-lg transition-shadow relative">
                            <Badge className="absolute -top-2 -right-2 z-10 bg-accent">{brand.matchScore}% Match</Badge>
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4 mb-4">
                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                  <img
                                    src={brand.logo || "/placeholder.svg"}
                                    alt={brand.name}
                                    className="h-8 w-8 object-contain"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold">{brand.name}</h3>
                                  <p className="text-sm text-muted-foreground">{brand.industry}</p>
                                  <div className="flex items-center space-x-1 mt-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">{brand.location}</span>
                                  </div>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{brand.description}</p>

                              <div className="flex flex-wrap gap-1 mb-4">
                                {brand.categories.slice(0, 3).map((category) => (
                                  <Badge key={category} variant="secondary" className="text-xs">
                                    {category}
                                  </Badge>
                                ))}
                              </div>

                              <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                                <div>
                                  <div className="flex items-center justify-center space-x-1">
                                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm font-medium">{brand.avgBudget}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Avg Budget</span>
                                </div>
                                <div>
                                  <div className="flex items-center justify-center space-x-1">
                                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm font-medium">{brand.campaignsRun}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Campaigns</span>
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                  View Profile
                                </Button>
                                <Button size="sm" className="flex-1">
                                  Connect
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* All Brands */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">All Brands</h2>
                    <p className="text-muted-foreground">{brands.length} brands found</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brands.map((brand) => (
                      <Card key={brand.id} className="hover:shadow-lg transition-shadow relative">
                        <Badge
                          variant={brand.matchScore >= 90 ? "default" : "secondary"}
                          className="absolute -top-2 -right-2 z-10"
                        >
                          {brand.matchScore}% Match
                        </Badge>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                              <img
                                src={brand.logo || "/placeholder.svg"}
                                alt={brand.name}
                                className="h-8 w-8 object-contain"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{brand.name}</h3>
                              <p className="text-sm text-muted-foreground">{brand.industry}</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{brand.location}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{brand.description}</p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {brand.categories.slice(0, 3).map((category) => (
                              <Badge key={category} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>

                          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                            <div>
                              <div className="text-sm font-medium">{brand.avgBudget}</div>
                              <div className="text-xs text-muted-foreground">Avg Budget</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">{brand.campaignsRun}</div>
                              <div className="text-xs text-muted-foreground">Campaigns</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">{brand.activeRequirements}</div>
                              <div className="text-xs text-muted-foreground">Active</div>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              View Profile
                            </Button>
                            <Button size="sm" className="flex-1">
                              Connect
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
