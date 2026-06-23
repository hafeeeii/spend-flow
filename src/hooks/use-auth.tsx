"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface UserInfo {
  name: string
  email: string
  avatar: string
  role: string
  department: string
}

export interface OrgInfo {
  name: string
  size: string
  currency: string
  integrations: {
    slack: boolean
    google: boolean
  }
  departments: string[]
  invites: string[]
}

interface AuthContextType {
  currentUser: UserInfo | null
  organization: OrgInfo | null
  loading: boolean
  login: (email: string) => Promise<void>
  signup: (name: string, email: string, role: string, department: string) => Promise<void>
  setupOrg: (orgData: OrgInfo) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)
  const [organization, setOrganization] = useState<OrgInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("sf_user")
      const org = localStorage.getItem("sf_org")
      
      if (user) {
        try {
          setCurrentUser(JSON.parse(user))
        } catch (e) {
          console.error("Failed to parse user from localStorage", e)
        }
      }
      if (org) {
        try {
          setOrganization(JSON.parse(org))
        } catch (e) {
          console.error("Failed to parse organization from localStorage", e)
        }
      }
      setLoading(false)
    }
  }, [])

  const login = async (email: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    const user: UserInfo = {
      name: "Alex Rivera",
      email: email || "alex.rivera@acme.co",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Design Manager",
      department: "Design"
    }
    setCurrentUser(user)
    if (typeof window !== "undefined") {
      localStorage.setItem("sf_user", JSON.stringify(user))
    }
  }

  const signup = async (name: string, email: string, role: string, department: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    const user: UserInfo = {
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      role,
      department
    }
    setCurrentUser(user)
    if (typeof window !== "undefined") {
      localStorage.setItem("sf_user", JSON.stringify(user))
    }
  }

  const setupOrg = async (orgData: OrgInfo) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    setOrganization(orgData)
    if (typeof window !== "undefined") {
      localStorage.setItem("sf_org", JSON.stringify(orgData))
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setOrganization(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("sf_user")
      localStorage.removeItem("sf_org")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        organization,
        loading,
        login,
        signup,
        setupOrg,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
