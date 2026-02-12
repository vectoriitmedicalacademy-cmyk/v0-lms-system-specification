"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  MessageSquare, ThumbsUp, Search, Plus, Shield, Clock,
  ArrowUp, Hash, Users
} from "lucide-react"
import { mockCommunityPosts } from "@/lib/mock-data"

const rooms = ["All", "Physics", "Chemistry", "Maths", "Biology", "Doubts", "General"]

export function CommunityHub() {
  const [activeRoom, setActiveRoom] = useState("All")
  const [search, setSearch] = useState("")
  const [showNewPost, setShowNewPost] = useState(false)

  const filtered = mockCommunityPosts.filter(p => {
    const matchRoom = activeRoom === "All" || p.room === activeRoom
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase())
    return matchRoom && matchSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community Hub</h1>
          <p className="text-muted-foreground">Discuss, ask doubts, and share resources</p>
        </div>
        <Button className="gap-2" onClick={() => setShowNewPost(true)}>
          <Plus className="h-4 w-4" /> New Post
        </Button>
      </div>

      {/* Room Tabs */}
      <div className="flex flex-wrap gap-2">
        {rooms.map(room => (
          <Button
            key={room}
            variant={activeRoom === room ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setActiveRoom(room)}
          >
            <Hash className="h-3 w-3" /> {room}
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filtered.map(post => (
          <Card key={post.id} className="transition-colors hover:bg-muted/30">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className={`text-xs ${
                    post.authorRole === "teacher" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                  }`}>
                    {post.isAnonymous ? "?" : post.authorName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {post.isAnonymous ? "Anonymous" : post.authorName}
                        </span>
                        {post.isVerified && (
                          <Badge className="gap-1 text-[10px] bg-accent/10 text-accent border border-accent/30" variant="outline">
                            <Shield className="h-2.5 w-2.5" /> Faculty
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px]">
                          <Hash className="mr-0.5 h-2.5 w-2.5" />{post.room}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} at{" "}
                        {new Date(post.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-foreground">{post.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{post.content}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-primary">
                      <ArrowUp className="h-3.5 w-3.5" /> {post.upvotes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5" /> {post.commentCount} replies
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Post Dialog */}
      <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>Share your question, resource, or discussion topic</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="What's on your mind?" />
            </div>
            <div className="space-y-2">
              <Label>Room</Label>
              <div className="flex flex-wrap gap-2">
                {rooms.filter(r => r !== "All").map(room => (
                  <Button key={room} variant="outline" size="sm" className="gap-1">
                    <Hash className="h-3 w-3" /> {room}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea placeholder="Write your post..." rows={5} />
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Switch id="anonymous" />
              <Label htmlFor="anonymous" className="cursor-pointer">
                <p className="text-sm font-medium text-foreground">Post Anonymously</p>
                <p className="text-xs text-muted-foreground">Your name will not be shown</p>
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPost(false)}>Cancel</Button>
            <Button onClick={() => setShowNewPost(false)}>Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
