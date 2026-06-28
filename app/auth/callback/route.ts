import { NextRequest, NextResponse } from "next/server" 
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl 
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
          // ✅ Use requestUrl.origin to safely force a solid absolute URL
          return NextResponse.redirect(new URL("/onboarding", requestUrl.origin))
        }
      } catch (e) {
        console.warn("Callback onboarding check failed:")
      }
    }
  }

  // ✅ Use requestUrl.origin to safely force a solid absolute URL
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}