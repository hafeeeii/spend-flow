"use client"

import React, { useState } from "react"
import { Plus, Inbox } from "lucide-react"

import { INITIAL_REQUESTS, INITIAL_BUDGETS, TREND_DATA } from "./mock-data"
import { PurchaseRequest } from "./types"

import { StatCards } from "./components/stat-cards"
import { SpendChart } from "./components/spend-chart"
import { DepartmentChart } from "./components/department-chart"
import { RequestsTable } from "./components/requests-table"
import { Bottlenecks } from "./components/bottlenecks"
import { RequestDrawer } from "./components/request-drawer"

export function Dashboard() {
  const [requests, setRequests] = useState<PurchaseRequest[]>(INITIAL_REQUESTS)
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null)
  const [tableFilter, setTableFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  // Dynamically calculate dashboard counts
  const pendingRequests = requests.filter(r => r.status === "pending")
  const activeApprovalsCount = pendingRequests.length
  
  // Base total monthly spend matching the prototype
  const totalMonthlySpend = 84322.50 

  // Handler to approve a request
  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== id) return req
      
      const activeIdx = req.timeline.findIndex(t => t.status === "active")
      const updatedTimeline = [...req.timeline]
      let nextStage = req.currentStage
      let nextStatus = req.status

      if (activeIdx !== -1) {
        updatedTimeline[activeIdx] = {
          ...updatedTimeline[activeIdx],
          status: "completed",
          timestamp: new Date().toISOString()
        }

        if (activeIdx + 1 < updatedTimeline.length) {
          updatedTimeline[activeIdx + 1] = {
            ...updatedTimeline[activeIdx + 1],
            status: "active"
          }
          nextStage = updatedTimeline[activeIdx + 1].stage
        } else {
          nextStage = "Approved"
          nextStatus = "approved"
        }
      }

      const updatedReq = {
        ...req,
        status: nextStatus as "approved" | "pending" | "rejected",
        currentStage: nextStage,
        timeline: updatedTimeline,
        comments: [
          ...req.comments,
          {
            author: "Alex Rivera",
            role: "Design Manager",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            text: `Approved request step. Stage updated to: ${nextStage}`,
            timestamp: new Date().toISOString()
          }
        ]
      }

      // Sync selection drawer
      if (selectedRequest?.id === id) {
        setSelectedRequest(updatedReq)
      }

      return updatedReq
    }))
  }

  // Handler to reject a request
  const handleReject = (id: string, reason: string) => {
    if (!reason.trim()) return
    setRequests(prev => prev.map(req => {
      if (req.id !== id) return req

      const activeIdx = req.timeline.findIndex(t => t.status === "active")
      const updatedTimeline = [...req.timeline]

      if (activeIdx !== -1) {
        updatedTimeline[activeIdx] = {
          ...updatedTimeline[activeIdx],
          status: "rejected",
          timestamp: new Date().toISOString()
        }
      }

      const updatedReq = {
        ...req,
        status: "rejected" as const,
        currentStage: "Rejected",
        timeline: updatedTimeline,
        comments: [
          ...req.comments,
          {
            author: "Alex Rivera",
            role: "Design Manager",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            text: `Rejected request. Reason: ${reason}`,
            timestamp: new Date().toISOString()
          }
        ]
      }

      // Sync selection drawer
      if (selectedRequest?.id === id) {
        setSelectedRequest(updatedReq)
      }

      return updatedReq
    }))
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Acme Corp spend and governance health overview.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow transition-all duration-150 flex items-center space-x-1.5 cursor-pointer">
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>New Request</span>
          </button>
          <button 
            onClick={() => setTableFilter("pending")} 
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs hover:border-slate-300 transition-all duration-150 flex items-center space-x-1.5 cursor-pointer bg-white"
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
