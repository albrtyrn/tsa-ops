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
  ChefHat,
  Car,
  Package,
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
  { title: "Recipe Vault", href: "/dashboard/recipes", icon: ChefHat },
  { title: "Driver Roster", href: "/dashboard/logistics/drivers", icon: Car },
  { title: "Inventory & Custody", href: "/dashboard/logistics/inventory", icon: Package },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
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
              name: user.user_metadata?.name || user.email || "",
              role: user.user_metadata?.role || "",
            })
          }
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.warn("Could not fetch user profile details:")
        setProfile(null)
      }
    }
    loadProfile()

    if (typeof window !== "undefined") {
      window.addEventListener("profile-updated", loadProfile)
      return () => {
        window.removeEventListener("profile-updated", loadProfile)
      }
    }
  }, [pathname])

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-8 py-4 group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:justify-center">
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
          <div className="flex flex-col leading-none group-data-[state=collapsed]:hidden">
            <span className="text-base font-bold text-foreground tracking-tight">TSA Culinary</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Operations</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-8 py-2 group-data-[state=collapsed]:px-2">
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
        <div className="flex items-center justify-between gap-2 px-8 py-4 border-t border-border/40 group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:justify-center">
          <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="size-8">
              {profile?.name ? (
                <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
              ) : (
                <AvatarFallback className="bg-muted" />
              )}
            </Avatar>
            <div className="flex flex-col leading-tight overflow-hidden group-data-[state=collapsed]:hidden">
              <span className="text-sm font-semibold truncate max-w-[110px]">
                {profile?.name || ""}
              </span>
              <span className="text-[10px] text-muted-foreground truncate max-w-[110px]">
                {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : ""}
              </span>
            </div>
          </div>
          <button
            onClick={() => logoutAction()}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0 group-data-[state=collapsed]:hidden"
            title="Log out"
          >
            <LogOut className="size-4.5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
