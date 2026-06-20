"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export async function addReimbursement(
  eventId: string,
  reimbursement: {
    buyer_id?: string
    buyer_name_fallback?: string
    purpose: string
    amount: number
    receipt_status: "Uploaded" | "Missing"
  }
) {
  const supabase = await createClient()

  let buyerId = reimbursement.buyer_id || null
  if (!buyerId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      buyerId = user.id
    }
  }

  const { data, error } = await supabase
    .from("reimbursements")
    .insert([
      {
        event_id: eventId,
        buyer_id: buyerId,
        buyer_name_fallback: reimbursement.buyer_name_fallback || null,
        purpose: reimbursement.purpose,
        amount: reimbursement.amount,
        receipt_status: reimbursement.receipt_status,
        status: "Pending Review",
      },
    ])
    .select()

  if (error) {
    console.error("Error adding reimbursement:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function updateReimbursement(
  eventId: string,
  reimbursementId: string,
  updates: {
    buyer_id?: string | null
    buyer_name_fallback?: string | null
    purpose?: string
    amount?: number
    receipt_status?: "Uploaded" | "Missing"
    status?: "Pending Review" | "Approved by Treasurer" | "Venmo Sent"
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("reimbursements")
    .update(updates)
    .eq("id", reimbursementId)
    .eq("event_id", eventId)
    .select()

  if (error) {
    console.error("Error updating reimbursement:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
  return data[0]
}

export async function deleteReimbursement(eventId: string, reimbursementId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("reimbursements")
    .delete()
    .eq("id", reimbursementId)
    .eq("event_id", eventId)

  if (error) {
    console.error("Error deleting reimbursement:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/events/${eventId}`)
}
