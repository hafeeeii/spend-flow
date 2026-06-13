"use client"

import { useState, useEffect } from "react"
import { PurchaseRequest } from "@/views/dashboard/types"
import { INITIAL_REQUESTS } from "@/views/dashboard/mock-data"

const STORAGE_KEY = "spendflow_requests"

export function useRequests() {
  const [requests, setRequests] = useState<PurchaseRequest[]>(INITIAL_REQUESTS)
  const [isMounted, setIsMounted] = useState(false)

  // Initialize and load from localStorage after mounting
  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setRequests(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse requests from localStorage", e)
      }
    }
  }, [])

  const updateRequestsState = (newRequests: PurchaseRequest[]) => {
    setRequests(newRequests)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRequests))
      // Dispatch custom event to sync other instances of useRequests in the same session
      window.dispatchEvent(new Event("storage_requests_updated"))
    }
  }

  // Listen for storage events (including tab changes and local custom updates)
  useEffect(() => {
    const handleStorageUpdate = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setRequests(JSON.parse(stored))
        } catch (e) {
          console.error(e)
        }
      }
    };
    
    window.addEventListener("storage_requests_updated", handleStorageUpdate)
    window.addEventListener("storage", handleStorageUpdate)
    
    return () => {
      window.removeEventListener("storage_requests_updated", handleStorageUpdate)
      window.removeEventListener("storage", handleStorageUpdate)
    }
  }, [])

  const approveRequest = (id: string) => {
    const updated = requests.map(req => {
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

      return {
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
    })
    updateRequestsState(updated)
  }

  const rejectRequest = (id: string, reason: string) => {
    if (!reason.trim()) return
    const updated = requests.map(req => {
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

      return {
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
    })
    updateRequestsState(updated)
  }

  const resetRequests = () => {
    updateRequestsState(INITIAL_REQUESTS)
  }

  return {
    requests,
    approveRequest,
    rejectRequest,
    resetRequests,
    isMounted
  }
}
