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
    <Card className="lg:col-span-2 border-slate-100/80 shadow-2xs bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-bold text-slate-800">
            Recent Purchase Requests
          </CardTitle>
          <CardDescription className="text-[10px] text-slate-400 mt-0.5">
            Most recent spend requests created across the team.
          </CardDescription>
        </div>

        {/* Table Filters */}
        <div className="flex items-center space-x-1.5 border border-slate-100 bg-slate-50/50 p-0.5 rounded-lg text-[10px] font-bold">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer capitalize ${
                tableFilter === f
                  ? "bg-white text-slate-800 shadow-3xs"
                  : "text-slate-400 hover:text-slate-600"
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
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Request</th>
                <th className="px-6 py-3 font-semibold">Requester</th>
                <th className="px-6 py-3 font-semibold text-right">Amount</th>
                <th className="px-6 py-3 font-semibold">Stage</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => onRequestSelect(req)}
                    className="hover:bg-slate-50/70 transition cursor-pointer group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition flex items-center space-x-1">
                        <span>{req.title}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-indigo-500 transition-all transform translate-y-0.5 -translate-x-0.5 group-hover:translate-y-0 group-hover:translate-x-0" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center space-x-1.5">
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
                          <AvatarFallback className="text-[9px] font-bold">
                            {req.requester.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-800 truncate">
                            {req.requester.name}
                          </div>
                          <div className="text-[9px] text-slate-400 truncate font-semibold mt-0.5">
                            {req.requester.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right font-extrabold text-slate-900">
                      $
                      {req.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 font-semibold">
                      {req.currentStage}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {req.status === "approved" && (
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold hover:bg-emerald-50 text-[10px] px-2 py-0.5 rounded-full capitalize">
                          Approved
                        </Badge>
                      )}
                      {req.status === "pending" && (
                        <Badge className="bg-amber-50 text-amber-600 border-none font-bold hover:bg-amber-50 text-[10px] px-2 py-0.5 rounded-full capitalize">
                          Pending
                        </Badge>
                      )}
                      {req.status === "rejected" && (
                        <Badge className="bg-rose-50 text-rose-600 border-none font-bold hover:bg-rose-50 text-[10px] px-2 py-0.5 rounded-full capitalize">
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
                    className="px-6 py-8 text-center text-slate-400 font-medium"
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
