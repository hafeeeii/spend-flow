"use client"

import React, { useState } from "react"
import { useVendors } from "@/hooks/use-vendors"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SpendTrendsChart } from "./components/spend-trends-chart"
import { DepartmentSpendChart } from "./components/department-spend-chart"
import { CheckCircle2, TrendingUp, Download } from "lucide-react"

export function AnalyticsView() {
  const { vendors, isMounted } = useVendors()
  const [toast, setToast] = useState<string | null>(null)

  // Clear toast after 3s
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleExport = () => {
    setToast("Exporting CSV spend report...")
  }

  // Get Top Vendors sorted by spend
  const topVendors = isMounted
    ? [...vendors].sort((a, b) => b.annualSpend - a.annualSpend).slice(0, 4)
    : []

  // Deterministic logo background color generator
  const getLogoColorClass = (logo: string) => {
    const colors = [
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/30",
      "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-100/30",
      "bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 border border-pink-100/30",
      "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 border border-teal-100/30",
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100/30",
      "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100/30",
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/30",
      "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100/30",
    ]
    let hash = 0
    for (let i = 0; i < logo.length; i++) {
      hash = logo.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative text-left">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Reports & Analytics</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Granular insights on organizational spending velocity and workflow latency.
          </p>
        </div>
        <div>
          <Button
            onClick={handleExport}
            variant="outline"
            className="px-4 py-2 border border-border hover:bg-muted text-foreground rounded-lg text-xs font-semibold shadow-2xs transition duration-150 flex items-center space-x-1.5 cursor-pointer h-9"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Data</span>
          </Button>
        </div>
      </div>

      {/* Highlights metrics cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card text-card-foreground shadow-2xs">
          <CardContent className="p-4 flex flex-col items-start justify-between h-full">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Average Cycle Time</span>
              <div className="mt-1 text-2xl font-bold text-foreground">14.8 hrs</div>
            </div>
            <span className="text-[9px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/30 px-1.5 py-0.5 rounded font-bold mt-2">
              -4.2 hrs MoM
            </span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card text-card-foreground shadow-2xs">
          <CardContent className="p-4 flex flex-col items-start justify-between h-full">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Budget Variance</span>
              <div className="mt-1 text-2xl font-bold text-foreground">-8.4%</div>
            </div>
            <span className="text-[9px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded font-bold mt-2">
              Under budget target
            </span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card text-card-foreground shadow-2xs">
          <CardContent className="p-4 flex flex-col items-start justify-between h-full">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Auto-Approved Rate</span>
              <div className="mt-1 text-2xl font-bold text-foreground">38.2%</div>
            </div>
            <span className="text-[9px] text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100/30 px-1.5 py-0.5 rounded font-bold mt-2">
              Spend &lt; $500
            </span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card text-card-foreground shadow-2xs">
          <CardContent className="p-4 flex flex-col items-start justify-between h-full">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Audit Compliance</span>
              <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-500">100%</div>
            </div>
            <span className="text-[9px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded font-bold mt-2">
              All approvals documented
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Graphs grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spend Velocity */}
        <Card className="border-border shadow-2xs bg-card text-card-foreground">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Monthly Spend Velocity</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Rolling 6-month aggregate billing.</p>
            </div>
            <div className="h-44 w-full flex items-center justify-center">
              <SpendTrendsChart />
            </div>
          </CardContent>
        </Card>

        {/* Department Spend Shares */}
        <Card className="border-border shadow-2xs bg-card text-card-foreground">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Department Spend Shares</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Distribution of total Q2 allocated spend.</p>
            </div>
            <div className="h-44 w-full flex items-center justify-center">
              <DepartmentSpendChart />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latency and Top Vendors grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Cycle Latency (SLA) */}
        <Card className="border-border shadow-2xs bg-card text-card-foreground">
          <CardContent className="p-6 space-y-5">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-4">Approval Cycle Latency (SLA)</h3>
            
            {/* Manager Review */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                <span>Manager Review</span>
                <span className="font-bold text-foreground">1.8 hours average</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: "12%" }}></div>
              </div>
            </div>

            {/* Finance Compliance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                <span>Finance Compliance</span>
                <span className="font-bold text-foreground">8.2 hours average</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: "45%" }}></div>
              </div>
            </div>

            {/* Executive CFO Sign-off */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                <span>Executive CFO Sign-off</span>
                <span className="font-bold text-foreground">32.4 hours average</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: "85%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Vendors List */}
        <Card className="border-border shadow-2xs bg-card text-card-foreground">
          <CardContent className="p-6">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-4">Top Q2 Vendors by Spend</h3>
            <div className="space-y-3.5">
              {!isMounted ? (
                <div className="py-12 text-center text-xs font-semibold text-muted-foreground animate-pulse">
                  Loading top vendors...
                </div>
              ) : topVendors.length === 0 ? (
                <div className="py-12 text-center text-xs font-semibold text-muted-foreground italic">
                  No vendors registered.
                </div>
              ) : (
                topVendors.map((v, idx) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 p-2.5 hover:bg-muted/30 rounded-lg transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-muted-foreground font-extrabold text-[10px] w-4">#{idx + 1}</span>
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] uppercase ${getLogoColorClass(
                          v.logo
                        )}`}
                      >
                        {v.logo}
                      </div>
                      <span className="font-bold text-foreground">{v.name}</span>
                    </div>
                    <span className="font-bold text-foreground">${v.annualSpend.toLocaleString("en-US")}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in text-xs font-bold border dark:border-slate-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
export default AnalyticsView
