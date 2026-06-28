"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export interface StaffResource {
  id: string
  facility_name: string
  resource_type: string
  capacity: string // e.g. "70% Full", "Empty"
  notes: string // e.g. "Custodian: Albert Y."
  last_updated: string
}

export interface InventoryItem {
  id: string
  item_name: string
  category: string
  quantity_on_hand: number
  storage_location: string // e.g. "Albert Y. (Apartment)"
  last_updated: string
}

// Fetch all Storage Environments
export async function fetchAllStaffResources(): Promise<StaffResource[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("staff_resources")
    .select("*")
    .order("facility_name", { ascending: true })

  if (error) {
    console.error("Error fetching staff resources:")
    return []
  }

  return data as StaffResource[]
}

// Update a Storage Environment (Capacity or Notes/Custodian)
export async function updateStaffResource(
  id: string,
  updates: {
    capacity?: string
    notes?: string
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("staff_resources")
    .update({
      ...updates,
      last_updated: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating staff resource:")
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/logistics/inventory")
  return data[0] as StaffResource
}

// Fetch all Inventory Items
export async function fetchAllInventoryItems(): Promise<InventoryItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .order("item_name", { ascending: true })

  if (error) {
    console.error("Error fetching inventory items:")
    return []
  }

  return data as InventoryItem[]
}

// Update or Create an Inventory Item (Assign Custody)
export async function assignInventoryCustody(item: {
  id?: string // if updating existing
  item_name: string
  category: string
  quantity_on_hand: number
  storage_location: string
}) {
  const supabase = await createClient()

  let resultData

  if (item.id) {
    // Update existing item
    const { data, error } = await supabase
      .from("inventory")
      .update({
        quantity_on_hand: item.quantity_on_hand,
        storage_location: item.storage_location,
        last_updated: new Date().toISOString(),
      })
      .eq("id", item.id)
      .select()

    if (error) {
      console.error("Error updating inventory custody:")
      throw new Error(error.message)
    }
    resultData = data[0]
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from("inventory")
      .insert([
        {
          item_name: item.item_name,
          category: item.category || "General",
          quantity_on_hand: item.quantity_on_hand,
          storage_location: item.storage_location,
          last_updated: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Error inserting inventory custody:")
      throw new Error(error.message)
    }
    resultData = data[0]
  }

  revalidatePath("/dashboard/logistics/inventory")
  return resultData as InventoryItem
}

// Quick initialize seed helper to populate sample environments if database is empty
export async function seedInitialResourcesIfEmpty() {
  const supabase = await createClient()

  const { count, error: countError } = await supabase
    .from("staff_resources")
    .select("*", { count: "exact", head: true })

  if (!countError && count === 0) {
    const sampleResources = [
      { facility_name: "Albert's Apartment Fridge", resource_type: "Fridge", capacity: "70% Full", notes: "Custodian: Albert Y." },
      { facility_name: "Culinary Lounge Locker A", resource_type: "Dry Locker", capacity: "25% Full", notes: "Custodian: Bryan L. (Culinary Chair)" },
      { facility_name: "Student Center Cold Room Fridge 2", resource_type: "Walk-in Fridge", capacity: "Empty", notes: "Shared Student Facility" },
      { facility_name: "Executive Treasurer Closet", resource_type: "Cabinet Lock", capacity: "90% Full", notes: "Custodian: Tiffany K." },
    ]

    await supabase.from("staff_resources").insert(sampleResources)
  }
}
