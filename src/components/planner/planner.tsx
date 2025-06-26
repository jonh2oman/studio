
"use client";

import { ObjectivesList } from "@/components/planner/objectives-list";
import { CalendarView } from "@/components/planner/calendar-view";
import type { EO } from "@/lib/types";
import { useSchedule } from "@/hooks/use-schedule";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

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
        <ResizablePanelGroup 
            direction="horizontal" 
            className="h-[calc(100vh-12rem)] rounded-lg border bg-card"
        >
            <ResizablePanel defaultSize={25} minSize={20}>
                <div className="h-full overflow-hidden">
                    <ObjectivesList />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
                <div className="h-full overflow-hidden">
                    <CalendarView 
                        schedule={schedule} 
                        onDrop={handleDrop} 
                        onUpdate={updateScheduleItem}
                        onRemove={removeScheduleItem}
                        viewMode={viewMode}
                    />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
