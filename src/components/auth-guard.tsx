"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { LoginView } from "@/views/auth/login-view"
import { SignupView } from "@/views/auth/signup-view"
import { OnboardingView } from "@/views/auth/onboarding-view"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, organization, loading, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [view, setView] = useState<"login" | "signup">("login")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">Checking session...</p>
        </div>
      </div>
    )
  }

  // Scenario 1: User is not authenticated, show Login or Signup
  if (!currentUser) {
    if (view === "login") {
      return <LoginView onNavigateToSetup={() => setView("signup")} />
    } else {
      return <SignupView onNavigateToLogin={() => setView("login")} />
    }
  }

  // Scenario 2: User is authenticated but organization is not set up yet
  if (!organization) {
    return (
      <OnboardingView 
        onNavigateToLogin={logout} 
      />
    )
  }

  // Scenario 3: Logged in and organization setup is complete - show full application shell
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
