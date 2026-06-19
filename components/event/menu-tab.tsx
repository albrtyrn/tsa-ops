"use client"

import { useEffect, useState } from "react"
import { Edit2, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { CulinaryEvent, Dish } from "@/lib/data"

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

  const saveNewDish = () => {
    if (!newDish.name.trim()) return
    setMenuItems((prev) => [
      ...prev,
      { id: `dish-${Date.now()}`, ...newDish },
    ])
    setNewDish({ ...defaultDish })
    setIsAdding(false)
    // TODO: persist new dish via backend mutation
  }

  const startEditDish = (dish: Dish) => {
    setEditingId(dish.id)
    setEditDish(dish)
    setDeletingId(null)
  }

  const saveEditDish = () => {
    if (!editingId || !editDish.name.trim()) return
    setMenuItems((prev) => prev.map((item) => (item.id === editingId ? editDish : item)))
    setEditingId(null)
    // TODO: persist edited dish via backend mutation
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditDish({ id: "", ...defaultDish })
  }

  const confirmDeleteDish = (id: string) => {
    setDeletingId(id)
    setEditingId(null)
  }

  const deleteDish = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id))
    setDeletingId(null)
    // TODO: persist dish deletion via backend mutation
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
          variant="ghost"
          size="sm"
          className="border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
          onClick={handleAddDish}
        >
          <Plus className="size-4" />
          Add Dish
        </Button>
      </div>

      {isAdding ? (
        <Card>
          <CardHeader className="items-start gap-4">
            <CardTitle className="text-sm">New dish</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                <X className="size-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={saveNewDish}>
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-4">
              <div>
                <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Name
                </div>
                <Input
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  placeholder="Dish name"
                />
              </div>
              <div>
                <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Category
                </div>
                <Input
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                  value={newDish.category}
                  onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                  placeholder="Starter, Main, Dessert"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Servings
                </div>
                <Input
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                  type="number"
                  value={newDish.servings}
                  min={1}
                  onChange={(e) => setNewDish({ ...newDish, servings: Number(e.target.value) })}
                />
              </div>
              <div>
                <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Estimated cost
                </div>
                <Input
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
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
            <Card key={dish.id} className="group/card">
              <CardHeader className="items-start gap-4">
                <div>
                  <CardTitle className="text-sm">{dish.name}</CardTitle>
                  <Badge variant="secondary">{dish.category}</Badge>
                </div>
                <CardAction className="flex gap-1 opacity-0 transition-opacity group-hover/card:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-muted"
                    onClick={() => startEditDish(dish)}
                  >
                    <Edit2 />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-muted"
                    onClick={() => confirmDeleteDish(dish.id)}
                  >
                    <Trash2 />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 py-1">
                {isEditing ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                          Name
                        </div>
                        <Input
                          className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                          value={editDish.name}
                          onChange={(e) => setEditDish({ ...editDish, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                          Category
                        </div>
                        <Input
                          className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                          value={editDish.category}
                          onChange={(e) => setEditDish({ ...editDish, category: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                          Servings
                        </div>
                        <Input
                          className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                          type="number"
                          value={editDish.servings}
                          onChange={(e) => setEditDish({ ...editDish, servings: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                          Estimated cost
                        </div>
                        <Input
                          className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                          type="number"
                          value={editDish.estimatedCost}
                          onChange={(e) => setEditDish({ ...editDish, estimatedCost: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="secondary" size="sm" onClick={saveEditDish}>
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{dish.servings} servings</span>
                      <span className="font-medium tabular-nums">${dish.estimatedCost.toLocaleString()}</span>
                    </div>
                    {isDeleting ? (
                      <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
                        <p className="text-sm">Delete this dish?</p>
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
