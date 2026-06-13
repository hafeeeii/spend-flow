"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Building,
  Users,
  ShieldCheck,
  Plug,
  CreditCard,
  CheckCircle2,
  Info,
} from "lucide-react"

// Hooks
import { useMembers } from "@/hooks/use-members"
import { useBilling } from "@/hooks/use-billing"

// Drawers
import { InviteMemberDrawer } from "./components/invite-member-drawer"
import { UpgradePlanDrawer } from "./components/upgrade-plan-drawer"

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<"org" | "members" | "roles" | "integrations" | "billing">("org")
  
  // Organization settings states
  const [orgName, setOrgName] = useState("Acme Corp")
  const [currency, setCurrency] = useState("USD")
  const [paymentTerm, setPaymentTerm] = useState("Net 30")

  // Hooks state
  const { members } = useMembers()
  const { billing } = useBilling()

  // Drawer states
  const [isInviteDrawerOpen, setIsInviteDrawerOpen] = useState(false)
  const [isUpgradeDrawerOpen, setIsUpgradeDrawerOpen] = useState(false)

  // Integrations state
  const [isSlackConnected, setIsSlackConnected] = useState(false)
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null)

  // Clear toast
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault()
    setToast({
      message: "Organization profile settings saved successfully!",
      type: "success",
    })
  }

  const handleInviteMember = () => {
    setIsInviteDrawerOpen(true)
  }

  const toggleSlack = () => {
    setIsSlackConnected(!isSlackConnected)
    setToast({
      message: `Slack integration ${!isSlackConnected ? "connected" : "disconnected"}.`,
      type: "info",
    })
  }

  const toggleGoogle = () => {
    setIsGoogleConnected(!isGoogleConnected)
    setToast({
      message: `Google Workspace sync ${!isGoogleConnected ? "enabled" : "disabled"}.`,
      type: "info",
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-fade-in pb-12 relative text-left">
      
      {/* Left Sidebar Navigation */}
      <div className="md:w-60 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 border-b md:border-b-0 md:border-r border-border shrink-0">
        <button
          onClick={() => setActiveTab("org")}
          className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-left transition w-full cursor-pointer ${
            activeTab === "org"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <Building className="h-4 w-4 shrink-0" />
          <span>Organization Profile</span>
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-left transition w-full cursor-pointer ${
            activeTab === "members"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4 shrink-0" />
          <span>Team Members</span>
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-left transition w-full cursor-pointer ${
            activeTab === "roles"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Roles & Permissions</span>
        </button>
        <button
          onClick={() => setActiveTab("integrations")}
          className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-left transition w-full cursor-pointer ${
            activeTab === "integrations"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <Plug className="h-4 w-4 shrink-0" />
          <span>Connected Apps</span>
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-left transition w-full cursor-pointer ${
            activeTab === "billing"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <CreditCard className="h-4 w-4 shrink-0" />
          <span>Billing & Plan</span>
        </button>
      </div>

      {/* Right Active Panel */}
      <div className="flex-1 max-w-2xl bg-card border border-border rounded-2xl p-6 md:p-8 shadow-2xs text-foreground">
        
        {/* Tab 1: Organization Profile */}
        {activeTab === "org" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">Organization Profile</h2>
              <p className="text-xs text-muted-foreground mt-1">Manage your workspace identity and default finance terms.</p>
            </div>

            <form onSubmit={handleSaveOrg} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="company-name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Company Name
                  </label>
                  <Input
                    id="company-name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                    className="w-full text-xs font-semibold p-2.5"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="company-domain" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Company Domain
                  </label>
                  <Input
                    id="company-domain"
                    value="acme.co"
                    readOnly
                    disabled
                    className="w-full text-xs font-semibold p-2.5 bg-muted/50 text-muted-foreground cursor-not-allowed border-dashed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Primary Currency
                  </label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-full h-10 border-input bg-background text-foreground text-xs font-semibold justify-between px-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" align="start">
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Default Payment Term
                  </label>
                  <Select value={paymentTerm} onValueChange={setPaymentTerm}>
                    <SelectTrigger className="w-full h-10 border-input bg-background text-foreground text-xs font-semibold justify-between px-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" align="start">
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/95 text-primary-foreground h-9 text-xs font-bold cursor-pointer"
                >
                  Save Settings
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Team Members */}
        {activeTab === "members" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">Team Members</h2>
                <p className="text-xs text-muted-foreground mt-1">Invite teammates and configure access roles.</p>
              </div>
              <Button
                onClick={handleInviteMember}
                className="px-3.5 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-[10px] font-bold shadow-2xs h-8 cursor-pointer"
              >
                Invite Member
              </Button>
            </div>

            <div className="border border-border rounded-xl overflow-hidden">
              <Table>
                <TableBody className="text-xs text-foreground divide-y divide-border/50">
                  {members.map((m) => (
                    <TableRow key={m.email} className="hover:bg-muted/10 transition">
                      <TableCell className="p-3 flex items-center space-x-3 text-left">
                        {m.avatar ? (
                          <img className="w-7 h-7 rounded-full object-cover shrink-0" src={m.avatar} alt={m.name} />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-[10px] shrink-0 border border-border">
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-extrabold text-foreground">{m.name}</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5">{m.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 text-muted-foreground font-semibold text-left">
                        {m.department}
                      </TableCell>
                      <TableCell className="p-3 text-right">
                        {m.status === "invited" ? (
                          <span className="px-2 py-0.5 bg-muted border border-border text-muted-foreground text-[9px] font-black uppercase rounded-full">
                            Invited
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/20 text-[9px] font-black uppercase rounded-full">
                            {m.role}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Tab 3: Roles & Permissions */}
        {activeTab === "roles" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">Roles & Permissions</h2>
              <p className="text-xs text-muted-foreground mt-1">Control access rights for different organizational hierarchies.</p>
            </div>

            <div className="space-y-4">
              {/* Card 1 */}
              <div className="p-4 border border-border rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Admin Role</span>
                  <span className="text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 border border-indigo-100/20 px-2.5 py-0.5 rounded-full">
                    Full Access
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Can view all dashboards, modify approval chains, connect APIs, and change billing parameters.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-4 border border-border rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Manager Role</span>
                  <span className="text-[9px] font-bold bg-muted border border-border text-muted-foreground px-2.5 py-0.5 rounded-full">
                    Approval Rights
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Can request purchases, inspect reports for assigned department budgets, and approve/reject steps.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-4 border border-border rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Employee Role</span>
                  <span className="text-[9px] font-bold bg-muted border border-border text-muted-foreground px-2.5 py-0.5 rounded-full">
                    Read & Request
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Can create purchase requests and view audit timeline on personal purchases. Cannot approve spend.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Connected Apps */}
        {activeTab === "integrations" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">Connected Apps</h2>
              <p className="text-xs text-muted-foreground mt-1">Manage data integrations for notifications, employee databases, and accounting.</p>
            </div>

            <div className="space-y-4">
              {/* Slack */}
              <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">💬</div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Slack Integration</h4>
                    <p className="text-[9px] text-muted-foreground">Send alerts to channels. Approve in Slack.</p>
                  </div>
                </div>
                <Button
                  onClick={toggleSlack}
                  variant={isSlackConnected ? "destructive" : "outline"}
                  className="px-3.5 py-1.5 text-[10px] font-bold h-8 cursor-pointer"
                >
                  {isSlackConnected ? "Disconnect" : "Connect"}
                </Button>
              </div>

              {/* Google */}
              <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">✉️</div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Google Workspace</h4>
                    <p className="text-[9px] text-muted-foreground">Automatic employee roster sync.</p>
                  </div>
                </div>
                <Button
                  onClick={toggleGoogle}
                  variant={isGoogleConnected ? "destructive" : "outline"}
                  className="px-3.5 py-1.5 text-[10px] font-bold h-8 cursor-pointer"
                >
                  {isGoogleConnected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Billing & Plan */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">Billing & Subscriptions</h2>
              <p className="text-xs text-muted-foreground mt-1">Monitor your subscription tier, billing methods, and invoice receipt history.</p>
            </div>

            {/* Current plan card */}
            <div className="p-4 border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Active Plan</span>
                <h3 className="text-base font-black text-foreground mt-1">{billing.currentPlan}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">{billing.priceDetail}</p>
              </div>
              <Button
                onClick={() => setIsUpgradeDrawerOpen(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold shadow-2xs h-8 cursor-pointer"
              >
                Upgrade Plan
              </Button>
            </div>

            {/* Invoices */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Billing Invoice History</h3>
              <div className="border border-border rounded-xl divide-y divide-border/50">
                {billing.invoices.map((inv) => (
                  <div key={inv.id} className="p-3.5 flex items-center justify-between text-xs text-muted-foreground font-semibold">
                    <div>
                      <p className="font-bold text-foreground">{inv.planName}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{inv.date}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-foreground">{inv.amount}</span>
                      <Button
                        variant="link"
                        onClick={() => setToast({ message: `Downloading invoice ${inv.id} PDF...`, type: "info" })}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline p-0 h-auto font-bold text-xs"
                      >
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Drawers */}
      <InviteMemberDrawer
        open={isInviteDrawerOpen}
        onOpenChange={setIsInviteDrawerOpen}
        onSuccess={(msg) => setToast({ message: msg, type: "success" })}
      />

      <UpgradePlanDrawer
        open={isUpgradeDrawerOpen}
        onOpenChange={setIsUpgradeDrawerOpen}
        onSuccess={(msg) => setToast({ message: msg, type: "success" })}
      />

      {/* Floating Success / Info Toast Alert */}
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
export default SettingsView
