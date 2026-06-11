import { PurchaseRequest, DepartmentBudget, TrendMonthData } from "./types"

export const INITIAL_REQUESTS: PurchaseRequest[] = [
  {
    id: "SF-1082",
    title: "Figma Professional licenses (x12)",
    description: "Annual subscription renewal for the design team and product managers. Necessary for upcoming feature redesign sprints.",
    requester: {
      name: "Sarah Jenkins",
      email: "sarah.j@acme.co",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Lead Designer",
      department: "Design"
    },
    vendor: "Figma",
    category: "Software",
    amount: 2160,
    currency: "USD",
    budgetCategory: "Software & SaaS",
    status: "pending",
    currentStage: "Finance Approval",
    createdAt: "2026-06-09T14:22:00Z",
    attachments: [
      { name: "figma_quote_2026.pdf", size: "142 KB", type: "pdf" }
    ],
    comments: [
      {
        author: "Alex Rivera",
        role: "Design Manager",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        text: "Approved this from the design budget perspective. Handing off to Finance for general approval.",
        timestamp: "2026-06-09T16:05:00Z"
      }
    ],
    timeline: [
      { stage: "Created", actor: "Sarah Jenkins", timestamp: "2026-06-09T14:22:00Z", status: "completed" },
      { stage: "Manager Approval", actor: "Alex Rivera", timestamp: "2026-06-09T16:05:00Z", status: "completed" },
      { stage: "Finance Approval", actor: "Finance Team", timestamp: null, status: "active" },
      { stage: "CFO Approval", actor: "Marcus Chen", timestamp: null, status: "upcoming" }
    ]
  },
  {
    id: "SF-1081",
    title: "MacBook Pro 16\" for New Engineer",
    description: "M3 Max, 32GB RAM, 1TB SSD. Standard hardware package for senior frontend engineer starting next week.",
    requester: {
      name: "David Kim",
      email: "d.kim@acme.co",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Engineering Manager",
      department: "Engineering"
    },
    vendor: "Apple",
    category: "Hardware",
    amount: 3499,
    currency: "USD",
    budgetCategory: "IT Equipment",
    status: "pending",
    currentStage: "Manager Approval",
    createdAt: "2026-06-10T09:15:00Z",
    attachments: [
      { name: "apple_cart_spec.png", size: "324 KB", type: "image" }
    ],
    comments: [],
    timeline: [
      { stage: "Created", actor: "David Kim", timestamp: "2026-06-10T09:15:00Z", status: "completed" },
      { stage: "Manager Approval", actor: "Alex Rivera", timestamp: null, status: "active" },
      { stage: "Finance Approval", actor: "Finance Team", timestamp: null, status: "upcoming" }
    ]
  },
  {
    id: "SF-1080",
    title: "Q3 Marketing Event Sponsor - SaaStr",
    description: "Bronze tier sponsorship package for the SaaStr Annual Conference to boost enterprise lead generation.",
    requester: {
      name: "Elena Rostova",
      email: "elena@acme.co",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "VP Marketing",
      department: "Marketing"
    },
    vendor: "SaaStr Inc.",
    category: "Marketing",
    amount: 15000,
    currency: "USD",
    budgetCategory: "Marketing & Events",
    status: "pending",
    currentStage: "CFO Approval",
    createdAt: "2026-06-08T11:00:00Z",
    attachments: [
      { name: "saastr_sponsorship_proposal.pdf", size: "1.2 MB", type: "pdf" }
    ],
    comments: [
      {
        author: "Alex Rivera",
        role: "Marketing Director",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        text: "This fits our Q3 event calendar and has been pre-budgeted.",
        timestamp: "2026-06-08T13:40:00Z"
      },
      {
        author: "Finance Team",
        role: "Finance Operations",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        text: "Verified budget availability under 'Marketing & Events'. Forwarded to Marcus for final CFO signoff due to amount > $5k.",
        timestamp: "2026-06-08T17:15:00Z"
      }
    ],
    timeline: [
      { stage: "Created", actor: "Elena Rostova", timestamp: "2026-06-08T11:00:00Z", status: "completed" },
      { stage: "Manager Approval", actor: "Alex Rivera", timestamp: "2026-06-08T13:40:00Z", status: "completed" },
      { stage: "Finance Approval", actor: "Finance Team", timestamp: "2026-06-08T17:15:00Z", status: "completed" },
      { stage: "CFO Approval", actor: "Marcus Chen", timestamp: null, status: "active" }
    ]
  },
  {
    id: "SF-1079",
    title: "AWS Cloud Infrastructure - May 2026",
    description: "Monthly consumption charges for production cluster, databases, and S3 storage backups.",
    requester: {
      name: "David Kim",
      email: "d.kim@acme.co",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Engineering Manager",
      department: "Engineering"
    },
    vendor: "Amazon Web Services",
    category: "Software",
    amount: 8432.50,
    currency: "USD",
    budgetCategory: "Cloud Hosting",
    status: "approved",
    currentStage: "Approved",
    createdAt: "2026-06-05T08:00:00Z",
    attachments: [
      { name: "aws_invoice_may_2026.pdf", size: "482 KB", type: "pdf" }
    ],
    comments: [],
    timeline: [
      { stage: "Created", actor: "David Kim", timestamp: "2026-06-05T08:00:00Z", status: "completed" },
      { stage: "Manager Approval", actor: "David Kim (Self)", timestamp: "2026-06-05T08:05:00Z", status: "completed" },
      { stage: "Finance Approval", actor: "Finance Team", timestamp: "2026-06-05T10:15:00Z", status: "completed" },
      { stage: "CFO Approval", actor: "Marcus Chen", timestamp: "2026-06-05T14:30:00Z", status: "completed" }
    ]
  },
  {
    id: "SF-1078",
    title: "Slack Enterprise Grid Upgrade",
    description: "Converting 45 active guest users to full members and aligning billing cycles.",
    requester: {
      name: "Marcus Chen",
      email: "m.chen@acme.co",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "CFO",
      department: "Finance"
    },
    vendor: "Slack Technologies",
    category: "Software",
    amount: 540,
    currency: "USD",
    budgetCategory: "Software & SaaS",
    status: "approved",
    currentStage: "Approved",
    createdAt: "2026-06-04T10:30:00Z",
    attachments: [],
    comments: [],
    timeline: [
      { stage: "Created", actor: "Marcus Chen", timestamp: "2026-06-04T10:30:00Z", status: "completed" },
      { stage: "Manager Approval", actor: "Marcus Chen", timestamp: "2026-06-04T10:30:00Z", status: "completed" },
      { stage: "Finance Approval", actor: "Finance Team", timestamp: "2026-06-04T11:00:00Z", status: "completed" }
    ]
  },
  {
    id: "SF-1077",
    title: "Ergonomic Chairs for London Office",
    description: "Purchase of 8 Herman Miller Aeron chairs for the newly renovated London team workspace.",
    requester: {
      name: "Jessica Taylor",
      email: "j.taylor@acme.co",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Office Manager",
      department: "Operations"
    },
    vendor: "Herman Miller",
    category: "Equipment",
    amount: 9200,
    currency: "USD",
    budgetCategory: "Office Facilities",
    status: "rejected",
    currentStage: "Rejected",
    createdAt: "2026-06-01T15:20:00Z",
    attachments: [
      { name: "hm_london_quote.pdf", size: "812 KB", type: "pdf" }
    ],
    comments: [
      {
        author: "Marcus Chen",
        role: "CFO",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        text: "We are currently pausing non-critical office furniture spending in Q2. Let's revisit this in Q3.",
        timestamp: "2026-06-02T10:05:00Z"
      }
    ],
    timeline: [
      { stage: "Created", actor: "Jessica Taylor", timestamp: "2026-06-01T15:20:00Z", status: "completed" },
      { stage: "Manager Approval", actor: "Alex Rivera", timestamp: "2026-06-01T17:40:00Z", status: "completed" },
      { stage: "Finance Approval", actor: "Marcus Chen", timestamp: "2026-06-02T10:05:00Z", status: "rejected" }
    ]
  }
]

export const INITIAL_BUDGETS: DepartmentBudget[] = [
  { department: "Engineering", category: "Cloud Hosting & IT", spent: 72700, limit: 110000, color: "#635bff" },
  { department: "Marketing", category: "Marketing & Events", spent: 42100, limit: 50000, color: "#ec4899" },
  { department: "Sales", category: "Travel & Clients", spent: 19800, limit: 20000, color: "#f59e0b" },
  { department: "Operations", category: "Office Facilities", spent: 12400, limit: 25000, color: "#14b8a6" },
  { department: "Design", category: "Software & SaaS", spent: 8700, limit: 12000, color: "#a855f7" }
]

export const TREND_DATA: TrendMonthData[] = [
  { month: "Jan", spend: 45000 },
  { month: "Feb", spend: 52000 },
  { month: "Mar", spend: 49000 },
  { month: "Apr", spend: 63000 },
  { month: "May", spend: 75000 },
  { month: "Jun", spend: 84322.50 }
]
