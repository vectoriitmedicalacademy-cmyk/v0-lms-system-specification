"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  BookOpen, Plus, Calendar, Clock, Tag, Smile, Meh, Frown,
  AlertTriangle as FrownIcon, ChevronRight, Star, CheckCircle2,
  Circle, Edit3, Trash2, Heart, Search, FileText, Lightbulb,
  Send, MessageSquare, ChevronLeft, X, Zap
} from "lucide-react"
import type { JournalEntry, MistakeEntry, FormulaSheet, WeeklyReflection } from "@/lib/types"
import {
  mockJournalEntries, mockMistakes, mockFormulaSheets, mockWeeklyReflections
} from "@/lib/mock-data"

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
}

const moodConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  great: { icon: <Smile className="h-4 w-4" />, label: "Great", color: "text-emerald-600", bg: "bg-emerald-500/15" },
  good: { icon: <Smile className="h-4 w-4" />, label: "Good", color: "text-primary", bg: "bg-primary/15" },
  okay: { icon: <Meh className="h-4 w-4" />, label: "Okay", color: "text-yellow-600", bg: "bg-yellow-500/15" },
  bad: { icon: <Frown className="h-4 w-4" />, label: "Bad", color: "text-orange-600", bg: "bg-orange-500/15" },
  terrible: { icon: <FrownIcon className="h-4 w-4" />, label: "Terrible", color: "text-destructive", bg: "bg-destructive/15" },
}

