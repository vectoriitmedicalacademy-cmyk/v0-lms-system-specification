import type {
  User, Batch, Subject, Test, TestAttempt, DPP, CommunityPost,
  Notification, Payment, StudentProgress, Lesson, Question, Attendance, Challenge,
  Course, ChapterQuiz, DailyChallenge, DailyChallengeQuestion, Milestone,
  College, ExamAnnouncement, JournalEntry, MistakeEntry, FormulaSheet, WeeklyReflection,
  VectorCredit, CreditReward
} from "./types"

// ---- Users ----
export const mockUsers: User[] = [
  { id: "u1", name: "Aarav Sharma", email: "aarav@example.com", phone: "9876543210", role: "student", batchIds: ["b1"], createdAt: "2025-06-15" },
  { id: "u2", name: "Priya Patel", email: "priya@example.com", phone: "9876543211", role: "student", batchIds: ["b1"], createdAt: "2025-06-15" },
  { id: "u3", name: "Rohan Mehta", email: "rohan@example.com", phone: "9876543212", role: "student", batchIds: ["b1"], createdAt: "2025-07-01" },
  { id: "u4", name: "Sneha Gupta", email: "sneha@example.com", phone: "9876543213", role: "student", batchIds: ["b2"], createdAt: "2025-07-10" },
  { id: "u5", name: "Vikram Desai", email: "vikram@example.com", phone: "9876543214", role: "student", batchIds: ["b2"], createdAt: "2025-07-10" },
  { id: "t1", name: "Dr. Rajesh Kumar", email: "rajesh@vector.edu", phone: "9876543220", role: "teacher", batchIds: ["b1", "b2"], createdAt: "2024-01-01" },
  { id: "t2", name: "Prof. Anita Singh", email: "anita@vector.edu", phone: "9876543221", role: "teacher", batchIds: ["b1"], createdAt: "2024-01-01" },
  { id: "t3", name: "Dr. Suresh Iyer", email: "suresh@vector.edu", phone: "9876543222", role: "teacher", batchIds: ["b2", "b3"], createdAt: "2024-03-01" },
  { id: "a1", name: "Admin User", email: "admin@vector.edu", phone: "9876543230", role: "admin", batchIds: [], createdAt: "2024-01-01" },
  { id: "p1", name: "Mr. Sharma", email: "parent@example.com", phone: "9876543240", role: "parent", batchIds: [], parentOf: ["u1"], createdAt: "2025-06-15" },
]

// ---- Batches ----
export const mockBatches: Batch[] = [
  { id: "b1", name: "JEE Advanced 2026 - Alpha", target: "IIT-JEE", year: 2026, teacherIds: ["t1", "t2"], studentCount: 45 },
  { id: "b2", name: "NEET 2026 - Bravo", target: "NEET", year: 2026, teacherIds: ["t1", "t3"], studentCount: 60 },
  { id: "b3", name: "MHT-CET 2026 - Charlie", target: "MHT-CET", year: 2026, teacherIds: ["t3"], studentCount: 38 },
]

// ---- Courses ----
export const mockCourses: Course[] = [
  { id: "course1", name: "JEE Advanced 2026 - Alpha", target: "IIT-JEE", description: "Complete JEE Advanced preparation with Physics, Chemistry and Mathematics.", subjectIds: ["s1", "s2", "s3"], batchIds: ["b1"] },
  { id: "course2", name: "NEET 2026 - Bravo", target: "NEET", description: "Full NEET syllabus covering Physics, Chemistry and Biology.", subjectIds: ["s1", "s2", "s4"], batchIds: ["b2"] },
  { id: "course3", name: "MHT-CET 2026 - Charlie", target: "MHT-CET", description: "MHT-CET focused course for Maharashtra state entrance.", subjectIds: ["s1", "s2", "s3"], batchIds: ["b3"] },
]

// ---- Subjects ----
export const mockSubjects: Subject[] = [
  {
    id: "s1", name: "Physics", icon: "Atom", color: "hsl(217, 91%, 50%)",
    chapters: [
      { id: "c1", subjectId: "s1", name: "Mechanics", order: 1, lessonCount: 12, completionPercent: 85 },
      { id: "c2", subjectId: "s1", name: "Thermodynamics", order: 2, lessonCount: 8, completionPercent: 60 },
      { id: "c3", subjectId: "s1", name: "Waves & Optics", order: 3, lessonCount: 10, completionPercent: 30 },
      { id: "c4", subjectId: "s1", name: "Electrodynamics", order: 4, lessonCount: 14, completionPercent: 0 },
    ]
  },
  {
    id: "s2", name: "Chemistry", icon: "FlaskConical", color: "hsl(152, 60%, 42%)",
    chapters: [
      { id: "c5", subjectId: "s2", name: "Atomic Structure", order: 1, lessonCount: 6, completionPercent: 100 },
      { id: "c6", subjectId: "s2", name: "Chemical Bonding", order: 2, lessonCount: 8, completionPercent: 70 },
      { id: "c7", subjectId: "s2", name: "Organic Chemistry I", order: 3, lessonCount: 15, completionPercent: 45 },
      { id: "c8", subjectId: "s2", name: "Physical Chemistry", order: 4, lessonCount: 10, completionPercent: 20 },
    ]
  },
  {
    id: "s3", name: "Mathematics", icon: "Calculator", color: "hsl(38, 92%, 50%)",
    chapters: [
      { id: "c9", subjectId: "s3", name: "Calculus", order: 1, lessonCount: 18, completionPercent: 90 },
      { id: "c10", subjectId: "s3", name: "Algebra", order: 2, lessonCount: 12, completionPercent: 55 },
      { id: "c11", subjectId: "s3", name: "Coordinate Geometry", order: 3, lessonCount: 10, completionPercent: 40 },
      { id: "c12", subjectId: "s3", name: "Trigonometry", order: 4, lessonCount: 8, completionPercent: 75 },
    ]
  },
  {
    id: "s4", name: "Biology", icon: "Dna", color: "hsl(262, 52%, 55%)",
    chapters: [
      { id: "c13", subjectId: "s4", name: "Cell Biology", order: 1, lessonCount: 10, completionPercent: 80 },
      { id: "c14", subjectId: "s4", name: "Genetics", order: 2, lessonCount: 12, completionPercent: 50 },
      { id: "c15", subjectId: "s4", name: "Human Physiology", order: 3, lessonCount: 16, completionPercent: 25 },
    ]
  },
]

// ---- Lessons ----
export const mockLessons: Lesson[] = [
  { id: "l1", chapterId: "c1", title: "Newton's Laws of Motion", type: "video", duration: 45, videoId: "dQw4w9WgXcQ", releaseDate: "2025-07-01", isLocked: false, isCompleted: true },
  { id: "l2", chapterId: "c1", title: "Work, Energy & Power", type: "video", duration: 50, videoId: "dQw4w9WgXcQ", releaseDate: "2025-07-03", isLocked: false, isCompleted: true },
  { id: "l3", chapterId: "c1", title: "Mechanics Notes PDF", type: "notes", releaseDate: "2025-07-01", isLocked: false, isCompleted: true },
  { id: "l4", chapterId: "c1", title: "DPP - Mechanics Set 1", type: "dpp", releaseDate: "2025-07-02", isLocked: false, isCompleted: false },
  { id: "l5", chapterId: "c2", title: "Laws of Thermodynamics", type: "video", duration: 55, videoId: "dQw4w9WgXcQ", releaseDate: "2025-07-10", isLocked: false, isCompleted: false },
  { id: "l6", chapterId: "c3", title: "Wave Motion", type: "video", duration: 40, videoId: "dQw4w9WgXcQ", releaseDate: "2025-08-01", isLocked: true, isCompleted: false },
  { id: "l7", chapterId: "c5", title: "Bohr's Model", type: "video", duration: 35, videoId: "dQw4w9WgXcQ", releaseDate: "2025-07-05", isLocked: false, isCompleted: true },
  { id: "l8", chapterId: "c9", title: "Limits & Continuity", type: "video", duration: 60, videoId: "dQw4w9WgXcQ", releaseDate: "2025-07-01", isLocked: false, isCompleted: false },
]

