"use client"

import { CalendarCheck, Users, Wallet } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 25,
    },
  },
}

const hoverAction = {
  y: -4,
  boxShadow: "0 10px 25px -5px rgba(91, 66, 243, 0.08), 0 8px 10px -6px rgba(91, 66, 243, 0.08)",
}

const hoverTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 22,
}

export function MetricCards({ metrics }: { metrics: { activeEvents: number; totalVolunteers: number; plannedBudget: number } }) {
  const cards = [
    {
      label: "Active Events",
      value: String(metrics.activeEvents),
      hint: "In planning or ready",
      icon: CalendarCheck,
    },
    {
      label: "Confirmed Volunteers",
      value: String(metrics.totalVolunteers),
      hint: "Across all active events",
      icon: Users,
    },
    {
      label: "Planned Budget",
      value: `$${metrics.plannedBudget.toLocaleString()}`,
      hint: "Allocated for upcoming events",
      icon: Wallet,
    },
  ]

  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => (
        <motion.div
          key={card.label}
          variants={itemVariants}
          whileHover={hoverAction}
          transition={hoverTransition}
          className="rounded-lg"
        >
          <Card className="h-full border border-border bg-card shadow-sm hover:border-primary/20 transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {card.label}
              </CardTitle>
              <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground border border-primary/10">
                <card.icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <span className="text-3xl font-bold tracking-tight text-foreground">{card.value}</span>
              <span className="text-xs text-muted-foreground font-medium">{card.hint}</span>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
