"use client"

import Link from "next/link"
import { CalendarDays, MapPin, Users, Wallet, Sparkles, Pencil, Archive, ChevronLeft, X, Check } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface EditableEventData {
  name: string
  date: string
  location: string
  attendees: number
  budget: number
}

export function EventHeader({ event: initialEvent }: { event: CulinaryEvent }) {
  const [event, setEvent] = useState(initialEvent)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<EditableEventData>({
    name: event.name,
    date: event.date,
    location: event.location,
    attendees: event.attendees,
    budget: event.budget,
  })
  const [isArchived, setIsArchived] = useState(event.isArchived)
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({
        name: event.name,
        date: event.date,
        location: event.location,
        attendees: event.attendees,
        budget: event.budget,
      })
    }
    setIsEditing(!isEditing)
  }

  const handleSaveEdits = () => {
    const updatedEvent = {
      ...event,
      ...editData,
      attendees: Number(editData.attendees),
      budget: Number(editData.budget),
    }
    setEvent(updatedEvent)
    // TODO: Persist changes via Supabase mutation (update event in database)
    setIsEditing(false)
  }

  const handleArchiveClick = () => {
    setShowArchiveConfirm(true)
  }

  const handleConfirmArchive = () => {
    const updatedEvent = {
      ...event,
      isArchived: !isArchived,
    }
    setEvent(updatedEvent)
    setIsArchived(!isArchived)
    // TODO: Persist archive status via Supabase mutation
    setShowArchiveConfirm(false)
  }

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
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            {isEditing ? (
              <Input
                className="text-2xl font-semibold h-auto border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-foreground"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            ) : (
              <h1 className="text-balance text-2xl font-semibold tracking-tight">{event.name}</h1>
            )}
            <StatusBadge status={event.status} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleSaveEdits} className="text-green-600 hover:text-green-700 dark:text-green-400">
                <Check data-icon="inline-start" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleEditToggle} className="text-red-600 hover:text-red-700 dark:text-red-400">
                <X data-icon="inline-start" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleEditToggle}>
                <Pencil data-icon="inline-start" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleArchiveClick}
                className={isArchived ? "text-amber-600 hover:text-amber-700 dark:text-amber-400" : ""}
              >
                <Archive data-icon="inline-start" />
                {isArchived ? "Unarchive" : "Archive"}
              </Button>
              <Button size="sm">
                <Sparkles data-icon="inline-start" />
                Generate Plan (AI)
              </Button>
            </>
          )}
        </div>
      </div>

      {showArchiveConfirm && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20">
          <span className="flex-1 text-sm text-yellow-800 dark:text-yellow-300">
            {isArchived ? "Unarchive this event?" : "Archive this event? It will move to the Archived Events section."}
          </span>
          <Button size="sm" variant="outline" onClick={() => setShowArchiveConfirm(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirmArchive} className="bg-yellow-600 hover:bg-yellow-700 text-white">
            {isArchived ? "Unarchive" : "Archive"}
          </Button>
        </div>
      )}

      {isEditing ? (
        <div className="grid grid-cols-2 gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Date</label>
            <Input
              className="border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm"
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Location</label>
            <Input
              className="border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm"
              value={editData.location}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Attendees</label>
            <Input
              className="border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm"
              type="number"
              value={editData.attendees}
              onChange={(e) => setEditData({ ...editData, attendees: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Budget</label>
            <Input
              className="border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm"
              type="number"
              value={editData.budget}
              onChange={(e) => setEditData({ ...editData, budget: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Spent</label>
            <div className="text-sm font-medium text-muted-foreground pt-2">${event.spent.toLocaleString()}</div>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  )
}
