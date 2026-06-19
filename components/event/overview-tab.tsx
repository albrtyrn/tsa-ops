import { Sparkles } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CulinaryEvent } from "@/lib/data"

export function OverviewTab({ event }: { event: CulinaryEvent }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="size-4 text-foreground" />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {event.summary}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Readiness</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {event.readiness.map((r) => (
            <div key={r.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-medium tabular-nums">{r.value}%</span>
              </div>
              <Progress value={r.value} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
