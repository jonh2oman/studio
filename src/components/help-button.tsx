
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
                <Button size="icon" className="shadow-lg" onClick={toggleHelp}>
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
