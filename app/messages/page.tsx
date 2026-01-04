"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Star,
  Download,
  Check,
  CheckCheck,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState("1")
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock conversations data
  const conversations = [
    {
      id: "1",
      participant: {
        name: "EcoFashion Co.",
        avatar: "/eco-fashion-logo.png",
        type: "brand",
        online: true,
      },
      lastMessage: {
        text: "Great! Let's finalize the campaign details. When can you deliver the content?",
        timestamp: "2 min ago",
        sender: "them",
        read: false,
      },
      unreadCount: 2,
      campaign: "Summer Collection Launch",
      status: "negotiating",
    },
    {
      id: "2",
      participant: {
        name: "Sarah Johnson",
        avatar: "/professional-woman-headshot.png",
        type: "creator",
        online: false,
      },
      lastMessage: {
        text: "I've uploaded the draft content for your review. Please let me know your thoughts!",
        timestamp: "1 hour ago",
        sender: "them",
        read: true,
      },
      unreadCount: 0,
      campaign: "Tech Product Review",
      status: "in-progress",
    },
    {
      id: "3",
      participant: {
        name: "Pure Beauty",
        avatar: "/placeholder.svg",
        type: "brand",
        online: true,
      },
      lastMessage: {
        text: "Thank you for the proposal. We'd like to move forward with this collaboration.",
        timestamp: "3 hours ago",
        sender: "them",
        read: true,
      },
      unreadCount: 0,
      campaign: "Natural Skincare Campaign",
      status: "accepted",
    },
    {
      id: "4",
      participant: {
        name: "Mike Chen",
        avatar: "/placeholder.svg",
        type: "creator",
        online: false,
      },
      lastMessage: {
        text: "I'm interested in your fitness app campaign. Can we discuss the requirements?",
        timestamp: "1 day ago",
        sender: "them",
        read: true,
      },
      unreadCount: 0,
      campaign: "Fitness App Launch",
      status: "inquiry",
    },
  ]

  // Mock messages for selected conversation
  const messages = [
    {
      id: "1",
      sender: "them",
      text: "Hi! I saw your profile and I think you'd be perfect for our summer collection campaign.",
      timestamp: "10:30 AM",
      type: "text",
      read: true,
    },
    {
      id: "2",
      sender: "me",
      text: "Thank you for reaching out! I'd love to learn more about the campaign. Could you share more details?",
      timestamp: "10:45 AM",
      type: "text",
      read: true,
    },
    {
      id: "3",
      sender: "them",
      text: "Here's our campaign brief with all the details.",
      timestamp: "11:00 AM",
      type: "text",
      read: true,
    },
    {
      id: "4",
      sender: "them",
      text: "",
      timestamp: "11:01 AM",
      type: "file",
      file: {
        name: "Summer_Campaign_Brief.pdf",
        size: "2.4 MB",
        type: "pdf",
      },
      read: true,
    },
    {
      id: "5",
      sender: "me",
      text: "This looks great! I'm definitely interested. Based on the requirements, I can offer the following:",
      timestamp: "2:15 PM",
      type: "text",
      read: true,
    },
    {
      id: "6",
      sender: "me",
      text: "",
      timestamp: "2:16 PM",
      type: "proposal",
      proposal: {
        deliverables: ["2 Instagram Posts", "1 YouTube Video", "3 Instagram Stories"],
        timeline: "2 weeks",
        price: "$1,200",
        terms: "50% upfront, 50% on completion",
      },
      read: true,
    },
    {
      id: "7",
      sender: "them",
      text: "Great! Let's finalize the campaign details. When can you deliver the content?",
      timestamp: "Just now",
      type: "text",
      read: false,
    },
  ]

  const selectedConv = conversations.find((conv) => conv.id === selectedConversation)

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", messageInput)
      setMessageInput("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "negotiating":
        return "bg-yellow-500"
      case "inquiry":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepted"
      case "in-progress":
        return "In Progress"
      case "negotiating":
        return "Negotiating"
      case "inquiry":
        return "Inquiry"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Messages</h1>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 mt-2">
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                      selectedConversation === conversation.id && "bg-muted",
                    )}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.participant.online && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium truncate">{conversation.participant.name}</h3>
                        <span className="text-xs text-muted-foreground">{conversation.lastMessage.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-1">{conversation.lastMessage.text}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {conversation.campaign}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <div className={cn("h-2 w-2 rounded-full", getStatusColor(conversation.status))} />
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="flex-1 mt-2">
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {conversations
                  .filter((conv) => conv.unreadCount > 0)
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                        selectedConversation === conversation.id && "bg-muted",
                      )}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium truncate">{conversation.participant.name}</h3>
                          <Badge variant="default" className="h-5 w-5 p-0 text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage.text}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="archived" className="flex-1 mt-2">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No archived conversations</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConv.participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedConv.participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{selectedConv.participant.name}</h2>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedConv.campaign}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {getStatusLabel(selectedConv.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.sender === "me" ? "justify-end" : "justify-start")}
                  >
                    <div className={cn("max-w-[70%] space-y-1", message.sender === "me" ? "items-end" : "items-start")}>
                      {message.type === "text" && (
                        <div
                          className={cn(
                            "px-4 py-2 rounded-lg",
                            message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                      )}

                      {message.type === "file" && message.file && (
                        <Card className="p-3 max-w-xs">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                              <Paperclip className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{message.file.name}</p>
                              <p className="text-xs text-muted-foreground">{message.file.size}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      )}

                      {message.type === "proposal" && message.proposal && (
                        <Card className="p-4 max-w-sm">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Badge variant="default" className="text-xs">
                                Proposal
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Deliverables:</span>
                                <ul className="list-disc list-inside ml-2 text-muted-foreground">
                                  {message.proposal.deliverables.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="font-medium">Timeline:</span>
                                  <p className="text-muted-foreground">{message.proposal.timeline}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Price:</span>
                                  <p className="text-muted-foreground">{message.proposal.price}</p>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">Terms:</span>
                                <p className="text-muted-foreground">{message.proposal.terms}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" className="flex-1">
                                Accept
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                Counter
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}

                      <div
                        className={cn(
                          "flex items-center space-x-1 text-xs text-muted-foreground",
                          message.sender === "me" ? "justify-end" : "justify-start",
                        )}
                      >
                        <span>{message.timestamp}</span>
                        {message.sender === "me" && (
                          <>
                            {message.read ? (
                              <CheckCheck className="h-3 w-3 text-blue-500" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-end space-x-2">
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    rows={1}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Select>
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue placeholder="Quick reply" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interested">I'm interested!</SelectItem>
                          <SelectItem value="more-info">Need more info</SelectItem>
                          <SelectItem value="proposal">Send proposal</SelectItem>
                          <SelectItem value="schedule">Schedule call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
