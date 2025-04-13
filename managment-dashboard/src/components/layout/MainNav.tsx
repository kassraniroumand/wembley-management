import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Calendar, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import { publicPages, auth } from "@/types/CONSTANT"

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">EventHub</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to={publicPages.homeUrl} className="text-sm font-medium hover:text-primary">Home</Link>
          <Link to={publicPages.aboutUrl} className="text-sm font-medium hover:text-primary">About</Link>
          <Link to={publicPages.contactUrl} className="text-sm font-medium hover:text-primary">Contact</Link>
          <Link to={auth.loginUrl} className="text-sm font-medium hover:text-primary">Login</Link>
          <Button asChild>
            <Link to={auth.registerUrl}>Get Started</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">EventHub</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="flex flex-col gap-4">
                <Link
                  to={publicPages.homeUrl}
                  className="text-lg font-medium hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to={publicPages.aboutUrl}
                  className="text-lg font-medium hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  to={publicPages.contactUrl}
                  className="text-lg font-medium hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  to={auth.loginUrl}
                  className="text-lg font-medium hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Button asChild className="mt-4">
                  <Link to={auth.registerUrl} onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
