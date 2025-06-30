
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
import { PhasePlanningGrid } from "@/components/planning/annual/phase-planning-grid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPhaseDisplayName } from "@/lib/utils";

export default function AnnualPlannerPage() {
    const { settings, isLoaded: settingsLoaded } = useSettings();
    const { currentYear, currentYearData, isLoaded: yearLoaded } = useTrainingYear();
    const { schedule, addScheduleItem, removeScheduleItem, isLoaded: scheduleLoaded } = useSchedule();
    
    const [activeSlot, setActiveSlot] = useState<string | null>(null);

    const trainingDays = useMemo(() => {
        if (!currentYear || !currentYearData?.firstTrainingNight || !settings) return [];

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
    
    const handleEoAdd = useCallback((eo: EO) => {
        if (!activeSlot) {
            return;
        }
        addScheduleItem(activeSlot, eo);
        setActiveSlot(null); // Deselect slot after adding
    }, [activeSlot, addScheduleItem]);

    const handleRemoveItem = useCallback((slotId: string) => {
        removeScheduleItem(slotId);
    }, [removeScheduleItem]);

    const handleSlotSelect = useCallback((slotId: string) => {
        setActiveSlot(prev => prev === slotId ? null : slotId);
    }, []);

    const isLoading = !settingsLoaded || !yearLoaded || !scheduleLoaded;

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-8">
            <ObjectivesPanel interactionMode="add" onEoAdd={handleEoAdd} />

            <div className="flex-1 flex flex-col">
                <PageHeader
                    title="Annual Training Planner"
                    description="Plan your mandatory parade night training."
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
                            {trainingDays.map((day, index) => {
                                const dateStr = format(day, "yyyy-MM-dd");
                                const scheduleForDate: Schedule = {};
                                Object.keys(schedule).forEach(slotId => {
                                    if(slotId.startsWith(dateStr)) {
                                        scheduleForDate[slotId] = schedule[slotId];
                                    }
                                });

                                return (
                                    <PhasePlanningGrid 
                                        key={dateStr}
                                        date={day}
                                        scheduleForDate={scheduleForDate}
                                        activeSlot={activeSlot}
                                        onSlotSelect={handleSlotSelect}
                                        onRemoveItem={handleRemoveItem}
                                    />
                                );
                            })}
                        </Accordion>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}

