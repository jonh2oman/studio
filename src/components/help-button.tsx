
"use client";

import { useHelp } from "@/hooks/use-help";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function HelpButton() {
    const { toggleHelp } = useHelp();

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    className="shadow-lg bg-background/50 backdrop-blur-md border border-white/10 text-primary hover:bg-background/70 animate-subtle-pulse"
                    onClick={toggleHelp}
                >
                    <HelpCircle className="h-6 w-6" />
                    <span className="sr-only">Help</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
                <p>Get Help</p>
            </TooltipContent>
        </Tooltip>
    );
}
