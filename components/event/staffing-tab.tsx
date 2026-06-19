import { Check, CircleDashed } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { CulinaryEvent } from "@/lib/data"

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean)
  if (parts[0] === "Open") return "?"
  return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase()
}

export function StaffingTab({ event }: { event: CulinaryEvent }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {event.staffing.map((group) => {
        const confirmed = group.members.filter((m) => m.confirmed).length
        return (
          <Card key={group.team}>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-sm">{group.team}</CardTitle>
              <span className="text-xs text-muted-foreground tabular-nums">
                {confirmed}/{group.members.length} confirmed
              </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {group.members.map((member, i) => (
                <div key={member.id} className="flex flex-col gap-3">
                  {i > 0 ? <Separator /> : null}
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback>{initials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col leading-tight">
                      <span className="text-sm font-medium">{member.name}</span>
                      <span className="text-xs text-muted-foreground">{member.role}</span>
                    </div>
                    {member.confirmed ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600">
                        <Check className="size-3.5" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600">
                        <CircleDashed className="size-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
