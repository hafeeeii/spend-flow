"use client"

import React, { useState } from "react"
import { useVendors } from "@/hooks/use-vendors"
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

interface RegisterVendorDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (message: string) => void
}

export function RegisterVendorDrawer({ open, onOpenChange, onSuccess }: RegisterVendorDrawerProps) {
  const { addVendor } = useVendors()

  const [name, setName] = useState("")
  const [category, setCategory] = useState("Cloud Infrastructure")
  const [activeContracts, setActiveContracts] = useState("1")
  const [annualSpend, setAnnualSpend] = useState("")
  const [risk, setRisk] = useState<"Low" | "Medium" | "High">("Low")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !annualSpend) return

    const parsedContracts = parseInt(activeContracts)
    const parsedSpend = parseFloat(annualSpend)

    if (isNaN(parsedContracts) || parsedContracts < 0) return
    if (isNaN(parsedSpend) || parsedSpend < 0) return

    const newVendor = addVendor({
      name,
      category,
      activeContracts: parsedContracts,
      annualSpend: parsedSpend,
      risk,
    })

    if (onSuccess) {
      onSuccess(`Vendor "${newVendor.name}" registered successfully!`)
    }

    // Reset fields
    setName("")
    setCategory("Cloud Infrastructure")
    setActiveContracts("1")
    setAnnualSpend("")
    setRisk("Low")

    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full flex flex-col h-full bg-card border-l border-border p-0 text-foreground">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border flex flex-row items-center justify-between gap-0">
          <div>
            <SheetTitle className="text-base font-extrabold text-foreground tracking-tight text-left">
              Register New Vendor
            </SheetTitle>
            <SheetDescription className="text-[10px] text-muted-foreground mt-1 text-left">
              Register a software service, hardware partner, or contractor.
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Vendor Name */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="vendor-name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Vendor Name
              </label>
              <Input
                id="vendor-name"
                type="text"
                required
                placeholder="e.g. Vercel Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-semibold p-2.5"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full h-10 border-input rounded-md bg-background text-foreground text-xs font-semibold justify-between px-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  <SelectItem value="Cloud Infrastructure">Cloud Infrastructure</SelectItem>
                  <SelectItem value="Design Tools">Design Tools</SelectItem>
                  <SelectItem value="Communications">Communications</SelectItem>
                  <SelectItem value="Developer Tools">Developer Tools</SelectItem>
                  <SelectItem value="Marketing & SaaS">Marketing & SaaS</SelectItem>
                  <SelectItem value="Office & Furniture">Office & Furniture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contracts & Spend */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="vendor-contracts" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Active Contracts
                </label>
                <Input
                  id="vendor-contracts"
                  type="number"
                  required
                  min="0"
                  value={activeContracts}
                  onChange={(e) => setActiveContracts(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5"
                />
              </div>
              <div className="space-y-1.5 text-left">
                <label htmlFor="vendor-spend" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Annual Spend ($)
                </label>
                <Input
                  id="vendor-spend"
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 15000"
                  value={annualSpend}
                  onChange={(e) => setAnnualSpend(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5"
                />
              </div>
            </div>

            {/* Security Risk Rating */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Security Risk Rating
              </label>
              <Select value={risk} onValueChange={(val: "Low" | "Medium" | "High") => setRisk(val)}>
                <SelectTrigger className="w-full h-10 border-input rounded-md bg-background text-foreground text-xs font-semibold justify-between px-3">
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  <SelectItem value="Low">Low Risk (SOC2 verified)</SelectItem>
                  <SelectItem value="Medium">Medium Risk (In review)</SelectItem>
                  <SelectItem value="High">High Risk (Security exception)</SelectItem>
                </SelectContent>
              </Select>
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
                Register Vendor
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
