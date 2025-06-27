
"use client"

import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: "ocean", color: "hsl(175 75% 40%)" },
    { name: "blue", color: "hsl(217 91% 60%)" },
    { name: "green", color: "hsl(142 76% 36%)" },
    { name: "red", color: "hsl(0 84.2% 60.2%)" },
  ]

  return (
    <div className="flex items-center gap-2">
      {themes.map((t) => (
        <Tooltip key={t.name}>
            <TooltipTrigger asChild>
                <Button
                    variant={theme === t.name ? "secondary" : "ghost"}
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => setTheme(t.name as any)}
                >
                    <span
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: t.color }}
                    />
                    <span className="sr-only">Switch to {t.name} theme</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
                <p className="capitalize">{t.name}</p>
            </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
