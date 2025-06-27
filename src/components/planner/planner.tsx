
"use client";

import { useState } from "react";
import { ObjectivesList } from "@/components/planner/objectives-list";
import { CalendarView } from "@/components/planner/calendar-view";
import type { EO } from "@/lib/types";
import { useSchedule } from "@/hooks/use-schedule";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlannerProps {
  viewMode: string;
}

export default function Planner({ viewMode }: PlannerProps) {
    const { schedule, addScheduleItem, updateScheduleItem, removeScheduleItem, dayMetadata, updateDayMetadata } = useSchedule();
    const [objectivesVisible, setObjectivesVisible] = useState(true);

    const handleDrop = (date: string, period: number, phase: number, eo: EO) => {
        const slotId = `${date}-${period}-${phase}`;
        addScheduleItem(slotId, eo);
    };

    return (
        <div className="h-[calc(100vh-12rem)] rounded-lg border bg-card relative overflow-hidden print:h-auto print:overflow-visible print:border-none">
            {/* Floating Objectives Panel */}
            <div className={cn(
                "absolute top-0 left-0 h-full w-[340px] z-20 bg-card border-r transition-transform duration-300 ease-in-out print:hidden",
                objectivesVisible ? "translate-x-0" : "-translate-x-full"
            )}>
                <ObjectivesList />
            </div>

            {/* Main Content */}
            <div className="h-full">
                <CalendarView 
                    schedule={schedule} 
                    onDrop={handleDrop} 
                    onUpdate={updateScheduleItem}
                    onRemove={removeScheduleItem}
                    viewMode={viewMode}
                    dayMetadata={dayMetadata}
                    updateDayMetadata={updateDayMetadata}
                />
            </div>

            {/* Toggle Button */}
            <div className="absolute top-4 left-4 z-30 print:hidden">
                 <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setObjectivesVisible(!objectivesVisible)}
                    className={cn(
                        "transition-transform duration-300 ease-in-out bg-card hover:bg-muted",
                        objectivesVisible && "translate-x-[340px]"
                    )}
                 >
                    <Menu className="h-5 w-5" />
                 </Button>
            </div>
        </div>
    );
}
