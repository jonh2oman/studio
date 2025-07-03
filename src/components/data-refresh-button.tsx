
"use client";

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function DataRefreshButton() {
    const handleRefresh = () => {
        // A hard reload is the most reliable way to ensure all data is re-fetched from the server
        window.location.reload();
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    className="shadow-lg bg-background/50 backdrop-blur-md border border-white/10 text-muted-foreground hover:bg-background/70"
                    onClick={handleRefresh}
                >
                    <RefreshCw className="h-6 w-6" />
                    <span className="sr-only">Refresh Data</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
                <p>Refresh App Data</p>
            </TooltipContent>
        </Tooltip>
    );
}
