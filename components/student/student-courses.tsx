"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search, ChevronRight, ChevronLeft, Clock, X, Play, Lock,
  FileText, ThumbsUp, Bookmark, Download, CheckSquare, Link2,
  ImageIcon, Send, ArrowLeft, CheckCircle2, AlertCircle,
  BookOpen, GraduationCap
} from "lucide-react"
import { mockSubjects, mockLessons, mockCourses, mockChapterQuizzes, mockQuestions, mockCommunityPosts } from "@/lib/mock-data"
import type { Subject, Chapter, Course, ChapterQuiz } from "@/lib/types"

// Drill-down levels
type ViewLevel = "courses" | "subjects" | "chapters" | "chapter-detail"

export function StudentCourses() {
  const [viewLevel, setViewLevel] = useState<ViewLevel>("courses")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // ---- Breadcrumb ----
  const breadcrumbs: { label: string; action: () => void }[] = []
  breadcrumbs.push({ label: "Courses", action: () => { setViewLevel("courses"); setSelectedCourse(null); setSelectedSubject(null); setSelectedChapter(null) } })
  if (selectedCourse) breadcrumbs.push({ label: selectedCourse.name, action: () => { setViewLevel("subjects"); setSelectedSubject(null); setSelectedChapter(null) } })
  if (selectedSubject) breadcrumbs.push({ label: selectedSubject.name, action: () => { setViewLevel("chapters"); setSelectedChapter(null) } })
  if (selectedChapter) breadcrumbs.push({ label: selectedChapter.name, action: () => {} })

  function goBack() {
    if (viewLevel === "chapter-detail") { setViewLevel("chapters"); setSelectedChapter(null) }
    else if (viewLevel === "chapters") { setViewLevel("subjects"); setSelectedSubject(null) }
    else if (viewLevel === "subjects") { setViewLevel("courses"); setSelectedCourse(null) }
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Breadcrumbs */}
      {viewLevel !== "courses" && (
        <div className="flex items-center gap-1.5 text-sm">
          <button onClick={goBack} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          {breadcrumbs.map((bc, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              <button
                onClick={bc.action}
                className={i === breadcrumbs.length - 1 ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}
              >
                {bc.label}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search courses, subjects, chapters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 rounded-xl border-border bg-card pl-11 text-sm"
        />
      </div>

      {/* === LEVEL 1: COURSES LIST === */}
      {viewLevel === "courses" && (
        <CoursesView
          searchQuery={searchQuery}
          onSelectCourse={(c) => { setSelectedCourse(c); setViewLevel("subjects") }}
        />
      )}

      {/* === LEVEL 2: SUBJECTS UNDER A COURSE === */}
      {viewLevel === "subjects" && selectedCourse && (
        <SubjectsView
          course={selectedCourse}
          searchQuery={searchQuery}
          onSelectSubject={(s) => { setSelectedSubject(s); setViewLevel("chapters") }}
        />
      )}

      {/* === LEVEL 3: CHAPTERS UNDER A SUBJECT === */}
      {viewLevel === "chapters" && selectedSubject && (
        <ChaptersView
          subject={selectedSubject}
          searchQuery={searchQuery}
          onSelectChapter={(ch) => { setSelectedChapter(ch); setViewLevel("chapter-detail") }}
        />
      )}

      {/* === LEVEL 4: CHAPTER DETAIL (VIDEOS + MANDATORY QUIZ) === */}
      {viewLevel === "chapter-detail" && selectedChapter && selectedSubject && (
        <ChapterDetailView chapter={selectedChapter} subject={selectedSubject} />
      )}
    </div>
  )
}

/* ======================== LEVEL 1: COURSES ======================== */
function CoursesView({ searchQuery, onSelectCourse }: { searchQuery: string; onSelectCourse: (c: Course) => void }) {
  const filtered = mockCourses.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.target.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const targetColors: Record<string, string> = {
    "IIT-JEE": "hsl(38, 92%, 50%)",
    "NEET": "hsl(152, 60%, 42%)",
    "MHT-CET": "hsl(217, 91%, 50%)",
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">My Courses</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => {
          const subjects = mockSubjects.filter(s => course.subjectIds.includes(s.id))
          const totalChapters = subjects.reduce((acc, s) => acc + s.chapters.length, 0)
          const completedChapters = subjects.reduce((acc, s) => acc + s.chapters.filter(c => (c.completionPercent || 0) >= 100).length, 0)
          const avgProgress = Math.round(subjects.reduce((acc, s) =>
            acc + s.chapters.reduce((a, c) => a + (c.completionPercent || 0), 0), 0) / totalChapters)

          return (
            <Card
              key={course.id}
              className="group cursor-pointer overflow-hidden border-none transition-all hover:shadow-lg"
              onClick={() => onSelectCourse(course)}
            >
              {/* Top accent bar */}
              <div className="h-2" style={{ backgroundColor: targetColors[course.target] || "hsl(38,92%,50%)" }} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-3 rounded-full text-xs font-medium" style={{ borderColor: targetColors[course.target], color: targetColors[course.target] }}>
                      {course.target}
                    </Badge>
                    <h3 className="text-base font-bold text-foreground leading-tight">{course.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{course.description}</p>
                  </div>
                  <div className="ml-3 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${targetColors[course.target]}15` }}>
                    <GraduationCap className="h-6 w-6" style={{ color: targetColors[course.target] }} />
                  </div>
                </div>

                {/* Subject pills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {subjects.map(s => (
                    <span
                      key={s.id}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: `${s.color}15`, color: s.color }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{completedChapters}/{totalChapters} chapters done</span>
                    <span className="font-semibold text-foreground">{avgProgress}%</span>
                  </div>
                  <Progress value={avgProgress} className="mt-1.5 h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ======================== LEVEL 2: SUBJECTS ======================== */
function SubjectsView({ course, searchQuery, onSelectSubject }: { course: Course; searchQuery: string; onSelectSubject: (s: Subject) => void }) {
  const subjects = mockSubjects.filter(s => course.subjectIds.includes(s.id)).filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">{course.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const totalLessons = subject.chapters.reduce((acc, c) => acc + c.lessonCount, 0)
          const avgCompletion = Math.round(subject.chapters.reduce((acc, c) => acc + (c.completionPercent || 0), 0) / subject.chapters.length)
          const quizzesDone = mockChapterQuizzes.filter(q => subject.chapters.some(c => c.id === q.chapterId) && q.isCompleted).length
          const quizzesTotal = mockChapterQuizzes.filter(q => subject.chapters.some(c => c.id === q.chapterId)).length

          return (
            <Card
              key={subject.id}
              className="group cursor-pointer border-none overflow-hidden transition-all hover:shadow-lg"
              onClick={() => onSelectSubject(subject)}
            >
              <div className="flex aspect-[16/9] items-center justify-center" style={{ backgroundColor: `${subject.color}12` }}>
                <span className="text-6xl font-black" style={{ color: subject.color }}>
                  {subject.name.charAt(0)}
                </span>
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground">{subject.name}</h3>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{subject.chapters.length} chapters</span>
                  <span>{totalLessons} lessons</span>
                  <span>{quizzesDone}/{quizzesTotal} quizzes</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{avgCompletion}% complete</span>
                  </div>
                  <Progress value={avgCompletion} className="mt-1.5 h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ======================== LEVEL 3: CHAPTERS ======================== */
function ChaptersView({ subject, searchQuery, onSelectChapter }: { subject: Subject; searchQuery: string; onSelectChapter: (ch: Chapter) => void }) {
  const filtered = subject.chapters.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${subject.color}15` }}>
          <span className="text-lg font-black" style={{ color: subject.color }}>{subject.name.charAt(0)}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{subject.name}</h2>
          <p className="text-xs text-muted-foreground">{subject.chapters.length} chapters</p>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((chapter) => {
          const lessons = mockLessons.filter(l => l.chapterId === chapter.id)
          const videoCount = lessons.filter(l => l.type === "video").length
          const totalDuration = lessons.reduce((acc, l) => acc + (l.duration || 0), 0)
          const quiz = mockChapterQuizzes.find(q => q.chapterId === chapter.id)

          return (
            <Card
              key={chapter.id}
              className="cursor-pointer border-none transition-all hover:shadow-md"
              onClick={() => onSelectChapter(chapter)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                {/* Chapter number */}
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${subject.color}12` }}
                >
                  <span className="text-lg font-black" style={{ color: subject.color }}>{chapter.order}</span>
                </div>

                {/* Chapter info */}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">Chapter {chapter.order} &mdash; {chapter.name}</h3>
                  <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                    {videoCount > 0 && <span className="flex items-center gap-1"><Play className="h-3 w-3" />{videoCount} videos</span>}
                    {totalDuration > 0 && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{totalDuration} min</span>}
                    <span>{chapter.lessonCount} lessons</span>
                  </div>
                </div>

                {/* Quiz status */}
                {quiz && (
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {quiz.isCompleted ? (
                      <Badge className="gap-1 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10">
                        <CheckCircle2 className="h-3 w-3" /> Quiz Done
                      </Badge>
                    ) : (
                      <Badge className="gap-1 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/10">
                        <AlertCircle className="h-3 w-3" /> Quiz Pending
                      </Badge>
                    )}
                  </div>
                )}

                {/* Progress */}
                <div className="flex w-20 flex-shrink-0 flex-col items-end gap-1">
                  <span className="text-xs font-semibold text-foreground">{chapter.completionPercent || 0}%</span>
                  <Progress value={chapter.completionPercent || 0} className="h-1.5 w-full" />
                </div>

                <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ======================== LEVEL 4: CHAPTER DETAIL ======================== */
function ChapterDetailView({ chapter, subject }: { chapter: Chapter; subject: Subject }) {
  const lessons = mockLessons.filter(l => l.chapterId === chapter.id)
  const videoLessons = lessons.filter(l => l.type === "video")
  const noteLessons = lessons.filter(l => l.type === "notes")
  const quiz = mockChapterQuizzes.find(q => q.chapterId === chapter.id)

  const [selectedVideo, setSelectedVideo] = useState(videoLessons[0] || null)
  const [activeTab, setActiveTab] = useState<"videos" | "quiz">("videos")
  const [watermarkPos, setWatermarkPos] = useState({ x: 20, y: 20 })
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(quiz?.isCompleted || false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 500) + 100)
  const [saved, setSaved] = useState(false)
  const [comment, setComment] = useState("")

  const quizQuestions = quiz ? mockQuestions.filter(q => quiz.questionIds.includes(q.id)) : []
  const relatedComments = mockCommunityPosts.filter(p => p.room === subject.name).slice(0, 3)

  // All chapters from same subject for sidebar
  const siblingChapters = subject.chapters

  // Dynamic watermark
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({ x: Math.random() * 60 + 10, y: Math.random() * 60 + 10 })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  function handleQuizSubmit() {
    setQuizSubmitted(true)
  }

  const quizScore = quizQuestions.reduce((acc, q) => acc + (quizAnswers[q.id] === q.correctAnswer ? 1 : 0), 0)

  return (
    <div className="space-y-4">
      {/* Tabs: Videos | Chapter Quiz */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "videos" | "quiz")}>
        <div className="flex items-center justify-between">
          <TabsList className="h-auto gap-1 rounded-xl bg-muted/60 p-1">
            <TabsTrigger value="videos" className="rounded-lg px-5 py-2 text-sm font-medium data-[state=active]:bg-foreground data-[state=active]:text-card">
              Videos & Notes
            </TabsTrigger>
            <TabsTrigger value="quiz" className="relative rounded-lg px-5 py-2 text-sm font-medium data-[state=active]:bg-foreground data-[state=active]:text-card">
              Chapter Quiz
              {quiz && !quiz.isCompleted && !quizSubmitted && (
                <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-amber-500" />
              )}
            </TabsTrigger>
          </TabsList>
          {quiz?.isMandatory && !quizSubmitted && (
            <Badge className="gap-1 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/10">
              <AlertCircle className="h-3 w-3" /> Mandatory Quiz
            </Badge>
          )}
        </div>

        {/* ===== VIDEOS TAB ===== */}
        <TabsContent value="videos" className="mt-4">
          <div className="flex gap-5">
            {/* Left: Video Player + Content */}
            <div className="flex-1 space-y-4">
              {selectedVideo ? (
                <>
                  {/* Player */}
                  <Card className="overflow-hidden border-none">
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-foreground/5">
                      {selectedVideo.videoId ? (
                        <>
                          <iframe
                            src={`https://www.youtube.com/embed/${selectedVideo.videoId}?rel=0`}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={selectedVideo.title}
                          />
                          <div
                            className="pointer-events-none absolute text-sm font-mono font-semibold tracking-wide text-card/20"
                            style={{ left: `${watermarkPos.x}%`, top: `${watermarkPos.y}%`, transition: "all 3.5s ease-in-out" }}
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
                    <h2 className="text-xl font-bold text-foreground">{selectedVideo.title}</h2>
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

                  {/* Description */}
                  <Card className="border-none bg-muted/60">
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed text-foreground">
                        Lecture on {selectedVideo.title} covering key concepts in {subject.name} - Chapter {chapter.order}: {chapter.name}.
                        Duration: {selectedVideo.duration || 0} minutes.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Comments */}
                  <div className="space-y-4">
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
                          <Button size="sm" variant="outline" className="rounded-lg border-foreground bg-foreground text-card hover:bg-foreground/90 hover:text-card">
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
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
                              <span className="text-xs text-muted-foreground">1 month ago</span>
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-foreground">{post.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Card className="border-none bg-muted/60">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Play className="h-12 w-12 text-muted-foreground/40" />
                    <p className="mt-4 text-sm text-muted-foreground">No videos uploaded for this chapter yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Sidebar: Video + Notes list for this chapter */}
            <div className="hidden w-80 flex-shrink-0 space-y-5 lg:block">
              <ScrollArea className="h-[500px]">
                <div className="space-y-5">
                  {/* Videos */}
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-foreground">
                      Chapter {chapter.order} / Videos
                    </h4>
                    <div className="relative ml-3 space-y-3 border-l-2 border-dashed border-border pl-5">
                      {videoLessons.map((lesson) => {
                        const isActive = selectedVideo?.id === lesson.id
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => !lesson.isLocked && setSelectedVideo(lesson)}
                            disabled={lesson.isLocked}
                            className={`group relative flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                              isActive
                                ? "border-primary bg-primary/5"
                                : lesson.isLocked
                                ? "cursor-not-allowed border-border opacity-50"
                                : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                            }`}
                          >
                            <div className="absolute -left-[1.65rem] top-1/2 -translate-y-1/2">
                              <CheckSquare className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <Play className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            <div className="flex-1">
                              <span className="block truncate text-sm font-medium text-foreground">{lesson.title}</span>
                              <span className="text-xs text-muted-foreground">{lesson.duration || 0} min</span>
                            </div>
                            {lesson.isLocked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Notes & DPPs */}
                  {noteLessons.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-sm font-bold text-foreground">Notes & Resources</h4>
                      <div className="space-y-2">
                        {noteLessons.map(lesson => (
                          <button key={lesson.id} className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left hover:shadow-sm transition-all">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="flex-1 truncate text-sm font-medium text-foreground">{lesson.title}</span>
                            <Download className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Mandatory Quiz CTA */}
              {quiz && !quizSubmitted && (
                <button
                  onClick={() => setActiveTab("quiz")}
                  className="flex w-full items-center gap-3 rounded-xl bg-foreground p-4 text-left transition-colors hover:bg-foreground/90"
                >
                  <FileText className="h-5 w-5 text-card" />
                  <div className="flex-1">
                    <span className="block text-sm font-bold text-card">Take Chapter Quiz</span>
                    <span className="text-xs text-card/60">Mandatory to unlock next chapter</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-card/60" />
                </button>
              )}
              {quiz && quizSubmitted && (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 p-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <div className="flex-1">
                    <span className="block text-sm font-bold text-emerald-700">Quiz Completed</span>
                    <span className="text-xs text-emerald-600">Score: {quiz.score || quizScore}/{quizQuestions.length}</span>
                  </div>
                </div>
              )}

              {/* PDF download */}
              <button className="flex w-full items-center gap-3 rounded-xl bg-foreground p-4 text-left transition-colors hover:bg-foreground/90">
                <Download className="h-5 w-5 text-card" />
                <span className="flex-1 text-sm font-bold text-card">{chapter.name}.pdf</span>
                <Download className="h-4 w-4 text-card/60" />
              </button>
            </div>
          </div>
        </TabsContent>

        {/* ===== QUIZ TAB ===== */}
        <TabsContent value="quiz" className="mt-4">
          {quiz ? (
            <div className="mx-auto max-w-3xl space-y-6">
              {/* Quiz Header */}
              <Card className="border-none">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{quiz.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {quizQuestions.length} questions &middot; {quiz.totalMarks} marks &middot; Mandatory
                    </p>
                  </div>
                  {quizSubmitted ? (
                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700">
                        Score: {quiz.score || quizScore}/{quizQuestions.length}
                      </span>
                    </div>
                  ) : quizStarted ? (
                    <Button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                      className="rounded-full bg-foreground text-card hover:bg-foreground/90"
                    >
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setQuizStarted(true)}
                      className="rounded-full bg-foreground text-card hover:bg-foreground/90"
                    >
                      Start Quiz
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Quiz Questions */}
              {quizStarted && (
                <div className="space-y-5">
                  {quizQuestions.map((q, idx) => (
                    <Card key={q.id} className="border-none">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                            {idx + 1}
                          </span>
                          <div className="flex-1 space-y-4">
                            <p className="text-sm font-medium text-foreground leading-relaxed">{q.text}</p>
                            {q.options && q.options.length > 0 && (
                              <div className="space-y-2">
                                {q.options.map((opt) => {
                                  const isSelected = quizAnswers[q.id] === opt.id
                                  const isCorrect = quizSubmitted && opt.id === q.correctAnswer
                                  const isWrong = quizSubmitted && isSelected && opt.id !== q.correctAnswer

                                  return (
                                    <button
                                      key={opt.id}
                                      disabled={quizSubmitted}
                                      onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all ${
                                        isCorrect
                                          ? "border-emerald-500 bg-emerald-500/10"
                                          : isWrong
                                          ? "border-red-500 bg-red-500/10"
                                          : isSelected
                                          ? "border-primary bg-primary/5"
                                          : "border-border hover:border-primary/30"
                                      }`}
                                    >
                                      <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${
                                        isSelected || isCorrect
                                          ? isCorrect ? "border-emerald-500 bg-emerald-500 text-white" : isWrong ? "border-red-500 bg-red-500 text-white" : "border-primary bg-primary text-primary-foreground"
                                          : "border-border text-muted-foreground"
                                      }`}>
                                        {opt.id.toUpperCase()}
                                      </span>
                                      <span className="text-foreground">{opt.text}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                            {quizSubmitted && (
                              <div className="rounded-lg bg-muted/60 p-3">
                                <p className="text-xs font-semibold text-muted-foreground">Solution:</p>
                                <p className="mt-1 text-sm text-foreground">{q.solution}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!quizStarted && !quizSubmitted && (
                <Card className="border-none bg-muted/60">
                  <CardContent className="flex flex-col items-center py-16">
                    <FileText className="h-16 w-16 text-muted-foreground/30" />
                    <h3 className="mt-4 text-lg font-bold text-foreground">Chapter Quiz</h3>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                      This quiz is mandatory. You must complete it after watching all videos to
                      unlock the next chapter.
                    </p>
                    <Button
                      onClick={() => setQuizStarted(true)}
                      className="mt-6 rounded-full bg-foreground px-8 text-card hover:bg-foreground/90"
                    >
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="border-none bg-muted/60">
              <CardContent className="flex flex-col items-center py-16">
                <FileText className="h-16 w-16 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">No quiz has been set for this chapter yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
