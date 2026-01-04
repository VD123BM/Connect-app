"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, Eye, Save, Send, ArrowLeft, Target, Users, DollarSign, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function PostRequirement() {
  const [activeTab, setActiveTab] = useState("details")
  const [deadline, setDeadline] = useState<Date>()
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [deliverables, setDeliverables] = useState([{ type: "", quantity: 1, description: "" }])

  const platforms = ["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn", "Facebook"]
  const categories = [
    "Fashion",
    "Beauty",
    "Lifestyle",
    "Tech",
    "Food",
    "Travel",
    "Fitness",
    "Gaming",
    "Education",
    "Business",
  ]
  const deliverableTypes = [
    "Instagram Post",
    "Instagram Story",
    "Instagram Reel",
    "YouTube Video",
    "TikTok Video",
    "Blog Post",
    "Twitter Thread",
  ]

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const addDeliverable = () => {
    setDeliverables([...deliverables, { type: "", quantity: 1, description: "" }])
  }

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index))
  }

  const updateDeliverable = (index: number, field: string, value: any) => {
    const updated = deliverables.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setDeliverables(updated)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Post New Requirement</h1>
                <p className="text-muted-foreground">Create a campaign to attract the right creators</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="details">Campaign Details</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="budget">Budget & Timeline</TabsTrigger>
              <TabsTrigger value="review">Review & Post</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Campaign Information</span>
                  </CardTitle>
                  <CardDescription>
                    Provide basic information about your campaign to attract the right creators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="campaign-title">Campaign Title *</Label>
                    <Input id="campaign-title" placeholder="e.g., Summer Fashion Collection Launch" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="campaign-description">Campaign Description *</Label>
                    <Textarea
                      id="campaign-description"
                      placeholder="Describe your campaign goals, brand values, and what you're looking for in creators..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand-name">Brand Name</Label>
                      <Input id="brand-name" defaultValue="EcoFashion Co." disabled className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="campaign-type">Campaign Type</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product-launch">Product Launch</SelectItem>
                          <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                          <SelectItem value="seasonal">Seasonal Campaign</SelectItem>
                          <SelectItem value="event">Event Promotion</SelectItem>
                          <SelectItem value="ongoing">Ongoing Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Categories *</Label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
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

                  <div>
                    <Label>Target Platforms *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Creator Requirements</span>
                  </CardTitle>
                  <CardDescription>Specify what type of creators you're looking for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min-followers">Minimum Followers</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select minimum followers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1k">1K+ followers</SelectItem>
                          <SelectItem value="5k">5K+ followers</SelectItem>
                          <SelectItem value="10k">10K+ followers</SelectItem>
                          <SelectItem value="50k">50K+ followers</SelectItem>
                          <SelectItem value="100k">100K+ followers</SelectItem>
                          <SelectItem value="500k">500K+ followers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="min-engagement">Minimum Engagement Rate</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select minimum engagement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1%+ engagement</SelectItem>
                          <SelectItem value="2">2%+ engagement</SelectItem>
                          <SelectItem value="3">3%+ engagement</SelectItem>
                          <SelectItem value="4">4%+ engagement</SelectItem>
                          <SelectItem value="5">5%+ engagement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="target-audience">Target Audience</Label>
                    <Textarea
                      id="target-audience"
                      placeholder="Describe your target audience demographics, interests, and characteristics..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content-style">Preferred Content Style</Label>
                    <Textarea
                      id="content-style"
                      placeholder="Describe the content style, tone, and aesthetic you're looking for..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Geographic Location</Label>
                    <RadioGroup defaultValue="any" className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="any" id="any-location" />
                        <Label htmlFor="any-location">Any location</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specific" id="specific-location" />
                        <Label htmlFor="specific-location">Specific locations</Label>
                      </div>
                    </RadioGroup>
                    <Input placeholder="Enter specific countries, states, or cities" className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deliverables</CardTitle>
                  <CardDescription>Specify what content creators need to deliver</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-end space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <Label>Content Type</Label>
                        <Select
                          value={deliverable.type}
                          onValueChange={(value) => updateDeliverable(index, "type", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                          <SelectContent>
                            {deliverableTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-24">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={deliverable.quantity}
                          onChange={(e) => updateDeliverable(index, "quantity", Number.parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Description</Label>
                        <Input
                          placeholder="Additional requirements..."
                          value={deliverable.description}
                          onChange={(e) => updateDeliverable(index, "description", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      {deliverables.length > 1 && (
                        <Button variant="outline" size="sm" onClick={() => removeDeliverable(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addDeliverable} className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deliverable
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="budget" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Budget & Compensation</span>
                  </CardTitle>
                  <CardDescription>Set your budget and payment terms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Budget Type</Label>
                    <RadioGroup defaultValue="fixed" className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed-budget" />
                        <Label htmlFor="fixed-budget">Fixed budget per creator</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="range" id="range-budget" />
                        <Label htmlFor="range-budget">Budget range</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="negotiable" id="negotiable-budget" />
                        <Label htmlFor="negotiable-budget">Negotiable</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min-budget">Minimum Budget ($)</Label>
                      <Input id="min-budget" type="number" placeholder="500" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="max-budget">Maximum Budget ($)</Label>
                      <Input id="max-budget" type="number" placeholder="2000" className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payment-terms">Payment Terms</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upfront">100% upfront</SelectItem>
                        <SelectItem value="50-50">50% upfront, 50% on completion</SelectItem>
                        <SelectItem value="completion">100% on completion</SelectItem>
                        <SelectItem value="milestone">Milestone-based payments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="additional-perks">Additional Perks</Label>
                    <Textarea
                      id="additional-perks"
                      placeholder="Free products, exclusive access, long-term partnership opportunities..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Timeline & Deadlines</span>
                  </CardTitle>
                  <CardDescription>Set important dates for your campaign</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Application Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal mt-1",
                              !deadline && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {deadline ? format(deadline, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="content-deadline">Content Delivery Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal mt-1 bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Pick a date
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="campaign-duration">Campaign Duration</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select campaign duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-week">1 week</SelectItem>
                        <SelectItem value="2-weeks">2 weeks</SelectItem>
                        <SelectItem value="1-month">1 month</SelectItem>
                        <SelectItem value="3-months">3 months</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="special-instructions">Special Instructions</Label>
                    <Textarea
                      id="special-instructions"
                      placeholder="Any specific timing requirements, posting schedules, or coordination needs..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Campaign</CardTitle>
                  <CardDescription>Review all details before posting your requirement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Campaign Preview */}
                  <div className="border rounded-lg p-6 bg-muted/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">Summer Fashion Collection Launch</h3>
                        <p className="text-muted-foreground">EcoFashion Co.</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">$500 - $2,000</div>
                        <div className="text-sm text-muted-foreground">Budget Range</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">Fashion</Badge>
                      <Badge variant="secondary">Lifestyle</Badge>
                      <Badge variant="secondary">Instagram</Badge>
                      <Badge variant="secondary">YouTube</Badge>
                    </div>

                    <p className="text-muted-foreground mb-4">
                      We're launching our new sustainable summer collection and looking for fashion creators who align
                      with our eco-friendly values...
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Minimum Followers</div>
                        <div className="text-muted-foreground">10K+</div>
                      </div>
                      <div>
                        <div className="font-medium">Application Deadline</div>
                        <div className="text-muted-foreground">Dec 25, 2024</div>
                      </div>
                      <div>
                        <div className="font-medium">Content Deadline</div>
                        <div className="text-muted-foreground">Jan 15, 2025</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the terms and conditions and confirm that all information provided is accurate
                    </Label>
                  </div>

                  <div className="flex space-x-4">
                    <Button size="lg" className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Post Requirement
                    </Button>
                    <Button variant="outline" size="lg">
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
