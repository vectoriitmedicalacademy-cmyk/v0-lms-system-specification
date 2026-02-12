"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Plus, Search, MoreHorizontal, Edit, Trash2, Copy, Upload, Download,
  Eye, Database, Tag, Filter
} from "lucide-react"
import { mockQuestions, mockSubjects } from "@/lib/mock-data"

const difficultyColor = {
  Easy: "bg-accent/10 text-accent border-accent/30",
  Medium: "bg-warning/10 text-warning border-warning/30",
  Hard: "bg-destructive/10 text-destructive border-destructive/30",
}

export function AdminQuestions() {
  const [search, setSearch] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [diffFilter, setDiffFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showCreate, setShowCreate] = useState(false)
  const [optionCount, setOptionCount] = useState(4)

  const filtered = mockQuestions.filter(q => {
    const matchSearch = q.text.toLowerCase().includes(search.toLowerCase()) || q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchSubject = subjectFilter === "all" || q.subject === subjectFilter
    const matchDiff = diffFilter === "all" || q.difficulty === diffFilter
    const matchType = typeFilter === "all" || q.type === typeFilter
    return matchSearch && matchSubject && matchDiff && matchType
  })

  const stats = {
    total: mockQuestions.length,
    mcq: mockQuestions.filter(q => q.type === "MCQ").length,
    nat: mockQuestions.filter(q => q.type === "NAT").length,
    subjective: mockQuestions.filter(q => q.type === "Subjective").length,
    easy: mockQuestions.filter(q => q.difficulty === "Easy").length,
    medium: mockQuestions.filter(q => q.difficulty === "Medium").length,
    hard: mockQuestions.filter(q => q.difficulty === "Hard").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Question Bank</h1>
          <p className="text-muted-foreground">Create, tag, and manage questions with solutions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Upload className="h-4 w-4" /> Import CSV</Button>
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
          <Button className="gap-2" onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> Add Question</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        {[
          { label: "Total", value: stats.total, color: "bg-primary/10 text-primary" },
          { label: "MCQ", value: stats.mcq, color: "bg-primary/10 text-primary" },
          { label: "NAT", value: stats.nat, color: "bg-accent/10 text-accent" },
          { label: "Subjective", value: stats.subjective, color: "bg-warning/10 text-warning" },
          { label: "Easy", value: stats.easy, color: "bg-accent/10 text-accent" },
          { label: "Medium", value: stats.medium, color: "bg-warning/10 text-warning" },
          { label: "Hard", value: stats.hard, color: "bg-destructive/10 text-destructive" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-2 p-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.color}`}>
                <Database className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search questions, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Subject" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {mockSubjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="MCQ">MCQ</SelectItem>
              <SelectItem value="NAT">NAT</SelectItem>
              <SelectItem value="Subjective">Subjective</SelectItem>
            </SelectContent>
          </Select>
          <Select value={diffFilter} onValueChange={setDiffFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Difficulty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{q.id}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm font-medium text-foreground">{q.text}</p>
                    {q.type === "MCQ" && q.options && (
                      <div className="mt-1 flex gap-1">
                        {q.options.map(opt => (
                          <Badge
                            key={opt.id}
                            variant={opt.id === q.correctAnswer ? "default" : "outline"}
                            className="text-[10px]"
                          >
                            {opt.id.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{q.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{q.subject}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{q.chapter}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${difficultyColor[q.difficulty]}`}>
                      {q.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {q.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">
                          <Tag className="mr-0.5 h-2.5 w-2.5" />{tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-3.5 w-3.5" /> Preview</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="mr-2 h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem><Copy className="mr-2 h-3.5 w-3.5" /> Duplicate</DropdownMenuItem>
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

      {/* Create Question Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Question</DialogTitle>
            <DialogDescription>Add a question to the bank with tags and solution</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select defaultValue="MCQ">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MCQ">MCQ</SelectItem>
                    <SelectItem value="NAT">NAT (Numerical)</SelectItem>
                    <SelectItem value="Subjective">Subjective</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {mockSubjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Chapter</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                <SelectContent>
                  {mockSubjects.flatMap(s => s.chapters.map(ch => (
                    <SelectItem key={ch.id} value={ch.name}>{s.name} - {ch.name}</SelectItem>
                  )))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Question Text</Label>
              <Textarea placeholder="Enter the question..." rows={3} />
            </div>

            {/* Options for MCQ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Options (MCQ)</Label>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setOptionCount(Math.min(optionCount + 1, 6))}>
                  <Plus className="mr-1 h-3 w-3" /> Add Option
                </Button>
              </div>
              {Array.from({ length: optionCount }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Badge variant="outline" className="h-8 w-8 items-center justify-center rounded-full">
                    {String.fromCharCode(65 + i)}
                  </Badge>
                  <Input placeholder={`Option ${String.fromCharCode(65 + i)}`} className="flex-1" />
                  <div className="flex items-center gap-1">
                    <Switch id={`correct-${i}`} />
                    <Label htmlFor={`correct-${i}`} className="text-xs text-muted-foreground">Correct</Label>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Step-by-Step Solution</Label>
              <Textarea placeholder="Write the detailed solution..." rows={4} />
            </div>

            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input placeholder="e.g. Mechanics, Energy, JEE-2024, Concept" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Concept Tag</Label>
                <Input placeholder="e.g. Conservation of Energy" />
              </div>
              <div className="space-y-2">
                <Label>Mistake Tag</Label>
                <Input placeholder="e.g. Unit conversion error" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Exam Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JEE-Main">JEE Main</SelectItem>
                    <SelectItem value="JEE-Advanced">JEE Advanced</SelectItem>
                    <SelectItem value="NEET">NEET</SelectItem>
                    <SelectItem value="MHT-CET">MHT-CET</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Source / Year</Label>
                <Input placeholder="e.g. JEE Main 2024 Shift 1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => setShowCreate(false)}>Save Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
