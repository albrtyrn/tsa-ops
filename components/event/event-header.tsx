"use client"

import Link from "next/link"
import { CalendarDays, MapPin, Users, Wallet, Sparkles, Pencil, Archive, ChevronLeft, X, Check } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/status-badge"
import type { CulinaryEvent } from "@/lib/data"
import { updateEvent, toggleArchiveEvent } from "@/app/actions/events"

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

  const handleSaveEdits = async () => {
    const updatedEvent = {
      ...event,
      ...editData,
      attendees: Number(editData.attendees),
      budget: Number(editData.budget),
    }
    setEvent(updatedEvent)
    setIsEditing(false)
    try {
      await updateEvent(event.id, {
        name: editData.name,
        date: editData.date,
        location: editData.location,
        attendees: Number(editData.attendees),
        budget: Number(editData.budget),
      })
    } catch (err) {
      console.error("Failed to update event in Supabase:", err)
    }
  }

  const handleArchiveClick = () => {
    setShowArchiveConfirm(true)
  }

  const handleConfirmArchive = async () => {
    const updatedEvent = {
      ...event,
      isArchived: !isArchived,
    }
    setEvent(updatedEvent)
    setIsArchived(!isArchived)
    setShowArchiveConfirm(false)
    try {
      await toggleArchiveEvent(event.id, isArchived)
    } catch (err) {
      console.error("Failed to toggle archive status in Supabase:", err)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit text-muted-foreground hover:bg-accent hover:text-primary"
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
                className="text-xl font-semibold h-9"
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
              <Button variant="outline" size="sm" onClick={handleSaveEdits} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                <Check data-icon="inline-start" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleEditToggle} className="text-rose-600 border-rose-200 hover:bg-rose-50">
                <X data-icon="inline-start" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleEditToggle} className="hover:bg-accent">
                <Pencil data-icon="inline-start" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleArchiveClick}
                className={isArchived ? "text-amber-600 border-amber-200 hover:bg-amber-50" : "hover:bg-accent"}
              >
                <Archive data-icon="inline-start" />
                {isArchived ? "Unarchive" : "Archive"}
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                <Sparkles data-icon="inline-start" />
                Generate Plan (AI)
              </Button>
            </>
          )}
        </div>
      </div>

      {showArchiveConfirm && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50/50">
          <span className="flex-1 text-sm text-amber-800">
            {isArchived ? "Unarchive this event?" : "Archive this event? It will move to the Archived Events section."}
          </span>
          <Button size="sm" variant="outline" onClick={() => setShowArchiveConfirm(false)} className="hover:bg-white">
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirmArchive} className="bg-amber-600 hover:bg-amber-700 text-white border-transparent">
            {isArchived ? "Unarchive" : "Archive"}
          </Button>
        </div>
      )}

      {isEditing ? (
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5 shadow-sm">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</label>
            <Input
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</label>
            <Input
              value={editData.location}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attendees</label>
            <Input
              type="number"
              value={editData.attendees}
              onChange={(e) => setEditData({ ...editData, attendees: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Budget</label>
            <Input
              type="number"
              value={editData.budget}
              onChange={(e) => setEditData({ ...editData, budget: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spent</label>
            <div className="text-sm font-medium text-muted-foreground pt-2">${event.spent.toLocaleString()}</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-4 shadow-sm">
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
