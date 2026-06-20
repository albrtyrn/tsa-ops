import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {
      // Check onboarding state
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarded")
          .eq("id", user.id)
          .maybeSingle()

        if (!profile || !profile.onboarded) {
          // If not onboarded, redirect to onboarding
          return NextResponse.redirect(new URL("/onboarding", request.url))
        }
      } catch (e) {
        console.warn("Callback onboarding check failed:", e)
      }
    }
  }

  // URL to redirect to after successful sign in process
  return NextResponse.redirect(new URL("/", request.url))
}
