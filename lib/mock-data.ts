import type {
  User, Batch, Subject, Test, TestAttempt, DPP, CommunityPost,
  Notification, Payment, StudentProgress, Lesson, Question, Attendance, Challenge,
  Course, ChapterQuiz
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
  { id: "l1", chapterId: "c1", title: "Newton's Laws of Motion", type: "video", duration: 45, videoId: "dQw4w9WgXcQ", releaseDate: "2025-07-01", isLocked: false },
  { id: "l2", chapterId: "c1", title: "Work, Energy & Power", type: "video", duration: 50, videoId: "dQw4w9WgXcQ", releaseDate: "2025-07-03", isLocked: false },
  { id: "l3", chapterId: "c1", title: "Mechanics Notes PDF", type: "notes", releaseDate: "2025-07-01", isLocked: false },
  { id: "l4", chapterId: "c1", title: "DPP - Mechanics Set 1", type: "dpp", releaseDate: "2025-07-02", isLocked: false },
  { id: "l5", chapterId: "c2", title: "Laws of Thermodynamics", type: "video", duration: 55, videoId: "dQw4w9WgXcQ", releaseDate: "2025-07-10", isLocked: false },
  { id: "l6", chapterId: "c3", title: "Wave Motion", type: "video", duration: 40, videoId: "dQw4w9WgXcQ", releaseDate: "2025-08-01", isLocked: true },
  { id: "l7", chapterId: "c5", title: "Bohr's Model", type: "video", duration: 35, videoId: "dQw4w9WgXcQ", releaseDate: "2025-07-05", isLocked: false },
  { id: "l8", chapterId: "c9", title: "Limits & Continuity", type: "video", duration: 60, videoId: "dQw4w9WgXcQ", releaseDate: "2025-07-01", isLocked: false },
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
