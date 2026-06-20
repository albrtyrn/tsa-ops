"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    throw new Error("Email and password are required.")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/")
  return { success: true }
}

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password || !name) {
    throw new Error("All fields are required.")
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  // If a session is returned, the user is auto-confirmed/logged in
  if (data.session) {
    revalidatePath("/")
    return { success: true, redirectUrl: "/onboarding" }
  }

  // Otherwise, email confirmation is required
  return {
    needsConfirmation: true,
    message: "Account created successfully! Please check your email to confirm your registration before signing in.",
  }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/login")
}

export async function onboardUserAction(data: {
  name: string
  role: "executive" | "officer" | "culinary" | "advisor" | "volunteer"
  venmoHandle: string
  vehicleType: "Sedan" | "SUV" | "Minivan" | "Pickup" | "None"
}) {
  const supabase = await createClient()
  
  // Retrieve the logged-in user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("User session not found.")
  }

  // 1. Update the user's profile details
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      name: data.name,
      role: data.role,
      venmo_handle: data.venmoHandle || null,
      vehicle_type: data.vehicleType,
      onboarded: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (profileError) {
    throw new Error(`Profile setup failed: ${profileError.message}`)
  }

  // Sync details to Auth metadata
  await supabase.auth.updateUser({
    data: {
      name: data.name,
      role: data.role,
    },
  })

  revalidatePath("/")
  redirect("/")
}

export async function updateProfileAction(data: {
  name: string
  role: "executive" | "officer" | "culinary" | "advisor" | "volunteer"
  venmoHandle: string
  vehicleType: "Sedan" | "SUV" | "Minivan" | "Pickup" | "None"
}) {
  const supabase = await createClient()
  
  // Retrieve the logged-in user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("User session not found.")
  }

  // Update profile details
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      name: data.name,
      role: data.role,
      venmo_handle: data.venmoHandle || null,
      vehicle_type: data.vehicleType,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (profileError) {
    throw new Error(`Failed to update profile: ${profileError.message}`)
  }

  // Sync details to Auth metadata
  await supabase.auth.updateUser({
    data: {
      name: data.name,
      role: data.role,
    },
  })

  revalidatePath("/")
  revalidatePath("/settings")
  return { success: true }
}
