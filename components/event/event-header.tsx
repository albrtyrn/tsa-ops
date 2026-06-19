import Link from "next/link"
import { CalendarDays, MapPin, Users, Wallet, Sparkles, Pencil, Archive, ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import type { CulinaryEvent } from "@/lib/data"

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-muted-foreground" />
      <div className="flex flex-col leading-tight">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  )
}

export function EventHeader({ event }: { event: CulinaryEvent }) {
  return (
    <div className="flex flex-col gap-5">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit text-muted-foreground"
        nativeButton={false}
        render={
          <Link href="/events">
            <ChevronLeft data-icon="inline-start" />
            All events
          </Link>
        }
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-balance text-2xl font-semibold tracking-tight">{event.name}</h1>
            <StatusBadge status={event.status} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Pencil data-icon="inline-start" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Archive data-icon="inline-start" />
            Archive
          </Button>
          <Button size="sm">
            <Sparkles data-icon="inline-start" />
            Generate Plan (AI)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg border bg-card p-4 sm:grid-cols-4">
        <Stat icon={CalendarDays} label="Date" value={event.date} />
        <Stat icon={MapPin} label="Location" value={event.location} />
        <Stat icon={Users} label="Attendees" value={`${event.attendees} guests`} />
        <Stat
          icon={Wallet}
          label="Budget"
          value={`$${event.spent.toLocaleString()} / $${event.budget.toLocaleString()}`}
        />
      </div>
    </div>
  )
}
