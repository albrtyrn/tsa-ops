"use client"

import { useState, useTransition } from "react"
import { Shield, Loader2, Sparkles, User, CreditCard, Car } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { updateProfileAction } from "@/app/actions/auth"

interface SettingsFormProps {
  initialProfile: {
    id: string
    name: string
    role: "Volunteer" | "Officer" | "Treasurer"
    venmo_handle?: string | null
    vehicle_type: "Sedan" | "SUV" | "Minivan" | "Pickup" | "None"
  } | null
}

export function SettingsForm({ initialProfile }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Profile inputs state
  const [name, setName] = useState(initialProfile?.name || "")
  const [role, setRole] = useState<"Volunteer" | "Officer" | "Treasurer">(
    initialProfile?.role || "Volunteer"
  )
  const [venmoHandle, setVenmoHandle] = useState(initialProfile?.venmo_handle || "")
  const [vehicleType, setVehicleType] = useState<"Sedan" | "SUV" | "Minivan" | "Pickup" | "None">(
    initialProfile?.vehicle_type || "None"
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name.trim()) {
      setError("Display name is required.")
      return
    }

    startTransition(async () => {
      try {
        await updateProfileAction({
          name,
          role,
          venmoHandle,
          vehicleType,
        })
        setSuccess("Profile settings updated successfully!")
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("profile-updated"))
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong while updating settings.")
      }
    })
  }

  return (
    <Card className="border border-border bg-card/65 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden hover:border-primary/10 transition-colors">
      <CardHeader className="space-y-1.5 border-b border-border/40 pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <User className="size-5 text-primary" />
          Profile Settings
        </CardTitle>
        <CardDescription>
          Customize your public display profile and volunteer capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3.5 text-xs font-semibold text-destructive animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs font-semibold text-emerald-500 animate-fade-in">
              {success}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Display Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Albert Yorn"
                  required
                  className="h-10 text-sm pl-3"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Organization Role
              </Label>
              <div className="relative">
                <select
                  id="role"
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="h-10 w-full min-w-0 rounded-lg border border-input bg-background/50 px-3 py-1.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
                >
                  <option value="Volunteer">Volunteer</option>
                  <option value="Officer">Officer</option>
                  <option value="Treasurer">Treasurer</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="venmo" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="size-3.5 text-muted-foreground/80" />
                Venmo Handle
              </Label>
              <Input
                id="venmo"
                value={venmoHandle}
                onChange={(e) => setVenmoHandle(e.target.value)}
                placeholder="@albertyorn"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vehicle" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Car className="size-3.5 text-muted-foreground/80" />
                Vehicle Type
              </Label>
              <select
                id="vehicle"
                value={vehicleType}
                onChange={(e: any) => setVehicleType(e.target.value)}
                className="h-10 w-full min-w-0 rounded-lg border border-input bg-background/50 px-3 py-1.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
              >
                <option value="None">None</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Minivan">Minivan</option>
                <option value="Pickup">Pickup</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto h-10 px-6 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving changes...
                </>
              ) : (
                <>
                  Save Changes
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
