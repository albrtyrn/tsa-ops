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
    recipe_status?: "Untested" | "In Progress" | "D-Day Ready"
    google_doc_link?: string
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
        recipe_status: dish.recipe_status || "Untested",
        google_doc_link: dish.google_doc_link || null,
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
    recipe_status?: "Untested" | "In Progress" | "D-Day Ready"
    google_doc_link?: string | null
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
