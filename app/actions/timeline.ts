"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export async function addTimelineStep(
  eventId: string,
  step: {
    marker: string
    title: string
    description: string
    sequence_order?: number
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("timeline_steps")
    .insert([
      {
        event_id: eventId,
        marker: step.marker,
        title: step.title,
        description: step.description,
        done: false,
        sequence_order: step.sequence_order || 0,
      },
    ])
    .select()

  if (error) {
    console.error("Error adding timeline step:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function updateTimelineStep(
  eventId: string,
  stepId: string,
  updates: {
    marker?: string
    title?: string
    description?: string
    done?: boolean
    sequence_order?: number
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("timeline_steps")
    .update(updates)
    .eq("id", stepId)
    .eq("event_id", eventId)
    .select()

  if (error) {
    console.error("Error updating timeline step:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function deleteTimelineStep(eventId: string, stepId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("timeline_steps")
    .delete()
    .eq("id", stepId)
    .eq("event_id", eventId)

  if (error) {
    console.error("Error deleting timeline step:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
}
