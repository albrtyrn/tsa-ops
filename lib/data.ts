export type EventStatus = "Planning" | "Ready" | "Needs Attention" | "Completed"

export type GroceryRun = {
  id: string
  driver: string
  vehicle: "Sedan" | "SUV" | "Minivan" | "Pickup"
  destination: string
  departure: string
  status: "Planned" | "In progress" | "Completed"
}

export type EquipmentLoan = {
  id: string
  item: string
  owner: string
  dateBrought: string
  dateReturned: string
  returned: boolean
}

export type ReimbursementEntry = {
  id: string
  buyer: string
  purpose: string
  amount: number
  receiptStatus: "Uploaded" | "Missing"
  status: "Pending Review" | "Approved by Treasurer" | "Venmo Sent"
}

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
  team: "Prep Team" | "Cooking Team" | "Serving Team" | "Support Team"
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
  isArchived: boolean
  readiness: { label: string; value: number }[]
  menu: Dish[]
  staffing: StaffGroup[]
  timeline: TimelineStep[]
  shopping: ShoppingGroup[]
  groceryRuns: GroceryRun[]
  equipmentLoans: EquipmentLoan[]
  reimbursements: ReimbursementEntry[]
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
    name: "Autumn Harvest Dinner",
    date: "Oct 18, 2026",
    location: "Clemons Hall",
    attendees: 150,
    budget: 1400,
    spent: 520,
    status: "Needs Attention",
    isArchived: false,
    summary:
      "A student-run harvest dinner for 150 guests in the Union Ballroom. Menu and core teams are mostly in place, but the grocery list needs final approval and setup volunteers are still being confirmed.",
    readiness: [
      { label: "Menu", value: 90 },
      { label: "Staffing", value: 70 },
      { label: "Shopping", value: 50 },
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
          { id: "s1", name: "Maria Lopez", role: "Lead Prep Volunteer", confirmed: true },
          { id: "s2", name: "Devon Carter", role: "Prep Volunteer", confirmed: true },
          { id: "s3", name: "Aisha Khan", role: "Prep Volunteer", confirmed: true },
        ],
      },
      {
        team: "Cooking Team",
        members: [
          { id: "s4", name: "Jamie Chen", role: "Cooking Lead", confirmed: true },
          { id: "s5", name: "Priya Nair", role: "Station Cook", confirmed: true },
          { id: "s6", name: "Marco Bellini", role: "Station Cook", confirmed: true },
        ],
      },
      {
        team: "Serving Team",
        members: [
          { id: "s7", name: "Jordan Reyes", role: "Front-of-House Lead", confirmed: true },
          { id: "s8", name: "Sam Whitfield", role: "Serving Volunteer", confirmed: false },
          { id: "s9", name: "Open Position", role: "Serving Volunteer (2 needed)", confirmed: false },
        ],
      },
      {
        team: "Support Team",
        members: [
          { id: "s10", name: "Ashley Park", role: "Cashier/Ticketing", confirmed: true },
          { id: "s11", name: "Linh Tran", role: "Setup/Cleanup Crew", confirmed: false },
        ],
      },
    ],
    timeline: [
      { id: "t1", marker: "T-7 days", title: "Finalize grocery list", description: "Review the grocery plan and confirm the pickup schedule.", done: true },
      { id: "t2", marker: "T-3 days", title: "Finalize volunteer roster", description: "Confirm all prep, cooking, serving, and support volunteers.", done: false },
      { id: "t3", marker: "T-1 day", title: "Prep equipment", description: "Gather borrowed gear and organize the kitchen setup.", done: false },
      { id: "t4", marker: "Event day", title: "Setup and service", description: "Arrive early for setup and open doors by 5:45 PM.", done: false },
    ],
    shopping: [
      {
        category: "Produce",
        items: [
          { id: "p1", name: "Butternut squash", quantity: "30 lb", checked: true },
          { id: "p2", name: "Heirloom beets", quantity: "20 lb", checked: false },
          { id: "p3", name: "Wild mushrooms", quantity: "12 lb", checked: false },
        ],
      },
      {
        category: "Protein",
        items: [
          { id: "pr1", name: "Tofu", quantity: "20 lb", checked: true },
          { id: "pr2", name: "Vegetable stock", quantity: "6 gal", checked: false },
        ],
      },
      {
        category: "Dry Goods",
        items: [
          { id: "dg1", name: "Arborio rice", quantity: "15 lb", checked: true },
          { id: "dg2", name: "Pecans", quantity: "8 lb", checked: false },
          { id: "dg3", name: "All-purpose flour", quantity: "20 lb", checked: true },
        ],
      },
      {
        category: "Misc",
        items: [
          { id: "m1", name: "Compostable plates", quantity: "200 ct", checked: false },
          { id: "m2", name: "Napkins", quantity: "250 ct", checked: true },
        ],
      },
    ],
    groceryRuns: [
      {
        id: "g1",
        driver: "Maya Lin",
        vehicle: "SUV",
        destination: "C-Ville Super Asia",
        departure: "4:30 PM",
        status: "Planned",
      },
      {
        id: "g2",
        driver: "Noah Patel",
        vehicle: "Pickup",
        destination: "Costco",
        departure: "4:45 PM",
        status: "Planned",
      },
    ],
    equipmentLoans: [
      {
        id: "e1",
        item: "10-Cup Rice Cooker",
        owner: "Angela Wu",
        dateBrought: "Oct 17",
        dateReturned: "Oct 19",
        returned: false,
      },
      {
        id: "e2",
        item: "Folding Table",
        owner: "Jason Hill",
        dateBrought: "Oct 17",
        dateReturned: "Oct 20",
        returned: false,
      },
    ],
    reimbursements: [
      {
        id: "r1",
        buyer: "Drew Patel",
        purpose: "Extra produce bags",
        amount: 28,
        receiptStatus: "Uploaded",
        status: "Pending Review",
      },
      {
        id: "r2",
        buyer: "Aisha Khan",
        purpose: "Spice packet restock",
        amount: 16,
        receiptStatus: "Uploaded",
        status: "Approved by Treasurer",
      },
    ],
    reflection: { whatWorked: "", whatFailed: "" },
    lessons: [
      { id: "l1", title: "Order produce earlier", body: "Grocery timing caused last-minute scrambles. Buy key ingredients at least 3 days ahead for student-run dinners." },
      { id: "l2", title: "Cross-train servers", body: "Serving coverage gaps are recurring. Build a standby roster of cross-trained volunteers for events over 100 guests." },
    ],
  },
  {
    id: "founders-lunch",
    name: "Founders Networking Lunch",
    date: "Sep 30, 2026",
    location: "Skyline Terrace",
    attendees: 75,
    budget: 650,
    spent: 120,
    status: "Planning",
    isArchived: false,
    summary:
      "A relaxed networking lunch for 75 attendees. The student council grant is in review, and the team is currently building the grocery list, volunteer roster, and equipment plan.",
    readiness: [
      { label: "Menu", value: 25 },
      { label: "Staffing", value: 15 },
      { label: "Shopping", value: 5 },
      { label: "Timeline", value: 30 },
    ],
    menu: [
      { id: "fd1", name: "Mediterranean Grain Bowl", category: "Main", servings: 75, estimatedCost: 320 },
      { id: "fd2", name: "Citrus Arugula Salad", category: "Starter", servings: 75, estimatedCost: 180 },
      { id: "fd3", name: "Lemon Olive Oil Cake", category: "Dessert", servings: 75, estimatedCost: 110 },
    ],
    staffing: [
      {
        team: "Prep Team",
        members: [{ id: "fs1", name: "Open Position", role: "Prep Volunteer (2 needed)", confirmed: false }],
      },
      {
        team: "Cooking Team",
        members: [{ id: "fs2", name: "Lina Chen", role: "Cooking Lead", confirmed: true }],
      },
      {
        team: "Serving Team",
        members: [{ id: "fs3", name: "Open Position", role: "Serving Volunteer (2 needed)", confirmed: false }],
      },
      {
        team: "Support Team",
        members: [
          { id: "fs4", name: "Noah Kim", role: "Cashier/Ticketing", confirmed: false },
          { id: "fs5", name: "Sara Lee", role: "Setup/Cleanup Crew", confirmed: false },
        ],
      },
    ],
    timeline: [
      { id: "ft1", marker: "T-7 days", title: "Approve budget", description: "Confirm the SAF/Student Council funding request.", done: false },
      { id: "ft2", marker: "T-3 days", title: "Draft grocery list", description: "Build the shopping list for the lunch menu.", done: false },
      { id: "ft3", marker: "T-1 day", title: "Prepare serviceware", description: "Collect borrowed trays, utensils, and serving gear.", done: false },
      { id: "ft4", marker: "Event day", title: "Lunch service", description: "Set up at 11:15 AM and open at 12:00 PM.", done: false },
    ],
    shopping: [
      {
        category: "Produce",
        items: [
          { id: "fp1", name: "Arugula", quantity: "6 lb", checked: false },
          { id: "fp2", name: "Citrus mix", quantity: "10 lb", checked: false },
        ],
      },
      {
        category: "Dry Goods",
        items: [{ id: "fdg1", name: "Mixed grains", quantity: "12 lb", checked: false }],
      },
      {
        category: "Misc",
        items: [{ id: "fm1", name: "Serving trays", quantity: "18 ct", checked: false }],
      },
    ],
    groceryRuns: [
      {
        id: "g3",
        driver: "Skyler Ho",
        vehicle: "Sedan",
        destination: "Kroger",
        departure: "9:00 AM",
        status: "Planned",
      },
    ],
    equipmentLoans: [
      {
        id: "e3",
        item: "Insulated Food Carrier",
        owner: "Chloe Nguyen",
        dateBrought: "Sep 29",
        dateReturned: "Oct 1",
        returned: false,
      },
    ],
    reimbursements: [
      {
        id: "r3",
        buyer: "Mia Tran",
        purpose: "Condiment cups and napkins",
        amount: 14,
        receiptStatus: "Uploaded",
        status: "Pending Review",
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
    attendees: 120,
    budget: 1350,
    spent: 1320,
    status: "Completed",
    summary:
      "An outdoor fundraising dinner for 120 guests led by student volunteers. The event was executed smoothly, and the team captured useful lessons around timing grocery runs and returning borrowed gear.",
    readiness: [
      { label: "Menu", value: 100 },
      { label: "Staffing", value: 100 },
      { label: "Shopping", value: 100 },
      { label: "Timeline", value: 100 },
    ],
    menu: [
      { id: "sd1", name: "Caprese Skewers", category: "Passed", servings: 120, estimatedCost: 280 },
      { id: "sd2", name: "Mini Crab Cakes", category: "Passed", servings: 120, estimatedCost: 420 },
      { id: "sd3", name: "Dessert Station", category: "Dessert", servings: 120, estimatedCost: 250 },
    ],
    staffing: [
      {
        team: "Prep Team",
        members: [{ id: "ss1", name: "Tomas Vega", role: "Lead Prep Volunteer", confirmed: true }],
      },
      {
        team: "Cooking Team",
        members: [{ id: "ss2", name: "Renata Lee", role: "Cooking Lead", confirmed: true }],
      },
      {
        team: "Serving Team",
        members: [
          { id: "ss3", name: "Kelly Moore", role: "Front-of-House Lead", confirmed: true },
          { id: "ss4", name: "Ben Acosta", role: "Serving Volunteer", confirmed: true },
        ],
      },
      {
        team: "Support Team",
        members: [
          { id: "ss5", name: "Jordan Park", role: "Cashier/Ticketing", confirmed: true },
          { id: "ss6", name: "Mina Shah", role: "Setup/Cleanup Crew", confirmed: true },
        ],
      },
    ],
    timeline: [
      { id: "st1", marker: "T-7 days", title: "Finalize orders", description: "Confirmed all grocery and supply orders.", done: true },
      { id: "st2", marker: "T-3 days", title: "Confirm volunteers", description: "Staffing roster and roles finalized.", done: true },
      { id: "st3", marker: "T-1 day", title: "Prep station setup", description: "All equipment staged and labeled.", done: true },
      { id: "st4", marker: "Event day", title: "Service", description: "Executed the event on schedule.", done: true },
    ],
    shopping: [
      {
        category: "Produce",
        items: [{ id: "sp1", name: "Cherry tomatoes", quantity: "15 lb", checked: true }],
      },
      {
        category: "Protein",
        items: [{ id: "spr1", name: "Crab meat", quantity: "20 lb", checked: true }],
      },
    ],
    groceryRuns: [
      {
        id: "g4",
        driver: "Eli Chen",
        vehicle: "Minivan",
        destination: "Whole Foods",
        departure: "3:00 PM",
        status: "Completed",
      },
    ],
    equipmentLoans: [
      {
        id: "e4",
        item: "Folding Table",
        owner: "Sofia Brooks",
        dateBrought: "Aug 11",
        dateReturned: "Aug 13",
        returned: true,
      },
    ],
    reimbursements: [
      {
        id: "r4",
        buyer: "Ian Morris",
        purpose: "Ingredient trays and labels",
        amount: 47,
        receiptStatus: "Uploaded",
        status: "Venmo Sent",
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
    eventName: "Autumn Harvest Dinner",
    type: "Staffing",
    title: "Confirm serving volunteers",
    description: "Two serving volunteers are still open. Volunteer roster sign-off closes in 2 days.",
  },
  {
    id: "a2",
    eventId: "harvest-gala",
    eventName: "Autumn Harvest Dinner",
    type: "Shopping",
    title: "Finalize grocery list",
    description: "The grocery list needs final approval before the evening supermarket run.",
  },
  {
    id: "a3",
    eventId: "founders-lunch",
    eventName: "Founders Networking Lunch",
    type: "Budget",
    title: "Approve student council funding",
    description: "SAF/Student Council budget request needs approval to finalize the lunch plan.",
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
