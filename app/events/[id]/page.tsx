import { notFound } from "next/navigation"

import { EventHeader } from "@/components/event/event-header"
import { EventTabs } from "@/components/event/event-tabs"
import { getEvent, events } from "@/lib/data"

export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }))
}

export default async function EventWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = getEvent(id)

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
