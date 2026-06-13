"use client"

import { useState, useEffect } from "react"

export interface Vendor {
  id: string
  name: string
  category: string
  activeContracts: number
  annualSpend: number
  risk: "Low" | "Medium" | "High"
  logo: string
}

const STORAGE_KEY = "spendflow_vendors"

const INITIAL_VENDORS: Vendor[] = [
  { id: "vd-1", name: "Amazon Web Services", category: "Cloud Infrastructure", activeContracts: 1, annualSpend: 624500, risk: "Low", logo: "AWS" },
  { id: "vd-2", name: "Figma", category: "Design Tools", activeContracts: 1, annualSpend: 25920, risk: "Low", logo: "FI" },
  { id: "vd-3", name: "Apple", category: "Hardware Supplier", activeContracts: 0, annualSpend: 48900, risk: "Low", logo: "AP" },
  { id: "vd-4", name: "Slack Technologies", category: "Communications", activeContracts: 1, annualSpend: 18400, risk: "Low", logo: "SL" },
  { id: "vd-5", name: "Herman Miller", category: "Furniture", activeContracts: 0, annualSpend: 9200, risk: "Medium", logo: "HM" },
  { id: "vd-6", name: "SaaStr Inc.", category: "Events & Sponsorship", activeContracts: 1, annualSpend: 15000, risk: "Low", logo: "SA" },
  { id: "vd-7", name: "Zoom Video", category: "Communications", activeContracts: 1, annualSpend: 14200, risk: "Low", logo: "ZO" },
  { id: "vd-8", name: "GitHub", category: "Developer Tools", activeContracts: 1, annualSpend: 38400, risk: "Low", logo: "GH" },
]

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS)
  const [isMounted, setIsMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setVendors(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse vendors from localStorage", e)
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VENDORS))
    }
  }, [])

  const updateVendorsState = (newVendors: Vendor[]) => {
    setVendors(newVendors)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVendors))
      window.dispatchEvent(new Event("storage_vendors_updated"))
    }
  }

  // Synchronize state across instances/tabs
  useEffect(() => {
    const handleVendorsUpdate = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setVendors(JSON.parse(stored))
        } catch (e) {
          console.error(e)
        }
      }
    }

    window.addEventListener("storage_vendors_updated", handleVendorsUpdate)
    window.addEventListener("storage", handleVendorsUpdate)

    return () => {
      window.removeEventListener("storage_vendors_updated", handleVendorsUpdate)
      window.removeEventListener("storage", handleVendorsUpdate)
    }
  }, [])

  const addVendor = (vendorData: {
    name: string
    category: string
    activeContracts: number
    annualSpend: number
    risk: "Low" | "Medium" | "High"
  }) => {
    // Generate initials logo
    const initials = vendorData.name
      .split(" ")
      .map(w => w.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 3) // AWS or FI etc.

    const newIdVal = vendors.length + 1
    const newVendor: Vendor = {
      id: `vd-${newIdVal}-${Date.now()}`,
      name: vendorData.name,
      category: vendorData.category,
      activeContracts: Number(vendorData.activeContracts) || 0,
      annualSpend: Number(vendorData.annualSpend) || 0,
      risk: vendorData.risk || "Low",
      logo: initials || "VN"
    }

    const updated = [newVendor, ...vendors]
    updateVendorsState(updated)

    // Log the registration in auditLogs
    const storedLogs = localStorage.getItem("spendflow_auditlogs")
    const auditLogs = storedLogs ? JSON.parse(storedLogs) : []
    const newLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      user: "Alex Rivera",
      role: "Design Manager",
      action: `Registered New Vendor ${newVendor.name}`,
      target: newVendor.name,
      timestamp: new Date().toISOString(),
      changes: {
        before: "Status: Unregistered",
        after: `Registered ${newVendor.name} (${newVendor.category} - Risk: ${newVendor.risk})`
      }
    }
    localStorage.setItem("spendflow_auditlogs", JSON.stringify([newLog, ...auditLogs]))
    window.dispatchEvent(new Event("storage_auditlogs_updated"))

    return newVendor
  }

  const resetVendors = () => {
    updateVendorsState(INITIAL_VENDORS)
  }

  return {
    vendors,
    addVendor,
    resetVendors,
    isMounted
  }
}
