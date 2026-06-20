"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp,
  Users,
  Wallet,
  Percent,
  Calendar,
  ArrowUpDown,
  AlertCircle,
  PiggyBank,
  CheckCircle,
  HelpCircle,
  ArrowUpRight,
  TrendingDown
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress"
import { events as mockEvents } from "@/lib/data"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface AnalyticsItem {
  eventId: string
  eventName: string
  status?: string
  date: string
  budget: number
  spent: number
  variance: number
  budgetBurnPercentage: number
}

interface AnalyticsDashboardProps {
  initialData: AnalyticsItem[]
  confirmedVolunteersCount: number
}

export function AnalyticsDashboard({
  initialData,
  confirmedVolunteersCount
}: AnalyticsDashboardProps) {
  const [filter, setFilter] = useState<"all" | "completed" | "planning">("all")
  const [sortBy, setSortBy] = useState<"date" | "budget" | "spent" | "accuracy">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  // 1. Determine if we are using mock data (fallback)
  const isDbEmpty = !initialData || initialData.length === 0

  // 2. Map data
  const rawData: AnalyticsItem[] = isDbEmpty
    ? mockEvents.map((e) => {
        const budget = e.budget || 0
        const spent = e.spent || 0
        return {
          eventId: e.id,
          eventName: e.name,
          date: e.date,
          budget,
          spent,
          variance: budget - spent,
          budgetBurnPercentage: budget === 0 ? 0 : Math.round((spent / budget) * 100 * 100) / 100
        }
      })
    : initialData

  // Get active status (from DB status field, mockEvents mapping, or default to Completed)
  const dataWithStatus = rawData.map((item) => {
    const status = item.status || mockEvents.find((me) => me.id === item.eventId)?.status || "Completed"
    return {
      ...item,
      status
    }
  })

  // Calculate volunteer fallback
  const mockTotalVolunteers = mockEvents.reduce(
    (acc, e) => acc + e.staffing.reduce((s, g) => s + g.members.filter((m) => m.confirmed).length, 0),
    0
  )
  const activeVolunteersCount = isDbEmpty ? mockTotalVolunteers : (confirmedVolunteersCount || mockTotalVolunteers)

  // 3. Filter and Sort
  const filteredData = dataWithStatus.filter((item) => {
    if (filter === "completed") return item.status === "Completed"
    if (filter === "planning") return item.status !== "Completed"
    return true
  })

  const sortedData = [...filteredData].sort((a, b) => {
    let valA: any = a[sortBy === "accuracy" ? "budgetBurnPercentage" : sortBy]
    let valB: any = b[sortBy === "accuracy" ? "budgetBurnPercentage" : sortBy]

    if (sortBy === "date") {
      valA = new Date(a.date).getTime()
      valB = new Date(b.date).getTime()
    }

    if (sortBy === "accuracy") {
      // Accuracy = 100 - abs(100 - burn_percentage)
      valA = Math.max(0, 100 - Math.abs(100 - a.budgetBurnPercentage))
      valB = Math.max(0, 100 - Math.abs(100 - b.budgetBurnPercentage))
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1
    if (valA > valB) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  // 4. Calculate Summary Metrics
  const totalBudget = rawData.reduce((sum, item) => sum + item.budget, 0)
  const totalSpent = rawData.reduce((sum, item) => sum + item.spent, 0)
  const netVariance = totalBudget - totalSpent
  const overallBurnRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  // Budget Accuracy formula: Average of (100 - abs(budget - spent) / budget * 100)
  const avgBudgetAccuracy = rawData.length > 0
    ? rawData.reduce((acc, item) => {
        if (item.budget === 0) return acc + (item.spent === 0 ? 100 : 0)
        const diffPercent = (Math.abs(item.budget - item.spent) / item.budget) * 100
        return acc + Math.max(0, 100 - diffPercent)
      }, 0) / rawData.length
    : 100

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Bar Chart parameters
  const chartHeight = 220
  const chartWidth = 650
  const paddingLeft = 50
  const paddingRight = 20
  const paddingTop = 20
  const paddingBottom = 40
  const graphHeight = chartHeight - paddingTop - paddingBottom
  const graphWidth = chartWidth - paddingLeft - paddingRight

  const maxVal = Math.max(
    ...rawData.map((d) => Math.max(d.budget, d.spent)),
    1000 // min ceiling
  )

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top - 10
    })
    setHoveredIndex(index)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Fallback Banner */}
      {isDbEmpty && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-900 backdrop-blur-xs"
        >
          <AlertCircle className="size-5 shrink-0 text-amber-600 animate-pulse" />
          <div className="flex-1">
            <span className="font-semibold text-amber-900">Evaluation Mode:</span> Local mock database fallback active. Seeding your remote Supabase instance will automatically activate live visual sync.
          </div>
        </motion.div>
      )}

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric Card 1: Budget Accuracy */}
        <Card className="relative overflow-hidden border border-border bg-card shadow-sm hover:border-primary/20 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Budget Accuracy
            </CardTitle>
            <span className="flex size-8 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Percent className="size-4" />
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {avgBudgetAccuracy.toFixed(1)}%
              </span>
            </div>
            {/* Visual Mini Progress */}
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${Math.min(100, avgBudgetAccuracy)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Average variance error offset
            </span>
          </CardContent>
        </Card>

        {/* Metric Card 2: Total Spent */}
        <Card className="relative overflow-hidden border border-border bg-card shadow-sm hover:border-primary/20 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Expenditures
            </CardTitle>
            <span className="flex size-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
              <TrendingUp className="size-4" />
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span>Budget Burn:</span>
              <span className="font-bold text-foreground">{overallBurnRate.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, overallBurnRate)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Metric Card 3: Budget Savings/Variance */}
        <Card className="relative overflow-hidden border border-border bg-card shadow-sm hover:border-primary/20 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Remaining Funds
            </CardTitle>
            <span className={`flex size-8 items-center justify-center rounded-md border ${
              netVariance >= 0 
                ? "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 border-teal-100 dark:border-teal-900/50" 
                : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-100 dark:border-rose-900/50"
            }`}>
              <PiggyBank className="size-4" />
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <span className={`text-3xl font-bold tracking-tight ${netVariance >= 0 ? "text-teal-600 dark:text-teal-400" : "text-rose-600 dark:text-rose-400"}`}>
              {netVariance < 0 && "-"}${Math.abs(netVariance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {netVariance >= 0 ? (
                <>
                  <CheckCircle className="size-3.5 text-teal-600 shrink-0" />
                  <span className="text-teal-700 font-semibold dark:text-teal-400">Net positive savings</span>
                </>
              ) : (
                <>
                  <TrendingDown className="size-3.5 text-rose-600 shrink-0" />
                  <span className="text-rose-700 font-semibold dark:text-rose-400">Deficit warning</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metric Card 4: Confirmed Volunteers */}
        <Card className="relative overflow-hidden border border-border bg-card shadow-sm hover:border-primary/20 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Staff Engagement
            </CardTitle>
            <span className="flex size-8 items-center justify-center rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50">
              <Users className="size-4" />
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {activeVolunteersCount}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Confirmed culinary volunteers
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Comparison Chart */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <CardTitle className="text-base font-semibold">Budget vs. Actual Spent Analysis</CardTitle>
            <CardDescription>Hover over columns to see individual event variances and accuracy scores.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium mr-4">
              <span className="inline-block size-3 rounded-xs bg-indigo-500" />
              <span className="text-muted-foreground">Budgeted</span>
              <span className="inline-block size-3 rounded-xs bg-emerald-500 ml-2" />
              <span className="text-muted-foreground">Spent</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative w-full overflow-x-auto pb-2 select-none scrollbar-thin">
            <div className="min-w-[650px] relative h-[240px]">
              <svg className="w-full h-full text-muted-foreground" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = paddingTop + graphHeight * (1 - ratio)
                  const labelValue = Math.round(maxVal * ratio)
                  return (
                    <g key={i} className="opacity-40">
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={chartWidth - paddingRight}
                        y2={y}
                        stroke="currentColor"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                        className="stroke-muted/40"
                      />
                      <text
                        x={paddingLeft - 8}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[10px] font-medium font-mono fill-muted-foreground"
                      >
                        ${labelValue}
                      </text>
                    </g>
                  )
                })}

                {/* Bars Rendering */}
                {rawData.map((item, index) => {
                  const numEvents = rawData.length
                  const colGroupWidth = graphWidth / numEvents
                  const barWidth = Math.min(22, colGroupWidth * 0.3)
                  const gap = colGroupWidth * 0.08

                  // Coordinates
                  const groupX = paddingLeft + index * colGroupWidth
                  const budgetX = groupX + (colGroupWidth - barWidth * 2 - gap) / 2
                  const spentX = budgetX + barWidth + gap

                  const budgetHeight = (item.budget / maxVal) * graphHeight
                  const spentHeight = (item.spent / maxVal) * graphHeight

                  const budgetY = chartHeight - paddingBottom - budgetHeight
                  const spentY = chartHeight - paddingBottom - spentHeight

                  const isOverBudget = item.spent > item.budget
                  const spentColorClass = isOverBudget ? "#ef4444" : "#10b981" // red or green

                  return (
                    <g
                      key={item.eventId}
                      className="group cursor-pointer"
                      onMouseMove={(e) => handleMouseMove(e, index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Interactive column hover background */}
                      <rect
                        x={groupX + 5}
                        y={paddingTop - 5}
                        width={colGroupWidth - 10}
                        height={graphHeight + 15}
                        fill="currentColor"
                        className={`transition-colors duration-150 rounded-xs ${
                          hoveredIndex === index ? "text-indigo-500/5" : "text-transparent"
                        }`}
                        rx={4}
                      />

                      {/* Budget Bar */}
                      <motion.rect
                        initial={{ height: 0, y: chartHeight - paddingBottom }}
                        animate={{ height: budgetHeight, y: budgetY }}
                        transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.04 }}
                        x={budgetX}
                        width={barWidth}
                        fill="#6366f1"
                        rx={2}
                        className="opacity-85 group-hover:opacity-100 transition-opacity"
                      />

                      {/* Spent Bar */}
                      <motion.rect
                        initial={{ height: 0, y: chartHeight - paddingBottom }}
                        animate={{ height: spentHeight, y: spentY }}
                        transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.04 + 0.02 }}
                        x={spentX}
                        width={barWidth}
                        fill={spentColorClass}
                        rx={2}
                        className="opacity-85 group-hover:opacity-100 transition-opacity"
                      />

                      {/* X Axis Label */}
                      <text
                        x={groupX + colGroupWidth / 2}
                        y={chartHeight - paddingBottom + 16}
                        textAnchor="middle"
                        className={`text-[9px] font-medium font-sans fill-muted-foreground select-none transition-colors duration-200 ${
                          hoveredIndex === index ? "fill-primary font-semibold" : ""
                        }`}
                      >
                        {item.eventName.length > 12 ? `${item.eventName.substring(0, 11)}…` : item.eventName}
                      </text>
                    </g>
                  )
                })}

                {/* X Axis Line */}
                <line
                  x1={paddingLeft}
                  y1={chartHeight - paddingBottom}
                  x2={chartWidth - paddingRight}
                  y2={chartHeight - paddingBottom}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="stroke-border"
                />
              </svg>

              {/* Floating Tooltip */}
              <AnimatePresence>
                {hoveredIndex !== null && tooltipPos && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="absolute z-20 pointer-events-none rounded-lg border border-border bg-card p-3 shadow-md text-xs flex flex-col gap-1 w-52"
                    style={{ left: tooltipPos.x, top: tooltipPos.y }}
                  >
                    <span className="font-semibold text-foreground border-b border-border/50 pb-1 mb-1 block">
                      {rawData[hoveredIndex].eventName}
                    </span>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budgeted:</span>
                      <span className="font-semibold font-mono">${rawData[hoveredIndex].budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Actual Spent:</span>
                      <span className={`font-semibold font-mono ${rawData[hoveredIndex].spent > rawData[hoveredIndex].budget ? "text-rose-600" : "text-emerald-600"}`}>
                        ${rawData[hoveredIndex].spent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border/40 pt-1 mt-1">
                      <span className="text-muted-foreground">Variance:</span>
                      <span className={`font-semibold font-mono ${rawData[hoveredIndex].variance >= 0 ? "text-teal-600" : "text-rose-600"}`}>
                        {rawData[hoveredIndex].variance >= 0 ? "+" : "-"}${Math.abs(rawData[hoveredIndex].variance).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Burn Rate:</span>
                      <span className="font-semibold font-mono">{rawData[hoveredIndex].budgetBurnPercentage.toFixed(0)}%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Selected Event Details & Control Filters */}
      <div className="flex flex-col gap-4">
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                filter === "all"
                  ? "bg-indigo-50 border-primary/20 text-primary dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                  : "bg-card border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                filter === "completed"
                  ? "bg-indigo-50 border-primary/20 text-primary dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                  : "bg-card border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("planning")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                filter === "planning"
                  ? "bg-indigo-50 border-primary/20 text-primary dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                  : "bg-card border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              In Operations
            </button>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Sort by:</span>
            <div className="grid grid-cols-4 sm:flex items-center gap-1.5 w-full sm:w-auto">
              {(["date", "budget", "spent", "accuracy"] as const).map((field) => (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={`px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-md border capitalize flex items-center justify-center gap-1 transition-all ${
                    sortBy === field
                      ? "bg-primary border-transparent text-primary-foreground"
                      : "bg-card border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {field}
                  {sortBy === field && (
                    <ArrowUpDown className="size-3 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed List Card */}
        <Card className="border border-border bg-card shadow-sm">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground text-xs uppercase font-semibold tracking-wider bg-muted/20">
                  <th className="py-3 px-4">Event Name</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Budget</th>
                  <th className="py-3 px-4 text-right">Spent</th>
                  <th className="py-3 px-4 text-right">Variance</th>
                  <th className="py-3 px-4">Burn Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {sortedData.map((item) => {
                  const isOverBudget = item.spent > item.budget
                  const accuracyScore = Math.max(0, 100 - Math.abs((item.budget - item.spent) / (item.budget || 1)) * 100)

                  return (
                    <tr
                      key={item.eventId}
                      className="hover:bg-muted/30 transition-colors duration-150 group/row"
                    >
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        <div className="flex flex-col">
                          <span>{item.eventName}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            Accuracy: {accuracyScore.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3.5" />
                          {item.date}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium">
                        ${item.budget.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium">
                        ${item.spent.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-semibold font-mono ${
                          item.variance >= 0 
                            ? "bg-teal-50 text-teal-700 dark:bg-teal-950/20 dark:text-teal-400" 
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                        }`}>
                          {item.variance >= 0 ? "+" : ""}{item.variance.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 min-w-[140px] max-w-[200px]">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] font-medium">
                            <span className="text-muted-foreground">Burn Rate</span>
                            <span className={isOverBudget ? "text-rose-600 font-bold" : "text-muted-foreground"}>
                              {item.budgetBurnPercentage.toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden relative">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isOverBudget 
                                  ? "bg-rose-500" 
                                  : item.budgetBurnPercentage > 90 
                                    ? "bg-amber-500" 
                                    : "bg-indigo-500"
                              }`}
                              style={{ width: `${Math.min(100, item.budgetBurnPercentage)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
