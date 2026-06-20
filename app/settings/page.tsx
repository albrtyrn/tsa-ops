import { createClient } from "@/lib/supabase-server"
import { SettingsForm } from "@/components/settings/settings-form"
import { PageHeader } from "@/components/page-header"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  let profile = null
  
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()
      profile = data
    }
  } catch (e) {
    console.warn("Failed to fetch user profile for settings page, using empty default:", e)
  }

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <PageHeader
        title="Settings"
        description="Manage your profile settings and operations configuration."
      />
      <div className="max-w-3xl">
        <SettingsForm initialProfile={profile} />
      </div>
    </main>
  )
}