// ---- Chapter Quizzes (mandatory end-of-chapter) ----
export const mockChapterQuizzes: ChapterQuiz[] = [
  { id: "cq1", chapterId: "c1", title: "Mechanics Chapter Quiz", questionIds: ["q1", "q5"], isMandatory: true, isCompleted: true, score: 8, totalMarks: 10 },
  { id: "cq2", chapterId: "c2", title: "Thermodynamics Chapter Quiz", questionIds: ["q1"], isMandatory: true, isCompleted: false, totalMarks: 10 },
  { id: "cq3", chapterId: "c3", title: "Waves & Optics Chapter Quiz", questionIds: ["q1"], isMandatory: true, isCompleted: false, totalMarks: 10 },
  { id: "cq4", chapterId: "c4", title: "Electrodynamics Chapter Quiz", questionIds: ["q5"], isMandatory: true, isCompleted: false, totalMarks: 10 },
  { id: "cq5", chapterId: "c5", title: "Atomic Structure Chapter Quiz", questionIds: ["q2"], isMandatory: true, isCompleted: true, score: 10, totalMarks: 10 },
  { id: "cq6", chapterId: "c6", title: "Chemical Bonding Chapter Quiz", questionIds: ["q2"], isMandatory: true, isCompleted: false, totalMarks: 10 },
  { id: "cq7", chapterId: "c7", title: "Organic Chemistry I Chapter Quiz", questionIds: ["q2"], isMandatory: true, isCompleted: false, totalMarks: 10 },
  { id: "cq8", chapterId: "c8", title: "Physical Chemistry Chapter Quiz", questionIds: ["q2"], isMandatory: true, isCompleted: false, totalMarks: 10 },
  { id: "cq9", chapterId: "c9", title: "Calculus Chapter Quiz", questionIds: ["q3"], isMandatory: true, isCompleted: true, score: 9, totalMarks: 10 },
  { id: "cq10", chapterId: "c10", title: "Algebra Chapter Quiz", questionIds: ["q3"], isMandatory: true, isCompleted: false, totalMarks: 10 },
  { id: "cq11", chapterId: "c11", title: "Coordinate Geometry Chapter Quiz", questionIds: ["q3"], isMandatory: true, isCompleted: false, totalMarks: 10 },
  { id: "cq12", chapterId: "c12", title: "Trigonometry Chapter Quiz", questionIds: ["q3"], isMandatory: true, isCompleted: false, totalMarks: 10 },
  { id: "cq13", chapterId: "c13", title: "Cell Biology Chapter Quiz", questionIds: ["q4"], isMandatory: true, isCompleted: true, score: 7, totalMarks: 10 },
  { id: "cq14", chapterId: "c14", title: "Genetics Chapter Quiz", questionIds: ["q4"], isMandatory: true, isCompleted: false, totalMarks: 10 },
  { id: "cq15", chapterId: "c15", title: "Human Physiology Chapter Quiz", questionIds: ["q4"], isMandatory: true, isCompleted: false, totalMarks: 10 },
]

// ---- Questions ----
export const mockQuestions: Question[] = [
  { id: "q1", type: "MCQ", text: "A body of mass 5 kg is moving with a velocity of 10 m/s. What is its kinetic energy?", options: [{ id: "a", text: "250 J" }, { id: "b", text: "500 J" }, { id: "c", text: "100 J" }, { id: "d", text: "50 J" }], correctAnswer: "a", solution: "KE = 1/2 mv^2 = 1/2 x 5 x 100 = 250 J", difficulty: "Easy", tags: ["Mechanics", "Energy"], subject: "Physics", chapter: "Mechanics" },
  { id: "q2", type: "MCQ", text: "The bond angle in water molecule is approximately:", options: [{ id: "a", text: "90 degrees" }, { id: "b", text: "104.5 degrees" }, { id: "c", text: "109.5 degrees" }, { id: "d", text: "120 degrees" }], correctAnswer: "b", solution: "Water has two lone pairs which compress the bond angle from 109.5 to 104.5 degrees.", difficulty: "Medium", tags: ["Bonding", "Molecular Geometry"], subject: "Chemistry", chapter: "Chemical Bonding" },
  { id: "q3", type: "MCQ", text: "If f(x) = x^3 - 3x + 2, find f'(1):", options: [{ id: "a", text: "0" }, { id: "b", text: "1" }, { id: "c", text: "-1" }, { id: "d", text: "3" }], correctAnswer: "a", solution: "f'(x) = 3x^2 - 3, f'(1) = 3(1) - 3 = 0", difficulty: "Easy", tags: ["Differentiation"], subject: "Mathematics", chapter: "Calculus" },
  { id: "q4", type: "MCQ", text: "Which organelle is known as the powerhouse of the cell?", options: [{ id: "a", text: "Nucleus" }, { id: "b", text: "Mitochondria" }, { id: "c", text: "Ribosome" }, { id: "d", text: "Golgi body" }], correctAnswer: "b", solution: "Mitochondria produce ATP through cellular respiration.", difficulty: "Easy", tags: ["Cell Biology"], subject: "Biology", chapter: "Cell Biology" },
  { id: "q5", type: "NAT", text: "A projectile is fired with velocity 20 m/s at angle 30 degrees. Find the range. (Take g = 10 m/s^2)", options: [], correctAnswer: "34.64", solution: "R = u^2 sin(2theta)/g = 400 x sin60 / 10 = 34.64 m", difficulty: "Hard", tags: ["Projectile Motion"], subject: "Physics", chapter: "Mechanics" },
]

// ---- Tests ----
export const mockTests: Test[] = [
  { id: "test1", title: "Mechanics Chapter Test", type: "chapter", subjectIds: ["s1"], totalQuestions: 30, totalMarks: 120, duration: 60, scheduledAt: "2026-02-15T10:00:00", batchIds: ["b1"], status: "completed" },
  { id: "test2", title: "Part Test 1 - Physics + Chemistry", type: "part", subjectIds: ["s1", "s2"], totalQuestions: 60, totalMarks: 240, duration: 120, scheduledAt: "2026-02-20T09:00:00", batchIds: ["b1", "b2"], status: "completed" },
  { id: "test3", title: "Full Mock Test 1 - JEE Main", type: "full-mock", subjectIds: ["s1", "s2", "s3"], totalQuestions: 90, totalMarks: 300, duration: 180, scheduledAt: "2026-02-25T09:00:00", batchIds: ["b1"], status: "upcoming" },
  { id: "test4", title: "NEET Biology Mock", type: "full-mock", subjectIds: ["s4", "s2"], totalQuestions: 90, totalMarks: 360, duration: 180, scheduledAt: "2026-02-22T10:00:00", batchIds: ["b2"], status: "upcoming" },
  { id: "test5", title: "JEE Advanced PYQ 2024", type: "pyq", subjectIds: ["s1", "s2", "s3"], totalQuestions: 54, totalMarks: 180, duration: 180, scheduledAt: "2026-03-01T09:00:00", batchIds: ["b1"], status: "upcoming" },
]

// ---- Test Attempts ----
export const mockAttempts: TestAttempt[] = [
  { id: "a1", testId: "test1", userId: "u1", score: 96, totalMarks: 120, accuracy: 80, timeTaken: 52, rank: 3, submittedAt: "2026-02-15T11:00:00" },
  { id: "a2", testId: "test1", userId: "u2", score: 84, totalMarks: 120, accuracy: 70, timeTaken: 58, rank: 8, submittedAt: "2026-02-15T11:00:00" },
  { id: "a3", testId: "test2", userId: "u1", score: 192, totalMarks: 240, accuracy: 80, timeTaken: 110, rank: 5, submittedAt: "2026-02-20T11:00:00" },
  { id: "a4", testId: "test2", userId: "u3", score: 156, totalMarks: 240, accuracy: 65, timeTaken: 118, rank: 15, submittedAt: "2026-02-20T11:00:00" },
  { id: "a5", testId: "test1", userId: "u3", score: 72, totalMarks: 120, accuracy: 60, timeTaken: 55, rank: 12, submittedAt: "2026-02-15T11:00:00" },
]

