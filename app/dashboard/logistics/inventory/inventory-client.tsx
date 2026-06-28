"use client"
import { Badge } from "@/components/ui/badge"

import * as React from "react"
import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Search, 
  Loader2, 
  Check, 
  X, 
  FileSpreadsheet, 
  ExternalLink, 
  Package, 
  Database,
  Building,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { PageHeader } from "@/components/page-header"

import { 
  StaffResource, 
  InventoryItem, 
  updateStaffResource, 
  assignInventoryCustody 
} from "@/app/actions/logistics"
import { cn } from "@/lib/utils"

interface InventoryVaultClientProps {
  initialResources: StaffResource[]
  initialItems: InventoryItem[]
}

export default function InventoryVaultClient({ 
  initialResources, 
  initialItems 
}: InventoryVaultClientProps) {
  const [resources, setResources] = useState<StaffResource[]>(initialResources)
  const [items, setItems] = useState<InventoryItem[]>(initialItems)

  // UI States
  const [isEmbedOpen, setIsEmbedOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Inline Saving Status Matrix
  const [savingState, setSavingState] = useState<Record<string, "idle" | "saving" | "saved">>({})

  // Form State: Assign Custody
  const [selectedItemId, setSelectedItemId] = useState<string>("new")
  const [itemName, setItemName] = useState("")
  const [itemCategory, setItemCategory] = useState("Bulk Ingredient")
  const [quantity, setQuantity] = useState<number>(0)
  const [storageLocation, setStorageLocation] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [isSubmitting, startSubmitTransition] = useTransition()

  // Google Sheet URL from event config
  const legacySpreadsheetUrl = "https://docs.google.com/spreadsheets/d/1t6b_HqpR9P-Z7d-Z8T8xL6r4nF4f15d-G7m4uX_z6_o/edit"
  // Embeddable read-only grid view URL
  const spreadsheetEmbedUrl = "https://docs.google.com/spreadsheets/d/1t6b_HqpR9P-Z7d-Z8T8xL6r4nF4f15d-G7m4uX_z6_o/pubhtml?widget=true&headers=false"

  // Extract percentage from capacity string (e.g. "70% Full", "Empty", "Full")
  const getCapacityPercent = (capacity: string) => {
    const cleanCap = capacity.toLowerCase().trim()
    if (cleanCap === "empty") return 0
    if (cleanCap === "full") return 100
    const match = capacity.match(/\d+/)
    return match ? Math.min(100, Math.max(0, parseInt(match[0], 10))) : 50
  }

  // Handle Inline Update of Storage Environment (notes or capacity)
  const handleResourceUpdate = async (
    resourceId: string, 
    fields: { capacity?: string; notes?: string }
  ) => {
    setSavingState((prev) => ({ ...prev, [resourceId]: "saving" }))
    try {
      const updated = await updateStaffResource(resourceId, fields)
      
      // Update local state list
      setResources((prev) =>
        prev.map((r) => (r.id === resourceId ? updated : r))
      )
      
      setSavingState((prev) => ({ ...prev, [resourceId]: "saved" }))
      setTimeout(() => {
        setSavingState((prev) => ({ ...prev, [resourceId]: "idle" }))
      }, 2000)
    } catch (err) {
      console.error("Failed to update facility resource:")
      setSavingState((prev) => ({ ...prev, [resourceId]: "idle" }))
    }
  }

  // Handle Form Selector Change
  const handleItemSelectChange = (id: string) => {
    setSelectedItemId(id)
    setFormError(null)
    setFormSuccess(null)

    if (id === "new") {
      setItemName("")
      setItemCategory("Bulk Ingredient")
      setQuantity(0)
      setStorageLocation("")
    } else {
      const selected = items.find((item) => item.id === id)
      if (selected) {
        setItemName(selected.item_name)
        setItemCategory(selected.category)
        setQuantity(selected.quantity_on_hand)
        setStorageLocation(selected.storage_location)
      }
    }
  }

  // Handle Assign Custody Submit
  const handleAssignCustodySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)

    if (!itemName.trim()) {
      setFormError("Item name is required.")
      return
    }

    if (quantity < 0) {
      setFormError("Quantity on hand must be 0 or higher.")
      return
    }

    if (!storageLocation.trim()) {
      setFormError("Storage custody location is required.")
      return
    }

    startSubmitTransition(async () => {
      try {
        const payload = {
          id: selectedItemId === "new" ? undefined : selectedItemId,
          item_name: itemName.trim(),
          category: itemCategory.trim() || "General",
          quantity_on_hand: quantity,
          storage_location: storageLocation.trim()
        }

        const updated = await assignInventoryCustody(payload)
        
        // Update local items state
        setItems((prev) => {
          const exists = prev.some((i) => i.id === updated.id)
          if (exists) {
            return prev.map((i) => (i.id === updated.id ? updated : i))
          } else {
            return [...prev, updated].sort((a, b) => a.item_name.localeCompare(b.item_name))
          }
        })

        setFormSuccess(`Successfully assigned custody of ${updated.item_name}!`)
        
        // Reset/refresh selected dropdown options
        setSelectedItemId(updated.id)
      } catch (err: any) {
        setFormError(err.message || "Failed to update item custody. Please try again.")
      }
    })
  }

  // Filter items by search query
  const filteredItems = items.filter((item) => {
    return (
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storage_location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <>
      {/* Header section */}
      <PageHeader
        title="Master Inventory & Facilities"
        description="Relational tracking system for active storage environments, physical asset custody, and legacy logs."
      />

      {/* TOP SECTION: Google Sheet Embed and Link Card */}
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 md:grid-cols-3">
          {/* Legacy Spreadsheets Card */}
          <Card className="md:col-span-1 border-border bg-card/65 backdrop-blur-md shadow-sm rounded-2xl flex flex-col justify-between p-5">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/25">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Legacy Spreadsheet Bridge</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Used for historic inventory lists, recipe pricing lists, and shared archival spreadsheets. Real-time updates should be made in the Relational Ledger below.
                </p>
              </div>
            </div>
            <div className="flex gap-2.5 mt-5">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEmbedOpen(!isEmbedOpen)}
                className="flex-1 text-xs cursor-pointer"
              >
                {isEmbedOpen ? "Hide Embedded" : "Toggle Sheet View"}
              </Button>
              <a 
                href={legacySpreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button 
                  size="sm" 
                  className="w-full text-xs cursor-pointer gap-1"
                >
                  Spreadsheet
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </div>
          </Card>

          {/* Staging Metrics Quick Glance Cards */}
          <Card className="md:col-span-2 border-border bg-card/65 backdrop-blur-md shadow-sm rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/25">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Storage Facilities</span>
                  <span className="text-2xl font-bold text-foreground mt-1 block">{resources.length}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Unique Items</span>
                  <span className="text-2xl font-bold text-foreground mt-1 block">{items.length}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Total Quantity</span>
                  <span className="text-2xl font-bold text-foreground mt-1 block">
                    {items.reduce((sum, item) => sum + item.quantity_on_hand, 0)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground border-t border-border/30 pt-3 mt-4">
              All custody assignments are updated in real-time and synced with the database.
            </div>
          </Card>
        </div>

        {/* Embedded Iframe */}
        <AnimatePresence>
          {isEmbedOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <FileSpreadsheet className="h-4 w-4 text-green-500" />
                  Google Sheets Live Bridge (Read-Only)
                </span>
                <button 
                  onClick={() => setIsEmbedOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <iframe
                src={spreadsheetEmbedUrl}
                className="w-full h-[400px] border-none"
                title="Google Sheet Embed"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM SECTION: Two-column relational view */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        
        {/* LEFT COLUMN: Storage Capacity Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Building className="h-5 w-5 text-primary/80" />
              Storage Capacity Matrix
            </h3>
          </div>

          <div className="space-y-4">
            {resources.map((resource) => {
              const value = getCapacityPercent(resource.capacity)
              const status = savingState[resource.id] || "idle"

              return (
                <Card 
                  key={resource.id} 
                  className="border-border bg-card/65 backdrop-blur-md shadow-sm rounded-xl p-4 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{resource.facility_name}</h4>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">{resource.resource_type}</p>
                    </div>

                    {/* Inline Saving Feeback Badge */}
                    <div>
                      {status === "saving" && (
                        <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] font-semibold gap-1">
                          <Loader2 className="h-2.5 w-2.5 animate-spin" />
                          Saving
                        </Badge>
                      )}
                      {status === "saved" && (
                        <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 text-[10px] font-semibold gap-1">
                          <Check className="h-2.5 w-2.5" />
                          Saved
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Progress bar visualizing storage full percentage */}
                  <Progress value={value} className="pt-1">
                    <ProgressLabel className="text-xs font-semibold text-muted-foreground">Capacity Staged</ProgressLabel>
                    <ProgressValue className="text-xs font-bold text-foreground" />
                  </Progress>

                  {/* Form fields to update storage row immediately */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/30">
                    {/* Capacity select */}
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Fill Status</Label>
                      <select
                        value={resource.capacity}
                        onChange={(e) => handleResourceUpdate(resource.id, { capacity: e.target.value })}
                        className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
                      >
                        <option value="Empty">Empty</option>
                        <option value="25% Full">25% Full</option>
                        <option value="50% Full">50% Full</option>
                        <option value="70% Full">70% Full</option>
                        <option value="90% Full">90% Full</option>
                        <option value="Full">Full</option>
                      </select>
                    </div>

                    {/* Notes/Custodian */}
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Custody Note</Label>
                      <Input
                        defaultValue={resource.notes}
                        onBlur={(e) => {
                          if (e.target.value !== resource.notes) {
                            handleResourceUpdate(resource.id, { notes: e.target.value })
                          }
                        }}
                        className="h-8 text-xs bg-card"
                        placeholder="Custodian: Name"
                      />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Staging & Asset Custody Log (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Assign Custody Form */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Database className="h-5 w-5 text-primary/80" />
              Assign Custody & Location
            </h3>

            <Card className="border-border bg-card/65 backdrop-blur-md shadow-sm rounded-xl p-5">
              <form onSubmit={handleAssignCustodySubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Select Item dropdown */}
                  <div className="space-y-1.5">
                    <Label htmlFor="item-select" className="text-xs font-bold">Select Active Item</Label>
                    <select
                      id="item-select"
                      value={selectedItemId}
                      onChange={(e) => handleItemSelectChange(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="new">+ Log New Item</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.item_name} ({item.storage_location})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Name (visible/editable based on selector) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="item-name" className="text-xs font-bold">Item Name</Label>
                    <Input
                      id="item-name"
                      placeholder="e.g. Canola Oil, Aluminum Foil"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      disabled={selectedItemId !== "new"}
                      className="h-10 bg-card disabled:opacity-70"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <Label htmlFor="item-category" className="text-xs font-bold">Category</Label>
                    <Input
                      id="item-category"
                      placeholder="e.g. Dry Goods, Bulk Ingredient"
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                      disabled={selectedItemId !== "new"}
                      className="h-10 bg-card disabled:opacity-70"
                    />
                  </div>

                  {/* Quantity on hand */}
                  <div className="space-y-1.5">
                    <Label htmlFor="item-qty" className="text-xs font-bold">Quantity On Hand</Label>
                    <Input
                      id="item-qty"
                      type="number"
                      min={0}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                      className="h-10 bg-card"
                      required
                    />
                  </div>
                </div>

                {/* Storage Location custody text */}
                <div className="space-y-1.5">
                  <Label htmlFor="custody-location" className="text-xs font-bold">Possession Custody & Location</Label>
                  <Input
                    id="custody-location"
                    placeholder="e.g. Albert Y. (Apartment) or Locker A"
                    value={storageLocation}
                    onChange={(e) => setStorageLocation(e.target.value)}
                    className="h-10 bg-card"
                    required
                  />
                </div>

                {/* Error and Success states */}
                {formError && (
                  <div className="text-xs font-semibold text-destructive flex items-center gap-1 bg-destructive/5 border border-destructive/10 p-2.5 rounded-lg">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg">
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    {formSuccess}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full cursor-pointer h-10 text-sm font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving Custody Record...
                    </>
                  ) : (
                    selectedItemId === "new" ? "Register & Assign Custody" : "Update Custody Record"
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Section 2: Ledger Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Package className="h-4.5 w-4.5 text-primary/80" />
                Master Custody Ledger
              </h3>
              
              {/* Table search filter query count */}
              <span className="text-xs text-muted-foreground">{filteredItems.length} items logged</span>
            </div>

            <Card className="border-border bg-card/65 backdrop-blur-md shadow-sm rounded-xl overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/20 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3">Item Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3">Custody Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                          No items tracked in registry. Add a new item above.
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => (
                        <tr 
                          key={item.id}
                          onClick={() => handleItemSelectChange(item.id)}
                          className={cn(
                            "hover:bg-muted/10 transition-colors cursor-pointer",
                            selectedItemId === item.id && "bg-primary/5 hover:bg-primary/5"
                          )}
                        >
                          <td className="px-4 py-3 font-bold text-foreground">{item.item_name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                          <td className="px-4 py-3 text-center font-semibold">{item.quantity_on_hand}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold">
                              <span className="h-1 w-1 rounded-full bg-primary" />
                              {item.storage_location}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </>
  )
}
