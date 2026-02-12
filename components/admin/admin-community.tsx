"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search, MoreHorizontal, Pin, Lock, Trash2, Flag, MessageSquare,
  ThumbsUp, Shield, Eye, Users
} from "lucide-react"
import { mockCommunityPosts, mockUsers } from "@/lib/mock-data"

export function AdminCommunity() {
  const [search, setSearch] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)

  const filtered = mockCommunityPosts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.authorName.toLowerCase().includes(search.toLowerCase()) ||
    p.content.toLowerCase().includes(search.toLowerCase())
  )

  const flaggedPosts = mockCommunityPosts.filter(p => p.isAnonymous)
  const totalPosts = mockCommunityPosts.length
  const totalComments = mockCommunityPosts.reduce((a, p) => a + p.commentCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community Moderation</h1>
          <p className="text-muted-foreground">Manage posts, pin content, and moderate discussions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalPosts}</p>
              <p className="text-xs text-muted-foreground">Total Posts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <ThumbsUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalComments}</p>
              <p className="text-xs text-muted-foreground">Total Comments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Flag className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{flaggedPosts.length}</p>
              <p className="text-xs text-muted-foreground">Anonymous Posts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <Shield className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Reported</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts, users, content..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-xs">
                    <p className="truncate font-medium text-foreground">{post.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{post.content.slice(0, 80)}...</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
                          {post.isAnonymous ? "?" : post.authorName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-foreground">{post.isAnonymous ? "Anonymous" : post.authorName}</p>
                        <Badge variant="outline" className="text-[10px]">{post.authorRole}</Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{post.room}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {post.upvotes}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.commentCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {post.isVerified && (
                        <Badge className="gap-1 text-[10px] bg-accent/10 text-accent border border-accent/30" variant="outline">
                          <Shield className="h-2.5 w-2.5" /> Verified
                        </Badge>
                      )}
                      {post.isAnonymous && (
                        <Badge variant="outline" className="gap-1 text-[10px] bg-warning/10 text-warning border-warning/30">
                          <Eye className="h-2.5 w-2.5" /> Anon
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-3.5 w-3.5" /> View Full Post</DropdownMenuItem>
                        <DropdownMenuItem><Pin className="mr-2 h-3.5 w-3.5" /> Pin Post</DropdownMenuItem>
                        <DropdownMenuItem><Lock className="mr-2 h-3.5 w-3.5" /> Lock Thread</DropdownMenuItem>
                        <DropdownMenuItem><Flag className="mr-2 h-3.5 w-3.5" /> Flag User</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => { setSelectedPost(post.id); setShowDeleteConfirm(true) }}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post and all its comments will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowDeleteConfirm(false)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