export function StudentJournal() {
  const [activeTab, setActiveTab] = useState("daily")
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries)
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(mockMistakes)
  const [formulaSheets, setFormulaSheets] = useState<FormulaSheet[]>(mockFormulaSheets)
  const [reflections, setReflections] = useState<WeeklyReflection[]>(mockWeeklyReflections)

  // New entry dialogs
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [showNewMistake, setShowNewMistake] = useState(false)
  const [showNewFormula, setShowNewFormula] = useState(false)

  // New journal entry form
  const [newEntry, setNewEntry] = useState({ title: "", content: "", mood: "good" as JournalEntry["mood"], studyHours: 0, tags: "" })
  // New mistake form
  const [newMistake, setNewMistake] = useState({ subject: "", chapter: "", question: "", myAnswer: "", correctAnswer: "", whyWrong: "", conceptNote: "" })
  // New formula form
  const [newFormula, setNewFormula] = useState({ subject: "", title: "", content: "" })

  // Viewing formula detail
  const [viewingFormula, setViewingFormula] = useState<FormulaSheet | null>(null)

  // Search
  const [searchQuery, setSearchQuery] = useState("")

  // Active reflection editing
  const currentReflection = reflections.find(r => !r.isSubmitted)

  function saveJournalEntry() {
    if (!newEntry.title.trim()) return
    const entry: JournalEntry = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      studyHours: newEntry.studyHours,
      tags: newEntry.tags.split(",").map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    }
    setJournalEntries(prev => [entry, ...prev])
    setNewEntry({ title: "", content: "", mood: "good", studyHours: 0, tags: "" })
    setShowNewEntry(false)
  }

  function saveMistake() {
    if (!newMistake.question.trim()) return
    const m: MistakeEntry = {
      id: `mk-${Date.now()}`,
      ...newMistake,
      isResolved: false,
      createdAt: new Date().toISOString(),
    }
    setMistakes(prev => [m, ...prev])
    setNewMistake({ subject: "", chapter: "", question: "", myAnswer: "", correctAnswer: "", whyWrong: "", conceptNote: "" })
    setShowNewMistake(false)
  }

  function saveFormula() {
    if (!newFormula.title.trim()) return
    const subjectColors: Record<string, string> = { Physics: "hsl(217, 91%, 50%)", Chemistry: "hsl(152, 60%, 42%)", Mathematics: "hsl(38, 92%, 50%)" }
    const f: FormulaSheet = {
      id: `fs-${Date.now()}`,
      subject: newFormula.subject,
      title: newFormula.title,
      content: newFormula.content,
      color: subjectColors[newFormula.subject] || "hsl(217, 91%, 50%)",
      isFavorite: false,
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    setFormulaSheets(prev => [f, ...prev])
    setNewFormula({ subject: "", title: "", content: "" })
    setShowNewFormula(false)
  }

  function submitReflection(id: string, data: { wentWell: string; didntGoWell: string; goalNextWeek: string }) {
    setReflections(prev => prev.map(r =>
      r.id === id ? { ...r, ...data, isSubmitted: true, submittedAt: new Date().toISOString() } : r
    ))
  }

  const isSunday = new Date().getDay() === 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Journal</h1>
          <p className="text-sm text-muted-foreground">Track your daily routine, log mistakes, and reflect on your progress</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Sunday reminder */}
          {isSunday && currentReflection && !currentReflection.isSubmitted && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm font-medium text-primary"
            >
              <Zap className="h-4 w-4" />
              Weekly Reflection Due Today
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 rounded-full bg-muted/50 p-1">
            <TabsTrigger value="daily" className="rounded-full text-xs sm:text-sm">Daily Log</TabsTrigger>
            <TabsTrigger value="mistakes" className="rounded-full text-xs sm:text-sm">Mistake Book</TabsTrigger>
            <TabsTrigger value="formulas" className="rounded-full text-xs sm:text-sm">Formula Sheets</TabsTrigger>
            <TabsTrigger value="reflection" className="rounded-full text-xs sm:text-sm">Weekly Reflection</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ===== DAILY LOG TAB ===== */}
        {activeTab === "daily" && (
          <motion.div key="daily" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{journalEntries.length} entries</p>
              <Dialog open={showNewEntry} onOpenChange={setShowNewEntry}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90">
                    <Plus className="h-4 w-4" /> New Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>New Journal Entry</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-2">
                    <Input placeholder="Title - e.g. Productive day, Mock test prep..." value={newEntry.title} onChange={e => setNewEntry(p => ({ ...p, title: e.target.value }))} />
                    <Textarea placeholder="Write about your day... What did you study? How did it go? Any thoughts?" rows={5} value={newEntry.content} onChange={e => setNewEntry(p => ({ ...p, content: e.target.value }))} />
                    <div className="flex flex-wrap gap-3">
                      <div>
                        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Mood</p>
                        <div className="flex gap-1.5">
                          {Object.entries(moodConfig).map(([key, val]) => (
                            <button key={key} onClick={() => setNewEntry(p => ({ ...p, mood: key as JournalEntry["mood"] }))} className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${newEntry.mood === key ? `${val.bg} ${val.color}` : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                              {val.icon}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Study Hours</p>
                        <Input type="number" step={0.5} min={0} max={18} className="w-20" value={newEntry.studyHours || ""} onChange={e => setNewEntry(p => ({ ...p, studyHours: parseFloat(e.target.value) || 0 }))} />
                      </div>
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">Tags (comma separated)</p>
                      <Input placeholder="Physics, Revision, DPP..." value={newEntry.tags} onChange={e => setNewEntry(p => ({ ...p, tags: e.target.value }))} />
                    </div>
                    <Button onClick={saveJournalEntry} className="w-full rounded-full bg-foreground text-card hover:bg-foreground/90">Save Entry</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Entries list */}
            <div className="space-y-3">
              {journalEntries.map((entry, i) => {
                const mood = moodConfig[entry.mood]
                return (
                  <motion.div key={entry.id} custom={i} variants={cardVariants} initial="hidden" animate="visible" className="card-hover rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${mood.bg} ${mood.color}`}>
                          {mood.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{entry.title}</h3>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(entry.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                            <span className="text-border">|</span>
                            <Clock className="h-3 w-3" />
                            {entry.studyHours}h studied
                          </div>
                        </div>
                      </div>
                      <Badge className={`${mood.bg} ${mood.color} border-none text-xs`}>{mood.label}</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{entry.content}</p>
                    {entry.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {entry.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                            <Tag className="h-2.5 w-2.5" />{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ===== MISTAKE BOOK TAB ===== */}
        {activeTab === "mistakes" && (
          <motion.div key="mistakes" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="space-y-4">
            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Mistakes", value: mistakes.length, color: "text-foreground" },
                { label: "Resolved", value: mistakes.filter(m => m.isResolved).length, color: "text-emerald-600" },
                { label: "Pending", value: mistakes.filter(m => !m.isResolved).length, color: "text-destructive" },
              ].map((stat, i) => (
                <motion.div key={stat.label} custom={i} variants={cardVariants} initial="hidden" animate="visible" className="rounded-xl border border-border bg-card p-3 text-center">
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input type="text" placeholder="Search mistakes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-40 border-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
              </div>
              <Dialog open={showNewMistake} onOpenChange={setShowNewMistake}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90">
                    <Plus className="h-4 w-4" /> Log Mistake
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Log a Mistake</DialogTitle></DialogHeader>
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Subject</p>
                        <select value={newMistake.subject} onChange={e => setNewMistake(p => ({ ...p, subject: e.target.value }))} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
                          <option value="">Select</option>
                          <option>Physics</option>
                          <option>Chemistry</option>
                          <option>Mathematics</option>
                          <option>Biology</option>
                        </select>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Chapter</p>
                        <Input value={newMistake.chapter} onChange={e => setNewMistake(p => ({ ...p, chapter: e.target.value }))} placeholder="e.g. Mechanics" />
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Question</p>
                      <Textarea rows={2} value={newMistake.question} onChange={e => setNewMistake(p => ({ ...p, question: e.target.value }))} placeholder="Write the question you got wrong..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="mb-1 text-xs font-medium text-muted-foreground">My Answer</p>
                        <Input value={newMistake.myAnswer} onChange={e => setNewMistake(p => ({ ...p, myAnswer: e.target.value }))} placeholder="What I wrote" />
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Correct Answer</p>
                        <Input value={newMistake.correctAnswer} onChange={e => setNewMistake(p => ({ ...p, correctAnswer: e.target.value }))} placeholder="Actual answer" />
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Why I Got It Wrong</p>
                      <Textarea rows={2} value={newMistake.whyWrong} onChange={e => setNewMistake(p => ({ ...p, whyWrong: e.target.value }))} placeholder="What was my mistake? Conceptual error? Silly mistake?" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Concept Note / Takeaway</p>
                      <Textarea rows={2} value={newMistake.conceptNote} onChange={e => setNewMistake(p => ({ ...p, conceptNote: e.target.value }))} placeholder="What should I remember next time?" />
                    </div>
                    <Button onClick={saveMistake} className="w-full rounded-full bg-foreground text-card hover:bg-foreground/90">Save Mistake</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mistakes list */}
            <div className="space-y-3">
              {mistakes
                .filter(m => !searchQuery || m.question.toLowerCase().includes(searchQuery.toLowerCase()) || m.subject.toLowerCase().includes(searchQuery.toLowerCase()) || m.chapter.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((m, i) => {
                const subjectColors: Record<string, string> = { Physics: "bg-blue-500/15 text-blue-600", Chemistry: "bg-emerald-500/15 text-emerald-600", Mathematics: "bg-amber-500/15 text-amber-600", Biology: "bg-purple-500/15 text-purple-600" }
                return (
                  <motion.div key={m.id} custom={i} variants={cardVariants} initial="hidden" animate="visible" className="card-hover rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => setMistakes(prev => prev.map(mk => mk.id === m.id ? { ...mk, isResolved: !mk.isResolved } : mk))}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {m.isResolved ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground/40" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={`${subjectColors[m.subject] || "bg-muted text-muted-foreground"} border-none text-[10px]`}>{m.subject}</Badge>
                            <span className="text-xs text-muted-foreground">{m.chapter}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(m.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                          </div>
                          <p className={`mt-2 text-sm font-medium leading-relaxed ${m.isResolved ? "text-muted-foreground line-through" : "text-foreground"}`}>{m.question}</p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-8 mt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-destructive/10 p-2.5">
                          <p className="text-[10px] font-semibold text-destructive">My Answer</p>
                          <p className="mt-0.5 text-xs text-foreground">{m.myAnswer}</p>
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 p-2.5">
                          <p className="text-[10px] font-semibold text-emerald-600">Correct Answer</p>
                          <p className="mt-0.5 text-xs text-foreground">{m.correctAnswer}</p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-orange-500/10 p-2.5">
                        <p className="text-[10px] font-semibold text-orange-600">Why I Got It Wrong</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-foreground">{m.whyWrong}</p>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-2.5">
                        <div className="flex items-center gap-1">
                          <Lightbulb className="h-3 w-3 text-primary" />
                          <p className="text-[10px] font-semibold text-primary">Takeaway</p>
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-foreground">{m.conceptNote}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ===== FORMULA SHEETS TAB ===== */}
        {activeTab === "formulas" && (
          <motion.div key="formulas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{formulaSheets.length} sheets</p>
              <Dialog open={showNewFormula} onOpenChange={setShowNewFormula}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90">
                    <Plus className="h-4 w-4" /> New Sheet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>New Formula Sheet</DialogTitle></DialogHeader>
                  <div className="space-y-3 pt-2">
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Subject</p>
                      <select value={newFormula.subject} onChange={e => setNewFormula(p => ({ ...p, subject: e.target.value }))} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
                        <option value="">Select Subject</option>
                        <option>Physics</option>
                        <option>Chemistry</option>
                        <option>Mathematics</option>
                        <option>Biology</option>
                      </select>
                    </div>
                    <Input placeholder="Title - e.g. Electrostatics Formulas" value={newFormula.title} onChange={e => setNewFormula(p => ({ ...p, title: e.target.value }))} />
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Formulas (one per line)</p>
                      <Textarea rows={8} value={newFormula.content} onChange={e => setNewFormula(p => ({ ...p, content: e.target.value }))} placeholder={"F = kq1q2/r\u00B2\nE = F/q\nV = kq/r\n..."} className="font-mono text-sm" />
                    </div>
                    <Button onClick={saveFormula} className="w-full rounded-full bg-foreground text-card hover:bg-foreground/90">Save Sheet</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Formula cards grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {formulaSheets.map((fs, i) => (
                <motion.button
                  key={fs.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -3, scale: 1.01 }}
                  onClick={() => setViewingFormula(fs)}
                  className="card-hover group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-left"
                >
                  {/* Color accent bar */}
                  <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl" style={{ background: fs.color }} />

                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="border-none bg-muted text-muted-foreground text-[10px]">{fs.subject}</Badge>
                      <h3 className="mt-2 text-sm font-semibold text-foreground">{fs.title}</h3>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setFormulaSheets(prev => prev.map(f => f.id === fs.id ? { ...f, isFavorite: !f.isFavorite } : f)) }}
                      className="flex-shrink-0"
                    >
                      <Star className={`h-4 w-4 ${fs.isFavorite ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                    </button>
                  </div>

                  <pre className="mt-3 line-clamp-4 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-muted-foreground">{fs.content}</pre>
                  <p className="mt-2 text-[10px] text-muted-foreground">Updated {fs.updatedAt}</p>
                </motion.button>
              ))}
            </div>

            {/* Formula detail dialog */}
            <Dialog open={!!viewingFormula} onOpenChange={() => setViewingFormula(null)}>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                {viewingFormula && (
                  <>
                    <DialogHeader>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ background: viewingFormula.color }} />
                        <Badge className="border-none bg-muted text-muted-foreground text-xs">{viewingFormula.subject}</Badge>
                      </div>
                      <DialogTitle className="text-lg">{viewingFormula.title}</DialogTitle>
                    </DialogHeader>
                    <div className="rounded-xl bg-muted/50 p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-loose text-foreground">{viewingFormula.content}</pre>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </motion.div>
        )}

        {/* ===== WEEKLY REFLECTION TAB ===== */}
        {activeTab === "reflection" && (
          <motion.div key="reflection" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="space-y-5">
            {/* Sunday banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-primary/20 bg-primary/5 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Weekly Reflection</h3>
                  <p className="text-xs text-muted-foreground">
                    {isSunday ? "Today is Sunday - time to reflect on your week!" : "Every Sunday, take 5 minutes to reflect. Your mentor will review it."}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Current week reflection form */}
            {currentReflection && !currentReflection.isSubmitted && (
              <ReflectionForm
                reflection={currentReflection}
                onSubmit={(data) => submitReflection(currentReflection.id, data)}
              />
            )}

            {/* Past reflections */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Past Reflections</h3>
              {reflections.filter(r => r.isSubmitted).map((r, i) => (
                <motion.div key={r.id} custom={i} variants={cardVariants} initial="hidden" animate="visible" className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Week of {new Date(r.weekStart).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - {new Date(r.weekEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <Badge className="border-none bg-emerald-500/15 text-emerald-600 text-[10px]">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Submitted
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl bg-emerald-500/5 p-3">
                      <p className="mb-1 text-[10px] font-semibold text-emerald-600">What went well</p>
                      <p className="text-sm leading-relaxed text-foreground">{r.wentWell}</p>
                    </div>
                    <div className="rounded-xl bg-destructive/5 p-3">
                      <p className="mb-1 text-[10px] font-semibold text-destructive">{"What didn't go well"}</p>
                      <p className="text-sm leading-relaxed text-foreground">{r.didntGoWell}</p>
                    </div>
                    <div className="rounded-xl bg-primary/5 p-3">
                      <p className="mb-1 text-[10px] font-semibold text-primary">Goal for next week</p>
                      <p className="text-sm leading-relaxed text-foreground">{r.goalNextWeek}</p>
                    </div>

                    {/* Mentor reply */}
                    {r.mentorReply && (
                      <div className="mt-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
                            <BookOpen className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-primary">{r.mentorName}</p>
                            <p className="text-[10px] text-primary/70">Mentor Reply</p>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground">{r.mentorReply}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===== Weekly Reflection Form =====
function ReflectionForm({
  reflection,
  onSubmit,
}: {
  reflection: WeeklyReflection
  onSubmit: (data: { wentWell: string; didntGoWell: string; goalNextWeek: string }) => void
}) {
  const [wentWell, setWentWell] = useState(reflection.wentWell)
  const [didntGoWell, setDidntGoWell] = useState(reflection.didntGoWell)
  const [goalNextWeek, setGoalNextWeek] = useState(reflection.goalNextWeek)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (!wentWell.trim() || !didntGoWell.trim() || !goalNextWeek.trim()) return
    onSubmit({ wentWell, didntGoWell, goalNextWeek })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-7 w-7 text-emerald-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Reflection Submitted</h3>
        <p className="text-sm text-muted-foreground">Your mentor will review it and may leave a reply. Keep reflecting every week!</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            This Week: {new Date(reflection.weekStart).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - {new Date(reflection.weekEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </h3>
          <p className="text-xs text-muted-foreground">Visible to your mentor after submission</p>
        </div>
        <Badge className="border-none bg-primary/15 text-primary text-xs">Current Week</Badge>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" /> What went well this week?
          </label>
          <Textarea rows={3} value={wentWell} onChange={e => setWentWell(e.target.value)} placeholder="Topics mastered, tests scores improved, habits maintained..." className="border-emerald-500/20 focus:border-emerald-500/40" />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-destructive">
            <X className="h-3.5 w-3.5" /> {"What didn't go well?"}
          </label>
          <Textarea rows={3} value={didntGoWell} onChange={e => setDidntGoWell(e.target.value)} placeholder="Missed lectures, low test scores, distractions..." className="border-destructive/20 focus:border-destructive/40" />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Zap className="h-3.5 w-3.5" /> Goal for next week
          </label>
          <Textarea rows={2} value={goalNextWeek} onChange={e => setGoalNextWeek(e.target.value)} placeholder="Complete 3 chapters, maintain study streak, solve 100 MCQs..." className="border-primary/20 focus:border-primary/40" />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!wentWell.trim() || !didntGoWell.trim() || !goalNextWeek.trim()}
          className="w-full gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90"
        >
          <Send className="h-4 w-4" /> Submit Reflection
        </Button>
      </div>
    </motion.div>
  )
}
