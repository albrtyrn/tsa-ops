"use client"

import { useEffect, useState } from "react"
import { Edit2, Plus, Trash2, X, FileText, Check, Link } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { CulinaryEvent, Dish } from "@/lib/data"
import { addDish, updateDish, deleteDish as deleteDishAction } from "@/app/actions/dishes"

const defaultDish: Omit<Dish, "id"> = {
  name: "",
  category: "Starter",
  servings: 1,
  estimatedCost: 0,
  recipe_status: "Untested",
  google_doc_link: "",
}

const statusOptions = ["Untested", "In Progress", "D-Day Ready"] as const

export function MenuTab({ event }: { event: CulinaryEvent }) {
  const [menuItems, setMenuItems] = useState<Dish[]>(() => event.menu)
  const [isAdding, setIsAdding] = useState(false)
  const [newDish, setNewDish] = useState<Omit<Dish, "id">>({ ...defaultDish })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDish, setEditDish] = useState<Dish>({ id: "", ...defaultDish })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    setMenuItems(event.menu)
    setIsAdding(false)
    setEditingId(null)
    setDeletingId(null)
  }, [event.id])

  const handleAddDish = () => {
    setIsAdding(true)
    setNewDish({ ...defaultDish, category: event.menu[0]?.category ?? "Starter" })
  }

  const saveNewDish = async () => {
    if (!newDish.name.trim()) return
    
    // Optimistic UI update
    const tempId = `dish-${Date.now()}`
    setMenuItems((prev) => [
      ...prev,
      { id: tempId, ...newDish },
    ])
    setNewDish({ ...defaultDish })
    setIsAdding(false)

    try {
      await addDish(event.id, {
        name: newDish.name,
        category: newDish.category,
        servings: newDish.servings,
        estimated_cost: newDish.estimatedCost,
        recipe_status: newDish.recipe_status,
        google_doc_link: newDish.google_doc_link,
      })
    } catch (err) {
      console.error("Failed to persist new dish in Supabase:")
    }
  }

  const startEditDish = (dish: Dish) => {
    setEditingId(dish.id)
    setEditDish(dish)
    setDeletingId(null)
  }

  const saveEditDish = async () => {
    if (!editingId || !editDish.name.trim()) return
    
    // Optimistic UI update
    setMenuItems((prev) => prev.map((item) => (item.id === editingId ? editDish : item)))
    setEditingId(null)

    try {
      await updateDish(event.id, editingId, {
        name: editDish.name,
        category: editDish.category,
        servings: editDish.servings,
        estimated_cost: editDish.estimatedCost,
        recipe_status: editDish.recipe_status,
        google_doc_link: editDish.google_doc_link || null,
      })
    } catch (err) {
      console.error("Failed to update dish in Supabase:")
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditDish({ id: "", ...defaultDish })
  }

  const confirmDeleteDish = (id: string) => {
    setDeletingId(id)
    setEditingId(null)
  }

  const deleteDish = async (id: string) => {
    // Optimistic UI update
    setMenuItems((prev) => prev.filter((item) => item.id !== id))
    setDeletingId(null)

    try {
      await deleteDishAction(event.id, id)
    } catch (err) {
      console.error("Failed to delete dish in Supabase:")
    }
  }

  const total = menuItems.reduce((acc, dish) => acc + dish.estimatedCost, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{menuItems.length} dishes planned</p>
          <p className="text-sm font-medium">
            Estimated food cost: <span className="tabular-nums">${total.toLocaleString()}</span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddDish}
        >
          <Plus className="size-4" />
          Add Dish
        </Button>
      </div>

      {isAdding ? (
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="items-start gap-4">
            <CardTitle className="text-sm">New dish</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                <X className="size-4" />
              </Button>
              <Button variant="default" size="sm" onClick={saveNewDish}>
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Name
                </div>
                <Input
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  placeholder="Dish name"
                />
              </div>
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Category
                </div>
                <Input
                  value={newDish.category}
                  onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                  placeholder="Starter, Main, Dessert"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Servings
                </div>
                <Input
                  type="number"
                  value={newDish.servings}
                  min={1}
                  onChange={(e) => setNewDish({ ...newDish, servings: Number(e.target.value) })}
                />
              </div>
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Estimated cost
                </div>
                <Input
                  type="number"
                  value={newDish.estimatedCost}
                  min={0}
                  onChange={(e) => setNewDish({ ...newDish, estimatedCost: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-border/50 pt-4">
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Recipe Status
                </div>
                <select
                  className="h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
                  value={newDish.recipe_status}
                  onChange={(e) => setNewDish({ ...newDish, recipe_status: e.target.value as any })}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Recipe Google Doc Link
                </div>
                <Input
                  value={newDish.google_doc_link}
                  placeholder="https://docs.google.com/document/..."
                  onChange={(e) => setNewDish({ ...newDish, google_doc_link: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((dish) => {
          const isEditing = editingId === dish.id
          const isDeleting = deletingId === dish.id
          const recipeStatus = dish.recipe_status || "Untested"

          return (
            <Card key={dish.id} className="group/card border border-border bg-card shadow-sm hover:border-primary/30 transition-all">
              <CardHeader className="items-start gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-semibold truncate">{dish.name}</CardTitle>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-[10px]">{dish.category}</Badge>
                    <span className={`inline-flex px-1.5 py-0.5 rounded-[4px] text-[9px] font-semibold border uppercase tracking-wide ${
                      recipeStatus === "D-Day Ready" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      recipeStatus === "In Progress" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-muted/70 text-muted-foreground border-border"
                    }`}>
                      {recipeStatus}
                    </span>
                  </div>
                </div>
                <CardAction className="flex gap-1 opacity-0 transition-opacity group-hover/card:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary hover:bg-accent h-7 w-7"
                    onClick={() => startEditDish(dish)}
                  >
                    <Edit2 className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7"
                    onClick={() => confirmDeleteDish(dish.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 py-1">
                {isEditing ? (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Name
                        </div>
                        <Input
                          value={editDish.name}
                          onChange={(e) => setEditDish({ ...editDish, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Category
                        </div>
                        <Input
                          value={editDish.category}
                          onChange={(e) => setEditDish({ ...editDish, category: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Servings
                        </div>
                        <Input
                          type="number"
                          value={editDish.servings}
                          onChange={(e) => setEditDish({ ...editDish, servings: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Cost
                        </div>
                        <Input
                          type="number"
                          value={editDish.estimatedCost}
                          onChange={(e) => setEditDish({ ...editDish, estimatedCost: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 border-t border-border/40 pt-2">
                      <div>
                        <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Recipe Status
                        </div>
                        <select
                          className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
                          value={editDish.recipe_status}
                          onChange={(e) => setEditDish({ ...editDish, recipe_status: e.target.value as any })}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Doc Link
                        </div>
                        <Input
                          value={editDish.google_doc_link || ""}
                          placeholder="https://docs.google.com..."
                          onChange={(e) => setEditDish({ ...editDish, google_doc_link: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" onClick={saveEditDish}>
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-sm pt-1 border-t border-border">
                      <span className="text-muted-foreground">{dish.servings} servings</span>
                      <span className="font-medium text-foreground tabular-nums">${dish.estimatedCost.toLocaleString()}</span>
                    </div>
                    
                    {dish.google_doc_link && (
                      <div className="mt-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-accent text-xs flex items-center gap-1.5 text-primary" nativeButton={false} render={
                          <a href={dish.google_doc_link} target="_blank" rel="noopener noreferrer">
                            <FileText className="size-3.5" />
                            View Recipe Doc
                          </a>
                        } />
                      </div>
                    )}

                    {isDeleting ? (
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm mt-3 animate-fade-in">
                        <p className="text-sm font-medium text-destructive">Delete this dish?</p>
                        <div className="mt-3 flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setDeletingId(null)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteDish(dish.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
