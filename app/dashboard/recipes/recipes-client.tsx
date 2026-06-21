"use client"

import * as React from "react"
import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChefHat, 
  Plus, 
  FileText, 
  ExternalLink, 
  MessageSquare, 
  Loader2, 
  Calendar, 
  ArrowUpRight,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet"
import { PageHeader } from "@/components/page-header"

import { Recipe, RecipeStatus, addRecipe, addTastingNote } from "@/app/actions/recipes"
import { cn } from "@/lib/utils"

interface RecipesVaultClientProps {
  initialRecipes: Recipe[]
}

export default function RecipesVaultClient({ initialRecipes }: RecipesVaultClientProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<RecipeStatus | "All">("All")

  // Drawers State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Add Recipe Form State
  const [newName, setNewName] = useState("")
  const [newDocLink, setNewDocLink] = useState("")
  const [newStatus, setNewStatus] = useState<RecipeStatus>("Untested")
  const [formError, setFormError] = useState<string | null>(null)
  const [isAdding, startAddTransition] = useTransition()

  // Tasting Note Form State
  const [newNote, setNewNote] = useState("")
  const [noteError, setNoteError] = useState<string | null>(null)
  const [isSubmittingNote, startNoteTransition] = useTransition()

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "All" || recipe.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Status badge styles helper
  const getStatusBadge = (status: RecipeStatus) => {
    switch (status) {
      case "D-Day Ready":
        return (
          <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            D-Day Ready
          </Badge>
        )
      case "Testing":
        return (
          <Badge className="bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Testing
          </Badge>
        )
      default:
        return (
          <Badge className="bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400 font-semibold gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Untested
          </Badge>
        )
    }
  }

  // Handle Add Recipe
  const handleAddRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!newName.trim()) {
      setFormError("Recipe name is required.")
      return
    }

    if (!newDocLink.trim() || !newDocLink.startsWith("http")) {
      setFormError("A valid Google Doc URL is required (must start with http/https).")
      return
    }

    startAddTransition(async () => {
      try {
        const added = await addRecipe({
          name: newName,
          status: newStatus,
          doc_link: newDocLink,
        })
        setRecipes((prev) => [added, ...prev])
        // Reset form
        setNewName("")
        setNewDocLink("")
        setNewStatus("Untested")
        setIsAddOpen(false)
      } catch (err: any) {
        setFormError(err.message || "Failed to add recipe. Please try again.")
      }
    })
  }

  // Handle Add Tasting Note
  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNoteError(null)

    if (!selectedRecipe) return

    if (!newNote.trim()) {
      setNoteError("Tasting note cannot be empty.")
      return
    }

    startNoteTransition(async () => {
      try {
        const updated = await addTastingNote(selectedRecipe.id, newNote.trim())
        
        // Update local state list
        setRecipes((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        )
        // Update active drawer details
        setSelectedRecipe(updated)
        setNewNote("")
      } catch (err: any) {
        setNoteError(err.message || "Failed to save tasting note. Please try again.")
      }
    })
  }

  // Staggered motion container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  }

  return (
    <>
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Recipe Testing Vault"
          description="Culinary R&D kitchen ledger. Taste testing logs, ready metrics, and instructions."
          actions={
            <Button 
              onClick={() => {
                setFormError(null)
                setIsAddOpen(true)
              }}
              className="gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              Add New Recipe
            </Button>
          }
        />
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 border-border bg-card/50"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex bg-muted/30 p-1.5 rounded-xl border border-border/40 gap-1 overflow-x-auto">
          {(["All", "Untested", "Testing", "D-Day Ready"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                statusFilter === s
                  ? "bg-card text-foreground shadow-sm border border-border/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      {filteredRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card/40 border border-border/40 rounded-2xl p-8 text-center backdrop-blur-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground border border-border/60">
            <ChefHat className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-foreground">No recipes found</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Try adjusting your search query, selecting another filter, or add a brand new recipe.
          </p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredRecipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              variants={cardVariants}
              onClick={() => {
                setNoteError(null)
                setSelectedRecipe(recipe)
                setIsDetailsOpen(true)
              }}
              className="cursor-pointer group"
            >
              <Card className="h-full border-border bg-card/65 backdrop-blur-md shadow-sm transition-all duration-200 group-hover:border-primary/20 group-hover:shadow-md rounded-2xl overflow-hidden flex flex-col justify-between">
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-base font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {recipe.name}
                    </CardTitle>
                    {getStatusBadge(recipe.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0 mt-auto">
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/30 pt-3">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {recipe.tasting_notes?.length || 0} Tasting Notes
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(recipe.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* DRAWER 1: RECIPE DETAILS & TASTING NOTES */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full sm:max-w-md border-l border-border bg-card/95 backdrop-blur-lg flex flex-col h-full overflow-hidden">
          {selectedRecipe && (
            <>
              <SheetHeader className="pb-4 border-b border-border/55">
                <div className="flex items-center gap-2 mb-1.5">
                  {getStatusBadge(selectedRecipe.status)}
                </div>
                <SheetTitle className="text-xl font-bold leading-tight pr-4">
                  {selectedRecipe.name}
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Created on {new Date(selectedRecipe.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </SheetDescription>
              </SheetHeader>

              {/* Scrollable details and notes */}
              <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1.5">
                {/* External link button */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Instructions</h4>
                  <a 
                    href={selectedRecipe.doc_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full p-3.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-sm transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4.5 w-4.5" />
                      Open Google Doc
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>

                <Separator className="border-border/30" />

                {/* Tasting Notes display */}
                <div className="space-y-3 flex flex-col h-full">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    Tasting Notes ({selectedRecipe.tasting_notes?.length || 0})
                  </h4>

                  {/* Comments list */}
                  <div className="space-y-3">
                    {!selectedRecipe.tasting_notes || selectedRecipe.tasting_notes.length === 0 ? (
                      <div className="text-center p-6 border border-dashed border-border/40 rounded-xl text-muted-foreground text-xs bg-muted/10">
                        No tasting notes yet. Share the first feedback!
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {selectedRecipe.tasting_notes.map((note, index) => (
                          <div 
                            key={index} 
                            className="p-3 bg-muted/20 border border-border/30 rounded-xl text-sm leading-relaxed"
                          >
                            {note}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Note Form Footer */}
              <div className="border-t border-border/55 pt-4 mt-auto">
                <form onSubmit={handleAddNoteSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="tasting-note" className="text-xs font-bold text-muted-foreground">Add Tasting Note</Label>
                    <Textarea
                      id="tasting-note"
                      placeholder="Comment on consistency, spice profile, prep notes..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[80px] text-xs resize-none bg-card"
                    />
                  </div>

                  {noteError && (
                    <div className="text-xs font-semibold text-destructive flex items-center gap-1 bg-destructive/5 border border-destructive/10 p-2 rounded-lg">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {noteError}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isSubmittingNote}
                    size="sm"
                    className="w-full cursor-pointer h-9 text-xs"
                  >
                    {isSubmittingNote ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Note"
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* DRAWER 2: ADD NEW RECIPE */}
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent className="w-full sm:max-w-md border-l border-border bg-card/95 backdrop-blur-lg flex flex-col h-full overflow-hidden">
          <SheetHeader className="pb-4 border-b border-border/55">
            <SheetTitle className="text-xl font-bold">Add New Recipe</SheetTitle>
            <SheetDescription className="text-xs">
              Log a new recipe concept into the Testing Vault.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleAddRecipeSubmit} className="flex-1 flex flex-col justify-between py-4 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Recipe Name */}
              <div className="space-y-1.5">
                <Label htmlFor="recipe-name" className="text-xs font-bold">Recipe Name</Label>
                <Input
                  id="recipe-name"
                  placeholder="e.g. Scallion Pancakes, Lemongrass Beef"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-10 bg-card"
                  required
                />
              </div>

              {/* Google Doc Link */}
              <div className="space-y-1.5">
                <Label htmlFor="doc-link" className="text-xs font-bold">Google Doc Link</Label>
                <Input
                  id="doc-link"
                  type="url"
                  placeholder="https://docs.google.com/document/d/..."
                  value={newDocLink}
                  onChange={(e) => setNewDocLink(e.target.value)}
                  className="h-10 bg-card"
                  required
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Testing Status</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Untested", "Testing", "D-Day Ready"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewStatus(s)}
                      className={cn(
                        "px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                        newStatus === s
                          ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                          : "border-border/60 bg-card hover:bg-muted text-muted-foreground"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button & Footer */}
            <div className="pt-4 border-t border-border/55 mt-auto space-y-3">
              {formError && (
                <div className="text-xs font-semibold text-destructive flex items-center gap-1 bg-destructive/5 border border-destructive/10 p-2.5 rounded-lg">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {formError}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isAdding}
                className="w-full cursor-pointer h-10 text-sm font-semibold"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding Recipe...
                  </>
                ) : (
                  "Create Recipe"
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
