"use client"

import { useState, useEffect } from "react"

export interface AuditLog {
  id: string
  user: string
  role: string
  action: string
  target: string
  timestamp: string
  changes: {
    before: string
    after: string
  }
}

const STORAGE_KEY = "spendflow_auditlogs"

const INITIAL_LOGS: AuditLog[] = [
  {
    id: "LOG-091",
    user: "Marcus Chen",
    role: "CFO",
    action: "Rejected Purchase Request SF-1077",
    target: "SF-1077",
    timestamp: "2026-06-02T10:05:00Z",
    changes: {
      before: "Status: Pending Finance Approval",
      after: "Status: Rejected (Reason: Q2 budget freeze on furniture)"
    }
  },
  {
    id: "LOG-090",
    user: "Alex Rivera",
    role: "Marketing Director",
    action: "Approved Purchase Request SF-1080",
    target: "SF-1080",
    timestamp: "2026-06-08T13:40:00Z",
    changes: {
      before: "Status: Pending Manager Approval",
      after: "Status: Pending Finance Approval"
    }
  },
  {
    id: "LOG-089",
    user: "System Rules Engine",
    role: "Automation",
    action: "Assigned Approval Flow to Request SF-1082",
    target: "SF-1082",
    timestamp: "2026-06-09T14:22:00Z",
    changes: {
      before: "New Request Created",
      after: "Assigned Ruleset: Default Spend Policy (Step 1: Design Manager Approval)"
    }
  },
  {
    id: "LOG-088",
    user: "Sarah Jenkins",
    role: "Lead Designer",
    action: "Created Purchase Request SF-1082",
    target: "SF-1082",
    timestamp: "2026-06-09T14:22:00Z",
    changes: {
      before: "None",
      after: "Created SF-1082 (Figma Professional licenses - $2,160)"
    }
  }
]

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS)
  const [isMounted, setIsMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setLogs(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse audit logs from localStorage", e)
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOGS))
    }
  }, [])

  const updateLogsState = (newLogs: AuditLog[]) => {
    setLogs(newLogs)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs))
      window.dispatchEvent(new Event("storage_auditlogs_updated"))
    }
  }

  // Synchronize state across instances/tabs
  useEffect(() => {
    const handleLogsUpdate = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setLogs(JSON.parse(stored))
        } catch (e) {
          console.error(e)
        }
      }
    }

    window.addEventListener("storage_auditlogs_updated", handleLogsUpdate)
    window.addEventListener("storage", handleLogsUpdate)

    return () => {
      window.removeEventListener("storage_auditlogs_updated", handleLogsUpdate)
      window.removeEventListener("storage", handleLogsUpdate)
    }
  }, [])

  const addLog = (logData: Omit<AuditLog, "id" | "timestamp">) => {
    const newId = `LOG-${Math.floor(100 + Math.random() * 900)}`
    const newLog: AuditLog = {
      id: newId,
      timestamp: new Date().toISOString(),
      ...logData
    }
    updateLogsState([newLog, ...logs])
    return newLog
  }

  const resetLogs = () => {
    updateLogsState(INITIAL_LOGS)
  }

  return {
    logs,
    addLog,
    resetLogs,
    isMounted
  }
}
