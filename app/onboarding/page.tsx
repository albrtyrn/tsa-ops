"use client"

import { useEffect, useState, useTransition } from "react"
import { Sparkles, Loader2, Shield } from "lucide-react"
import { isRedirectError } from "next/dist/client/components/redirect-error"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { onboardUserAction } from "@/app/actions/auth"
import { supabase } from "@/lib/supabase"

export default function OnboardingPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  // Profile inputs
  const [name, setName] = useState("")
  const [role, setRole] = useState<"executive" | "officer" | "culinary" | "advisor" | "volunteer">("volunteer")
  const [venmoHandle, setVenmoHandle] = useState("")
  const [vehicleType, setVehicleType] = useState<"Sedan" | "SUV" | "Minivan" | "Pickup" | "None">("None")
  
  // Fetch initial name from auth metadata
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.name) {
        setName(user.user_metadata.name)
      }
    }
    loadUser()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Display name is required.")
      return
    }

    startTransition(async () => {
      try {
        await onboardUserAction({
          name,
          role,
          venmoHandle,
          vehicleType,
        })
      } catch (err: any) {
        if (isRedirectError(err)) {
          throw err
        }
        setError(err.message || "Something went wrong during onboarding.")
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 bg-radial from-background via-background/95 to-muted/10">
      <Card className="w-full max-w-xl border-border bg-card/65 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden transition-all hover:border-primary/20">
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Onboarding Setup</CardTitle>
          <CardDescription>
            Configure your personal profile details to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3.5 text-xs font-semibold text-destructive animate-shake">
                {error}
              </div>
            )}

            {/* Profile Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 pb-1 border-b border-border/40">
                <Shield className="size-4 text-primary" />
                Profile Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Albert Yorn"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role">Organization Role</Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
                  >
                    <option value="executive">Executive</option>
                    <option value="officer">Officer</option>
                    <option value="culinary">Culinary</option>
                    <option value="advisor">Advisor</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="venmo">Venmo Handle (Optional)</Label>
                  <Input
                    id="venmo"
                    value={venmoHandle}
                    onChange={(e) => setVenmoHandle(e.target.value)}
                    placeholder="@albertyorn"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vehicle">Vehicle (for grocery runs)</Label>
                  <select
                    id="vehicle"
                    value={vehicleType}
                    onChange={(e: any) => setVehicleType(e.target.value)}
                    className="h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
                  >
                    <option value="None">None</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Minivan">Minivan</option>
                    <option value="Pickup">Pickup</option>
                  </select>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-10 mt-6 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Completing setup...
                </>
              ) : (
                <>
                  Complete Setup
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
