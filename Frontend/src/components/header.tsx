"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Salad } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollPosition } from "@/hooks/use-scroll-position"

const navItems = ["Features", "How It Works", "Testimonials", "Pricing"]

export default function Header() {
  const scrollPosition = useScrollPosition()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsMenuOpen(false)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrollPosition > 10 ? "bg-background/80 backdrop-blur-md border-b" : "bg-background",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Salad className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">FitFuel</span>
        </div>

        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* ModeToggle removed from here */}
          <Button asChild className="hidden md:flex rounded-full">
            <Link href="#get-started">Get Started</Link>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={(e) => {
              e.stopPropagation()
              setIsMenuOpen(!isMenuOpen)
            }}
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("h-6 w-6 transition-all", isMenuOpen ? "hidden" : "block")}
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("h-6 w-6 transition-all", isMenuOpen ? "block" : "hidden")}
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-sm border-b shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="container py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium py-2 transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <Button asChild className="w-full rounded-full mt-2">
              <Link href="#get-started" onClick={() => setIsMenuOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
