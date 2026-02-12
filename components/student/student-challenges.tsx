"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Swords, Trophy, Clock, CheckCircle, XCircle,
  Send, Search, Zap, Target, Crown, ArrowRight,
  Timer, Play, ShieldCheck, ChevronRight, ChevronLeft
} from "lucide-react"
import { mockChallenges, mockUsers, mockSubjects, mockQuestions } from "@/lib/mock-data"
import type { Challenge, Question } from "@/lib/types"

const currentUserId = "u1"

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

export function StudentChallenges() {
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedOpponent, setSelectedOpponent] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedChapter, setSelectedChapter] = useState("")
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])
  const [questionSearch, setQuestionSearch] = useState("")
  const [challenges, setChallenges] = useState(mockChallenges)
  const [dialogStep, setDialogStep] = useState<1 | 2>(1) // Step 1: opponent/subject, Step 2: pick questions

  const myUserId = currentUserId

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

  // Filter questions by selected subject/chapter
  const availableQuestions = useMemo(() => {
    if (!selectedSubjectObj || !selectedChapter) return []
    const chapterObj = selectedSubjectObj.chapters.find(ch => ch.id === selectedChapter)
    if (!chapterObj) return []
    return mockQuestions.filter(
      q => q.subject === selectedSubjectObj.name && q.chapter === chapterObj.name
    )
  }, [selectedSubjectObj, selectedChapter])

  const filteredQuestions = useMemo(() => {
    if (!questionSearch.trim()) return availableQuestions
    const q = questionSearch.toLowerCase()
    return availableQuestions.filter(
      qn => qn.text.toLowerCase().includes(q) || qn.tags.some(t => t.toLowerCase().includes(q))
    )
  }, [availableQuestions, questionSearch])

  // Also show all questions from that subject if chapter is "all"
  const allSubjectQuestions = useMemo(() => {
    if (!selectedSubjectObj) return []
    return mockQuestions.filter(q => q.subject === selectedSubjectObj.name)
  }, [selectedSubjectObj])

  const questionsToShow = selectedChapter === "__all__" ? allSubjectQuestions : filteredQuestions

  // Stats
  const totalCompleted = history.filter(c => c.status === "completed").length
  const wins = history.filter(c => c.status === "completed" && c.winnerId === myUserId).length
  const winRate = totalCompleted > 0 ? Math.round((wins / totalCompleted) * 100) : 0

  function toggleQuestion(qId: string) {
    setSelectedQuestionIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    )
  }

  function selectAllVisible() {
    const allIds = questionsToShow.map(q => q.id)
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

  function getOpponentName(challenge: Challenge) {
    return challenge.fromUserId === myUserId ? challenge.toUserName : challenge.fromUserName
  }

  function getOpponentInitials(challenge: Challenge) {
    return getInitials(getOpponentName(challenge))
  }

  function didIWin(challenge: Challenge) {
    return challenge.winnerId === myUserId
  }

  const canProceedToStep2 = selectedOpponent && selectedSubject && selectedChapter

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Challenges</h1>
          <p className="text-sm text-muted-foreground">Challenge your batchmates and test your knowledge head-to-head</p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90">
          <Swords className="h-4 w-4" /> New Challenge
        </Button>
      </div>

      {/* Stats Strip */}
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

      {/* Incoming Challenges */}
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

      {/* Tabs: Active / Sent / History */}
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

      {/* Create Challenge Dialog - 2-step wizard */}
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
              {/* Opponent */}
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

              {/* Select all toggle */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {selectedQuestionIds.length} question{selectedQuestionIds.length !== 1 ? "s" : ""} selected
                </p>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={selectAllVisible}>
                  {questionsToShow.length > 0 && questionsToShow.every(q => selectedQuestionIds.includes(q.id)) ? "Deselect All" : "Select All"}
                </Button>
              </div>

              {/* Question list */}
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {questionsToShow.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Search className="h-8 w-8 text-muted-foreground/40" />
                    <p className="mt-2 text-sm text-muted-foreground">No questions found for this selection</p>
                    <p className="text-xs text-muted-foreground/70">Try a different chapter or subject</p>
                  </div>
                ) : (
                  questionsToShow.map((q, idx) => {
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
