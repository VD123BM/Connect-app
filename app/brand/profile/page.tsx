"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, MapPin, Globe, Star, Upload, ExternalLink } from "lucide-react"

export default function BrandProfile() {
  const [isEditing, setIsEditing] = useState(false)

  // Mock brand data
  const brand = {
    name: "EcoFashion Co.",
    username: "@ecofashionco",
    bio: "Sustainable fashion brand committed to ethical manufacturing and eco-friendly materials. Creating stylish clothing that doesn't compromise our planet's future.",
    industry: "Fashion & Apparel",
    location: "San Francisco, CA",
    website: "https://ecofashion.co",
    logo: "/eco-fashion-logo.png",
    coverImage: "/sustainable-fashion-cover.png",
    founded: "2019",
    employees: "50-100",
    totalSpent: "$125,000",
    campaignsRun: 24,
    avgBudget: "$5,200",
    rating: 4.7,
    categories: ["Fashion", "Sustainability", "Lifestyle"],
    recentCampaigns: [
      {
        id: 1,
        title: "Summer Sustainable Collection",
        reach: "450K",
        engagement: "4.8%",
        budget: "$5,000",
        completedDate: "Nov 2024",
      },
      {
        id: 2,
        title: "Eco-Friendly Holiday Campaign",
        reach: "320K",
        engagement: "5.2%",
        budget: "$3,500",
        completedDate: "Dec 2024",
      },
      {
        id: 3,
        title: "Spring Fashion Week",
        reach: "680K",
        engagement: "4.1%",
        budget: "$8,000",
        completedDate: "Oct 2024",
      },
    ],
    values: ["Sustainability", "Ethical Manufacturing", "Quality", "Innovation"],
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={brand.coverImage || "/placeholder.svg?height=320&width=1200&query=sustainable fashion brand cover"}
          alt="Brand Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {!isEditing && (
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage
              src={brand.logo || "/placeholder.svg?height=128&width=128&query=eco fashion company logo"}
              alt={brand.name}
            />
            <AvatarFallback className="text-2xl">
              <Building2 className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{brand.name}</h1>
              <p className="text-lg text-muted-foreground">{brand.username}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Building2 className="h-4 w-4" />
                  <span>{brand.industry}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{brand.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <a href={brand.website} className="hover:text-primary">
                    Website
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {brand.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </Button>
            <Button>Follow Brand</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{brand.totalSpent}</div>
              <div className="text-sm text-muted-foreground">Total Invested</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{brand.campaignsRun}</div>
              <div className="text-sm text-muted-foreground">Campaigns Run</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{brand.avgBudget}</div>
              <div className="text-sm text-muted-foreground">Avg Budget</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-1">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <div className="text-2xl font-bold text-primary">{brand.rating}</div>
              </div>
              <div className="text-sm text-muted-foreground">Brand Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - About & Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">{brand.bio}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Founded</span>
                      <span className="font-medium">{brand.founded}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Team Size</span>
                      <span className="font-medium">{brand.employees}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Industry</span>
                      <span className="font-medium">{brand.industry}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Brand Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {brand.values.map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Recent Campaigns */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>Latest marketing campaigns and their performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {brand.recentCampaigns.map((campaign) => (
                      <div key={campaign.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-lg">{campaign.title}</h4>
                            <p className="text-sm text-muted-foreground">Completed {campaign.completedDate}</p>
                          </div>
                          <Badge variant="outline">{campaign.budget}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-primary">{campaign.reach}</div>
                            <div className="text-xs text-muted-foreground">Reach</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-primary">{campaign.engagement}</div>
                            <div className="text-xs text-muted-foreground">Engagement</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-primary">{campaign.budget}</div>
                            <div className="text-xs text-muted-foreground">Budget</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>All Campaigns</CardTitle>
                <CardDescription>Complete history of your marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brand.recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{campaign.title}</h4>
                        <p className="text-sm text-muted-foreground">Completed {campaign.completedDate}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-sm font-medium">{campaign.reach}</div>
                          <div className="text-xs text-muted-foreground">Reach</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{campaign.engagement}</div>
                          <div className="text-xs text-muted-foreground">Engagement</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{campaign.budget}</div>
                          <div className="text-xs text-muted-foreground">Budget</div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>Edit Brand Profile</CardTitle>
                <CardDescription>Update your brand information and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={brand.logo || "/placeholder.svg"} />
                    <AvatarFallback>
                      <Building2 className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Logo
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand-name">Brand Name</Label>
                    <Input id="brand-name" defaultValue={brand.name} />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue={brand.username} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Brand Description</Label>
                  <Textarea id="bio" defaultValue={brand.bio} rows={3} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" defaultValue={brand.industry} />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={brand.location} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue={brand.website} />
                  </div>
                  <div>
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input id="founded" defaultValue={brand.founded} />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
