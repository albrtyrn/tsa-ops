"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export type RecipeStatus = "Untested" | "Testing" | "D-Day Ready"

export interface Recipe {
  id: string
  name: string
  status: RecipeStatus
  doc_link: string
  tasting_notes: string[]
  created_at: string
  updated_at: string
}

export async function fetchAllRecipes(): Promise<Recipe[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching recipes:")
    return []
  }

  return data as Recipe[]
}

export async function addRecipe(recipe: {
  name: string
  status: RecipeStatus
  doc_link: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("recipes")
    .insert([
      {
        name: recipe.name,
        status: recipe.status,
        doc_link: recipe.doc_link,
        tasting_notes: [],
      },
    ])
    .select()

  if (error) {
    console.error("Error adding recipe:")
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/recipes")
  return data[0] as Recipe
}

export async function addTastingNote(recipeId: string, note: string) {
  const supabase = await createClient()

  // Retrieve current tasting notes first
  const { data: recipe, error: fetchError } = await supabase
    .from("recipes")
    .select("tasting_notes")
    .eq("id", recipeId)
    .single()

  if (fetchError || !recipe) {
    console.error("Error fetching recipe for tasting note:")
    throw new Error("Recipe not found.")
  }

  const currentNotes = recipe.tasting_notes || []
  const updatedNotes = [...currentNotes, note]

  const { data, error: updateError } = await supabase
    .from("recipes")
    .update({ 
      tasting_notes: updatedNotes,
      updated_at: new Date().toISOString()
    })
    .eq("id", recipeId)
    .select()

  if (updateError) {
    console.error("Error adding tasting note:")
    throw new Error(updateError.message)
  }

  revalidatePath("/dashboard/recipes")
  return data[0] as Recipe
}
