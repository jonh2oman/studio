"use client";

import { CalendarView } from "@/components/planner/calendar-view";
import type { EO } from "@/lib/types";
import { useSchedule } from "@/hooks/use-schedule";
import { DraggableObjectivesPanel } from "./draggable-objectives-panel";

interface PlannerProps {
  viewMode: string;
  objectivesVisible: boolean;
}

export default function Planner({ viewMode, objectivesVisible }: PlannerProps) {
    const { schedule, addScheduleItem, updateScheduleItem, removeScheduleItem, dayMetadata, updateDayMetadata } = useSchedule();

    const handleDrop = (date: string, period: number, phase: number, eo: EO) => {
        const slotId = `${date}-${period}-${phase}`;
        addScheduleItem(slotId, eo);
    };

    return (
        <div className="relative rounded-lg border bg-card print:border-none print:h-auto print:overflow-visible">
            {objectivesVisible && <DraggableObjectivesPanel />}
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
}
