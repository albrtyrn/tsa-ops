"use client"

import { useEffect, useState } from "react"
import { Edit2, Plus, Trash2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CulinaryEvent, EquipmentLoan } from "@/lib/data"
import { addEquipmentLoan, updateEquipmentLoan, deleteEquipmentLoan } from "@/app/actions/equipment"

const defaultLoan: Omit<EquipmentLoan, "id"> = {
  item: "",
  owner: "",
  dateBrought: "",
  dateReturned: "",
  returned: false,
}

export function EquipmentTab({ event }: { event: CulinaryEvent }) {
  const [loans, setLoans] = useState<EquipmentLoan[]>(() => event.equipmentLoans)
  const [isAdding, setIsAdding] = useState(false)
  const [newLoan, setNewLoan] = useState<Omit<EquipmentLoan, "id">>({ ...defaultLoan })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLoan, setEditLoan] = useState<EquipmentLoan>({ id: "", ...defaultLoan })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    setLoans(event.equipmentLoans)
    setIsAdding(false)
    setEditingId(null)
    setDeletingId(null)
  }, [event.id])

  const handleAddLoan = () => {
    setIsAdding(true)
    setNewLoan({ ...defaultLoan })
  }

  const saveNewLoan = async () => {
    if (!newLoan.item.trim() || !newLoan.owner.trim()) return
    const previousState = [...loans]
    const tempId = `loan-${Date.now()}`
    setLoans((prev) => [...prev, { id: tempId, ...newLoan }])
    setNewLoan({ ...defaultLoan })
    setIsAdding(false)
    try {
      await addEquipmentLoan(event.id, {
        item: newLoan.item,
        owner_name_fallback: newLoan.owner,
        date_brought: newLoan.dateBrought,
        date_returned: newLoan.dateReturned,
      })
    } catch (err) {
      console.error("Failed to persist new loan in Supabase:")
      setLoans(previousState)
    }
  }

  const startEditLoan = (loan: EquipmentLoan) => {
    setEditingId(loan.id)
    setEditLoan(loan)
    setDeletingId(null)
  }

  const saveEditLoan = async () => {
    if (!editingId || !editLoan.item.trim() || !editLoan.owner.trim()) return
    const previousState = [...loans]
    setLoans((prev) => prev.map((loan) => (loan.id === editingId ? editLoan : loan)))
    setEditingId(null)
    try {
      await updateEquipmentLoan(event.id, editingId, {
        item: editLoan.item,
        owner_name_fallback: editLoan.owner,
        date_brought: editLoan.dateBrought,
        date_returned: editLoan.dateReturned,
        returned: editLoan.returned,
      })
    } catch (err) {
      console.error("Failed to update loan in Supabase:")
      setLoans(previousState)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditLoan({ id: "", ...defaultLoan })
  }

  const confirmDeleteLoan = (id: string) => {
    setDeletingId(id)
    setEditingId(null)
  }

  const deleteLoan = async (id: string) => {
    const previousState = [...loans]
    setLoans((prev) => prev.filter((loan) => loan.id !== id))
    setDeletingId(null)
    try {
      await deleteEquipmentLoan(event.id, id)
    } catch (err) {
      console.error("Failed to delete loan in Supabase:")
      setLoans(previousState)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{loans.length} equipment loans</p>
          <p className="text-sm font-medium">Track borrowings, returns, and owner handoffs in one place.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddLoan}
        >
          <Plus className="size-4" />
          Add Loan
        </Button>
      </div>

      {isAdding ? (
        <Card className="border border-border bg-card">
          <CardHeader className="items-start gap-4">
            <CardTitle className="text-sm">New equipment loan</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                <X className="size-4" />
              </Button>
              <Button variant="default" size="sm" onClick={saveNewLoan}>
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
                  value={newLoan.item}
                  onChange={(e) => setNewLoan({ ...newLoan, item: e.target.value })}
                  placeholder="Wok"
                />
              </div>
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Owner
                </div>
                <Input
                  value={newLoan.owner}
                  onChange={(e) => setNewLoan({ ...newLoan, owner: e.target.value })}
                  placeholder="Chef Lin"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Date Brought
                </div>
                <Input
                  value={newLoan.dateBrought}
                  onChange={(e) => setNewLoan({ ...newLoan, dateBrought: e.target.value })}
                  placeholder="Oct 17"
                />
              </div>
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Due Back
                </div>
                <Input
                  value={newLoan.dateReturned}
                  onChange={(e) => setNewLoan({ ...newLoan, dateReturned: e.target.value })}
                  placeholder="Oct 19"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={newLoan.returned}
                onCheckedChange={(value) => setNewLoan({ ...newLoan, returned: value === true })}
              />
              <span className="text-sm text-foreground">Returned</span>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="overflow-x-auto border border-border rounded-lg bg-card shadow-sm">
        <table className="w-full text-left text-sm text-foreground">
          <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Brought</th>
              <th className="px-4 py-3">Due Back</th>
              <th className="px-4 py-3">Returned</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {loans.map((loan) => {
                const isEditing = editingId === loan.id
                const isDeleting = deletingId === loan.id
                return (
                  <motion.tr
                    key={loan.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="hover:bg-accent/40 transition-colors group"
                  >
                    <td className="px-4 py-3 font-medium">{isEditing ? (
                      <Input
                        value={editLoan.item}
                        onChange={(e) => setEditLoan({ ...editLoan, item: e.target.value })}
                      />
                    ) : loan.item}</td>
                    <td className="px-4 py-3">{isEditing ? (
                      <Input
                        value={editLoan.owner}
                        onChange={(e) => setEditLoan({ ...editLoan, owner: e.target.value })}
                      />
                    ) : loan.owner}</td>
                    <td className="px-4 py-3">{isEditing ? (
                      <Input
                        value={editLoan.dateBrought}
                        onChange={(e) => setEditLoan({ ...editLoan, dateBrought: e.target.value })}
                      />
                    ) : loan.dateBrought}</td>
                    <td className="px-4 py-3">{isEditing ? (
                      <Input
                        value={editLoan.dateReturned}
                        onChange={(e) => setEditLoan({ ...editLoan, dateReturned: e.target.value })}
                      />
                    ) : loan.dateReturned}</td>
                    <td className="px-4 py-3">{isEditing ? (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={editLoan.returned}
                          onCheckedChange={(value) => setEditLoan({ ...editLoan, returned: value === true })}
                        />
                        <span className="text-sm">Yes</span>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={loan.returned}
                          onCheckedChange={async (value) => {
                            const isReturned = value === true
                            const previousState = [...loans]
                            setLoans((prev) =>
                              prev.map((item) =>
                                item.id === loan.id ? { ...item, returned: isReturned } : item,
                              ),
                            )
                            try {
                              await updateEquipmentLoan(event.id, loan.id, {
                                returned: isReturned,
                              })
                            } catch (err) {
                              console.error("Failed to update loan returned status in Supabase:")
                              setLoans(previousState)
                            }
                          }}
                        />
                        <span className="text-sm">{loan.returned ? 'Yes' : 'No'}</span>
                      </label>
                    )}</td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="secondary" size="sm" onClick={saveEditLoan}>
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
                          <Button variant="destructive" size="sm" onClick={() => deleteLoan(loan.id)}>
                            Delete
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" role="group">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-primary hover:bg-accent"
                            onClick={() => startEditLoan(loan)}
                          >
                            <Edit2 className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => confirmDeleteLoan(loan.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
