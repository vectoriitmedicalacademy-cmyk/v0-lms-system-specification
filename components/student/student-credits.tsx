"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Coins, ArrowUpRight, ArrowDownRight, TrendingUp,
  Gift, Zap, Star, Trophy, Flame, ChevronRight,
  FileText, Video, Shirt, Award, BookOpen, Book,
  Percent, CheckCircle2, Clock, Filter, Sparkles,
  Target, ShieldCheck
} from "lucide-react"
import { mockVectorCredits, mockCreditRewards } from "@/lib/mock-data"
import type { VectorCredit, CreditReward } from "@/lib/types"

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

const sourceIcons: Record<string, React.ReactNode> = {
  assignment: <FileText className="h-4 w-4" />,
  quiz: <Zap className="h-4 w-4" />,
  "chapter-quiz": <CheckCircle2 className="h-4 w-4" />,
  "daily-challenge": <Target className="h-4 w-4" />,
  test: <Trophy className="h-4 w-4" />,
  streak: <Flame className="h-4 w-4" />,
  milestone: <Star className="h-4 w-4" />,
  referral: <Gift className="h-4 w-4" />,
  redemption: <Gift className="h-4 w-4" />,
}

const sourceColors: Record<string, string> = {
  assignment: "bg-blue-500/15 text-blue-600",
  quiz: "bg-amber-500/15 text-amber-600",
  "chapter-quiz": "bg-emerald-500/15 text-emerald-600",
  "daily-challenge": "bg-violet-500/15 text-violet-600",
  test: "bg-rose-500/15 text-rose-600",
  streak: "bg-orange-500/15 text-orange-600",
  milestone: "bg-yellow-500/15 text-yellow-600",
  referral: "bg-cyan-500/15 text-cyan-600",
  redemption: "bg-red-500/15 text-red-600",
}

const rewardIcons: Record<string, React.ReactNode> = {
  percent: <Percent className="h-5 w-5" />,
  "file-text": <FileText className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  shirt: <Shirt className="h-5 w-5" />,
  award: <Award className="h-5 w-5" />,
  "book-open": <BookOpen className="h-5 w-5" />,
  book: <Book className="h-5 w-5" />,
  zap: <Zap className="h-5 w-5" />,
}

const categoryColors: Record<string, string> = {
  discount: "bg-emerald-500/15 text-emerald-600",
  merch: "bg-violet-500/15 text-violet-600",
  extra: "bg-blue-500/15 text-blue-600",
  certificate: "bg-amber-500/15 text-amber-600",
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
}

