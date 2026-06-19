"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { CulinaryEvent } from "@/lib/data"

const reimbursementOptions = [
  "Pending Review",
  "Approved by Treasurer",
  "Venmo Sent",
] as const

export function ReimbursementsTab({ event }: { event: CulinaryEvent }) {
  const [status, setStatus] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const entry of event.reimbursements) {
      initial[entry.id] = entry.status
    }
    return initial
  })

  return (
    <div className="grid gap-4">
      {event.reimbursements.map((entry) => (
        <Card key={entry.id}>
          <CardHeader>
            <CardTitle className="text-sm">{entry.buyer}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-1 text-sm">
              <p>{entry.purpose}</p>
              <p className="text-muted-foreground">${entry.amount.toFixed(2)} • Receipt: {entry.receiptStatus}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <Label htmlFor={`status-${entry.id}`} className="text-sm">
                Status
              </Label>
              <select
                id={`status-${entry.id}`}
                value={status[entry.id]}
                onChange={(event) =>
                  setStatus((prev) => ({ ...prev, [entry.id]: event.target.value }))
                }
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
      ))}
      {event.reimbursements.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Reimbursement Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No reimbursement entries are currently logged.</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
