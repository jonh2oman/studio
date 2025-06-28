
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMemo } from "react";

export function HelpButton() {
    const pathname = usePathname();

    const helpLink = useMemo(() => {
        if (pathname.startsWith('/planner')) return '/instructions#planner';
        if (pathname.startsWith('/weekends')) return '/instructions#weekend-planner';
        if (pathname.startsWith('/lda')) return '/instructions#lda-planner';
        if (pathname.startsWith('/ada')) return '/instructions#ada';
        if (pathname.startsWith('/reports')) return '/instructions#reports';
        if (pathname.startsWith('/cadets')) return '/instructions#cadets';
        if (pathname.startsWith('/attendance')) return '/instructions#attendance';
        if (pathname.startsWith('/awards')) return '/instructions#awards';
        if (pathname.startsWith('/settings')) return '/instructions#settings';
        if (pathname.startsWith('/instructions')) return '/instructions';
        return '/instructions#dashboard';
    }, [pathname]);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button asChild size="icon" className="shadow-lg">
                     <Link href={helpLink}>
                        <HelpCircle className="h-6 w-6" />
                        <span className="sr-only">Help</span>
                    </Link>
                </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
                <p>Get Help</p>
            </TooltipContent>
        </Tooltip>
    )
}
