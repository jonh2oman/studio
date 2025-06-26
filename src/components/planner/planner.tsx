"use client";

import { ObjectivesList } from "@/components/planner/objectives-list";
import { CalendarView } from "@/components/planner/calendar-view";
import type { EO } from "@/lib/types";
import { useSchedule } from "@/hooks/use-schedule";

interface PlannerProps {
  viewMode: string;
}

export default function Planner({ viewMode }: PlannerProps) {
    const { schedule, addScheduleItem, updateScheduleItem, removeScheduleItem } = useSchedule();

    const handleDrop = (date: string, period: number, phase: number, eo: EO) => {
        const slotId = `${date}-${period}-${phase}`;
        addScheduleItem(slotId, eo);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
            <div className="xl:col-span-1 h-full rounded-lg border bg-card text-card-foreground overflow-hidden">
                <ObjectivesList />
            </div>
            <div className="xl:col-span-3 h-full rounded-lg border bg-card text-card-foreground overflow-hidden">
                <CalendarView 
                    schedule={schedule} 
                    onDrop={handleDrop} 
                    onUpdate={updateScheduleItem}
                    onRemove={removeScheduleItem}
                    viewMode={viewMode}
                />
            </div>
        </div>
    );
}
