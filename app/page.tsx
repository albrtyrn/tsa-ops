import Link from "next/link"
import { Plus, ArrowRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { ActionRequired } from "@/components/dashboard/action-required"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { events as mockEvents } from "@/lib/data"
import { fetchAllEvents } from "@/lib/queries"

export default async function DashboardPage() {
  let events = await fetchAllEvents()
  if (!events || events.length === 0) {
    events = mockEvents
  }
  const upcoming = events.filter((e) => e.status !== "Completed")

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <PageHeader
        title="Dashboard"
        description="Your culinary operations at a glance."
        actions={
          <Button nativeButton={false} render={<Link href="/events">New Event<Plus data-icon="inline-end" /></Link>} />
        }
      />

      <MetricCards />

      <ActionRequired />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Upcoming Events</h2>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={
              <Link href="/events">
                View all
                <ArrowRight data-icon="inline-end" />
              </Link>
            }
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </main>
  )
}
