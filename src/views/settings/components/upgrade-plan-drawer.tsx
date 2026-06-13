"use client"

import React from "react"
import { useBilling } from "@/hooks/use-billing"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Check } from "lucide-react"

interface UpgradePlanDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (message: string) => void
}

const PLANS = [
  {
    name: "Starter Tier",
    price: "$49",
    billing: "$49/mo",
    features: [
      "Up to 10 team members",
      "Basic spend tracking",
      "Department limits cap",
      "Email support (24h response)",
    ],
  },
  {
    name: "Growth Tier",
    price: "$99",
    billing: "$99/mo",
    features: [
      "Up to 50 team members",
      "Advanced audit trails",
      "Visual chart analytics",
      "Slack integration",
      "Priority support (4h response)",
    ],
  },
  {
    name: "Enterprise Tier",
    price: "$299",
    billing: "$299/mo",
    features: [
      "Unlimited team members",
      "Custom approval workflows",
      "Slack & Google Workspace integration",
      "Dedicated account manager",
      "24/7 Phone & Email support",
    ],
  },
]

export function UpgradePlanDrawer({ open, onOpenChange, onSuccess }: UpgradePlanDrawerProps) {
  const { billing, upgradePlan } = useBilling()
  const currentPlan = billing.currentPlan

  const handleSelectPlan = (planName: string, priceAmount: string) => {
    if (planName === currentPlan) return

    upgradePlan(planName, priceAmount)

    if (onSuccess) {
      onSuccess(`Workspace plan successfully upgraded to ${planName}!`)
    }

    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col h-full bg-card border-l border-border p-0 text-foreground overflow-hidden">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border flex flex-row items-center justify-between gap-0">
          <div>
            <SheetTitle className="text-base font-extrabold text-foreground tracking-tight">
              Upgrade Workspace Plan
            </SheetTitle>
            <SheetDescription className="text-[10px] text-muted-foreground mt-1">
              Select the plan that fits your growing organization's spend management needs.
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {PLANS.map((plan) => {
              const isActive = plan.name === currentPlan
              return (
                <div
                  key={plan.name}
                  className={`relative p-5 border rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "border-indigo-500 bg-indigo-500/5 dark:bg-indigo-950/15"
                      : "border-border hover:border-muted-foreground/30 bg-card/50"
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-4 right-4 bg-indigo-500 text-white dark:text-slate-900 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                  
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {plan.name}
                    </span>
                    <div className="flex items-baseline mt-1 space-x-1">
                      <span className="text-2xl font-black text-foreground">{plan.price}</span>
                      <span className="text-xs text-muted-foreground">/ month</span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 border-t border-border/50 pt-4 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-xs font-semibold text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 text-right">
                    {isActive ? (
                      <Button
                        disabled
                        className="w-full bg-muted border border-border text-muted-foreground text-xs font-bold rounded-lg cursor-not-allowed h-9"
                      >
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleSelectPlan(plan.name, plan.billing)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer h-9 shadow-2xs"
                      >
                        Choose {plan.name.replace(" Tier", "")}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
