"use client"

import { useEffect, useState } from "react"
import { Edit2, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CulinaryEvent, ShoppingGroup, ShoppingItem } from "@/lib/data"

const defaultItem: Omit<ShoppingItem, "id"> = {
  name: "",
  quantity: "",
  checked: false,
}

export function ShoppingTab({ event }: { event: CulinaryEvent }) {
  const [shoppingGroups, setShoppingGroups] = useState<ShoppingGroup[]>(() => event.shopping)
  const [isAdding, setIsAdding] = useState(false)
  const [newItem, setNewItem] = useState<Omit<ShoppingItem, "id">>({ ...defaultItem })
  const [selectedCategory, setSelectedCategory] = useState(event.shopping[0]?.category ?? "Produce")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<ShoppingItem>({ id: "", ...defaultItem })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    setShoppingGroups(event.shopping)
    setSelectedCategory(event.shopping[0]?.category ?? "Produce")
    setIsAdding(false)
    setEditingId(null)
    setDeletingId(null)
  }, [event.id])

  const handleAddItem = () => {
    setIsAdding(true)
    setNewItem({ ...defaultItem })
    setSelectedCategory(event.shopping[0]?.category ?? "Produce")
  }

  const saveNewItem = () => {
    if (!newItem.name.trim() || !newItem.quantity.trim()) return
    setShoppingGroups((prev) =>
      prev.map((group) =>
        group.category === selectedCategory
          ? {
              ...group,
              items: [
                ...group.items,
                { id: `item-${Date.now()}`, ...newItem },
              ],
            }
          : group,
      ),
    )
    setIsAdding(false)
    setNewItem({ ...defaultItem })
    // TODO: persist new shopping item via backend mutation
  }

  const startEditItem = (item: ShoppingItem) => {
    setEditingId(item.id)
    setEditItem(item)
    setDeletingId(null)
  }

  const saveEditItem = () => {
    if (!editingId || !editItem.name.trim() || !editItem.quantity.trim()) return
    setShoppingGroups((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) => (item.id === editingId ? editItem : item)),
      })),
    )
    setEditingId(null)
    // TODO: persist shopping item edits via backend mutation
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditItem({ id: "", ...defaultItem })
  }

  const confirmDeleteItem = (id: string) => {
    setDeletingId(id)
    setEditingId(null)
  }

  const deleteItem = (id: string) => {
    setShoppingGroups((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.filter((item) => item.id !== id),
      })),
    )
    setDeletingId(null)
    // TODO: persist item deletion via backend mutation
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{shoppingGroups.reduce((sum, group) => sum + group.items.length, 0)} items</p>
            <p className="text-sm font-medium">Check items off as the grocery team completes each category.</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
            onClick={handleAddItem}
          >
            <Plus className="size-4" />
            Add Item
          </Button>
        </div>

        {isAdding ? (
          <Card>
            <CardHeader className="items-start gap-4">
              <CardTitle className="text-sm">Add shopping item</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                  <X className="size-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={saveNewItem}>
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Item
                  </div>
                  <Input
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Paper towels"
                  />
                </div>
                <div>
                  <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Quantity
                  </div>
                  <Input
                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder="2 packs"
                  />
                </div>
              </div>
              <div>
                <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Category
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                >
                  {shoppingGroups.map((group) => (
                    <option key={group.category} value={group.category}>
                      {group.category}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {shoppingGroups.map((group) => {
            const done = group.items.filter((item) => item.checked).length
            return (
              <Card key={group.category} className="group/card">
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm">{group.category}</CardTitle>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {done}/{group.items.length} purchased
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {group.items.map((item, index) => {
                    const isEditing = editingId === item.id
                    const isDeleting = deletingId === item.id
                    return (
                      <div key={item.id} className="flex flex-col gap-3">
                        {index > 0 ? <div className="border-t border-border" /> : null}
                        {isEditing ? (
                          <div className="grid gap-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                                  Item
                                </div>
                                <Input
                                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                                  value={editItem.name}
                                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                                  Quantity
                                </div>
                                <Input
                                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                                  value={editItem.quantity}
                                  onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" size="sm" onClick={saveEditItem}>
                                Save
                              </Button>
                              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid gap-2">
                            <label className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-white transition-colors hover:bg-sky-900/10 dark:text-white dark:hover:bg-sky-900/20">
                              <Checkbox
                                className="border-sky-700/90 text-white focus-visible:border-sky-400 focus-visible:ring-2 focus-visible:ring-sky-500/40 data-checked:border-sky-700 data-checked:bg-sky-700"
                                checked={item.checked}
                                onCheckedChange={(value) =>
                                  setShoppingGroups((prev) =>
                                    prev.map((groupItem) => ({
                                      ...groupItem,
                                      items: groupItem.items.map((inner) =>
                                        inner.id === item.id ? { ...inner, checked: value === true } : inner,
                                      ),
                                    })),
                                  )
                                }
                              />
                              <span className={item.checked ? "text-white line-through" : "text-white"}>
                                {item.name}
                              </span>
                            </label>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{item.quantity}</span>
                              <div className="flex gap-1 opacity-0 transition-opacity group-hover/card:opacity-100">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:bg-muted"
                                  onClick={() => startEditItem(item)}
                                >
                                  <Edit2 />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:bg-muted"
                                  onClick={() => confirmDeleteItem(item.id)}
                                >
                                  <Trash2 />
                                </Button>
                              </div>
                            </div>
                            {isDeleting ? (
                              <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
                                <p className="text-sm">Delete this item?</p>
                                <div className="mt-3 flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => setDeletingId(null)}>
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Grocery Run Logistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.groceryRuns.map((run) => (
              <div key={run.id} className="rounded-lg border border-border bg-background/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{run.driver}</p>
                    <p className="text-xs text-muted-foreground">
                      {run.vehicle} • {run.destination}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {run.status}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Departure</span>
                    <span>{run.departure}</span>
                  </div>
                </div>
              </div>
            ))}
            {event.groceryRuns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No grocery runs are currently scheduled for this event.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
