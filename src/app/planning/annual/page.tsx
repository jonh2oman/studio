
"use client";

import { useState, useMemo, useCallback } from "react";
import { format, eachDayOfInterval } from "date-fns";
import { useTrainingYear } from "@/hooks/use-training-year";
import { useSettings } from "@/hooks/use-settings";
import { useSchedule } from "@/hooks/use-schedule";
import { PageHeader } from "@/components/page-header";
import { ObjectivesPanel } from "@/components/planning/objectives-panel";
import { Accordion } from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";
import type { EO, Schedule } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { AnnualDayDropzone } from "@/components/planning/annual/annual-day-dropzone";

export default function AnnualPlannerPage() {
    const { settings, isLoaded: settingsLoaded } = useSettings();
    const { currentYear, currentYearData, isLoaded: yearLoaded } = useTrainingYear();
    const { schedule, addScheduleItem, isLoaded: scheduleLoaded } = useSchedule();
    
    const trainingDays = useMemo(() => {
        if (!currentYear || !currentYearData?.firstTrainingNight || !settings?.trainingDay) return [];

        const startYear = parseInt(currentYear.split('-')[0], 10);
        const endYear = startYear + 1;

        const ty = {
            start: new Date(startYear, 8, 1), // Sept 1
            end: new Date(endYear, 5, 30), // June 30
        };

        const firstNight = new Date(currentYearData.firstTrainingNight.replace(/-/g, '/'));
        
        return eachDayOfInterval({ start: ty.start, end: ty.end })
            .filter(d => d.getDay() === settings.trainingDay && d >= firstNight);

    }, [currentYear, currentYearData?.firstTrainingNight, settings?.trainingDay]);
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;
        if (over && active.data.current?.eo) {
            const { date, phase } = over.data.current as { date: string, phase: number };
            const eo = active.data.current.eo as EO;
            
            // Find the next available period (from 1 to 9) for this date and phase
            for (let period = 1; period <= 9; period++) {
                const slotId = `${date}-${period}-${phase}`;
                if (!schedule[slotId]) {
                    addScheduleItem(slotId, eo);
                    return; // Exit after adding to the first available slot
                }
            }
        }
    };

    const isLoading = !settingsLoaded || !yearLoaded || !scheduleLoaded;

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex h-[calc(100vh-8rem)] gap-8">
                <ObjectivesPanel interactionMode="drag" />

                <div className="flex-1 flex flex-col">
                    <PageHeader
                        title="Annual Training Planner"
                        description="Plan your mandatory parade night training by dragging EOs from the left panel."
                    />
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : trainingDays.length === 0 ? (
                        <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12 mt-6">
                            <p>No training days found for the current year.</p>
                            <p>Please ensure a Training Year is created and a weekly training day is set in Settings.</p>
                        </div>
                    ) : (
                        <ScrollArea className="mt-6 flex-1 pr-4">
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {trainingDays.map((day) => {
                                    const dateStr = format(day, "yyyy-MM-dd");
                                    return <AnnualDayDropzone key={dateStr} date={day} />;
                                })}
                            </Accordion>
                        </ScrollArea>
                    )}
                </div>
            </div>
        </DndContext>
    );
}
