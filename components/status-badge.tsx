import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { EventStatus } from "@/lib/data"

const styles: Record<EventStatus, string> = {
  Planning: "bg-muted/70 text-muted-foreground border border-border/80 shadow-none",
  Ready: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-none",
  "Needs Attention": "bg-amber-50 text-amber-800 border border-amber-200/60 shadow-none animate-pulse-subtle",
  Completed: "bg-secondary text-secondary-foreground border border-primary/20 shadow-none",
}

export function StatusBadge({ status, className }: { status: EventStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("px-2 py-0.5 rounded-[4px] text-[0.7rem] font-semibold tracking-wide uppercase", styles[status], className)}>
      {status}
    </Badge>
  )
}
