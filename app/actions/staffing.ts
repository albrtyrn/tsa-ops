"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export async function addStaffMember(
  eventId: string,
  staff: {
    name: string
    role: string
    team: "Prep Team" | "Cooking Team" | "Serving Team" | "Support Team"
    profile_id?: string
    confirmed?: boolean
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("staff_members")
    .insert([
      {
        event_id: eventId,
        name: staff.name,
        role: staff.role,
        team: staff.team,
        profile_id: staff.profile_id || null,
        confirmed: staff.confirmed || false,
      },
    ])
    .select()

  if (error) {
    console.error("Error adding staff member:")
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function updateStaffMember(
  eventId: string,
  staffId: string,
  updates: {
    name?: string
    role?: string
    team?: "Prep Team" | "Cooking Team" | "Serving Team" | "Support Team"
    profile_id?: string | null
    confirmed?: boolean
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("staff_members")
    .update(updates)
    .eq("id", staffId)
    .eq("event_id", eventId)
    .select()

  if (error) {
    console.error("Error updating staff member:")
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function deleteStaffMember(eventId: string, staffId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("staff_members")
    .delete()
    .eq("id", staffId)
    .eq("event_id", eventId)

  if (error) {
    console.error("Error deleting staff member:")
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
}
