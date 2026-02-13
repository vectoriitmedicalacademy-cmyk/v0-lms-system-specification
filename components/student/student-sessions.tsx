"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Video, Phone, Calendar, Clock, Star, Users, ChevronRight,
  CheckCircle2, XCircle, ExternalLink, Search, Filter,
  BookOpen, MessageCircle, Play, RadioTower, User, ArrowRight
} from "lucide-react"
import {
  mockTeachers, mockCounsellingSlots, mockLiveDoubtSessions
} from "@/lib/mock-data"
import type { CounsellingSlot, LiveDoubtSession } from "@/lib/types"

const subjectColors: Record<string, string> = {
  Physics: "bg-blue-500/15 text-blue-600",
  Chemistry: "bg-emerald-500/15 text-emerald-600",
  Mathematics: "bg-amber-500/15 text-amber-600",
  Biology: "bg-purple-500/15 text-purple-600",
}

const subjectDot: Record<string, string> = {
  Physics: "bg-blue-500",
  Chemistry: "bg-emerald-500",
  Mathematics: "bg-amber-500",
  Biology: "bg-purple-500",
}

const stagger = { animate: { transition: { staggerChildren: 0.06 } } }
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

type TabId = "book" | "my-sessions" | "live-doubts"

export function StudentSessions() {
  const [activeTab, setActiveTab] = useState<TabId>("book")
  const [slots, setSlots] = useState(mockCounsellingSlots)
  const [liveSessions, setLiveSessions] = useState(mockLiveDoubtSessions)
  const [filterSubject, setFilterSubject] = useState<string>("All")
  const [bookingSlot, setBookingSlot] = useState<CounsellingSlot | null>(null)
  const [bookingTopic, setBookingTopic] = useState("")
  const [joiningSession, setJoiningSession] = useState<LiveDoubtSession | null>(null)

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "book", label: "Book Session", icon: <Calendar className="h-4 w-4" /> },
    { id: "my-sessions", label: "My Sessions", icon: <Phone className="h-4 w-4" /> },
    { id: "live-doubts", label: "Live Doubt Sessions", icon: <RadioTower className="h-4 w-4" /> },
  ]

  const subjects = ["All", "Physics", "Chemistry", "Mathematics", "Biology"]

  // --- booking flow ---
  function confirmBooking() {
    if (!bookingSlot) return
    setSlots(prev =>
      prev.map(s =>
        s.id === bookingSlot.id
          ? { ...s, status: "booked" as const, bookedBy: "u1", bookedByName: "Aarav Sharma", topic: bookingTopic || "General doubt", meetLink: `https://meet.vector.edu/session-${s.id}` }
          : s
      )
    )
    setBookingSlot(null)
    setBookingTopic("")
    setActiveTab("my-sessions")
  }

  function cancelBooking(slotId: string) {
    setSlots(prev =>
      prev.map(s =>
        s.id === slotId
          ? { ...s, status: "available" as const, bookedBy: undefined, bookedByName: undefined, topic: undefined, meetLink: undefined }
          : s
      )
    )
  }

  function joinLiveSession(sessionId: string) {
    setLiveSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? { ...s, joinedCount: s.joinedCount + 1 }
          : s
      )
    )
    setJoiningSession(null)
  }

  // derived data
  const mySessions = slots.filter(s => s.bookedBy === "u1")
  const upcomingSessions = mySessions.filter(s => s.status === "booked")
  const pastSessions = mySessions.filter(s => s.status === "completed")

  const availableSlots = slots.filter(s => s.status === "available" && (filterSubject === "All" || s.subject === filterSubject))
  const filteredLive = liveSessions.filter(s => filterSubject === "All" || s.subject === filterSubject)

  // Group available slots by date
  const slotsByDate: Record<string, CounsellingSlot[]> = {}
  availableSlots.forEach(s => {
    if (!slotsByDate[s.date]) slotsByDate[s.date] = []
    slotsByDate[s.date].push(s)
  })

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })
  }
  function formatDateTime(d: string) {
    return new Date(d).toLocaleString("en-IN", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">1-on-1 Sessions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Book private sessions with teachers or join live group doubt clearing sessions</p>
      </motion.div>

      {/* Tabs */}
      <motion.div {...fadeUp} className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-foreground text-card"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon} {tab.label}
            {tab.id === "my-sessions" && upcomingSessions.length > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {upcomingSessions.length}
              </span>
            )}
            {tab.id === "live-doubts" && liveSessions.filter(s => s.status === "live").length > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                LIVE
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Subject filter */}
      <motion.div {...fadeUp} className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {subjects.map(subj => (
          <button
            key={subj}
            onClick={() => setFilterSubject(subj)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              filterSubject === subj
                ? "bg-foreground text-card"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {subj}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {/* === BOOK SESSION TAB === */}
          {activeTab === "book" && (
            <div className="space-y-6">
              {/* Teachers grid */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Our Faculty</h3>
                <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {mockTeachers
                    .filter(t => filterSubject === "All" || t.subject === filterSubject)
                    .map(teacher => (
                    <motion.div key={teacher.id} variants={fadeUp} className="card-hover rounded-2xl border border-border bg-card p-4">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${subjectDot[teacher.subject]} text-white text-sm font-bold`}>
                          {teacher.name.split(" ").slice(-1)[0][0]}{teacher.name.split(" ").slice(-2)[0]?.[0] || ""}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{teacher.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge className={`${subjectColors[teacher.subject]} border-none text-[10px]`}>{teacher.subject}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground truncate">{teacher.specialization}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {teacher.rating}
                        </span>
                        <span>{teacher.totalSessions} sessions</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Available slots by date */}
              {Object.keys(slotsByDate).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
                  <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-3 text-sm font-medium text-muted-foreground">No available slots for this subject</p>
                  <p className="text-xs text-muted-foreground/70">Try selecting a different subject or check back later</p>
                </div>
              ) : (
                Object.entries(slotsByDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, dateSlots]) => (
                  <div key={date}>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Calendar className="h-4 w-4 text-primary" /> {formatDate(date)}
                      <span className="text-xs font-normal text-muted-foreground">({dateSlots.length} slots)</span>
                    </h3>
                    <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {dateSlots.map(slot => (
                        <motion.div key={slot.id} variants={fadeUp} className="card-hover rounded-2xl border border-border bg-card p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${subjectDot[slot.subject]} text-white`}>
                                <Video className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{slot.teacherName}</p>
                                <Badge className={`${subjectColors[slot.subject]} border-none text-[10px] mt-0.5`}>{slot.subject}</Badge>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-[10px]">1-on-1</Badge>
                          </div>
                          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {slot.startTime} - {slot.endTime}</span>
                            <span>30 min</span>
                          </div>
                          <Button
                            onClick={() => setBookingSlot(slot)}
                            className="mt-3 w-full gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90"
                            size="sm"
                          >
                            <Calendar className="h-3.5 w-3.5" /> Book This Slot
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* === MY SESSIONS TAB === */}
          {activeTab === "my-sessions" && (
            <div className="space-y-6">
              {/* Upcoming */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  Upcoming Sessions ({upcomingSessions.length})
                </h3>
                {upcomingSessions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                    <Phone className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No upcoming sessions</p>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("book")} className="mt-3 gap-2 rounded-full">
                      <Calendar className="h-3.5 w-3.5" /> Book a Session
                    </Button>
                  </div>
                ) : (
                  <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
                    {upcomingSessions.map(session => (
                      <motion.div key={session.id} variants={fadeUp} className="card-hover rounded-2xl border border-primary/20 bg-primary/5 p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-full ${subjectDot[session.subject]} text-white`}>
                              <Video className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{session.teacherName}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge className={`${subjectColors[session.subject]} border-none text-[10px]`}>{session.subject}</Badge>
                                <span className="text-xs text-muted-foreground">{formatDate(session.date)}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-primary/15 text-primary border-none text-xs">{session.startTime}</Badge>
                        </div>
                        {session.topic && (
                          <div className="mt-3 rounded-xl bg-card border border-border p-3">
                            <p className="text-xs text-muted-foreground">Topic</p>
                            <p className="text-sm text-foreground">{session.topic}</p>
                          </div>
                        )}
                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            size="sm"
                            className="flex-1 gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90"
                            onClick={() => window.open(session.meetLink, "_blank")}
                          >
                            <Video className="h-3.5 w-3.5" /> Join Session
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => cancelBooking(session.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Past sessions */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Past Sessions ({pastSessions.length})</h3>
                {pastSessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No past sessions yet.</p>
                ) : (
                  <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
                    {pastSessions.map(session => (
                      <motion.div key={session.id} variants={fadeUp} className="rounded-2xl border border-border bg-card p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{session.teacherName}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge className={`${subjectColors[session.subject]} border-none text-[10px]`}>{session.subject}</Badge>
                                <span className="text-xs text-muted-foreground">{formatDate(session.date)} at {session.startTime}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">Completed</Badge>
                        </div>
                        {session.topic && (
                          <p className="mt-2 text-sm text-muted-foreground"><span className="font-medium text-foreground">Topic:</span> {session.topic}</p>
                        )}
                        {session.notes && (
                          <div className="mt-2 rounded-xl bg-muted/50 border border-border p-3">
                            <p className="text-xs font-medium text-muted-foreground">Teacher Notes</p>
                            <p className="mt-0.5 text-sm text-foreground">{session.notes}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* === LIVE DOUBT SESSIONS TAB === */}
          {activeTab === "live-doubts" && (
            <div className="space-y-6">
              {/* Live now */}
              {filteredLive.filter(s => s.status === "live").length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive"></span>
                    </span>
                    Happening Now
                  </h3>
                  <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
                    {filteredLive.filter(s => s.status === "live").map(session => (
                      <motion.div key={session.id} variants={fadeUp} className="card-hover rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`relative flex h-12 w-12 items-center justify-center rounded-full ${subjectDot[session.subject]} text-white`}>
                              <RadioTower className="h-5 w-5" />
                              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-white ring-2 ring-card">
                                !
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{session.topic}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge className={`${subjectColors[session.subject]} border-none text-[10px]`}>{session.subject}</Badge>
                                <span className="text-xs text-muted-foreground">by {session.teacherName}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-destructive text-destructive-foreground border-none animate-pulse text-xs">LIVE</Badge>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{session.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {session.joinedCount}/{session.maxCapacity} joined</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {session.duration} min</span>
                          </div>
                          <Button
                            size="sm"
                            className="gap-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => setJoiningSession(session)}
                          >
                            <Play className="h-3.5 w-3.5" /> Join Now
                          </Button>
                        </div>
                        <Progress value={(session.joinedCount / session.maxCapacity) * 100} className="mt-3 h-1.5" />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Upcoming sessions */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Upcoming Doubt Sessions ({filteredLive.filter(s => s.status === "upcoming").length})
                </h3>
                {filteredLive.filter(s => s.status === "upcoming").length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                    <RadioTower className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No upcoming sessions for this subject</p>
                  </div>
                ) : (
                  <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-3 sm:grid-cols-2">
                    {filteredLive.filter(s => s.status === "upcoming").map(session => (
                      <motion.div key={session.id} variants={fadeUp} className="card-hover rounded-2xl border border-border bg-card p-5">
                        <div className="flex items-start gap-3">
                          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${subjectDot[session.subject]} text-white`}>
                            <Video className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground line-clamp-1">{session.topic}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge className={`${subjectColors[session.subject]} border-none text-[10px]`}>{session.subject}</Badge>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{session.description}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {session.teacherName}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDateTime(session.scheduledAt)}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {session.duration} min</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" /> {session.joinedCount} registered
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 rounded-full"
                            onClick={() => setJoiningSession(session)}
                          >
                            Register <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Past sessions */}
              {filteredLive.filter(s => s.status === "ended").length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Past Sessions</h3>
                  <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-2">
                    {filteredLive.filter(s => s.status === "ended").map(session => (
                      <motion.div key={session.id} variants={fadeUp} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{session.topic}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge className={`${subjectColors[session.subject]} border-none text-[9px]`}>{session.subject}</Badge>
                            <span>{session.teacherName}</span>
                            <span>{session.joinedCount} attended</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(session.scheduledAt.slice(0, 10))}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* === Booking Dialog === */}
      <Dialog open={!!bookingSlot} onOpenChange={(open) => { if (!open) { setBookingSlot(null); setBookingTopic("") } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book 1-on-1 Session</DialogTitle>
            <DialogDescription>Confirm your session booking with the teacher.</DialogDescription>
          </DialogHeader>
          {bookingSlot && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${subjectDot[bookingSlot.subject]} text-white text-xs font-bold`}>
                      <Video className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{bookingSlot.teacherName}</p>
                      <Badge className={`${subjectColors[bookingSlot.subject]} border-none text-[10px]`}>{bookingSlot.subject}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(bookingSlot.date)}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {bookingSlot.startTime} - {bookingSlot.endTime}</span>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  What topic do you need help with?
                </label>
                <Textarea
                  placeholder="e.g. Rotational mechanics - moment of inertia doubts..."
                  value={bookingTopic}
                  onChange={e => setBookingTopic(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="mt-1 text-xs text-muted-foreground">This helps the teacher prepare for your session.</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setBookingSlot(null); setBookingTopic("") }} className="rounded-full">Cancel</Button>
            <Button onClick={confirmBooking} className="gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90">
              <CheckCircle2 className="h-4 w-4" /> Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === Join Live Session Dialog === */}
      <Dialog open={!!joiningSession} onOpenChange={(open) => { if (!open) setJoiningSession(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{joiningSession?.status === "live" ? "Join Live Session" : "Register for Session"}</DialogTitle>
            <DialogDescription>
              {joiningSession?.status === "live"
                ? "You are about to join an ongoing doubt session."
                : "Register to get notified when this session starts."}
            </DialogDescription>
          </DialogHeader>
          {joiningSession && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <p className="text-sm font-bold text-foreground">{joiningSession.topic}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <Badge className={`${subjectColors[joiningSession.subject]} border-none text-[10px]`}>{joiningSession.subject}</Badge>
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {joiningSession.teacherName}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {joiningSession.duration} min</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{joiningSession.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{joiningSession.joinedCount}/{joiningSession.maxCapacity} students</span>
                  <Progress value={(joiningSession.joinedCount / joiningSession.maxCapacity) * 100} className="ml-2 h-1.5 flex-1" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setJoiningSession(null)} className="rounded-full">Cancel</Button>
            <Button
              onClick={() => joiningSession && joinLiveSession(joiningSession.id)}
              className="gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90"
            >
              {joiningSession?.status === "live" ? (
                <><Play className="h-4 w-4" /> Join Now</>
              ) : (
                <><CheckCircle2 className="h-4 w-4" /> Register</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
