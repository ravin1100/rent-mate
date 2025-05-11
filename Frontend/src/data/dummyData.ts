// Dummy data for development purposes

// Users data
export const dummyUsers = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: "u3",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: "u4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=9"
  },
  {
    id: "u5",
    name: "Alex Chen",
    email: "alex@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "u6",
    name: "Emily Davis",
    email: "emily@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=10"
  },
  {
    id: "u7",
    name: "David Wilson",
    email: "david@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=12"
  }
];

// Current user (for authentication context)
export const dummyUser = dummyUsers[0];

// Households data
export const dummyHouseholds = [
  {
    id: "h1",
    name: "Awesome Apartment",
    address: "123 Main Street, Apt 4B",
    createdAt: "2025-01-15T10:30:00Z",
    members: [
      { userId: "u1", name: "John Doe", role: "admin", avatarUrl: "https://i.pravatar.cc/150?img=1" },
      { userId: "u2", name: "Jane Smith", role: "member", avatarUrl: "https://i.pravatar.cc/150?img=5" },
      { userId: "u3", name: "Mike Johnson", role: "member", avatarUrl: "https://i.pravatar.cc/150?img=8" },
    ],
    joinCode: "ABC123"
  },
  {
    id: "h2",
    name: "College Dorm",
    address: "456 University Ave, Room 202",
    createdAt: "2025-02-10T14:45:00Z",
    members: [
      { userId: "u4", name: "Sarah Williams", role: "admin", avatarUrl: "https://i.pravatar.cc/150?img=9" },
      { userId: "u5", name: "Alex Chen", role: "member", avatarUrl: "https://i.pravatar.cc/150?img=3" },
      { userId: "u1", name: "John Doe", role: "member", avatarUrl: "https://i.pravatar.cc/150?img=1" },
    ],
    joinCode: "DEF456"
  },
  {
    id: "h3",
    name: "Beach House",
    address: "789 Ocean Drive",
    createdAt: "2025-03-05T09:15:00Z",
    members: [
      { userId: "u6", name: "Emily Davis", role: "admin", avatarUrl: "https://i.pravatar.cc/150?img=10" },
      { userId: "u7", name: "David Wilson", role: "member", avatarUrl: "https://i.pravatar.cc/150?img=12" },
      { userId: "u2", name: "Jane Smith", role: "member", avatarUrl: "https://i.pravatar.cc/150?img=5" },
    ],
    joinCode: "GHI789"
  }
];

// Current household (for household context)
export const dummyHousehold = dummyHouseholds[0];

// Chores data for all households
export const allDummyChores = [
  // Awesome Apartment Chores
  {
    id: "c1",
    name: "Clean Kitchen",
    description: "Wipe counters, clean stove, and mop floor",
    frequency: "weekly",
    dueDate: "2025-05-12T00:00:00Z",
    assignedTo: "John Doe",
    completedAt: null,
    completedBy: null,
    householdId: "h1"
  },
  {
    id: "c2",
    name: "Take out Trash",
    description: "Empty all trash bins and take to dumpster",
    frequency: "daily",
    dueDate: "2025-05-10T00:00:00Z",
    assignedTo: "Jane Smith",
    completedAt: "2025-05-10T08:30:00Z",
    completedBy: "Jane Smith",
    householdId: "h1"
  },
  {
    id: "c3",
    name: "Clean Bathroom",
    description: "Clean toilet, shower, and sink",
    frequency: "weekly",
    dueDate: "2025-05-11T00:00:00Z",
    assignedTo: "Mike Johnson",
    completedAt: null,
    completedBy: null,
    householdId: "h1"
  },
  {
    id: "c4",
    name: "Vacuum Living Room",
    description: "Vacuum carpet and dust furniture",
    frequency: "weekly",
    dueDate: "2025-05-15T00:00:00Z",
    assignedTo: "John Doe",
    completedAt: null,
    completedBy: null,
    householdId: "h1"
  },
  {
    id: "c5",
    name: "Water Plants",
    description: "Water all indoor plants",
    frequency: "weekly",
    dueDate: "2025-05-09T00:00:00Z",
    assignedTo: "Jane Smith",
    completedAt: null,
    completedBy: null,
    householdId: "h1"
  },
  
  // College Dorm Chores
  {
    id: "c6",
    name: "Clean Common Area",
    description: "Vacuum floor and organize study table",
    frequency: "weekly",
    dueDate: "2025-05-13T00:00:00Z",
    assignedTo: "Sarah Williams",
    completedAt: null,
    completedBy: null,
    householdId: "h2"
  },
  {
    id: "c7",
    name: "Wash Dishes",
    description: "Clean all dishes in the sink",
    frequency: "daily",
    dueDate: "2025-05-10T00:00:00Z",
    assignedTo: "Alex Chen",
    completedAt: "2025-05-10T10:15:00Z",
    completedBy: "Alex Chen",
    householdId: "h2"
  },
  {
    id: "c8",
    name: "Take Out Recycling",
    description: "Sort and take out recycling",
    frequency: "weekly",
    dueDate: "2025-05-14T00:00:00Z",
    assignedTo: "John Doe",
    completedAt: null,
    completedBy: null,
    householdId: "h2"
  },
  
  // Beach House Chores
  {
    id: "c9",
    name: "Sweep Deck",
    description: "Sweep sand off the deck and patio",
    frequency: "daily",
    dueDate: "2025-05-11T00:00:00Z",
    assignedTo: "Emily Davis",
    completedAt: null,
    completedBy: null,
    householdId: "h3"
  },
  {
    id: "c10",
    name: "Clean Grill",
    description: "Clean grill after weekend BBQ",
    frequency: "weekly",
    dueDate: "2025-05-13T00:00:00Z",
    assignedTo: "David Wilson",
    completedAt: null,
    completedBy: null,
    householdId: "h3"
  },
  {
    id: "c11",
    name: "Organize Beach Gear",
    description: "Clean and organize beach toys, chairs, and umbrellas",
    frequency: "weekly",
    dueDate: "2025-05-16T00:00:00Z",
    assignedTo: "Jane Smith",
    completedAt: null,
    completedBy: null,
    householdId: "h3"
  }
];

