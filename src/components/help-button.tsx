
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
                    className="shadow-lg bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 animate-subtle-pulse"
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
