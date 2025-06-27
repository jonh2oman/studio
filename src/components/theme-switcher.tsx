
"use client"

import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "./ui/label"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: "ocean", color: "hsl(175 75% 40%)" },
    { name: "blue", color: "hsl(217 91% 60%)" },
    { name: "green", color: "hsl(142 76% 36%)" },
    { name: "red", color: "hsl(0 84.2% 60.2%)" },
  ]

  return (
    <div className="space-y-2">
      <Label>Accent Color</Label>
      <div className="flex items-center gap-2 p-2 rounded-md border w-fit">
        {themes.map((t) => {
          const isActive = theme === t.name
          return (
            <Tooltip key={t.name}>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-md",
                    isActive && "border-2 border-primary"
                  )}
                  onClick={() => setTheme(t.name as any)}
                  style={{ backgroundColor: t.color }}
                >
                  {isActive && <Check className="h-5 w-5 text-primary-foreground" />}
                  <span className="sr-only">Switch to {t.name} theme</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p className="capitalize">{t.name}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
