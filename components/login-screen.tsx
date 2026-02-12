"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Role } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap, BookOpen, Shield, Users, ArrowRight, Phone, Lock, Eye, EyeOff
} from "lucide-react"

const roles: { role: Role; label: string; icon: React.ReactNode; desc: string }[] = [
  { role: "student", label: "Student", icon: <GraduationCap className="h-5 w-5" />, desc: "Access courses, tests & analytics" },
  { role: "teacher", label: "Teacher", icon: <BookOpen className="h-5 w-5" />, desc: "Manage content & monitor batches" },
  { role: "admin", label: "Admin", icon: <Shield className="h-5 w-5" />, desc: "Full system management & CMS" },
  { role: "parent", label: "Parent", icon: <Users className="h-5 w-5" />, desc: "Track child progress & payments" },
]

export function LoginScreen() {
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState<Role>("student")
  const [showPassword, setShowPassword] = useState(false)
  const [authMethod, setAuthMethod] = useState<"otp" | "password">("password")

  return (
    <div className="flex min-h-screen" style={{ background: "hsl(var(--outer-bg))" }}>
      <div className="flex w-full flex-col items-center justify-center p-4">
        {/* Inner white card */}
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-card shadow-2xl">
          <div className="flex flex-col items-center gap-8 p-8 lg:flex-row lg:gap-12 lg:p-12">
            {/* Left - Branding */}
            <div className="flex flex-1 flex-col gap-6 text-center lg:text-left">
              <div className="flex items-center justify-center gap-3 lg:justify-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground">
                  <GraduationCap className="h-7 w-7 text-card" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-foreground">VECTOR</h1>
                  <p className="text-xs font-medium tracking-widest text-muted-foreground">IIT / MEDICAL ACADEMY</p>
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                  Your journey to IIT & NEET starts here
                </h2>
                <p className="text-pretty text-muted-foreground lg:text-lg">
                  Premium coaching platform with live classes, AI-powered analytics,
                  comprehensive test series, and real-time progress tracking.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { num: "5,000+", label: "Students" },
                  { num: "98%", label: "Selection Rate" },
                  { num: "200+", label: "Toppers" },
                  { num: "50+", label: "Expert Faculty" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-muted/60 p-4">
                    <p className="text-xl font-bold text-primary">{stat.num}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Auth */}
            <div className="w-full max-w-md">
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Sign in to your account</h3>
                  <p className="text-sm text-muted-foreground">Choose your role and login method</p>
                </div>

                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-2">
                  {roles.map(({ role, label, icon }) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all ${
                        selectedRole === role
                          ? "border-foreground bg-foreground text-card"
                          : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:bg-muted"
                      }`}
                    >
                      {icon}
                      <span className="text-sm font-semibold">{label}</span>
                    </button>
                  ))}
                </div>

                <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as "otp" | "password")}>
                  <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/60">
                    <TabsTrigger value="password" className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-card">Password</TabsTrigger>
                    <TabsTrigger value="otp" className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-card">Phone OTP</TabsTrigger>
                  </TabsList>
                  <TabsContent value="password" className="space-y-4 pt-3">
                    <div className="space-y-2">
                      <Label htmlFor="phone-pwd" className="text-sm font-medium text-foreground">Phone / Email</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="phone-pwd" placeholder="9876543210" className="rounded-xl border-border pl-10" defaultValue="9876543210" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className="rounded-xl border-border pl-10 pr-10"
                          defaultValue="demo1234"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="otp" className="space-y-4 pt-3">
                    <div className="space-y-2">
                      <Label htmlFor="phone-otp" className="text-sm font-medium text-foreground">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="phone-otp" placeholder="+91 9876543210" className="rounded-xl border-border pl-10" defaultValue="9876543210" />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full rounded-xl">
                      Send OTP
                    </Button>
                  </TabsContent>
                </Tabs>

                <Button
                  className="w-full gap-2 rounded-xl bg-foreground text-card hover:bg-foreground/90"
                  size="lg"
                  onClick={() => login(selectedRole)}
                >
                  Sign in as {roles.find(r => r.role === selectedRole)?.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Demo mode: Click sign in to explore the {selectedRole} dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
