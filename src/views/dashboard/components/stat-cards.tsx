import React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface StatCardsProps {
  totalMonthlySpend: number
  activeApprovalsCount: number
  allocatedRatio?: number
}

export function StatCards({ 
  totalMonthlySpend, 
  activeApprovalsCount, 
  allocatedRatio = 64.5 
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Monthly Spend */}
      <Card className="border-slate-100/80 shadow-2xs bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spend This Month</span>
          <Badge className="bg-emerald-50 hover:bg-emerald-50 text-emerald-600 font-bold border-none text-[10px] px-2 py-0.5 rounded-full">
            +12.4% vs May
          </Badge>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ${totalMonthlySpend.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-400 font-medium">USD</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Aggregated across all credit cards and invoices.</p>
        </CardContent>
      </Card>

      {/* Card 2: Budget Usage */}
      <Card className="border-slate-100/80 shadow-2xs bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Budget Governance</span>
          <Badge className="bg-amber-50 hover:bg-amber-50 text-amber-600 font-bold border-none text-[10px] px-2 py-0.5 rounded-full">
            Near threshold (1 dept)
          </Badge>
        </CardHeader>
        <CardContent className="pt-2 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{allocatedRatio}%</span>
              <span className="text-xs text-slate-400 font-medium">allocated</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">$140,022.50 spent of $217,000.00 limits.</p>
          </div>
          {/* SVG Circular Progress Indicator */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-indigo-600" strokeWidth="3.5" strokeDasharray={`${allocatedRatio}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-[10px] font-bold text-slate-700">{Math.round(allocatedRatio)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Pending Approvals */}
      <Card className="border-slate-100/80 shadow-2xs bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Sign-offs</span>
          <Badge className="bg-indigo-50 hover:bg-indigo-50 text-indigo-600 font-bold border-none text-[10px] px-2 py-0.5 rounded-full">
            {activeApprovalsCount} active chains
          </Badge>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeApprovalsCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">requires attention</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">
            Average approval processing SLA: <span className="font-semibold text-slate-600">12.5 hrs</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
