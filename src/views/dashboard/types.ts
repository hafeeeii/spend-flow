export interface Requester {
  name: string
  email: string
  avatar: string
  role: string
  department: string
}

export interface Attachment {
  name: string
  size: string
  type: string
}

export interface Comment {
  author: string
  role: string
  avatar: string
  text: string
  timestamp: string
}

export interface TimelineItem {
  stage: string
  actor: string
  timestamp: string | null
  status: "completed" | "active" | "upcoming" | "rejected"
}

export interface PurchaseRequest {
  id: string
  title: string
  description: string
  requester: Requester
  vendor: string
  category: string
  amount: number
  currency: string
  budgetCategory: string
  status: "pending" | "approved" | "rejected"
  currentStage: string
  createdAt: string
  attachments: Attachment[]
  comments: Comment[]
  timeline: TimelineItem[]
}

export interface DepartmentBudget {
  department: string
  category: string
  spent: number
  limit: number
  color: string
}

export interface TrendMonthData {
  month: string
  spend: number
}
