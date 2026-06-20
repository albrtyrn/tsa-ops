import { createClient } from "@/lib/supabase-server"

export async function fetchEventDetails(id: string) {
  // Validate UUID format first to avoid Postgres cast errors on mock IDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    return null
  }

  let supabase
  try {
    supabase = await createClient()
  } catch (e) {
    console.warn("Failed to initialize server client in fetchEventDetails. Falling back to null.")
    return null
  }

  // Fetch the event along with all its related records
  const { data: event, error } = await supabase
    .from("events")
    .select(`
      *,
      menu:dishes(*),
      staff_members(*),
      timeline:timeline_steps(*),
      shopping:shopping_items(*),
      grocery_runs(*),
      equipment_loans(*),
      reimbursements(*),
      lessons(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching event details:", error.message, "Details:", error.details, "Hint:", error.hint, error)
    return null
  }

  // Group staff members by team
  const staffMembers = event.staff_members || []
  const teams: ("Prep Team" | "Cooking Team" | "Serving Team" | "Support Team")[] = [
    "Prep Team",
    "Cooking Team",
    "Serving Team",
    "Support Team",
  ]
  const staffing = teams.map((teamName) => ({
    team: teamName,
    members: staffMembers
      .filter((m: any) => m.team === teamName)
      .map((m: any) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        confirmed: m.confirmed,
        responsibilities: m.responsibilities,
      })),
  }))

  // Group shopping items by category
  const shoppingItems = event.shopping || []
  const categories: ("Produce" | "Protein" | "Dry Goods" | "Misc")[] = [
    "Produce",
    "Protein",
    "Dry Goods",
    "Misc",
  ]
  const shopping = categories.map((cat) => ({
    category: cat,
    items: shoppingItems
      .filter((i: any) => i.category === cat)
      .map((i: any) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        checked: i.checked,
        storage_location: i.storage_location,
      })),
  }))

  // Calculate dynamic readiness tracking
  const doneTimeline = (event.timeline || []).filter((t: any) => t.done).length
  const totalTimeline = (event.timeline || []).length
  const timelineVal = totalTimeline > 0 ? Math.round((doneTimeline / totalTimeline) * 100) : 0

  const checkedShopping = shoppingItems.filter((i: any) => i.checked).length
  const totalShopping = shoppingItems.length
  const shoppingVal = totalShopping > 0 ? Math.round((checkedShopping / totalShopping) * 100) : 0

  const confirmedStaff = staffMembers.filter((m: any) => m.confirmed).length
  const totalStaff = staffMembers.length
  const staffingVal = totalStaff > 0 ? Math.round((confirmedStaff / totalStaff) * 100) : 0

  const uniqueMenuCats = new Set((event.menu || []).map((d: any) => d.category)).size
  const menuVal = Math.min(100, Math.round((uniqueMenuCats / 3) * 100))

  const readiness = [
    { label: "Menu", value: menuVal },
    { label: "Staffing", value: staffingVal },
    { label: "Shopping", value: shoppingVal },
    { label: "Timeline", value: timelineVal },
  ]

  // Calculate dynamic spent value
  const spent = (event.reimbursements || [])
    .filter((r: any) => r.status === "Approved by Treasurer" || r.status === "Venmo Sent")
    .reduce((sum: number, r: any) => sum + Number(r.amount), 0)

  // Map dates to display string
  let displayDate = ""
  try {
    const d = new Date(event.date)
    displayDate = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    displayDate = event.date
  }

  return {
    id: event.id,
    name: event.name,
    date: displayDate,
    location: event.location,
    attendees: event.attendees,
    budget: Number(event.budget),
    spent: spent,
    status: event.status,
    summary: event.summary || "",
    isArchived: event.is_archived,
    readiness,
    menu: (event.menu || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      servings: d.servings,
      estimatedCost: Number(d.estimated_cost),
      recipe_status: d.recipe_status,
      google_doc_link: d.google_doc_link,
    })),
    staffing,
    timeline: (event.timeline || []).map((t: any) => ({
      id: t.id,
      marker: t.marker,
      title: t.title,
      description: t.description,
      done: t.done,
    })),
    shopping,
    groceryRuns: (event.grocery_runs || []).map((g: any) => ({
      id: g.id,
      driver: g.driver_name_fallback || "Unassigned",
      vehicle: g.vehicle,
      destination: g.destination,
      departure: g.departure,
      status: g.status,
    })),
    equipmentLoans: (event.equipment_loans || []).map((el: any) => ({
      id: el.id,
      item: el.item,
      owner: el.owner_name_fallback || "Unknown",
      dateBrought: el.date_brought,
      dateReturned: el.date_returned,
      returned: el.returned,
    })),
    reimbursements: (event.reimbursements || []).map((r: any) => ({
      id: r.id,
      buyer: r.buyer_name_fallback || "Anonymous",
      purpose: r.purpose,
      amount: Number(r.amount),
      receiptStatus: r.receipt_status,
      status: r.status,
    })),
    reflection: {
      whatWorked: event.reflection_what_worked || "",
      whatFailed: event.reflection_what_failed || "",
    },
    lessons: (event.lessons || []).map((l: any) => ({
      id: l.id,
      title: l.title,
      body: l.body,
    })),
    venue_status: event.venue_status,
    funding_status: event.funding_status,
    google_sheets_link: event.google_sheets_link,
    debrief_doc_link: event.debrief_doc_link,
  }
}

export async function fetchAllEvents() {
  let supabase
  try {
    supabase = await createClient()
  } catch (e) {
    console.warn("Failed to initialize server client in fetchAllEvents. Falling back to empty array.")
    return []
  }

  const { data: dbEvents, error } = await supabase
    .from("events")
    .select(`
      *,
      reimbursements(*)
    `)
    .order("date", { ascending: true })

  if (error) {
  console.error("Error fetching all events RAW:", String(error), JSON.stringify(error, Object.getOwnPropertyNames(error)));
  return []
  }

  return dbEvents.map((event: any) => {
    // Spent: sum of reimbursements with approved/paid statuses
    const spent = (event.reimbursements || [])
      .filter((r: any) => r.status === "Approved by Treasurer" || r.status === "Venmo Sent")
      .reduce((sum: number, r: any) => sum + Number(r.amount), 0)

    let displayDate = ""
    try {
      const d = new Date(event.date)
      displayDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      displayDate = event.date
    }

    return {
      id: event.id,
      name: event.name,
      date: displayDate,
      location: event.location,
      attendees: event.attendees,
      budget: Number(event.budget),
      spent: spent,
      status: event.status,
      summary: event.summary || "",
      isArchived: event.is_archived,
    }
  })
}

export async function fetchAnalyticsData() {
  let supabase
  try {
    supabase = await createClient()
  } catch (e) {
    console.warn("Failed to initialize server client in fetchAnalyticsData. Falling back to empty array.")
    return []
  }

  const { data, error } = await supabase
    .from("view_analytics_budget_accuracy")
    .select("*")
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching analytics data:", error.message, "Details:", error.details, "Hint:", error.hint, error)
    return []
  }

  return data.map((item: any) => ({
    eventId: item.event_id,
    eventName: item.event_name,
    status: item.status,
    date: item.date,
    budget: Number(item.budget),
    spent: Number(item.spent),
    variance: Number(item.variance),
    budgetBurnPercentage: Number(item.budget_burn_percentage),
  }))
}

export async function fetchTotalConfirmedVolunteers() {
  let supabase
  try {
    supabase = await createClient()
  } catch (e) {
    console.warn("Failed to initialize server client in fetchTotalConfirmedVolunteers. Falling back to 0.")
    return 0
  }

  const { count, error } = await supabase
    .from("staff_members")
    .select("*", { count: "exact", head: true })
    .eq("confirmed", true)

  if (error) {
    console.error("Error fetching total confirmed volunteers:", error.message)
    return 0
  }

  return count || 0
}
