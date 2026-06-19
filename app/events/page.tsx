import { Plus } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { events } from "@/lib/data"

export default function EventsPage() {
  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <PageHeader
        title="Events"
        description="All planned, in-progress, and completed culinary events."
        actions={<Button>New Event<Plus data-icon="inline-end" /></Button>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </main>
  )
}
