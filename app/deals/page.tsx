"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  Plus,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Upload,
  MessageCircle,
  Eye,
  MoreVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock deals data
  const deals = [
    {
      id: "1",
      title: "Summer Fashion Collection Campaign",
      brand: {
        name: "EcoFashion Co.",
        avatar: "/eco-fashion-logo.png",
      },
      creator: {
        name: "Sarah Johnson",
        avatar: "/professional-woman-headshot.png",
      },
      status: "active",
      value: 1200,
      progress: 65,
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      deliverables: [
        { id: "1", name: "Instagram Post #1", status: "completed", dueDate: "2024-12-10" },
        { id: "2", name: "YouTube Video", status: "in-review", dueDate: "2024-12-15" },
        { id: "3", name: "Instagram Stories (3)", status: "pending", dueDate: "2024-12-20" },
        { id: "4", name: "Instagram Post #2", status: "pending", dueDate: "2024-12-25" },
      ],
      payments: [
        { id: "1", amount: 600, status: "paid", date: "2024-12-01", description: "50% upfront payment" },
        { id: "2", amount: 600, status: "pending", date: "2024-12-31", description: "50% completion payment" },
      ],
      metrics: {
        totalReach: "450K",
        totalEngagement: "18.2K",
        avgEngagementRate: "4.8%",
        impressions: "680K",
      },
    },
    {
      id: "2",
      title: "Tech Product Review Campaign",
      brand: {
        name: "TechStart Inc.",
        avatar: "/placeholder.svg",
      },
      creator: {
        name: "Mike Chen",
        avatar: "/placeholder.svg",
      },
      status: "negotiating",
      value: 1800,
      progress: 0,
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      deliverables: [
        { id: "1", name: "Unboxing Video", status: "pending", dueDate: "2025-01-10" },
        { id: "2", name: "Full Review Video", status: "pending", dueDate: "2025-01-20" },
        { id: "3", name: "TikTok Highlights", status: "pending", dueDate: "2025-01-25" },
      ],
      payments: [
        { id: "1", amount: 900, status: "pending", date: "2025-01-01", description: "50% upfront payment" },
        { id: "2", amount: 900, status: "pending", date: "2025-01-31", description: "50% completion payment" },
      ],
      metrics: {
        totalReach: "0",
        totalEngagement: "0",
        avgEngagementRate: "0%",
        impressions: "0",
      },
    },
    {
      id: "3",
      title: "Beauty Brand Partnership",
      brand: {
        name: "Pure Beauty",
        avatar: "/placeholder.svg",
      },
      creator: {
        name: "Emma Davis",
        avatar: "/placeholder.svg",
      },
      status: "completed",
      value: 950,
      progress: 100,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      deliverables: [
        { id: "1", name: "Instagram Post #1", status: "completed", dueDate: "2024-11-10" },
        { id: "2", name: "Instagram Post #2", status: "completed", dueDate: "2024-11-15" },
        { id: "3", name: "Instagram Stories (5)", status: "completed", dueDate: "2024-11-20" },
        { id: "4", name: "TikTok Videos (2)", status: "completed", dueDate: "2024-11-25" },
      ],
      payments: [
        { id: "1", amount: 475, status: "paid", date: "2024-11-01", description: "50% upfront payment" },
        { id: "2", amount: 475, status: "paid", date: "2024-11-30", description: "50% completion payment" },
      ],
      metrics: {
        totalReach: "320K",
        totalEngagement: "16.8K",
        avgEngagementRate: "5.2%",
        impressions: "485K",
      },
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "negotiating":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "completed":
        return "Completed"
      case "negotiating":
        return "Negotiating"
      case "cancelled":
        return "Cancelled"
      default:
        return "Unknown"
    }
  }

  const getDeliverableStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "in-review":
        return "text-blue-600"
      case "pending":
        return "text-gray-600"
      case "overdue":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getDeliverableIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-review":
        return <Eye className="h-4 w-4 text-blue-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-gray-600" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const totalEarnings = deals.reduce((sum, deal) => sum + deal.value, 0)
  const activeDeals = deals.filter((deal) => deal.status === "active").length
  const completedDeals = deals.filter((deal) => deal.status === "completed").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold">Deal Management</h1>
              <p className="text-muted-foreground">Track and manage your collaboration deals</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Deal
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-8 overflow-x-auto no-scrollbar flex gap-2">
            <TabsTrigger className="shrink-0" value="overview">Overview</TabsTrigger>
            <TabsTrigger className="shrink-0" value="active">Active Deals</TabsTrigger>
            <TabsTrigger className="shrink-0" value="completed">Completed</TabsTrigger>
            <TabsTrigger className="shrink-0" value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">${totalEarnings.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{activeDeals}</p>
                      <p className="text-sm text-muted-foreground">Active Deals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{completedDeals}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-8 w-8 text-accent" />
                    <div>
                      <p className="text-2xl font-bold">
                        {deals.reduce((sum, deal) => sum + deal.deliverables.length, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Deliverables</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Deals */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Deals</CardTitle>
                <CardDescription>Your latest collaboration deals and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deals.slice(0, 3).map((deal) => (
                    <div key={deal.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg">
                      <div className="flex items-center space-x-4 min-w-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={deal.brand.avatar || "/placeholder.svg"} alt={deal.brand.name} />
                          <AvatarFallback>
                            {deal.brand.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h4 className="font-medium truncate">{deal.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">{deal.brand.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className={cn("text-xs", getStatusColor(deal.status))}>
                              {getStatusLabel(deal.status)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {deal.startDate} - {deal.endDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right min-w-[120px]">
                        <div className="text-lg font-bold text-primary">${deal.value.toLocaleString()}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={deal.progress} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">{deal.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Active Deals</h2>
                <p className="text-muted-foreground">Manage your ongoing collaborations</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search deals..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {deals
                .filter((deal) => deal.status === "active")
                .map((deal) => (
                  <Card key={deal.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-4 min-w-0">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={deal.brand.avatar || "/placeholder.svg"} alt={deal.brand.name} />
                            <AvatarFallback>
                              {deal.brand.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <CardTitle className="text-xl truncate">{deal.title}</CardTitle>
                            <CardDescription className="truncate">{deal.brand.name}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{getStatusLabel(deal.status)}</Badge>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Deal Overview */}
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">${deal.value.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Value</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{deal.progress}%</div>
                          <div className="text-sm text-muted-foreground">Progress</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {deal.deliverables.filter((d) => d.status === "completed").length}
                          </div>
                          <div className="text-sm text-muted-foreground">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {deal.deliverables.filter((d) => d.status === "pending").length}
                          </div>
                          <div className="text-sm text-muted-foreground">Remaining</div>
                        </div>
                      </div>

                      <Progress value={deal.progress} className="h-3" />

                      {/* Deliverables */}
                      <div>
                        <h4 className="font-medium mb-3">Deliverables</h4>
                        <div className="space-y-2">
                          {deal.deliverables.map((deliverable) => (
                            <div key={deliverable.id} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex items-center space-x-3">
                                {getDeliverableIcon(deliverable.status)}
                                <div>
                                  <span className="font-medium">{deliverable.name}</span>
                                  <p className="text-sm text-muted-foreground">Due: {deliverable.dueDate}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="outline"
                                  className={cn("text-xs", getDeliverableStatusColor(deliverable.status))}
                                >
                                  {deliverable.status}
                                </Badge>
                                {deliverable.status === "pending" && (
                                  <Button size="sm" variant="outline">
                                    <Upload className="h-3 w-3 mr-1" />
                                    Upload
                                  </Button>
                                )}
                                {deliverable.status === "completed" && (
                                  <Button size="sm" variant="ghost">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div>
                        <h4 className="font-medium mb-3">Payment Status</h4>
                        <div className="space-y-2">
                          {deal.payments.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <span className="font-medium">${payment.amount.toLocaleString()}</span>
                                <p className="text-sm text-muted-foreground">{payment.description}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">{payment.date}</span>
                                <Badge variant={payment.status === "paid" ? "default" : "outline"}>
                                  {payment.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Completed Deals</h2>
              <p className="text-muted-foreground">Review your finished collaborations and their performance</p>
            </div>

            <div className="space-y-6">
              {deals
                .filter((deal) => deal.status === "completed")
                .map((deal) => (
                  <Card key={deal.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-4 min-w-0">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={deal.brand.avatar || "/placeholder.svg"} alt={deal.brand.name} />
                            <AvatarFallback>
                              {deal.brand.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <CardTitle className="text-xl truncate">{deal.title}</CardTitle>
                            <CardDescription className="truncate">{deal.brand.name}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="default">Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Performance Metrics */}
                      <div>
                        <h4 className="font-medium mb-3">Performance Metrics</h4>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="text-center p-4 border rounded">
                            <div className="text-2xl font-bold text-primary">{deal.metrics.totalReach}</div>
                            <div className="text-sm text-muted-foreground">Total Reach</div>
                          </div>
                          <div className="text-center p-4 border rounded">
                            <div className="text-2xl font-bold text-primary">{deal.metrics.totalEngagement}</div>
                            <div className="text-sm text-muted-foreground">Total Engagement</div>
                          </div>
                          <div className="text-center p-4 border rounded">
                            <div className="text-2xl font-bold text-primary">{deal.metrics.avgEngagementRate}</div>
                            <div className="text-sm text-muted-foreground">Avg Engagement Rate</div>
                          </div>
                          <div className="text-center p-4 border rounded">
                            <div className="text-2xl font-bold text-primary">{deal.metrics.impressions}</div>
                            <div className="text-sm text-muted-foreground">Impressions</div>
                          </div>
                        </div>
                      </div>

                      {/* Deal Summary */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Deal Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Total Value:</span>
                              <span className="font-medium">${deal.value.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Duration:</span>
                              <span className="font-medium">
                                {deal.startDate} - {deal.endDate}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Deliverables:</span>
                              <span className="font-medium">{deal.deliverables.length} items</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <Badge variant="default" className="text-xs">
                                Completed
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3">Actions</h4>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start bg-transparent">
                              <Download className="h-4 w-4 mr-2" />
                              Download Report
                            </Button>
                            <Button variant="outline" className="w-full justify-start bg-transparent">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Contact Brand
                            </Button>
                            <Button variant="outline" className="w-full justify-start bg-transparent">
                              <FileText className="h-4 w-4 mr-2" />
                              View Contract
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Analytics & Insights</h2>
              <p className="text-muted-foreground">Track your performance and earnings over time</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Earnings</span>
                      <span className="text-2xl font-bold text-primary">${totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Deal Value</span>
                      <span className="font-medium">${Math.round(totalEarnings / deals.length).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Completion Rate</span>
                      <span className="font-medium">{Math.round((completedDeals / deals.length) * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Reach</span>
                      <span className="font-medium">770K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Engagement</span>
                      <span className="font-medium">35K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Engagement Rate</span>
                      <span className="font-medium">5.0%</span>
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
