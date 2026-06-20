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
  recipe_status?: "Untested" | "In Progress" | "D-Day Ready"
  google_doc_link?: string
}

export type StaffMember = {
  id: string
  name: string
  role: string
  confirmed: boolean
  responsibilities?: string
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
  storage_location?: string
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
  venue_status?: "Requested" | "Approved" | "Denied"
  funding_status?: "Pending Review" | "Approved" | "Rejected"
  google_sheets_link?: string
  debrief_doc_link?: string
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
    id: "tsa-night-market",
    name: "TSA Night Market",
    date: "Oct 18, 2026",
    location: "Main Quad",
    attendees: 350,
    budget: 2500,
    spent: 1200,
    status: "Needs Attention",
    isArchived: false,
    summary: "The flagship annual outdoor food festival showcasing authentic Taiwanese night market culture. Features multiple food stalls, games, and cultural performances.",
    readiness: [
      { label: "Menu", value: 90 },
      { label: "Staffing", value: 60 },
      { label: "Shopping", value: 50 },
      { label: "Timeline", value: 80 },
    ],
    menu: [
      { id: "nm-m1", name: "Popcorn Chicken", category: "Main", servings: 350, estimatedCost: 600 },
      { id: "nm-m2", name: "Taiwanese Sausage", category: "Side", servings: 300, estimatedCost: 450 },
      { id: "nm-m3", name: "Scallion Pancakes", category: "Side", servings: 250, estimatedCost: 300 },
      { id: "nm-m4", name: "Bubble Tea", category: "Beverage", servings: 400, estimatedCost: 500 },
    ],
    staffing: [
      {
        team: "Prep Team",
        members: [
          { id: "nm-s1", name: "Albert", role: "Lead Prep Volunteer", confirmed: true },
          { id: "nm-s2", name: "Kevin", role: "Prep Volunteer", confirmed: true },
          { id: "nm-s3", name: "Grace", role: "Prep Volunteer", confirmed: true },
        ],
      },
      {
        team: "Cooking Team",
        members: [
          { id: "nm-s4", name: "Andy", role: "Cooking Lead", confirmed: true },
          { id: "nm-s5", name: "Emily", role: "Station Cook", confirmed: true },
          { id: "nm-s6", name: "Tiffany", role: "Station Cook", confirmed: true },
        ],
      },
      {
        team: "Serving Team",
        members: [
          { id: "nm-s7", name: "Jason", role: "Front-of-House Lead", confirmed: true },
          { id: "nm-s8", name: "Open Position", role: "Bubble Tea Lead", confirmed: false },
          { id: "nm-s9", name: "Open Position", role: "Serving Volunteer", confirmed: false },
        ],
      },
      {
        team: "Support Team",
        members: [
          { id: "nm-s10", name: "Michelle", role: "Cashier/Ticketing", confirmed: true },
          { id: "nm-s11", name: "Open Position", role: "Setup/Cleanup Crew", confirmed: false },
        ],
      },
    ],
    timeline: [
      { id: "nm-t1", marker: "T-7 days", title: "Finalize grocery list", description: "Verify quantities for Chicken Thighs, Sweet Potato Starch, and Basil.", done: true },
      { id: "nm-t2", marker: "T-3 days", title: "Draft volunteer roster", description: "Confirm shifts and roles for prep and serving volunteers.", done: false },
      { id: "nm-t3", marker: "T-1 day", title: "Prep equipment & marinate", description: "Collect butane burners, folding tables, and start prep work.", done: false },
      { id: "nm-t4", marker: "Event day", title: "Setup and service", description: "Arrive at Main Quad by 3:00 PM for booth setup and cooking.", done: false },
    ],
    shopping: [
      {
        category: "Produce",
        items: [
          { id: "nm-sh1", name: "Basil", quantity: "10 lb", checked: true },
          { id: "nm-sh2", name: "Garlic", quantity: "5 lb", checked: false },
          { id: "nm-sh3", name: "Green Onion", quantity: "12 lb", checked: false },
        ],
      },
      {
        category: "Protein",
        items: [
          { id: "nm-sh4", name: "Chicken Thighs", quantity: "100 lb", checked: true },
          { id: "nm-sh5", name: "Taiwanese Sausage", quantity: "60 lb", checked: false },
        ],
      },
      {
        category: "Dry Goods",
        items: [
          { id: "nm-sh6", name: "Sweet Potato Starch", quantity: "40 lb", checked: true },
          { id: "nm-sh7", name: "Soy Sauce", quantity: "5 gal", checked: true },
          { id: "nm-sh8", name: "Tapioca Pearls", quantity: "45 lb", checked: false },
        ],
      },
      {
        category: "Misc",
        items: [
          { id: "nm-sh9", name: "Cups and straws", quantity: "500 ct", checked: false },
        ],
      },
    ],
    groceryRuns: [
      {
        id: "nm-g1",
        driver: "Albert",
        vehicle: "SUV",
        destination: "Lotte Plaza Market",
        departure: "3:00 PM",
        status: "Planned",
      },
      {
        id: "nm-g2",
        driver: "Brian",
        vehicle: "Minivan",
        destination: "Costco",
        departure: "4:30 PM",
        status: "Planned",
      },
    ],
    equipmentLoans: [
      {
        id: "nm-e1",
        item: "Butane Burners",
        owner: "Sophia",
        dateBrought: "Oct 17",
        dateReturned: "Oct 19",
        returned: false,
      },
      {
        id: "nm-e2",
        item: "Folding Tables",
        owner: "Grace",
        dateBrought: "Oct 17",
        dateReturned: "Oct 19",
        returned: false,
      },
    ],
    reimbursements: [
      {
        id: "nm-r1",
        buyer: "Kevin",
        purpose: "Costco ingredient purchases",
        amount: 450,
        receiptStatus: "Uploaded",
        status: "Pending Review",
      },
      {
        id: "nm-r2",
        buyer: "Andy",
        purpose: "Fuel reimbursement for grocery runs",
        amount: 40,
        receiptStatus: "Uploaded",
        status: "Approved by Treasurer",
      },
    ],
    reflection: { whatWorked: "", whatFailed: "" },
    lessons: [],
  },
  {
    id: "taiwanese-culture-night",
    name: "Taiwanese Culture Night",
    date: "Nov 12, 2026",
    location: "Student Union Ballroom",
    attendees: 200,
    budget: 1800,
    spent: 150,
    status: "Planning",
    isArchived: false,
    summary: "An elegant cultural dinner presenting authentic dishes, artistic showcases, and student displays to celebrate Taiwanese heritage.",
    readiness: [
      { label: "Menu", value: 40 },
      { label: "Staffing", value: 30 },
      { label: "Shopping", value: 10 },
      { label: "Timeline", value: 40 },
    ],
    menu: [
      { id: "cn-m1", name: "Lu Rou Fan", category: "Main", servings: 200, estimatedCost: 550 },
      { id: "cn-m2", name: "Oyster Omelet", category: "Main", servings: 150, estimatedCost: 450 },
      { id: "cn-m3", name: "Taro Milk Tea", category: "Beverage", servings: 200, estimatedCost: 350 },
    ],
    staffing: [
      {
        team: "Prep Team",
        members: [
          { id: "cn-s1", name: "Emily", role: "Prep Volunteer", confirmed: true },
          { id: "cn-s2", name: "Open Position", role: "Prep Volunteer", confirmed: false },
        ],
      },
      {
        team: "Cooking Team",
        members: [
          { id: "cn-s3", name: "Sophia", role: "Cooking Lead", confirmed: true },
          { id: "cn-s4", name: "Jason", role: "Station Cook", confirmed: false },
        ],
      },
      {
        team: "Serving Team",
        members: [
          { id: "cn-s5", name: "Grace", role: "Serving Volunteer", confirmed: true },
          { id: "cn-s6", name: "Open Position", role: "Serving Volunteer", confirmed: false },
        ],
      },
      {
        team: "Support Team",
        members: [
          { id: "cn-s7", name: "Brian", role: "Cashier/Ticketing", confirmed: true },
          { id: "cn-s8", name: "Open Position", role: "Setup/Cleanup Crew", confirmed: false },
        ],
      },
    ],
    timeline: [
      { id: "cn-t1", marker: "T-7 days", title: "Approve menu ingredients", description: "Verify projected cost exceeds budget warnings.", done: false },
      { id: "cn-t2", marker: "T-3 days", title: "Assign grocery runs", description: "Determine drivers for specialty shops.", done: false },
      { id: "cn-t3", marker: "T-1 day", title: "Collect folding tables & cookers", description: "Pick up inventory from volunteers.", done: false },
      { id: "cn-t4", marker: "Event day", title: "Execution and service", description: "Prep begins at 12:00 PM; dinner starts at 6:30 PM.", done: false },
    ],
    shopping: [
      {
        category: "Produce",
        items: [
          { id: "cn-sh1", name: "Green Onion", quantity: "8 lb", checked: false },
          { id: "cn-sh2", name: "Garlic", quantity: "4 lb", checked: false },
        ],
      },
      {
        category: "Protein",
        items: [
          { id: "cn-sh3", name: "Chicken Thighs", quantity: "40 lb", checked: false },
        ],
      },
      {
        category: "Dry Goods",
        items: [
          { id: "cn-sh4", name: "Rice", quantity: "50 lb", checked: false },
          { id: "cn-sh5", name: "Soy Sauce", quantity: "3 gal", checked: false },
        ],
      },
      {
        category: "Misc",
        items: [
          { id: "cn-sh6", name: "Serving Trays", quantity: "30 ct", checked: false },
        ],
      },
    ],
    groceryRuns: [
      {
        id: "cn-g1",
        driver: "Albert",
        vehicle: "SUV",
        destination: "New Grand Mart",
        departure: "2:00 PM",
        status: "Planned",
      },
    ],
    equipmentLoans: [
      {
        id: "cn-e1",
        item: "Commercial Rice Cooker",
        owner: "Grace",
        dateBrought: "Nov 11",
        dateReturned: "Nov 13",
        returned: false,
      },
      {
        id: "cn-e2",
        item: "Food Warmers",
        owner: "Kevin",
        dateBrought: "Nov 11",
        dateReturned: "Nov 13",
        returned: false,
      },
    ],
    reimbursements: [
      {
        id: "cn-r1",
        buyer: "Grace",
        purpose: "Disposable utensils",
        amount: 60,
        receiptStatus: "Uploaded",
        status: "Pending Review",
      },
    ],
    reflection: { whatWorked: "", whatFailed: "" },
    lessons: [],
  },
  {
    id: "first-year-welcome-social",
    name: "First Year Welcome Social",
    date: "Sep 15, 2026",
    location: "Student Commons",
    attendees: 120,
    budget: 800,
    spent: 180,
    status: "Ready",
    isArchived: false,
    summary: "A welcome gathering designed to introduce first-year students to the TSA community over bubble tea, popcorn chicken, and fun social games.",
    readiness: [
      { label: "Menu", value: 100 },
      { label: "Staffing", value: 95 },
      { label: "Shopping", value: 90 },
      { label: "Timeline", value: 100 },
    ],
    menu: [
      { id: "ws-m1", name: "Popcorn Chicken", category: "Main", servings: 120, estimatedCost: 250 },
      { id: "ws-m2", name: "Taiwanese Sausage", category: "Side", servings: 100, estimatedCost: 150 },
      { id: "ws-m3", name: "Bubble Tea", category: "Beverage", servings: 150, estimatedCost: 200 },
    ],
    staffing: [
      {
        team: "Prep Team",
        members: [
          { id: "ws-s1", name: "Michelle", role: "Prep Volunteer", confirmed: true },
          { id: "ws-s2", name: "Sophia", role: "Prep Volunteer", confirmed: true },
        ],
      },
      {
        team: "Cooking Team",
        members: [
          { id: "ws-s3", name: "Albert", role: "Cooking Lead", confirmed: true },
          { id: "ws-s4", name: "Grace", role: "Station Cook", confirmed: true },
        ],
      },
      {
        team: "Serving Team",
        members: [
          { id: "ws-s5", name: "Brian", role: "Serving Volunteer", confirmed: true },
          { id: "ws-s6", name: "Tiffany", role: "Serving Volunteer", confirmed: true },
        ],
      },
      {
        team: "Support Team",
        members: [
          { id: "ws-s7", name: "Andy", role: "Cashier/Ticketing", confirmed: true },
          { id: "ws-s8", name: "Kevin", role: "Setup/Cleanup Crew", confirmed: true },
        ],
      },
    ],
    timeline: [
      { id: "ws-t1", marker: "T-7 days", title: "Review RSVPs & portions", description: "Calculate quantities based on active student signup forms.", done: true },
      { id: "ws-t2", marker: "T-3 days", title: "Order bubble tea ingredients", description: "Purchase pearls, powders, and cups.", done: true },
      { id: "ws-t3", marker: "T-1 day", title: "Pick up rice cooker and dispensers", description: "Retrieve equipment from volunteer owners.", done: true },
      { id: "ws-t4", marker: "Event day", title: "Service & games", description: "Set up at Student Commons starting at 4:00 PM.", done: true },
    ],
    shopping: [
      {
        category: "Produce",
        items: [
          { id: "ws-sh1", name: "Basil", quantity: "3 lb", checked: true },
          { id: "ws-sh2", name: "Garlic", quantity: "2 lb", checked: true },
        ],
      },
      {
        category: "Protein",
        items: [
          { id: "ws-sh3", name: "Chicken Thighs", quantity: "30 lb", checked: true },
        ],
      },
      {
        category: "Dry Goods",
        items: [
          { id: "ws-sh4", name: "Sweet Potato Starch", quantity: "15 lb", checked: true },
          { id: "ws-sh5", name: "Tapioca Pearls", quantity: "15 lb", checked: true },
          { id: "ws-sh6", name: "Milk Tea Powder", quantity: "10 lb", checked: true },
        ],
      },
      {
        category: "Misc",
        items: [
          { id: "ws-sh7", name: "Disposable utensils", quantity: "150 ct", checked: true },
        ],
      },
    ],
    groceryRuns: [
      {
        id: "ws-g1",
        driver: "Albert",
        vehicle: "Sedan",
        destination: "Wegmans",
        departure: "10:00 AM",
        status: "Completed",
      },
    ],
    equipmentLoans: [
      {
        id: "ws-e1",
        item: "Beverage Dispensers",
        owner: "Andy",
        dateBrought: "Sep 14",
        dateReturned: "Sep 16",
        returned: false,
      },
      {
        id: "ws-e2",
        item: "Commercial Rice Cooker",
        owner: "Grace",
        dateBrought: "Sep 14",
        dateReturned: "Sep 16",
        returned: false,
      },
    ],
    reimbursements: [
      {
        id: "ws-r1",
        buyer: "Michelle",
        purpose: "Beverage supplies",
        amount: 85,
        receiptStatus: "Uploaded",
        status: "Approved by Treasurer",
      },
    ],
    reflection: { whatWorked: "", whatFailed: "" },
    lessons: [],
  },
  {
    id: "mid-autumn-festival",
    name: "Mid-Autumn Festival",
    date: "Sep 28, 2026",
    location: "Clemons Courtyard",
    attendees: 180,
    budget: 1200,
    spent: 120,
    status: "Planning",
    isArchived: false,
    summary: "Gathering students under the full moon to celebrate the Mid-Autumn Festival with mooncakes, pomelos, and delicious grilled Taiwanese Sausage.",
    readiness: [
      { label: "Menu", value: 50 },
      { label: "Staffing", value: 40 },
      { label: "Shopping", value: 20 },
      { label: "Timeline", value: 60 },
    ],
    menu: [
      { id: "ma-m1", name: "Taiwanese Sausage", category: "Main", servings: 180, estimatedCost: 350 },
      { id: "ma-m2", name: "Scallion Pancakes", category: "Side", servings: 150, estimatedCost: 200 },
      { id: "ma-m3", name: "Fried Rice", category: "Side", servings: 150, estimatedCost: 150 },
    ],
    staffing: [
      {
        team: "Prep Team",
        members: [
          { id: "ma-s1", name: "Kevin", role: "Prep Volunteer", confirmed: true },
          { id: "ma-s2", name: "Andy", role: "Prep Volunteer", confirmed: false },
        ],
      },
      {
        team: "Cooking Team",
        members: [
          { id: "ma-s3", name: "Grace", role: "Cooking Lead", confirmed: true },
          { id: "ma-s4", name: "Tiffany", role: "Station Cook", confirmed: false },
        ],
      },
      {
        team: "Serving Team",
        members: [
          { id: "ma-s5", name: "Emily", role: "Serving Volunteer", confirmed: false },
          { id: "ma-s6", name: "Sophia", role: "Serving Volunteer", confirmed: false },
        ],
      },
      {
        team: "Support Team",
        members: [
          { id: "ma-s7", name: "Albert", role: "Setup/Cleanup Crew", confirmed: false },
        ],
      },
    ],
    timeline: [
      { id: "ma-t1", marker: "T-7 days", title: "Reserve courtyard & tables", description: "Book the Clemons Courtyard and borrow extension cords.", done: true },
      { id: "ma-t2", marker: "T-3 days", title: "Finalize Walmart grocery run", description: "Confirm the driver and departure details for Walmart.", done: false },
      { id: "ma-t3", marker: "T-1 day", title: "Marinade meat and chop herbs", description: "Prep green onions and marinate pork fillings.", done: false },
      { id: "ma-t4", marker: "Event day", title: "Moonlit celebration", description: "Start cooking at 4:30 PM; open service at 6:00 PM.", done: false },
    ],
    shopping: [
      {
        category: "Produce",
        items: [
          { id: "ma-sh1", name: "Green Onion", quantity: "10 lb", checked: false },
          { id: "ma-sh2", name: "Garlic", quantity: "3 lb", checked: false },
        ],
      },
      {
        category: "Protein",
        items: [
          { id: "ma-sh3", name: "Taiwanese Sausage", quantity: "40 lb", checked: false },
        ],
      },
      {
        category: "Dry Goods",
        items: [
          { id: "ma-sh4", name: "Soy Sauce", quantity: "2 gal", checked: false },
        ],
      },
      {
        category: "Misc",
        items: [
          { id: "ma-sh5", name: "Disposable utensils", quantity: "200 ct", checked: false },
        ],
      },
    ],
    groceryRuns: [
      {
        id: "ma-g1",
        driver: "Jason",
        vehicle: "Sedan",
        destination: "Walmart",
        departure: "11:00 AM",
        status: "Planned",
      },
    ],
    equipmentLoans: [
      {
        id: "ma-e1",
        item: "Folding Tables",
        owner: "Grace",
        dateBrought: "Sep 27",
        dateReturned: "Sep 29",
        returned: false,
      },
      {
        id: "ma-e2",
        item: "Extension Cords",
        owner: "Kevin",
        dateBrought: "Sep 27",
        dateReturned: "Sep 29",
        returned: false,
      },
    ],
    reimbursements: [
      {
        id: "ma-r1",
        buyer: "Andy",
        purpose: "Table rental fees",
        amount: 120,
        receiptStatus: "Uploaded",
        status: "Pending Review",
      },
    ],
    reflection: { whatWorked: "", whatFailed: "" },
    lessons: [],
  },
  {
    id: "lunar-new-year-banquet",
    name: "Lunar New Year Banquet",
    date: "Feb 10, 2026",
    location: "Student Union Hall",
    attendees: 250,
    budget: 3000,
    spent: 2950,
    status: "Completed",
    isArchived: true,
    summary: "A grand cultural banquet celebrating the Lunar New Year. Featured a full 5-course Taiwanese banquet menu and interactive lion dances.",
    readiness: [
      { label: "Menu", value: 100 },
      { label: "Staffing", value: 100 },
      { label: "Shopping", value: 100 },
      { label: "Timeline", value: 100 },
    ],
    menu: [
      { id: "lny-m1", name: "Beef Noodle Soup", category: "Main", servings: 250, estimatedCost: 1000 },
      { id: "lny-m2", name: "Braised Pork Rice", category: "Main", servings: 250, estimatedCost: 600 },
      { id: "lny-m3", name: "Scallion Pancakes", category: "Side", servings: 200, estimatedCost: 300 },
      { id: "lny-m4", name: "Bubble Tea", category: "Beverage", servings: 250, estimatedCost: 400 },
    ],
    staffing: [
      {
        team: "Prep Team",
        members: [
          { id: "lny-s1", name: "Albert", role: "Lead Prep Volunteer", confirmed: true },
          { id: "lny-s2", name: "Kevin", role: "Prep Volunteer", confirmed: true },
          { id: "lny-s3", name: "Grace", role: "Prep Volunteer", confirmed: true },
        ],
      },
      {
        team: "Cooking Team",
        members: [
          { id: "lny-s4", name: "Andy", role: "Cooking Lead", confirmed: true },
          { id: "lny-s5", name: "Emily", role: "Station Cook", confirmed: true },
          { id: "lny-s6", name: "Tiffany", role: "Station Cook", confirmed: true },
        ],
      },
      {
        team: "Serving Team",
        members: [
          { id: "lny-s7", name: "Jason", role: "Front-of-House Lead", confirmed: true },
          { id: "lny-s8", name: "Michelle", role: "Serving Volunteer", confirmed: true },
        ],
      },
      {
        team: "Support Team",
        members: [
          { id: "lny-s9", name: "Brian", role: "Cashier/Ticketing", confirmed: true },
          { id: "lny-s10", name: "Sophia", role: "Setup/Cleanup Crew", confirmed: true },
        ],
      },
    ],
    timeline: [
      { id: "lny-t1", marker: "T-7 days", title: "Finalize seating & RSVPs", description: "Determine final headcount and coordinate tables.", done: true },
      { id: "lny-t2", marker: "T-3 days", title: "Bulk grocery purchase", description: "Get beef, rice, and soy sauce from Lotte Plaza Market.", done: true },
      { id: "lny-t3", marker: "T-1 day", title: "Simmer soup broth", description: "Start slow cook beef noodle soup broth.", done: true },
      { id: "lny-t4", marker: "Event day", title: "Banquet service", description: "Banquet doors open at 6:00 PM.", done: true },
    ],
    shopping: [
      {
        category: "Produce",
        items: [
          { id: "lny-sh1", name: "Garlic", quantity: "8 lb", checked: true },
          { id: "lny-sh2", name: "Green Onion", quantity: "15 lb", checked: true },
        ],
      },
      {
        category: "Protein",
        items: [
          { id: "lny-sh3", name: "Chicken Thighs", quantity: "50 lb", checked: true },
        ],
      },
      {
        category: "Dry Goods",
        items: [
          { id: "lny-sh4", name: "Rice", quantity: "60 lb", checked: true },
          { id: "lny-sh5", name: "Soy Sauce", quantity: "6 gal", checked: true },
        ],
      },
      {
        category: "Misc",
        items: [
          { id: "lny-sh6", name: "Serving Trays", quantity: "40 ct", checked: true },
        ],
      },
    ],
    groceryRuns: [
      {
        id: "lny-g1",
        driver: "Kevin",
        vehicle: "SUV",
        destination: "Lotte Plaza Market",
        departure: "2:00 PM",
        status: "Completed",
      },
    ],
    equipmentLoans: [
      {
        id: "lny-e1",
        item: "Prep Knives",
        owner: "Andy",
        dateBrought: "Feb 9",
        dateReturned: "Feb 11",
        returned: true,
      },
      {
        id: "lny-e2",
        item: "Commercial Rice Cooker",
        owner: "Grace",
        dateBrought: "Feb 9",
        dateReturned: "Feb 11",
        returned: true,
      },
    ],
    reimbursements: [
      {
        id: "lny-r1",
        buyer: "Albert",
        purpose: "Costco ingredient purchases",
        amount: 850,
        receiptStatus: "Uploaded",
        status: "Venmo Sent",
      },
    ],
    reflection: {
      whatWorked: "Rice quantity estimate was accurate. The braised pork rice went very quickly.",
      whatFailed: "Ran out of bubble tea after 90 minutes. Popcorn chicken demand exceeded estimates. Costco run should occur one day earlier. Additional prep volunteers needed for scallion pancakes.",
    },
    lessons: [
      { id: "lny-l1", title: "Ran out of bubble tea after 90 minutes", body: "Bubble tea was extremely popular and ran out quickly. Portion sizes must be doubled next time." },
      { id: "lny-l2", title: "Popcorn chicken demand exceeded estimates", body: "Popcorn chicken is always a high-demand item; increase the raw ingredients order next run." },
      { id: "lny-l3", title: "Costco run should occur one day earlier", body: "Conduct shopping run earlier to avoid rush on the day of the event prep." },
      { id: "lny-l4", title: "Additional prep volunteers needed for scallion pancakes", body: "Rolling out the dough and frying scallion pancakes requires a dedicated three-person team." },
    ],
  },
]

