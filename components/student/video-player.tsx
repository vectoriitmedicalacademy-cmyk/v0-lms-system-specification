"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Play, Lock, Clock, FileText, ThumbsUp, Bookmark,
  ChevronRight, Download, CheckSquare, Link2, ImageIcon,
  Send, ChevronDown
} from "lucide-react"
import { mockLessons, mockSubjects, mockCommunityPosts } from "@/lib/mock-data"

export function VideoPlayer() {
  const [activeSubject, setActiveSubject] = useState("s1")
  const [selectedLesson, setSelectedLesson] = useState(mockLessons[0])
  const [watermarkPos, setWatermarkPos] = useState({ x: 20, y: 20 })
  const [comment, setComment] = useState("")
  const [showMore, setShowMore] = useState(false)
  const [likes, setLikes] = useState(1300)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  // Dynamic watermark
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        x: Math.random() * 60 + 10,
        y: Math.random() * 60 + 10,
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const currentSubject = mockSubjects.find(s => s.id === activeSubject)
  const subjectLessons = mockLessons.filter(l => {
    const chapter = currentSubject?.chapters.find(c => c.id === l.chapterId)
    return !!chapter
  })
  const videoLessons = subjectLessons.filter(l => l.type === "video")
  const allVideoLessons = mockLessons.filter(l => l.type === "video")

  // Find current chapter for the selected lesson
  const currentChapter = currentSubject?.chapters.find(c => c.id === selectedLesson.chapterId)
    || mockSubjects.flatMap(s => s.chapters).find(c => c.id === selectedLesson.chapterId)

  // Comments from community
  const relatedComments = mockCommunityPosts.filter(p => p.room === "Physics").slice(0, 3)

  // Right sidebar chapters for the current subject
  const sidebarChapters = currentSubject?.chapters || mockSubjects[0].chapters

  return (
    <div className="space-y-4 pb-8">
      {/* Subject Tabs */}
      <Tabs value={activeSubject} onValueChange={setActiveSubject}>
        <TabsList className="h-auto gap-1 rounded-xl bg-muted/60 p-1">
          {mockSubjects.map((sub) => (
            <TabsTrigger
              key={sub.id}
              value={sub.id}
              className="rounded-lg px-5 py-2 text-sm font-medium data-[state=active]:bg-foreground data-[state=active]:text-card"
            >
              {sub.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>Courses</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>{currentSubject?.name || "Physics"}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>Chapter {currentChapter?.order || 1}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>Section 1</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{selectedLesson.title.substring(0, 20)}...</span>
      </div>

      <div className="flex gap-5">
        {/* Left - Video + Content */}
        <div className="flex-1 space-y-4">
          {/* Video Player */}
          <Card className="overflow-hidden border-none">
            <div className="relative aspect-video bg-foreground/5 rounded-xl overflow-hidden">
              {selectedLesson.videoId ? (
                <>
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedLesson.videoId}?rel=0`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={selectedLesson.title}
                  />
                  {/* Dynamic Watermark */}
                  <div
                    className="pointer-events-none absolute text-sm font-mono font-semibold tracking-wide text-card/20"
                    style={{
                      left: `${watermarkPos.x}%`,
                      top: `${watermarkPos.y}%`,
                      transition: "all 3.5s ease-in-out",
                    }}
                  >
                    Aarav Sharma | 9876543210 | JEE Alpha | u1
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No video available</p>
                </div>
              )}
            </div>
          </Card>

          {/* Title + Actions */}
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-foreground">{selectedLesson.title}</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1) }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ThumbsUp className={`h-5 w-5 ${liked ? "fill-primary text-primary" : ""}`} />
                <span className="font-medium">{likes >= 1000 ? `${(likes / 1000).toFixed(1)}K` : likes}</span>
              </button>
              <button
                onClick={() => setSaved(!saved)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Bookmark className={`h-5 w-5 ${saved ? "fill-primary text-primary" : ""}`} />
                <span className="font-medium">Save</span>
              </button>
            </div>
          </div>

          {/* Description Card */}
          <Card className="border-none bg-muted/60">
            <CardContent className="p-4">
              <p className="text-sm leading-relaxed text-foreground">
                {currentSubject?.name || "Physics"} is the branch of science studying the relationship between heat, work, temperature, and energy.
                It focuses on how energy transforms within systems and transfers to surroundings, governing processes like
                power generation and chemical reactions through conservation laws.
                {showMore && (
                  <span> Key concepts include systems (open/closed/isolated), properties (intensive/extensive), and the four fundamental laws.</span>
                )}
              </p>
              <button
                onClick={() => setShowMore(!showMore)}
                className="mt-1 text-sm font-medium text-foreground underline hover:no-underline"
              >
                {showMore ? "Show Less" : "See More..."}
              </button>
            </CardContent>
          </Card>

          {/* Comment Section */}
          <div className="space-y-4">
            {/* Comment Input */}
            <div className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/15 text-xs font-bold text-foreground">AS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment"
                    className="flex-1 border-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg border-foreground bg-foreground text-card hover:bg-foreground/90 hover:text-card"
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {relatedComments.map((post) => (
                <div key={post.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground">
                      {post.authorName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">@{post.authorName.replace(" ", "_")}</span>
                      <span className="text-xs text-muted-foreground">1 month ago...</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">{post.content}</p>
                    {post.commentCount > 0 && (
                      <button className="mt-1 text-sm font-medium text-foreground underline">
                        {post.commentCount} Replies
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chapter List */}
        <div className="hidden w-80 flex-shrink-0 space-y-5 lg:block">
          {/* Chapter Lessons Timeline */}
          <ScrollArea className="h-[420px]">
            <div className="space-y-5">
              {sidebarChapters.map((chapter) => {
                const chapterLessons = mockLessons.filter(l => l.chapterId === chapter.id)
                if (chapterLessons.length === 0) return null

                return (
                  <div key={chapter.id}>
                    <h4 className="mb-3 text-sm font-bold text-foreground">
                      Chapter {chapter.order} / Section 1
                    </h4>
                    <div className="relative ml-3 space-y-3 border-l-2 border-dashed border-border pl-5">
                      {chapterLessons.map((lesson) => {
                        const isActive = selectedLesson.id === lesson.id
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => !lesson.isLocked && setSelectedLesson(lesson)}
                            disabled={lesson.isLocked}
                            className={`group relative flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                              isActive
                                ? "border-primary bg-primary/5"
                                : lesson.isLocked
                                ? "cursor-not-allowed border-border opacity-50"
                                : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                            }`}
                          >
                            {/* Timeline dot */}
                            <div className="absolute -left-[1.65rem] top-1/2 -translate-y-1/2">
                              <CheckSquare className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            </div>

                            {lesson.type === "video" ? (
                              <Play className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            ) : lesson.type === "notes" ? (
                              <ImageIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            ) : (
                              <Link2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            )}
                            <span className="flex-1 truncate text-sm font-medium text-foreground">
                              {lesson.title.length > 18 ? lesson.title.substring(0, 18) + "..." : lesson.title}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          {/* Quiz Time Banner */}
          <button className="flex w-full items-center gap-3 rounded-xl bg-foreground p-4 text-left transition-colors hover:bg-foreground/90">
            <FileText className="h-5 w-5 text-card" />
            <span className="text-sm font-bold text-card">Quiz Time</span>
          </button>

          {/* Related Chapters with Thumbnails */}
          <div>
            <h4 className="mb-3 text-sm font-bold text-foreground">Related Chapters</h4>
            <div className="space-y-3">
              {sidebarChapters.slice(0, 5).map((chapter) => (
                <button
                  key={chapter.id}
                  className="flex w-full items-center gap-3 rounded-xl text-left transition-colors hover:bg-muted/60 p-2"
                >
                  <div
                    className="flex h-14 w-20 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${currentSubject?.color || "hsl(217,91%,50%)"}15` }}
                  >
                    <span
                      className="text-lg font-black"
                      style={{ color: currentSubject?.color }}
                    >
                      Ch.{chapter.order}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      Chapter {chapter.order} &nbsp; {chapter.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Shankar Sir &middot; 1 month ago
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* PDF Download */}
          <button className="flex w-full items-center gap-3 rounded-xl bg-foreground p-4 text-left transition-colors hover:bg-foreground/90">
            <Download className="h-5 w-5 text-card" />
            <span className="flex-1 text-sm font-bold text-card">
              {selectedLesson.title.substring(0, 20)}.pdf
            </span>
            <Download className="h-4 w-4 text-card/60" />
          </button>
        </div>
      </div>
    </div>
  )
}
