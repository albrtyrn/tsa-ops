"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export async function addShoppingItem(
  eventId: string,
  item: {
    name: string
    quantity: string
    category: string
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shopping_items")
    .insert([
      {
        event_id: eventId,
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        checked: false,
      },
    ])
    .select()

  if (error) {
    console.error("Error adding shopping item:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function updateShoppingItem(
  eventId: string,
  itemId: string,
  updates: {
    name?: string
    quantity?: string
    category?: string
    checked?: boolean
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shopping_items")
    .update(updates)
    .eq("id", itemId)
    .eq("event_id", eventId)
    .select()

  if (error) {
    console.error("Error updating shopping item:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function deleteShoppingItem(eventId: string, itemId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("shopping_items")
    .delete()
    .eq("id", itemId)
    .eq("event_id", eventId)

  if (error) {
    console.error("Error deleting shopping item:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
}

export async function addGroceryRun(
  eventId: string,
  run: {
    driver_id?: string
    driver_name_fallback?: string
    vehicle: "Sedan" | "SUV" | "Minivan" | "Pickup" | "None"
    destination: string
    departure: string
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("grocery_runs")
    .insert([
      {
        event_id: eventId,
        driver_id: run.driver_id || null,
        driver_name_fallback: run.driver_name_fallback || null,
        vehicle: run.vehicle === "None" ? "Sedan" : run.vehicle,
        destination: run.destination,
        departure: run.departure,
        status: "Planned",
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

export async function updateGroceryRun(
  eventId: string,
  runId: string,
  updates: {
    driver_id?: string | null
    driver_name_fallback?: string | null
    vehicle?: "Sedan" | "SUV" | "Minivan" | "Pickup"
    destination?: string
    departure?: string
    status?: "Planned" | "In progress" | "Completed"
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("grocery_runs")
    .update(updates)
    .eq("id", runId)
    .eq("event_id", eventId)
    .select()

  if (error) {
    console.error("Error updating grocery run:", error)
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
