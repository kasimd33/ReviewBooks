"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  className?: string
}

export function SearchBar({
  placeholder = "Search books by title or author...",
  value: controlledValue,
  onChange,
  onSubmit,
  className
}: SearchBarProps) {
  const [value, setValue] = useState(controlledValue || "")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue)
    }
  }, [controlledValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onChange?.(newValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(value)
  }

  const handleClear = () => {
    setValue("")
    onChange?.("")
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative group", className)}>
      <div
        className={cn(
          "relative flex items-center rounded-full border-2 bg-white/90 backdrop-blur-sm transition-all duration-300 ease-out",
          "hover:bg-white hover:shadow-xl hover:shadow-purple/10",
          isFocused
            ? "border-purple-400 bg-white shadow-2xl shadow-purple/20 ring-4 ring-purple/10"
            : "border-purple-200 hover:border-purple-300"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center pl-4 transition-colors duration-200",
            isFocused ? "text-purple-600" : "text-gray-500"
          )}
        >
          <Search
            className={cn(
              "h-4 w-4 transition-all duration-300",
              isFocused && "scale-110"
            )}
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent px-3 py-3 text-sm text-gray-900 placeholder:text-gray-500",
            "focus:outline-none focus:ring-0",
            "transition-all duration-200"
          )}
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "mr-2 flex h-6 w-6 items-center justify-center rounded-full",
              "bg-muted/50 text-muted-foreground opacity-0 transition-all duration-200",
              "hover:bg-muted hover:text-foreground group-hover:opacity-100",
              isFocused && "opacity-100"
            )}
          >
            <X className="h-3 w-3" />
          </button>
        )}
        
        <button
          type="submit"
          className={cn(
            "mr-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 text-sm font-medium text-white",
            "transition-all duration-200 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg",
            "focus:outline-none focus:ring-2 focus:ring-purple/20 focus:ring-offset-2",
            "active:scale-95"
          )}
        >
          Search
        </button>
      </div>
      
      {/* Animated border gradient */}
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple/20 via-pink/10 to-purple/20",
          "opacity-0 blur-xl transition-opacity duration-500",
          isFocused && "opacity-100"
        )}
      />
    </form>
  )
}