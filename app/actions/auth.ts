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
  redirect("/")
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
    redirect("/onboarding")
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
  role: "Volunteer" | "Officer" | "Treasurer"
  venmoHandle: string
  vehicleType: "Sedan" | "SUV" | "Minivan" | "Pickup" | "None"
  workspaceMode: "create" | "join"
  workspaceName?: string
  workspaceSlug?: string
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (profileError) {
    throw new Error(`Profile setup failed: ${profileError.message}`)
  }

  // 2. Workspace creation or membership mapping
  if (data.workspaceMode === "create") {
    if (!data.workspaceName || !data.workspaceSlug) {
      throw new Error("Workspace name and slug are required to create a new organization.")
    }

    // Insert workspace row
    const { data: newWorkspace, error: wsError } = await supabase
      .from("workspaces")
      .insert([
        {
          name: data.workspaceName,
          slug: data.workspaceSlug.toLowerCase().trim(),
        },
      ])
      .select()
      .single()

    if (wsError) {
      throw new Error(`Workspace creation failed: ${wsError.message}`)
    }

    // Add user as Admin member of the workspace
    const { error: memberError } = await supabase
      .from("workspace_members")
      .insert([
        {
          workspace_id: newWorkspace.id,
          profile_id: user.id,
          role: "Admin",
        },
      ])

    if (memberError) {
      throw new Error(`Workspace mapping failed: ${memberError.message}`)
    }
  } else {
    // Join mode
    if (!data.workspaceSlug) {
      throw new Error("Workspace slug/code is required to join an existing organization.")
    }

    // Locate the workspace
    const { data: existingWS, error: findError } = await supabase
      .from("workspaces")
      .select("id")
      .eq("slug", data.workspaceSlug.toLowerCase().trim())
      .maybeSingle()

    if (findError || !existingWS) {
      throw new Error("Workspace not found. Check the code/slug and try again.")
    }

    // Add user as Member
    const { error: memberError } = await supabase
      .from("workspace_members")
      .insert([
        {
          workspace_id: existingWS.id,
          profile_id: user.id,
          role: "Member",
        },
      ])

    if (memberError) {
      throw new Error(`Failed to join workspace: ${memberError.message}`)
    }
  }

  revalidatePath("/")
  redirect("/")
}
