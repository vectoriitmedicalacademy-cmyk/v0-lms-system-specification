"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserCheck, UserX, Clock, Plus, Calendar, Download } from "lucide-react"
import { mockAttendance, mockUsers, mockBatches } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const chartGreen = "#16a34a"
const chartRed = "#dc2626"
const chartAmber = "#f59e0b"

const statusConfig = {
  present: { color: "bg-accent/10 text-accent border-accent/30", icon: <UserCheck className="h-3.5 w-3.5" /> },
  absent: { color: "bg-destructive/10 text-destructive border-destructive/30", icon: <UserX className="h-3.5 w-3.5" /> },
  late: { color: "bg-warning/10 text-warning border-warning/30", icon: <Clock className="h-3.5 w-3.5" /> },
}

export function AdminAttendance() {
  const [selectedBatch, setSelectedBatch] = useState("b1")
  const [selectedDate, setSelectedDate] = useState("2026-02-10")
  const [showCreateSession, setShowCreateSession] = useState(false)
  const [attendanceState, setAttendanceState] = useState<Record<string, "present" | "absent" | "late">>({})

  const batchStudents = mockUsers.filter(u => u.role === "student" && u.batchIds.includes(selectedBatch))
  const dayAttendance = mockAttendance.filter(a => a.date === selectedDate && a.batchId === selectedBatch)

  // Chart data
  const dates = ["Feb 8", "Feb 9", "Feb 10", "Feb 11", "Feb 12"]
  const chartData = dates.map(d => ({
    date: d,
    present: Math.floor(Math.random() * 35) + 10,
    absent: Math.floor(Math.random() * 8) + 1,
    late: Math.floor(Math.random() * 5) + 1,
  }))

  const overallPresent = mockAttendance.filter(a => a.status === "present").length
  const overallAbsent = mockAttendance.filter(a => a.status === "absent").length
  const overallLate = mockAttendance.filter(a => a.status === "late").length
  const total = overallPresent + overallAbsent + overallLate

  const markAttendance = (userId: string, status: "present" | "absent" | "late") => {
    setAttendanceState(prev => ({ ...prev, [userId]: status }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground">Track and manage class attendance by batch</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export Report</Button>
          <Button className="gap-2" onClick={() => setShowCreateSession(true)}><Plus className="h-4 w-4" /> New Session</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <UserCheck className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{total > 0 ? Math.round((overallPresent / total) * 100) : 0}%</p>
              <p className="text-xs text-muted-foreground">Avg Attendance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <UserX className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{overallAbsent}</p>
              <p className="text-xs text-muted-foreground">Total Absences</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{overallLate}</p>
              <p className="text-xs text-muted-foreground">Late Arrivals</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Attendance Trend</CardTitle>
          <CardDescription>Daily attendance breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                <Bar dataKey="present" fill={chartGreen} stackId="a" radius={[0, 0, 0, 0]} name="Present" />
                <Bar dataKey="late" fill={chartAmber} stackId="a" name="Late" />
                <Bar dataKey="absent" fill={chartRed} stackId="a" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              {mockBatches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-44"
          />
        </CardContent>
      </Card>

      {/* Attendance Marking Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Mark Attendance - {mockBatches.find(b => b.id === selectedBatch)?.name}
          </CardTitle>
          <CardDescription>
            {new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>Mark Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batchStudents.map(student => {
                const existing = dayAttendance.find(a => a.userId === student.id)
                const currentStatus = attendanceState[student.id] || existing?.status
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-xs text-primary">
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {currentStatus ? (
                        <Badge variant="outline" className={`gap-1 ${statusConfig[currentStatus].color}`}>
                          {statusConfig[currentStatus].icon} {currentStatus}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not marked</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant={currentStatus === "present" ? "default" : "outline"}
                          className="h-7 gap-1 text-xs"
                          onClick={() => markAttendance(student.id, "present")}
                        >
                          <UserCheck className="h-3 w-3" /> Present
                        </Button>
                        <Button
                          size="sm"
                          variant={currentStatus === "absent" ? "destructive" : "outline"}
                          className="h-7 gap-1 text-xs"
                          onClick={() => markAttendance(student.id, "absent")}
                        >
                          <UserX className="h-3 w-3" /> Absent
                        </Button>
                        <Button
                          size="sm"
                          variant={currentStatus === "late" ? "secondary" : "outline"}
                          className="h-7 gap-1 text-xs"
                          onClick={() => markAttendance(student.id, "late")}
                        >
                          <Clock className="h-3 w-3" /> Late
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Session Dialog */}
      <Dialog open={showCreateSession} onOpenChange={setShowCreateSession}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Class Session</DialogTitle>
            <DialogDescription>Set up a new attendance session</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Session Title</Label>
              <Input placeholder="e.g. Physics Lecture - Mechanics" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Batch</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                  <SelectContent>
                    {mockBatches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateSession(false)}>Cancel</Button>
            <Button onClick={() => setShowCreateSession(false)}>Create Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
