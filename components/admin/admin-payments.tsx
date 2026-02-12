"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search, MoreHorizontal, CreditCard, AlertTriangle, CheckCircle, Clock,
  Download, Mail, IndianRupee
} from "lucide-react"
import { mockPayments, mockUsers } from "@/lib/mock-data"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts"

const chartGreen = "#16a34a"
const chartAmber = "#f59e0b"
const chartRed = "#dc2626"

const statusConfig = {
  paid: { color: "bg-accent/10 text-accent border-accent/30", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  pending: { color: "bg-warning/10 text-warning border-warning/30", icon: <Clock className="h-3.5 w-3.5" /> },
  overdue: { color: "bg-destructive/10 text-destructive border-destructive/30", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
}

export function AdminPayments() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = mockPayments.filter(p => {
    const user = mockUsers.find(u => u.id === p.userId)
    const matchSearch = user?.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPaid = mockPayments.filter(p => p.status === "paid").reduce((a, p) => a + p.amount, 0)
  const totalPending = mockPayments.filter(p => p.status === "pending").reduce((a, p) => a + p.amount, 0)
  const totalOverdue = mockPayments.filter(p => p.status === "overdue").reduce((a, p) => a + p.amount, 0)

  const pieData = [
    { name: "Paid", value: totalPaid, color: chartGreen },
    { name: "Pending", value: totalPending, color: chartAmber },
    { name: "Overdue", value: totalOverdue, color: chartRed },
  ]

  const monthlyData = [
    { month: "Jul", amount: 145000 },
    { month: "Aug", amount: 0 },
    { month: "Sep", amount: 50000 },
    { month: "Oct", amount: 25000 },
    { month: "Nov", amount: 0 },
    { month: "Dec", amount: 0 },
    { month: "Jan", amount: 45000 },
    { month: "Feb", amount: 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Management</h1>
          <p className="text-muted-foreground">Track fee collection, pending dues, and send reminders</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export Report</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <IndianRupee className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{(totalPaid / 100000).toFixed(1)}L</p>
              <p className="text-xs text-muted-foreground">Total Collected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{(totalPending / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{(totalOverdue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Collection Status</CardTitle>
            <CardDescription>Fee payment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `Rs. ${v.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ background: item.color }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="ml-auto text-sm font-bold text-foreground">Rs. {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Collection</CardTitle>
            <CardDescription>Fee received each month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${v / 1000}K`} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(v: number) => [`Rs. ${v.toLocaleString()}`, "Collection"]} />
                  <Bar dataKey="amount" fill={chartGreen} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by student name or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(payment => {
                const user = mockUsers.find(u => u.id === payment.userId)
                return (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
                            {user?.name.split(" ").map(n => n[0]).join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{user?.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{payment.description}</TableCell>
                    <TableCell className="font-medium text-foreground">Rs. {payment.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(payment.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.paidDate
                        ? new Date(payment.paidDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1 text-xs ${statusConfig[payment.status].color}`}>
                        {statusConfig[payment.status].icon} {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><CheckCircle className="mr-2 h-3.5 w-3.5" /> Mark as Paid</DropdownMenuItem>
                          <DropdownMenuItem><Mail className="mr-2 h-3.5 w-3.5" /> Send Reminder</DropdownMenuItem>
                          <DropdownMenuItem><CreditCard className="mr-2 h-3.5 w-3.5" /> Generate Receipt</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
