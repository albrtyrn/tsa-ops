"use client"

import { useState } from "react"
import { Sparkles, Lightbulb } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import type { CulinaryEvent } from "@/lib/data"
import { updateEventReflection } from "@/app/actions/events"

export function ReflectionTab({ event }: { event: CulinaryEvent }) {
  const [whatWorked, setWhatWorked] = useState(event.reflection.whatWorked)
  const [whatFailed, setWhatFailed] = useState(event.reflection.whatFailed)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateEventReflection(event.id, { whatWorked, whatFailed })
    } catch (err) {
      console.error("Failed to save reflection:", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Post-Event Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="what-worked">What worked?</FieldLabel>
              <Textarea
                id="what-worked"
                rows={4}
                placeholder="Note the wins and what to repeat next time..."
                value={whatWorked}
                onChange={(e) => setWhatWorked(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="what-failed">What failed?</FieldLabel>
              <Textarea
                id="what-failed"
                rows={4}
                placeholder="Note blockers, shortfalls, and surprises..."
                value={whatFailed}
                onChange={(e) => setWhatFailed(e.target.value)}
              />
            </Field>
            <div className="flex justify-end">
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save reflection"}
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="size-4" />
            Lessons Learned
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {event.lessons.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Lightbulb />
                </EmptyMedia>
                <EmptyTitle>No lessons yet</EmptyTitle>
                <EmptyDescription>
                  Lessons are generated from your reflection notes once the event is completed.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            event.lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-lg border bg-muted/40 p-3">
                <p className="text-sm font-medium">{lesson.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{lesson.body}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
