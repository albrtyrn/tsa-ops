"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { CulinaryEvent } from "@/lib/data"

export function EquipmentTab({ event }: { event: CulinaryEvent }) {
  const [returned, setReturned] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const loan of event.equipmentLoans) {
      initial[loan.id] = loan.returned
    }
    return initial
  })

  return (
    <div className="grid gap-4">
      {event.equipmentLoans.map((loan) => (
        <Card key={loan.id}>
          <CardHeader>
            <CardTitle className="text-sm">{loan.item}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2 text-sm">
              <p className="text-muted-foreground">Borrowed from {loan.owner}</p>
              <p className="text-muted-foreground">Brought {loan.dateBrought}</p>
              <p className="text-muted-foreground">Due back by {loan.dateReturned}</p>
            </div>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
              <Checkbox
                checked={returned[loan.id]}
                onCheckedChange={(value) =>
                  setReturned((prev) => ({ ...prev, [loan.id]: value === true }))
                }
              />
              Returned
            </label>
          </CardContent>
        </Card>
      ))}
      {event.equipmentLoans.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Equipment Sharing Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No borrowed equipment is listed for this event.</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
