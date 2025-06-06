"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Calendar, FileText, LogOut, Menu, Settings, Users, X, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface SidebarProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [verified, setVerified] = useState(false)
  const [userRole, setUserRole] = useState("")

  const isPrintPage = pathname?.startsWith("/main/dashboard/report/print")

  

  const verifyToken = async () => {
    const token = Cookies.get("token") || ""
    if (!token) {
      router.push("/main/login")
      return
    }
    try {
      const response = await fetch("https://api.metrocraftproduction.xyz/edu/spensa/absen/v1/admin/user/me", {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        const role = data.data.admin.role
        setUserRole(role)
        Cookies.set("token", token)
        setVerified(true)
      } else {
        router.push("/main/main")
      }
    } catch {
      router.push("/main/main")
    }
  }

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/main/dashboard",
      active: pathname === "/main/dashboard",
    },
    {
      label: "Presence",
      icon: Calendar,
      href: "/main/dashboard/presence",
      active: pathname === "/main/dashboard/presence",
    },
    {
      label: "Students",
      icon: Users,
      href: "/main/dashboard/students",
      active: pathname === "/main/dashboard/students",
      hidden : !(userRole === "admin"||userRole === "superadmin" || userRole === "root")
    },
    {
      label: "Report of Attendance",
      icon: FileText,
      href: "/main/dashboard/report",
      active: pathname === "/main/dashboard/report",
      hidden : !(userRole === "admin"||userRole === "superadmin" || userRole === "root")
    },
    {
      label: "Admins",
      icon: Shield,
      href: "/main/dashboard/admins",
      active: pathname === "/main/dashboard/admins",
      hidden: !(userRole === "superadmin" || userRole === "root")
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/main/dashboard/settings",
      active: pathname === "/main/dashboard/settings",
    },
  ]

  const filteredRoutes = routes.filter(route => {
  // Jika properti hidden ada dan bernilai true, berarti route harus disembunyikan
  // Jadi kita hanya ambil yang hidden-nya false atau undefined
  return !route.hidden;
});

  useEffect(() => {
    if (!verified) {
      verifyToken()
    }
  }, [verified])

  const onLogout = () => {
    Cookies.remove("token")
    router.push("/main/main/login")
  }

  if (isPrintPage) {
    // Sidebar gak ada, children langsung tampil full tanpa wrapper apapun
    return <>{children}</>
  }

  return (
    <div className="h-full relative">
      <div className="animated-bg"></div>
      <div className="grid-lines"></div>

      {/* Sidebar desktop */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] futuristic-sidebar">
        <div className="flex flex-col h-full">
          <div className="h-24 flex items-center px-6 border-b border-blue-900/20">
            <h1 className="text-xl font-bold futuristic-gradient-text leading-snug">
              SPENSA PRESENCE SYSTEM
            </h1>
          </div>
          <div className="flex-1 flex flex-col">
            <nav className="flex-1 px-3 py-4 space-y-1">
              {filteredRoutes.map((route) => (
                <Button
                  key={route.href}
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    route.active
                      ? "bg-blue-900/30 text-blue-400 border border-blue-500/20 futuristic-glow"
                      : "text-gray-300 hover:text-blue-400 hover:bg-blue-900/20"
                  )}
                  onClick={() => router.push(route.href)}
                >
                  <route.icon className="h-5 w-5 mr-3" />
                  {route.label}
                </Button>
              ))}
            </nav>
            <div className="px-3 py-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-red-400 hover:bg-red-900/20"
                onClick={onLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with padding sidebar */}
      <main className="md:pl-72 h-full">
        <div className="flex items-center p-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="font-bold text-xl ml-2 futuristic-gradient-text">SPENSA PRESENCE SYSTEM</h1>
        </div>

        {/* Sidebar mobile sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0 futuristic-sidebar">
            <div className="flex flex-col h-full">
              <div className="h-16 flex items-center px-6 border-b border-blue-900/20">
                <h1 className="text-xl font-bold futuristic-gradient-text">SPENSA PRESENCE SYSTEM</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto text-white"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 flex flex-col">
                <nav className="flex-1 px-3 py-4 space-y-1">
                  {filteredRoutes.map((route) => (
                    <Button
                      key={route.href}
                      variant={route.active ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        route.active
                          ? "bg-blue-900/30 text-blue-400 border border-blue-500/20 futuristic-glow"
                          : "text-gray-300 hover:text-blue-400 hover:bg-blue-900/20"
                      )}
                      onClick={() => {
                        router.push(route.href)
                        setOpen(false)
                      }}
                    >
                      <route.icon className="h-5 w-5 mr-3" />
                      {route.label}
                    </Button>
                  ))}
                </nav>
                <div className="px-3 py-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-red-400 hover:bg-red-900/20"
                    onClick={onLogout}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Log out
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
