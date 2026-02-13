"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Role } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home, BookOpen, ClipboardList, MessageSquare,
  BarChart3, CreditCard, Bell, Settings, LogOut, Menu,
  GraduationCap, Shield, Users, Layers, Database,
  PenTool, Calendar, AlertTriangle, Eye, UserCheck,
  HelpCircle, Search, MessageCircle, Swords, Landmark, NotebookPen, Coins, Video
} from "lucide-react"
import { mockNotifications } from "@/lib/mock-data"
import { motion, AnimatePresence } from "framer-motion"
import { AtomIcon, MoleculeIcon, DNAHelix, FloatingMathSymbol, CircuitTrace } from "@/components/science-elements"

interface NavItem {
  label: string
  icon: React.ReactNode
  id: string
  badge?: number
}

const navConfig: Record<Role, NavItem[]> = {
  student: [
    { label: "Home", icon: <Home className="h-5 w-5" />, id: "dashboard" },
    { label: "View Courses", icon: <BookOpen className="h-5 w-5" />, id: "courses" },
    { label: "Assignments", icon: <ClipboardList className="h-5 w-5" />, id: "tests" },
    { label: "Challenges", icon: <Swords className="h-5 w-5" />, id: "challenges" },
    { label: "Exam Info", icon: <Landmark className="h-5 w-5" />, id: "exam-info" },
    { label: "Journal", icon: <NotebookPen className="h-5 w-5" />, id: "journal" },
    { label: "1-on-1 Sessions", icon: <Video className="h-5 w-5" />, id: "sessions" },
    { label: "Vector Credits", icon: <Coins className="h-5 w-5" />, id: "credits" },
    { label: "Community", icon: <MessageSquare className="h-5 w-5" />, id: "community" },
    { label: "Progress", icon: <BarChart3 className="h-5 w-5" />, id: "analytics" },
    { label: "Payments", icon: <CreditCard className="h-5 w-5" />, id: "payments" },
  ],
  teacher: [
    { label: "Dashboard", icon: <Home className="h-5 w-5" />, id: "dashboard" },
    { label: "My Batches", icon: <Users className="h-5 w-5" />, id: "batches" },
    { label: "Content", icon: <BookOpen className="h-5 w-5" />, id: "content" },
    { label: "Question Bank", icon: <Database className="h-5 w-5" />, id: "questions" },
    { label: "Tests & DPPs", icon: <ClipboardList className="h-5 w-5" />, id: "tests" },
    { label: "Attendance", icon: <UserCheck className="h-5 w-5" />, id: "attendance" },
    { label: "Doubt Queue", icon: <HelpCircle className="h-5 w-5" />, id: "doubts", badge: 8 },
    { label: "Analytics", icon: <BarChart3 className="h-5 w-5" />, id: "analytics" },
  ],
  admin: [
    { label: "Dashboard", icon: <Home className="h-5 w-5" />, id: "dashboard" },
    { label: "Users", icon: <Users className="h-5 w-5" />, id: "users" },
    { label: "Batches", icon: <Layers className="h-5 w-5" />, id: "batches" },
    { label: "Content CMS", icon: <PenTool className="h-5 w-5" />, id: "cms" },
    { label: "Question Bank", icon: <Database className="h-5 w-5" />, id: "questions" },
    { label: "Tests & DPPs", icon: <ClipboardList className="h-5 w-5" />, id: "tests" },
    { label: "Attendance", icon: <Calendar className="h-5 w-5" />, id: "attendance" },
    { label: "Community", icon: <MessageSquare className="h-5 w-5" />, id: "community" },
    { label: "Payments", icon: <CreditCard className="h-5 w-5" />, id: "payments" },
    { label: "Analytics", icon: <BarChart3 className="h-5 w-5" />, id: "analytics" },
    { label: "Settings", icon: <Settings className="h-5 w-5" />, id: "settings" },
  ],
  parent: [
    { label: "Dashboard", icon: <Home className="h-5 w-5" />, id: "dashboard" },
    { label: "Attendance", icon: <UserCheck className="h-5 w-5" />, id: "attendance" },
    { label: "Test Results", icon: <ClipboardList className="h-5 w-5" />, id: "results" },
    { label: "Payments", icon: <CreditCard className="h-5 w-5" />, id: "payments" },
    { label: "Alerts", icon: <AlertTriangle className="h-5 w-5" />, id: "alerts" },
  ],
}

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.99 },
}

