import { notFound } from "next/navigation"

import { EventHeader } from "@/components/event/event-header"
import { EventTabs } from "@/components/event/event-tabs"
import { getEvent } from "@/lib/data"
import { fetchEventDetails } from "@/lib/queries"

export default async function EventWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // Try fetching from database first, fallback to mock data
  let event = await fetchEventDetails(id)
  if (!event) {
    event = (getEvent(id) as any) || null
  }

  if (!event) {
    notFound()
  }

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <EventHeader event={event} />
      <EventTabs event={event} />
    </main>
  )
}

