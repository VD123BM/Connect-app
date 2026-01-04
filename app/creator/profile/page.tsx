"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Instagram, Youtube, Twitter, MapPin, Heart, MessageCircle, Share2, Star, ExternalLink } from "lucide-react"

export default function CreatorProfile() {
  const [isFollowing, setIsFollowing] = useState(false)

  // Mock creator data
  const creator = {
    name: "Sarah Johnson",
    username: "@sarahjohnson",
    bio: "Fashion & Lifestyle Creator | Sustainable Living Advocate | Helping you find your style while caring for our planet 🌱",
    location: "Los Angeles, CA",
    avatar: "/professional-woman-headshot.png",
    coverImage: "/aesthetic-fashion-lifestyle-cover.png",
    followers: "125K",
    engagement: "4.2%",
    rating: 4.8,
    completedDeals: 47,
    responseTime: "2 hours",
    categories: ["Fashion", "Lifestyle", "Sustainability", "Beauty"],
    socialMedia: {
      instagram: { followers: "85K", engagement: "4.5%" },
      youtube: { followers: "40K", engagement: "3.8%" },
      twitter: { followers: "15K", engagement: "2.1%" },
    },
    portfolio: [
      {
        id: 1,
        type: "image",
        url: "/stylish-streetwear-outfit.png",
        title: "Summer Collection Campaign",
        brand: "EcoFashion Co.",
        engagement: "12.5K likes",
      },
      {
        id: 2,
        type: "video",
        url: "/lifestyle-video-thumbnail.png",
        title: "Sustainable Living Tips",
        brand: "GreenLife Brand",
        engagement: "8.2K views",
      },
      {
        id: 3,
        type: "image",
        url: "/beauty-product-showcase.png",
        title: "Natural Beauty Routine",
        brand: "Pure Beauty",
        engagement: "15.1K likes",
      },
      {
        id: 4,
        type: "image",
        url: "/lifestyle-flat-lay.png",
        title: "Morning Routine Essentials",
        brand: "Wellness Co.",
        engagement: "9.8K likes",
      },
    ],
    rates: {
      instagramPost: "$500-800",
      instagramStory: "$200-350",
      youtubeVideo: "$1200-2000",
      twitterPost: "$150-250",
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={creator.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <Button size="sm" variant="secondary" className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Profile
        </Button>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
            <AvatarFallback className="text-2xl">SJ</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{creator.name}</h1>
              <p className="text-lg text-muted-foreground">{creator.username}</p>
              <div className="flex items-center space-x-2 mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{creator.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {creator.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant={isFollowing ? "outline" : "default"}
              onClick={() => setIsFollowing(!isFollowing)}
              className="min-w-[120px]"
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{creator.followers}</div>
              <div className="text-sm text-muted-foreground">Total Followers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{creator.engagement}</div>
              <div className="text-sm text-muted-foreground">Avg Engagement</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-1">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <div className="text-2xl font-bold text-primary">{creator.rating}</div>
              </div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{creator.completedDeals}</div>
              <div className="text-sm text-muted-foreground">Deals Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - About & Social */}
          <div className="lg:col-span-1 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{creator.bio}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-medium">{creator.responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media Reach</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Instagram className="h-5 w-5 text-pink-500" />
                    <div>
                      <div className="font-medium">Instagram</div>
                      <div className="text-sm text-muted-foreground">
                        {creator.socialMedia.instagram.followers} followers
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{creator.socialMedia.instagram.engagement}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Youtube className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium">YouTube</div>
                      <div className="text-sm text-muted-foreground">
                        {creator.socialMedia.youtube.followers} subscribers
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{creator.socialMedia.youtube.engagement}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Twitter className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Twitter</div>
                      <div className="text-sm text-muted-foreground">
                        {creator.socialMedia.twitter.followers} followers
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{creator.socialMedia.twitter.engagement}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Guide</CardTitle>
                <CardDescription>Starting rates for collaborations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Instagram Post</span>
                  <span className="font-medium">{creator.rates.instagramPost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Instagram Story</span>
                  <span className="font-medium">{creator.rates.instagramStory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">YouTube Video</span>
                  <span className="font-medium">{creator.rates.youtubeVideo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Twitter Post</span>
                  <span className="font-medium">{creator.rates.twitterPost}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Portfolio */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Recent collaborations and content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {creator.portfolio.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg mb-3">
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        />
                        {item.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center">
                              <div className="h-0 w-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1" />
                            </div>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{item.brand}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Heart className="h-3 w-3" />
                          <span>{item.engagement}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
