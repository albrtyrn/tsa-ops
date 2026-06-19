"use client"

import { useEffect, useState } from "react"
import { Edit2, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CulinaryEvent, TimelineStep } from "@/lib/data"

const defaultStep: Omit<TimelineStep, "id"> = {
  marker: "",
  title: "",
  description: "",
  done: false,
}

export function TimelineTab({ event }: { event: CulinaryEvent }) {
  const [steps, setSteps] = useState<TimelineStep[]>(() => event.timeline)
  const [isAdding, setIsAdding] = useState(false)
  const [newStep, setNewStep] = useState<Omit<TimelineStep, "id">>({ ...defaultStep })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStep, setEditStep] = useState<TimelineStep>({ id: "", ...defaultStep })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    setSteps(event.timeline)
    setIsAdding(false)
    setEditingId(null)
    setDeletingId(null)
  }, [event.id])

  const handleAddStep = () => {
    setIsAdding(true)
    setNewStep({ ...defaultStep })
  }

  const saveNewStep = () => {
    if (!newStep.title.trim() || !newStep.marker.trim()) return
    setSteps((prev) => [...prev, { id: `step-${Date.now()}`, ...newStep }])
    setNewStep({ ...defaultStep })
    setIsAdding(false)
    // TODO: persist new timeline step via backend mutation
  }

  const startEditStep = (step: TimelineStep) => {
    setEditingId(step.id)
    setEditStep(step)
    setDeletingId(null)
  }

  const saveEditStep = () => {
    if (!editingId || !editStep.title.trim() || !editStep.marker.trim()) return
    setSteps((prev) => prev.map((step) => (step.id === editingId ? editStep : step)))
    setEditingId(null)
    // TODO: persist timeline updates via backend mutation
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditStep({ id: "", ...defaultStep })
  }

  const confirmDeleteStep = (id: string) => {
    setDeletingId(id)
    setEditingId(null)
  }

  const deleteStep = (id: string) => {
    setSteps((prev) => prev.filter((step) => step.id !== id))
    setDeletingId(null)
    // TODO: persist step deletion via backend mutation
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{steps.length} timeline items</p>
          <p className="text-sm font-medium">Keep the day-on-day schedule clear and easy to follow.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddStep}
        >
          <Plus className="size-4" />
          Add Step
        </Button>
      </div>

      {isAdding ? (
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="items-start gap-4">
            <CardTitle className="text-sm font-semibold">New timeline item</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                <X className="size-4" />
              </Button>
              <Button variant="default" size="sm" onClick={saveNewStep}>
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Marker
                </div>
                <Input
                  value={newStep.marker}
                  onChange={(e) => setNewStep({ ...newStep, marker: e.target.value })}
                  placeholder="T-1 day"
                />
              </div>
              <div>
                <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Event
                </div>
                <Input
                  value={newStep.title}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                  placeholder="Setup begins"
                />
              </div>
            </div>
            <div>
              <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Description
              </div>
              <Input
                value={newStep.description}
                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                placeholder="Who, what, and where"
              />
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {steps.map((step) => {
          const isEditing = editingId === step.id
          const isDeleting = deletingId === step.id
          return (
            <Card key={step.id} className="group/card border border-border bg-card shadow-sm hover:border-primary/20 transition-all">
              <CardHeader className="items-start gap-4">
                <div>
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    {step.title}
                    {step.done && (
                      <span className="rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 text-xs font-semibold">
                        Done
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">{step.marker}</p>
                </div>
                <CardAction className="opacity-0 transition-opacity group-hover/card:opacity-100">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary hover:bg-accent h-7 w-7"
                      onClick={() => startEditStep(step)}
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7"
                      onClick={() => confirmDeleteStep(step.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent className="grid gap-4 py-1">
                {isEditing ? (
                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Marker
                        </div>
                        <Input
                          value={editStep.marker}
                          onChange={(e) => setEditStep({ ...editStep, marker: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Event
                        </div>
                        <Input
                          value={editStep.title}
                          onChange={(e) => setEditStep({ ...editStep, title: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Description
                      </div>
                      <Input
                        value={editStep.description}
                        onChange={(e) => setEditStep({ ...editStep, description: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        id={`edit-step-done-${step.id}`}
                        checked={editStep.done}
                        onChange={(e) => setEditStep({ ...editStep, done: e.target.checked })}
                        className="h-4 w-4 rounded border-input text-primary focus-visible:ring-ring cursor-pointer accent-primary"
                      />
                      <label htmlFor={`edit-step-done-${step.id}`} className="text-sm text-foreground font-medium cursor-pointer">Completed</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="default" size="sm" onClick={saveEditStep}>
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground pt-1 border-t border-border/40">{step.description}</p>
                    {isDeleting ? (
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm mt-3">
                        <p className="text-sm font-medium text-destructive">Delete this step?</p>
                        <div className="mt-3 flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setDeletingId(null)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteStep(step.id)}>
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
