"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export type VehicleType = "Sedan" | "SUV" | "Minivan" | "Pickup" | "None"

export interface Driver {
  id: string
  driver_name: string
  contact_info: string
  vehicle_type: VehicleType
  capacity_notes: string
  is_active: boolean
}

export async function fetchAllDrivers(): Promise<Driver[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("transportation")
    .select("*")
    .order("driver_name", { ascending: true })

  if (error) {
    console.error("Error fetching drivers:", error)
    return []
  }

  return data as Driver[]
}

export async function addDriver(driver: {
  driver_name: string
  contact_info: string
  vehicle_type: VehicleType
  capacity_notes: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("transportation")
    .insert([
      {
        driver_name: driver.driver_name,
        contact_info: driver.contact_info,
        vehicle_type: driver.vehicle_type,
        capacity_notes: driver.capacity_notes,
        is_active: true, // defaults to active
      },
    ])
    .select()

  if (error) {
    console.error("Error adding driver:", error)
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/logistics/drivers")
  return data[0] as Driver
}

export async function updateDriverStatus(driverId: string, isActive: boolean) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("transportation")
    .update({ is_active: isActive })
    .eq("id", driverId)
    .select()

  if (error) {
    console.error("Error updating driver status:", error)
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/logistics/drivers")
  return data[0] as Driver
}

export async function updateDriverCapacity(driverId: string, notes: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("transportation")
    .update({ capacity_notes: notes })
    .eq("id", driverId)
    .select()

  if (error) {
    console.error("Error updating driver capacity:", error)
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/logistics/drivers")
  return data[0] as Driver
}
