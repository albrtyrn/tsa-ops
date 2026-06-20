import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
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

  if (!user && !isAuthPage) {
    // Redirect to login if trying to access a protected route
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user) {
    // Safe onboarding state check: check if the user belongs to any workspace
    let hasCompletedOnboarding = true
    try {
      const { data: member, error } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("profile_id", user.id)
        .limit(1)
        .maybeSingle()

      if (!error && !member) {
        hasCompletedOnboarding = false
      }
    } catch (e) {
      console.warn("Could not check onboarding state, defaulting to true:", e)
    }

    if (!hasCompletedOnboarding && !isOnboardingPage && !isAuthPage) {
      // Redirect un-onboarded user to onboarding page
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }

    if (hasCompletedOnboarding && isOnboardingPage) {
      // Already onboarded, redirect away from onboarding
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (isAuthPage) {
      // Redirect logged-in users away from login/signup pages
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any images or logos
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
