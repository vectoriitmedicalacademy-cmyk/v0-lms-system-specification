"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BarChart3, TrendingUp, TrendingDown, Users, Clock, Target,
  Download, AlertTriangle, Eye
} from "lucide-react"
import { mockBatches, mockUsers, mockAttempts, mockTests } from "@/lib/mock-data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts"

const chartBlue = "#2563eb"
const chartGreen = "#16a34a"
const chartAmber = "#f59e0b"
const chartRed = "#dc2626"

export function AdminAnalytics() {
  const [selectedBatch, setSelectedBatch] = useState("b1")

  const batchStudents = mockUsers.filter(u => u.role === "student" && u.batchIds.includes(selectedBatch))

  // Generate batch performance data
  const batchPerformance = mockBatches.map(b => ({
    batch: b.name.split(" - ")[1] || b.name,
    avgScore: Math.floor(Math.random() * 25) + 60,
    attendance: Math.floor(Math.random() * 15) + 80,
    completion: Math.floor(Math.random() * 30) + 50,
  }))

  // Test performance trend
  const testTrend = [
    { test: "CT-1", alpha: 72, bravo: 65, charlie: 58 },
    { test: "CT-2", alpha: 78, bravo: 68, charlie: 62 },
    { test: "PT-1", alpha: 80, bravo: 70, charlie: 60 },
    { test: "CT-3", alpha: 75, bravo: 72, charlie: 65 },
    { test: "PT-2", alpha: 85, bravo: 74, charlie: 68 },
  ]

  // Subject-wise batch performance
  const subjectRadar = [
    { subject: "Physics", score: 72 },
    { subject: "Chemistry", score: 68 },
    { subject: "Mathematics", score: 78 },
    { subject: "Biology", score: 65 },
  ]

  // Lagging students
  const laggingStudents = batchStudents.map(s => ({
    ...s,
    completionPercent: Math.floor(Math.random() * 40) + 20,
    avgScore: Math.floor(Math.random() * 30) + 40,
    missedDPPs: Math.floor(Math.random() * 5),
    watchHours: Math.floor(Math.random() * 10) + 5,
  })).sort((a, b) => a.avgScore - b.avgScore)

  // Watch compliance
  const watchData = [
    { day: "Mon", watched: 85, expected: 100 },
    { day: "Tue", watched: 72, expected: 100 },
    { day: "Wed", watched: 90, expected: 100 },
    { day: "Thu", watched: 68, expected: 100 },
    { day: "Fri", watched: 82, expected: 100 },
    { day: "Sat", watched: 95, expected: 100 },
    { day: "Sun", watched: 60, expected: 100 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Batch performance, student tracking, and engagement metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              {mockBatches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export PDF</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">74%</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
              <div className="flex items-center gap-1 text-[10px] text-accent"><TrendingUp className="h-3 w-3" /> +5% from last</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">88%</p>
              <p className="text-xs text-muted-foreground">Avg Attendance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Eye className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">78%</p>
              <p className="text-xs text-muted-foreground">Watch Compliance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{laggingStudents.filter(s => s.avgScore < 60).length}</p>
              <p className="text-xs text-muted-foreground">Students Lagging</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Batch Performance Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Batch Comparison</CardTitle>
            <CardDescription>Average scores across batches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="batch" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Legend />
                  <Bar dataKey="avgScore" fill={chartBlue} radius={[4, 4, 0, 0]} name="Avg Score %" />
                  <Bar dataKey="attendance" fill={chartGreen} radius={[4, 4, 0, 0]} name="Attendance %" />
                  <Bar dataKey="completion" fill={chartAmber} radius={[4, 4, 0, 0]} name="Completion %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Test Score Trend by Batch */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Test Score Trend</CardTitle>
            <CardDescription>Batch-wise average score progression</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={testTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="test" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Legend />
                  <Line type="monotone" dataKey="alpha" stroke={chartBlue} strokeWidth={2} name="Alpha" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="bravo" stroke={chartGreen} strokeWidth={2} name="Bravo" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="charlie" stroke={chartAmber} strokeWidth={2} name="Charlie" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Watch Compliance + Subject Radar */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Watch Compliance</CardTitle>
            <CardDescription>Video engagement vs expected (% of batch)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={watchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="watched" fill={chartBlue} radius={[4, 4, 0, 0]} name="Watched %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Subject Performance</CardTitle>
            <CardDescription>Average score by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={subjectRadar} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Radar name="Score" dataKey="score" stroke={chartBlue} fill={chartBlue} fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lagging Students */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Lagging Students</CardTitle>
              <CardDescription>Students who may need additional support</CardDescription>
            </div>
            <Badge variant="destructive">{laggingStudents.filter(s => s.avgScore < 60).length} at risk</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Missed DPPs</TableHead>
                <TableHead>Watch Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laggingStudents.map(student => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${student.avgScore < 50 ? "text-destructive" : student.avgScore < 70 ? "text-warning" : "text-accent"}`}>
                      {student.avgScore}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={student.completionPercent} className="h-2 w-16" />
                      <span className="text-xs text-muted-foreground">{student.completionPercent}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={student.missedDPPs > 3 ? "font-bold text-destructive" : "text-muted-foreground"}>
                      {student.missedDPPs}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{student.watchHours}h</TableCell>
                  <TableCell>
                    {student.avgScore < 50 ? (
                      <Badge variant="destructive" className="text-xs">At Risk</Badge>
                    ) : student.avgScore < 70 ? (
                      <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">Needs Attention</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">On Track</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
