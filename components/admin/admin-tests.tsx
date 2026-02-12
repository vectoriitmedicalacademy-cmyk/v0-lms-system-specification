"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus, MoreHorizontal, Edit, Trash2, Eye, Clock, Users, ClipboardCheck,
  FileText, Calendar, Send
} from "lucide-react"
import { mockTests, mockDPPs, mockBatches, mockSubjects } from "@/lib/mock-data"

const statusColors = {
  upcoming: "bg-primary/10 text-primary border-primary/30",
  live: "bg-accent/10 text-accent border-accent/30",
  completed: "bg-muted text-muted-foreground border-border",
}

export function AdminTests() {
  const [activeTab, setActiveTab] = useState("tests")
  const [showCreateTest, setShowCreateTest] = useState(false)
  const [showCreateDPP, setShowCreateDPP] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tests & DPP Management</h1>
          <p className="text-muted-foreground">Create tests, mocks, DPPs and manage scheduling</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockTests.length}</p>
              <p className="text-xs text-muted-foreground">Total Tests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <FileText className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockDPPs.length}</p>
              <p className="text-xs text-muted-foreground">Active DPPs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockTests.filter(t => t.status === "upcoming").length}</p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <ClipboardCheck className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockTests.filter(t => t.status === "completed").length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tests">Tests & Mocks</TabsTrigger>
          <TabsTrigger value="dpps">Daily Practice Papers</TabsTrigger>
        </TabsList>

        {/* Tests Tab */}
        <TabsContent value="tests" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => setShowCreateTest(true)}>
              <Plus className="h-4 w-4" /> Create Test
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Batches</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTests.map(test => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium text-foreground">{test.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">{test.type.replace("-", " ")}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{test.totalQuestions}</TableCell>
                      <TableCell className="text-muted-foreground">{test.duration} min</TableCell>
                      <TableCell className="text-muted-foreground">{test.totalMarks}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(test.scheduledAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {test.batchIds.map(bid => {
                            const batch = mockBatches.find(b => b.id === bid)
                            return batch ? (
                              <Badge key={bid} variant="secondary" className="text-[10px]">
                                {batch.name.split(" - ")[1]}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${statusColors[test.status]}`}>
                          {test.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="mr-2 h-3.5 w-3.5" /> Preview</DropdownMenuItem>
                            <DropdownMenuItem><Edit className="mr-2 h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem><Send className="mr-2 h-3.5 w-3.5" /> Publish</DropdownMenuItem>
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
        </TabsContent>

        {/* DPPs Tab */}
        <TabsContent value="dpps" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => setShowCreateDPP(true)}>
              <Plus className="h-4 w-4" /> Create DPP
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DPP Title</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Batches</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDPPs.map(dpp => (
                    <TableRow key={dpp.id}>
                      <TableCell className="font-medium text-foreground">{dpp.title}</TableCell>
                      <TableCell className="text-muted-foreground">{dpp.chapterId}</TableCell>
                      <TableCell className="text-muted-foreground">{dpp.questionCount}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(dpp.releaseDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(dpp.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {dpp.batchIds.map(bid => {
                            const batch = mockBatches.find(b => b.id === bid)
                            return batch ? (
                              <Badge key={bid} variant="secondary" className="text-[10px]">
                                {batch.name.split(" - ")[1]}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="mr-2 h-3.5 w-3.5" /> Edit</DropdownMenuItem>
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
        </TabsContent>
      </Tabs>

      {/* Create Test Dialog */}
      <Dialog open={showCreateTest} onOpenChange={setShowCreateTest}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Test</DialogTitle>
            <DialogDescription>Set up a chapter test, part test, full mock, or PYQ paper</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Test Title</Label>
              <Input placeholder="e.g. Full Mock Test 2 - JEE Main" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Test Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chapter">Chapter Test</SelectItem>
                    <SelectItem value="part">Part Test</SelectItem>
                    <SelectItem value="full-mock">Full Mock</SelectItem>
                    <SelectItem value="pyq">PYQ Paper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" placeholder="180" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Questions</Label>
                <Input type="number" placeholder="90" />
              </div>
              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input type="number" placeholder="300" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Correct Marks</Label>
                <Input type="number" placeholder="+4" />
              </div>
              <div className="space-y-2">
                <Label>Negative Marks</Label>
                <Input type="number" placeholder="-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subjects</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select subjects" /></SelectTrigger>
                <SelectContent>
                  {mockSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Scheduled Date & Time</Label>
                <Input type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label>Test Window (hours)</Label>
                <Input type="number" placeholder="24" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Publish to Batches</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select batches" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {mockBatches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Switch id="randomize" />
              <Label htmlFor="randomize" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium text-foreground">Randomize Questions</p>
                <p className="text-xs text-muted-foreground">Shuffle question order for each student</p>
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateTest(false)}>Cancel</Button>
            <Button onClick={() => setShowCreateTest(false)}>Create Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create DPP Dialog */}
      <Dialog open={showCreateDPP} onOpenChange={setShowCreateDPP}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Daily Practice Paper</DialogTitle>
            <DialogDescription>Select questions from the bank for a DPP</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>DPP Title</Label>
              <Input placeholder="e.g. Mechanics DPP 2" />
            </div>
            <div className="space-y-2">
              <Label>Chapter</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                <SelectContent>
                  {mockSubjects.flatMap(s => s.chapters.map(ch => (
                    <SelectItem key={ch.id} value={ch.id}>{s.name} - {ch.name}</SelectItem>
                  )))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Release Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Solution Unlock Policy</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="When to show solutions" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="after-submit">After Submission</SelectItem>
                  <SelectItem value="after-deadline">After Deadline</SelectItem>
                  <SelectItem value="manual">Manual Unlock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Publish to Batches</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select batches" /></SelectTrigger>
                <SelectContent>
                  {mockBatches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDPP(false)}>Cancel</Button>
            <Button onClick={() => setShowCreateDPP(false)}>Create DPP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
