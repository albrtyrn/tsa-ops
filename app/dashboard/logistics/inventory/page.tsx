"use server"

import { 
  fetchAllStaffResources, 
  fetchAllInventoryItems, 
  seedInitialResourcesIfEmpty 
} from "@/app/actions/logistics"
import InventoryVaultClient from "./inventory-client"

export default async function InventoryPage() {
  // Ensure sample storage resources exist if the table is currently empty
  await seedInitialResourcesIfEmpty()

  const resources = await fetchAllStaffResources()
  const items = await fetchAllInventoryItems()

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <InventoryVaultClient initialResources={resources} initialItems={items} />
    </main>
  )
}
