import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CulinaryEvent } from "@/lib/data"

export function MenuTab({ event }: { event: CulinaryEvent }) {
  const total = event.menu.reduce((acc, d) => acc + d.estimatedCost, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{event.menu.length} dishes planned</p>
        <p className="text-sm font-medium">
          Estimated food cost: <span className="tabular-nums">${total.toLocaleString()}</span>
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {event.menu.map((dish) => (
          <Card key={dish.id}>
            <CardContent className="flex flex-col gap-3 py-1">
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium leading-tight">{dish.name}</span>
                <Badge variant="secondary">{dish.category}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{dish.servings} servings</span>
                <span className="font-medium tabular-nums">${dish.estimatedCost.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
