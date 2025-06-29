
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
                    className="shadow-lg bg-muted/20 text-muted-foreground border-muted/20 hover:bg-muted/30"
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
