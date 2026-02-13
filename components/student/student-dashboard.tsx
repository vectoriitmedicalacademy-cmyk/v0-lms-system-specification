"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Trophy, Play, Flame, Clock
} from "lucide-react"
import { mockStudentProgress, mockTests, mockLessons } from "@/lib/mock-data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"

const chartAmber = "#f59e0b"

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export function StudentDashboard() {
  const progress = mockStudentProgress
  const upcomingTests = mockTests.filter(t => t.status === "upcoming").slice(0, 3)
  const lastWatched = mockLessons.find(l => l.type === "video" && !l.isLocked)

  const subjectLetters = [
    { letter: "P", name: "Physics", color: "hsl(217, 91%, 50%)", completion: progress.subjectProgress.find(s => s.subjectName === "Physics")?.completion || 0 },
    { letter: "C", name: "Chemistry", color: "hsl(152, 60%, 42%)", completion: progress.subjectProgress.find(s => s.subjectName === "Chemistry")?.completion || 0 },
    { letter: "M", name: "Mathematics", color: "hsl(38, 92%, 50%)", completion: progress.subjectProgress.find(s => s.subjectName === "Mathematics")?.completion || 0 },
  ]

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <motion.div className="flex-1 space-y-5" variants={stagger} initial="initial" animate="animate">
        {/* Progress Banner */}
        <motion.div variants={fadeUp}>
          <Card className="card-hover border-none bg-muted/60">
            <CardContent className="flex items-center gap-6 p-5">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">Overall Progress</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {progress.overallCompletion}% syllabus completed &middot; {progress.studyHoursWeek}h this week &middot; {progress.streak} day streak
                </p>
                <div className="mt-3 progress-animated">
                  <Progress value={progress.overallCompletion} className="h-2.5" />
                </div>
              </div>
              <div className="flex items-center gap-4 text-center">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                    <Flame className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-1 text-xs font-bold text-foreground">{progress.streak}</p>
                  <p className="text-[10px] text-muted-foreground">Streak</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1, rotate: -5 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-1 text-xs font-bold text-foreground">#{progress.rank}</p>
                  <p className="text-[10px] text-muted-foreground">Rank</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Courses - P C M cards */}
        <motion.div variants={fadeUp}>
          <h3 className="mb-3 text-base font-semibold text-foreground">Courses</h3>
          <Card className="border-none bg-muted/60">
            <CardContent className="p-5">
              <div className="grid grid-cols-3 gap-4">
                {subjectLetters.map((sub, i) => (
                  <motion.div
                    key={sub.letter}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl transition-shadow hover:shadow-lg"
                    style={{ backgroundColor: `${sub.color}20` }}
                  >
                    <motion.span
                      className="text-5xl font-black lg:text-6xl"
                      style={{ color: sub.color }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      {sub.letter}
                    </motion.span>
                    <span className="mt-2 text-sm font-medium text-foreground">{sub.name}</span>
                    <span className="text-xs text-muted-foreground">{sub.completion}% done</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom row - Flash Cards + Achievements */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
          <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Card className="border-none bg-gradient-to-br from-primary/90 to-primary overflow-hidden">
              <CardContent className="flex h-40 flex-col justify-between p-5">
                <div>
                  <p className="text-sm font-bold text-primary-foreground">Check out our new flashcard feature for quick notes</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Badge className="w-fit bg-primary-foreground/20 text-primary-foreground border-none cursor-pointer">
                    Try Now
                  </Badge>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <Card className="card-hover border-none bg-muted/60">
            <CardContent className="p-5">
              <h4 className="mb-3 text-sm font-semibold text-foreground">Achievements</h4>
              <div className="space-y-3">
                {progress.chapterAccuracy.slice(0, 3).map((ch, i) => (
                  <motion.div
                    key={ch.chapter}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.35 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
                        <Trophy className="h-4 w-4 text-primary" />
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{ch.chapter}</p>
                      <p className="text-xs text-muted-foreground">{ch.accuracy}% accuracy</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Study Hours Chart */}
        <motion.div variants={fadeUp}>
          <Card className="card-hover border-none bg-muted/60">
            <CardContent className="p-5">
              <h4 className="mb-4 text-sm font-semibold text-foreground">Weekly Study Hours</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progress.weeklyStudyHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Bar dataKey="hours" fill={chartAmber} radius={[4, 4, 0, 0]} name="Hours" animationDuration={1200} animationEasing="ease-out" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Right Sidebar - Profile Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="hidden w-72 flex-shrink-0 space-y-5 xl:block"
      >
        {/* Profile Card */}
        <Card className="card-hover border-none bg-muted/60 overflow-hidden">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Badge className="mb-3 bg-primary/10 text-primary border-none text-xs">#IITian</Badge>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarFallback className="bg-muted text-2xl font-bold text-foreground">
                  AS
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="mt-3 flex items-center gap-1.5">
              {["P", "M", "C"].map((l, i) => (
                <motion.span
                  key={l}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.4 + i * 0.08 }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                >
                  {l}
                </motion.span>
              ))}
            </div>
            <h3 className="mt-2 text-base font-bold text-foreground">Aarav Sharma</h3>
            <p className="text-xs text-muted-foreground">Class XII &middot; Batch: JEE Alpha</p>

            <div className="mt-5 w-full space-y-3">
              {progress.subjectProgress.map((sp, i) => (
                <motion.div
                  key={sp.subjectId}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{sp.subjectName}</span>
                    <span className="text-muted-foreground">{sp.completion}% Completed</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-border">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${sp.completion}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Promo Card */}
        <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <Card className="border-none bg-gradient-to-br from-orange-400 to-orange-500 overflow-hidden">
            <CardContent className="p-5">
              <p className="text-sm font-bold text-card">Check out our new flashcard feature for quick notes</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge className="mt-3 bg-card/20 text-card border-none cursor-pointer">Explore</Badge>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Tests */}
        <Card className="card-hover border-none bg-muted/60">
          <CardContent className="p-5">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Upcoming Tests</h4>
            <div className="space-y-3">
              {upcomingTests.map((test, i) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
                  whileHover={{ x: 3 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground leading-tight">{test.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(test.scheduledAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} &middot; {test.duration} min
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resume bar at bottom (fixed) */}
      {lastWatched && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-4 bg-foreground/90 px-6 py-3 backdrop-blur-sm lg:left-52"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary"
          >
            <Play className="h-4 w-4 text-primary-foreground ml-0.5" />
          </motion.div>
          <div className="flex-1">
            <p className="text-sm font-medium text-card">Physics Chapter 1</p>
            <p className="text-xs text-card/60">Section 3: {lastWatched.title}</p>
          </div>
          <div className="mr-2 hidden h-1.5 w-32 overflow-hidden rounded-full bg-card/20 sm:block">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: "33%" }}
              transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="text-xs text-card/60">-21:07</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-press rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {"Resume "}&#9654;
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
