import Link from "next/link"
import { CalendarDays, MapPin, Users, ArrowUpRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import type { CulinaryEvent } from "@/lib/data"

export function EventCard({ event }: { event: CulinaryEvent }) {
  const budgetPct = Math.round((event.spent / event.budget) * 100)

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <Card className="transition-colors group-hover:border-foreground/20">
        <CardContent className="flex flex-col gap-4 py-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="font-medium leading-tight">{event.name}</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {event.date}
              </span>
            </div>
            <StatusBadge status={event.status} />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {event.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5" />
              {event.attendees} guests
            </span>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Budget</span>
              <span className="text-sm font-medium">
                ${event.spent.toLocaleString()}{" "}
                <span className="text-muted-foreground">/ ${event.budget.toLocaleString()}</span>
              </span>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              Open <ArrowUpRight className="size-3.5" />
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/70"
              style={{ width: `${Math.min(budgetPct, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
