"use client"

import React, { useState } from "react"
import { useRequests } from "@/hooks/use-requests"
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

interface CreateRequestDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (message: string) => void
}

const BUDGET_LIMITS: Record<string, { spent: number; limit: number }> = {
  "Software & SaaS": { spent: 8700, limit: 12000 },
  "IT Equipment": { spent: 25000, limit: 40000 },
  "Cloud Hosting": { spent: 72700, limit: 110000 },
  "Marketing & Events": { spent: 42100, limit: 50000 },
  "Office Facilities": { spent: 12400, limit: 25000 },
  "Travel & Client Relations": { spent: 19800, limit: 20000 },
}

export function CreateRequestDrawer({ open, onOpenChange, onSuccess }: CreateRequestDrawerProps) {
  const { addRequest } = useRequests()
  
  // Form State
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newVendor, setNewVendor] = useState("")
  const [newCategory, setNewCategory] = useState("Software")
  const [newAmount, setNewAmount] = useState("")
  const [newCurrency, setNewCurrency] = useState("USD")
  const [newBudgetCategory, setNewBudgetCategory] = useState("Software & SaaS")

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newVendor.trim() || !newAmount) return

    addRequest({
      title: newTitle,
      description: newDescription,
      vendor: newVendor,
      category: newCategory,
      amount: parseFloat(newAmount),
      currency: newCurrency,
      budgetCategory: newBudgetCategory
    })

    if (onSuccess) {
      onSuccess(`Purchase request for "${newTitle}" submitted successfully!`)
    }

    // Reset Form fields
    setNewTitle("")
    setNewDescription("")
    setNewVendor("")
    setNewCategory("Software")
    setNewAmount("")
    setNewCurrency("USD")
    setNewBudgetCategory("Software & SaaS")
    
    // Close Sheet
    onOpenChange(false)
  }

  // Budget calculations
  const activeBudget = BUDGET_LIMITS[newBudgetCategory] || { spent: 0, limit: 10000 }
  const budgetRemaining = activeBudget.limit - activeBudget.spent

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full flex flex-col h-full bg-card border-l border-border p-0 text-foreground">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border flex flex-row items-center justify-between gap-0">
          <div>
            <SheetTitle className="text-base font-extrabold text-foreground tracking-tight">
              Create Purchase Request
            </SheetTitle>
            <SheetDescription className="text-[10px] text-muted-foreground mt-1">
              Submitting will route request through approval workflows.
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="create-request-form" onSubmit={handleCreateSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="req-title" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Request Title
              </label>
              <Input
                id="req-title"
                type="text"
                required
                placeholder="e.g. AWS Cloud hosting renewal - Q2"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs font-semibold p-2.5"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="req-desc" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Description & Justification
              </label>
              <textarea
                id="req-desc"
                rows={3}
                required
                placeholder="Explain why this spend is required and who it benefits..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 border border-input rounded-md bg-transparent focus:ring-1 focus:ring-ring focus:border-ring focus:outline-none resize-none"
              />
            </div>

            {/* Vendor & Category */}
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="space-y-1.5">
                <label htmlFor="req-vendor" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Vendor
                </label>
                <Input
                  id="req-vendor"
                  type="text"
                  required
                  placeholder="e.g. Figma, Apple, AWS"
                  value={newVendor}
                  onChange={(e) => setNewVendor(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="req-category" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Category
                </label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger id="req-category" className="w-full h-9 border-input rounded-md bg-background text-foreground text-xs font-semibold justify-between px-3">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent position="popper" align="start">
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount & Currency */}
            <div className="grid grid-cols-3 gap-4 text-left">
              <div className="col-span-2 space-y-1.5">
                <label htmlFor="req-amount" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Amount
                </label>
                <Input
                  id="req-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="req-currency" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Currency
                </label>
                <Select value={newCurrency} onValueChange={setNewCurrency}>
                  <SelectTrigger id="req-currency" className="w-full h-9 border-input rounded-md bg-background text-foreground text-xs font-semibold justify-between px-3">
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent position="popper" align="start">
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget Category select */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="req-budget" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Charge to Budget
              </label>
              <Select value={newBudgetCategory} onValueChange={setNewBudgetCategory}>
                <SelectTrigger id="req-budget" className="w-full h-9 border-input rounded-md bg-background text-foreground text-xs font-semibold justify-between px-3">
                  <SelectValue placeholder="Select Budget" />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  <SelectItem value="Software & SaaS">Design - Software & SaaS</SelectItem>
                  <SelectItem value="IT Equipment">Engineering - IT Equipment</SelectItem>
                  <SelectItem value="Cloud Hosting">Engineering - Cloud Hosting</SelectItem>
                  <SelectItem value="Marketing & Events">Marketing - Marketing & Events</SelectItem>
                  <SelectItem value="Office Facilities">Operations - Office Facilities</SelectItem>
                  <SelectItem value="Travel & Client Relations">Sales - Travel & Client Relations</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2 text-[10px] text-muted-foreground flex items-center space-x-1">
                <span>Remaining budget: </span>
                <span className="font-bold text-foreground">
                  ${budgetRemaining.toLocaleString(undefined, { minimumFractionDigits: 2 })} of ${activeBudget.limit.toLocaleString(undefined, { minimumFractionDigits: 2 })} limit
                </span>
              </div>
            </div>

            {/* Mock Attachment Upload */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Invoice / Quote Attachment
              </label>
              <div className="border border-dashed border-input rounded-md p-5 text-center cursor-pointer hover:border-primary transition duration-150 bg-muted/10 group">
                <div className="text-xl mb-1.5 group-hover:scale-105 transition-transform">📎</div>
                <p className="text-xs font-bold text-foreground">Drag & drop files here, or click to browse</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">PDF, PNG, JPG up to 10MB</p>
              </div>
            </div>

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
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
