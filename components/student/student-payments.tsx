"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, CheckCircle, Clock, AlertTriangle, IndianRupee } from "lucide-react"
import { mockPayments } from "@/lib/mock-data"

export function StudentPayments() {
  const payments = mockPayments.filter(p => p.userId === "u1")
  const totalPaid = payments.filter(p => p.status === "paid").reduce((acc, p) => acc + p.amount, 0)
  const totalPending = payments.filter(p => p.status !== "paid").reduce((acc, p) => acc + p.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground">Fee status and payment history</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <CheckCircle className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="text-xl font-bold text-foreground">
                <IndianRupee className="mr-0.5 inline h-4 w-4" />{totalPaid.toLocaleString("en-IN")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-foreground">
                <IndianRupee className="mr-0.5 inline h-4 w-4" />{totalPending.toLocaleString("en-IN")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Next Due Date</p>
              <p className="text-xl font-bold text-foreground">1 Mar 2026</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">{p.description}</TableCell>
                  <TableCell><IndianRupee className="mr-0.5 inline h-3 w-3" />{p.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(p.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</TableCell>
                  <TableCell>
                    <Badge
                      variant={p.status === "paid" ? "default" : p.status === "pending" ? "outline" : "destructive"}
                      className={p.status === "paid" ? "bg-accent text-accent-foreground" : ""}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {p.status !== "paid" && (
                      <Button size="sm" className="gap-1">
                        <CreditCard className="h-3.5 w-3.5" /> Pay Now
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
