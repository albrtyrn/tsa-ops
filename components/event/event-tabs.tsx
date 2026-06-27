"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { OverviewTab } from "@/components/event/overview-tab"
import { MenuTab } from "@/components/event/menu-tab"
import { StaffingTab } from "@/components/event/staffing-tab"
import { TimelineTab } from "@/components/event/timeline-tab"
import { ShoppingTab } from "@/components/event/shopping-tab"
import { EquipmentTab } from "@/components/event/equipment-tab"
import { ReimbursementsTab } from "@/components/event/reimbursements-tab"
import { ReflectionTab } from "@/components/event/reflection-tab"
import type { CulinaryEvent } from "@/lib/data"

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "menu", label: "Menu" },
  { value: "staffing", label: "Staffing" },
  { value: "timeline", label: "Timeline" },
  { value: "shopping", label: "Shopping" },
  { value: "equipment", label: "Equipment" },
  { value: "reimbursements", label: "Reimbursements" },
  { value: "reflection", label: "Reflection" },
]

const tabTransition = {
  initial: { y: 15, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.3, ease: "easeOut" as const }
}

export function EventTabs({ event }: { event: CulinaryEvent }) {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground py-8">Loading workspace...</div>}>
      <EventTabsContent event={event} />
    </Suspense>
  )
}

function EventTabsContent({ event }: { event: CulinaryEvent }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const tabParam = searchParams.get("tab")
  const defaultTab = tabParam && tabs.some((t) => t.value === tabParam) ? tabParam : "overview"

  const [activeTab, setActiveTab] = useState(defaultTab)

  useEffect(() => {
    if (tabParam && tabs.some((t) => t.value === tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-6">
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
        <motion.div {...tabTransition}>
          <OverviewTab event={event} />
        </motion.div>
      </TabsContent>
      <TabsContent value="menu">
        <motion.div {...tabTransition}>
          <MenuTab event={event} />
        </motion.div>
      </TabsContent>
      <TabsContent value="staffing">
        <motion.div {...tabTransition}>
          <StaffingTab event={event} />
        </motion.div>
      </TabsContent>
      <TabsContent value="timeline">
        <motion.div {...tabTransition}>
          <TimelineTab event={event} />
        </motion.div>
      </TabsContent>
      <TabsContent value="shopping">
        <motion.div {...tabTransition}>
          <ShoppingTab event={event} />
        </motion.div>
      </TabsContent>
      <TabsContent value="equipment">
        <motion.div {...tabTransition}>
          <EquipmentTab event={event} />
        </motion.div>
      </TabsContent>
      <TabsContent value="reimbursements">
        <motion.div {...tabTransition}>
          <ReimbursementsTab event={event} />
        </motion.div>
      </TabsContent>
      <TabsContent value="reflection">
        <motion.div {...tabTransition}>
          <ReflectionTab event={event} />
        </motion.div>
      </TabsContent>
    </Tabs>
  )
}
