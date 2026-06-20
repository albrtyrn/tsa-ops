"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  CalendarDays,
  LayoutTemplate,
  BarChart3,
  Settings,
  LogOut,
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
import { supabase } from "@/lib/supabase"
import { logoutAction } from "@/app/actions/auth"

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Events", href: "/events", icon: CalendarDays },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
]

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean)
  if (parts.length === 0) return "?"
  return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase()
}

export function AppSidebar() {
  const pathname = usePathname()
  const [profile, setProfile] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("name, role")
            .eq("id", user.id)
            .maybeSingle()

          if (data) {
            setProfile({ name: data.name, role: data.role })
          } else {
            setProfile({
              name: user.user_metadata?.name || user.email || "Culinary Officer",
              role: "Officer",
            })
          }
        }
      } catch (err) {
        console.warn("Could not fetch user profile details:", err)
      }
    }
    loadProfile()
  }, [])

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
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Operations</span>
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
        <div className="flex items-center justify-between gap-2 px-8 py-4 border-t border-border/40">
          <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="size-8">
              <AvatarFallback>{getInitials(profile?.name || "Albert Yorn")}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="text-sm font-semibold truncate max-w-[110px]">{profile?.name || "Albert Yorn"}</span>
              <span className="text-[10px] text-muted-foreground truncate max-w-[110px]">{profile?.role || "Culinary Chair"}</span>
            </div>
          </div>
          <button
            onClick={() => logoutAction()}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0"
            title="Log out"
          >
            <LogOut className="size-4.5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
