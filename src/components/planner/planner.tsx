
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

    if (viewMode === 'year') {
        return (
             <div className="grid grid-cols-1 md:grid-cols-4 h-[calc(100vh-12rem)] gap-4 print:block print:h-auto">
                <div className="md:col-span-1 h-full rounded-lg border bg-card text-card-foreground print:hidden">
                    <ObjectivesList />
                </div>
                <div className="md:col-span-3 h-full rounded-lg border bg-card text-card-foreground overflow-hidden print:h-auto print:overflow-visible">
                    <CalendarView 
                        schedule={schedule} 
                        onDrop={handleDrop} 
                        onUpdate={updateScheduleItem}
                        onRemove={removeScheduleItem}
                        viewMode={viewMode}
                    />
                </div>
            </div>
        )
    }

    return (
        <ResizablePanelGroup 
            direction="horizontal" 
            className="h-[calc(100vh-12rem)] rounded-lg border bg-card print:h-auto"
        >
            <ResizablePanel defaultSize={25} minSize={20} className="print:hidden">
                <div className="h-full overflow-hidden">
                    <ObjectivesList />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="print:hidden" />
            <ResizablePanel defaultSize={75} className="min-w-0 print:w-full">
                <CalendarView 
                    schedule={schedule} 
                    onDrop={handleDrop} 
                    onUpdate={updateScheduleItem}
                    onRemove={removeScheduleItem}
                    viewMode={viewMode}
                />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
