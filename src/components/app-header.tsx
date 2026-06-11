"use client"

import React from "react"
import { Bell, Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4 md:px-8">
      {/* Left side: Sidebar Trigger (mobile/desktop toggle) and search bar */}
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="text-slate-500 hover:text-slate-900 md:hidden" />
        
        <div className="relative hidden w-64 md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-3.5 w-3.5" />
          </span>
          <input
            type="text"
            placeholder="Global search or shortcut..."
            readOnly
            className="w-full pl-8 pr-4 py-1.5 border border-slate-100 rounded-lg text-xs bg-slate-50/50 hover:border-slate-200 transition cursor-pointer outline-none focus:border-slate-300"
          />
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center space-x-4 md:space-x-5">
        {/* Mobile Search Button (optional placeholder) */}
        <button className="p-1 text-slate-400 hover:text-slate-600 transition md:hidden" title="Search">
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications Icon Bell */}
        <button className="relative p-1 text-slate-400 hover:text-slate-600 transition" title="Notifications">
          <Bell className="h-5 w-5" />
          {/* Active notification indicator dot */}
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-indigo-600 border-2 border-white"></span>
        </button>

        {/* Divider */}
        <span className="hidden h-4 w-[1px] bg-slate-200 md:block"></span>

        {/* Profile Info */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-800">Alex Rivera</p>
            <p className="text-[9px] font-medium text-slate-400">Finance Board</p>
          </div>
          <Avatar className="h-7 w-7">
            <AvatarImage
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Alex Rivera"
            />
            <AvatarFallback className="text-xs font-bold">AR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
