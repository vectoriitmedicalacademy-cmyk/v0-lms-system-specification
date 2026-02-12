"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockStudentProgress, mockAttempts } from "@/lib/mock-data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, Cell,
  AreaChart, Area, Legend
} from "recharts"
import { TrendingUp, TrendingDown, Target, Brain, AlertTriangle, Lightbulb } from "lucide-react"

const chartBlue = "#2563eb"
const chartGreen = "#16a34a"
const chartAmber = "#f59e0b"
const chartRed = "#dc2626"

export function StudentAnalytics() {
  const progress = mockStudentProgress

  const errorPatternData = [
    { name: "Conceptual", value: 35 },
    { name: "Silly Mistakes", value: 25 },
    { name: "Time Pressure", value: 22 },
    { name: "Incomplete", value: 18 },
  ]
  const errorColors = [chartRed, chartAmber, chartBlue, "#9333ea"]

  const radarData = progress.chapterAccuracy.map(ch => ({
    subject: ch.chapter,
    accuracy: ch.accuracy,
    fullMark: 100,
  }))

  const weakTopics = progress.chapterAccuracy
    .filter(ch => ch.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics & Insights</h1>
        <p className="text-muted-foreground">Deep performance analysis and personalized recommendations</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">Overall Accuracy</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">77%</p>
            <p className="text-xs text-accent">+5% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Tests Taken</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted-foreground">Questions Solved</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">1,248</p>
            <p className="text-xs text-accent">+180 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Weak Topics</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">{weakTopics.length}</p>
            <p className="text-xs text-destructive">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Topic Mastery Radar</CardTitle>
            <CardDescription>Your strength across chapters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Radar name="Accuracy" dataKey="accuracy" stroke={chartBlue} fill={chartBlue} fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Error patterns pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Error Pattern Analysis</CardTitle>
            <CardDescription>Breakdown of mistake types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-52 w-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={errorPatternData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {errorPatternData.map((_, i) => (
                        <Cell key={i} fill={errorColors[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {errorPatternData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ background: errorColors[i] }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="ml-auto text-sm font-semibold text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Trend Area Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Score Trend Analysis</CardTitle>
          <CardDescription>Your scores vs batch average over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progress.testScoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="test" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                <Legend />
                <Area type="monotone" dataKey="score" stroke={chartBlue} fill={chartBlue} fillOpacity={0.15} name="Your Score" strokeWidth={2} />
                <Area type="monotone" dataKey="avg" stroke={chartAmber} fill={chartAmber} fillOpacity={0.08} name="Batch Average" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weak Topics & Recommendations */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Weak Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakTopics.map(topic => (
              <div key={topic.chapter} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{topic.chapter}</p>
                  <p className="text-xs text-muted-foreground">{topic.attempts} questions attempted</p>
                </div>
                <div className="w-24">
                  <Progress value={topic.accuracy} className="h-2" />
                </div>
                <span className="w-10 text-right text-sm font-semibold text-destructive">{topic.accuracy}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-warning" /> Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { text: "Revise Organic Chemistry named reactions - your accuracy dropped by 15% this week", priority: "high" },
              { text: "Practice more NAT-type questions in Mechanics - you lose marks on numerical answers", priority: "medium" },
              { text: "Attempt the Waves DPP before the upcoming part test", priority: "medium" },
              { text: "Your Calculus is strong! Try JEE Advanced level problems now", priority: "low" },
            ].map((rec, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <Badge variant={rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "outline" : "secondary"} className="mt-0.5 text-xs">
                  {rec.priority}
                </Badge>
                <p className="text-sm text-foreground">{rec.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
