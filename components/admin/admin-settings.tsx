"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Shield, Database, Globe, Palette } from "lucide-react"

export function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Platform configuration and preferences</p>
      </div>

      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4" /> General Settings
          </CardTitle>
          <CardDescription>Basic platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Institute Name</Label>
              <Input defaultValue="Vector Academy" />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input defaultValue="IIT / Medical" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input defaultValue="admin@vector.edu" />
            </div>
            <div className="space-y-2">
              <Label>Contact Phone</Label>
              <Input defaultValue="+91 9876543230" />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" /> Notification Settings
          </CardTitle>
          <CardDescription>Configure alerts and reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Payment Reminders", desc: "Send automatic reminders for pending fees", defaultChecked: true },
            { label: "Test Notifications", desc: "Notify students about upcoming tests", defaultChecked: true },
            { label: "DPP Deadline Alerts", desc: "Remind students before DPP deadlines", defaultChecked: true },
            { label: "Attendance Alerts", desc: "Notify parents about student absences", defaultChecked: false },
            { label: "Performance Alerts", desc: "Alert when student scores drop significantly", defaultChecked: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.defaultChecked} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" /> Security Settings
          </CardTitle>
          <CardDescription>Access control and device management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Max Device Limit</p>
              <p className="text-xs text-muted-foreground">Maximum devices per student account</p>
            </div>
            <Input type="number" defaultValue="2" className="w-20" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Screen Recording Block</p>
              <p className="text-xs text-muted-foreground">Prevent screen recording during video playback</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Force Password Reset</p>
              <p className="text-xs text-muted-foreground">Require all users to reset passwords</p>
            </div>
            <Button variant="destructive" size="sm">Reset All</Button>
          </div>
        </CardContent>
      </Card>

      {/* App Theming */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-4 w-4" /> Appearance
          </CardTitle>
          <CardDescription>Branding and visual customization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <Input type="color" defaultValue="#2563eb" className="h-10 w-20" />
            </div>
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input placeholder="https://..." />
            </div>
          </div>
          <Button>Save Theme</Button>
        </CardContent>
      </Card>
    </div>
  )
}
