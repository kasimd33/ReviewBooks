"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [ripple, setRipple] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    setRipple(true)
    setTheme(theme === "light" ? "dark" : "light")
    setTimeout(() => setRipple(false), 600)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        className="relative overflow-hidden rounded-full border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 hover:scale-110"
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4 text-purple-600 transition-transform duration-300 hover:rotate-12" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500 transition-transform duration-300 hover:rotate-180" />
        )}
        <span className="sr-only">Toggle theme</span>
        
        {ripple && (
          <span className="absolute inset-0 animate-ripple rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-30" />
        )}
      </Button>
      
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.6;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}