"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export async function addEquipmentLoan(
  eventId: string,
  loan: {
    item: string
    owner_id?: string
    owner_name_fallback?: string
    date_brought: string
    date_returned: string
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("equipment_loans")
    .insert([
      {
        event_id: eventId,
        item: loan.item,
        owner_id: loan.owner_id || null,
        owner_name_fallback: loan.owner_name_fallback || null,
        date_brought: loan.date_brought,
        date_returned: loan.date_returned,
        returned: false,
      },
    ])
    .select()

  if (error) {
    console.error("Error adding equipment loan:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function updateEquipmentLoan(
  eventId: string,
  loanId: string,
  updates: {
    item?: string
    owner_id?: string | null
    owner_name_fallback?: string | null
    date_brought?: string
    date_returned?: string
    returned?: boolean
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("equipment_loans")
    .update(updates)
    .eq("id", loanId)
    .eq("event_id", eventId)
    .select()

  if (error) {
    console.error("Error updating equipment loan:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function deleteEquipmentLoan(eventId: string, loanId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("equipment_loans")
    .delete()
    .eq("id", loanId)
    .eq("event_id", eventId)

  if (error) {
    console.error("Error deleting equipment loan:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
}
