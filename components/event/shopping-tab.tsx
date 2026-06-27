"use client"

import { Edit2, Plus, Trash2, X } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { CulinaryEvent, ShoppingGroup, ShoppingItem, GroceryRun } from "@/lib/data"
import { addShoppingItem, updateShoppingItem, deleteShoppingItem } from "@/app/actions/shopping"
import { addGroceryRun, deleteGroceryRun } from "@/app/actions/grocery-runs"

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

  const [groceryRuns, setGroceryRuns] = useState<GroceryRun[]>(() => event.groceryRuns)
  const [isAddingRun, setIsAddingRun] = useState(false)
  const [newRun, setNewRun] = useState<Omit<GroceryRun, "id">>({
    driver: "",
    vehicle: "Sedan",
    destination: "",
    departure: "",
    status: "Planned",
  })
  const allStaff = event.staffing.flatMap(g => g.members)

  useEffect(() => {
    setShoppingGroups(event.shopping)
    setSelectedCategory(event.shopping[0]?.category ?? "Produce")
    setIsAdding(false)
    setEditingId(null)
    setDeletingId(null)
    setGroceryRuns(event.groceryRuns)
    setIsAddingRun(false)
  }, [event.id])

  const handleAddItem = () => {
    setIsAdding(true)
    setNewItem({ ...defaultItem })
    setSelectedCategory(event.shopping[0]?.category ?? "Produce")
  }

  const saveNewItem = async () => {
    if (!newItem.name.trim() || !newItem.quantity.trim()) return
    
    // Optimistic UI update
    const previousState = [...shoppingGroups]
    const tempId = `item-${Date.now()}`
    setShoppingGroups((prev) =>
      prev.map((group) =>
        group.category === selectedCategory
          ? {
              ...group,
              items: [
                ...group.items,
                { id: tempId, ...newItem },
              ],
            }
          : group,
      ),
    )
    setIsAdding(false)
    setNewItem({ ...defaultItem })

    try {
      await addShoppingItem(event.id, {
        name: newItem.name,
        quantity: newItem.quantity,
        category: selectedCategory,
      })
    } catch (err) {
      console.error("Failed to persist new shopping item in Supabase:")
      setShoppingGroups(previousState)
    }
  }

  const startEditItem = (item: ShoppingItem) => {
    setEditingId(item.id)
    setEditItem(item)
    setDeletingId(null)
  }

  const saveEditItem = async () => {
    if (!editingId || !editItem.name.trim() || !editItem.quantity.trim()) return
    
    // Optimistic UI update
    const previousState = [...shoppingGroups]
    setShoppingGroups((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) => (item.id === editingId ? editItem : item)),
      })),
    )
    setEditingId(null)

    try {
      await updateShoppingItem(event.id, editingId, {
        name: editItem.name,
        quantity: editItem.quantity,
      })
    } catch (err) {
      console.error("Failed to update shopping item in Supabase:")
      setShoppingGroups(previousState)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditItem({ id: "", ...defaultItem })
  }

  const confirmDeleteItem = (id: string) => {
    setDeletingId(id)
    setEditingId(null)
  }

  const deleteItem = async (id: string) => {
    // Optimistic UI update
    const previousState = [...shoppingGroups]
    setShoppingGroups((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.filter((item) => item.id !== id),
      })),
    )
    setDeletingId(null)

    try {
      await deleteShoppingItem(event.id, id)
    } catch (err) {
      console.error("Failed to delete item in Supabase:", err)
      setShoppingGroups(previousState)
    }
  }

  const handleAddRun = () => {
    setIsAddingRun(true)
    setNewRun({
      driver: allStaff[0]?.name || "",
      vehicle: "Sedan",
      destination: "",
      departure: "",
      status: "Planned",
    })
  }

  const saveNewRun = async () => {
    if (!newRun.driver || !newRun.destination) return
    
    const tempId = `run-${Date.now()}`
    const previousState = [...groceryRuns]
    
    setGroceryRuns(prev => [...prev, { id: tempId, ...newRun }])
    setIsAddingRun(false)

    try {
      await addGroceryRun(event.id, {
        driver_name_fallback: newRun.driver,
        vehicle: newRun.vehicle,
        destination: newRun.destination,
        departure: newRun.departure,
        status: newRun.status
      })
    } catch (err) {
      console.error("Failed to add grocery run:", err)
      setGroceryRuns(previousState)
    }
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
            variant="outline"
            size="sm"
            onClick={handleAddItem}
          >
            <Plus className="size-4" />
            Add Item
          </Button>
        </div>

        {isAdding ? (
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="items-start gap-4">
              <CardTitle className="text-sm font-semibold">Add shopping item</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                  <X className="size-4" />
                </Button>
                <Button variant="default" size="sm" onClick={saveNewItem}>
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Item
                  </div>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Chicken Thighs"
                  />
                </div>
                <div>
                  <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Quantity
                  </div>
                  <Input
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder="30 lb"
                  />
                </div>
              </div>
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Category
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as "Produce" | "Protein" | "Dry Goods" | "Misc")}
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
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
              <Card key={group.category} className="group/card border border-border bg-card shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 pb-2">
                  <div>
                    <CardTitle className="text-sm font-semibold">{group.category}</CardTitle>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {done}/{group.items.length} purchased
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-3">
                  {group.items.map((item, index) => {
                    const isEditing = editingId === item.id
                    const isDeleting = deletingId === item.id
                    return (
                      <div key={item.id} className="flex flex-col gap-3 group/item">
                        {index > 0 ? <div className="border-t border-border/40" /> : null}
                        {isEditing ? (
                          <div className="grid gap-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                                  Item
                                </div>
                                <Input
                                  value={editItem.name}
                                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                                  Quantity
                                </div>
                                <Input
                                  value={editItem.quantity}
                                  onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="default" size="sm" onClick={saveEditItem}>
                                Save
                              </Button>
                              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid gap-2">
                            <div className="flex items-center justify-between gap-3">
                              <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent">
                                <Checkbox
                                  checked={item.checked}
                                  onCheckedChange={(value) => {
                                    const previousState = [...shoppingGroups]
                                    setShoppingGroups((prev) =>
                                      prev.map((groupItem) => ({
                                        ...groupItem,
                                        items: groupItem.items.map((inner) =>
                                          inner.id === item.id ? { ...inner, checked: value === true } : inner,
                                        ),
                                      })),
                                    )
                                    updateShoppingItem(event.id, item.id, { checked: value === true })
                                      .catch((err) => {
                                        console.error("Failed to update check status:")
                                        setShoppingGroups(previousState)
                                      })
                                  }}
                                />
                                <span className={item.checked ? "text-muted-foreground line-through" : "text-foreground font-medium"}>
                                  {item.name}
                                </span>
                              </label>
                              <div className="flex gap-1 opacity-0 transition-opacity group-hover/item:opacity-100">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-primary hover:bg-accent h-7 w-7"
                                  onClick={() => startEditItem(item)}
                                >
                                  <Edit2 className="size-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7"
                                  onClick={() => confirmDeleteItem(item.id)}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground pl-8">
                              <span>{item.quantity}</span>
                            </div>
                            {isDeleting ? (
                              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm mt-1">
                                <p className="text-sm font-medium text-destructive">Delete this item?</p>
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
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Grocery Run Logistics</CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddRun}>
              <Plus className="size-4 mr-1" />
              Add Run
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAddingRun ? (
              <div className="rounded-lg border border-border bg-background p-4 shadow-sm mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-semibold">New Grocery Run</h4>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsAddingRun(false)}>
                      <X className="size-4" />
                    </Button>
                    <Button variant="default" size="sm" onClick={saveNewRun}>
                      Save
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Driver
                    </div>
                    <select
                      className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
                      value={newRun.driver}
                      onChange={(e) => setNewRun({ ...newRun, driver: e.target.value })}
                    >
                      <option value="" disabled>Select Driver</option>
                      {allStaff.map(staff => (
                        <option key={staff.id} value={staff.name}>{staff.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Vehicle
                    </div>
                    <select
                      className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
                      value={newRun.vehicle}
                      onChange={(e) => setNewRun({ ...newRun, vehicle: e.target.value as any })}
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Minivan">Minivan</option>
                      <option value="Pickup">Pickup</option>
                    </select>
                  </div>
                  <div>
                    <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Destination
                    </div>
                    <Input
                      value={newRun.destination}
                      onChange={(e) => setNewRun({ ...newRun, destination: e.target.value })}
                      placeholder="e.costco"
                    />
                  </div>
                  <div>
                    <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Departure Time
                    </div>
                    <Input
                      value={newRun.departure}
                      onChange={(e) => setNewRun({ ...newRun, departure: e.target.value })}
                      placeholder="e.g. 10:00 AM"
                    />
                  </div>
                </div>
              </div>
            ) : null}
            {groceryRuns.map((run) => (
              <div key={run.id} className="rounded-lg border border-border bg-background p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{run.driver}</p>
                    <p className="text-xs text-muted-foreground">
                      {run.vehicle} • {run.destination}
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {run.status}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span>Departure</span>
                    <span className="font-medium text-foreground">{run.departure}</span>
                  </div>
                </div>
              </div>
            ))}
            {groceryRuns.length === 0 && !isAddingRun ? (
              <p className="text-sm text-muted-foreground">No grocery runs are currently scheduled for this event.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
