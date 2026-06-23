"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input as UiInput } from "@/components/ui/input"
import { CheckCircle2, AlertCircle, Sparkles, Mail, Loader2 } from "lucide-react"

interface LoginViewProps {
  onNavigateToSetup: () => void
}

export function LoginView({ onNavigateToSetup }: LoginViewProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [ssoLoading, setSsoLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      showToast("Magic link sent! Redirecting to setup...", "success")
      await login(email)
    } catch (err) {
      showToast("Something went wrong.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setSsoLoading(true)
    try {
      showToast("Authenticated via Google SSO", "success")
      await login("alex.rivera@acme.co")
    } catch (err) {
      showToast("Google SSO failed", "error")
    } finally {
      setSsoLoading(false)
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
        <div className="my-auto space-y-6 relative z-10 max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight leading-tight"
          >
            Spend governance, built for fast-moving teams.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-400 text-base leading-relaxed"
          >
            Say goodbye to Slack approval channels and spreadsheet audits. Streamline software licenses, hardware procurement, and marketing expenses in seconds.
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
                <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center font-bold text-xs">SJ</div>
                <div className="text-left">
                  <p className="text-xs font-semibold">Sarah Jenkins</p>
                  <p className="text-[10px] text-slate-400">Design Lead</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">Design Budget</span>
            </div>
            <div className="flex justify-between items-center text-left">
              <div>
                <p className="text-xs text-slate-400">Requesting</p>
                <p className="text-sm font-bold mt-0.5">Figma Enterprise (x12)</p>
              </div>
              <p className="text-lg font-bold text-indigo-300">$2,160.00</p>
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded font-medium flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Manager Approved
              </span>
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

      {/* Right Column: Login Card & SSO */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-24 bg-background">
        <div className="mx-auto w-full max-w-md space-y-8 text-left">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Sign in to SpendFlow
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Or{" "}
              <button 
                onClick={onNavigateToSetup} 
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                create a new organization
              </button>
            </p>
          </div>

          {/* Action Fields */}
          <div className="space-y-6">
            {/* Google SSO */}
            <Button 
              onClick={handleGoogleLogin} 
              disabled={loading || ssoLoading}
              variant="outline"
              className="w-full flex items-center justify-center py-5 border border-border rounded-lg bg-card hover:bg-muted text-foreground font-semibold transition cursor-pointer shadow-xs space-x-3"
            >
              {ssoLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              <span>{ssoLoading ? "Authenticating..." : "Continue with Google"}</span>
            </Button>

            {/* Separator */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <span className="relative z-10 px-4 bg-background text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Or email sign in
              </span>
            </div>

            {/* Email Input */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
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
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || ssoLoading}
                    className="w-full pl-9 pr-4 py-5 border border-border rounded-lg text-foreground focus:outline-none placeholder-muted-foreground text-xs"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || ssoLoading || !email}
                className="w-full py-5 bg-slate-950 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 rounded-lg font-bold shadow-xs transition cursor-pointer flex items-center justify-center space-x-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{loading ? "Sending link..." : "Send Magic Link"}</span>
              </Button>
            </form>
          </div>

          <div className="pt-6 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground leading-normal">
              By signing in, you agree to our{" "}
              <a href="#" className="underline hover:text-foreground">Terms of Service</a> and{" "}
              <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
