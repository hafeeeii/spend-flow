"use client"

import React, { useState, useEffect } from "react"
import { useBudgets } from "@/hooks/use-budgets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AdjustBudgetDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (message: string) => void
}

export function AdjustBudgetDrawer({ open, onOpenChange, onSuccess }: AdjustBudgetDrawerProps) {
  const { budgets, adjustBudget } = useBudgets()

  const [selectedBudgetId, setSelectedBudgetId] = useState("")
  const [newLimitVal, setNewLimitVal] = useState("")

  // Set default selected budget when drawer opens
  useEffect(() => {
    if (open && budgets.length > 0 && !selectedBudgetId) {
      setSelectedBudgetId(budgets[0].id)
      setNewLimitVal(budgets[0].limit.toString())
    }
  }, [open, budgets, selectedBudgetId])

  const handleBudgetSelectChange = (id: string) => {
    setSelectedBudgetId(id)
    const budget = budgets.find(b => b.id === id)
    if (budget) {
      setNewLimitVal(budget.limit.toString())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBudgetId || !newLimitVal) return

    const parsedLimit = parseFloat(newLimitVal)
    if (isNaN(parsedLimit) || parsedLimit <= 0) return

    const budget = budgets.find(b => b.id === selectedBudgetId)
    if (!budget) return

    adjustBudget(selectedBudgetId, parsedLimit)

    if (onSuccess) {
      onSuccess(`Limit for "${budget.department} - ${budget.category}" adjusted to $${parsedLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}!`)
    }

    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full flex flex-col h-full bg-card border-l border-border p-0 text-foreground">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border flex flex-row items-center justify-between gap-0">
          <div>
            <SheetTitle className="text-base font-extrabold text-foreground tracking-tight">
              Adjust Budgets
            </SheetTitle>
            <SheetDescription className="text-[10px] text-muted-foreground mt-1">
              Modify allocated limit caps for department budgets.
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Select Budget */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Select Budget
              </label>
              <Select value={selectedBudgetId} onValueChange={handleBudgetSelectChange}>
                <SelectTrigger className="w-full h-10 border-input rounded-md bg-background text-foreground text-xs font-semibold justify-between px-3">
                  <SelectValue placeholder="Select a budget" />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  {budgets.map(b => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.department} - {b.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Limit Input */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="budget-limit" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Limit Cap ($)
              </label>
              <Input
                id="budget-limit"
                type="number"
                required
                min="1"
                placeholder="0.00"
                value={newLimitVal}
                onChange={(e) => setNewLimitVal(e.target.value)}
                className="w-full text-xs font-semibold p-2.5"
              />
            </div>

            {/* Details of current budget */}
            {selectedBudgetId && (
              <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-2 text-left">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Current Budget Details</h4>
                {(() => {
                  const selected = budgets.find(b => b.id === selectedBudgetId)
                  if (!selected) return null
                  const pct = selected.limit > 0 ? Math.round((selected.spent / selected.limit) * 100) : 0
                  return (
                    <div className="text-xs space-y-1.5 font-semibold">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Spent:</span>
                        <span className="text-foreground">${selected.spent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Limit:</span>
                        <span className="text-foreground">${selected.limit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Consumption Ratio:</span>
                        <span className="text-foreground">{pct}%</span>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-border flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="h-9 text-xs font-bold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-primary-foreground h-9 text-xs font-bold cursor-pointer"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
