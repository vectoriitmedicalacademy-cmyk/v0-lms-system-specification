"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Plus, BookOpen, Video, FileText, Upload, Edit, Trash2, Eye, EyeOff,
  ChevronRight, FolderOpen, Calendar
} from "lucide-react"
import { mockSubjects, mockLessons } from "@/lib/mock-data"

export function AdminCMS() {
  const [activeTab, setActiveTab] = useState("subjects")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground">Manage subjects, chapters, lessons, and resources</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="subjects">Subjects & Chapters</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{mockSubjects.length} subjects, {mockSubjects.reduce((a, s) => a + s.chapters.length, 0)} chapters total</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" /> Add Subject</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Subject</DialogTitle>
                  <DialogDescription>Add a new subject to the curriculum</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Subject Name</Label>
                    <Input placeholder="e.g. Physics" />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input type="color" defaultValue="#2563eb" className="h-10 w-20" />
                  </div>
                </div>
                <DialogFooter>
                  <Button>Create Subject</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {mockSubjects.map(subject => (
            <Card key={subject.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="h-3 w-3 rounded-full" style={{ background: subject.color }} />
                    {subject.name}
                    <Badge variant="secondary" className="ml-2">{subject.chapters.length} chapters</Badge>
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {subject.chapters.map((ch, i) => (
                    <div key={ch.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">{i + 1}</span>
                      <span className="flex-1 text-sm font-medium text-foreground">{ch.name}</span>
                      <Badge variant="outline" className="text-xs">{ch.lessonCount} lessons</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Lessons Tab */}
        <TabsContent value="lessons" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{mockLessons.length} lessons total</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" /> Create Lesson</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Lesson</DialogTitle>
                  <DialogDescription>Add a video, notes, or assignment</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Lesson Title</Label>
                    <Input placeholder="e.g. Newton's Laws of Motion" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video Lecture</SelectItem>
                          <SelectItem value="notes">Notes / PDF</SelectItem>
                          <SelectItem value="dpp">DPP</SelectItem>
                          <SelectItem value="test">Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Chapter</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                        <SelectContent>
                          {mockSubjects.flatMap(s => s.chapters.map(ch => (
                            <SelectItem key={ch.id} value={ch.id}>{s.name} &gt; {ch.name}</SelectItem>
                          )))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube Video ID (Phase 1)</Label>
                    <Input placeholder="e.g. dQw4w9WgXcQ" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Release Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration (minutes)</Label>
                      <Input type="number" placeholder="45" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Batch Visibility</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select batches" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Batches</SelectItem>
                        <SelectItem value="b1">JEE Advanced 2026 - Alpha</SelectItem>
                        <SelectItem value="b2">NEET 2026 - Bravo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button>Create Lesson</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Release</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLessons.map(lesson => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium text-foreground">{lesson.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1 text-xs">
                          {lesson.type === "video" && <Video className="h-3 w-3" />}
                          {lesson.type === "notes" && <FileText className="h-3 w-3" />}
                          {lesson.type === "dpp" && <BookOpen className="h-3 w-3" />}
                          {lesson.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{lesson.chapterId}</TableCell>
                      <TableCell className="text-muted-foreground">{lesson.duration ? `${lesson.duration}m` : "-"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(lesson.releaseDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </TableCell>
                      <TableCell>
                        {lesson.isLocked ? (
                          <Badge variant="outline" className="gap-1 text-xs"><EyeOff className="h-3 w-3" /> Locked</Badge>
                        ) : (
                          <Badge className="gap-1 bg-accent text-accent-foreground text-xs"><Eye className="h-3 w-3" /> Live</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">Upload Resources</h3>
                <p className="text-sm text-muted-foreground">Drag and drop PDFs, notes, and handouts here</p>
              </div>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" /> Browse Files
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
