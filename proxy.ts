import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

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

  // Retrieve user session
  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || 
                     request.nextUrl.pathname.startsWith("/signup") ||
                     request.nextUrl.pathname.startsWith("/auth/callback")
  
  const isOnboardingPage = request.nextUrl.pathname.startsWith("/onboarding")

  // Cache the clean origin string for redirects
  const origin = request.nextUrl.origin

  if (!user && !isAuthPage) {
    // ✅ Safe absolute redirect using origin
    return NextResponse.redirect(new URL("/login", origin))
  }

  if (user) {
    // Safe onboarding state check
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
      // ✅ Safe absolute redirect using origin
      return NextResponse.redirect(new URL("/onboarding", origin))
    }

    if (hasCompletedOnboarding && isOnboardingPage) {
      // ✅ Safe absolute redirect using origin
      return NextResponse.redirect(new URL("/", origin))
    }

    if (isAuthPage) {
      // ✅ Safe absolute redirect using origin
      return NextResponse.redirect(new URL("/", origin))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}