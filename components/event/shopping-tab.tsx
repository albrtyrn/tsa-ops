"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { CulinaryEvent } from "@/lib/data"

export function ShoppingTab({ event }: { event: CulinaryEvent }) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const group of event.shopping) {
      for (const item of group.items) initial[item.id] = item.checked
    }
    return initial
  })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {event.shopping.map((group) => {
        const done = group.items.filter((it) => checked[it.id]).length
        return (
          <Card key={group.category}>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-sm">{group.category}</CardTitle>
              <span className="text-xs text-muted-foreground tabular-nums">
                {done}/{group.items.length}
              </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {group.items.map((item, i) => {
                const isChecked = checked[item.id]
                return (
                  <div key={item.id} className="flex flex-col gap-3">
                    {i > 0 ? <Separator /> : null}
                    <label className="flex cursor-pointer items-center gap-3">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(value) =>
                          setChecked((prev) => ({ ...prev, [item.id]: value === true }))
                        }
                      />
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          isChecked && "text-muted-foreground line-through",
                        )}
                      >
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {item.quantity}
                      </span>
                    </label>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
