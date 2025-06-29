
"use client";
import React from "react";
import { CalendarView } from "@/components/planner/calendar-view";
import type { EO } from "@/lib/types";
import { useSchedule } from "@/hooks/use-schedule";
import { DraggableObjectivesPanel } from "./draggable-objectives-panel";

interface PlannerProps {
  viewMode: string;
  objectivesVisible: boolean;
  setViewMode: (mode: string) => void;
}

const Planner = React.forwardRef<HTMLDivElement, PlannerProps>(
  ({ viewMode, objectivesVisible, setViewMode }, ref) => {
    const { schedule, addScheduleItem, updateScheduleItem, removeScheduleItem, dayMetadata, updateDayMetadata } = useSchedule();

    const handleDrop = (date: string, period: number, phase: number, eo: EO) => {
        const slotId = `${date}-${period}-${phase}`;
        addScheduleItem(slotId, eo);
    };

    return (
        <div ref={ref} className="relative rounded-lg border bg-card print:border-none print:h-auto print:overflow-visible">
            {objectivesVisible && <DraggableObjectivesPanel viewMode={viewMode} setViewMode={setViewMode} />}
            <div>
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
        </div>
    );
});

Planner.displayName = "Planner";

export default Planner;
