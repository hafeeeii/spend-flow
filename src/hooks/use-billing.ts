"use client"

import { useState, useEffect } from "react"

export interface Invoice {
  id: string
  planName: string
  date: string
  amount: string
  status: "paid" | "pending"
}

export interface BillingState {
  currentPlan: string
  priceDetail: string
  nextBillingDate: string
  invoices: Invoice[]
}

const STORAGE_KEY = "spendflow_billing"

const INITIAL_BILLING: BillingState = {
  currentPlan: "Growth Tier",
  priceDetail: "Free trial active until July 11, 2026 ($0/mo).",
  nextBillingDate: "2026-07-11T00:00:00.000Z",
  invoices: [
    {
      id: "INV-091",
      planName: "Growth Plan (June 2026)",
      date: "June 10, 2026",
      amount: "$0.00",
      status: "paid",
    },
  ],
}

export function useBilling() {
  const [billing, setBilling] = useState<BillingState>(INITIAL_BILLING)
  const [isMounted, setIsMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setBilling(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse billing from localStorage", e)
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BILLING))
    }
  }, [])

  const updateBillingState = (newBilling: BillingState) => {
    setBilling(newBilling)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBilling))
      window.dispatchEvent(new Event("storage_billing_updated"))
    }
  }

  // Synchronize state across instances/tabs
  useEffect(() => {
    const handleBillingUpdate = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setBilling(JSON.parse(stored))
        } catch (e) {
          console.error(e)
        }
      }
    }

    window.addEventListener("storage_billing_updated", handleBillingUpdate)
    window.addEventListener("storage", handleBillingUpdate)

    return () => {
      window.removeEventListener("storage_billing_updated", handleBillingUpdate)
      window.removeEventListener("storage", handleBillingUpdate)
    }
  }, [])

  const upgradePlan = (planName: string, priceAmount: string) => {
    const nextDate = new Date()
    nextDate.setMonth(nextDate.getMonth() + 1)
    
    // Format options: Month Day, Year
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    const formattedNextDate = formatter.format(nextDate)
    const formattedCurrentMonthYear = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date())

    const newInvoice: Invoice = {
      id: `INV-${Math.floor(100 + Math.random() * 900)}`,
      planName: `${planName.replace(" Tier", "")} Plan (${formattedCurrentMonthYear})`,
      date: formatter.format(new Date()),
      amount: priceAmount,
      status: "paid",
    }

    const updatedBilling: BillingState = {
      currentPlan: planName,
      priceDetail: `Billed monthly at ${priceAmount}. Next billing date is ${formattedNextDate}.`,
      nextBillingDate: nextDate.toISOString(),
      invoices: [newInvoice, ...billing.invoices],
    }

    const beforePlan = billing.currentPlan
    updateBillingState(updatedBilling)

    // Append to audit logs
    const storedLogs = localStorage.getItem("spendflow_auditlogs")
    const auditLogs = storedLogs ? JSON.parse(storedLogs) : []
    const newLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      user: "Alex Rivera",
      role: "Admin",
      action: `Upgraded Workspace Plan`,
      target: planName,
      timestamp: new Date().toISOString(),
      changes: {
        before: `Active Plan: ${beforePlan}`,
        after: `Active Plan: ${planName} (Billed at ${priceAmount})`,
      },
    }
    localStorage.setItem("spendflow_auditlogs", JSON.stringify([newLog, ...auditLogs]))
    window.dispatchEvent(new Event("storage_auditlogs_updated"))

    return updatedBilling
  }

  return {
    billing,
    upgradePlan,
    isMounted,
  }
}
