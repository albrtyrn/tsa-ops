"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { CulinaryEvent } from "@/lib/data"

const reimbursementOptions = [
  "Pending Review",
  "Approved by Treasurer",
  "Venmo Sent",
] as const

export function ShoppingTab({ event }: { event: CulinaryEvent }) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const group of event.shopping) {
      for (const item of group.items) initial[item.id] = item.checked
    }
    return initial
  })

  const [returned, setReturned] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const item of event.equipmentLoans) {
      initial[item.id] = item.returned
    }
    return initial
  })

  const [reimbursementStatus, setReimbursementStatus] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const entry of event.reimbursements) {
      initial[entry.id] = entry.status
    }
    return initial
  })

  return (
    <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
      <div className="grid gap-4">
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
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Grocery Run Logistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.groceryRuns.map((run) => (
              <div key={run.id} className="rounded-lg border border-border bg-background/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{run.driver}</p>
                    <p className="text-xs text-muted-foreground">{run.vehicle} • {run.destination}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {run.status}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Departure</span>
                    <span>{run.departure}</span>
                  </div>
                </div>
              </div>
            ))}
            {event.groceryRuns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No grocery runs are currently scheduled for this event.</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Equipment Sharing Tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.equipmentLoans.map((loan) => (
              <div key={loan.id} className="space-y-3 rounded-lg border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{loan.item}</p>
                    <p className="text-xs text-muted-foreground">Borrowed from {loan.owner}</p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                    <Checkbox
                      checked={returned[loan.id]}
                      onCheckedChange={(value) =>
                        setReturned((prev) => ({ ...prev, [loan.id]: value === true }))
                      }
                    />
                    Returned
                  </label>
                </div>
                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <div className="rounded-md bg-muted/50 p-2">Brought: {loan.dateBrought}</div>
                  <div className="rounded-md bg-muted/50 p-2">Return by: {loan.dateReturned}</div>
                </div>
              </div>
            ))}
            {event.equipmentLoans.length === 0 ? (
              <p className="text-sm text-muted-foreground">No borrowed equipment is listed for this event.</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Reimbursement Ledger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-xs text-muted-foreground sm:grid-cols-[1.2fr_1fr_0.8fr]">
              <span>Buyer</span>
              <span>Item / Purpose</span>
              <span>Status</span>
            </div>
            <div className="space-y-3">
              {event.reimbursements.map((entry) => (
                <div key={entry.id} className="grid gap-3 rounded-lg border border-border bg-background/60 p-4 text-sm sm:grid-cols-[1.2fr_1fr_0.8fr]">
                  <div className="space-y-1">
                    <p className="font-medium">{entry.buyer}</p>
                    <p className="text-xs text-muted-foreground">${entry.amount.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p>{entry.purpose}</p>
                    <p className="text-xs text-muted-foreground">Receipt: {entry.receiptStatus}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`status-${entry.id}`} className="sr-only">
                      Reimbursement status
                    </Label>
                    <select
                      id={`status-${entry.id}`}
                      value={reimbursementStatus[entry.id]}
                      onChange={(event) =>
                        setReimbursementStatus((prev) => ({
                          ...prev,
                          [entry.id]: event.target.value,
                        }))
                      }
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {reimbursementOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
