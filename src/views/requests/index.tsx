"use client"

import React, { useState, useEffect } from "react"
import { Search, Plus, ArrowUpRight, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react"
import { useRequests } from "@/hooks/use-requests"
import { PurchaseRequest } from "@/views/dashboard/types"
import { RequestDrawer } from "@/views/dashboard/components/request-drawer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreateRequestDrawer } from "./components/create-request-drawer"

// Budget limits are now managed inside components/create-request-drawer

export function RequestsView() {
  const { requests, addRequest, approveRequest, rejectRequest, isMounted } = useRequests()
  
  // Navigation drawer state for request details
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  
  // Dialog state for create request sheet
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false)
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deptFilter, setDeptFilter] = useState("all")
  const [catFilter, setCatFilter] = useState("all")
  
  // Success Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Clear toast after 3s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  if (!isMounted) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const selectedRequest = requests.find(r => r.id === selectedRequestId) || null

  const handleApprove = (id: string) => {
    approveRequest(id)
    setToast({
      message: `Request ${id} approved successfully.`,
      type: "success"
    })
  }

  const handleReject = (id: string, reason: string) => {
    rejectRequest(id, reason)
    setToast({
      message: `Request ${id} has been rejected.`,
      type: "success"
    })
  }

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = query === "" || 
      req.id.toLowerCase().includes(query) ||
      req.title.toLowerCase().includes(query) ||
      req.requester.name.toLowerCase().includes(query) ||
      req.vendor.toLowerCase().includes(query)

    const matchesStatus = statusFilter === "all" || statusFilter === "" || req.status === statusFilter
    const matchesDept = deptFilter === "all" || deptFilter === "" || req.requester.department === deptFilter
    const matchesCat = catFilter === "all" || catFilter === "" || req.category.toLowerCase() === catFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesDept && matchesCat
  })

  // Format Helper functions
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    } catch (e) {
      return dateStr
    }
  }

  // Budget calculations are now managed inside components/create-request-drawer

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Purchase Requests</h1>
          <p className="text-xs text-muted-foreground mt-1">Review, search, and audit all purchase requests.</p>
        </div>
        <div>
          <Button
            onClick={() => setIsCreateSheetOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-semibold shadow-xs transition duration-150 flex items-center space-x-1.5 cursor-pointer h-9"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create Request</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-card text-card-foreground border border-border rounded-xl p-4 shadow-2xs space-y-3 transition-colors duration-200">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-4 w-4" />
            </span>
            <Input
              type="text"
              placeholder="Search by title, requester, or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-input rounded-lg text-xs bg-background/50 focus:bg-background transition placeholder:text-muted-foreground"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 border-input rounded-lg bg-background text-foreground text-xs font-semibold w-[130px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Department Filter */}
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="h-8 border-input rounded-lg bg-background text-foreground text-xs font-semibold w-[150px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="h-8 border-input rounded-lg bg-background text-foreground text-xs font-semibold w-[140px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Hardware">Hardware</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Requests Data Table */}
      <Card className="border-border shadow-2xs bg-card text-card-foreground overflow-hidden transition-colors duration-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <TableHead className="py-3 px-6 h-auto font-bold">ID</TableHead>
                  <TableHead className="py-3 px-6 h-auto font-bold">Request Description</TableHead>
                  <TableHead className="py-3 px-6 h-auto font-bold">Requester</TableHead>
                  <TableHead className="py-3 px-6 h-auto font-bold">Category</TableHead>
                  <TableHead className="py-3 px-6 h-auto text-right font-bold">Amount</TableHead>
                  <TableHead className="py-3 px-6 h-auto font-bold">Current Stage</TableHead>
                  <TableHead className="py-3 px-6 h-auto font-bold">Status</TableHead>
                  <TableHead className="py-3 px-6 h-auto font-bold">Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs text-foreground divide-y divide-border/50">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                    <TableRow
                      key={req.id}
                      onClick={() => setSelectedRequestId(req.id)}
                      className="hover:bg-muted/40 transition cursor-pointer group"
                    >
                      <TableCell className="px-6 py-4 font-bold text-foreground whitespace-nowrap">
                        {req.id}
                      </TableCell>
                      <TableCell className="px-6 py-4 max-w-[260px] truncate">
                        <div className="font-bold text-foreground group-hover:text-primary transition flex items-center space-x-1">
                          <span className="truncate">{req.title}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-primary transition-all transform translate-y-0.5 -translate-x-0.5 group-hover:translate-y-0 group-hover:translate-x-0" />
                        </div>
                        <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                          Charged to {req.budgetCategory}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={req.requester.avatar} alt={req.requester.name} />
                            <AvatarFallback className="text-[9px] font-bold">
                              {req.requester.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-foreground">{req.requester.name}</div>
                            <div className="text-[9px] text-muted-foreground font-semibold mt-0.5">
                              {req.requester.department}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-semibold text-muted-foreground capitalize">
                        {req.category}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right font-extrabold text-foreground whitespace-nowrap">
                        ${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-muted-foreground font-semibold">
                        {req.currentStage}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {req.status === "approved" && (
                          <Badge className="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-none font-bold hover:bg-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full capitalize">
                            Approved
                          </Badge>
                        )}
                        {req.status === "pending" && (
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold hover:bg-amber-500/20 text-[10px] px-2 py-0.5 rounded-full capitalize">
                            Pending
                          </Badge>
                        )}
                        {req.status === "rejected" && (
                          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-none font-bold hover:bg-rose-500/20 text-[10px] px-2 py-0.5 rounded-full capitalize">
                            Rejected
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-muted-foreground font-semibold whitespace-nowrap">
                        {formatDate(req.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-0">
                      {/* Empty State Table Cell */}
                      <div className="py-16 px-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-4 text-lg">
                          🔍
                        </div>
                        <h3 className="font-bold text-foreground text-sm">No requests found</h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                          We couldn't find any purchase requests matching the current filters or search terms. Try refining your criteria.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Drawer Overlay for Request details */}
      <RequestDrawer
        request={selectedRequest}
        onClose={() => setSelectedRequestId(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Sheet Drawer for Creating Purchase Request */}
      <CreateRequestDrawer
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        onSuccess={(message) => setToast({ message, type: "success" })}
      />

      {/* Floating Success Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in text-xs font-bold border dark:border-slate-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default RequestsView
