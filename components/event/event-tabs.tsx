"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { OverviewTab } from "@/components/event/overview-tab"
import { MenuTab } from "@/components/event/menu-tab"
import { StaffingTab } from "@/components/event/staffing-tab"
import { TimelineTab } from "@/components/event/timeline-tab"
import { ShoppingTab } from "@/components/event/shopping-tab"
import { ReflectionTab } from "@/components/event/reflection-tab"
import type { CulinaryEvent } from "@/lib/data"

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "menu", label: "Menu" },
  { value: "staffing", label: "Staffing" },
  { value: "timeline", label: "Timeline" },
  { value: "shopping", label: "Shopping" },
  { value: "reflection", label: "Reflection" },
]

export function EventTabs({ event }: { event: CulinaryEvent }) {
  return (
    <Tabs defaultValue="overview" className="gap-6">
      <div className="overflow-x-auto">
        <TabsList variant="line" className="w-max">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview">
        <OverviewTab event={event} />
      </TabsContent>
      <TabsContent value="menu">
        <MenuTab event={event} />
      </TabsContent>
      <TabsContent value="staffing">
        <StaffingTab event={event} />
      </TabsContent>
      <TabsContent value="timeline">
        <TimelineTab event={event} />
      </TabsContent>
      <TabsContent value="shopping">
        <ShoppingTab event={event} />
      </TabsContent>
      <TabsContent value="reflection">
        <ReflectionTab event={event} />
      </TabsContent>
    </Tabs>
  )
}
