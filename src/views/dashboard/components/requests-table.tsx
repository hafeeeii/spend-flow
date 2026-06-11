import React from "react";
import { ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PurchaseRequest } from "../types"

interface RequestsTableProps {
  requests: PurchaseRequest[];
  tableFilter: "all" | "pending" | "approved" | "rejected";
  onFilterChange: (filter: "all" | "pending" | "approved" | "rejected") => void;
  onRequestSelect: (request: PurchaseRequest) => void;
}

export function RequestsTable({
  requests,
  tableFilter,
  onFilterChange,
  onRequestSelect,
}: RequestsTableProps) {
  return (
    <Card className="lg:col-span-2 border-border shadow-2xs bg-card text-card-foreground transition-colors duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-bold text-foreground">
            Recent Purchase Requests
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Most recent spend requests created across the team.
          </CardDescription>
        </div>

        {/* Table Filters */}
        <div className="flex items-center space-x-1.5 border border-border bg-muted/40 p-0.5 rounded-lg text-xs font-bold">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer capitalize ${
                tableFilter === f
                  ? "bg-card text-foreground shadow-3xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Request</th>
                <th className="px-6 py-3 font-semibold">Requester</th>
                <th className="px-6 py-3 font-semibold text-right">Amount</th>
                <th className="px-6 py-3 font-semibold">Stage</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-xs text-foreground">
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => onRequestSelect(req)}
                    className="hover:bg-muted/50 transition cursor-pointer group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-foreground group-hover:text-primary transition flex items-center space-x-1">
                        <span>{req.title}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-primary transition-all transform translate-y-0.5 -translate-x-0.5 group-hover:translate-y-0 group-hover:translate-x-0" />
                      </div>
                      <div className="text-xs text-muted-foreground font-medium mt-0.5 flex items-center space-x-1.5">
                        <span>{req.id}</span>
                        <span>•</span>
                        <span>{req.vendor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={req.requester.avatar}
                            alt={req.requester.name}
                          />
                          <AvatarFallback className="text-xs font-bold">
                            {req.requester.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-bold text-foreground truncate">
                            {req.requester.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate font-semibold mt-0.5">
                            {req.requester.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right font-extrabold text-foreground">
                      $
                      {req.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground font-semibold">
                      {req.currentStage}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {req.status === "approved" && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-none font-bold hover:bg-emerald-500/20 text-xs px-2 py-0.5 rounded-full capitalize">
                          Approved
                        </Badge>
                      )}
                      {req.status === "pending" && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold hover:bg-amber-500/20 text-xs px-2 py-0.5 rounded-full capitalize">
                          Pending
                        </Badge>
                      )}
                      {req.status === "rejected" && (
                        <Badge className="bg-destructive/10 text-destructive border-none font-bold hover:bg-destructive/20 text-xs px-2 py-0.5 rounded-full capitalize">
                          Rejected
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-muted-foreground font-medium"
                  >
                    No requests found in this filter category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
