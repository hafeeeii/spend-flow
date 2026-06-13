"use client"

import React, { useState } from "react"
import { useVendors } from "@/hooks/use-vendors"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RegisterVendorDrawer } from "./components/register-vendor-drawer"
import { CheckCircle2, AlertTriangle, ShieldCheck, Info } from "lucide-react"

export function VendorsView() {
  const { vendors, isMounted } = useVendors()
  const [isRegisterDrawerOpen, setIsRegisterDrawerOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null)

  // Clear toast after 3s
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  if (!isMounted) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-xs font-semibold text-muted-foreground animate-pulse">Loading vendor data...</div>
      </div>
    )
  }

  // Calculate Metrics
  const activeVendorsCount = vendors.length
  const activeContractsCount = vendors.reduce((acc, curr) => acc + curr.activeContracts, 0)
  const annualRunRate = vendors.reduce((acc, curr) => acc + curr.annualSpend, 0)
  const securityFlaggedCount = vendors.filter(v => v.risk === "Medium" || v.risk === "High").length

  // Helper to color-code initials logos dynamically and attractively
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

  const handleShowToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type })
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight text-left">Vendor Management</h1>
          <p className="text-xs text-muted-foreground mt-1 text-left">
            Audit active SaaS agreements, agreements pipelines, and vendor security ratings.
          </p>
        </div>
        <div>
          <Button
            onClick={() => setIsRegisterDrawerOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-semibold shadow-xs transition duration-150 flex items-center space-x-1.5 cursor-pointer h-9"
          >
            Register Vendor
          </Button>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card text-card-foreground shadow-2xs">
          <CardContent className="p-4 text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Vendors</span>
            <div className="mt-1.5 text-xl font-bold text-foreground">{activeVendorsCount}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card text-card-foreground shadow-2xs">
          <CardContent className="p-4 text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Contracts</span>
            <div className="mt-1.5 text-xl font-bold text-foreground">{activeContractsCount}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card text-card-foreground shadow-2xs">
          <CardContent className="p-4 text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Annual Run Rate</span>
            <div className="mt-1.5 text-xl font-bold text-foreground">
              ${annualRunRate.toLocaleString("en-US")}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card text-card-foreground shadow-2xs">
          <CardContent className="p-4 text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Security Flagged</span>
            <div
              className={`mt-1.5 text-xl font-bold ${
                securityFlaggedCount > 0 ? "text-amber-600 dark:text-amber-500" : "text-foreground"
              }`}
            >
              {securityFlaggedCount > 0 ? `${securityFlaggedCount} Pending Review` : "0 Flagged"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Data Table */}
      <Card className="border-border shadow-2xs bg-card text-card-foreground overflow-hidden transition-colors duration-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <TableHead className="py-4 px-6 h-auto font-bold text-left">Vendor Name</TableHead>
                  <TableHead className="py-4 px-6 h-auto font-bold text-left">Service Type</TableHead>
                  <TableHead className="py-4 px-6 h-auto font-bold text-left">Active Agreements</TableHead>
                  <TableHead className="py-4 px-6 h-auto font-bold text-right">Annual Spend</TableHead>
                  <TableHead className="py-4 px-6 h-auto font-bold text-left">Security Rating</TableHead>
                  <TableHead className="py-4 px-6 h-auto font-bold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs text-foreground divide-y divide-border/50">
                {vendors.map((v) => {
                  return (
                    <TableRow key={v.id} className="hover:bg-muted/20 transition duration-150">
                      <TableCell className="px-6 py-4 font-semibold whitespace-nowrap text-left">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs uppercase ${getLogoColorClass(
                              v.logo
                            )}`}
                          >
                            {v.logo}
                          </div>
                          <span className="font-bold text-foreground">{v.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-muted-foreground font-semibold text-left">
                        {v.category}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-muted-foreground font-semibold text-left">
                        {v.activeContracts > 0
                          ? `${v.activeContracts} active contract${v.activeContracts > 1 ? "s" : ""}`
                          : "No formal contract"}
                      </TableCell>
                      <TableCell className="px-6 py-4 font-bold text-right text-foreground">
                        ${v.annualSpend.toLocaleString("en-US")}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-left">
                        {v.risk === "Low" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/30">
                            Low Risk
                          </span>
                        )}
                        {v.risk === "Medium" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100/30">
                            Medium Risk
                          </span>
                        )}
                        {v.risk === "High" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100/30">
                            High Risk
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Button
                          variant="link"
                          onClick={() => handleShowToast(`Viewing contracts for ${v.name}`, "info")}
                          className="h-auto p-0 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline cursor-pointer"
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Register Vendor Drawer */}
      <RegisterVendorDrawer
        open={isRegisterDrawerOpen}
        onOpenChange={setIsRegisterDrawerOpen}
        onSuccess={(msg) => handleShowToast(msg, "success")}
      />

      {/* Success / Info Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in text-xs font-bold border dark:border-slate-200">
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <Info className="h-4 w-4 text-indigo-500" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}
export default VendorsView
