import Link from "next/link"
import { AlertTriangle, Users, ShoppingCart, UtensilsCrossed, Wallet, ChevronRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { actionItems, type ActionItem } from "@/lib/data"

const typeIcon: Record<ActionItem["type"], typeof Users> = {
  Staffing: Users,
  Shopping: ShoppingCart,
  Menu: UtensilsCrossed,
  Budget: Wallet,
}

export function ActionRequired() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 text-amber-500" />
        <h2 className="text-sm font-semibold text-foreground">Action Required</h2>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          {actionItems.length}
        </span>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {actionItems.map((item) => {
          const Icon = typeIcon[item.type]
          return (
            <Card key={item.id} className="border border-border border-l-4 border-l-amber-500 bg-card shadow-sm hover:shadow-md transition-all">
              <CardContent className="flex flex-col gap-3 py-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600 border border-amber-100">
                    <Icon className="size-4" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold leading-tight text-foreground">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-2 mt-1">
                  <span className="truncate text-xs font-medium text-muted-foreground">{item.eventName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:bg-accent hover:text-primary-foreground"
                    nativeButton={false}
                    render={
                      <Link href={`/events/${item.eventId}`}>
                        Resolve
                        <ChevronRight data-icon="inline-end" />
                      </Link>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
