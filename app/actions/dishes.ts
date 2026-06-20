"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export async function addDish(
  eventId: string,
  dish: {
    name: string
    category: string
    servings: number
    estimated_cost: number
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("dishes")
    .insert([
      {
        event_id: eventId,
        name: dish.name,
        category: dish.category,
        servings: dish.servings,
        estimated_cost: dish.estimated_cost,
      },
    ])
    .select()

  if (error) {
    console.error("Error adding dish:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function updateDish(
  eventId: string,
  dishId: string,
  updates: {
    name?: string
    category?: string
    servings?: number
    estimated_cost?: number
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("dishes")
    .update(updates)
    .eq("id", dishId)
    .eq("event_id", eventId)
    .select()

  if (error) {
    console.error("Error updating dish:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function deleteDish(eventId: string, dishId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("dishes")
    .delete()
    .eq("id", dishId)
    .eq("event_id", eventId)

  if (error) {
    console.error("Error deleting dish:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
}
