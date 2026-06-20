"use client"

import { useEffect, useState } from "react"
import { Edit2, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { CulinaryEvent, Dish } from "@/lib/data"
import { addDish, updateDish, deleteDish as deleteDishAction } from "@/app/actions/dishes"

const defaultDish: Omit<Dish, "id"> = {
  name: "",
  category: "Starter",
  servings: 1,
  estimatedCost: 0,
}

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
      })
    } catch (err) {
      console.error("Failed to persist new dish in Supabase:", err)
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
      })
    } catch (err) {
      console.error("Failed to update dish in Supabase:", err)
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
      console.error("Failed to delete dish in Supabase:", err)
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
            <div className="flex flex-col gap-4">
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
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((dish) => {
          const isEditing = editingId === dish.id
          const isDeleting = deletingId === dish.id
          return (
            <Card key={dish.id} className="group/card border border-border bg-card shadow-sm hover:border-primary/30 transition-all">
              <CardHeader className="items-start gap-4">
                <div>
                  <CardTitle className="text-sm font-semibold">{dish.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1 bg-secondary text-secondary-foreground">{dish.category}</Badge>
                </div>
                <CardAction className="flex gap-1 opacity-0 transition-opacity group-hover/card:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary hover:bg-accent"
                    onClick={() => startEditDish(dish)}
                  >
                    <Edit2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => confirmDeleteDish(dish.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 py-1">
                {isEditing ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Name
                        </div>
                        <Input
                          value={editDish.name}
                          onChange={(e) => setEditDish({ ...editDish, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Category
                        </div>
                        <Input
                          value={editDish.category}
                          onChange={(e) => setEditDish({ ...editDish, category: e.target.value })}
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
                          value={editDish.servings}
                          onChange={(e) => setEditDish({ ...editDish, servings: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Estimated cost
                        </div>
                        <Input
                          type="number"
                          value={editDish.estimatedCost}
                          onChange={(e) => setEditDish({ ...editDish, estimatedCost: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
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
