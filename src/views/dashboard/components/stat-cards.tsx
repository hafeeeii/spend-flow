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
      <Card className="border-border shadow-2xs bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Spend This Month</span>
          <Badge className="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-bold border-none text-xs px-2 py-0.5 rounded-full hover:bg-emerald-500/20">
            +12.4% vs May
          </Badge>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              ${totalMonthlySpend.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-muted-foreground font-medium">USD</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">Aggregated across all credit cards and invoices.</p>
        </CardContent>
      </Card>

      {/* Card 2: Budget Usage */}
      <Card className="border-border shadow-2xs bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Budget Governance</span>
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border-none text-xs px-2 py-0.5 rounded-full hover:bg-amber-500/20">
            Near threshold (1 dept)
          </Badge>
        </CardHeader>
        <CardContent className="pt-2 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">{allocatedRatio}%</span>
              <span className="text-xs text-muted-foreground font-medium">allocated</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">$140,022.50 spent of $217,000.00 limits.</p>
          </div>
          {/* SVG Circular Progress Indicator */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-muted/30" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-primary" strokeWidth="3.5" stroke-dasharray={`${allocatedRatio}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-xs font-bold text-foreground">{Math.round(allocatedRatio)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Pending Approvals */}
      <Card className="border-border shadow-2xs bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Sign-offs</span>
          <Badge className="bg-primary/10 text-primary font-bold border-none text-xs px-2 py-0.5 rounded-full hover:bg-primary/20">
            {activeApprovalsCount} active chains
          </Badge>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {activeApprovalsCount}
            </span>
            <span className="text-xs text-muted-foreground font-medium">requires attention</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            Average approval processing SLA: <span className="font-semibold text-foreground">12.5 hrs</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