const sidebarItemVariants = {
  initial: { opacity: 0, x: -12 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
}

const cardContainerVariants = {
  animate: { transition: { staggerChildren: 0.05 } },
}

interface DashboardShellProps {
  children: (activeView: string) => React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { user, role, logout, switchRole } = useAuth()
  const [activeView, setActiveView] = useState("dashboard")
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!role || !user) return null

  const navItems = navConfig[role]
  const unreadNotifications = mockNotifications.filter(n => !n.read).length

  const roleLabels: Record<Role, string> = {
    student: "Student",
    teacher: "Teacher",
    admin: "Admin",
    parent: "Parent",
  }

  const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {navItems.map((item, index) => (
        <motion.button
          key={item.id}
          custom={index}
          variants={sidebarItemVariants}
          initial="initial"
          animate="animate"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setActiveView(item.id)
            onNavigate?.()
          }}
          className={`relative flex items-center gap-3 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
            activeView === item.id
              ? "bg-foreground text-card"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {activeView === item.id && (
            <motion.div
              layoutId="activeNavPill"
              className="absolute inset-0 rounded-full bg-foreground"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">{item.label}</span>
          {item.badge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.2 }}
              className="relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground"
            >
              {item.badge}
            </motion.span>
          )}
        </motion.button>
      ))}
    </nav>
  )

  return (
    <div className="relative flex h-screen" style={{ background: "hsl(var(--outer-bg))" }}>
      {/* Science-themed outer background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[3%] top-[2%]"><AtomIcon size={32} color="hsl(38, 92%, 40%)" /></div>
        <div className="absolute right-[4%] bottom-[3%]"><MoleculeIcon size={28} color="hsl(38, 92%, 40%)" /></div>
        <FloatingMathSymbol symbol={"\u03C0"} x={60} y={12} delay={0} className="!text-primary/10 !text-sm" />
        <FloatingMathSymbol symbol={"\u03B8"} x={200} y={8} delay={1.5} className="!text-primary/10 !text-sm" />
      </div>
      <div className="relative z-10 flex h-full w-full flex-col">
        {/* Outer top link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between px-6 py-2"
        >
          <button
            onClick={logout}
            className="text-sm font-medium text-card/70 hover:text-card transition-colors"
          >
            Login
          </button>
          <div className="flex gap-2">
            {(["student", "teacher", "admin", "parent"] as Role[]).map(r => (
              <motion.button
                key={r}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { switchRole(r); setActiveView("dashboard") }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  r === role
                    ? "bg-primary text-primary-foreground"
                    : "text-card/50 hover:text-card/80"
                }`}
              >
                {roleLabels[r]}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* White inner card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mx-3 mb-3 flex flex-1 overflow-hidden rounded-2xl bg-card shadow-2xl"
        >
          {/* Left sidebar */}
          <aside className="hidden w-52 flex-shrink-0 flex-col border-r border-border lg:flex">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 px-5 pb-2 pt-5"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-foreground"
              >
                <GraduationCap className="h-5 w-5 text-card" />
                {/* Tiny orbiting atom around logo on hover */}
                <div className="pointer-events-none absolute -right-1 -top-1 opacity-70" aria-hidden="true">
                  <AtomIcon size={16} color="hsl(var(--primary))" />
                </div>
              </motion.div>
              <div>
                <p className="text-sm font-extrabold tracking-tight text-foreground leading-tight">VECTOR</p>
                <p className="text-[10px] font-medium tracking-wider text-muted-foreground">IIT / MEDICAL ACADEMY</p>
              </div>
            </motion.div>

            <div className="relative flex flex-1 flex-col px-3 pt-6">
              <SidebarNav />
              {/* Subtle DNA helix decoration at bottom of nav */}
              <div className="pointer-events-none mt-auto flex items-center justify-center pb-2 opacity-40" aria-hidden="true">
                <DNAHelix height={60} color="hsl(var(--primary))" />
              </div>
            </div>

            {/* Bottom user + Logout */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="border-t border-border p-4"
            >
              <div className="flex items-center gap-3 rounded-lg">
                <motion.div whileHover={{ scale: 1.08 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <Avatar className="h-9 w-9 border-2 border-primary">
                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-foreground">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold text-foreground">{user.name.split(" ")[0]} {user.name.split(" ")[1]?.[0] || ""}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email.split("@")[0]}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={logout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Logout
              </motion.button>
            </motion.div>
          </aside>

          {/* Mobile sidebar */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="left" className="w-64 bg-card p-5">
              <div className="flex items-center gap-2 pb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground">
                  <GraduationCap className="h-5 w-5 text-card" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-foreground">VECTOR</p>
                  <p className="text-[10px] text-muted-foreground">IIT / MEDICAL ACADEMY</p>
                </div>
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
              <div className="mt-8">
                <button
                  onClick={logout}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground"
                >
                  Logout
                </button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Main content area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Top bar */}
            <motion.header
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="flex items-center gap-4 border-b border-border px-6 py-4"
            >
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>

              <AnimatePresence mode="wait">
                <motion.h2
                  key={activeView}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="text-lg font-semibold text-foreground"
                >
                  {role === "student" && activeView === "dashboard" ? (
                    <span className="flex items-center gap-2">
                      Hi {user.name.split(" ")[0]}, <span className="font-normal text-muted-foreground">{"You're back"}</span>
                      <AtomIcon size={20} color="hsl(var(--primary))" />
                    </span>
                  ) : (
                    navItems.find(n => n.id === activeView)?.label || "Dashboard"
                  )}
                </motion.h2>
              </AnimatePresence>

              <div className="flex-1" />

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="hidden items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 md:flex"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="search colleges, ranking, courses..."
                  className="w-48 border-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none lg:w-64"
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button variant="outline" size="sm" className="hidden gap-1 rounded-full border-foreground bg-foreground text-card hover:bg-foreground/90 hover:text-card md:flex">
                  <Search className="h-3.5 w-3.5" /> Search
                </Button>
              </motion.div>

              <div className="flex items-center gap-1">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <MessageCircle className="h-5 w-5" />
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.5 }}
                      className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground"
                    >
                      1
                    </motion.span>
                    <span className="sr-only">Messages</span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.6 }}
                        className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground"
                      >
                        {unreadNotifications}
                      </motion.span>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </motion.div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-border overflow-hidden hover:border-primary transition-colors"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-muted text-sm font-bold text-foreground">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Role (Demo)</DropdownMenuLabel>
                    {(["student", "teacher", "admin", "parent"] as Role[]).map(r => (
                      <DropdownMenuItem
                        key={r}
                        onClick={() => {
                          switchRole(r)
                          setActiveView("dashboard")
                        }}
                        className={r === role ? "bg-primary/10 text-primary" : ""}
                      >
                        {r === "student" && <GraduationCap className="mr-2 h-4 w-4" />}
                        {r === "teacher" && <BookOpen className="mr-2 h-4 w-4" />}
                        {r === "admin" && <Shield className="mr-2 h-4 w-4" />}
                        {r === "parent" && <Users className="mr-2 h-4 w-4" />}
                        {roleLabels[r]}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.header>

            {/* Page content with AnimatePresence */}
            <main className="flex-1 overflow-y-auto p-5 lg:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {children(activeView)}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
