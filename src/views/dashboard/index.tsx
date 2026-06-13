"use client"

import React, { useState } from "react"
import { Plus, Inbox } from "lucide-react"
import { useRouter } from "next/navigation"

import { INITIAL_BUDGETS, TREND_DATA } from "./mock-data"
import { PurchaseRequest } from "./types"
import { useRequests } from "@/hooks/use-requests"

import { StatCards } from "./components/stat-cards"
import { SpendChart } from "./components/spend-chart"
import { DepartmentChart } from "./components/department-chart"
import { RequestsTable } from "./components/requests-table"
import { Bottlenecks } from "./components/bottlenecks"
import { RequestDrawer } from "./components/request-drawer"

export function Dashboard() {
  const router = useRouter()
  const { requests, approveRequest, rejectRequest } = useRequests()
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [tableFilter, setTableFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const selectedRequest = requests.find(r => r.id === selectedRequestId) || null
  const setSelectedRequest = (req: PurchaseRequest | null) => {
    setSelectedRequestId(req ? req.id : null)
  }

  // Dynamically calculate dashboard counts
  const pendingRequests = requests.filter(r => r.status === "pending")
  const activeApprovalsCount = pendingRequests.length
  
  // Base total monthly spend matching the prototype
  const totalMonthlySpend = 84322.50 

  // Handler to approve a request
  const handleApprove = (id: string) => {
    approveRequest(id)
  }

  // Handler to reject a request
  const handleReject = (id: string, reason: string) => {
    rejectRequest(id, reason)
  }

  // Filter list
  const filteredRequests = requests.filter(req => {
    if (tableFilter === "all") return true
    return req.status === tableFilter
  })

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">Acme Corp spend and governance health overview.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-semibold shadow-xs hover:shadow transition-all duration-150 flex items-center space-x-1.5 cursor-pointer">
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>New Request</span>
          </button>
          <button 
            onClick={() => router.push("/inbox")} 
            className="px-4 py-2 border border-input hover:bg-muted text-foreground rounded-lg text-xs font-semibold shadow-2xs transition-all duration-150 flex items-center space-x-1.5 cursor-pointer bg-background"
          >
            <Inbox className="h-4 w-4" />
            <span>Go to Inbox</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <StatCards 
        totalMonthlySpend={totalMonthlySpend} 
        activeApprovalsCount={activeApprovalsCount} 
        allocatedRatio={64.5} 
      />

      {/* Visual SVG Trend & Department Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SpendChart data={TREND_DATA} />
        <DepartmentChart data={INITIAL_BUDGETS} />
      </div>

      {/* Request Table & SLA warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RequestsTable 
          requests={filteredRequests} 
          tableFilter={tableFilter} 
          onFilterChange={setTableFilter} 
          onRequestSelect={setSelectedRequest} 
        />
        <Bottlenecks />
      </div>

      {/* Slide-out Request Details Overlay Drawer */}
      <RequestDrawer 
        request={selectedRequest} 
        onClose={() => setSelectedRequest(null)} 
        onApprove={handleApprove} 
        onReject={handleReject} 
      />

    </div>
  )
}
export default Dashboard
