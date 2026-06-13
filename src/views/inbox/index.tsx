"use client"

import React, { useState, useEffect } from "react"
import { Check, X, FileText, CheckCircle2, Inbox } from "lucide-react"
import { useRequests } from "@/hooks/use-requests"
import { PurchaseRequest } from "@/views/dashboard/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function InboxQueue() {
  const { requests, approveRequest, rejectRequest, isMounted } = useRequests()
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  
  // Modal State
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Filter pending requests
  const pendingRequests = requests.filter(r => r.status === "pending")

  // Auto-select first item in queue if none selected or if selected is no longer pending
  useEffect(() => {
    if (pendingRequests.length > 0 && !selectedRequestId) {
      setSelectedRequestId(pendingRequests[0].id)
    } else if (pendingRequests.length > 0 && !pendingRequests.some(r => r.id === selectedRequestId)) {
      setSelectedRequestId(pendingRequests[0].id)
    }
  }, [pendingRequests, selectedRequestId])

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

  const selectedRequest = pendingRequests.find(r => r.id === selectedRequestId) || null

  const handleApprove = () => {
    if (!selectedRequest) return
    approveRequest(selectedRequest.id)
    setToast({
      message: `Request ${selectedRequest.id} approved successfully.`,
      type: "success"
    })
  }

  const handleRejectSubmit = () => {
    if (!selectedRequest || !rejectionReason.trim()) return
    rejectRequest(selectedRequest.id, rejectionReason)
    setShowRejectModal(false)
    setRejectionReason("")
    setToast({
      message: `Request ${selectedRequest.id} has been rejected.`,
      type: "success"
    })
  }

  // Format Helper functions
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } catch (e) {
      return dateStr
    }
  }

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch (e) {
      return dateStr
    }
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex border border-border rounded-xl bg-card overflow-hidden shadow-xs relative">
      {/* Left Column: Review Queue list */}
      <div className="w-full md:w-[380px] border-r border-border flex flex-col h-full bg-muted/20 shrink-0">
        <div className="p-4 border-b border-border bg-card">
          <h2 className="font-bold text-foreground text-sm tracking-tight">Review Queue</h2>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
            {pendingRequests.length} {pendingRequests.length === 1 ? "item" : "items"} remaining
          </p>
        </div>

        {/* Scrollable Items list */}
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {pendingRequests.map(req => {
            const isSelected = req.id === selectedRequestId
            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequestId(req.id)}
                className={cn(
                  "p-4 cursor-pointer transition-all duration-150 border-l-4 relative hover:bg-muted/40",
                  isSelected
                    ? "border-primary bg-primary/[0.03] dark:bg-primary/[0.02]"
                    : "border-transparent"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-[10px] font-bold tracking-wider uppercase",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}>
                    {req.id}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {formatDate(req.createdAt)}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-xs mt-1 truncate">
                  {req.title}
                </h3>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    {req.requester.name} • {req.requester.department}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    ${req.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            )
          })}
          
          {pendingRequests.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-xs font-medium mt-10">
              No pending reviews
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Detail Preview Panel */}
      <div className="flex-1 flex flex-col h-full bg-card relative">
        {pendingRequests.length === 0 ? (
          /* Empty Queue State */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-card z-10 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center mb-4 shadow-sm border border-emerald-100 dark:border-emerald-900/50">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-bold text-foreground text-sm">Inbox Cleared</h3>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
              All pending spend approvals have been processed. Great job keeping the wheels turning!
            </p>
          </div>
        ) : selectedRequest ? (
          /* Active Details View */
          <div className="flex flex-col h-full">
            {/* Header Actions */}
            <div className="px-6 py-3 border-b border-border bg-muted/10 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground">
                <span>Active Review:</span>
                <Badge variant="secondary" className="text-foreground font-bold px-2 py-0.5 rounded text-[10px]">
                  {selectedRequest.id}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleApprove}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition duration-150 flex items-center space-x-1.5 cursor-pointer h-8"
                >
                  <Check className="h-4.5 w-4.5 stroke-[2.5]" />
                  <span>Approve</span>
                </Button>
                <Button
                  onClick={() => setShowRejectModal(true)}
                  variant="outline"
                  size="sm"
                  className="border-rose-200 dark:border-rose-950 text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 hover:text-rose-700 rounded-lg text-xs font-semibold shadow-2xs transition duration-150 flex items-center space-x-1.5 cursor-pointer h-8"
                >
                  <X className="h-4.5 w-4.5" />
                  <span>Reject</span>
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-muted/40 text-muted-foreground">
                  {selectedRequest.category}
                </Badge>
                <h2 className="text-lg font-bold text-foreground tracking-tight mt-2 leading-tight">
                  {selectedRequest.title}
                </h2>
                <div className="flex items-center space-x-2.5 mt-3 text-xs text-muted-foreground">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={selectedRequest.requester.avatar} alt={selectedRequest.requester.name} />
                    <AvatarFallback className="text-[9px] font-bold">
                      {selectedRequest.requester.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold text-foreground">{selectedRequest.requester.name}</span>
                    <span className="mx-1">requested from</span>
                    <span className="font-semibold text-foreground">{selectedRequest.vendor}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Amount Specs */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-muted/10 border-border rounded-xl">
                  <CardContent className="p-4">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Total Amount</p>
                    <p className="text-xl font-extrabold text-foreground mt-1">
                      ${selectedRequest.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/10 border-border rounded-xl">
                  <CardContent className="p-4">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Assigned Budget</p>
                    <p className="text-xs font-bold text-foreground mt-2 truncate">
                      {selectedRequest.requester.department} - {selectedRequest.budgetCategory}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Justification */}
              <div className="space-y-1.5">
                <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Justification</h3>
                <p className="text-foreground text-xs leading-relaxed font-medium bg-muted/10 p-3.5 rounded-lg border border-border/55">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Attachments */}
              {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Attachments</h3>
                  <div className="space-y-2">
                    {selectedRequest.attachments.map((file, idx) => (
                      <Card
                        key={idx}
                        className="flex flex-row items-center justify-between p-3 border border-border rounded-lg bg-card hover:bg-muted/10 transition-colors duration-150 gap-0"
                      >
                        <CardContent className="flex items-center justify-between w-full p-0">
                          <div className="flex items-center space-x-2.5">
                            <div className="p-1.5 bg-muted rounded-md text-muted-foreground">
                              <FileText className="h-4.5 w-4.5" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-foreground leading-none">{file.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{file.size}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setToast({
                              message: `Opening preview for ${file.name}...`,
                              type: "success"
                            })}
                            className="text-xs font-bold text-primary hover:text-primary/80 hover:bg-primary/[0.04] px-3 h-7 cursor-pointer"
                          >
                            Preview
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline (Approval Path) */}
              <div className="space-y-3">
                <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Approval Path</h3>
                <div className="relative pl-6 border-l border-border ml-2 space-y-5 text-xs font-medium py-1">
                  {selectedRequest.timeline.map((step, idx) => {
                    const isCompleted = step.status === "completed"
                    const isActive = step.status === "active"
                    const isRejected = step.status === "rejected"
                    
                    return (
                      <div key={idx} className="relative group text-left">
                        {/* Status bullet dot */}
                        <div
                          className={cn(
                            "absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2",
                            isCompleted && "bg-emerald-600 border-emerald-600 text-white",
                            isActive && "bg-background border-emerald-500 text-emerald-500 animate-pulse",
                            isRejected && "bg-rose-600 border-rose-600 text-white",
                            step.status === "upcoming" && "bg-background border-muted text-muted-foreground"
                          )}
                        >
                          {isCompleted && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                          {isRejected && <X className="h-2.5 w-2.5 stroke-[3]" />}
                          {isActive && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                        </div>

                        {/* Step Details */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <span className={cn(
                              "font-bold text-xs block",
                              isActive ? "text-emerald-600 dark:text-emerald-500" : isRejected ? "text-rose-600" : "text-foreground"
                            )}>
                              {step.stage}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {step.actor}
                            </span>
                          </div>
                          {step.timestamp && (
                            <span className="text-[10px] text-muted-foreground font-semibold sm:text-right mt-0.5 sm:mt-0">
                              {formatDateTime(step.timestamp)}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Custom Rejection Reason Dialog Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg p-5 max-w-md w-full text-left space-y-4 animate-scale-in">
            <div>
              <h3 className="font-bold text-foreground text-sm tracking-tight">Reject Purchase Request</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Please provide a reason for rejecting request {selectedRequest?.id}. This justification will be visible in the history logs.
              </p>
            </div>
            <textarea
              placeholder="E.g., Over budget, requires vendor evaluation..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="w-full h-24 border border-input rounded-lg text-xs p-3 bg-muted/10 focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring resize-none font-medium"
            />
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason("")
                }}
                className="text-xs font-bold h-8 px-4 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim()}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold h-8 px-4 disabled:opacity-50 cursor-pointer"
              >
                Reject Request
              </Button>
            </div>
          </div>
        </div>
      )}

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
export default InboxQueue
