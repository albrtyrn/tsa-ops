"use client"

import { useEffect, useState, useTransition } from "react"
import { Sparkles, Loader2, Home, UserPlus, Shield } from "lucide-react"

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
  const [role, setRole] = useState<"Volunteer" | "Officer" | "Treasurer">("Volunteer")
  const [venmoHandle, setVenmoHandle] = useState("")
  const [vehicleType, setVehicleType] = useState<"Sedan" | "SUV" | "Minivan" | "Pickup" | "None">("None")
  
  // Workspace inputs
  const [workspaceMode, setWorkspaceMode] = useState<"join" | "create">("join")
  const [workspaceName, setWorkspaceName] = useState("")
  const [workspaceSlug, setWorkspaceSlug] = useState("")

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

    if (workspaceMode === "create") {
      if (!workspaceName.trim() || !workspaceSlug.trim()) {
        setError("Workspace name and slug are required to create a new organization.")
        return
      }
      if (!/^[a-z0-9-]+$/.test(workspaceSlug.trim().toLowerCase())) {
        setError("Workspace slug must contain only lowercase letters, numbers, and hyphens.")
        return
      }
    } else {
      if (!workspaceSlug.trim()) {
        setError("Please enter a workspace code or slug to join.")
        return
      }
    }

    startTransition(async () => {
      try {
        await onboardUserAction({
          name,
          role,
          venmoHandle,
          vehicleType,
          workspaceMode,
          workspaceName: workspaceMode === "create" ? workspaceName : undefined,
          workspaceSlug: workspaceSlug,
        })
      } catch (err: any) {
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
            Configure your personal profile and workspace membership
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
                    <option value="Volunteer">Volunteer</option>
                    <option value="Officer">Officer</option>
                    <option value="Treasurer">Treasurer</option>
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

            {/* Workspace Selection Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 pb-1 border-b border-border/40">
                <Home className="size-4 text-primary" />
                Workspace Settings
              </h3>
              
              <div className="flex gap-2 p-1 bg-muted/50 rounded-xl border border-border/40">
                <button
                  type="button"
                  onClick={() => {
                    setWorkspaceMode("join")
                    setError(null)
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    workspaceMode === "join"
                      ? "bg-card text-foreground shadow-sm border border-border/40"
                      : "text-muted-foreground hover:bg-card/20"
                  }`}
                >
                  <UserPlus className="size-3.5" />
                  Join Workspace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWorkspaceMode("create")
                    setError(null)
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    workspaceMode === "create"
                      ? "bg-card text-foreground shadow-sm border border-border/40"
                      : "text-muted-foreground hover:bg-card/20"
                  }`}
                >
                  <Home className="size-3.5" />
                  Create Workspace
                </button>
              </div>

              {workspaceMode === "join" ? (
                <div className="space-y-1.5 animate-fade-in">
                  <Label htmlFor="slug-code">Workspace Code / Slug</Label>
                  <Input
                    id="slug-code"
                    value={workspaceSlug}
                    onChange={(e) => setWorkspaceSlug(e.target.value)}
                    placeholder="tsa-uva"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Enter the slug of the existing workspace you wish to join (e.g. "tsa-uva")
                  </p>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <div className="space-y-1.5">
                    <Label htmlFor="ws-name">Workspace Name</Label>
                    <Input
                      id="ws-name"
                      value={workspaceName}
                      onChange={(e) => {
                        setWorkspaceName(e.target.value)
                        // Auto-generate slug from name
                        setWorkspaceSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "")
                        )
                      }}
                      placeholder="University of Virginia TSA"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ws-slug">Workspace URL Code / Slug</Label>
                    <Input
                      id="ws-slug"
                      value={workspaceSlug}
                      onChange={(e) => setWorkspaceSlug(e.target.value)}
                      placeholder="uva-tsa"
                      required
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Lower case letters, numbers, and hyphens only. Used as join code.
                    </p>
                  </div>
                </div>
              )}
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
