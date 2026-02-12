"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  UserCheck, Trophy, Clock, Target, TrendingUp, CreditCard,
  AlertTriangle, BookOpen, Calendar
} from "lucide-react"
import { mockStudentProgress, mockUsers, mockAttempts, mockAttendance, mockPayments, mockTests } from "@/lib/mock-data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts"

const chartBlue = "#2563eb"
const chartGreen = "#16a34a"
const chartAmber = "#f59e0b"

export function ParentDashboard() {
  const child = mockUsers.find(u => u.id === "u1")!
  const progress = mockStudentProgress
  const childPayments = mockPayments.filter(p => p.userId === "u1")
  const childAttendance = mockAttendance.filter(a => a.userId === "u1")
  const childAttempts = mockAttempts.filter(a => a.userId === "u1")
  const pendingPayments = childPayments.filter(p => p.status !== "paid")

  const presentDays = childAttendance.filter(a => a.status === "present").length
  const totalDays = childAttendance.length

  return (
    <div className="space-y-6">
      {/* Child Profile Banner */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-lg text-primary-foreground">
              {child.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-foreground">{child.name}</h1>
            <p className="text-muted-foreground">JEE Advanced 2026 - Alpha Batch</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge variant="outline" className="gap-1"><Trophy className="h-3 w-3" /> Rank #{progress.rank}</Badge>
              <Badge variant="outline" className="gap-1"><Target className="h-3 w-3" /> {progress.overallCompletion}% Complete</Badge>
              <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> {progress.studyHoursWeek}h/week</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">#{progress.rank}</p>
              <p className="text-xs text-muted-foreground">Batch Rank / {progress.totalStudents}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <UserCheck className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0}%</p>
              <p className="text-xs text-muted-foreground">Attendance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <BookOpen className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{progress.streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <CreditCard className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingPayments.length}</p>
              <p className="text-xs text-muted-foreground">Pending Fees</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Test Score Trend</CardTitle>
            <CardDescription>Your child vs batch average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progress.testScoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="test" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke={chartBlue} strokeWidth={2} name="Score" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="avg" stroke={chartAmber} strokeWidth={2} strokeDasharray="5 5" name="Batch Avg" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Study Hours</CardTitle>
            <CardDescription>Time spent studying each day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progress.weeklyStudyHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="hours" fill={chartBlue} radius={[4, 4, 0, 0]} name="Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Subject-wise Progress</CardTitle>
          <CardDescription>Completion and accuracy breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {progress.subjectProgress.map(sp => (
            <div key={sp.subjectId} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{sp.subjectName}</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{sp.completion}% complete</span>
                  <Badge variant="outline" className="text-xs">{sp.accuracy}% accuracy</Badge>
                </div>
              </div>
              <Progress value={sp.completion} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Attendance + Payments */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {childAttendance.map(a => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {new Date(a.date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    a.status === "present" ? "bg-accent/10 text-accent border-accent/30" :
                    a.status === "absent" ? "bg-destructive/10 text-destructive border-destructive/30" :
                    "bg-warning/10 text-warning border-warning/30"
                  }`}
                >
                  {a.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Fee Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {childPayments.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.description}</p>
                  <p className="text-xs text-muted-foreground">Due: {new Date(p.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">Rs. {p.amount.toLocaleString()}</p>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      p.status === "paid" ? "bg-accent/10 text-accent border-accent/30" :
                      p.status === "overdue" ? "bg-destructive/10 text-destructive border-destructive/30" :
                      "bg-warning/10 text-warning border-warning/30"
                    }`}
                  >
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { text: "Fee installment of Rs. 25,000 is due on March 1", type: "warning" as const },
            { text: "Aarav scored 80% in Part Test 1 (Rank #5)", type: "success" as const },
            { text: "Full Mock Test 1 scheduled for Feb 25", type: "info" as const },
            { text: "Aarav was late on Feb 12", type: "warning" as const },
          ].map((alert, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
                alert.type === "warning" ? "border-warning/30 bg-warning/5" :
                alert.type === "success" ? "border-accent/30 bg-accent/5" :
                "border-border bg-muted/30"
              }`}
            >
              <AlertTriangle className={`h-4 w-4 ${
                alert.type === "warning" ? "text-warning" :
                alert.type === "success" ? "text-accent" :
                "text-primary"
              }`} />
              <p className="text-sm text-foreground">{alert.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
