"use client"

import { useEffect, useState } from "react"
import { Edit2, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CulinaryEvent, ReimbursementEntry } from "@/lib/data"

const reimbursementOptions = [
  "Pending Review",
  "Approved by Treasurer",
  "Venmo Sent",
] as const

const receiptOptions = ["Uploaded", "Missing"] as const

const defaultEntry: Omit<ReimbursementEntry, "id"> = {
  buyer: "",
  purpose: "",
  amount: 0,
  receiptStatus: "Uploaded",
  status: "Pending Review",
}

export function ReimbursementsTab({ event }: { event: CulinaryEvent }) {
  const [entries, setEntries] = useState<ReimbursementEntry[]>(() => event.reimbursements)
  const [isAdding, setIsAdding] = useState(false)
  const [newEntry, setNewEntry] = useState<Omit<ReimbursementEntry, "id">>({ ...defaultEntry })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editEntry, setEditEntry] = useState<ReimbursementEntry>({ id: "", ...defaultEntry })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    setEntries(event.reimbursements)
    setIsAdding(false)
    setEditingId(null)
    setDeletingId(null)
  }, [event.id])

  const handleAddEntry = () => {
    setIsAdding(true)
    setNewEntry({ ...defaultEntry })
  }

  const saveNewEntry = () => {
    if (!newEntry.buyer.trim() || !newEntry.purpose.trim()) return
    setEntries((prev) => [...prev, { id: `reim-${Date.now()}`, ...newEntry }])
    setNewEntry({ ...defaultEntry })
    setIsAdding(false)
    // TODO: persist new reimbursement via backend mutation
  }

  const startEditEntry = (entry: ReimbursementEntry) => {
    setEditingId(entry.id)
    setEditEntry(entry)
    setDeletingId(null)
  }

  const saveEditEntry = () => {
    if (!editingId || !editEntry.buyer.trim() || !editEntry.purpose.trim()) return
    setEntries((prev) => prev.map((entry) => (entry.id === editingId ? editEntry : entry)))
    setEditingId(null)
    // TODO: persist reimbursement changes via backend mutation
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditEntry({ id: "", ...defaultEntry })
  }

  const confirmDeleteEntry = (id: string) => {
    setDeletingId(id)
    setEditingId(null)
  }

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
    setDeletingId(null)
    // TODO: persist reimbursement deletion via backend mutation
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{entries.length} reimbursement records</p>
          <p className="text-sm font-medium">Keep expense approvals and receipt status in sync.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddEntry}
        >
          <Plus className="size-4" />
          Add Entry
        </Button>
      </div>

      {isAdding ? (
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="items-start gap-4">
            <CardTitle className="text-sm">New reimbursement</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                <X className="size-4" />
              </Button>
              <Button variant="default" size="sm" onClick={saveNewEntry}>
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Buyer
                </div>
                <Input
                  value={newEntry.buyer}
                  onChange={(e) => setNewEntry({ ...newEntry, buyer: e.target.value })}
                  placeholder="Purchase lead"
                />
              </div>
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Amount
                </div>
                <Input
                  type="number"
                  value={newEntry.amount}
                  min={0}
                  onChange={(e) => setNewEntry({ ...newEntry, amount: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Purpose
                </div>
                <Input
                  value={newEntry.purpose}
                  onChange={(e) => setNewEntry({ ...newEntry, purpose: e.target.value })}
                  placeholder="Costco ingredient purchases"
                />
              </div>
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Receipt status
                </div>
                <select
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
                  value={newEntry.receiptStatus}
                  onChange={(e) => setNewEntry({ ...newEntry, receiptStatus: e.target.value as typeof receiptOptions[number] })}
                >
                  {receiptOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Status
              </div>
              <select
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
                value={newEntry.status}
                onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value as typeof reimbursementOptions[number] })}
              >
                {reimbursementOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="overflow-x-auto border border-border rounded-lg bg-card shadow-sm">
        <table className="w-full text-left text-sm text-foreground">
          <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Receipt</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.map((entry) => {
              const isEditing = editingId === entry.id
              const isDeleting = deletingId === entry.id
              return (
                <tr key={entry.id} className="hover:bg-accent/40 transition-colors group">
                  <td className="px-4 py-3 font-medium">{isEditing ? (
                    <Input
                      value={editEntry.buyer}
                      onChange={(e) => setEditEntry({ ...editEntry, buyer: e.target.value })}
                    />
                  ) : entry.buyer}</td>
                  <td className="px-4 py-3">{isEditing ? (
                    <Input
                      value={editEntry.purpose}
                      onChange={(e) => setEditEntry({ ...editEntry, purpose: e.target.value })}
                    />
                  ) : entry.purpose}</td>
                  <td className="px-4 py-3 font-medium tabular-nums">{isEditing ? (
                    <Input
                      type="number"
                      value={editEntry.amount}
                      min={0}
                      onChange={(e) => setEditEntry({ ...editEntry, amount: Number(e.target.value) })}
                    />
                  ) : `$${entry.amount.toFixed(2)}`}</td>
                  <td className="px-4 py-3">{isEditing ? (
                    <select
                      className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
                      value={editEntry.receiptStatus}
                      onChange={(e) => setEditEntry({ ...editEntry, receiptStatus: e.target.value as typeof receiptOptions[number] })}
                    >
                      {receiptOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge variant="secondary" className={
                      entry.receiptStatus === "Uploaded" ? "bg-emerald-100 text-emerald-800 border-transparent" :
                      entry.receiptStatus === "Missing" ? "bg-rose-100 text-rose-800 border-transparent" :
                      "bg-amber-100 text-amber-800 border-transparent"
                    }>
                      {entry.receiptStatus}
                    </Badge>
                  )}</td>
                  <td className="px-4 py-3">{isEditing ? (
                    <select
                      className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
                      value={editEntry.status}
                      onChange={(e) => setEditEntry({ ...editEntry, status: e.target.value as typeof reimbursementOptions[number] })}
                    >
                      {reimbursementOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge variant="outline" className={
                      entry.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      entry.status === "Draft" ? "bg-slate-100 text-slate-700 border-slate-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }>
                      {entry.status}
                    </Badge>
                  )}</td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="default" size="sm" onClick={saveEditEntry}>
                          Save
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : isDeleting ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setDeletingId(null)}>
                          Keep
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteEntry(entry.id)}>
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary hover:bg-accent"
                          onClick={() => startEditEntry(entry)}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => confirmDeleteEntry(entry.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
