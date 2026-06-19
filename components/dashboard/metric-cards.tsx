import { CalendarCheck, Users, Wallet } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { metrics } from "@/lib/data"

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

export function MetricCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
            <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <card.icon className="size-4" />
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-3xl font-semibold tracking-tight">{card.value}</span>
            <span className="text-xs text-muted-foreground">{card.hint}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
