"use client"

import { motion } from "framer-motion"
import { EventCard } from "@/components/event-card"
import { CulinaryEvent } from "@/lib/data"

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

export function EventsClient({ events }: { events: CulinaryEvent[] }) {
  const activeEvents = events.filter((event) => !event.isArchived)
  const archivedEvents = events.filter((event) => event.isArchived)

  return (
    <>
      {/* Active Events Section */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">Active Events</h2>
          <p className="text-sm text-muted-foreground">Events you're currently planning and executing.</p>
        </div>
        <motion.div 
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {activeEvents.length > 0 ? (
            activeEvents.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <EventCard event={event} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full rounded-lg border border-dashed p-8 text-center bg-card">
              <p className="text-sm text-muted-foreground">No active events yet. Create one to get started!</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Archived Events Section */}
      {archivedEvents.length > 0 && (
        <div className="flex flex-col gap-4 border-t pt-8">
          <div>
            <h2 className="text-lg font-semibold">Archived Events</h2>
            <p className="text-sm text-muted-foreground">Events that have been archived for reference.</p>
          </div>
          <motion.div 
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 opacity-75"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {archivedEvents.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </>
  )
}