export function StudentCredits() {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "redeem">("overview")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [redeemDialog, setRedeemDialog] = useState<CreditReward | null>(null)
  const [redeemedIds, setRedeemedIds] = useState<string[]>([])

  const totalEarned = mockVectorCredits.filter(c => c.type === "earned").reduce((s, c) => s + c.amount, 0)
  const totalRedeemed = mockVectorCredits.filter(c => c.type === "redeemed").reduce((s, c) => s + c.amount, 0)
  const balance = totalEarned - totalRedeemed

  // Stats for breakdown
  const earnedBySource: Record<string, number> = {}
  mockVectorCredits.filter(c => c.type === "earned").forEach(c => {
    earnedBySource[c.source] = (earnedBySource[c.source] || 0) + c.amount
  })
  const topSources = Object.entries(earnedBySource).sort((a, b) => b[1] - a[1])

  // This week earned
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisWeekEarned = mockVectorCredits
    .filter(c => c.type === "earned" && new Date(c.date) >= weekAgo)
    .reduce((s, c) => s + c.amount, 0)

  // Today earned
  const todayStr = now.toISOString().slice(0, 10)
  const todayEarned = mockVectorCredits
    .filter(c => c.type === "earned" && c.date.startsWith(todayStr))
    .reduce((s, c) => s + c.amount, 0)

  // Filtered history
  const filteredCredits = sourceFilter === "all"
    ? mockVectorCredits
    : mockVectorCredits.filter(c => c.source === sourceFilter)

  // Next reward tier
  const tiers = [
    { name: "Bronze", min: 0, max: 500, color: "hsl(30, 50%, 50%)" },
    { name: "Silver", min: 500, max: 1500, color: "hsl(0, 0%, 60%)" },
    { name: "Gold", min: 1500, max: 3000, color: "hsl(45, 90%, 50%)" },
    { name: "Platinum", min: 3000, max: 5000, color: "hsl(210, 60%, 55%)" },
    { name: "Diamond", min: 5000, max: 999999, color: "hsl(280, 60%, 55%)" },
  ]
  const currentTier = tiers.find(t => balance >= t.min && balance < t.max) || tiers[tiers.length - 1]
  const nextTier = tiers[tiers.indexOf(currentTier) + 1]
  const tierProgress = nextTier
    ? ((balance - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "history" as const, label: "History" },
    { id: "redeem" as const, label: "Redeem" },
  ]

  function handleRedeem(reward: CreditReward) {
    if (balance >= reward.cost && !redeemedIds.includes(reward.id)) {
      setRedeemedIds(prev => [...prev, reward.id])
      setRedeemDialog(null)
    }
  }

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Header with balance */}
      <motion.div variants={fadeUp}>
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground"
            >
              <Coins className="h-7 w-7 text-card" />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vector Credits Balance</p>
              <div className="flex items-baseline gap-2">
                <motion.p
                  key={balance}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold tracking-tight text-foreground"
                >
                  {balance.toLocaleString()}
                </motion.p>
                <span className="text-sm font-medium text-muted-foreground">VC</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-lg font-bold">{todayEarned}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Today</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-lg font-bold">{thisWeekEarned}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">This Week</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="flex items-center gap-1 text-muted-foreground">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-lg font-bold">{totalRedeemed}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Redeemed</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tier progress */}
      <motion.div variants={fadeUp}>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: `${currentTier.color}25` }}>
                <ShieldCheck className="h-4 w-4" style={{ color: currentTier.color }} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{currentTier.name} Tier</p>
                {nextTier && (
                  <p className="text-xs text-muted-foreground">
                    {nextTier.min - balance} VC to <span className="font-semibold">{nextTier.name}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {tiers.map(t => (
                <div
                  key={t.name}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${balance >= t.min ? "scale-100" : "scale-75 opacity-30"}`}
                  style={{ backgroundColor: t.color }}
                  title={t.name}
                />
              ))}
            </div>
          </div>
          {nextTier && (
            <div className="mt-3">
              <Progress value={tierProgress} className="h-2" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "text-card" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="creditsTab"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* How to earn */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" /> How to Earn Vector Credits
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: <FileText className="h-5 w-5" />, label: "Complete Assignments", points: "30-50 VC", color: "bg-blue-500/10 text-blue-600" },
                  { icon: <CheckCircle2 className="h-5 w-5" />, label: "Pass Chapter Quizzes", points: "30-50 VC", color: "bg-emerald-500/10 text-emerald-600" },
                  { icon: <Target className="h-5 w-5" />, label: "Daily Challenges", points: "25-40 VC", color: "bg-violet-500/10 text-violet-600" },
                  { icon: <Trophy className="h-5 w-5" />, label: "Score Top 10 in Tests", points: "100 VC", color: "bg-rose-500/10 text-rose-600" },
                  { icon: <Flame className="h-5 w-5" />, label: "Study Streak Bonus", points: "75 VC/14d", color: "bg-orange-500/10 text-orange-600" },
                  { icon: <Star className="h-5 w-5" />, label: "Unlock Milestones", points: "100-150 VC", color: "bg-yellow-500/10 text-yellow-600" },
                  { icon: <Gift className="h-5 w-5" />, label: "Refer a Friend", points: "50 VC", color: "bg-cyan-500/10 text-cyan-600" },
                  { icon: <Zap className="h-5 w-5" />, label: "100% Quiz Score", points: "40 VC bonus", color: "bg-amber-500/10 text-amber-600" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5"
                  >
                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{item.label}</p>
                      <p className="mt-0.5 text-xs font-bold text-primary">{item.points}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Earnings breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-bold text-foreground">Earnings Breakdown</h3>
              <div className="space-y-3">
                {topSources.map(([source, amount], i) => {
                  const pct = Math.round((amount / totalEarned) * 100)
                  return (
                    <motion.div
                      key={source}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${sourceColors[source]}`}>
                        {sourceIcons[source]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold capitalize text-foreground">{source.replace("-", " ")}</p>
                          <p className="text-xs font-bold text-foreground">{amount} VC</p>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full rounded-full bg-foreground"
                          />
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground">{pct}%</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Recent activity */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Recent Activity</h3>
                <button onClick={() => setActiveTab("history")} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  View All <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2">
                {mockVectorCredits.slice(0, 5).map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${sourceColors[c.source]}`}>
                      {sourceIcons[c.source]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">{c.description}</p>
                      <p className="text-[11px] text-muted-foreground">{formatDate(c.date)} at {formatTime(c.date)}</p>
                    </div>
                    <span className={`text-sm font-bold ${c.type === "earned" ? "text-emerald-600" : "text-destructive"}`}>
                      {c.type === "earned" ? "+" : "-"}{c.amount}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Filter chips */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {["all", "assignment", "quiz", "chapter-quiz", "daily-challenge", "test", "streak", "milestone", "referral", "redemption"].map(f => (
                <button
                  key={f}
                  onClick={() => setSourceFilter(f)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    sourceFilter === f
                      ? "bg-foreground text-card"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {f === "all" ? "All" : f.replace("-", " ").replace(/^\w/, c => c.toUpperCase())}
                </button>
              ))}
            </div>

            {/* Transaction list */}
            <div className="rounded-2xl border border-border bg-card">
              <div className="divide-y divide-border">
                {filteredCredits.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/30"
                  >
                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${sourceColors[c.source]}`}>
                      {sourceIcons[c.source]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{c.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px] capitalize">{c.source.replace("-", " ")}</Badge>
                        <span className="text-[11px] text-muted-foreground">{formatDate(c.date)} at {formatTime(c.date)}</span>
                      </div>
                    </div>
                    <div className={`text-right ${c.type === "earned" ? "text-emerald-600" : "text-destructive"}`}>
                      <p className="text-sm font-bold">{c.type === "earned" ? "+" : "-"}{c.amount} VC</p>
                      <p className="text-[10px] uppercase font-medium">{c.type}</p>
                    </div>
                  </motion.div>
                ))}
                {filteredCredits.length === 0 && (
                  <div className="py-12 text-center text-sm text-muted-foreground">No transactions found for this filter.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "redeem" && (
          <motion.div
            key="redeem"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <Coins className="h-5 w-5 text-primary" />
              <p className="text-sm text-foreground">
                You have <span className="font-bold">{balance.toLocaleString()} VC</span> available to redeem.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockCreditRewards.map((reward, i) => {
                const canAfford = balance >= reward.cost
                const alreadyRedeemed = redeemedIds.includes(reward.id)
                return (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -3 }}
                    className={`rounded-2xl border bg-card p-5 transition-all ${
                      alreadyRedeemed ? "border-emerald-500/50 bg-emerald-500/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${categoryColors[reward.category]}`}>
                        {rewardIcons[reward.icon] || <Gift className="h-5 w-5" />}
                      </div>
                      <Badge variant="secondary" className="text-[10px] capitalize">{reward.category}</Badge>
                    </div>
                    <h4 className="mt-3 text-sm font-bold text-foreground">{reward.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{reward.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-bold text-foreground">{reward.cost.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">VC</span>
                      </div>
                      {alreadyRedeemed ? (
                        <Badge className="gap-1 border-none bg-emerald-500/15 text-emerald-600 text-xs">
                          <CheckCircle2 className="h-3 w-3" /> Redeemed
                        </Badge>
                      ) : !reward.isAvailable ? (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="mr-1 h-3 w-3" /> Coming Soon
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          disabled={!canAfford}
                          onClick={() => setRedeemDialog(reward)}
                          className="h-8 rounded-full bg-foreground text-card hover:bg-foreground/90 text-xs px-4"
                        >
                          {canAfford ? "Redeem" : "Not Enough"}
                        </Button>
                      )}
                    </div>
                    {!alreadyRedeemed && canAfford && reward.isAvailable && (
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        Balance after: {(balance - reward.cost).toLocaleString()} VC
                      </p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redeem confirmation dialog */}
      <Dialog open={!!redeemDialog} onOpenChange={() => setRedeemDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              This action will deduct Vector Credits from your balance.
            </DialogDescription>
          </DialogHeader>
          {redeemDialog && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${categoryColors[redeemDialog.category]}`}>
                  {rewardIcons[redeemDialog.icon] || <Gift className="h-6 w-6" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{redeemDialog.title}</p>
                  <p className="text-xs text-muted-foreground">{redeemDialog.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="text-lg font-bold text-foreground">{redeemDialog.cost.toLocaleString()} VC</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Remaining Balance</p>
                  <p className="text-lg font-bold text-foreground">{(balance - redeemDialog.cost).toLocaleString()} VC</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-full" onClick={() => setRedeemDialog(null)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 gap-2 rounded-full bg-foreground text-card hover:bg-foreground/90"
                  onClick={() => handleRedeem(redeemDialog)}
                >
                  <Coins className="h-4 w-4" /> Confirm Redeem
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
