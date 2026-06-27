import { createBrowserClient } from "@supabase/ssr"

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!rawUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing.")
}

const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "")

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
