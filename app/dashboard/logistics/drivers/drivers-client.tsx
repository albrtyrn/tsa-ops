"use client"

import * as React from "react"
import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Search, 
  Edit2, 
  Check, 
  X, 
  Loader2, 
  Phone, 
  Car,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet"
import { PageHeader } from "@/components/page-header"

import { Driver, VehicleType, addDriver, updateDriverStatus, updateDriverCapacity } from "@/app/actions/drivers"
import { cn } from "@/lib/utils"

interface DriversVaultClientProps {
  initialDrivers: Driver[]
}

export default function DriversVaultClient({ initialDrivers }: DriversVaultClientProps) {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers)
  const [searchQuery, setSearchQuery] = useState("")

  // Add Form State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newContact, setNewContact] = useState("")
  const [newVehicle, setNewVehicle] = useState<VehicleType>("Sedan")
  const [newCapacity, setNewCapacity] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isAdding, startAddTransition] = useTransition()

  // Inline Editing State for Capacity Notes
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingCapacity, setEditingCapacity] = useState("")
  const [isSavingCapacity, startCapacityTransition] = useTransition()

  // Filter drivers based on search
  const filteredDrivers = drivers.filter((driver) => {
    return (
      driver.driver_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.vehicle_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.capacity_notes.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Format vehicle type badge
  const getVehicleBadge = (vehicle: VehicleType) => {
    switch (vehicle) {
      case "SUV":
        return <Badge className="bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400 font-semibold">SUV</Badge>
      case "Minivan":
        return <Badge className="bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold">Minivan</Badge>
      case "Pickup":
        return <Badge className="bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold">Pickup</Badge>
      case "Sedan":
        return <Badge className="bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold">Sedan</Badge>
      default:
        return <Badge className="bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400 font-semibold">None</Badge>
    }
  }

  // Handle Add Volunteer Submit
  const handleAddDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!newName.trim()) {
      setFormError("Driver name is required.")
      return
    }

    if (!newContact.trim()) {
      setFormError("Contact info is required (phone or email).")
      return
    }

    startAddTransition(async () => {
      try {
        const added = await addDriver({
          driver_name: newName.trim(),
          contact_info: newContact.trim(),
          vehicle_type: newVehicle,
          capacity_notes: newCapacity.trim()
        })
        setDrivers((prev) => [...prev, added].sort((a, b) => a.driver_name.localeCompare(b.driver_name)))
        
        // Reset states
        setNewName("")
        setNewContact("")
        setNewVehicle("Sedan")
        setNewCapacity("")
        setIsAddOpen(false)
      } catch (err: any) {
        setFormError(err.message || "Failed to add driver. Please try again.")
      }
    })
  }

  // Handle Status Toggle
  const handleToggleStatus = async (driverId: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setDrivers((prev) =>
        prev.map((d) => (d.id === driverId ? { ...d, is_active: currentStatus } : d))
      )
      
      await updateDriverStatus(driverId, currentStatus)
    } catch (err) {
      console.error("Failed to update driver status:", err)
      // Rollback on error
      setDrivers((prev) =>
        prev.map((d) => (d.id === driverId ? { ...d, is_active: !currentStatus } : d))
      )
    }
  }

  // Start Editing Capacity Notes
  const startEditing = (driver: Driver) => {
    setEditingId(driver.id)
    setEditingCapacity(driver.capacity_notes)
  }

  // Cancel Editing
  const cancelEditing = () => {
    setEditingId(null)
    setEditingCapacity("")
  }

  // Save Capacity Notes
  const saveCapacity = (driverId: string) => {
    if (isSavingCapacity) return

    startCapacityTransition(async () => {
      try {
        const updated = await updateDriverCapacity(driverId, editingCapacity.trim())
        setDrivers((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d))
        )
        setEditingId(null)
      } catch (err) {
        console.error("Failed to save driver capacity:", err)
      }
    })
  }

  return (
    <>
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Volunteer Drivers Ledger"
          description="Manage vehicle roster, driver status toggles, and cargo transport capacities."
          actions={
            <Button 
              onClick={() => {
                setFormError(null)
                setIsAddOpen(true)
              }}
              className="gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              Add Volunteer Driver
            </Button>
          }
        />
      </div>

      {/* Search Filter bar */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search drivers, vehicles, capacity..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 border-border bg-card/50"
        />
      </div>

      {/* Driver Data Table Card */}
      <Card className="border-border bg-card/65 backdrop-blur-md shadow-sm rounded-2xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4">Driver Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Vehicle Type</th>
                <th className="px-6 py-4">Capacity Notes</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Car className="h-8 w-8 text-muted-foreground/60 mb-2" />
                      <p className="font-semibold text-sm">No drivers logged</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Filter criteria matched 0 drivers or no volunteers are logged.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr 
                    key={driver.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    {/* Name */}
                    <td className="px-6 py-4 font-bold text-foreground">
                      {driver.driver_name}
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground/75" />
                        {driver.contact_info}
                      </span>
                    </td>

                    {/* Vehicle */}
                    <td className="px-6 py-4">
                      {getVehicleBadge(driver.vehicle_type)}
                    </td>

                    {/* Capacity Notes Inline Edit */}
                    <td className="px-6 py-4">
                      {editingId === driver.id ? (
                        <div className="flex items-center gap-2 max-w-sm">
                          <Input
                            value={editingCapacity}
                            onChange={(e) => setEditingCapacity(e.target.value)}
                            disabled={isSavingCapacity}
                            className="h-8 text-xs bg-card"
                            placeholder="e.g. 4 boxes, SUV boot"
                          />
                          <button
                            onClick={() => saveCapacity(driver.id)}
                            disabled={isSavingCapacity}
                            className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 text-emerald-600 transition-colors cursor-pointer"
                            title="Save"
                          >
                            {isSavingCapacity ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </button>
                          <button
                            onClick={cancelEditing}
                            disabled={isSavingCapacity}
                            className="p-1 rounded-md bg-destructive/10 border border-destructive/25 hover:bg-destructive/20 text-destructive transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="flex items-center gap-2 group/edit cursor-pointer py-1"
                          onClick={() => startEditing(driver)}
                        >
                          <span className="text-muted-foreground text-xs leading-relaxed max-w-[280px] truncate">
                            {driver.capacity_notes || <em className="text-muted-foreground/50">No notes</em>}
                          </span>
                          <Edit2 className="h-3 w-3 text-muted-foreground/0 group-hover/edit:text-muted-foreground/60 transition-all ml-1 shrink-0" />
                        </div>
                      )}
                    </td>

                    {/* Status Toggle Switch */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {driver.is_active ? (
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider hidden sm:inline">Active</span>
                        ) : (
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:inline">Inactive</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(driver.id, !driver.is_active)}
                          className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20",
                            driver.is_active ? "bg-emerald-500" : "bg-muted-foreground/20"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-card shadow-md transition duration-200 ease-in-out",
                              driver.is_active ? "translate-x-4" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DRAWER: ADD VOLUNTEER DRIVER */}
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent className="w-full sm:max-w-md border-l border-border bg-card/95 backdrop-blur-lg flex flex-col h-full overflow-hidden">
          <SheetHeader className="pb-4 border-b border-border/55">
            <SheetTitle className="text-xl font-bold">Add Volunteer Driver</SheetTitle>
            <SheetDescription className="text-xs">
              Log a new driver into the organizational transportation roster.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleAddDriverSubmit} className="flex-1 flex flex-col justify-between py-4 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="driver-name" className="text-xs font-bold">Full Name</Label>
                <Input
                  id="driver-name"
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-10 bg-card"
                  required
                />
              </div>

              {/* Contact detail */}
              <div className="space-y-1.5">
                <Label htmlFor="contact-detail" className="text-xs font-bold">Contact Detail</Label>
                <Input
                  id="contact-detail"
                  placeholder="e.g. (434) 555-0199 or email@domain.com"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="h-10 bg-card"
                  required
                />
              </div>

              {/* Vehicle Type */}
              <div className="space-y-1.5">
                <Label htmlFor="vehicle-type" className="text-xs font-bold">Vehicle Type</Label>
                <div className="relative">
                  <select
                    id="vehicle-type"
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value as VehicleType)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Minivan">Minivan</option>
                    <option value="Pickup">Pickup</option>
                    <option value="None">None</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 pointer-events-none text-muted-foreground" />
                </div>
              </div>

              {/* Capacity Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="capacity-notes" className="text-xs font-bold">Cargo Capacity Notes</Label>
                <Input
                  id="capacity-notes"
                  placeholder="e.g. Seats 4, Large trunk space, Cooler space"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="h-10 bg-card"
                />
              </div>
            </div>

            {/* Error & Submit Footer */}
            <div className="pt-4 border-t border-border/55 mt-auto space-y-3">
              {formError && (
                <div className="text-xs font-semibold text-destructive flex items-center gap-1 bg-destructive/5 border border-destructive/10 p-2.5 rounded-lg">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {formError}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isAdding}
                className="w-full cursor-pointer h-10 text-sm font-semibold"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registering Driver...
                  </>
                ) : (
                  "Create Driver Profile"
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
