"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, TrendingUp, Users, Target } from "lucide-react"

interface MatchIndicatorProps {
  score: number
  factors?: {
    audience?: number
    content?: number
    engagement?: number
    budget?: number
  }
  size?: "sm" | "md" | "lg"
}

export function MatchIndicator({ score, factors, size = "md" }: MatchIndicatorProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 75) return "bg-yellow-500"
    if (score >= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  const getScoreVariant = (score: number) => {
    if (score >= 90) return "default"
    if (score >= 75) return "secondary"
    return "outline"
  }

  if (size === "sm") {
    return (
      <Badge variant={getScoreVariant(score)} className="text-xs">
        <Sparkles className="h-3 w-3 mr-1" />
        {score}% Match
      </Badge>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">Match Score</span>
        </div>
        <Badge variant={getScoreVariant(score)} className="text-sm">
          {score}%
        </Badge>
      </div>

      <Progress value={score} className="h-2" />

      {factors && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          {factors.audience && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span>Audience</span>
              </div>
              <span className="font-medium">{factors.audience}%</span>
            </div>
          )}
          {factors.content && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Target className="h-3 w-3 text-muted-foreground" />
                <span>Content</span>
              </div>
              <span className="font-medium">{factors.content}%</span>
            </div>
          )}
          {factors.engagement && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span>Engagement</span>
              </div>
              <span className="font-medium">{factors.engagement}%</span>
            </div>
          )}
          {factors.budget && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span>Budget</span>
              </div>
              <span className="font-medium">{factors.budget}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
