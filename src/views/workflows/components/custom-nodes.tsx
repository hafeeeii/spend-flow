"use client"

import React from "react"
import { Handle, Position } from "@xyflow/react"
import { Zap, GitFork, Shield, CreditCard, UserCheck, AlertTriangle } from "lucide-react"

// Trigger Node Component
export function TriggerNode({ data }: { data: any }) {
  return (
    <div className="w-64 bg-card border-2 border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 text-left relative group">
      <div className="flex items-start justify-between">
        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm border border-blue-100/20">
          <Zap className="h-4 w-4" />
        </div>
        <span className="text-[9px] font-black tracking-widest uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200/20">
          Trigger
        </span>
      </div>
      <h4 className="font-extrabold text-foreground mt-4 text-xs tracking-tight group-hover:text-primary transition-colors">
        {data.title || "New Purchase Request"}
      </h4>
      <p className="text-[10px] text-muted-foreground mt-1 leading-normal">
        {data.desc || "Any category, amount < $500"}
      </p>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 !bg-primary border-2 border-background"
      />
    </div>
  )
}

// Condition Node Component
export function ConditionNode({ data }: { data: any }) {
  return (
    <div className="w-64 bg-card border-2 border-amber-200 dark:border-amber-900 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 text-left relative group">
      <div className="flex items-start justify-between">
        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm border border-amber-100/20">
          <GitFork className="h-4 w-4" />
        </div>
        <span className="text-[9px] font-black tracking-widest uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-100/30">
          Condition
        </span>
      </div>
      <h4 className="font-extrabold text-foreground mt-4 text-xs tracking-tight group-hover:text-amber-600 transition-colors">
        {data.title || "Amount Check"}
      </h4>
      <p className="text-[10px] text-muted-foreground mt-1 leading-normal">
        {data.desc || "Split based on spending rules"}
      </p>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 !bg-amber-500 border-2 border-background"
      />

      {/* Yes (Left) and No (Right) Output Handles */}
      <div className="absolute -bottom-5 left-1/4 -translate-x-1/2 flex flex-col items-center">
        <Handle
          type="source"
          position={Position.Bottom}
          id="yes"
          className="w-2.5 h-2.5 !bg-emerald-500 border-2 border-background !left-1/4"
        />
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 mt-1 select-none">Yes</span>
      </div>

      <div className="absolute -bottom-5 left-3/4 -translate-x-1/2 flex flex-col items-center">
        <Handle
          type="source"
          position={Position.Bottom}
          id="no"
          className="w-2.5 h-2.5 !bg-rose-500 border-2 border-background !left-3/4"
        />
        <span className="text-[9px] font-bold text-rose-600 dark:text-rose-500 mt-1 select-none">No</span>
      </div>
    </div>
  )
}

// Action / Approval Node Component
export function ActionNode({ data }: { data: any }) {
  const isApproval = data.type === "approval"
  
  // Custom theme colors based on node configuration
  const bgBadge = isApproval 
    ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100/30"
    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/30"

  const iconContainer = isApproval
    ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"

  const borderClass = isApproval
    ? "border-purple-250 dark:border-purple-900"
    : "border-emerald-250 dark:border-emerald-900"

  const getIcon = () => {
    if (isApproval) {
      if (data.assignee === "CFO") return <Shield className="h-4 w-4" />
      return <UserCheck className="h-4 w-4" />
    }
    if (data.status === "success") return <CreditCard className="h-4 w-4" />
    return <AlertTriangle className="h-4 w-4" />
  }

  return (
    <div className={`w-64 bg-card border-2 ${borderClass} rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 text-left relative group`}>
      <div className="flex items-start justify-between">
        <div className={`w-8 h-8 rounded-lg ${iconContainer} flex items-center justify-center text-sm border border-black/5`}>
          {getIcon()}
        </div>
        <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${bgBadge}`}>
          {data.assignee || data.badge || (isApproval ? "Approval" : "Integration")}
        </span>
      </div>
      <h4 className="font-extrabold text-foreground mt-4 text-xs tracking-tight group-hover:text-primary transition-colors">
        {data.title || "Step Title"}
      </h4>
      <p className="text-[10px] text-muted-foreground mt-1 leading-normal">
        {data.desc || "Step Description"}
      </p>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 !bg-primary border-2 border-background"
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 !bg-primary border-2 border-background"
      />
    </div>
  )
}
