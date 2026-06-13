"use client"

import React, { useState } from "react"
import { useMembers } from "@/hooks/use-members"
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

interface InviteMemberDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (message: string) => void
}

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Operations",
  "Sales",
  "Finance & Admin",
]

const ROLES = ["Admin", "Manager", "Employee"]

export function InviteMemberDrawer({ open, onOpenChange, onSuccess }: InviteMemberDrawerProps) {
  const { inviteMember } = useMembers()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("Engineering")
  const [role, setRole] = useState("Employee")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Please enter a full name.")
      return
    }

    if (!email.trim()) {
      setError("Please enter an email address.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    // Call hook action
    inviteMember({
      name: name.trim(),
      email: email.trim(),
      department,
      role,
    })

    // Reset state
    setName("")
    setEmail("")
    setDepartment("Engineering")
    setRole("Employee")

    if (onSuccess) {
      onSuccess(`Invitation email sent successfully to ${email}!`)
    }

    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full flex flex-col h-full bg-card border-l border-border p-0 text-foreground">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border flex flex-row items-center justify-between gap-0">
          <div>
            <SheetTitle className="text-base font-extrabold text-foreground tracking-tight">
              Invite Team Member
            </SheetTitle>
            <SheetDescription className="text-[10px] text-muted-foreground mt-1">
              Add a new teammate to your workspace and configure their access permissions.
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-bold rounded-lg text-left">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="member-name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Full Name
              </label>
              <Input
                id="member-name"
                type="text"
                required
                placeholder="e.g. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-semibold p-2.5"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="member-email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Email Address
              </label>
              <Input
                id="member-email"
                type="email"
                required
                placeholder="jane.doe@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-semibold p-2.5"
              />
            </div>

            {/* Department Select */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Department
              </label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-full h-10 border-input rounded-md bg-background text-foreground text-xs font-semibold justify-between px-3">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Access Role Select */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Access Role
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full h-10 border-input rounded-md bg-background text-foreground text-xs font-semibold justify-between px-3">
                  <SelectValue placeholder="Select access role" />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
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
                Send Invitation
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
