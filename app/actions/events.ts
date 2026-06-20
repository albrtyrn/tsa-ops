"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export async function createEvent(formData: {
  name: string
  date: string
  location: string
  attendees: number
  budget: number
}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("events")
    .insert([
      {
        name: formData.name,
        date: formData.date,
        location: formData.location,
        attendees: formData.attendees,
        budget: formData.budget,
        status: "Planning",
        is_archived: false,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating event:", error)
    throw new Error(error.message)
  }

  revalidatePath("/events")
  return data[0]
}

export async function updateEvent(
  eventId: string,
  updates: {
    name?: string
    date?: string
    location?: string
    attendees?: number
    budget?: number
    status?: string
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", eventId)
    .select()

  if (error) {
    console.error("Error updating event:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  revalidatePath("/events")
  revalidatePath("/")
  return data[0]
}

export async function toggleArchiveEvent(eventId: string, currentArchiveStatus: boolean) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("events")
    .update({ is_archived: !currentArchiveStatus })
    .eq("id", eventId)
    .select()

  if (error) {
    console.error("Error toggling archive status:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  revalidatePath("/events")
  return data[0]
}

export async function updateEventReflection(
  eventId: string,
  reflection: {
    whatWorked: string
    whatFailed: string
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("events")
    .update({
      reflection_what_worked: reflection.whatWorked,
      reflection_what_failed: reflection.whatFailed,
    })
    .eq("id", eventId)
    .select()

  if (error) {
    console.error("Error updating reflection:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}
