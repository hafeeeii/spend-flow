"use client"

import React, { useState, useEffect } from "react"
import { CheckCircle2, Sliders } from "lucide-react"
import { useBudgets } from "@/hooks/use-budgets"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { AdjustBudgetDrawer } from "./components/adjust-budget-drawer"

export function BudgetsView() {
  const { budgets, adjustBudget, isMounted } = useBudgets()

  // Sheet State
  const [isAdjustSheetOpen, setIsAdjustSheetOpen] = useState(false)

  // Toast State
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

  // Calculate totals
  const totalQ2Cap = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalConsumed = budgets.reduce((sum, b) => sum + b.spent, 0)
  const remainingRunways = totalQ2Cap - totalConsumed

  // Color helper for progress bar based on percentage
  const getProgressColor = (pct: number) => {
    if (pct >= 95) return "#f43f5e" // Rose/red
    if (pct >= 80) return "#f59e0b" // Amber/orange
    return "#635bff" // Brand purple/blue
  }

  // Text color helper for percentage
  const getPctTextColor = (pct: number) => {
    if (pct >= 95) return "text-rose-600 dark:text-rose-400"
    if (pct >= 80) return "text-amber-600 dark:text-amber-500"
    return "text-muted-foreground"
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Department Budgets</h1>
          <p className="text-xs text-muted-foreground mt-1">Track allocated caps, real-time consumption, and forecasting.</p>
        </div>
        <div>
          <Button
            onClick={() => setIsAdjustSheetOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-semibold shadow-xs transition duration-150 flex items-center space-x-1.5 cursor-pointer h-9"
          >
            <Sliders className="h-4 w-4" />
            <span>Adjust Budgets</span>
          </Button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border bg-card text-card-foreground shadow-2xs">
          <CardContent className="p-5 text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Q2 Cap</span>
            <div className="mt-2 text-2xl font-black text-foreground">
              ${totalQ2Cap.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">Authorized by the Board of Directors.</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card text-card-foreground shadow-2xs">
          <CardContent className="p-5 text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Consumed</span>
            <div className="mt-2 text-2xl font-black text-foreground">
              ${totalConsumed.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">Realized billing plus approved purchase drafts.</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card text-card-foreground shadow-2xs">
          <CardContent className="p-5 text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Remaining Runways</span>
            <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-500">
              ${remainingRunways.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">Free capital buffer for active Q2 requests.</p>
          </CardContent>
        </Card>
      </div>

      {/* Budgets Table */}
      <Card className="border-border shadow-2xs bg-card text-card-foreground overflow-hidden transition-colors duration-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <TableHead className="py-4 px-6 h-auto font-bold">Department</TableHead>
                  <TableHead className="py-4 px-6 h-auto font-bold">Budget Category</TableHead>
                  <TableHead className="py-4 px-6 h-auto font-bold">Limit Cap</TableHead>
                  <TableHead className="py-4 px-6 h-auto w-72 font-bold">Consumption Usage</TableHead>
                  <TableHead className="py-4 px-6 h-auto text-right font-bold">Available</TableHead>
                  <TableHead className="py-4 px-6 h-auto text-center font-bold">Spend Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs text-foreground divide-y divide-border/50">
                {budgets.map((b) => {
                  const pct = b.limit > 0 ? Math.min(Math.round((b.spent / b.limit) * 100), 100) : 0
                  const available = Math.max(b.limit - b.spent, 0)
                  const progressColor = getProgressColor(pct)

                  return (
                    <TableRow key={b.id} className="hover:bg-muted/20 transition duration-150">
                      <TableCell className="px-6 py-4.5 font-bold text-foreground whitespace-nowrap">
                        {b.department}
                      </TableCell>
                      <TableCell className="px-6 py-4.5 text-muted-foreground font-semibold">
                        {b.category}
                      </TableCell>
                      <TableCell className="px-6 py-4.5 font-bold text-foreground whitespace-nowrap">
                        ${b.limit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell className="px-6 py-4.5 min-w-[280px]">
                        <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                          <span className="text-muted-foreground">
                            ${b.spent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} spent
                          </span>
                          <span className={getPctTextColor(pct)}>
                            {pct}%
                          </span>
                        </div>
                        {/* Custom visual progress bar */}
                        <div className="relative h-2 w-full rounded-2xl bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-2xl transition-all duration-300"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: progressColor,
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4.5 text-right font-bold text-foreground whitespace-nowrap">
                        {available === 0 ? (
                          <span className="text-rose-600 dark:text-rose-400 font-extrabold">$0</span>
                        ) : (
                          `$${available.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4.5 text-center">
                        {/* Rising Green SVG Sparkline Trend */}
                        <svg className="h-6 w-24 overflow-visible mx-auto" viewBox="0 0 100 20">
                          <path
                            d="M 0 18 Q 20 12, 40 15 T 80 8 T 100 3"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                          />
                        </svg>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Adjust Budgets Sheet Drawer */}
      <AdjustBudgetDrawer
        open={isAdjustSheetOpen}
        onOpenChange={setIsAdjustSheetOpen}
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

export default BudgetsView
