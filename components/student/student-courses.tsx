"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search, ChevronRight, ChevronLeft, Clock, X
} from "lucide-react"
import { mockSubjects, mockLessons } from "@/lib/mock-data"
import type { Subject } from "@/lib/types"

export function StudentCourses() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  const filteredSubjects = mockSubjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.chapters.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6 pb-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search Chapter, subjects, topics wise..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 rounded-xl border-border bg-card pl-11 text-sm"
        />
      </div>

      {/* Subject Sections */}
      {filteredSubjects.map((subject) => (
        <div key={subject.id}>
          {/* Section Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">{subject.name}</h2>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-foreground bg-foreground text-card hover:bg-foreground/90 hover:text-card"
              onClick={() => setSelectedSubject(subject)}
            >
              View All
            </Button>
          </div>

          {/* Chapter Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subject.chapters.slice(0, 3).map((chapter) => {
              const lessons = mockLessons.filter(l => l.chapterId === chapter.id)
              const videoCount = lessons.filter(l => l.type === "video").length
              const totalDuration = lessons.reduce((acc, l) => acc + (l.duration || 0), 0)

              return (
                <Card
                  key={chapter.id}
                  className="group cursor-pointer overflow-hidden border-none bg-muted/60 transition-all hover:shadow-md"
                >
                  {/* Thumbnail area */}
                  <div
                    className="flex aspect-[16/10] items-center justify-center rounded-t-lg"
                    style={{ backgroundColor: `${subject.color}15` }}
                  >
                    <div className="text-center">
                      <span
                        className="text-4xl font-black"
                        style={{ color: subject.color }}
                      >
                        {chapter.name.charAt(0)}
                      </span>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">Ch. {chapter.order}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">{chapter.name}</h3>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      {videoCount > 0 && <span>{videoCount} videos</span>}
                      {totalDuration > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {totalDuration}m
                        </span>
                      )}
                      <span>{chapter.lessonCount} lessons</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{chapter.completionPercent || 0}%</span>
                      </div>
                      <Progress value={chapter.completionPercent || 0} className="mt-1 h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      {/* Chapter List Modal (like the Physics modal in reference) */}
      <Dialog open={!!selectedSubject} onOpenChange={(open) => !open && setSelectedSubject(null)}>
        <DialogContent className="max-w-2xl rounded-2xl p-0">
          <div className="p-6 pb-0">
            <DialogHeader className="flex-row items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-foreground">{selectedSubject?.name}</DialogTitle>
              <button
                onClick={() => setSelectedSubject(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogHeader>
          </div>

          <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
            <div className="space-y-0">
              {selectedSubject?.chapters.map((chapter, idx) => {
                const isCompleted = (chapter.completionPercent || 0) >= 100
                const lessons = mockLessons.filter(l => l.chapterId === chapter.id)
                const totalDuration = lessons.reduce((acc, l) => acc + (l.duration || 0), 0)

                return (
                  <div key={chapter.id}>
                    <div className="flex items-center gap-4 py-4">
                      <Checkbox
                        checked={isCompleted}
                        className="h-5 w-5 rounded border-2 data-[state=checked]:bg-foreground data-[state=checked]:text-card"
                      />
                      <span className="flex-1 text-sm font-medium text-foreground">
                        Chapter {chapter.order} &nbsp; {chapter.name}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {totalDuration || Math.round(Math.random() * 60 + 20)} mins
                      </span>
                    </div>
                    {idx < (selectedSubject?.chapters.length || 0) - 1 && (
                      <div className="border-b border-dashed border-border" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom - Completion + Pagination */}
          <div className="border-t border-border p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                <span className="font-medium">
                  {Math.round(
                    (selectedSubject?.chapters.reduce((acc, c) => acc + (c.completionPercent || 0), 0) || 0)
                    / (selectedSubject?.chapters.length || 1)
                  )}% Completed
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {mockSubjects.map((sub, i) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub)}
                    className={`h-2.5 w-2.5 rounded-sm transition-all ${
                      sub.id === selectedSubject?.id ? "bg-foreground scale-125" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-card hover:bg-foreground/90">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
