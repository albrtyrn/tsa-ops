import { PageHeader } from "@/components/page-header"
import { fetchAllEvents } from "@/lib/queries"
import { EventsClient } from "./events-client"
import { NewEventModal } from "@/components/event/new-event-modal"

export default async function EventsPage() {
  const events = await fetchAllEvents()

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <PageHeader
        title="Events"
        description="All planned, in-progress, and completed culinary events."
        actions={<NewEventModal />}
      />
      <EventsClient events={events} />
    </main>
  )
}
