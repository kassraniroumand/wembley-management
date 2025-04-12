import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAtom } from 'jotai'
import { authAtom, roleAtom } from '@/model/atoms'
import { logout } from '@/utils/authUtils'
import { useState, useMemo } from 'react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Menu,
  LogOut,
  Home,
  X
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { filterMenuItemsByRoles } from '@/router'

const ModernLayout = () => {
  const [auth] = useAtom(authAtom)
  const [roles] = useAtom(roleAtom)
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Filter menu items based on user roles
  console.log("roles", roles);

  const navLinks = useMemo(() => {
    return filterMenuItemsByRoles(roles)
  }, [roles])
  console.log("navLinks", navLinks);


  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-accent' : 'hover:bg-accent/50'
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Mobile sidebar toggle */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] px-0">
                <div className="flex items-center justify-between px-4">
                  <Link to="/" className="text-xl font-bold">
                    Dashboard
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="mt-6 space-y-1 px-2">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.path}>
                      <Link
                        to={link.path}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive(link.path)}`}
                      >
                        {link.icon}
                        {link.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Management</span>
            </Link>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{auth?.username}</p>
                {roles.includes('admin') && (
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-xs">
                    Admin
                  </Badge>
                )}
                {roles.includes('manager') && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                    Manager
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{auth?.email}</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/default.png" />
              <AvatarFallback>{auth?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 border-r">
          <div className="h-full px-3 py-4">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive(link.path)}`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            <Card className="p-6">
              <Outlet />
            </Card>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Management Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default ModernLayout
