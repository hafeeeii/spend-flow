"use client"

import React, { useState } from "react"
import { useAuditLogs } from "@/hooks/use-audit-logs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, CheckCircle2, Download, ClipboardList } from "lucide-react"

export function AuditView() {
  const { logs, isMounted } = useAuditLogs()
  const [searchQuery, setSearchQuery] = useState("")
  const [toast, setToast] = useState<string | null>(null)

  // Clear toast after 3s
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleExport = () => {
    setToast("Exporting system audit logs CSV...")
  }

  // Filter logs by search query
  const filteredLogs = logs.filter((log) => {
    const query = searchQuery.toLowerCase()
    return (
      log.user.toLowerCase().includes(query) ||
      log.role.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query) ||
      log.target.toLowerCase().includes(query) ||
      log.id.toLowerCase().includes(query)
    )
  })

  // Nice date formatter: e.g. "Jun 2, 03:35:00 PM"
  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    } catch (e) {
      return isoString
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative text-left">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Audit Logs</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Immutable, system-wide transaction and configuration logs for governance compliance.
          </p>
        </div>
        <div>
          <Button
            onClick={handleExport}
            variant="outline"
            className="px-4 py-2 border border-border hover:bg-muted text-foreground rounded-lg text-xs font-semibold shadow-2xs transition duration-150 flex items-center space-x-1.5 cursor-pointer h-9"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Audit Log</span>
          </Button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search logs by actor, action, or target ID..."
          className="pl-10 text-xs font-semibold h-10 w-full bg-card"
        />
      </div>

      {/* Audit Logs Table */}
      <Card className="border-border shadow-2xs bg-card text-card-foreground overflow-hidden transition-colors duration-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <TableHead className="py-4 px-6 h-auto font-bold text-left">Timestamp</TableHead>
                  <TableHead className="py-4 px-6 h-auto font-bold text-left">Actor</TableHead>
                  <TableHead className="py-4 px-6 h-auto font-bold text-left">Action Event</TableHead>
                  <TableHead className="py-4 px-6 h-auto font-bold text-left">Target</TableHead>
                  <TableHead className="py-4 px-6 h-auto font-bold text-left">Value State Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs text-foreground divide-y divide-border/50">
                {!isMounted ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-xs font-semibold text-muted-foreground animate-pulse">
                      Loading audit logs...
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-xs font-semibold text-muted-foreground italic">
                      No matching audit logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/20 transition duration-150">
                      {/* Timestamp */}
                      <TableCell className="px-6 py-4 text-muted-foreground font-medium whitespace-nowrap text-left">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      
                      {/* Actor */}
                      <TableCell className="px-6 py-4 text-left whitespace-nowrap">
                        <div className="font-extrabold text-foreground">{log.user}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{log.role}</div>
                      </TableCell>
                      
                      {/* Action Event */}
                      <TableCell className="px-6 py-4 text-muted-foreground font-semibold text-left">
                        {log.action}
                      </TableCell>
                      
                      {/* Target */}
                      <TableCell className="px-6 py-4 font-bold text-foreground text-left whitespace-nowrap">
                        {log.target}
                      </TableCell>
                      
                      {/* Value State Changes */}
                      <TableCell className="px-6 py-4 text-left">
                        <div className="font-mono text-[10px] bg-muted/40 p-2.5 border border-border/40 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-x-auto">
                          <div className="text-rose-600 dark:text-rose-450 font-bold whitespace-normal break-all">
                            - {log.changes.before}
                          </div>
                          <div className="text-emerald-600 dark:text-emerald-450 font-bold whitespace-normal break-all mt-1">
                            + {log.changes.after}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Floating Success Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in text-xs font-bold border dark:border-slate-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
export default AuditView
