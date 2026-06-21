import { createBrowserClient } from "@supabase/ssr"

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!rawUrl || !supabaseAnonKey) {
  // Graceful fallback for build steps or missing env values
  console.warn("Supabase credentials missing. Please check your .env.local configuration.")
}

const supabaseUrl = rawUrl ? rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "") : undefined

export const supabase = createBrowserClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key"
)
