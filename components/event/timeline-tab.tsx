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
          variant="ghost"
          size="sm"
          className="border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
          onClick={handleAddStep}
        >
          <Plus className="size-4" />
          Add Step
        </Button>
      </div>

      {isAdding ? (
        <Card>
          <CardHeader className="items-start gap-4">
            <CardTitle className="text-sm">New timeline item</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                <X className="size-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={saveNewStep}>
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Marker
                </div>
                <Input
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                  value={newStep.marker}
                  onChange={(e) => setNewStep({ ...newStep, marker: e.target.value })}
                  placeholder="T-1 day"
                />
              </div>
              <div>
                <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Event
                </div>
                <Input
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                  value={newStep.title}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                  placeholder="Setup begins"
                />
              </div>
            </div>
            <div>
              <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Description
              </div>
              <Input
                className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
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
            <Card key={step.id} className="group/card">
              <CardHeader className="items-start gap-4">
                <div>
                  <CardTitle className="text-sm">{step.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{step.marker}</p>
                </div>
                <CardAction className="opacity-0 transition-opacity group-hover/card:opacity-100">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:bg-muted"
                      onClick={() => startEditStep(step)}
                    >
                      <Edit2 />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:bg-muted"
                      onClick={() => confirmDeleteStep(step.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent className="grid gap-4 py-1">
                {isEditing ? (
                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                          Marker
                        </div>
                        <Input
                          className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                          value={editStep.marker}
                          onChange={(e) => setEditStep({ ...editStep, marker: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                          Event
                        </div>
                        <Input
                          className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                          value={editStep.title}
                          onChange={(e) => setEditStep({ ...editStep, title: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                        Description
                      </div>
                      <Input
                        className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
                        value={editStep.description}
                        onChange={(e) => setEditStep({ ...editStep, description: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editStep.done}
                        onChange={(e) => setEditStep({ ...editStep, done: e.target.checked })}
                        className="h-4 w-4 rounded border-input text-foreground focus-visible:ring-ring"
                      />
                      <span className="text-sm text-foreground">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={saveEditStep}>
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    {isDeleting ? (
                      <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
                        <p className="text-sm">Delete this step?</p>
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
