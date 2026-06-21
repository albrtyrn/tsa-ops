"use server"

import { fetchAllDrivers } from "@/app/actions/drivers"
import DriversVaultClient from "./drivers-client"

export default async function DriversPage() {
  const initialDrivers = await fetchAllDrivers()

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <DriversVaultClient initialDrivers={initialDrivers} />
    </main>
  )
}
