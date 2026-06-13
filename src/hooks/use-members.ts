"use client"

import { useState, useEffect } from "react"

export interface Member {
  name: string
  email: string
  avatar?: string
  role: string
  department: string
  status: "active" | "invited"
}

const STORAGE_KEY = "spendflow_members"

const INITIAL_MEMBERS: Member[] = [
  {
    name: "Alex Rivera (You)",
    email: "alex.r@acme.co",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "Admin",
    department: "Finance & Admin",
    status: "active",
  },
  {
    name: "Sarah Jenkins",
    email: "sarah.j@acme.co",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "Employee",
    department: "Design",
    status: "active",
  },
  {
    name: "David Kim",
    email: "d.kim@acme.co",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "Manager",
    department: "Engineering",
    status: "active",
  },
]

export function useMembers() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [isMounted, setIsMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setMembers(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse members from localStorage", e)
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS))
    }
  }, [])

  const updateMembersState = (newMembers: Member[]) => {
    setMembers(newMembers)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMembers))
      window.dispatchEvent(new Event("storage_members_updated"))
    }
  }

  // Synchronize state across instances/tabs
  useEffect(() => {
    const handleMembersUpdate = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setMembers(JSON.parse(stored))
        } catch (e) {
          console.error(e)
        }
      }
    }

    window.addEventListener("storage_members_updated", handleMembersUpdate)
    window.addEventListener("storage", handleMembersUpdate)

    return () => {
      window.removeEventListener("storage_members_updated", handleMembersUpdate)
      window.removeEventListener("storage", handleMembersUpdate)
    }
  }, [])

  const inviteMember = (memberData: {
    name: string
    email: string
    role: string
    department: string
  }) => {
    const newMember: Member = {
      name: memberData.name,
      email: memberData.email,
      role: memberData.role,
      department: memberData.department,
      status: "invited",
    }
    const updated = [...members, newMember]
    updateMembersState(updated)

    // Append to audit logs
    const storedLogs = localStorage.getItem("spendflow_auditlogs")
    const auditLogs = storedLogs ? JSON.parse(storedLogs) : []
    const newLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      user: "Alex Rivera",
      role: "Design Manager",
      action: `Invited Team Member ${newMember.name}`,
      target: newMember.email,
      timestamp: new Date().toISOString(),
      changes: {
        before: "Status: Uninvited",
        after: `Invited ${newMember.name} as ${newMember.role} (${newMember.department})`
      }
    }
    localStorage.setItem("spendflow_auditlogs", JSON.stringify([newLog, ...auditLogs]))
    window.dispatchEvent(new Event("storage_auditlogs_updated"))

    return newMember
  }

  return {
    members,
    inviteMember,
    isMounted,
  }
}