export const actionItems: ActionItem[] = [
  {
    id: "a1",
    eventId: "tsa-night-market",
    eventName: "TSA Night Market",
    type: "Shopping",
    title: "Night Market grocery quantities need review.",
    description: "The quantities for popcorn chicken and green onion ingredients do not match the expected headcount.",
  },
  {
    id: "a2",
    eventId: "tsa-night-market",
    eventName: "TSA Night Market",
    type: "Staffing",
    title: "Bubble Tea station lacks assigned lead.",
    description: "No volunteer is currently assigned to lead the Bubble Tea station during peak hours.",
  },
  {
    id: "a3",
    eventId: "first-year-welcome-social",
    eventName: "First Year Welcome Social",
    type: "Menu",
    title: "Rice cooker inventory incomplete.",
    description: "Only one commercial rice cooker is currently pledged, but at least two are required.",
  },
  {
    id: "a4",
    eventId: "mid-autumn-festival",
    eventName: "Mid-Autumn Festival",
    type: "Staffing",
    title: "Grocery run assignments not finalized.",
    description: "A driver has not yet been confirmed for the main Walmart grocery run.",
  },
  {
    id: "a5",
    eventId: "taiwanese-culture-night",
    eventName: "Taiwanese Culture Night",
    type: "Budget",
    title: "Projected food cost exceeds budget by 8%.",
    description: "Estimated ingredient costs for Lu Rou Fan and Oyster Omelets are higher than the approved budget limit.",
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
