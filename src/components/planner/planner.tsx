"use client";

import { useState } from "react";
import { CalendarView } from "@/components/planner/calendar-view";
import type { EO } from "@/lib/types";
import { useSchedule } from "@/hooks/use-schedule";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DraggableObjectivesPanel } from "./draggable-objectives-panel";

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
            {/* Draggable Objectives Panel */}
            {objectivesVisible && <DraggableObjectivesPanel />}

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
            <div className="absolute top-4 left-4 z-50 print:hidden">
                 <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setObjectivesVisible(!objectivesVisible)}
                    className="bg-card hover:bg-muted shadow-md"
                 >
                    <Menu className="h-5 w-5" />
                 </Button>
            </div>
        </div>
    );
}
