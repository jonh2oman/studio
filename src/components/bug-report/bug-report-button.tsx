
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
                        className="rounded-full w-14 h-14 shadow-lg bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Bug className="h-7 w-7" />
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
