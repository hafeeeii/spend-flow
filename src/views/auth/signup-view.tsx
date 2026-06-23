"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input as UiInput } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, AlertCircle, Loader2, Mail, User, ShieldCheck, Briefcase } from "lucide-react"

interface SignupViewProps {
  onNavigateToLogin: () => void
}

export function SignupView({ onNavigateToLogin }: SignupViewProps) {
  const { signup } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("Engineering")
  const [role, setRole] = useState("EMPLOYEE")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      showToast("Please fill in all fields", "error")
      return
    }
    setLoading(true)
    try {
      const displayRole = role === "CFO" ? "CFO" : role.charAt(0) + role.slice(1).toLowerCase()
      showToast("Account created successfully! Redirecting...", "success")
      await signup(name, email, displayRole, department)
    } catch (err) {
      showToast("Registration failed", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground relative overflow-hidden">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-955 px-4 py-3 rounded-lg shadow-xl flex items-center space-x-2.5 text-xs font-bold border border-border"
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

      {/* Left Column: Trust-building & Branding Panel */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract grid background & glow rings */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-2.5 relative z-10">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-indigo-500/20">
            S
          </div>
          <span className="text-xl font-bold tracking-tight">SpendFlow</span>
        </div>

        {/* Middle: Key Value Proposition & Dynamic Graphic */}
        <div className="my-auto space-y-6 relative z-10 max-w-lg text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight leading-tight"
          >
            Create your account to start governing.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-400 text-base leading-relaxed"
          >
            Join thousands of fast-growing teams managing vendor spend, software subscriptions, and corporate cards with complete clarity.
          </motion.p>
          
          {/* Graphic Mock card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center font-bold text-xs">JD</div>
                <div className="text-left">
                  <p className="text-xs font-semibold">{name || "Jane Doe"}</p>
                  <p className="text-[10px] text-slate-400">{role === "CFO" ? "CFO" : role.charAt(0) + role.slice(1).toLowerCase()} &bull; {department}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">{department} Budget</span>
            </div>
            <div className="flex justify-between items-center text-left">
              <div>
                <p className="text-xs text-slate-400">Status</p>
                <p className="text-sm font-bold mt-0.5">Creating profile...</p>
              </div>
              <p className="text-xs font-bold text-indigo-300 italic">Self onboarding</p>
            </div>
          </motion.div>
        </div>

        {/* Footer: Customer Trust Logo Matrix */}
        <div className="relative z-10 text-left">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Governing budgets for teams at</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4 opacity-50 text-xs font-black tracking-widest text-slate-400">
            <span>LINEAR</span>
            <span>RETOOL</span>
            <span>VERCEL</span>
            <span>NOTION</span>
          </div>
        </div>
      </div>

      {/* Right Column: Sign Up Card */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-24 bg-background">
        <div className="mx-auto w-full max-w-md space-y-6 text-left">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Sign up for SpendFlow
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Already have an account?{" "}
              <button 
                onClick={onNavigateToLogin} 
                className="font-bold text-primary hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Action Fields */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <User className="h-4 w-4" />
                </span>
                <UiInput 
                  id="name" 
                  type="text" 
                  required 
                  placeholder="Jane Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-5 border border-border rounded-lg text-foreground focus:outline-none placeholder-muted-foreground text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Work Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </span>
                <UiInput 
                  id="email" 
                  type="email" 
                  required 
                  placeholder="jane.doe@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-5 border border-border rounded-lg text-foreground focus:outline-none placeholder-muted-foreground text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Department</label>
                <Select value={department} onValueChange={setDepartment} disabled={loading}>
                  <SelectTrigger className="w-full h-10 border-input bg-background text-foreground text-xs font-semibold justify-between px-3">
                    <SelectValue placeholder="Select dept" />
                  </SelectTrigger>
                  <SelectContent position="popper" align="start">
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Role</label>
                <Select value={role} onValueChange={setRole} disabled={loading}>
                  <SelectTrigger className="w-full h-10 border-input bg-background text-foreground text-xs font-semibold justify-between px-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent position="popper" align="start">
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="CFO">CFO</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading || !name || !email}
              className="w-full py-5 bg-slate-950 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 rounded-lg font-bold shadow-xs transition cursor-pointer flex items-center justify-center space-x-2 mt-4"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{loading ? "Creating Account..." : "Create Account & Continue"}</span>
            </Button>
          </form>

          <div className="pt-4 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground leading-normal">
              By signing up, you agree to our{" "}
              <a href="#" className="underline hover:text-foreground">Terms of Service</a> and{" "}
              <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
