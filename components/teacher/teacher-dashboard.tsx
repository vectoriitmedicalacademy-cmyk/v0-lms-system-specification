"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users, BookOpen, ClipboardCheck, HelpCircle, TrendingUp, Clock,
  ArrowRight, FileText
} from "lucide-react"
import { mockBatches, mockTests, mockUsers, mockDPPs, mockCommunityPosts } from "@/lib/mock-data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts"

const chartBlue = "#2563eb"
const chartGreen = "#16a34a"
const chartAmber = "#f59e0b"

export function TeacherDashboard() {
  const myBatches = mockBatches.filter(b => b.teacherIds.includes("t1"))
  const totalStudents = myBatches.reduce((a, b) => a + b.studentCount, 0)
  const upcomingTests = mockTests.filter(t => t.status === "upcoming")
  const pendingDoubts = mockCommunityPosts.filter(p => p.room === "Doubts" || p.room === "Physics")

  const batchPerformance = [
    { test: "CT-1", alpha: 72, bravo: 65 },
    { test: "CT-2", alpha: 78, bravo: 68 },
    { test: "PT-1", alpha: 80, bravo: 70 },
    { test: "CT-3", alpha: 75, bravo: 72 },
    { test: "PT-2", alpha: 85, bravo: 74 },
  ]

  const weeklyActivity = [
    { day: "Mon", lectures: 3, dpps: 1 },
    { day: "Tue", lectures: 2, dpps: 2 },
    { day: "Wed", lectures: 4, dpps: 1 },
    { day: "Thu", lectures: 2, dpps: 0 },
    { day: "Fri", lectures: 3, dpps: 2 },
    { day: "Sat", lectures: 1, dpps: 3 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, Dr. Rajesh</h1>
        <p className="text-muted-foreground">Here is your teaching overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <BookOpen className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{myBatches.length}</p>
              <p className="text-xs text-muted-foreground">Active Batches</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <ClipboardCheck className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{upcomingTests.length}</p>
              <p className="text-xs text-muted-foreground">Upcoming Tests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <HelpCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingDoubts.length}</p>
              <p className="text-xs text-muted-foreground">Pending Doubts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Batch Performance Trend</CardTitle>
            <CardDescription>Average test scores by batch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={batchPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="test" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Legend />
                  <Line type="monotone" dataKey="alpha" stroke={chartBlue} strokeWidth={2} name="Alpha" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="bravo" stroke={chartGreen} strokeWidth={2} name="Bravo" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Activity</CardTitle>
            <CardDescription>Lectures delivered and DPPs created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Legend />
                  <Bar dataKey="lectures" fill={chartBlue} radius={[4, 4, 0, 0]} name="Lectures" />
                  <Bar dataKey="dpps" fill={chartAmber} radius={[4, 4, 0, 0]} name="DPPs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batches & Doubts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">My Batches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myBatches.map(batch => (
              <div key={batch.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{batch.name}</p>
                  <p className="text-xs text-muted-foreground">{batch.target} {batch.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{batch.studentCount}</p>
                  <p className="text-xs text-muted-foreground">students</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Doubts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingDoubts.slice(0, 4).map(doubt => (
              <div key={doubt.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-xs text-primary">
                    {doubt.isAnonymous ? "?" : doubt.authorName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{doubt.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{doubt.authorName} - {doubt.room}</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">{doubt.commentCount} replies</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