// Chores for current household
export const dummyChores = allDummyChores.filter(chore => chore.householdId === "h1");

// Expenses data for all households
export const allDummyExpenses = [
  // Awesome Apartment Expenses
  {
    id: "e1",
    description: "Groceries",
    amount: 85.75,
    date: "2025-05-08T14:30:00Z",
    paidBy: "John Doe",
    participants: ["John Doe", "Jane Smith", "Mike Johnson"],
    householdId: "h1"
  },
  {
    id: "e2",
    description: "Electricity Bill",
    amount: 120.50,
    date: "2025-05-05T09:15:00Z",
    paidBy: "Jane Smith",
    participants: ["John Doe", "Jane Smith", "Mike Johnson"],
    householdId: "h1"
  },
  {
    id: "e3",
    description: "Internet",
    amount: 65.99,
    date: "2025-05-03T11:45:00Z",
    paidBy: "Mike Johnson",
    participants: ["John Doe", "Jane Smith", "Mike Johnson"],
    householdId: "h1"
  },
  {
    id: "e4",
    description: "Cleaning Supplies",
    amount: 32.45,
    date: "2025-04-28T16:20:00Z",
    paidBy: "John Doe",
    participants: ["John Doe", "Jane Smith", "Mike Johnson"],
    householdId: "h1"
  },
  {
    id: "e5",
    description: "Dinner Takeout",
    amount: 54.80,
    date: "2025-04-25T19:00:00Z",
    paidBy: "Jane Smith",
    participants: ["John Doe", "Jane Smith"],
    householdId: "h1"
  },
  
  // College Dorm Expenses
  {
    id: "e6",
    description: "Pizza Night",
    amount: 42.50,
    date: "2025-05-07T20:00:00Z",
    paidBy: "Sarah Williams",
    participants: ["Sarah Williams", "Alex Chen", "John Doe"],
    householdId: "h2"
  },
  {
    id: "e7",
    description: "Dorm Supplies",
    amount: 78.25,
    date: "2025-05-02T15:30:00Z",
    paidBy: "Alex Chen",
    participants: ["Sarah Williams", "Alex Chen", "John Doe"],
    householdId: "h2"
  },
  {
    id: "e8",
    description: "Netflix Subscription",
    amount: 15.99,
    date: "2025-05-01T10:00:00Z",
    paidBy: "John Doe",
    participants: ["Sarah Williams", "Alex Chen", "John Doe"],
    householdId: "h2"
  },
  
  // Beach House Expenses
  {
    id: "e9",
    description: "BBQ Supplies",
    amount: 95.30,
    date: "2025-05-09T11:20:00Z",
    paidBy: "Emily Davis",
    participants: ["Emily Davis", "David Wilson", "Jane Smith"],
    householdId: "h3"
  },
  {
    id: "e10",
    description: "Water Bill",
    amount: 85.40,
    date: "2025-05-04T09:30:00Z",
    paidBy: "David Wilson",
    participants: ["Emily Davis", "David Wilson", "Jane Smith"],
    householdId: "h3"
  },
  {
    id: "e11",
    description: "New Beach Chairs",
    amount: 120.75,
    date: "2025-04-30T14:45:00Z",
    paidBy: "Jane Smith",
    participants: ["Emily Davis", "David Wilson", "Jane Smith"],
    householdId: "h3"
  }
];

// Expenses for current household
export const dummyExpenses = allDummyExpenses.filter(expense => expense.householdId === "h1");

// Balances data for all households
export const allDummyBalances = {
  // Awesome Apartment Balances
  "h1": [
    { userId: "u1", name: "John Doe", amount: 45.25 },
    { userId: "u2", name: "Jane Smith", amount: -25.75 },
    { userId: "u3", name: "Mike Johnson", amount: -19.50 }
  ],
  // College Dorm Balances
  "h2": [
    { userId: "u4", name: "Sarah Williams", amount: 22.50 },
    { userId: "u5", name: "Alex Chen", amount: 15.75 },
    { userId: "u1", name: "John Doe", amount: -38.25 }
  ],
  // Beach House Balances
  "h3": [
    { userId: "u6", name: "Emily Davis", amount: -30.20 },
    { userId: "u7", name: "David Wilson", amount: 12.45 },
    { userId: "u2", name: "Jane Smith", amount: 17.75 }
  ]
};

// Balances for current household
export const dummyBalances = allDummyBalances["h1"];
