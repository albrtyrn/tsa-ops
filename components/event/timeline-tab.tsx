import { Check } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { CulinaryEvent } from "@/lib/data"

export function TimelineTab({ event }: { event: CulinaryEvent }) {
  return (
    <Card>
      <CardContent className="py-2">
        <ol className="flex flex-col">
          {event.timeline.map((step, i) => {
            const last = i === event.timeline.length - 1
            return (
              <li key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                      step.done
                        ? "border-transparent bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {step.done ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  {!last ? <span className="my-1 w-px flex-1 bg-border" /> : null}
                </div>
                <div className={cn("flex flex-col gap-0.5", last ? "pb-1" : "pb-6")}>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {step.marker}
                  </span>
                  <span className="text-sm font-medium">{step.title}</span>
                  <span className="text-sm text-muted-foreground">{step.description}</span>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
