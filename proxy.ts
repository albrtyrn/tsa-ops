// proxy.ts (at the root of your project)
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// ✅ Explicitly export it as 'proxy' so the Next.js 16 engine picks it up
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Safe early return forwarding context
  if (!rawUrl || !supabaseAnonKey) {
    console.error("Supabase environmental keys are missing!")
    return NextResponse.next({
      request: request
    })
  }

  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "")

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || 
                     request.nextUrl.pathname.startsWith("/signup") ||
                     request.nextUrl.pathname.startsWith("/auth/callback")
  
  const isOnboardingPage = request.nextUrl.pathname.startsWith("/onboarding")
  const origin = request.nextUrl.origin

  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", origin))
  }

  if (user) {
    let hasCompletedOnboarding = true
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("onboarded")
        .eq("id", user.id)
        .maybeSingle()

      if (!error && profile && !profile.onboarded) {
        hasCompletedOnboarding = false
      }
    } catch (e) {
      console.warn("Could not check onboarding state, defaulting to true:", e)
    }

    if (!hasCompletedOnboarding && !isOnboardingPage && !isAuthPage) {
      return NextResponse.redirect(new URL("/onboarding", origin))
    }

    if (hasCompletedOnboarding && isOnboardingPage) {
      return NextResponse.redirect(new URL("/", origin))
    }

    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", origin))
    }
  }

  return response
}

// ✅ Keep the matcher block right here in proxy.ts
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}