export type EventStatus = "Planning" | "Ready" | "Needs Attention" | "Completed"

export type Dish = {
  id: string
  name: string
  category: string
  servings: number
  estimatedCost: number
}

export type StaffMember = {
  id: string
  name: string
  role: string
  confirmed: boolean
}

export type StaffGroup = {
  team: "Prep Team" | "Cooking Team" | "Serving Team"
  members: StaffMember[]
}

export type TimelineStep = {
  id: string
  marker: string
  title: string
  description: string
  done: boolean
}

export type ShoppingItem = {
  id: string
  name: string
  quantity: string
  checked: boolean
}

export type ShoppingGroup = {
  category: "Produce" | "Protein" | "Dry Goods" | "Misc"
  items: ShoppingItem[]
}

export type LessonCard = {
  id: string
  title: string
  body: string
}

export type CulinaryEvent = {
  id: string
  name: string
  date: string
  location: string
  attendees: number
  budget: number
  spent: number
  status: EventStatus
  summary: string
  readiness: { label: string; value: number }[]
  menu: Dish[]
  staffing: StaffGroup[]
  timeline: TimelineStep[]
  shopping: ShoppingGroup[]
  reflection: { whatWorked: string; whatFailed: string }
  lessons: LessonCard[]
}

export type ActionItem = {
  id: string
  eventId: string
  eventName: string
  type: "Staffing" | "Shopping" | "Menu" | "Budget"
  title: string
  description: string
}

