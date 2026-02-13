"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Swords, Trophy, Clock, CheckCircle, XCircle,
  Send, Search, Zap, Target, Crown, ArrowRight,
  Timer, Play, ShieldCheck, ChevronRight, ChevronLeft,
  Flame, Star, Medal, Award, Lock, CheckCircle2, Circle,
  Atom, FlaskConical, Calculator
} from "lucide-react"
import { mockChallenges, mockUsers, mockSubjects, mockQuestions, mockDailyChallenges, mockMilestones } from "@/lib/mock-data"
import type { Challenge, Question, DailyChallenge, DailyChallengeQuestion, Milestone } from "@/lib/types"

const currentUserId = "u1"
const todayStr = new Date().toISOString().slice(0, 10)

const statusConfig: Record<Challenge["status"], { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-primary/15 text-primary", icon: <Clock className="h-3.5 w-3.5" /> },
  accepted: { label: "Accepted", color: "bg-chart-3/15 text-chart-3", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  "in-progress": { label: "In Progress", color: "bg-primary/15 text-primary", icon: <Zap className="h-3.5 w-3.5" /> },
  completed: { label: "Completed", color: "bg-success/15 text-success", icon: <Trophy className="h-3.5 w-3.5" /> },
  declined: { label: "Declined", color: "bg-destructive/15 text-destructive", icon: <XCircle className="h-3.5 w-3.5" /> },
}

const difficultyColors: Record<string, string> = {
  Easy: "bg-chart-3/15 text-chart-3",
  Medium: "bg-primary/15 text-primary",
  Hard: "bg-destructive/15 text-destructive",
}

const subjectIcons: Record<string, React.ReactNode> = {
  Physics: <Atom className="h-5 w-5" />,
  Chemistry: <FlaskConical className="h-5 w-5" />,
  Mathematics: <Calculator className="h-5 w-5" />,
}

const subjectColors: Record<string, string> = {
  Physics: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
  Chemistry: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
  Mathematics: "from-amber-500/20 to-amber-600/5 border-amber-500/30",
}

const subjectIconBg: Record<string, string> = {
  Physics: "bg-blue-500/15 text-blue-600",
  Chemistry: "bg-emerald-500/15 text-emerald-600",
  Mathematics: "bg-amber-500/15 text-amber-600",
}

function milestoneIcon(icon: string) {
  switch (icon) {
    case "zap": return <Zap className="h-5 w-5" />
    case "flame": return <Flame className="h-5 w-5" />
    case "star": return <Star className="h-5 w-5" />
    case "atom": return <Atom className="h-5 w-5" />
    case "flask": return <FlaskConical className="h-5 w-5" />
    case "calculator": return <Calculator className="h-5 w-5" />
    case "trophy": return <Trophy className="h-5 w-5" />
    case "crown": return <Crown className="h-5 w-5" />
    case "target": return <Target className="h-5 w-5" />
    case "medal": return <Medal className="h-5 w-5" />
    default: return <Award className="h-5 w-5" />
  }
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase()
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// ===== Solutions Review Component (view all solutions after completion) =====
function SolutionsReview({
  challenge,
  answers,
  onBack,
}: {
  challenge: DailyChallenge
  answers: Record<string, string>
  onBack: () => void
}) {
  const correctCount = challenge.questions.filter(q => answers[q.questionId] === q.correctAnswer).length
  const score = correctCount * 4

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" /> Back to Challenges
        </Button>
      </div>

      {/* Score summary card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{challenge.subjectName} - Solutions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You scored <span className="font-bold text-foreground">{score}/{challenge.totalMarks}</span> ({correctCount}/{challenge.questions.length} correct)
            </p>
          </div>
          <div className="w-full max-w-xs">
            <Progress value={(score / challenge.totalMarks) * 100} className="h-2" />
          </div>
        </div>
      </div>

      {/* All questions with solutions */}
      <div className="space-y-4">
        {challenge.questions.map((q, index) => {
          const userAnswer = answers[q.questionId]
          const isCorrect = userAnswer === q.correctAnswer
          return (
            <div key={q.questionId} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  isCorrect ? "bg-emerald-500 text-white" : "bg-destructive text-white"
                }`}>
                  Q{index + 1}
                </div>
                <Badge className={`${difficultyColors[q.difficulty]} border-none text-xs`}>{q.difficulty}</Badge>
                {isCorrect ? (
                  <Badge className="gap-1 border-none bg-emerald-500/15 text-emerald-600 text-xs">
                    <CheckCircle2 className="h-3 w-3" /> Correct
                  </Badge>
                ) : (
                  <Badge className="gap-1 border-none bg-destructive/15 text-destructive text-xs">
                    <XCircle className="h-3 w-3" /> Incorrect
                  </Badge>
                )}
                <span className="ml-auto text-xs font-bold text-muted-foreground">{isCorrect ? "+4" : "0"} marks</span>
              </div>

              <p className="text-sm font-medium leading-relaxed text-foreground">{q.text}</p>

              <div className="mt-4 space-y-2">
                {q.options.map(opt => {
                  const isUserPick = userAnswer === opt.id
                  const isCorrectOpt = opt.id === q.correctAnswer
                  return (
                    <div
                      key={opt.id}
                      className={`flex items-center gap-3 rounded-xl border p-3 ${
                        isCorrectOpt
                          ? "border-emerald-500 bg-emerald-500/10"
                          : isUserPick
                          ? "border-destructive bg-destructive/10"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isCorrectOpt
                          ? "bg-emerald-500 text-white"
                          : isUserPick
                          ? "bg-destructive text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {opt.id.toUpperCase()}
                      </div>
                      <span className="flex-1 text-sm text-foreground">{opt.text}</span>
                      {isCorrectOpt && <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />}
                      {isUserPick && !isCorrectOpt && <XCircle className="h-4 w-4 flex-shrink-0 text-destructive" />}
                      {isUserPick && !isCorrectOpt && (
                        <span className="text-[10px] font-medium text-destructive">Your answer</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Solution explanation */}
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
      </div>
    </div>
  )
}

// ===== Daily Challenge Quiz Component =====
function DailyChallengeQuiz({
  challenge,
  onComplete,
  onBack,
}: {
  challenge: DailyChallenge
  onComplete: (score: number, answers: Record<string, string>) => void
  onBack: () => void
}) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const q = challenge.questions[currentQ]
  const total = challenge.questions.length

  function selectAnswer(optId: string) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [q.questionId]: optId }))
  }

  function handleSubmit() {
    setSubmitted(true)
    let score = 0
    challenge.questions.forEach(cq => {
      if (answers[cq.questionId] === cq.correctAnswer) score += 4
    })
    onComplete(score, answers)
  }

  const answeredCount = Object.keys(answers).length
  const isLast = currentQ === total - 1

  // After submit, show score summary with "View All Solutions" button
  if (submitted) {
    const correctCount = challenge.questions.filter(cq => answers[cq.questionId] === cq.correctAnswer).length
    const totalScore = correctCount * 4
    const accuracy = Math.round((correctCount / total) * 100)

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        </div>

        {/* Result card */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={`flex h-20 w-20 items-center justify-center rounded-full ${accuracy >= 80 ? "bg-emerald-500/15" : accuracy >= 50 ? "bg-primary/15" : "bg-destructive/15"}`}>
              {accuracy >= 80 ? <Trophy className="h-10 w-10 text-emerald-500" /> : accuracy >= 50 ? <Star className="h-10 w-10 text-primary" /> : <Target className="h-10 w-10 text-destructive" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {accuracy >= 80 ? "Excellent!" : accuracy >= 50 ? "Good Effort!" : "Keep Practicing!"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{challenge.subjectName} Daily Challenge</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{totalScore}</p>
                <p className="text-xs text-muted-foreground">out of {challenge.totalMarks}</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{correctCount}/{total}</p>
                <p className="text-xs text-muted-foreground">correct</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">accuracy</p>
              </div>
            </div>

            {/* Question result dots */}
            <div className="flex items-center gap-2 pt-2">
              {challenge.questions.map((cq, i) => {
                const correct = answers[cq.questionId] === cq.correctAnswer
                return (
                  <div key={cq.questionId} className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                    correct ? "bg-emerald-500 text-white" : "bg-destructive text-white"
                  }`}>
                    {correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={onBack} className="gap-2 rounded-full">
            Back to Challenges
          </Button>
          <Button
            onClick={() => {
              // Transition into inline solutions review
              setSubmitted(false)
              // We use a special trick: set a flag to show the solutions review
              ;(window as any).__showSolutions = { challengeId: challenge.id, answers: { ...answers } }
              onBack()
            }}
            className="gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90"
          >
            <Star className="h-4 w-4" /> View All Solutions
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{currentQ + 1}</span>/{total}
        </div>
      </div>
      <Progress value={((currentQ + 1) / total) * 100} className="h-1.5" />

      {/* Question */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Badge className={`${difficultyColors[q.difficulty]} border-none text-xs`}>{q.difficulty}</Badge>
          <span className="text-xs text-muted-foreground">4 marks</span>
        </div>
        <p className="text-base font-medium leading-relaxed text-foreground">{q.text}</p>

        <div className="mt-6 space-y-3">
          {q.options.map(opt => {
            const isSelected = answers[q.questionId] === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => selectAnswer(opt.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
                }`}
              >
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  isSelected
                    ? "bg-foreground text-card"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {opt.id.toUpperCase()}
                </div>
                <span className="text-sm text-foreground">{opt.text}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={currentQ === 0}
          onClick={() => setCurrentQ(prev => prev - 1)}
          className="gap-1.5 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

        {isLast ? (
          <Button
            size="sm"
            disabled={answeredCount < total}
            onClick={handleSubmit}
            className="gap-1.5 rounded-full bg-foreground text-card hover:bg-foreground/90"
          >
            Submit ({answeredCount}/{total})
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setCurrentQ(prev => prev + 1)}
            className="gap-1.5 rounded-full bg-foreground text-card hover:bg-foreground/90"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Question dots */}
      <div className="flex items-center justify-center gap-2">
        {challenge.questions.map((cq, i) => {
          const answered = !!answers[cq.questionId]
          return (
            <button
              key={cq.questionId}
              type="button"
              onClick={() => setCurrentQ(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                i === currentQ
                  ? "bg-foreground text-card"
                  : answered
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ===== Main Challenges Component =====
export function StudentChallenges() {
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedOpponent, setSelectedOpponent] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedChapter, setSelectedChapter] = useState("")
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])
  const [questionSearch, setQuestionSearch] = useState("")
  const [challenges, setChallenges] = useState(mockChallenges)
  const [dialogStep, setDialogStep] = useState<1 | 2>(1)

  // Daily challenge state
  const [dailyChallenges, setDailyChallenges] = useState(mockDailyChallenges)
  const [activeDailyQuiz, setActiveDailyQuiz] = useState<string | null>(null)
  const [milestones, setMilestones] = useState(mockMilestones)
  const [showMilestones, setShowMilestones] = useState(false)
  // Solutions review state
  const [reviewingChallengeId, setReviewingChallengeId] = useState<string | null>(null)
  const [savedAnswers, setSavedAnswers] = useState<Record<string, Record<string, string>>>({})

  const myUserId = currentUserId

  // PvP filtering
  const received = challenges.filter(c => c.toUserId === myUserId && c.status === "pending")
  const sent = challenges.filter(c => c.fromUserId === myUserId && c.status === "pending")
  const active = challenges.filter(c =>
    (c.fromUserId === myUserId || c.toUserId === myUserId) &&
    (c.status === "accepted" || c.status === "in-progress")
  )
  const history = challenges.filter(c =>
    (c.fromUserId === myUserId || c.toUserId === myUserId) &&
    (c.status === "completed" || c.status === "declined")
  )

  const students = mockUsers.filter(u => u.role === "student" && u.id !== myUserId)
  const selectedSubjectObj = mockSubjects.find(s => s.id === selectedSubject)

  // Daily challenge helpers
  const todayDailies = dailyChallenges.filter(dc => dc.date === todayStr)
  const completedToday = todayDailies.filter(dc => dc.isCompleted).length
  const totalTodaySubjects = todayDailies.length

  // Streak calculation (simplified)
  const dailyStreak = 5 // mock streak

  // Question picking for PvP
  const availableQuestions = useMemo(() => {
    if (!selectedSubjectObj || !selectedChapter) return []
    if (selectedChapter === "__all__") {
      return mockQuestions.filter(q => q.subject === selectedSubjectObj.name)
    }
    const chapterObj = selectedSubjectObj.chapters.find(ch => ch.id === selectedChapter)
    if (!chapterObj) return []
    return mockQuestions.filter(
      q => q.subject === selectedSubjectObj.name && q.chapter === chapterObj.name
    )
  }, [selectedSubjectObj, selectedChapter])

  const filteredQuestions = useMemo(() => {
    if (!questionSearch.trim()) return availableQuestions
    const s = questionSearch.toLowerCase()
    return availableQuestions.filter(
      qn => qn.text.toLowerCase().includes(s) || qn.tags.some(t => t.toLowerCase().includes(s))
    )
  }, [availableQuestions, questionSearch])

  // PvP stats
  const totalCompleted = history.filter(c => c.status === "completed").length
  const wins = history.filter(c => c.status === "completed" && c.winnerId === myUserId).length
  const winRate = totalCompleted > 0 ? Math.round((wins / totalCompleted) * 100) : 0

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

  function handleAccept(id: string) {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, status: "accepted" as const } : c))
  }
  function handleDecline(id: string) {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, status: "declined" as const } : c))
  }

  function openCreateDialog() {
    setCreateOpen(true)
    setDialogStep(1)
    setSelectedOpponent("")
    setSelectedSubject("")
    setSelectedChapter("")
    setSelectedQuestionIds([])
    setQuestionSearch("")
  }

  function handleSendChallenge() {
    if (!selectedOpponent || selectedQuestionIds.length === 0) return
    const opponent = students.find(s => s.id === selectedOpponent)
    if (!opponent) return
    const chapterObj = selectedSubjectObj?.chapters.find(ch => ch.id === selectedChapter)
    const newChallenge: Challenge = {
      id: `ch-${Date.now()}`,
      fromUserId: myUserId,
      fromUserName: "Aarav Sharma",
      toUserId: opponent.id,
      toUserName: opponent.name,
      subject: selectedSubjectObj?.name || "",
      chapter: chapterObj?.name || "Mixed",
      questionIds: selectedQuestionIds,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    }
    setChallenges(prev => [newChallenge, ...prev])
    setCreateOpen(false)
  }

  function handleDailyComplete(dcId: string, score: number, answers: Record<string, string>) {
    setDailyChallenges(prev => prev.map(dc =>
      dc.id === dcId ? { ...dc, isCompleted: true, score } : dc
    ))
    setSavedAnswers(prev => ({ ...prev, [dcId]: answers }))
    setActiveDailyQuiz(null)
  }

  function getOpponentName(ch: Challenge) {
    return ch.fromUserId === myUserId ? ch.toUserName : ch.fromUserName
  }
  function getOpponentInitials(ch: Challenge) {
    return getInitials(getOpponentName(ch))
  }
  function didIWin(ch: Challenge) {
    return ch.winnerId === myUserId
  }

  const canProceedToStep2 = selectedOpponent && selectedSubject && selectedChapter

  // If reviewing solutions for a completed challenge
  const reviewDC = dailyChallenges.find(dc => dc.id === reviewingChallengeId)
  if (reviewDC && savedAnswers[reviewDC.id]) {
    return (
      <SolutionsReview
        challenge={reviewDC}
        answers={savedAnswers[reviewDC.id]}
        onBack={() => setReviewingChallengeId(null)}
      />
    )
  }

  // If a daily quiz is active, show the quiz view
  const activeDC = dailyChallenges.find(dc => dc.id === activeDailyQuiz)
  if (activeDC) {
    return (
      <DailyChallengeQuiz
        challenge={activeDC}
        onComplete={(score, answers) => handleDailyComplete(activeDC.id, score, answers)}
        onBack={() => {
          // Check if solutions review was requested
          const solReq = (window as any).__showSolutions
          if (solReq && solReq.challengeId === activeDC.id) {
            setSavedAnswers(prev => ({ ...prev, [activeDC.id]: solReq.answers }))
            setReviewingChallengeId(activeDC.id)
            delete (window as any).__showSolutions
          }
          setActiveDailyQuiz(null)
        }}
      />
    )
  }

  const unlockedMilestones = milestones.filter(m => m.isUnlocked)
  const lockedMilestones = milestones.filter(m => !m.isUnlocked)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Challenges</h1>
          <p className="text-sm text-muted-foreground">Daily practice questions and head-to-head battles</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowMilestones(true)} className="gap-2 rounded-full">
            <Trophy className="h-4 w-4 text-primary" /> Milestones
            <Badge className="ml-1 h-5 min-w-5 rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{unlockedMilestones.length}</Badge>
          </Button>
          <Button onClick={openCreateDialog} className="gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90">
            <Swords className="h-4 w-4" /> PvP Challenge
          </Button>
        </div>
      </div>

      {/* ==================== DAILY CHALLENGES SECTION ==================== */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{"Today's Daily Challenges"}</h2>
              <p className="text-xs text-muted-foreground">5 questions per subject &middot; Earn milestones on completion</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Flame className="h-4 w-4 text-primary" />
              <span className="font-bold text-foreground">{dailyStreak}</span>
              <span className="text-muted-foreground">day streak</span>
            </div>
            <Badge className="gap-1 rounded-full bg-primary/15 text-primary border-none">
              <CheckCircle className="h-3 w-3" /> {completedToday}/{totalTodaySubjects} done
            </Badge>
          </div>
        </div>

        {/* Subject cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {todayDailies.map(dc => (
            <Card key={dc.id} className={`overflow-hidden border bg-gradient-to-br ${subjectColors[dc.subjectName] || "from-muted to-muted/50 border-border"}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${subjectIconBg[dc.subjectName] || "bg-muted text-muted-foreground"}`}>
                    {subjectIcons[dc.subjectName] || <Zap className="h-5 w-5" />}
                  </div>
                  {dc.isCompleted ? (
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-600">{dc.score}/{dc.totalMarks}</span>
                    </div>
                  ) : (
                    <Badge className="rounded-full bg-card/80 text-foreground border-none text-xs">5 Qs</Badge>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">{dc.subjectName}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {dc.isCompleted
                    ? `Scored ${dc.score}/${dc.totalMarks} marks`
                    : "5 questions - 4 marks each"
                  }
                </p>

                {dc.isCompleted ? (
                  <div className="mt-4">
                    <Progress value={(dc.score! / dc.totalMarks) * 100} className="h-2" />
                    <p className="mt-1.5 text-xs text-muted-foreground">{Math.round((dc.score! / dc.totalMarks) * 100)}% accuracy</p>
                    {savedAnswers[dc.id] && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReviewingChallengeId(dc.id)}
                        className="mt-3 w-full gap-2 rounded-full"
                      >
                        <Star className="h-3.5 w-3.5" /> View Solutions
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={() => setActiveDailyQuiz(dc.id)}
                    className="mt-4 w-full gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90"
                    size="sm"
                  >
                    <Play className="h-3.5 w-3.5" /> Start Challenge
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ==================== PVP STATS STRIP ==================== */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: <Swords className="h-5 w-5 text-primary" />, value: totalCompleted + active.length + sent.length, label: "Total Battles" },
          { icon: <Trophy className="h-5 w-5 text-primary" />, value: wins, label: "Victories" },
          { icon: <Target className="h-5 w-5 text-primary" />, value: `${winRate}%`, label: "Win Rate" },
          { icon: <Zap className="h-5 w-5 text-primary" />, value: active.length, label: "Active Now" },
        ].map((stat, i) => (
          <Card key={i} className="border-none bg-muted/60">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Incoming PvP Challenges */}
      {received.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <div className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
            Incoming Challenges ({received.length})
          </h3>
          <div className="space-y-3">
            {received.map(ch => (
              <Card key={ch.id} className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border-2 border-primary/30">
                      <AvatarFallback className="bg-primary/15 text-sm font-bold text-foreground">
                        {getInitials(ch.fromUserName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{ch.fromUserName}</p>
                      <p className="text-xs text-muted-foreground">challenges you</p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center gap-3">
                    <Badge variant="outline" className="border-border">{ch.subject}</Badge>
                    <span className="text-xs text-muted-foreground">{ch.chapter}</span>
                    <span className="text-xs text-muted-foreground">&middot; {ch.questionIds.length} Qs</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Timer className="h-3.5 w-3.5" />
                    <span>Expires {timeAgo(ch.expiresAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="gap-1.5 rounded-full bg-foreground text-card hover:bg-foreground/90" onClick={() => handleAccept(ch.id)}>
                      <Play className="h-3.5 w-3.5" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => handleDecline(ch.id)}>
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* PvP Tabs: Active / Sent / History */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active" className="gap-1.5">
            Active {active.length > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{active.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-1.5">
            Sent {sent.length > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted-foreground/20 px-1 text-[10px] font-bold">{sent.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Active */}
        <TabsContent value="active" className="mt-4 space-y-3">
          {active.length === 0 ? (
            <Card className="border-none bg-muted/60">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Swords className="h-12 w-12 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-medium text-muted-foreground">No active challenges</p>
                <p className="text-xs text-muted-foreground/70">Send a challenge to a batchmate to get started</p>
              </CardContent>
            </Card>
          ) : (
            active.map(ch => (
              <Card key={ch.id} className="border-none bg-muted/60">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-11 w-11 border-2 border-chart-3/40">
                        <AvatarFallback className="bg-chart-3/10 text-sm font-bold text-foreground">
                          {getOpponentInitials(ch)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-chart-3" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">vs {getOpponentName(ch)}</p>
                      <p className="text-xs text-muted-foreground">{ch.subject} &middot; {ch.chapter}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center gap-3">
                    <Badge className={statusConfig[ch.status].color + " gap-1 border-none text-xs"}>
                      {statusConfig[ch.status].icon} {statusConfig[ch.status].label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{ch.questionIds.length} questions</span>
                  </div>
                  {ch.fromScore !== undefined && (
                    <div className="text-sm font-bold text-foreground">
                      Your score: {ch.fromUserId === myUserId ? ch.fromScore : ch.toScore ?? "---"}/{ch.questionIds.length * 4}
                    </div>
                  )}
                  <Button size="sm" className="gap-1.5 rounded-full bg-foreground text-card hover:bg-foreground/90">
                    <Play className="h-3.5 w-3.5" /> Continue
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Sent */}
        <TabsContent value="sent" className="mt-4 space-y-3">
          {sent.length === 0 ? (
            <Card className="border-none bg-muted/60">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Send className="h-12 w-12 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-medium text-muted-foreground">No pending sent challenges</p>
              </CardContent>
            </Card>
          ) : (
            sent.map(ch => (
              <Card key={ch.id} className="border-none bg-muted/60">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border-2 border-border">
                      <AvatarFallback className="bg-muted text-sm font-bold text-foreground">
                        {getOpponentInitials(ch)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{getOpponentName(ch)}</p>
                      <p className="text-xs text-muted-foreground">Waiting for response...</p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center gap-3">
                    <Badge variant="outline" className="border-border">{ch.subject}</Badge>
                    <span className="text-xs text-muted-foreground">{ch.chapter} &middot; {ch.questionIds.length} Qs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Sent {timeAgo(ch.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="mt-4 space-y-3">
          {history.length === 0 ? (
            <Card className="border-none bg-muted/60">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-medium text-muted-foreground">No challenge history yet</p>
              </CardContent>
            </Card>
          ) : (
            history.map(ch => (
              <Card key={ch.id} className={`border-none ${ch.status === "completed" && didIWin(ch) ? "bg-primary/5" : "bg-muted/60"}`}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    {ch.status === "completed" && didIWin(ch) && (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15">
                        <Crown className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    {ch.status === "completed" && !didIWin(ch) && (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                        <ShieldCheck className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    {ch.status === "declined" && (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10">
                        <XCircle className="h-6 w-6 text-destructive" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        vs {getOpponentName(ch)}
                        {ch.status === "completed" && didIWin(ch) && <span className="ml-2 text-xs font-bold text-primary">WON</span>}
                        {ch.status === "completed" && !didIWin(ch) && <span className="ml-2 text-xs font-bold text-muted-foreground">LOST</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{ch.subject} &middot; {ch.chapter}</p>
                    </div>
                  </div>
                  <div className="flex-1" />
                  {ch.status === "completed" && (
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{ch.fromUserId === myUserId ? ch.fromScore : ch.toScore}</p>
                        <p className="text-[10px] text-muted-foreground">You</p>
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">vs</span>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{ch.fromUserId === myUserId ? ch.toScore : ch.fromScore}</p>
                        <p className="text-[10px] text-muted-foreground">{getOpponentName(ch).split(" ")[0]}</p>
                      </div>
                    </div>
                  )}
                  <Badge className={statusConfig[ch.status].color + " gap-1 border-none text-xs"}>
                    {statusConfig[ch.status].icon} {statusConfig[ch.status].label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{timeAgo(ch.createdAt)}</span>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* ==================== MILESTONES DIALOG ==================== */}
      <Dialog open={showMilestones} onOpenChange={setShowMilestones}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> Milestones & Achievements
            </DialogTitle>
            <DialogDescription>
              Complete daily challenges to unlock milestones and earn recognition.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {/* Unlocked */}
            {unlockedMilestones.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unlocked</p>
                <div className="space-y-2">
                  {unlockedMilestones.map(m => (
                    <div key={m.id} className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                        {milestoneIcon(m.icon)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{m.title}</p>
                        <p className="text-xs text-muted-foreground">{m.description}</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked */}
            {lockedMilestones.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">In Progress</p>
                <div className="space-y-2">
                  {lockedMilestones.map(m => (
                    <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        {milestoneIcon(m.icon)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{m.title}</p>
                        <p className="text-xs text-muted-foreground">{m.description}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Progress value={(m.current / m.requirement) * 100} className="h-1.5 flex-1" />
                          <span className="text-[10px] font-bold text-muted-foreground">{m.current}/{m.requirement}</span>
                        </div>
                      </div>
                      <Lock className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ==================== PVP CREATE DIALOG ==================== */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" /> Send a Challenge
            </DialogTitle>
            <DialogDescription>
              {dialogStep === 1 ? "Pick a batchmate and choose the topic." : "Select the questions for this duel."}
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
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Challenge who?</label>
                <Select value={selectedOpponent} onValueChange={setSelectedOpponent}>
                  <SelectTrigger><SelectValue placeholder="Select a batchmate" /></SelectTrigger>
                  <SelectContent>
                    {students.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        <span className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
                            {getInitials(s.name)}
                          </span>
                          {s.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            </div>
          )}

          {dialogStep === 2 && (
            <div className="space-y-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search questions by text or tag..."
                  value={questionSearch}
                  onChange={e => setQuestionSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {selectedQuestionIds.length} question{selectedQuestionIds.length !== 1 ? "s" : ""} selected
                </p>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={selectAllVisible}>
                  {filteredQuestions.length > 0 && filteredQuestions.every(q => selectedQuestionIds.includes(q.id)) ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {filteredQuestions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Search className="h-8 w-8 text-muted-foreground/40" />
                    <p className="mt-2 text-sm text-muted-foreground">No questions found</p>
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
                disabled={!canProceedToStep2}
                onClick={() => setDialogStep(2)}
                className="gap-1.5 bg-foreground text-card hover:bg-foreground/90"
              >
                Pick Questions <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                disabled={selectedQuestionIds.length === 0}
                onClick={handleSendChallenge}
                className="gap-2 bg-foreground text-card hover:bg-foreground/90"
              >
                <Send className="h-4 w-4" /> Send ({selectedQuestionIds.length} Qs)
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
