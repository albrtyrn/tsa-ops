import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { EventStatus } from "@/lib/data"

const styles: Record<EventStatus, string> = {
  Planning: "border-transparent bg-muted text-muted-foreground",
  Ready: "border-transparent bg-emerald-100 text-emerald-700",
  "Needs Attention": "border-transparent bg-amber-100 text-amber-800",
  Completed: "border-transparent bg-secondary text-secondary-foreground",
}

export function StatusBadge({ status, className }: { status: EventStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn(styles[status], className)}>
      {status}
    </Badge>
  )
}
