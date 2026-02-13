"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Clock, Play, CheckCircle, Trophy, ArrowRight, BarChart3,
  Plus, Search, BookOpen, Shuffle, Zap, Target, GraduationCap,
  ChevronRight, ChevronLeft, Timer, Brain, FileText, XCircle,
  CheckCircle2, Star, AlertCircle, Hourglass
} from "lucide-react"
import { mockTests, mockAttempts, mockDPPs, mockSubjects, mockQuestions } from "@/lib/mock-data"
import type { DPP, Question } from "@/lib/types"

interface SelfStudyQuiz {
  id: string
  title: string
  subject: string
  chapter: string
  questionIds: string[]
  createdAt: string
  status: "not-started" | "in-progress" | "completed"
  score?: number
  totalMarks?: number
}

const difficultyColors: Record<string, string> = {
  Easy: "bg-chart-3/15 text-chart-3",
  Medium: "bg-primary/15 text-primary",
  Hard: "bg-destructive/15 text-destructive",
}

export function StudentTests() {
  const upcomingTests = mockTests.filter(t => t.status === "upcoming")
  const completedTests = mockTests.filter(t => t.status === "completed")
  const myAttempts = mockAttempts.filter(a => a.userId === "u1")

  // Self-study state
  const [selfQuizzes, setSelfQuizzes] = useState<SelfStudyQuiz[]>([
    { id: "sq1", title: "Mechanics Practice", subject: "Physics", chapter: "Mechanics", questionIds: ["q1", "q5"], createdAt: "2026-02-11T14:00:00", status: "completed", score: 7, totalMarks: 8 },
    { id: "sq2", title: "Bonding Revision", subject: "Chemistry", chapter: "Chemical Bonding", questionIds: ["q2"], createdAt: "2026-02-12T09:00:00", status: "not-started" },
  ])
  const [createOpen, setCreateOpen] = useState(false)
  const [quizTitle, setQuizTitle] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedChapter, setSelectedChapter] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])
  const [questionSearch, setQuestionSearch] = useState("")
  const [dialogStep, setDialogStep] = useState<1 | 2>(1)

  // DPP Mode Selection + Solver state
  const [selectedDPP, setSelectedDPP] = useState<DPP | null>(null)
  const [dppModeOpen, setDppModeOpen] = useState(false)
  const [dppMode, setDppMode] = useState<"quiz" | "assignment" | null>(null)
  const [dppActive, setDppActive] = useState(false)
  const [dppAnswers, setDppAnswers] = useState<Record<string, string>>({})
  const [dppCurrentQ, setDppCurrentQ] = useState(0)
  const [dppSubmitted, setDppSubmitted] = useState(false)
  const [dppTimeLeft, setDppTimeLeft] = useState(0)
  const [dppTimerActive, setDppTimerActive] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Get questions for a DPP (use first N from mockQuestions matching the chapter)
  const getDPPQuestions = useCallback((dpp: DPP): Question[] => {
    // Get all questions, cycle them if needed for the questionCount
    const allQs = mockQuestions
    const questions: Question[] = []
    for (let i = 0; i < dpp.questionCount && i < allQs.length; i++) {
      questions.push(allQs[i % allQs.length])
    }
    return questions
  }, [])

  const dppQuestions = selectedDPP ? getDPPQuestions(selectedDPP) : []

  // Timer effect for quiz mode
  useEffect(() => {
    if (dppTimerActive && dppTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setDppTimeLeft(prev => {
          if (prev <= 1) {
            setDppTimerActive(false)
            setDppSubmitted(true)
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
  }, [dppTimerActive, dppTimeLeft])

  function openDPPMode(dpp: DPP) {
    setSelectedDPP(dpp)
    setDppModeOpen(true)
    setDppMode(null)
  }

  function startDPP(mode: "quiz" | "assignment") {
    setDppMode(mode)
    setDppModeOpen(false)
    setDppActive(true)
    setDppAnswers({})
    setDppCurrentQ(0)
    setDppSubmitted(false)
    if (mode === "quiz") {
      // 1 minute per question
      const totalTime = (selectedDPP?.questionCount || 5) * 60
      setDppTimeLeft(totalTime)
      setDppTimerActive(true)
    } else {
      setDppTimeLeft(0)
      setDppTimerActive(false)
    }
  }

  function closeDPPSolver() {
    setDppActive(false)
    setDppMode(null)
    setSelectedDPP(null)
    setDppSubmitted(false)
    setDppTimerActive(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  function submitDPP() {
    setDppSubmitted(true)
    setDppTimerActive(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const selectedSubjectObj = mockSubjects.find(s => s.id === selectedSubject)

  // Filter available questions
  const availableQuestions = useMemo(() => {
    let qs = [...mockQuestions]
    if (selectedSubjectObj) {
      qs = qs.filter(q => q.subject === selectedSubjectObj.name)
    }
    if (selectedChapter && selectedChapter !== "__all__") {
      const chObj = selectedSubjectObj?.chapters.find(ch => ch.id === selectedChapter)
      if (chObj) qs = qs.filter(q => q.chapter === chObj.name)
    }
    if (selectedDifficulty) {
      qs = qs.filter(q => q.difficulty === selectedDifficulty)
    }
    return qs
  }, [selectedSubjectObj, selectedChapter, selectedDifficulty])

  const filteredQuestions = useMemo(() => {
    if (!questionSearch.trim()) return availableQuestions
    const q = questionSearch.toLowerCase()
    return availableQuestions.filter(
      qn => qn.text.toLowerCase().includes(q) || qn.tags.some(t => t.toLowerCase().includes(q))
    )
  }, [availableQuestions, questionSearch])

  function toggleQuestion(qId: string) {
    setSelectedQuestionIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    )
  }

  function selectAllVisible() {
    const allIds = filteredQuestions.map(q => q.id)
    const allSelected = allIds.every(id => selectedQuestionIds.includes(id))
    if (allSelected) {
      setSelectedQuestionIds(prev => prev.filter(id => !allIds.includes(id)))
    } else {
      setSelectedQuestionIds(prev => [...new Set([...prev, ...allIds])])
    }
  }

  function randomPick(count: number) {
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random())
    setSelectedQuestionIds(shuffled.slice(0, Math.min(count, shuffled.length)).map(q => q.id))
  }

  function openCreateDialog() {
    setCreateOpen(true)
    setDialogStep(1)
    setQuizTitle("")
    setSelectedSubject("")
    setSelectedChapter("")
    setSelectedDifficulty("")
    setSelectedQuestionIds([])
    setQuestionSearch("")
  }

  function handleCreateQuiz() {
    if (selectedQuestionIds.length === 0) return
    const chObj = selectedSubjectObj?.chapters.find(ch => ch.id === selectedChapter)
    const newQuiz: SelfStudyQuiz = {
      id: `sq-${Date.now()}`,
      title: quizTitle || `Self Study - ${selectedSubjectObj?.name || "Mixed"} (${selectedQuestionIds.length} Qs)`,
      subject: selectedSubjectObj?.name || "Mixed",
      chapter: chObj?.name || "All Chapters",
      questionIds: selectedQuestionIds,
      createdAt: new Date().toISOString(),
      status: "not-started",
    }
    setSelfQuizzes(prev => [newQuiz, ...prev])
    setCreateOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
        <p className="text-sm text-muted-foreground">Upcoming tests, past results, daily practice, and self-study</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="dpps">DPPs</TabsTrigger>
          <TabsTrigger value="self-study" className="gap-1.5">
            <Brain className="h-3.5 w-3.5" /> Self Study
          </TabsTrigger>
        </TabsList>

        {/* Upcoming */}
        <TabsContent value="upcoming" className="mt-4 space-y-4">
          {upcomingTests.map(test => (
            <Card key={test.id} className="border-none bg-muted/60">
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{test.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{new Date(test.scheduledAt).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}</span>
                    <span>&middot;</span>
                    <span>{test.duration} minutes</span>
                    <span>&middot;</span>
                    <span>{test.totalQuestions} questions</span>
                    <span>&middot;</span>
                    <span>{test.totalMarks} marks</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline" className="border-border">{test.type.replace("-", " ").toUpperCase()}</Badge>
                  </div>
                </div>
                <Button className="gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90">
                  <Play className="h-4 w-4" /> Start Test
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Completed */}
        <TabsContent value="completed" className="mt-4 space-y-4">
          {completedTests.map(test => {
            const attempt = myAttempts.find(a => a.testId === test.id)
            return (
              <Card key={test.id} className="border-none bg-muted/60">
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/15">
                    <CheckCircle className="h-6 w-6 text-chart-3" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{test.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>{test.totalQuestions} questions</span>
                      <span>&middot;</span>
                      <span>{test.totalMarks} marks</span>
                    </div>
                  </div>
                  {attempt && (
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{attempt.score}/{attempt.totalMarks}</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{attempt.accuracy}%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-chart-5">#{attempt.rank}</p>
                        <p className="text-xs text-muted-foreground">Rank</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1 rounded-full">
                        <BarChart3 className="h-3.5 w-3.5" /> Analysis
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* DPPs */}
        <TabsContent value="dpps" className="mt-4 space-y-4">
          {mockDPPs.map(dpp => {
            const isPast = new Date(dpp.deadline) < new Date()
            return (
              <Card key={dpp.id} className="border-none bg-muted/60">
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isPast ? "bg-chart-3/15" : "bg-primary/15"}`}>
                    {isPast ? <CheckCircle className="h-6 w-6 text-chart-3" /> : <Clock className="h-6 w-6 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{dpp.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{dpp.questionCount} questions</span>
                      <span>&middot;</span>
                      <span>Due: {new Date(dpp.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="border-border text-[10px]">
                        <Timer className="mr-1 h-2.5 w-2.5" /> {dpp.questionCount} min (Quiz)
                      </Badge>
                      <Badge variant="outline" className="border-border text-[10px]">
                        <FileText className="mr-1 h-2.5 w-2.5" /> No limit (Assignment)
                      </Badge>
                    </div>
                  </div>
                  {isPast ? (
                    <Button variant="outline" className="gap-2 rounded-full">
                      View Solutions <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => openDPPMode(dpp)}
                      className="gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90"
                    >
                      <Play className="h-4 w-4" /> Attempt Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* Self Study */}
        <TabsContent value="self-study" className="mt-4 space-y-5">
          {/* Create Quiz CTA */}
          <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                <Brain className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-foreground">Create Your Own Quiz</h3>
                <p className="text-sm text-muted-foreground">Pick questions from any subject and chapter to build a custom practice set for self-study.</p>
              </div>
              <Button onClick={openCreateDialog} className="gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90">
                <Plus className="h-4 w-4" /> Create Quiz
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => {
                openCreateDialog()
                setTimeout(() => {
                  setSelectedSubject("s1")
                  setSelectedChapter("__all__")
                }, 0)
              }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Quick Physics</p>
                <p className="text-xs text-muted-foreground">Random physics questions</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                openCreateDialog()
                setTimeout(() => {
                  setSelectedSubject("s2")
                  setSelectedChapter("__all__")
                }, 0)
              }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15">
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Quick Chemistry</p>
                <p className="text-xs text-muted-foreground">Random chemistry questions</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                openCreateDialog()
                setTimeout(() => {
                  setSelectedSubject("s3")
                  setSelectedChapter("__all__")
                }, 0)
              }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15">
                <GraduationCap className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Quick Maths</p>
                <p className="text-xs text-muted-foreground">Random maths questions</p>
              </div>
            </button>
          </div>

          {/* My Self-Study Quizzes */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Your Custom Quizzes</h3>
            {selfQuizzes.length === 0 ? (
              <Card className="border-none bg-muted/60">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/40" />
                  <p className="mt-3 text-sm font-medium text-muted-foreground">No custom quizzes yet</p>
                  <p className="text-xs text-muted-foreground/70">Create one to start practising on your own terms</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {selfQuizzes.map(quiz => (
                  <Card key={quiz.id} className="border-none bg-muted/60">
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        quiz.status === "completed" ? "bg-chart-3/15" :
                        quiz.status === "in-progress" ? "bg-primary/15" :
                        "bg-muted"
                      }`}>
                        {quiz.status === "completed" ? <CheckCircle className="h-6 w-6 text-chart-3" /> :
                         quiz.status === "in-progress" ? <Timer className="h-6 w-6 text-primary" /> :
                         <BookOpen className="h-6 w-6 text-muted-foreground" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{quiz.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="border-border">{quiz.subject}</Badge>
                          <span>{quiz.chapter}</span>
                          <span>&middot;</span>
                          <span>{quiz.questionIds.length} questions</span>
                        </div>
                      </div>
                      {quiz.status === "completed" && quiz.score !== undefined && (
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{quiz.score}/{quiz.totalMarks}</p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      )}
                      <Badge className={`border-none text-xs ${
                        quiz.status === "completed" ? "bg-chart-3/15 text-chart-3" :
                        quiz.status === "in-progress" ? "bg-primary/15 text-primary" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {quiz.status === "completed" ? "Done" : quiz.status === "in-progress" ? "In Progress" : "Not Started"}
                      </Badge>
                      <Button
                        size="sm"
                        className={`gap-1.5 rounded-full ${quiz.status === "completed" ? "" : "bg-foreground text-card hover:bg-foreground/90"}`}
                        variant={quiz.status === "completed" ? "outline" : "default"}
                      >
                        {quiz.status === "completed" ? (
                          <><BarChart3 className="h-3.5 w-3.5" /> Review</>
                        ) : quiz.status === "in-progress" ? (
                          <><Play className="h-3.5 w-3.5" /> Continue</>
                        ) : (
                          <><Play className="h-3.5 w-3.5" /> Start</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* DPP Mode Selection Dialog */}
      <Dialog open={dppModeOpen} onOpenChange={setDppModeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Play className="h-5 w-5 text-primary" />
              {selectedDPP?.title || "DPP"}
            </DialogTitle>
            <DialogDescription>Choose how you want to solve this practice sheet</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Quiz Mode card */}
            <button
              type="button"
              onClick={() => startDPP("quiz")}
              className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-card p-6 text-center transition-all hover:border-primary hover:bg-primary/5 hover:shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 transition-transform group-hover:scale-110">
                <Timer className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground">Quiz Mode</p>
                <p className="mt-1 text-xs text-muted-foreground">Timed challenge with countdown</p>
              </div>
              <Badge className="border-none bg-destructive/15 text-destructive text-[10px]">
                {selectedDPP?.questionCount || 5} min timer
              </Badge>
              <ul className="mt-1 space-y-1 text-left text-[11px] text-muted-foreground">
                <li className="flex items-center gap-1"><Zap className="h-3 w-3 text-destructive" /> Countdown timer</li>
                <li className="flex items-center gap-1"><Zap className="h-3 w-3 text-destructive" /> Auto-submit on timeout</li>
                <li className="flex items-center gap-1"><Zap className="h-3 w-3 text-destructive" /> Exam-like pressure</li>
              </ul>
            </button>

            {/* Assignment Mode card */}
            <button
              type="button"
              onClick={() => startDPP("assignment")}
              className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-card p-6 text-center transition-all hover:border-primary hover:bg-primary/5 hover:shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chart-3/15 transition-transform group-hover:scale-110">
                <FileText className="h-8 w-8 text-chart-3" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground">Assignment Mode</p>
                <p className="mt-1 text-xs text-muted-foreground">Solve at your own pace</p>
              </div>
              <Badge className="border-none bg-chart-3/15 text-chart-3 text-[10px]">
                No time limit
              </Badge>
              <ul className="mt-1 space-y-1 text-left text-[11px] text-muted-foreground">
                <li className="flex items-center gap-1"><BookOpen className="h-3 w-3 text-chart-3" /> No timer pressure</li>
                <li className="flex items-center gap-1"><BookOpen className="h-3 w-3 text-chart-3" /> Take your time</li>
                <li className="flex items-center gap-1"><BookOpen className="h-3 w-3 text-chart-3" /> Self-paced learning</li>
              </ul>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DPP Solver Fullscreen Overlay */}
      {dppActive && selectedDPP && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={closeDPPSolver} className="gap-1.5">
                <ChevronLeft className="h-4 w-4" /> Exit
              </Button>
              <div className="h-5 w-px bg-border" />
              <div>
                <p className="text-sm font-bold text-foreground">{selectedDPP.title}</p>
                <Badge className={`border-none text-[10px] ${dppMode === "quiz" ? "bg-destructive/15 text-destructive" : "bg-chart-3/15 text-chart-3"}`}>
                  {dppMode === "quiz" ? <><Timer className="mr-1 h-2.5 w-2.5" /> Quiz Mode</> : <><FileText className="mr-1 h-2.5 w-2.5" /> Assignment Mode</>}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer for quiz mode */}
              {dppMode === "quiz" && !dppSubmitted && (
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${dppTimeLeft <= 60 ? "bg-destructive/15 animate-pulse" : "bg-muted"}`}>
                  <Hourglass className={`h-4 w-4 ${dppTimeLeft <= 60 ? "text-destructive" : "text-muted-foreground"}`} />
                  <span className={`font-mono text-lg font-bold ${dppTimeLeft <= 60 ? "text-destructive" : "text-foreground"}`}>
                    {formatTime(dppTimeLeft)}
                  </span>
                </div>
              )}
              {dppMode === "assignment" && !dppSubmitted && (
                <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
                  <Clock className="h-4 w-4 text-chart-3" />
                  <span className="text-sm font-medium text-chart-3">No time limit</span>
                </div>
              )}
              <span className="text-sm text-muted-foreground">
                {Object.keys(dppAnswers).length}/{dppQuestions.length} answered
              </span>
            </div>
          </div>

          <Progress value={((dppCurrentQ + 1) / dppQuestions.length) * 100} className="h-1" />

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl p-6">
              {!dppSubmitted && dppQuestions.length > 0 ? (
                <>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-bold text-card">
                          {dppCurrentQ + 1}
                        </span>
                        <Badge className={`${difficultyColors[dppQuestions[dppCurrentQ].difficulty]} border-none text-xs`}>
                          {dppQuestions[dppCurrentQ].difficulty}
                        </Badge>
                        <Badge variant="outline" className="border-border text-xs">{dppQuestions[dppCurrentQ].type}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">Question {dppCurrentQ + 1} of {dppQuestions.length}</span>
                    </div>

                    <p className="text-base font-medium leading-relaxed text-foreground">{dppQuestions[dppCurrentQ].text}</p>

                    <div className="mt-6 space-y-3">
                      {dppQuestions[dppCurrentQ].options.map(opt => {
                        const isSelected = dppAnswers[dppQuestions[dppCurrentQ].id] === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setDppAnswers(prev => ({ ...prev, [dppQuestions[dppCurrentQ].id]: opt.id }))}
                            className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                              isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
                            }`}
                          >
                            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              isSelected ? "bg-foreground text-card" : "bg-muted text-muted-foreground"
                            }`}>
                              {opt.id.toUpperCase()}
                            </div>
                            <span className="text-sm text-foreground">{opt.text}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Button variant="outline" size="sm" disabled={dppCurrentQ === 0} onClick={() => setDppCurrentQ(prev => prev - 1)} className="gap-1.5 rounded-full">
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    {dppCurrentQ < dppQuestions.length - 1 ? (
                      <Button size="sm" onClick={() => setDppCurrentQ(prev => prev + 1)} className="gap-1.5 rounded-full bg-foreground text-card hover:bg-foreground/90">
                        Next <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button size="sm" onClick={submitDPP} disabled={Object.keys(dppAnswers).length === 0} className="gap-1.5 rounded-full bg-foreground text-card hover:bg-foreground/90">
                        Submit ({Object.keys(dppAnswers).length}/{dppQuestions.length})
                      </Button>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2">
                    {dppQuestions.map((q, i) => {
                      const answered = !!dppAnswers[q.id]
                      return (
                        <button key={q.id} type="button" onClick={() => setDppCurrentQ(i)} className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                          i === dppCurrentQ ? "bg-foreground text-card" : answered ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {i + 1}
                        </button>
                      )
                    })}
                  </div>
                </>
              ) : dppSubmitted ? (() => {
                const correctCount = dppQuestions.filter(q => dppAnswers[q.id] === q.correctAnswer).length
                const totalScore = correctCount * 4
                const totalMarks = dppQuestions.length * 4
                const accuracy = Math.round((correctCount / dppQuestions.length) * 100)
                return (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-border bg-card p-8">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className={`flex h-20 w-20 items-center justify-center rounded-full ${accuracy >= 80 ? "bg-chart-3/15" : accuracy >= 50 ? "bg-primary/15" : "bg-destructive/15"}`}>
                          {accuracy >= 80 ? <Trophy className="h-10 w-10 text-chart-3" /> : accuracy >= 50 ? <Star className="h-10 w-10 text-primary" /> : <Target className="h-10 w-10 text-destructive" />}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">
                            {accuracy >= 80 ? "Excellent!" : accuracy >= 50 ? "Good Effort!" : "Keep Practicing!"}
                          </h2>
                          <p className="mt-1 text-sm text-muted-foreground">{selectedDPP.title}</p>
                          <Badge className={`mt-2 border-none text-xs ${dppMode === "quiz" ? "bg-destructive/15 text-destructive" : "bg-chart-3/15 text-chart-3"}`}>
                            {dppMode === "quiz" ? "Quiz Mode" : "Assignment Mode"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-foreground">{totalScore}</p>
                            <p className="text-xs text-muted-foreground">out of {totalMarks}</p>
                          </div>
                          <div className="h-12 w-px bg-border" />
                          <div className="text-center">
                            <p className="text-3xl font-bold text-foreground">{correctCount}/{dppQuestions.length}</p>
                            <p className="text-xs text-muted-foreground">correct</p>
                          </div>
                          <div className="h-12 w-px bg-border" />
                          <div className="text-center">
                            <p className="text-3xl font-bold text-foreground">{accuracy}%</p>
                            <p className="text-xs text-muted-foreground">accuracy</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-foreground">Solutions</h3>
                    {dppQuestions.map((q, index) => {
                      const userAnswer = dppAnswers[q.id]
                      const isCorrect = userAnswer === q.correctAnswer
                      return (
                        <div key={q.id} className="rounded-2xl border border-border bg-card p-5">
                          <div className="mb-3 flex items-center gap-2">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isCorrect ? "bg-chart-3 text-white" : "bg-destructive text-white"}`}>
                              Q{index + 1}
                            </div>
                            <Badge className={`${difficultyColors[q.difficulty]} border-none text-xs`}>{q.difficulty}</Badge>
                            {isCorrect ? (
                              <Badge className="gap-1 border-none bg-chart-3/15 text-chart-3 text-xs"><CheckCircle2 className="h-3 w-3" /> Correct</Badge>
                            ) : (
                              <Badge className="gap-1 border-none bg-destructive/15 text-destructive text-xs"><XCircle className="h-3 w-3" /> Incorrect</Badge>
                            )}
                            {!userAnswer && (
                              <Badge className="gap-1 border-none bg-muted text-muted-foreground text-xs"><AlertCircle className="h-3 w-3" /> Unanswered</Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium leading-relaxed text-foreground">{q.text}</p>
                          <div className="mt-4 space-y-2">
                            {q.options.map(opt => {
                              const isUserPick = userAnswer === opt.id
                              const isCorrectOpt = opt.id === q.correctAnswer
                              return (
                                <div key={opt.id} className={`flex items-center gap-3 rounded-xl border p-3 ${
                                  isCorrectOpt ? "border-chart-3 bg-chart-3/10" : isUserPick ? "border-destructive bg-destructive/10" : "border-border bg-card"
                                }`}>
                                  <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    isCorrectOpt ? "bg-chart-3 text-white" : isUserPick ? "bg-destructive text-white" : "bg-muted text-muted-foreground"
                                  }`}>{opt.id.toUpperCase()}</div>
                                  <span className="flex-1 text-sm text-foreground">{opt.text}</span>
                                  {isCorrectOpt && <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-chart-3" />}
                                  {isUserPick && !isCorrectOpt && <XCircle className="h-4 w-4 flex-shrink-0 text-destructive" />}
                                  {isUserPick && !isCorrectOpt && <span className="text-[10px] font-medium text-destructive">Your answer</span>}
                                </div>
                              )
                            })}
                          </div>
                          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                            <div className="mb-1 flex items-center gap-1.5">
                              <Star className="h-3.5 w-3.5 text-primary" />
                              <p className="text-xs font-semibold text-primary">Solution</p>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground">{q.solution}</p>
                          </div>
                        </div>
                      )
                    })}
                    <div className="flex justify-center pb-6">
                      <Button onClick={closeDPPSolver} className="gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90">
                        <ArrowRight className="h-4 w-4" /> Back to DPPs
                      </Button>
                    </div>
                  </div>
                )
              })() : null}
            </div>
          </div>
        </div>
      )}

      {/* Create Self-Study Quiz Dialog - 2-step wizard */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" /> Create Self-Study Quiz
            </DialogTitle>
            <DialogDescription>
              {dialogStep === 1 ? "Choose subject, chapter, and filters." : "Select the questions for your practice set."}
            </DialogDescription>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex items-center gap-2 pb-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${dialogStep === 1 ? "bg-foreground text-card" : "bg-muted text-muted-foreground"}`}>1</div>
            <div className="h-px flex-1 bg-border" />
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${dialogStep === 2 ? "bg-foreground text-card" : "bg-muted text-muted-foreground"}`}>2</div>
          </div>

          {dialogStep === 1 && (
            <div className="space-y-4 py-2">
              {/* Quiz title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Quiz Title (optional)</label>
                <Input
                  placeholder="e.g. Mechanics Revision, Organic Practice..."
                  value={quizTitle}
                  onChange={e => setQuizTitle(e.target.value)}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
                <Select value={selectedSubject} onValueChange={(v) => { setSelectedSubject(v); setSelectedChapter(""); setSelectedQuestionIds([]) }}>
                  <SelectTrigger><SelectValue placeholder="Pick a subject" /></SelectTrigger>
                  <SelectContent>
                    {mockSubjects.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chapter */}
              {selectedSubjectObj && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Chapter</label>
                  <Select value={selectedChapter} onValueChange={(v) => { setSelectedChapter(v); setSelectedQuestionIds([]) }}>
                    <SelectTrigger><SelectValue placeholder="Pick a chapter" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">All Chapters</SelectItem>
                      {selectedSubjectObj.chapters.map(ch => (
                        <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Difficulty filter */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Difficulty Filter</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger><SelectValue placeholder="All difficulties" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {dialogStep === 2 && (
            <div className="space-y-3 py-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search questions by text or tag..."
                  value={questionSearch}
                  onChange={e => setQuestionSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {selectedQuestionIds.length} question{selectedQuestionIds.length !== 1 ? "s" : ""} selected
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => randomPick(5)}>
                    <Shuffle className="h-3 w-3" /> Random 5
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => randomPick(10)}>
                    <Shuffle className="h-3 w-3" /> Random 10
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={selectAllVisible}>
                    {filteredQuestions.length > 0 && filteredQuestions.every(q => selectedQuestionIds.includes(q.id)) ? "Deselect All" : "Select All"}
                  </Button>
                </div>
              </div>

              {/* Question list */}
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {filteredQuestions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Search className="h-8 w-8 text-muted-foreground/40" />
                    <p className="mt-2 text-sm text-muted-foreground">No questions found</p>
                    <p className="text-xs text-muted-foreground/70">Try changing the subject, chapter, or difficulty filter</p>
                  </div>
                ) : (
                  filteredQuestions.map((q, idx) => {
                    const isSelected = selectedQuestionIds.includes(q.id)
                    return (
                      <button
                        type="button"
                        key={q.id}
                        onClick={() => toggleQuestion(q.id)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                          isSelected ? "border-primary/40 bg-primary/5" : "border-border bg-card hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox checked={isSelected} className="mt-0.5" />
                        <div className="flex-1 space-y-1.5">
                          <p className="text-sm font-medium leading-snug text-foreground">
                            <span className="text-muted-foreground">Q{idx + 1}.</span> {q.text.length > 100 ? q.text.slice(0, 100) + "..." : q.text}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge className={`${difficultyColors[q.difficulty] || "bg-muted text-muted-foreground"} border-none text-[10px]`}>{q.difficulty}</Badge>
                            <Badge variant="outline" className="border-border text-[10px]">{q.type}</Badge>
                            <Badge variant="outline" className="border-border text-[10px]">{q.chapter}</Badge>
                            {q.tags.slice(0, 2).map(t => (
                              <Badge key={t} variant="outline" className="border-border text-[10px]">{t}</Badge>
                            ))}
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex-row gap-2">
            {dialogStep === 2 && (
              <Button variant="outline" onClick={() => setDialogStep(1)} className="gap-1.5">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
            )}
            <div className="flex-1" />
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            {dialogStep === 1 ? (
              <Button
                disabled={!selectedSubject || !selectedChapter}
                onClick={() => setDialogStep(2)}
                className="gap-1.5 bg-foreground text-card hover:bg-foreground/90"
              >
                Pick Questions <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                disabled={selectedQuestionIds.length === 0}
                onClick={handleCreateQuiz}
                className="gap-2 bg-foreground text-card hover:bg-foreground/90"
              >
                <Plus className="h-4 w-4" /> Create Quiz ({selectedQuestionIds.length} Qs)
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