// ---- DPPs ----
export const mockDPPs: DPP[] = [
  { id: "dpp1", title: "Mechanics DPP 1", chapterId: "c1", questionCount: 15, releaseDate: "2026-02-10", deadline: "2026-02-12", batchIds: ["b1"] },
  { id: "dpp2", title: "Thermodynamics DPP 1", chapterId: "c2", questionCount: 10, releaseDate: "2026-02-12", deadline: "2026-02-14", batchIds: ["b1"] },
  { id: "dpp3", title: "Atomic Structure DPP", chapterId: "c5", questionCount: 12, releaseDate: "2026-02-11", deadline: "2026-02-13", batchIds: ["b1", "b2"] },
  { id: "dpp4", title: "Calculus DPP 1", chapterId: "c9", questionCount: 20, releaseDate: "2026-02-13", deadline: "2026-02-15", batchIds: ["b1"] },
]

// ---- Community Posts ----
export const mockCommunityPosts: CommunityPost[] = [
  { id: "cp1", authorId: "u1", authorName: "Aarav Sharma", authorRole: "student", room: "Physics", batchId: "b1", title: "Doubt in Rotational Mechanics", content: "Can someone explain the parallel axis theorem with an example? I keep getting confused with the moment of inertia calculations.", upvotes: 12, commentCount: 5, isVerified: false, isAnonymous: false, createdAt: "2026-02-10T14:30:00" },
  { id: "cp2", authorId: "t1", authorName: "Dr. Rajesh Kumar", authorRole: "teacher", room: "Physics", batchId: "b1", title: "Important: Exam Strategy for JEE Main", content: "Here are some key tips for approaching the JEE Main Physics section. Focus on Mechanics and Electrodynamics as they carry the most weightage.", upvotes: 45, commentCount: 18, isVerified: true, isAnonymous: false, createdAt: "2026-02-09T10:00:00" },
  { id: "cp3", authorId: "u2", authorName: "Priya Patel", authorRole: "student", room: "Doubts", batchId: "b1", title: "Organic Chemistry - Named Reactions", content: "Is there a list of all important named reactions for JEE? I want to make a consolidated revision sheet.", upvotes: 23, commentCount: 8, isVerified: false, isAnonymous: false, createdAt: "2026-02-11T16:00:00" },
  { id: "cp4", authorId: "u3", authorName: "Anonymous", authorRole: "student", room: "General", batchId: "b1", title: "Feeling overwhelmed", content: "The syllabus seems too vast and I am falling behind. Any tips on how to catch up?", upvotes: 34, commentCount: 15, isVerified: false, isAnonymous: true, createdAt: "2026-02-11T20:00:00" },
  { id: "cp5", authorId: "t2", authorName: "Prof. Anita Singh", authorRole: "teacher", room: "Maths", batchId: "b1", title: "Calculus Revision Lecture Notes", content: "Attached are the revision notes for Limits, Continuity, and Differentiability. Practice the problems at the end.", upvotes: 38, commentCount: 7, isVerified: true, isAnonymous: false, createdAt: "2026-02-08T09:00:00" },
]

// ---- Notifications ----
export const mockNotifications: Notification[] = [
  { id: "n1", userId: "u1", title: "New Test Scheduled", message: "Full Mock Test 1 - JEE Main is scheduled for Feb 25 at 9:00 AM", type: "info", read: false, createdAt: "2026-02-12T08:00:00" },
  { id: "n2", userId: "u1", title: "DPP Deadline", message: "Thermodynamics DPP 1 is due tomorrow", type: "warning", read: false, createdAt: "2026-02-13T18:00:00" },
  { id: "n3", userId: "u1", title: "Score Published", message: "Your score for Part Test 1 has been published. Rank: 5", type: "success", read: true, createdAt: "2026-02-21T10:00:00" },
  { id: "n4", userId: "u1", title: "Payment Due", message: "Fee installment of Rs. 25,000 is due on March 1", type: "error", read: false, createdAt: "2026-02-10T08:00:00" },
]

// ---- Payments ----
export const mockPayments: Payment[] = [
  { id: "pay1", userId: "u1", amount: 50000, status: "paid", dueDate: "2025-07-01", paidDate: "2025-06-28", description: "Admission Fee - JEE Alpha Batch" },
  { id: "pay2", userId: "u1", amount: 25000, status: "paid", dueDate: "2025-10-01", paidDate: "2025-09-30", description: "2nd Installment" },
  { id: "pay3", userId: "u1", amount: 25000, status: "pending", dueDate: "2026-03-01", description: "3rd Installment" },
  { id: "pay4", userId: "u2", amount: 50000, status: "paid", dueDate: "2025-07-01", paidDate: "2025-07-01", description: "Admission Fee" },
  { id: "pay5", userId: "u3", amount: 25000, status: "overdue", dueDate: "2026-01-01", description: "2nd Installment" },
  { id: "pay6", userId: "u4", amount: 45000, status: "paid", dueDate: "2025-07-10", paidDate: "2025-07-10", description: "Admission Fee - NEET Bravo Batch" },
]

// ---- Attendance ----
export const mockAttendance: Attendance[] = [
  { id: "att1", userId: "u1", date: "2026-02-10", status: "present", batchId: "b1" },
  { id: "att2", userId: "u1", date: "2026-02-11", status: "present", batchId: "b1" },
  { id: "att3", userId: "u1", date: "2026-02-12", status: "late", batchId: "b1" },
  { id: "att4", userId: "u2", date: "2026-02-10", status: "present", batchId: "b1" },
  { id: "att5", userId: "u2", date: "2026-02-11", status: "absent", batchId: "b1" },
  { id: "att6", userId: "u3", date: "2026-02-10", status: "absent", batchId: "b1" },
  { id: "att7", userId: "u3", date: "2026-02-11", status: "present", batchId: "b1" },
]

// ---- Student Progress ----
export const mockStudentProgress: StudentProgress = {
  userId: "u1",
  overallCompletion: 58,
  studyHoursWeek: 32,
  streak: 14,
  rank: 5,
  totalStudents: 45,
  subjectProgress: [
    { subjectId: "s1", subjectName: "Physics", completion: 55, accuracy: 78 },
    { subjectId: "s2", subjectName: "Chemistry", completion: 62, accuracy: 72 },
    { subjectId: "s3", subjectName: "Mathematics", completion: 68, accuracy: 82 },
  ],
  weeklyStudyHours: [
    { day: "Mon", hours: 5.5 },
    { day: "Tue", hours: 4.2 },
    { day: "Wed", hours: 6.0 },
    { day: "Thu", hours: 3.8 },
    { day: "Fri", hours: 5.0 },
    { day: "Sat", hours: 7.5 },
    { day: "Sun", hours: 4.0 },
  ],
  testScoreTrend: [
    { test: "CT-1", score: 72, avg: 60 },
    { test: "CT-2", score: 78, avg: 62 },
    { test: "PT-1", score: 80, avg: 65 },
    { test: "CT-3", score: 75, avg: 58 },
    { test: "CT-4", score: 85, avg: 63 },
    { test: "PT-2", score: 88, avg: 66 },
  ],
  chapterAccuracy: [
    { chapter: "Mechanics", accuracy: 85, attempts: 48 },
    { chapter: "Thermo", accuracy: 72, attempts: 30 },
    { chapter: "Waves", accuracy: 65, attempts: 20 },
    { chapter: "Atomic Str.", accuracy: 90, attempts: 25 },
    { chapter: "Bonding", accuracy: 70, attempts: 32 },
    { chapter: "Organic I", accuracy: 55, attempts: 40 },
    { chapter: "Calculus", accuracy: 88, attempts: 55 },
    { chapter: "Algebra", accuracy: 75, attempts: 38 },
  ],
}

