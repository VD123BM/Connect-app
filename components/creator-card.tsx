"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Users, TrendingUp } from "lucide-react"

interface CreatorCardProps {
  creator: {
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
    rates: {
      min: number
      max: number
    }
  }
  onViewProfile?: () => void
  onMessage?: () => void
}

export function CreatorCard({ creator, onViewProfile, onMessage }: CreatorCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Header with avatar and basic info */}
        <div className="p-4 pb-2">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
              <AvatarFallback>
                {creator.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight">{creator.name}</h3>
              <p className="text-sm text-muted-foreground">{creator.username}</p>
              <div className="flex items-center space-x-1 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{creator.location}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{creator.rating}</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-1">
            {creator.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
            {creator.categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{creator.categories.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="px-4 pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{creator.bio}</p>
        </div>

        {/* Stats */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium">{creator.followers}</span>
              </div>
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium">{creator.engagement}</span>
              </div>
              <span className="text-xs text-muted-foreground">Engagement</span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="px-4 pb-3">
          <div className="text-center">
            <span className="text-lg font-bold text-primary">
              ${creator.rates.min}-${creator.rates.max}
            </span>
            <span className="text-sm text-muted-foreground ml-1">per post</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 pt-2 border-t bg-muted/20">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={onViewProfile}>
              View Profile
            </Button>
            <Button size="sm" className="flex-1" onClick={onMessage}>
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
