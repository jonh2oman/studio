
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "ocean" | "blue" | "green" | "red"

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "ocean",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "ocean",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  // On mount, load theme from localStorage
  useEffect(() => {
    let storedTheme: Theme | null = null;
    try {
      storedTheme = localStorage.getItem(storageKey) as Theme | null
      if (storedTheme) {
        setTheme(storedTheme)
      }
    } catch (e) {
      console.error("Failed to read theme from localStorage", e);
    }
  }, [storageKey])

  // When theme changes, update DOM and localStorage
  useEffect(() => {
    const root = window.document.documentElement
    
    // Clean up old theme classes
    root.classList.remove("theme-blue", "theme-green", "theme-red")

    // Add the new theme class if it's not the default "ocean"
    if (theme && theme !== "ocean") {
      root.classList.add(`theme-${theme}`)
    }
    
    // Save the new theme to localStorage
    try {
      localStorage.setItem(storageKey, theme)
    } catch (e) {
      console.error("Failed to save theme to localStorage", e)
    }
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
