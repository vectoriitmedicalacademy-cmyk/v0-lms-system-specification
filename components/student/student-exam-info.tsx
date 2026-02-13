"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search, ExternalLink, MapPin, Trophy, ChevronRight, ChevronLeft,
  GraduationCap, Stethoscope, Building2, Bell, Calendar, FileText,
  Award, ArrowUpRight, Filter, X, Clock, Megaphone,
  BookOpen, Globe, Star, TrendingUp
} from "lucide-react"
import { mockColleges, mockExamAnnouncements } from "@/lib/mock-data"
import type { College, ExamAnnouncement } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

const announcementTypeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  registration: { label: "Registration", color: "bg-emerald-500/15 text-emerald-600", icon: <FileText className="h-3.5 w-3.5" /> },
  "admit-card": { label: "Admit Card", color: "bg-blue-500/15 text-blue-600", icon: <BookOpen className="h-3.5 w-3.5" /> },
  result: { label: "Result", color: "bg-primary/15 text-primary", icon: <Award className="h-3.5 w-3.5" /> },
  schedule: { label: "Schedule", color: "bg-violet-500/15 text-violet-600", icon: <Calendar className="h-3.5 w-3.5" /> },
  update: { label: "Update", color: "bg-muted text-muted-foreground", icon: <Bell className="h-3.5 w-3.5" /> },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
}
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export function StudentExamInfo() {
  const [activeTab, setActiveTab] = useState<"colleges" | "announcements">("colleges")
  const [search, setSearch] = useState("")
  const [collegeType, setCollegeType] = useState<"all" | "Engineering" | "Medical">("all")
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [examFilter, setExamFilter] = useState<string>("all")
  const [announcementTypeFilter, setAnnouncementTypeFilter] = useState<string>("all")

  // Filtered colleges
  const filteredColleges = useMemo(() => {
    return mockColleges.filter(c => {
      const matchesSearch = search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.shortName.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase()) ||
        c.state.toLowerCase().includes(search.toLowerCase())
      const matchesType = collegeType === "all" || c.type === collegeType
      return matchesSearch && matchesType
    })
  }, [search, collegeType])

  // All unique exams from announcements
  const examOptions = useMemo(() => {
    return Array.from(new Set(mockExamAnnouncements.map(a => a.exam)))
  }, [])

  // Filtered announcements
  const filteredAnnouncements = useMemo(() => {
    return mockExamAnnouncements.filter(a => {
      const matchesExam = examFilter === "all" || a.exam === examFilter
      const matchesType = announcementTypeFilter === "all" || a.type === announcementTypeFilter
      return matchesExam && matchesType
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [examFilter, announcementTypeFilter])

  const newCount = mockExamAnnouncements.filter(a => a.isNew).length

  // Colleges with own exams
  const collegesWithOwnExam = mockColleges.filter(c => c.ownExam)

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as "colleges" | "announcements")}>
          <TabsList className="bg-muted/80">
            <TabsTrigger value="colleges" className="gap-2 rounded-full data-[state=active]:bg-foreground data-[state=active]:text-card">
              <Building2 className="h-4 w-4" /> Colleges
            </TabsTrigger>
            <TabsTrigger value="announcements" className="gap-2 rounded-full data-[state=active]:bg-foreground data-[state=active]:text-card">
              <Megaphone className="h-4 w-4" /> Announcements
              {newCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {newCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "colleges" ? (
          <motion.div key="colleges" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <CollegesView
              colleges={filteredColleges}
              search={search}
              setSearch={setSearch}
              collegeType={collegeType}
              setCollegeType={setCollegeType}
              selectedCollege={selectedCollege}
              setSelectedCollege={setSelectedCollege}
              collegesWithOwnExam={collegesWithOwnExam}
            />
          </motion.div>
        ) : (
          <motion.div key="announcements" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <AnnouncementsView
              announcements={filteredAnnouncements}
              examFilter={examFilter}
              setExamFilter={setExamFilter}
              examOptions={examOptions}
              typeFilter={announcementTypeFilter}
              setTypeFilter={setAnnouncementTypeFilter}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===== Colleges View =====
function CollegesView({
  colleges,
  search,
  setSearch,
  collegeType,
  setCollegeType,
  selectedCollege,
  setSelectedCollege,
  collegesWithOwnExam,
}: {
  colleges: College[]
  search: string
  setSearch: (s: string) => void
  collegeType: string
  setCollegeType: (t: "all" | "Engineering" | "Medical") => void
  selectedCollege: College | null
  setSelectedCollege: (c: College | null) => void
  collegesWithOwnExam: College[]
}) {
  return (
    <div className="space-y-5">
      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search colleges by name, city, state..."
            className="flex-1 border-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {(["all", "Engineering", "Medical"] as const).map(t => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCollegeType(t)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                collegeType === t
                  ? "bg-foreground text-card"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "Engineering" && <GraduationCap className="h-3.5 w-3.5" />}
              {t === "Medical" && <Stethoscope className="h-3.5 w-3.5" />}
              {t === "all" ? "All" : t}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick links: colleges with own exams */}
      {collegesWithOwnExam.length > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Colleges with their own entrance exams</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {collegesWithOwnExam.map(c => (
              <motion.a
                key={c.id}
                href={c.ownExam!.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: c.logoColor }}>
                  <span className="text-[9px] font-bold text-white">{c.shortName[0]}</span>
                </div>
                {c.ownExam!.name}
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground">{colleges.length} college{colleges.length !== 1 ? "s" : ""} found</p>

      {/* College cards */}
      <motion.div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" variants={stagger} initial="initial" animate="animate">
        {colleges.map(college => (
          <motion.div
            key={college.id}
            variants={fadeUp}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25 }}
            className="cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            onClick={() => setSelectedCollege(college)}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white"
                style={{ background: college.logoColor }}
              >
                {college.type === "Engineering" ? (
                  <GraduationCap className="h-5 w-5" />
                ) : (
                  <Stethoscope className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate text-sm font-bold text-foreground">{college.shortName}</h3>
                <p className="truncate text-xs text-muted-foreground">{college.name}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1 text-xs">
                <MapPin className="h-3 w-3" /> {college.location}, {college.state}
              </Badge>
              <Badge className="border-none bg-muted text-xs text-muted-foreground">{college.type}</Badge>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs">
              {college.nirfRank && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Trophy className="h-3 w-3 text-primary" />
                  <span>NIRF #{college.nirfRank}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-3 w-3 text-primary" />
                <span>Rank #{college.ranking}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {college.acceptedExams.map(exam => (
                <span key={exam} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                  {exam}
                </span>
              ))}
            </div>

            {/* Cutoff preview */}
            {college.cutoffs.length > 0 && (
              <div className="mt-3 rounded-xl bg-muted/60 px-3 py-2">
                <p className="text-[10px] font-semibold text-muted-foreground">Latest General Cutoff (CSE/MBBS)</p>
                <p className="text-sm font-bold text-foreground">
                  Rank {college.cutoffs[0].openingRank} - {college.cutoffs[0].closingRank}
                </p>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between">
              {college.ownExam ? (
                <a
                  href={college.ownExam.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  {college.ownExam.name} <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span />
              )}
              <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                View Details <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {colleges.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Search className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No colleges found matching your search</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Try a different keyword or filter</p>
        </div>
      )}

      {/* College detail dialog */}
      <Dialog open={!!selectedCollege} onOpenChange={() => setSelectedCollege(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {selectedCollege && <CollegeDetail college={selectedCollege} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ===== College Detail =====
function CollegeDetail({ college }: { college: College }) {
  const [cutoffCategory, setCutoffCategory] = useState("General")
  const categories = Array.from(new Set(college.cutoffs.map(c => c.category)))
  const filteredCutoffs = college.cutoffs.filter(c => c.category === cutoffCategory)
  const branches = Array.from(new Set(filteredCutoffs.map(c => c.branch).filter(Boolean)))

  return (
    <div className="space-y-5">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
            style={{ background: college.logoColor }}
          >
            {college.type === "Engineering" ? <GraduationCap className="h-6 w-6" /> : <Stethoscope className="h-6 w-6" />}
          </div>
          <div>
            <DialogTitle className="text-lg">{college.shortName}</DialogTitle>
            <p className="text-sm text-muted-foreground">{college.name}</p>
          </div>
        </div>
      </DialogHeader>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-muted/60 p-3 text-center">
          <MapPin className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
          <p className="text-xs font-medium text-foreground">{college.location}</p>
          <p className="text-[10px] text-muted-foreground">{college.state}</p>
        </div>
        {college.nirfRank && (
          <div className="rounded-xl bg-muted/60 p-3 text-center">
            <Trophy className="mx-auto mb-1 h-4 w-4 text-primary" />
            <p className="text-xs font-medium text-foreground">#{college.nirfRank}</p>
            <p className="text-[10px] text-muted-foreground">NIRF Rank</p>
          </div>
        )}
        <div className="rounded-xl bg-muted/60 p-3 text-center">
          <Star className="mx-auto mb-1 h-4 w-4 text-primary" />
          <p className="text-xs font-medium text-foreground">#{college.ranking}</p>
          <p className="text-[10px] text-muted-foreground">Overall Rank</p>
        </div>
        <div className="rounded-xl bg-muted/60 p-3 text-center">
          <Building2 className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
          <p className="text-xs font-medium text-foreground">{college.type}</p>
          <p className="text-[10px] text-muted-foreground">Category</p>
        </div>
      </div>

      {/* Accepted exams */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-foreground">Accepted Exams</h4>
        <div className="flex flex-wrap gap-2">
          {college.acceptedExams.map(exam => (
            <Badge key={exam} className="border-none bg-primary/10 text-primary">{exam}</Badge>
          ))}
        </div>
      </div>

      {/* Own exam link */}
      {college.ownExam && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{college.ownExam.name}</p>
                <p className="text-xs text-muted-foreground">This college conducts its own entrance exam</p>
              </div>
            </div>
            <motion.a
              href={college.ownExam.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-card"
            >
              Apply Now <ArrowUpRight className="h-3.5 w-3.5" />
            </motion.a>
          </div>
        </div>
      )}

      {/* Cutoffs */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Cutoff Ranks (2025)</h4>
          <div className="flex gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCutoffCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  cutoffCategory === cat
                    ? "bg-foreground text-card"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredCutoffs.length > 0 ? (
          <div className="space-y-2">
            {filteredCutoffs.map((cutoff, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{cutoff.branch || "General"}</p>
                  <p className="text-xs text-muted-foreground">{cutoff.exam} - {cutoff.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{cutoff.openingRank.toLocaleString()} - {cutoff.closingRank.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Opening - Closing Rank</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No cutoff data available for this category</p>
        )}
      </div>

      {/* Website link */}
      <motion.a
        href={college.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Globe className="h-4 w-4" /> Visit Official Website <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
      </motion.a>
    </div>
  )
}

// ===== Announcements View =====
function AnnouncementsView({
  announcements,
  examFilter,
  setExamFilter,
  examOptions,
  typeFilter,
  setTypeFilter,
}: {
  announcements: ExamAnnouncement[]
  examFilter: string
  setExamFilter: (f: string) => void
  examOptions: string[]
  typeFilter: string
  setTypeFilter: (f: string) => void
}) {
  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Exam:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setExamFilter("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              examFilter === "all"
                ? "bg-foreground text-card"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All Exams
          </button>
          {examOptions.map(exam => (
            <button
              key={exam}
              onClick={() => setExamFilter(exam)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                examFilter === exam
                  ? "bg-foreground text-card"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {exam}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Megaphone className="h-4 w-4" /> Type:
        </span>
        {["all", "registration", "admit-card", "result", "schedule", "update"].map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              typeFilter === t
                ? "bg-foreground text-card"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "all" ? "All" : t === "admit-card" ? "Admit Card" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{announcements.length} announcement{announcements.length !== 1 ? "s" : ""}</p>

      {/* Announcements list */}
      <motion.div className="space-y-3" variants={stagger} initial="initial" animate="animate">
        {announcements.map(ann => {
          const config = announcementTypeConfig[ann.type]
          return (
            <motion.div
              key={ann.id}
              variants={fadeUp}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${config.color}`}>
                  {config.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-foreground">{ann.title}</h3>
                        {ann.isNew && (
                          <Badge className="border-none bg-destructive/15 text-destructive text-[10px]">NEW</Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-semibold text-primary">{ann.exam}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(ann.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <Badge className={`${config.color} border-none text-[10px]`}>{config.label}</Badge>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ann.description}</p>
                  {ann.sourceUrl && (
                    <motion.a
                      href={ann.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-card"
                    >
                      Visit Official Portal <ArrowUpRight className="h-3 w-3" />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {announcements.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Megaphone className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No announcements match your filters</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Try changing the exam or type filter</p>
        </div>
      )}
    </div>
  )
}
