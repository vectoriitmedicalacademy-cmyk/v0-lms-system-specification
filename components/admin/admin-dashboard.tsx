"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users, GraduationCap, BookOpen, CreditCard, TrendingUp, AlertTriangle,
  BarChart3, Clock
} from "lucide-react"
import { mockUsers, mockBatches, mockPayments, mockTests } from "@/lib/mock-data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts"

const chartBlue = "#2563eb"
const chartGreen = "#16a34a"
const chartAmber = "#f59e0b"
const chartRed = "#dc2626"

export function AdminDashboard() {
  const students = mockUsers.filter(u => u.role === "student")
  const teachers = mockUsers.filter(u => u.role === "teacher")
  const totalRevenue = mockPayments.filter(p => p.status === "paid").reduce((a, p) => a + p.amount, 0)
  const pendingFees = mockPayments.filter(p => p.status !== "paid").reduce((a, p) => a + p.amount, 0)

  const batchEnrollment = mockBatches.map(b => ({
    name: b.name.split(" - ")[1] || b.name,
    students: b.studentCount,
    target: b.target,
  }))

  const revenueData = [
    { month: "Sep", revenue: 280000 },
    { month: "Oct", revenue: 350000 },
    { month: "Nov", revenue: 420000 },
    { month: "Dec", revenue: 310000 },
    { month: "Jan", revenue: 450000 },
    { month: "Feb", revenue: 380000 },
  ]

  const paymentStatusData = [
    { name: "Paid", value: 4, color: chartGreen },
    { name: "Pending", value: 1, color: chartAmber },
    { name: "Overdue", value: 1, color: chartRed },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and key metrics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{students.length}</p>
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
              <p className="text-2xl font-bold text-foreground">{teachers.length}</p>
              <p className="text-xs text-muted-foreground">Faculty Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <CreditCard className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{(totalRevenue / 100000).toFixed(1)}L</p>
              <p className="text-xs text-muted-foreground">Revenue Collected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{(pendingFees / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Fees Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Trend</CardTitle>
            <CardDescription>Monthly collection in INR</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${v / 1000}K`} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(v: number) => [`Rs. ${v.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill={chartBlue} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Payment Status</CardTitle>
            <CardDescription>Overview of fee collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="h-52 w-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {paymentStatusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {paymentStatusData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ background: item.color }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="ml-auto text-sm font-bold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Batch Enrollment</CardTitle>
          <CardDescription>Students enrolled per batch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={batchEnrollment} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                <Bar dataKey="students" fill={chartGreen} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions / Alerts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "3 students have overdue fees", icon: <AlertTriangle className="h-4 w-4" />, type: "destructive" as const },
          { title: "Full Mock Test 1 is scheduled for Feb 25", icon: <Clock className="h-4 w-4" />, type: "outline" as const },
          { title: "15 new enrollments this month", icon: <TrendingUp className="h-4 w-4" />, type: "default" as const },
        ].map((alert, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-3 p-4">
              <Badge variant={alert.type} className="flex h-8 w-8 items-center justify-center rounded-lg p-0">
                {alert.icon}
              </Badge>
              <p className="text-sm font-medium text-foreground">{alert.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
