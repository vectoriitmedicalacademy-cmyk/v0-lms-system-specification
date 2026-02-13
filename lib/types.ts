export type Role = "student" | "teacher" | "admin" | "parent"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  avatar?: string
  batchIds: string[]
  parentOf?: string[] // for parents
  createdAt: string
}

export interface Batch {
  id: string
  name: string
  target: "IIT-JEE" | "NEET" | "MHT-CET"
  year: number
  teacherIds: string[]
  studentCount: number
}

export interface Course {
  id: string
  name: string
  target: string
  description: string
  subjectIds: string[]
  batchIds: string[]
}

export interface Subject {
  id: string
  name: string
  icon: string
  color: string
  chapters: Chapter[]
}

export interface ChapterQuiz {
  id: string
  chapterId: string
  title: string
  questionIds: string[]
  isMandatory: boolean
  isCompleted: boolean
  score?: number
  totalMarks: number
}

export interface Chapter {
  id: string
  subjectId: string
  name: string
  order: number
  lessonCount: number
  completionPercent?: number
}

export interface Lesson {
  id: string
  chapterId: string
  title: string
  type: "video" | "notes" | "dpp" | "test"
  duration?: number
  videoId?: string
  releaseDate: string
  isLocked: boolean
  isCompleted: boolean
}

export interface Question {
  id: string
  type: "MCQ" | "NAT" | "Subjective"
  text: string
  options?: { id: string; text: string }[]
  correctAnswer: string
  solution: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  subject: string
  chapter: string
}

export interface Test {
  id: string
  title: string
  type: "chapter" | "part" | "full-mock" | "pyq"
  subjectIds: string[]
  totalQuestions: number
  totalMarks: number
  duration: number // minutes
  scheduledAt: string
  batchIds: string[]
  status: "upcoming" | "live" | "completed"
}

export interface TestAttempt {
  id: string
  testId: string
  userId: string
  score: number
  totalMarks: number
  accuracy: number
  timeTaken: number
  rank?: number
  submittedAt: string
}

export interface DPP {
  id: string
  title: string
  chapterId: string
  questionCount: number
  releaseDate: string
  deadline: string
  batchIds: string[]
}

export interface Attendance {
  id: string
  userId: string
  date: string
  status: "present" | "absent" | "late"
  batchId: string
}

export interface CommunityPost {
  id: string
  authorId: string
  authorName: string
  authorRole: Role
  room: string
  batchId: string
  title: string
  content: string
  upvotes: number
  commentCount: number
  isVerified: boolean
  isAnonymous: boolean
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  createdAt: string
}

export interface Payment {
  id: string
  userId: string
  amount: number
  status: "paid" | "pending" | "overdue"
  dueDate: string
  paidDate?: string
  description: string
}

export interface StudentProgress {
  userId: string
  overallCompletion: number
  studyHoursWeek: number
  streak: number
  rank: number
  totalStudents: number
  subjectProgress: {
    subjectId: string
    subjectName: string
    completion: number
    accuracy: number
  }[]
  weeklyStudyHours: { day: string; hours: number }[]
  testScoreTrend: { test: string; score: number; avg: number }[]
  chapterAccuracy: { chapter: string; accuracy: number; attempts: number }[]
}

export interface Challenge {
  id: string
  fromUserId: string
  fromUserName: string
  toUserId: string
  toUserName: string
  subject: string
  chapter: string
  questionIds: string[]
  status: "pending" | "accepted" | "in-progress" | "completed" | "declined"
  createdAt: string
  expiresAt: string
  fromScore?: number
  toScore?: number
  winnerId?: string
}

export interface DailyChallenge {
  id: string
  date: string
  subjectId: string
  subjectName: string
  questions: DailyChallengeQuestion[]
  isCompleted: boolean
  score?: number
  totalMarks: number
}

export interface DailyChallengeQuestion {
  questionId: string
  text: string
  options: { id: string; text: string }[]
  correctAnswer: string
  solution: string
  difficulty: "Easy" | "Medium" | "Hard"
  userAnswer?: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  icon: string
  requirement: number
  current: number
  isUnlocked: boolean
  category: "daily" | "streak" | "subject" | "overall"
}

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}
