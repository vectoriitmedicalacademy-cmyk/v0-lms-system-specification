"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginScreen } from "@/components/login-screen"
import { DashboardShell } from "@/components/dashboard-shell"

// Student
import { StudentDashboard } from "@/components/student/student-dashboard"
import { StudentCourses } from "@/components/student/student-courses"
import { StudentTests } from "@/components/student/student-tests"
import { StudentAnalytics } from "@/components/student/student-analytics"
import { StudentPayments } from "@/components/student/student-payments"

// Admin
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminUsers } from "@/components/admin/admin-users"
import { AdminBatches } from "@/components/admin/admin-batches"
import { AdminCMS } from "@/components/admin/admin-cms"
import { AdminQuestions } from "@/components/admin/admin-questions"
import { AdminTests } from "@/components/admin/admin-tests"
import { AdminAttendance } from "@/components/admin/admin-attendance"
import { AdminCommunity } from "@/components/admin/admin-community"
import { AdminPayments } from "@/components/admin/admin-payments"
import { AdminAnalytics } from "@/components/admin/admin-analytics"
import { AdminSettings } from "@/components/admin/admin-settings"

// Teacher
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard"

// Parent
import { ParentDashboard } from "@/components/parent/parent-dashboard"

// Challenges
import { StudentChallenges } from "@/components/student/student-challenges"

// Community
import { CommunityHub } from "@/components/community/community-hub"

// Exam Info
import { StudentExamInfo } from "@/components/student/student-exam-info"

// Journal
import { StudentJournal } from "@/components/student/student-journal"

export default function Page() {
  const { role } = useAuth()

  if (!role) return <LoginScreen />

  return (
    <DashboardShell>
      {(activeView) => {
        // Student views
        if (role === "student") {
          switch (activeView) {
            case "dashboard": return <StudentDashboard />
            case "courses": return <StudentCourses />
            case "tests": return <StudentTests />
            case "challenges": return <StudentChallenges />
            case "exam-info": return <StudentExamInfo />
            case "journal": return <StudentJournal />
            case "analytics": return <StudentAnalytics />
            case "community": return <CommunityHub />
            case "payments": return <StudentPayments />
            default: return <StudentDashboard />
          }
        }

        // Admin views
        if (role === "admin") {
          switch (activeView) {
            case "dashboard": return <AdminDashboard />
            case "users": return <AdminUsers />
            case "batches": return <AdminBatches />
            case "cms": return <AdminCMS />
            case "questions": return <AdminQuestions />
            case "tests": return <AdminTests />
            case "attendance": return <AdminAttendance />
            case "community": return <AdminCommunity />
            case "payments": return <AdminPayments />
            case "analytics": return <AdminAnalytics />
            case "settings": return <AdminSettings />
            default: return <AdminDashboard />
          }
        }

        // Teacher views
        if (role === "teacher") {
          switch (activeView) {
            case "dashboard": return <TeacherDashboard />
            case "batches": return <AdminBatches />
            case "content": return <AdminCMS />
            case "questions": return <AdminQuestions />
            case "tests": return <AdminTests />
            case "attendance": return <AdminAttendance />
            case "doubts": return <CommunityHub />
            case "analytics": return <AdminAnalytics />
            default: return <TeacherDashboard />
          }
        }

        // Parent views
        if (role === "parent") {
          switch (activeView) {
            case "dashboard": return <ParentDashboard />
            case "attendance": return <AdminAttendance />
            case "results": return <StudentAnalytics />
            case "payments": return <StudentPayments />
            case "alerts": return <ParentDashboard />
            default: return <ParentDashboard />
          }
        }

        return <div className="text-muted-foreground">Select a view from the sidebar</div>
      }}
    </DashboardShell>
  )
}
