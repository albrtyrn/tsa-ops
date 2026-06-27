import { createClient } from "@/lib/supabase-server"

export async function fetchAnalyticsData() {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from("events")
    .select(`
      id,
      name,
      date,
      budget,
      attendees,
      status,
      staff_members ( id ),
      shopping_items ( estimated_cost ),
      dishes ( estimated_cost )
    `)
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching analytics data:", error)
    return {
      budgetVsActual: [],
      attendanceTrends: [],
      volunteerStats: { totalEvents: 0, avgVolunteers: 0, totalVolunteers: 0 },
    }
  }

  const budgetVsActual = events.map(e => {
    // Basic spent approximation: sum of dishes estimated cost and shopping items
    const dishCost = e.dishes?.reduce((sum: number, d: any) => sum + (Number(d.estimated_cost) || 0), 0) || 0
    const shoppingCost = e.shopping_items?.reduce((sum: number, s: any) => sum + (Number(s.estimated_cost) || 0), 0) || 0
    const totalSpent = dishCost + shoppingCost
    return {
      name: e.name,
      date: e.date,
      budget: Number(e.budget),
      spent: totalSpent
    }
  })

  const attendanceTrends = events.map(e => ({
    name: e.name,
    date: e.date,
    attendees: e.attendees || 0
  }))

  const totalEvents = events.length
  const allVolunteers = events.reduce((sum, e) => sum + (e.staff_members?.length || 0), 0)
  const avgVolunteers = totalEvents > 0 ? Math.round(allVolunteers / totalEvents) : 0

  return {
    budgetVsActual,
    attendanceTrends,
    volunteerStats: {
      totalEvents,
      avgVolunteers,
      totalVolunteers: allVolunteers
    }
  }
}
