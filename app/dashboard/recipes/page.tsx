"use server"

import { fetchAllRecipes, addRecipe, addTastingNote, Recipe, RecipeStatus } from "@/app/actions/recipes"
import RecipesVaultClient from "./recipes-client"

export default async function RecipesPage() {
  const initialRecipes = await fetchAllRecipes()

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <RecipesVaultClient initialRecipes={initialRecipes} />
    </main>
  )
}
