
"use client";

import { useState } from 'react';
import { Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BugReportDialog } from './bug-report-dialog';

export function BugReportButton() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size="icon"
                        variant="outline"
                        className="shadow-lg bg-background/50 backdrop-blur-md border border-white/10 text-destructive hover:bg-background/70"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Bug className="h-6 w-6" />
                        <span className="sr-only">Report a Bug</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left" align="center">
                    <p>Report a Bug</p>
                </TooltipContent>
            </Tooltip>
            {isDialogOpen && <BugReportDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />}
        </>
    )
}
