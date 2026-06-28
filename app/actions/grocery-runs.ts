"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export async function addGroceryRun(
  eventId: string,
  run: {
    driver_name_fallback: string
    vehicle: "Sedan" | "SUV" | "Minivan" | "Pickup"
    destination: string
    departure: string
    status: "Planned" | "In progress" | "Completed"
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("grocery_runs")
    .insert([
      {
        event_id: eventId,
        driver_name_fallback: run.driver_name_fallback,
        vehicle: run.vehicle,
        destination: run.destination,
        departure: run.departure,
        status: run.status,
      },
    ])
    .select()

  if (error) {
    console.error("Error adding grocery run:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function deleteGroceryRun(eventId: string, runId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("grocery_runs")
    .delete()
    .eq("id", runId)
    .eq("event_id", eventId)

  if (error) {
    console.error("Error deleting grocery run:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
}
