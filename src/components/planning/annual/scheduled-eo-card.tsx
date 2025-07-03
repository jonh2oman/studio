
"use client";

import { Button } from "@/components/ui/button";
import { useSchedule } from "@/hooks/use-schedule";
import type { ScheduledItem } from "@/lib/types";
import { X } from "lucide-react";
import React from "react";

interface ScheduledEoCardProps {
    item: ScheduledItem;
    slotId: string;
}

export function ScheduledEoCard({ item, slotId }: ScheduledEoCardProps) {
    const { removeScheduleItem } = useSchedule();
    
    return (
        <div className="bg-background border rounded-md p-2 text-sm h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold pr-2">{item.eo.id.split('-').slice(1).join('-')}</p>
                    <Button variant="ghost" size="icon" className="h-5 w-5 -mr-1 -mt-1" onClick={() => removeScheduleItem(slotId)}>
                        <X className="h-3.5 w-3.5"/>
                        <span className="sr-only">Remove</span>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-tight">{item.eo.title}</p>
            </div>
             <div className="mt-2 text-xs text-muted-foreground">
                <p>Inst: {item.instructor || 'TBA'}</p>
                <p>Loc: {item.classroom || 'TBA'}</p>
            </div>
        </div>
    );
}
