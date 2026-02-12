"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash2, Users, UserPlus } from "lucide-react"
import { mockBatches, mockUsers } from "@/lib/mock-data"

export function AdminBatches() {
  const [showEnroll, setShowEnroll] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)

  const teachers = mockUsers.filter(u => u.role === "teacher")
  const students = mockUsers.filter(u => u.role === "student")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Batch Management</h1>
          <p className="text-muted-foreground">Create and manage batches, assign teachers and students</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Create Batch</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
              <DialogDescription>Set up a new batch for enrollment</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Batch Name</Label>
                <Input placeholder="e.g. JEE Advanced 2027 - Delta" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Exam</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IIT-JEE">IIT-JEE</SelectItem>
                      <SelectItem value="NEET">NEET</SelectItem>
                      <SelectItem value="MHT-CET">MHT-CET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Year</Label>
                  <Input type="number" placeholder="2027" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assign Teachers</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select teachers" /></SelectTrigger>
                  <SelectContent>
                    {teachers.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button>Create Batch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockBatches.length}</p>
              <p className="text-xs text-muted-foreground">Active Batches</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockBatches.reduce((a, b) => a + b.studentCount, 0)}</p>
              <p className="text-xs text-muted-foreground">Total Enrolled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Users className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{teachers.length}</p>
              <p className="text-xs text-muted-foreground">Assigned Faculty</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Name</TableHead>
                <TableHead>Target Exam</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Teachers</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBatches.map(batch => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium text-foreground">{batch.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{batch.target}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{batch.year}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{batch.studentCount}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-xs text-primary"
                        onClick={() => { setSelectedBatch(batch.id); setShowEnroll(true) }}
                      >
                        <UserPlus className="h-3 w-3" /> Enroll
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {batch.teacherIds.map(tid => {
                        const teacher = mockUsers.find(u => u.id === tid)
                        return teacher ? (
                          <Avatar key={tid} className="h-7 w-7 border-2 border-background">
                            <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
                              {teacher.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        ) : null
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="mr-2 h-3.5 w-3.5" /> Edit Batch</DropdownMenuItem>
                        <DropdownMenuItem><UserPlus className="mr-2 h-3.5 w-3.5" /> Enroll Student</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Student List per batch */}
      {mockBatches.map(batch => {
        const batchStudents = students.filter(s => s.batchIds.includes(batch.id))
        return (
          <Card key={batch.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{batch.name}</CardTitle>
              <CardDescription>{batchStudents.length} students enrolled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {batchStudents.map(s => (
                  <Badge key={s.id} variant="secondary" className="gap-2 px-3 py-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="bg-primary/10 text-[8px] text-primary">
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {s.name}
                  </Badge>
                ))}
                {batchStudents.length === 0 && (
                  <p className="text-sm text-muted-foreground">No students enrolled yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Enroll Dialog */}
      <Dialog open={showEnroll} onOpenChange={setShowEnroll}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll Student</DialogTitle>
            <DialogDescription>
              Add a student to {mockBatches.find(b => b.id === selectedBatch)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Student</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Choose student" /></SelectTrigger>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name} ({s.email})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fee Status</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Fee status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnroll(false)}>Cancel</Button>
            <Button onClick={() => setShowEnroll(false)}>Enroll Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
