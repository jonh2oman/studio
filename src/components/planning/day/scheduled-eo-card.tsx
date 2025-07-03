"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useTrainingYear } from "@/hooks/use-training-year";
import type { ScheduledItem } from "@/lib/types";
import { X } from "lucide-react";

interface ScheduledDayEoCardProps {
    item: ScheduledItem;
    plannerId: string;
    slotId: string;
}

export function ScheduledDayEoCard({ item, plannerId, slotId }: ScheduledDayEoCardProps) {
    const { removeEoFromDayPlanner } = useTrainingYear();
    
    return (
        <div className="bg-background text-sm h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold pr-2">{item.eo.id.split('-').slice(1).join('-')}</p>
                    <Button variant="ghost" size="icon" className="h-5 w-5 -mr-1 -mt-1" onClick={() => removeEoFromDayPlanner(plannerId, slotId)}>
                        <X className="h-3.5 w-3.5"/>
                        <span className="sr-only">Remove</span>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-tight">{item.eo.title}</p>
            </div>
        </div>
    );
}

    