"use client"

import { useState, useEffect } from "react"

export interface Budget {
  id: string
  department: string
  category: string
  limit: number
  spent: number
  color: string
}

const STORAGE_KEY = "spendflow_budgets"

const INITIAL_BUDGETS: Budget[] = [
  { id: "bg-1", department: "Engineering", category: "Cloud Hosting", limit: 80000, spent: 54200, color: "#635bff" },
  { id: "bg-2", department: "Engineering", category: "IT Equipment", limit: 30000, spent: 18500, color: "#635bff" },
  { id: "bg-3", department: "Design", category: "Software & SaaS", limit: 12000, spent: 8700, color: "#635bff" },
  { id: "bg-4", department: "Marketing", category: "Marketing & Events", limit: 50000, spent: 42100, color: "#f59e0b" },
  { id: "bg-5", department: "Operations", category: "Office Facilities", limit: 25000, spent: 12400, color: "#635bff" },
  { id: "bg-6", department: "Sales", category: "Travel & Client Relations", limit: 20000, spent: 19800, color: "#ef4444" },
]

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS)
  const [isMounted, setIsMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setBudgets(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse budgets from localStorage", e)
      }
    } else {
      // Seed initial budgets
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BUDGETS))
    }
  }, [])

  const updateBudgetsState = (newBudgets: Budget[]) => {
    setBudgets(newBudgets)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBudgets))
      window.dispatchEvent(new Event("storage_budgets_updated"))
    }
  }

  // Synchronize state across instances/tabs
  useEffect(() => {
    const handleBudgetsUpdate = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setBudgets(JSON.parse(stored))
        } catch (e) {
          console.error(e)
        }
      }
    }

    window.addEventListener("storage_budgets_updated", handleBudgetsUpdate)
    window.addEventListener("storage", handleBudgetsUpdate)

    return () => {
      window.removeEventListener("storage_budgets_updated", handleBudgetsUpdate)
      window.removeEventListener("storage", handleBudgetsUpdate)
    }
  }, [])

  const adjustBudget = (id: string, newLimit: number) => {
    const updated = budgets.map(b => {
      if (b.id !== id) return b
      return { ...b, limit: newLimit }
    })
    updateBudgetsState(updated)
  }

  const resetBudgets = () => {
    updateBudgetsState(INITIAL_BUDGETS)
  }

  return {
    budgets,
    adjustBudget,
    resetBudgets,
    isMounted
  }
}
