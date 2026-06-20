"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CalendarDays,
  LayoutTemplate,
  BarChart3,
  Settings,
} from "lucide-react"
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Events", href: "/events", icon: CalendarDays },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-8 py-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white border border-border shadow-sm overflow-hidden p-1">
            <Image 
              src="/tsaatuva.png" 
              alt="TSA Logo" 
              width={44} 
              height={44} 
              className="object-contain size-full"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold text-foreground tracking-tight">TSA Culinary</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Ops Copilot</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-8 py-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      className="px-4 py-5 text-base"
                      render={
                        <Link href={item.href} className="flex items-center gap-3 w-full">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-8 py-2">
          <Avatar className="size-8">
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium">Alex Chen</span>
            <span className="text-xs text-muted-foreground">Ops Manager</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