// ---- Challenges ----
export const mockChallenges: Challenge[] = [
  { id: "ch1", fromUserId: "u1", fromUserName: "Aarav Sharma", toUserId: "u2", toUserName: "Priya Patel", subject: "Physics", chapter: "Mechanics", questionIds: ["q1", "q5"], status: "completed", createdAt: "2026-02-10T10:30:00", expiresAt: "2026-02-10T22:30:00", fromScore: 8, toScore: 6, winnerId: "u1" },
  { id: "ch2", fromUserId: "u3", fromUserName: "Rohan Mehta", toUserId: "u1", toUserName: "Aarav Sharma", subject: "Chemistry", chapter: "Chemical Bonding", questionIds: ["q2"], status: "pending", createdAt: "2026-02-12T09:00:00", expiresAt: "2026-02-12T21:00:00" },
  { id: "ch3", fromUserId: "u1", fromUserName: "Aarav Sharma", toUserId: "u3", toUserName: "Rohan Mehta", subject: "Mathematics", chapter: "Calculus", questionIds: ["q3"], status: "in-progress", createdAt: "2026-02-11T14:00:00", expiresAt: "2026-02-12T14:00:00", fromScore: 4 },
  { id: "ch4", fromUserId: "u2", fromUserName: "Priya Patel", toUserId: "u1", toUserName: "Aarav Sharma", subject: "Physics", chapter: "Thermodynamics", questionIds: ["q1", "q5"], status: "completed", createdAt: "2026-02-08T11:00:00", expiresAt: "2026-02-08T23:00:00", fromScore: 7, toScore: 9, winnerId: "u1" },
  { id: "ch5", fromUserId: "u4", fromUserName: "Sneha Gupta", toUserId: "u1", toUserName: "Aarav Sharma", subject: "Mathematics", chapter: "Algebra", questionIds: ["q3"], status: "declined", createdAt: "2026-02-07T16:00:00", expiresAt: "2026-02-08T04:00:00" },
  { id: "ch6", fromUserId: "u1", fromUserName: "Aarav Sharma", toUserId: "u5", toUserName: "Vikram Desai", subject: "Physics", chapter: "Mechanics", questionIds: ["q1", "q5"], status: "accepted", createdAt: "2026-02-12T08:00:00", expiresAt: "2026-02-12T20:00:00" },
]

// ---- Daily Challenges (5 per subject per day) ----
const todayStr = new Date().toISOString().slice(0, 10)

function makeDailyQ(id: string, text: string, opts: string[], correct: string, solution: string, difficulty: "Easy" | "Medium" | "Hard"): DailyChallengeQuestion {
  return { questionId: id, text, options: opts.map((o, i) => ({ id: String.fromCharCode(97 + i), text: o })), correctAnswer: correct, solution, difficulty }
}

