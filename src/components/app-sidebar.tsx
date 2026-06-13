"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Wallet,
  Tag,
  Sliders,
  TrendingUp,
  ClipboardList,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { useRequests } from "@/hooks/use-requests"

export function AppSidebar() {
  const pathname = usePathname()
  const { requests, isMounted } = useRequests()

  const pendingCount = requests.filter(r => r.status === "pending").length

  const navItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "Inbox Queue",
      url: "/inbox",
      icon: Inbox,
      badge: isMounted && pendingCount > 0 ? pendingCount : null,
    },
    {
      title: "Requests",
      url: "/requests",
      icon: FileText,
      badge: null,
    },
    {
      title: "Budgets",
      url: "/budgets",
      icon: Wallet,
      badge: null,
    },
    {
      title: "Vendors",
      url: "/vendors",
      icon: Tag,
      badge: null,
    },
    {
      title: "Workflows",
      url: "/workflows",
      icon: Sliders,
      badge: null,
    },
    {
      title: "BI Analytics",
      url: "/analytics",
      icon: TrendingUp,
      badge: null,
    },
    {
      title: "Audit Logs",
      url: "/audit",
      icon: ClipboardList,
      badge: null,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      badge: null,
    },
  ]


  return (
    <Sidebar className="border-r border-sidebar-border transition-colors duration-200">
      <SidebarHeader className="p-5">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-sidebar-primary font-bold text-sidebar-primary-foreground text-sm">
            S
          </div>
          <span className="font-bold tracking-tight text-sidebar-foreground text-base">
            SpendFlow
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.url || (item.url === "/" && pathname === "/dashboard")
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`w-full px-3 py-3 rounded-md transition ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