export const events: CulinaryEvent[] = [
  {
    id: "harvest-gala",
    name: "Autumn Harvest Gala",
    date: "Oct 18, 2026",
    location: "Grand Atrium Hall",
    attendees: 240,
    budget: 18000,
    spent: 11200,
    status: "Needs Attention",
    summary:
      "A plated three-course dinner celebrating seasonal produce for 240 guests. The menu is locked and the cooking team is confirmed, but serving staff coverage is short by three people and the produce shopping list still needs final sign-off before the vendor cutoff on Friday.",
    readiness: [
      { label: "Menu", value: 100 },
      { label: "Staffing", value: 65 },
      { label: "Shopping", value: 40 },
      { label: "Timeline", value: 80 },
    ],
    menu: [
      { id: "d1", name: "Roasted Squash Bisque", category: "Starter", servings: 240, estimatedCost: 720 },
      { id: "d2", name: "Heirloom Beet Salad", category: "Starter", servings: 240, estimatedCost: 960 },
      { id: "d3", name: "Braised Short Rib", category: "Main", servings: 160, estimatedCost: 2400 },
      { id: "d4", name: "Wild Mushroom Risotto", category: "Main", servings: 80, estimatedCost: 1040 },
      { id: "d5", name: "Maple Pecan Tart", category: "Dessert", servings: 240, estimatedCost: 840 },
      { id: "d6", name: "Spiced Cider Glaze", category: "Sauce", servings: 240, estimatedCost: 280 },
    ],
    staffing: [
      {
        team: "Prep Team",
        members: [
          { id: "s1", name: "Maria Lopez", role: "Lead Prep Cook", confirmed: true },
          { id: "s2", name: "Devon Carter", role: "Prep Cook", confirmed: true },
          { id: "s3", name: "Aisha Khan", role: "Prep Cook", confirmed: true },
        ],
      },
      {
        team: "Cooking Team",
        members: [
          { id: "s4", name: "Chef Antoine", role: "Head Chef", confirmed: true },
          { id: "s5", name: "Priya Nair", role: "Sous Chef", confirmed: true },
          { id: "s6", name: "Marco Bellini", role: "Line Cook", confirmed: true },
        ],
      },
      {
        team: "Serving Team",
        members: [
          { id: "s7", name: "Jordan Reyes", role: "Lead Server", confirmed: true },
          { id: "s8", name: "Sam Whitfield", role: "Server", confirmed: false },
          { id: "s9", name: "Open Position", role: "Server (3 needed)", confirmed: false },
        ],
      },
    ],
    timeline: [
      { id: "t1", marker: "T-7 days", title: "Confirm vendor orders", description: "Lock produce and protein orders with suppliers.", done: true },
      { id: "t2", marker: "T-3 days", title: "Finalize staffing roster", description: "Confirm all prep, cooking, and serving staff.", done: false },
      { id: "t3", marker: "T-1 day", title: "Prep & mise en place", description: "Complete advance prep, label and store components.", done: false },
      { id: "t4", marker: "Event day", title: "Service execution", description: "Doors at 6:00 PM, first course at 7:00 PM.", done: false },
    ],
    shopping: [
      {
        category: "Produce",
        items: [
          { id: "p1", name: "Butternut squash", quantity: "40 lb", checked: true },
          { id: "p2", name: "Heirloom beets", quantity: "25 lb", checked: false },
          { id: "p3", name: "Wild mushrooms", quantity: "15 lb", checked: false },
        ],
      },
      {
        category: "Protein",
        items: [
          { id: "pr1", name: "Beef short rib", quantity: "60 lb", checked: true },
          { id: "pr2", name: "Vegetable stock", quantity: "8 gal", checked: false },
        ],
      },
      {
        category: "Dry Goods",
        items: [
          { id: "dg1", name: "Arborio rice", quantity: "20 lb", checked: true },
          { id: "dg2", name: "Pecans", quantity: "10 lb", checked: false },
          { id: "dg3", name: "All-purpose flour", quantity: "25 lb", checked: true },
        ],
      },
      {
        category: "Misc",
        items: [
          { id: "m1", name: "Compostable plates", quantity: "300 ct", checked: false },
          { id: "m2", name: "Cocktail napkins", quantity: "500 ct", checked: true },
        ],
      },
    ],
    reflection: { whatWorked: "", whatFailed: "" },
    lessons: [
      { id: "l1", title: "Order produce earlier", body: "Vendor cutoffs caused last-minute scrambles. Place produce orders at least 9 days out for large plated events." },
      { id: "l2", title: "Cross-train servers", body: "Serving coverage gaps are recurring. Build a standby roster of cross-trained staff for events over 200 guests." },
    ],
  },
  {
    id: "founders-lunch",
    name: "Founders Networking Lunch",
    date: "Sep 30, 2026",
    location: "Skyline Terrace",
    attendees: 80,
    budget: 6500,
    spent: 1800,
    status: "Planning",
    summary:
      "A casual buffet-style networking lunch for 80 attendees. The concept is set and the budget is approved, but the menu, staffing, and shopping list have not been generated yet. Use the AI planner to scaffold a full plan.",
    readiness: [
      { label: "Menu", value: 20 },
      { label: "Staffing", value: 10 },
      { label: "Shopping", value: 0 },
      { label: "Timeline", value: 30 },
    ],
    menu: [
      { id: "fd1", name: "Mediterranean Grain Bowl", category: "Main", servings: 80, estimatedCost: 640 },
      { id: "fd2", name: "Citrus Arugula Salad", category: "Starter", servings: 80, estimatedCost: 320 },
      { id: "fd3", name: "Lemon Olive Oil Cake", category: "Dessert", servings: 80, estimatedCost: 280 },
    ],
    staffing: [
      {
        team: "Prep Team",
        members: [{ id: "fs1", name: "Open Position", role: "Prep Cook (2 needed)", confirmed: false }],
      },
      {
        team: "Cooking Team",
        members: [{ id: "fs2", name: "Chef Lina", role: "Head Chef", confirmed: true }],
      },
      {
        team: "Serving Team",
        members: [{ id: "fs3", name: "Open Position", role: "Server (2 needed)", confirmed: false }],
      },
    ],
    timeline: [
      { id: "ft1", marker: "T-7 days", title: "Approve menu", description: "Review and lock the buffet menu.", done: false },
      { id: "ft2", marker: "T-3 days", title: "Source ingredients", description: "Place orders for produce and dry goods.", done: false },
      { id: "ft3", marker: "T-1 day", title: "Prep components", description: "Advance prep grains and dressings.", done: false },
      { id: "ft4", marker: "Event day", title: "Buffet service", description: "Set up at 11:00 AM, lunch at 12:00 PM.", done: false },
    ],
    shopping: [
      {
        category: "Produce",
        items: [
          { id: "fp1", name: "Arugula", quantity: "8 lb", checked: false },
          { id: "fp2", name: "Citrus mix", quantity: "12 lb", checked: false },
        ],
      },
      {
        category: "Dry Goods",
        items: [{ id: "fdg1", name: "Mixed grains", quantity: "15 lb", checked: false }],
      },
      {
        category: "Misc",
        items: [{ id: "fm1", name: "Serving trays", quantity: "20 ct", checked: false }],
      },
    ],
    reflection: { whatWorked: "", whatFailed: "" },
    lessons: [],
  },
  {
    id: "summer-fundraiser",
    name: "Summer Garden Fundraiser",
    date: "Aug 12, 2026",
    location: "Botanical Gardens",
    attendees: 150,
    budget: 12000,
    spent: 11800,
    status: "Completed",
    summary:
      "An outdoor cocktail-style fundraiser for 150 guests featuring passed hors d'oeuvres and a dessert station. The event was executed successfully and came in slightly under budget. Reflection notes and AI lessons have been captured.",
    readiness: [
      { label: "Menu", value: 100 },
      { label: "Staffing", value: 100 },
      { label: "Shopping", value: 100 },
      { label: "Timeline", value: 100 },
    ],
    menu: [
      { id: "sd1", name: "Caprese Skewers", category: "Passed", servings: 150, estimatedCost: 600 },
      { id: "sd2", name: "Mini Crab Cakes", category: "Passed", servings: 150, estimatedCost: 1200 },
      { id: "sd3", name: "Dessert Station", category: "Dessert", servings: 150, estimatedCost: 900 },
    ],
    staffing: [
      {
        team: "Prep Team",
        members: [{ id: "ss1", name: "Tomas Vega", role: "Lead Prep Cook", confirmed: true }],
      },
      {
        team: "Cooking Team",
        members: [{ id: "ss2", name: "Chef Renata", role: "Head Chef", confirmed: true }],
      },
      {
        team: "Serving Team",
        members: [
          { id: "ss3", name: "Kelly Moore", role: "Lead Server", confirmed: true },
          { id: "ss4", name: "Ben Acosta", role: "Server", confirmed: true },
        ],
      },
    ],
    timeline: [
      { id: "st1", marker: "T-7 days", title: "Vendor orders", description: "Confirmed all orders.", done: true },
      { id: "st2", marker: "T-3 days", title: "Staffing roster", description: "All staff confirmed.", done: true },
      { id: "st3", marker: "T-1 day", title: "Prep", description: "Mise en place complete.", done: true },
      { id: "st4", marker: "Event day", title: "Service", description: "Executed flawlessly.", done: true },
    ],
    shopping: [
      {
        category: "Produce",
        items: [{ id: "sp1", name: "Cherry tomatoes", quantity: "20 lb", checked: true }],
      },
      {
        category: "Protein",
        items: [{ id: "spr1", name: "Crab meat", quantity: "25 lb", checked: true }],
      },
    ],
    reflection: {
      whatWorked: "The passed hors d'oeuvres flow kept guests engaged and reduced lines. Staggered staff arrivals worked perfectly.",
      whatFailed: "Dessert station ran low 45 minutes before close. Underestimated repeat visits to the station.",
    },
    lessons: [
      { id: "sl1", title: "Scale dessert stations by 1.5x", body: "Self-serve dessert stations see repeat visits. Plan portions at 1.5x headcount for cocktail-style events." },
      { id: "sl2", title: "Stagger serving staff arrivals", body: "Staggered arrivals reduced idle labor cost during setup while keeping peak service fully covered." },
    ],
  },
]

export const actionItems: ActionItem[] = [
  {
    id: "a1",
    eventId: "harvest-gala",
    eventName: "Autumn Harvest Gala",
    type: "Staffing",
    title: "Missing serving staff",
    description: "3 server positions still open. Vendor staffing request closes in 2 days.",
  },
  {
    id: "a2",
    eventId: "harvest-gala",
    eventName: "Autumn Harvest Gala",
    type: "Shopping",
    title: "Shopping list needs sign-off",
    description: "Produce order must be approved before Friday vendor cutoff.",
  },
  {
    id: "a3",
    eventId: "founders-lunch",
    eventName: "Founders Networking Lunch",
    type: "Menu",
    title: "Plan not generated",
    description: "Menu, staffing, and timeline have not been generated for this event yet.",
  },
]

export function getEvent(id: string) {
  return events.find((e) => e.id === id)
}

export const metrics = {
  activeEvents: events.filter((e) => e.status !== "Completed").length,
  totalVolunteers: events.reduce(
    (acc, e) => acc + e.staffing.reduce((s, g) => s + g.members.filter((m) => m.confirmed).length, 0),
    0,
  ),
  plannedBudget: events.filter((e) => e.status !== "Completed").reduce((acc, e) => acc + e.budget, 0),
}
