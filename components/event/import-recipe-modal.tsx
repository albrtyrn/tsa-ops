"use client"

import { useState, useEffect } from "react"
import { Download, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { fetchAllRecipes, type Recipe } from "@/app/actions/recipes"
import { addDish } from "@/app/actions/dishes"
import { Dish } from "@/lib/data"

export function ImportRecipeModal({ 
  eventId, 
  onImport 
}: { 
  eventId: string
  onImport: (dish: Dish) => void 
}) {
  const [open, setOpen] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isImportingId, setIsImportingId] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setIsLoading(true)
      fetchAllRecipes()
        .then(data => setRecipes(data))
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }
  }, [open])

  const handleImport = async (recipe: Recipe) => {
    setIsImportingId(recipe.id)
    try {
      // Default to Starter if we don't have category in Recipe, but we'll use "Main" as a fallback since status is there
      const mappedStatus = recipe.status === "Testing" ? "In Progress" : recipe.status;
      
      const newDishData = {
        name: recipe.name,
        category: "Main", // or infer from somewhere
        servings: 1,
        estimated_cost: 0,
        recipe_status: mappedStatus as "Untested" | "In Progress" | "D-Day Ready",
        google_doc_link: recipe.doc_link || undefined,
        recipe_id: recipe.id
      }
      
      const imported = await addDish(eventId, newDishData)
      
      // Update local optimistic UI
      onImport({
        id: imported.id,
        name: imported.name,
        category: imported.category,
        servings: imported.servings,
        estimatedCost: imported.estimated_cost,
        recipe_status: imported.recipe_status,
        google_doc_link: imported.google_doc_link,
      })
      
      setOpen(false)
    } catch (err) {
      console.error("Failed to import recipe:", err)
    } finally {
      setIsImportingId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
        <Download className="size-4" />
        Import Recipe
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import from Recipe Library</DialogTitle>
          <DialogDescription>
            Select a recipe to add it to your event menu.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto mt-4 pr-2">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center p-8 text-sm text-muted-foreground">
              No recipes found in the library.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recipes.map(recipe => (
                <div key={recipe.id} className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{recipe.name}</p>
                    <p className="text-xs text-muted-foreground">{recipe.status}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleImport(recipe)}
                    disabled={isImportingId === recipe.id}
                  >
                    {isImportingId === recipe.id ? <Loader2 className="size-3.5 animate-spin mr-2" /> : null}
                    Import
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
