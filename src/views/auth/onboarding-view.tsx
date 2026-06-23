"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react"

interface OnboardingViewProps {
  onNavigateToLogin: () => void
}

export function OnboardingView({ onNavigateToLogin }: OnboardingViewProps) {
  const { setupOrg } = useAuth()
  const [step, setStep] = useState(1)

  // Step 1 states
  const [orgName, setOrgName] = useState("")
  const [orgSize, setOrgSize] = useState("51-200")
  const [currency, setCurrency] = useState("USD")

  // Step 2 states
  const [integrations, setIntegrations] = useState({
    slack: false,
    google: false,
  })
  const [connectingSlack, setConnectingSlack] = useState(false)
  const [connectingGoogle, setConnectingGoogle] = useState(false)

  // Step 3 states
  const [departments, setDepartments] = useState({
    engineering: true,
    marketing: true,
    design: true,
    sales: true,
  })
  const [invites, setInvites] = useState("")

  // Loading & feedback
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!orgName.trim()) {
        showToast("Please enter a company name", "error")
        return
      }
    }
    setStep(prev => Math.min(prev + 1, 3))
  }

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const toggleSlack = async () => {
    if (integrations.slack) {
      setIntegrations(prev => ({ ...prev, slack: false }))
      showToast("Disconnected Slack integration", "success")
      return
    }
    setConnectingSlack(true)
    await new Promise(r => setTimeout(r, 1200))
    setIntegrations(prev => ({ ...prev, slack: true }))
    setConnectingSlack(false)
    showToast("Successfully authorized connection to Slack workspace", "success")
  }

  const toggleGoogle = async () => {
    if (integrations.google) {
      setIntegrations(prev => ({ ...prev, google: false }))
      showToast("Disconnected Google Workspace sync", "success")
      return
    }
    setConnectingGoogle(true)
    await new Promise(r => setTimeout(r, 1200))
    setIntegrations(prev => ({ ...prev, google: true }))
    setConnectingGoogle(false)
    showToast("Successfully authorized connection to Google Workspace", "success")
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const activeDepts = Object.entries(departments)
        .filter(([_, active]) => active)
        .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1))

      const inviteEmails = invites
        .split(",")
        .map(email => email.trim())
        .filter(email => email !== "")

      await setupOrg({
        name: orgName,
        size: orgSize,
        currency,
        integrations,
        departments: activeDepts,
        invites: inviteEmails,
      })

      showToast("Workspace setup completed! Welcome to SpendFlow.", "success")
    } catch (err) {
      showToast("Failed to complete onboarding", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-4 md:p-12 relative overflow-hidden transition-colors duration-200">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 px-4 py-3 rounded-lg shadow-xl flex items-center space-x-2.5 text-xs font-bold border border-border"
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-500" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[460px] text-left">
        
        {/* Sidebar: Steps Indicators */}
        <div className="md:w-1/3 bg-slate-950 text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-indigo-600/10 blur-2xl" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-purple-600/10 blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-base text-white shadow-md shadow-indigo-500/20">S</div>
              <span className="text-lg font-bold tracking-tight">SpendFlow</span>
            </div>
            
            {/* Steps Timeline */}
            <nav className="mt-12 space-y-6">
              {[
                { number: 1, label: "Company" },
                { number: 2, label: "Integrations" },
                { number: 3, label: "Team Setup" },
              ].map(s => {
                const isActive = step >= s.number
                return (
                  <div 
                    key={s.number}
                    className={`flex items-center space-x-3 text-sm transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-40"}`}
                  >
                    <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs transition-colors duration-200 ${
                      isActive ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      {s.number}
                    </span>
                    <span className={`font-semibold transition-colors duration-200 ${isActive ? "text-slate-200" : "text-slate-400"}`}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </nav>
          </div>

          <div className="text-[10px] text-slate-500 font-medium relative z-10 mt-8 md:mt-0">
            SpendFlow Onboarding v1.0
          </div>
        </div>

        {/* Main Form Panel */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between relative bg-card">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Company Profile */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Create your organization</h2>
                    <p className="text-xs text-muted-foreground">First, let's configure your workspace parameters.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Company Name</label>
                      <Input 
                        id="org-name" 
                        type="text" 
                        placeholder="Acme Corp" 
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 h-10 border border-input rounded-lg focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Company Size</label>
                        <Select value={orgSize} onValueChange={setOrgSize}>
                          <SelectTrigger className="w-full h-10 border-input bg-background text-foreground text-xs font-semibold justify-between px-3">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent position="popper" align="start">
                            <SelectItem value="20-50">20-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Base Currency</label>
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger className="w-full h-10 border-input bg-background text-foreground text-xs font-semibold justify-between px-3">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent position="popper" align="start">
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex justify-end mt-8">
                  <Button 
                    onClick={handleNextStep} 
                    className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all duration-150 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Integrations (Slack & Google) */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Connect workflow sync</h2>
                    <p className="text-xs text-muted-foreground">Connect Slack for notifications and Google Workspace to fetch team structure.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Slack Card */}
                    <div className={`flex items-center justify-between p-4 border rounded-xl transition duration-150 ${
                      integrations.slack 
                        ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/30 dark:bg-emerald-950/10" 
                        : "border-border hover:border-slate-300 dark:hover:border-slate-700 bg-card"
                    }`}>
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
                          integrations.slack ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-pink-50 dark:bg-pink-950/30 text-pink-500"
                        }`}>
                          💬
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-foreground">Slack App</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Send alerts, approve spend inside Slack.</p>
                        </div>
                      </div>
                      <Button 
                        onClick={toggleSlack} 
                        disabled={connectingSlack}
                        variant={integrations.slack ? "outline" : "default"}
                        className={`px-3.5 py-1.5 h-8 text-[10px] font-bold rounded-lg shadow-2xs hover:shadow transition-all duration-150 cursor-pointer ${
                          integrations.slack 
                            ? "border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400" 
                            : "bg-slate-950 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950"
                        }`}
                      >
                        {connectingSlack ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : integrations.slack ? (
                          "Connected ✓"
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    </div>

                    {/* Google Card */}
                    <div className={`flex items-center justify-between p-4 border rounded-xl transition duration-150 ${
                      integrations.google 
                        ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/30 dark:bg-emerald-950/10" 
                        : "border-border hover:border-slate-300 dark:hover:border-slate-700 bg-card"
                    }`}>
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
                          integrations.google ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-blue-50 dark:bg-blue-950/30 text-blue-500"
                        }`}>
                          ✉️
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-foreground">Google Workspace</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Sync departments & invite team structure.</p>
                        </div>
                      </div>
                      <Button 
                        onClick={toggleGoogle} 
                        disabled={connectingGoogle}
                        variant={integrations.google ? "outline" : "default"}
                        className={`px-3.5 py-1.5 h-8 text-[10px] font-bold rounded-lg shadow-2xs hover:shadow transition-all duration-150 cursor-pointer ${
                          integrations.google 
                            ? "border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400" 
                            : "bg-slate-950 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950"
                        }`}
                      >
                        {connectingGoogle ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : integrations.google ? (
                          "Connected ✓"
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex justify-between mt-8">
                  <Button 
                    onClick={handlePrevStep}
                    variant="outline"
                    className="px-4 py-2 border border-input hover:bg-muted text-foreground rounded-lg text-xs font-bold transition duration-150 flex items-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back</span>
                  </Button>
                  <Button 
                    onClick={handleNextStep}
                    className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all duration-150 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Setup Teams & Invite Members */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Invite team members</h2>
                    <p className="text-xs text-muted-foreground">Specify team departments and email invites.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select Active Departments</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(departments).map((deptKey) => {
                          const label = deptKey.charAt(0).toUpperCase() + deptKey.slice(1)
                          const isChecked = departments[deptKey as keyof typeof departments]
                          return (
                            <label 
                              key={deptKey}
                              className={`flex items-center space-x-2.5 p-3 border rounded-lg text-xs font-semibold cursor-pointer hover:bg-muted/30 transition duration-150 ${
                                isChecked ? "border-indigo-500/30 bg-indigo-500/5 text-foreground" : "border-border text-muted-foreground"
                              }`}
                            >
                              <input 
                                type="checkbox" 
                                checked={isChecked} 
                                onChange={() => setDepartments(prev => ({
                                  ...prev,
                                  [deptKey]: !prev[deptKey as keyof typeof departments]
                                }))}
                                className="rounded border-border text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 shrink-0" 
                              />
                              <span>{label}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Invite Members by Email</label>
                      <textarea 
                        id="org-invites" 
                        rows={2} 
                        placeholder="sarah@company.com, david@company.com" 
                        value={invites}
                        onChange={(e) => setInvites(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 bg-background text-foreground outline-none resize-none min-h-[60px]"
                      />
                      <p className="text-[10px] text-muted-foreground">Separate email addresses with commas.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex justify-between mt-8">
                  <Button 
                    onClick={handlePrevStep}
                    variant="outline"
                    className="px-4 py-2 border border-input hover:bg-muted text-foreground rounded-lg text-xs font-bold transition duration-150 flex items-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back</span>
                  </Button>
                  <Button 
                    onClick={handleFinish}
                    disabled={loading}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-100/50 dark:shadow-none hover:shadow-lg transition-all duration-150 cursor-pointer flex items-center space-x-2"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Launch SpendFlow</span>
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