export const mockDailyChallenges: DailyChallenge[] = [
  {
    id: "dc-phy-today", date: todayStr, subjectId: "s1", subjectName: "Physics", isCompleted: false, totalMarks: 20,
    questions: [
      makeDailyQ("dc-p1", "A ball is thrown vertically upward with velocity 20 m/s. What is the maximum height? (g=10 m/s\u00B2)", ["10 m", "20 m", "30 m", "40 m"], "b", "h = u\u00B2/2g = 400/20 = 20 m", "Easy"),
      makeDailyQ("dc-p2", "Two forces of 3N and 4N act at right angles. What is the resultant?", ["5 N", "7 N", "1 N", "12 N"], "a", "R = \u221A(9+16) = 5 N", "Easy"),
      makeDailyQ("dc-p3", "A body moves in a circle of radius 2m with speed 4 m/s. What is centripetal acceleration?", ["2 m/s\u00B2", "4 m/s\u00B2", "8 m/s\u00B2", "16 m/s\u00B2"], "c", "a = v\u00B2/r = 16/2 = 8 m/s\u00B2", "Medium"),
      makeDailyQ("dc-p4", "The SI unit of impulse is:", ["N", "N\u00B7s", "J", "W"], "b", "Impulse = Force \u00D7 Time = N\u00B7s", "Easy"),
      makeDailyQ("dc-p5", "A spring of constant 100 N/m is compressed by 0.1 m. Find the PE stored.", ["0.5 J", "1 J", "5 J", "10 J"], "a", "PE = \u00BDkx\u00B2 = 0.5\u00D7100\u00D70.01 = 0.5 J", "Medium"),
    ]
  },
  {
    id: "dc-chem-today", date: todayStr, subjectId: "s2", subjectName: "Chemistry", isCompleted: false, totalMarks: 20,
    questions: [
      makeDailyQ("dc-c1", "The atomic number of Carbon is:", ["4", "6", "8", "12"], "b", "Carbon has 6 protons.", "Easy"),
      makeDailyQ("dc-c2", "Which gas is evolved when zinc reacts with dilute HCl?", ["O\u2082", "H\u2082", "Cl\u2082", "N\u2082"], "b", "Zn + 2HCl \u2192 ZnCl\u2082 + H\u2082", "Easy"),
      makeDailyQ("dc-c3", "The shape of methane molecule is:", ["Linear", "Trigonal Planar", "Tetrahedral", "Square Planar"], "c", "CH\u2084 has sp\u00B3 hybridization, tetrahedral shape.", "Medium"),
      makeDailyQ("dc-c4", "Which of the following is the strongest acid?", ["HF", "HCl", "HBr", "HI"], "d", "Acid strength increases down the group: HI > HBr > HCl > HF.", "Hard"),
      makeDailyQ("dc-c5", "The IUPAC name of CH\u2083CHO is:", ["Methanal", "Ethanal", "Propanal", "Acetone"], "b", "CH\u2083CHO is a 2-carbon aldehyde = Ethanal.", "Easy"),
    ]
  },
  {
    id: "dc-math-today", date: todayStr, subjectId: "s3", subjectName: "Mathematics", isCompleted: false, totalMarks: 20,
    questions: [
      makeDailyQ("dc-m1", "What is the derivative of sin(x)?", ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"], "a", "d/dx[sin(x)] = cos(x)", "Easy"),
      makeDailyQ("dc-m2", "If log\u2081\u2080(x) = 3, then x = ?", ["30", "100", "1000", "10000"], "c", "10\u00B3 = 1000", "Easy"),
      makeDailyQ("dc-m3", "The value of \u222B\u2080\u00B9 x\u00B2 dx is:", ["1/2", "1/3", "1/4", "1"], "b", "\u222B x\u00B2 dx = x\u00B3/3. From 0 to 1 = 1/3.", "Medium"),
      makeDailyQ("dc-m4", "If A = {1,2,3} and B = {2,3,4}, find A \u2229 B.", ["{1,2,3,4}", "{2,3}", "{1,4}", "{}"], "b", "Intersection = common elements = {2,3}.", "Easy"),
      makeDailyQ("dc-m5", "The sum of roots of x\u00B2 - 5x + 6 = 0 is:", ["5", "6", "-5", "-6"], "a", "Sum of roots = -b/a = 5.", "Easy"),
    ]
  },
  // Yesterday's completed challenges
  {
    id: "dc-phy-yest", date: "2026-02-12", subjectId: "s1", subjectName: "Physics", isCompleted: true, score: 16, totalMarks: 20,
    questions: [
      makeDailyQ("dc-yp1", "Unit of frequency is:", ["Hz", "m/s", "Nm", "Pa"], "a", "Frequency is measured in Hertz (Hz).", "Easy"),
      makeDailyQ("dc-yp2", "Speed of light in vacuum is approximately:", ["3\u00D710\u2075 m/s", "3\u00D710\u2078 m/s", "3\u00D710\u00B9\u2070 m/s", "3\u00D710\u00B3 m/s"], "b", "c \u2248 3\u00D710\u2078 m/s", "Easy"),
      makeDailyQ("dc-yp3", "A convex lens has focal length +20 cm. Its power is:", ["5 D", "+5 D", "-5 D", "0.5 D"], "b", "P = 1/f = 1/0.2 = +5 D", "Medium"),
      makeDailyQ("dc-yp4", "Ohm's law states:", ["V = IR", "V = I/R", "V = I + R", "V = R/I"], "a", "V = IR is Ohm's law.", "Easy"),
      makeDailyQ("dc-yp5", "Which color has the longest wavelength?", ["Violet", "Blue", "Green", "Red"], "d", "Red has the longest wavelength in visible spectrum.", "Easy"),
    ]
  },
  {
    id: "dc-chem-yest", date: "2026-02-12", subjectId: "s2", subjectName: "Chemistry", isCompleted: true, score: 12, totalMarks: 20,
    questions: [
      makeDailyQ("dc-yc1", "The pH of pure water at 25\u00B0C is:", ["0", "7", "14", "1"], "b", "Pure water has pH = 7 (neutral).", "Easy"),
      makeDailyQ("dc-yc2", "Number of moles in 44g of CO\u2082:", ["0.5", "1", "2", "22"], "b", "Molar mass of CO\u2082 = 44 g/mol, moles = 44/44 = 1.", "Easy"),
      makeDailyQ("dc-yc3", "Diamond is an allotrope of:", ["Silicon", "Carbon", "Nitrogen", "Boron"], "b", "Diamond is a crystalline allotrope of carbon.", "Easy"),
      makeDailyQ("dc-yc4", "The hybridization of carbon in ethylene is:", ["sp", "sp\u00B2", "sp\u00B3", "sp\u00B3d"], "b", "C=C double bond means sp\u00B2 hybridization.", "Medium"),
      makeDailyQ("dc-yc5", "Avogadro's number is:", ["6.02\u00D710\u00B2\u00B3", "6.02\u00D710\u00B2\u2074", "3.14\u00D710\u00B2\u00B3", "1.6\u00D710\u207B\u00B9\u2079"], "a", "N_A = 6.022 \u00D7 10\u00B2\u00B3 mol\u207B\u00B9", "Easy"),
    ]
  },
  {
    id: "dc-math-yest", date: "2026-02-12", subjectId: "s3", subjectName: "Mathematics", isCompleted: true, score: 20, totalMarks: 20,
    questions: [
      makeDailyQ("dc-ym1", "The value of sin(90\u00B0) is:", ["0", "1", "-1", "0.5"], "b", "sin(90\u00B0) = 1", "Easy"),
      makeDailyQ("dc-ym2", "How many diagonals does a pentagon have?", ["2", "3", "5", "10"], "c", "n(n-3)/2 = 5(2)/2 = 5", "Easy"),
      makeDailyQ("dc-ym3", "If f(x) = 2x+3, then f\u207B\u00B9(x) = ?", ["(x-3)/2", "(x+3)/2", "2x-3", "3x+2"], "a", "y = 2x+3, x = (y-3)/2", "Medium"),
      makeDailyQ("dc-ym4", "The determinant of a 2x2 identity matrix is:", ["0", "1", "2", "-1"], "b", "det(I) = 1", "Easy"),
      makeDailyQ("dc-ym5", "lim(x\u21920) sin(x)/x = ?", ["0", "1", "\u221E", "undefined"], "b", "Classic limit = 1", "Easy"),
    ]
  },
]

// ---- Milestones / Achievements ----
export const mockMilestones: Milestone[] = [
  { id: "m1", title: "First Blood", description: "Complete your first daily challenge", icon: "zap", requirement: 1, current: 6, isUnlocked: true, category: "daily" },
  { id: "m2", title: "Weekly Warrior", description: "Complete daily challenges for 7 days straight", icon: "flame", requirement: 7, current: 5, isUnlocked: false, category: "streak" },
  { id: "m3", title: "Perfect Score", description: "Score 100% on a daily challenge", icon: "star", requirement: 1, current: 1, isUnlocked: true, category: "daily" },
  { id: "m4", title: "Physics Pro", description: "Complete 30 Physics daily challenges", icon: "atom", requirement: 30, current: 12, isUnlocked: false, category: "subject" },
  { id: "m5", title: "Chemistry Champ", description: "Complete 30 Chemistry daily challenges", icon: "flask", requirement: 30, current: 10, isUnlocked: false, category: "subject" },
  { id: "m6", title: "Math Master", description: "Complete 30 Mathematics daily challenges", icon: "calculator", requirement: 30, current: 14, isUnlocked: false, category: "subject" },
  { id: "m7", title: "Centurion", description: "Complete 100 daily challenges total", icon: "trophy", requirement: 100, current: 36, isUnlocked: false, category: "overall" },
  { id: "m8", title: "Unstoppable", description: "Maintain a 30-day challenge streak", icon: "crown", requirement: 30, current: 5, isUnlocked: false, category: "streak" },
  { id: "m9", title: "Triple Threat", description: "Complete all 3 subjects in a single day", icon: "target", requirement: 1, current: 1, isUnlocked: true, category: "daily" },
  { id: "m10", title: "Consistent Learner", description: "Complete 50 daily challenges total", icon: "medal", requirement: 50, current: 36, isUnlocked: false, category: "overall" },
]

// ---- Colleges ----
export const mockColleges: College[] = [
  { id: "col1", name: "Indian Institute of Technology Bombay", shortName: "IIT Bombay", type: "Engineering", location: "Mumbai", state: "Maharashtra", ranking: 1, nirfRank: 3, acceptedExams: ["JEE Advanced"], cutoffs: [
    { exam: "JEE Advanced", year: 2025, category: "General", openingRank: 1, closingRank: 114, branch: "Computer Science" },
    { exam: "JEE Advanced", year: 2025, category: "General", openingRank: 115, closingRank: 382, branch: "Electrical Engineering" },
    { exam: "JEE Advanced", year: 2025, category: "OBC-NCL", openingRank: 1, closingRank: 198, branch: "Computer Science" },
    { exam: "JEE Advanced", year: 2025, category: "General", openingRank: 400, closingRank: 1100, branch: "Mechanical Engineering" },
  ], websiteUrl: "https://www.iitb.ac.in", logoColor: "hsl(217, 91%, 50%)" },
  { id: "col2", name: "Indian Institute of Technology Delhi", shortName: "IIT Delhi", type: "Engineering", location: "New Delhi", state: "Delhi", ranking: 2, nirfRank: 2, acceptedExams: ["JEE Advanced"], cutoffs: [
    { exam: "JEE Advanced", year: 2025, category: "General", openingRank: 1, closingRank: 98, branch: "Computer Science" },
    { exam: "JEE Advanced", year: 2025, category: "General", openingRank: 120, closingRank: 450, branch: "Electrical Engineering" },
    { exam: "JEE Advanced", year: 2025, category: "OBC-NCL", openingRank: 1, closingRank: 175, branch: "Computer Science" },
  ], websiteUrl: "https://www.iitd.ac.in", logoColor: "hsl(262, 52%, 55%)" },
  { id: "col3", name: "Indian Institute of Technology Madras", shortName: "IIT Madras", type: "Engineering", location: "Chennai", state: "Tamil Nadu", ranking: 3, nirfRank: 1, acceptedExams: ["JEE Advanced"], cutoffs: [
    { exam: "JEE Advanced", year: 2025, category: "General", openingRank: 1, closingRank: 107, branch: "Computer Science" },
    { exam: "JEE Advanced", year: 2025, category: "General", openingRank: 200, closingRank: 600, branch: "Electrical Engineering" },
  ], websiteUrl: "https://www.iitm.ac.in", logoColor: "hsl(0, 72%, 50%)" },
  { id: "col4", name: "Indian Institute of Technology Kanpur", shortName: "IIT Kanpur", type: "Engineering", location: "Kanpur", state: "Uttar Pradesh", ranking: 4, nirfRank: 4, acceptedExams: ["JEE Advanced"], cutoffs: [
    { exam: "JEE Advanced", year: 2025, category: "General", openingRank: 1, closingRank: 210, branch: "Computer Science" },
    { exam: "JEE Advanced", year: 2025, category: "General", openingRank: 350, closingRank: 900, branch: "Electrical Engineering" },
  ], websiteUrl: "https://www.iitk.ac.in", logoColor: "hsl(38, 92%, 50%)" },
  { id: "col5", name: "National Institute of Technology Trichy", shortName: "NIT Trichy", type: "Engineering", location: "Tiruchirappalli", state: "Tamil Nadu", ranking: 5, nirfRank: 9, acceptedExams: ["JEE Main"], cutoffs: [
    { exam: "JEE Main", year: 2025, category: "General", openingRank: 2500, closingRank: 8900, branch: "Computer Science" },
    { exam: "JEE Main", year: 2025, category: "OBC-NCL", openingRank: 1200, closingRank: 4500, branch: "Computer Science" },
  ], websiteUrl: "https://www.nitt.edu", logoColor: "hsl(152, 60%, 42%)" },
  { id: "col6", name: "NIT Warangal", shortName: "NIT Warangal", type: "Engineering", location: "Warangal", state: "Telangana", ranking: 6, nirfRank: 10, acceptedExams: ["JEE Main"], cutoffs: [
    { exam: "JEE Main", year: 2025, category: "General", openingRank: 3000, closingRank: 10500, branch: "Computer Science" },
  ], websiteUrl: "https://www.nitw.ac.in", logoColor: "hsl(200, 70%, 45%)" },
  { id: "col7", name: "BITS Pilani", shortName: "BITS Pilani", type: "Engineering", location: "Pilani", state: "Rajasthan", ranking: 7, nirfRank: 17, acceptedExams: ["BITSAT"], cutoffs: [
    { exam: "BITSAT", year: 2025, category: "General", openingRank: 1, closingRank: 350, branch: "Computer Science" },
    { exam: "BITSAT", year: 2025, category: "General", openingRank: 351, closingRank: 700, branch: "Electronics & Instrumentation" },
  ], websiteUrl: "https://www.bits-pilani.ac.in", ownExam: { name: "BITSAT 2026", url: "https://www.bitsadmission.com" }, logoColor: "hsl(340, 60%, 50%)" },
  { id: "col8", name: "VJTI Mumbai", shortName: "VJTI", type: "Engineering", location: "Mumbai", state: "Maharashtra", ranking: 8, acceptedExams: ["MHT-CET", "JEE Main"], cutoffs: [
    { exam: "MHT-CET", year: 2025, category: "General", openingRank: 50, closingRank: 800, branch: "Computer Engineering" },
    { exam: "JEE Main", year: 2025, category: "General", openingRank: 10000, closingRank: 25000, branch: "Computer Engineering" },
  ], websiteUrl: "https://vjti.ac.in", logoColor: "hsl(25, 85%, 50%)" },
  { id: "col9", name: "All India Institute of Medical Sciences Delhi", shortName: "AIIMS Delhi", type: "Medical", location: "New Delhi", state: "Delhi", ranking: 1, nirfRank: 1, acceptedExams: ["NEET UG"], cutoffs: [
    { exam: "NEET UG", year: 2025, category: "General", openingRank: 1, closingRank: 60, branch: "MBBS" },
    { exam: "NEET UG", year: 2025, category: "OBC-NCL", openingRank: 1, closingRank: 120, branch: "MBBS" },
  ], websiteUrl: "https://www.aiims.edu", logoColor: "hsl(210, 80%, 45%)" },
  { id: "col10", name: "Christian Medical College Vellore", shortName: "CMC Vellore", type: "Medical", location: "Vellore", state: "Tamil Nadu", ranking: 2, nirfRank: 5, acceptedExams: ["NEET UG"], cutoffs: [
    { exam: "NEET UG", year: 2025, category: "General", openingRank: 10, closingRank: 150, branch: "MBBS" },
  ], websiteUrl: "https://www.cmch-vellore.edu", logoColor: "hsl(152, 50%, 40%)" },
  { id: "col11", name: "Armed Forces Medical College", shortName: "AFMC Pune", type: "Medical", location: "Pune", state: "Maharashtra", ranking: 3, nirfRank: 8, acceptedExams: ["NEET UG"], cutoffs: [
    { exam: "NEET UG", year: 2025, category: "General", openingRank: 50, closingRank: 300, branch: "MBBS" },
  ], websiteUrl: "https://afmc.nic.in", logoColor: "hsl(130, 55%, 35%)" },
  { id: "col12", name: "Maulana Azad Medical College", shortName: "MAMC Delhi", type: "Medical", location: "New Delhi", state: "Delhi", ranking: 4, nirfRank: 6, acceptedExams: ["NEET UG"], cutoffs: [
    { exam: "NEET UG", year: 2025, category: "General", openingRank: 20, closingRank: 90, branch: "MBBS" },
  ], websiteUrl: "https://www.mamc.ac.in", logoColor: "hsl(0, 65%, 48%)" },
  { id: "col13", name: "VIT Vellore", shortName: "VIT Vellore", type: "Engineering", location: "Vellore", state: "Tamil Nadu", ranking: 9, nirfRank: 12, acceptedExams: ["VITEEE"], cutoffs: [
    { exam: "VITEEE", year: 2025, category: "General", openingRank: 1, closingRank: 5000, branch: "Computer Science" },
  ], websiteUrl: "https://vit.ac.in", ownExam: { name: "VITEEE 2026", url: "https://vit.ac.in/admissions" }, logoColor: "hsl(45, 90%, 45%)" },
  { id: "col14", name: "SRM Institute of Science and Technology", shortName: "SRM Chennai", type: "Engineering", location: "Chennai", state: "Tamil Nadu", ranking: 10, nirfRank: 19, acceptedExams: ["SRMJEEE"], cutoffs: [
    { exam: "SRMJEEE", year: 2025, category: "General", openingRank: 1, closingRank: 10000, branch: "Computer Science" },
  ], websiteUrl: "https://www.srmist.edu.in", ownExam: { name: "SRMJEEE 2026", url: "https://www.srmist.edu.in/admissions" }, logoColor: "hsl(220, 60%, 50%)" },
  { id: "col15", name: "Manipal Institute of Technology", shortName: "MIT Manipal", type: "Engineering", location: "Manipal", state: "Karnataka", ranking: 11, nirfRank: 22, acceptedExams: ["MET"], cutoffs: [
    { exam: "MET", year: 2025, category: "General", openingRank: 1, closingRank: 8000, branch: "Computer Science" },
  ], websiteUrl: "https://manipal.edu", ownExam: { name: "MET 2026", url: "https://manipal.edu/mu/admissions.html" }, logoColor: "hsl(15, 80%, 50%)" },
]

// ---- Exam Announcements ----
export const mockExamAnnouncements: ExamAnnouncement[] = [
  { id: "ea1", exam: "JEE Main 2026", title: "JEE Main 2026 Session 2 Registration Open", date: "2026-02-10", type: "registration", description: "NTA has opened the registration window for JEE Main 2026 Session 2. Last date to apply is March 5, 2026. Exam is scheduled for April 2-15, 2026.", sourceUrl: "https://jeemain.nta.nic.in", isNew: true },
  { id: "ea2", exam: "JEE Advanced 2026", title: "JEE Advanced 2026 Date Announced", date: "2026-02-08", type: "schedule", description: "IIT Bombay (organizing institute) has announced JEE Advanced 2026 will be held on May 18, 2026. Registration will begin after JEE Main Session 2 results.", sourceUrl: "https://jeeadv.ac.in", isNew: true },
  { id: "ea3", exam: "NEET UG 2026", title: "NEET UG 2026 Application Form Released", date: "2026-02-05", type: "registration", description: "NTA has released the NEET UG 2026 application form. The exam is scheduled for May 4, 2026. Last date to fill the form is March 10, 2026.", sourceUrl: "https://neet.nta.nic.in", isNew: true },
  { id: "ea4", exam: "MHT-CET 2026", title: "MHT-CET 2026 Exam Dates Released", date: "2026-02-01", type: "schedule", description: "Maharashtra CET Cell has announced MHT-CET 2026 PCM paper will be held from April 22-30, 2026. PCB paper from May 2-8, 2026.", sourceUrl: "https://cetcell.mahacet.org", isNew: false },
  { id: "ea5", exam: "JEE Main 2026", title: "JEE Main Session 1 Results Published", date: "2026-01-28", type: "result", description: "NTA has declared JEE Main 2026 Session 1 results. Students can check their scores and percentile on the official website. Cutoff for JEE Advanced eligibility: 90 percentile (General).", sourceUrl: "https://jeemain.nta.nic.in", isNew: false },
  { id: "ea6", exam: "BITSAT 2026", title: "BITSAT 2026 Registration Started", date: "2026-02-12", type: "registration", description: "BITS Pilani has opened BITSAT 2026 registration. The online exam will be conducted from May 20 to June 2, 2026. Apply before April 15.", sourceUrl: "https://www.bitsadmission.com", isNew: true },
  { id: "ea7", exam: "JEE Main 2026", title: "JEE Main Session 1 Admit Card Released", date: "2026-01-15", type: "admit-card", description: "NTA has released the admit cards for JEE Main 2026 Session 1. Download from the official portal using your application number and date of birth.", isNew: false },
  { id: "ea8", exam: "NEET UG 2026", title: "NEET UG 2026 Syllabus Updated", date: "2026-01-20", type: "update", description: "NMC has confirmed that NEET UG 2026 will follow the rationalized NCERT syllabus. Some chapters have been removed from Physics and Biology. Check the official notification.", isNew: false },
  { id: "ea9", exam: "VITEEE 2026", title: "VITEEE 2026 Mock Test Available", date: "2026-02-11", type: "update", description: "VIT has released a free mock test for VITEEE 2026. Students can practice on the official portal. The actual exam window is from April 18-28.", sourceUrl: "https://vit.ac.in/admissions", isNew: true },
  { id: "ea10", exam: "JEE Advanced 2026", title: "JEE Advanced 2026 Eligibility Criteria Updated", date: "2026-02-13", type: "update", description: "IIT Bombay has updated the eligibility criteria. Students must be in the top 2,50,000 of JEE Main 2026 (across both sessions). Age limit relaxed by 1 year for reserved categories.", isNew: true },
]

// ---- Journal Entries ----
export const mockJournalEntries: JournalEntry[] = [
  { id: "j1", date: "2026-02-13", title: "Productive day - Covered Electrodynamics", content: "Completed 3 lectures on electric field and potential. Solved 20 numericals. Need to revise Gauss's law tomorrow. Felt confident after the DPP session.", mood: "great", studyHours: 6.5, tags: ["Physics", "Electrodynamics", "DPP"], createdAt: "2026-02-13T21:00:00" },
  { id: "j2", date: "2026-02-12", title: "Struggled with Organic Chemistry", content: "Named reactions are getting confusing. Mixing up Aldol and Cannizzaro conditions. Need to make a separate sheet for reaction conditions. Morning session was good for Maths though.", mood: "okay", studyHours: 5, tags: ["Chemistry", "Organic", "Revision"], createdAt: "2026-02-12T20:30:00" },
  { id: "j3", date: "2026-02-11", title: "Mock test day", content: "Gave Part Test 1 today. Physics went well but Chemistry section was tough. Time management was better than last time. Need to work on Inorganic Chemistry.", mood: "good", studyHours: 7, tags: ["Mock Test", "Time Management", "Chemistry"], createdAt: "2026-02-11T22:00:00" },
  { id: "j4", date: "2026-02-10", title: "Slow start, picked up later", content: "Wasted morning on phone. Started late but then had a solid 4-hour session on Calculus. Completed integration by parts and partial fractions. Must not repeat the morning mistake.", mood: "bad", studyHours: 4, tags: ["Mathematics", "Calculus", "Discipline"], createdAt: "2026-02-10T21:30:00" },
  { id: "j5", date: "2026-02-09", title: "Revision marathon", content: "Revised Mechanics, Thermodynamics and Atomic Structure. Made flash cards for all formulas. Feeling ready for the upcoming part test. Also helped Priya with a doubt on SHM.", mood: "great", studyHours: 8, tags: ["Revision", "Physics", "Chemistry", "Flash Cards"], createdAt: "2026-02-09T23:00:00" },
]

// ---- Mistake Log ----
export const mockMistakes: MistakeEntry[] = [
  { id: "mk1", subject: "Physics", chapter: "Mechanics", question: "A block of 2kg on a rough surface (mu=0.3) is pulled by 10N at 30 degrees. Find acceleration.", myAnswer: "2.5 m/s\u00B2", correctAnswer: "1.84 m/s\u00B2", whyWrong: "Forgot to include the vertical component of the applied force while calculating Normal reaction", conceptNote: "N = mg - F*sin(theta), not just mg. Always resolve forces in both directions first.", isResolved: true, createdAt: "2026-02-12T15:00:00" },
  { id: "mk2", subject: "Chemistry", chapter: "Organic Chemistry I", question: "Identify the major product of dehydration of 2-methylcyclohexanol", myAnswer: "1-methylcyclohexene", correctAnswer: "2-methylcyclohexene (Zaitsev's rule)", whyWrong: "Applied anti-Markownikoff instead of Zaitsev's rule for elimination", conceptNote: "Zaitsev's rule: In elimination, the more substituted alkene is the major product. Anti-Markownikoff applies to HBr/peroxide addition.", isResolved: false, createdAt: "2026-02-11T16:30:00" },
  { id: "mk3", subject: "Mathematics", chapter: "Calculus", question: "Find the integral of ln(x) dx", myAnswer: "1/x + C", correctAnswer: "x*ln(x) - x + C", whyWrong: "Confused derivative of ln(x) with its integral. Need to use integration by parts.", conceptNote: "Use ILATE rule: take ln(x) as first function, 1 as second. Integration by parts: integral(u*dv) = uv - integral(v*du).", isResolved: true, createdAt: "2026-02-10T14:00:00" },
  { id: "mk4", subject: "Physics", chapter: "Thermodynamics", question: "In an adiabatic process, if volume doubles, find the ratio of final to initial temperature for a diatomic gas.", myAnswer: "0.5", correctAnswer: "0.758 (using T*V^(gamma-1) = const)", whyWrong: "Used gamma = 5/3 (monatomic) instead of gamma = 7/5 (diatomic)", conceptNote: "Always check: Monatomic gamma = 5/3, Diatomic gamma = 7/5, Polyatomic gamma = 4/3. For diatomic: T2/T1 = (V1/V2)^(gamma-1) = (1/2)^0.4 = 0.758.", isResolved: false, createdAt: "2026-02-09T17:00:00" },
  { id: "mk5", subject: "Mathematics", chapter: "Algebra", question: "Find the number of real roots of x^4 - 4x^3 + 6x^2 - 4x + 1 = 0", myAnswer: "4 real roots", correctAnswer: "1 real root (x=1 with multiplicity 4)", whyWrong: "Did not recognize this as (x-1)^4 = 0", conceptNote: "Look for binomial expansion patterns: (x-1)^4 = x^4 - 4x^3 + 6x^2 - 4x + 1. Coefficients follow Pascal's triangle.", isResolved: true, createdAt: "2026-02-08T11:00:00" },
]

// ---- Formula Sheets ----
export const mockFormulaSheets: FormulaSheet[] = [
  { id: "fs1", subject: "Physics", title: "Mechanics - Key Formulas", content: "v = u + at\ns = ut + 1/2 at\u00B2\nv\u00B2 = u\u00B2 + 2as\nF = ma\nW = Fd cos\u03B8\nKE = 1/2 mv\u00B2\nPE = mgh\nP = F.v\nMomentum p = mv\nImpulse J = F\u0394t = \u0394p\nCentripetal a = v\u00B2/r\nFriction f = \u03BCN", color: "hsl(217, 91%, 50%)", isFavorite: true, updatedAt: "2026-02-12" },
  { id: "fs2", subject: "Physics", title: "Thermodynamics Formulas", content: "Q = nCv\u0394T (const V)\nQ = nCp\u0394T (const P)\nCp - Cv = R\n\u03B3 = Cp/Cv\nW = P\u0394V (isobaric)\nPV^gamma = const (adiabatic)\n\u0394U = nCv\u0394T\nEfficiency = 1 - T2/T1 (Carnot)\nEntropy \u0394S = Q/T", color: "hsl(0, 72%, 50%)", isFavorite: false, updatedAt: "2026-02-10" },
  { id: "fs3", subject: "Chemistry", title: "Atomic Structure Essentials", content: "E = -13.6 Z\u00B2/n\u00B2 eV\nr = 0.529 n\u00B2/Z \u00C5\nv = 2.18\u00D710\u2076 Z/n m/s\nde Broglie: \u03BB = h/mv\nHeisenberg: \u0394x.\u0394p \u2265 h/4\u03C0\nOrbitals: s(2) p(6) d(10) f(14)\nAufbau | Hund's | Pauli", color: "hsl(152, 60%, 42%)", isFavorite: true, updatedAt: "2026-02-11" },
  { id: "fs4", subject: "Mathematics", title: "Calculus Quick Reference", content: "d/dx(x^n) = nx^(n-1)\nd/dx(sin x) = cos x\nd/dx(cos x) = -sin x\nd/dx(e^x) = e^x\nd/dx(ln x) = 1/x\n\u222Bx^n dx = x^(n+1)/(n+1)\n\u222Be^x dx = e^x\n\u222B1/x dx = ln|x|\nChain rule: d/dx[f(g(x))] = f'(g(x)).g'(x)\nProduct rule: (uv)' = u'v + uv'\nILATE: Inverse, Log, Algebraic, Trig, Exponential", color: "hsl(38, 92%, 50%)", isFavorite: true, updatedAt: "2026-02-13" },
  { id: "fs5", subject: "Chemistry", title: "Organic Reactions Cheat Sheet", content: "Markownikoff: H adds to C with more H\nAnti-Mark: HBr + peroxide\nZaitsev: More substituted alkene\nSN1: 3\u00B0 > 2\u00B0 > 1\u00B0 (polar protic)\nSN2: 1\u00B0 > 2\u00B0 > 3\u00B0 (polar aprotic)\nAldol: base + aldehyde/ketone with \u03B1-H\nCannizzaro: base + aldehyde without \u03B1-H\nWolff-Kishner: NH2NH2/KOH (C=O to CH2)\nClemmensen: Zn-Hg/HCl (C=O to CH2)", color: "hsl(262, 52%, 55%)", isFavorite: false, updatedAt: "2026-02-09" },
]

// ---- Weekly Reflections ----
export const mockWeeklyReflections: WeeklyReflection[] = [
  { id: "wr1", weekStart: "2026-02-03", weekEnd: "2026-02-09", wentWell: "Completed the entire Mechanics revision. Scored 80% in Part Test 1. Maintained a 7-day study streak. Made formula sheets for Physics.", didntGoWell: "Organic Chemistry is still weak. Skipped 2 DPPs. Phone usage was too high on Monday and Thursday.", goalNextWeek: "Complete Organic Chemistry named reactions. Attempt all DPPs on time. Keep phone in another room during study.", mentorReply: "Good improvement on Physics! For Organic, try the reaction-condition mapping technique I showed in class. Keep the streak going!", mentorName: "Dr. Rajesh Kumar", isSubmitted: true, submittedAt: "2026-02-09T22:00:00" },
  { id: "wr2", weekStart: "2026-01-27", weekEnd: "2026-02-02", wentWell: "Started solving PYQs for Maths. Improved time management in mock tests. Attended all lectures on time.", didntGoWell: "Chemistry accuracy dropped. Felt burnt out on Saturday. Didn't revise Thermodynamics as planned.", goalNextWeek: "Revise Thermodynamics. Solve 50 Chemistry MCQs. Take a proper break on Sunday evening.", mentorReply: "Burnout is real - make sure to rest. Your Maths improvement is impressive. Let's focus on Chemistry weak areas in next week's doubt session.", mentorName: "Dr. Rajesh Kumar", isSubmitted: true, submittedAt: "2026-02-02T21:30:00" },
  { id: "wr3", weekStart: "2026-02-10", weekEnd: "2026-02-16", wentWell: "", didntGoWell: "", goalNextWeek: "", isSubmitted: false },
]

// ---- Vector Credits (karma points) ----
export const mockVectorCredits: VectorCredit[] = [
  { id: "vc1",  userId: "u1", amount: 50,  type: "earned",   source: "assignment",      description: "Completed Mechanics DPP 1",              date: "2026-02-13T14:00:00" },
  { id: "vc2",  userId: "u1", amount: 30,  type: "earned",   source: "quiz",            description: "Scored 80%+ on Calculus Chapter Quiz",   date: "2026-02-13T11:00:00" },
  { id: "vc3",  userId: "u1", amount: 100, type: "earned",   source: "test",            description: "Rank in Top 10 - Part Test 1",           date: "2026-02-12T16:00:00" },
  { id: "vc4",  userId: "u1", amount: 25,  type: "earned",   source: "daily-challenge",  description: "Physics Daily Challenge completed",       date: "2026-02-12T20:00:00" },
  { id: "vc5",  userId: "u1", amount: 25,  type: "earned",   source: "daily-challenge",  description: "Chemistry Daily Challenge completed",     date: "2026-02-12T20:30:00" },
  { id: "vc6",  userId: "u1", amount: 40,  type: "earned",   source: "daily-challenge",  description: "100% score - Maths Daily Challenge",      date: "2026-02-12T21:00:00" },
  { id: "vc7",  userId: "u1", amount: 75,  type: "earned",   source: "streak",          description: "14-day study streak bonus",               date: "2026-02-12T00:00:00" },
  { id: "vc8",  userId: "u1", amount: 150, type: "earned",   source: "milestone",       description: "Milestone unlocked: Triple Threat",       date: "2026-02-11T22:00:00" },
  { id: "vc9",  userId: "u1", amount: 50,  type: "earned",   source: "chapter-quiz",    description: "Atomic Structure Quiz - Perfect Score",   date: "2026-02-11T15:00:00" },
  { id: "vc10", userId: "u1", amount: 30,  type: "earned",   source: "assignment",      description: "Completed Thermo DPP 1 before deadline",  date: "2026-02-11T10:00:00" },
  { id: "vc11", userId: "u1", amount: 100, type: "earned",   source: "test",            description: "Scored 80%+ on Mechanics Chapter Test",   date: "2026-02-10T12:00:00" },
  { id: "vc12", userId: "u1", amount: 50,  type: "earned",   source: "referral",        description: "Referred Sneha Gupta to Vector",          date: "2026-02-09T10:00:00" },
  { id: "vc13", userId: "u1", amount: 25,  type: "earned",   source: "daily-challenge",  description: "Physics Daily Challenge completed",       date: "2026-02-09T19:00:00" },
  { id: "vc14", userId: "u1", amount: 25,  type: "earned",   source: "daily-challenge",  description: "Chemistry Daily Challenge completed",     date: "2026-02-09T19:30:00" },
  { id: "vc15", userId: "u1", amount: 25,  type: "earned",   source: "daily-challenge",  description: "Maths Daily Challenge completed",         date: "2026-02-09T20:00:00" },
  { id: "vc16", userId: "u1", amount: 200, type: "redeemed", source: "redemption",      description: "Redeemed: Extra Mock Test Access",        date: "2026-02-08T14:00:00" },
  { id: "vc17", userId: "u1", amount: 30,  type: "earned",   source: "assignment",      description: "Completed Atomic Structure DPP",          date: "2026-02-08T11:00:00" },
  { id: "vc18", userId: "u1", amount: 100, type: "earned",   source: "milestone",       description: "Milestone unlocked: First Blood",         date: "2026-02-07T21:00:00" },
  { id: "vc19", userId: "u1", amount: 50,  type: "earned",   source: "test",            description: "Completed JEE PYQ practice set",          date: "2026-02-06T16:00:00" },
  { id: "vc20", userId: "u1", amount: 25,  type: "earned",   source: "daily-challenge",  description: "Physics Daily Challenge completed",       date: "2026-02-06T19:00:00" },
]

// ---- Credit Rewards (redemption catalog) ----
export const mockCreditRewards: CreditReward[] = [
  { id: "rw1",  title: "10% Fee Discount",           description: "Get 10% off your next installment payment. Applied automatically.",                   cost: 2000, category: "discount",    icon: "percent",       isAvailable: true  },
  { id: "rw2",  title: "Extra Mock Test Pack",        description: "Unlock 3 additional full-length mock tests with detailed analytics.",                cost: 500,  category: "extra",       icon: "file-text",     isAvailable: true  },
  { id: "rw3",  title: "1-on-1 Doubt Session",        description: "Book a 30-min personal doubt clearing session with any faculty.",                    cost: 750,  category: "extra",       icon: "video",         isAvailable: true  },
  { id: "rw4",  title: "Vector T-Shirt",              description: "Premium cotton Vector IIT/Medical Academy branded t-shirt.",                          cost: 1500, category: "merch",       icon: "shirt",         isAvailable: true  },
  { id: "rw5",  title: "Certificate of Excellence",   description: "Official Vector certificate recognizing your consistent performance.",               cost: 1000, category: "certificate", icon: "award",         isAvailable: true  },
  { id: "rw6",  title: "Notebook & Stationery Kit",   description: "Branded notebook, pens, and highlighters from Vector Academy.",                      cost: 800,  category: "merch",       icon: "book-open",     isAvailable: true  },
  { id: "rw7",  title: "PYQ Booklet (Printed)",       description: "Get a printed booklet of previous year questions for your target exam.",             cost: 600,  category: "extra",       icon: "book",          isAvailable: true  },
  { id: "rw8",  title: "5% Fee Discount",             description: "Get 5% off your next installment. Stackable with other discounts.",                  cost: 1000, category: "discount",    icon: "percent",       isAvailable: true  },
  { id: "rw9",  title: "Priority Doubt Queue",        description: "Skip the queue - your doubts get answered first for 7 days.",                       cost: 400,  category: "extra",       icon: "zap",           isAvailable: true  },
  { id: "rw10", title: "Vector Hoodie",               description: "Premium Vector Academy hoodie. Limited edition.",                                    cost: 2500, category: "merch",       icon: "shirt",         isAvailable: false },
]
