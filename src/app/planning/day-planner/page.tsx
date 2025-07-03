'use client';
import { useState, useMemo } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ObjectivesPanel } from '@/components/planning/objectives-panel';
import { DayPlannerDropzone } from '@/components/planning/day-planner-dropzone';
import { useTrainingYear } from '@/hooks/use-training-year';
import { PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AddDayPlannerDialog } from '@/components/planning/add-day-planner-dialog';
import type { EO } from '@/lib/types';
import { useSchedule } from '@/hooks/use-schedule';

export default function DayPlannerPage() {
    const { dayPlanners, addEoToDayPlanner, addDayPlanner, adaPlanners, isLoaded: yearLoaded } = useTrainingYear();
    const { schedule, isLoaded: scheduleLoaded } = useSchedule();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const scheduledEoCounts = useMemo(() => {
        if (!scheduleLoaded || !yearLoaded) return {};
        
        const counts: { [key: string]: number } = {};

        Object.values(schedule).forEach(item => {
            if (item?.eo?.id) {
                counts[item.eo.id] = (counts[item.eo.id] || 0) + 1;
            }
        });

        (adaPlanners || []).forEach(planner => {
            planner.eos.forEach(eo => {
                if (eo?.id) {
                    counts[eo.id] = (counts[eo.id] || 0) + 1;
                }
            });
        });
        
        (dayPlanners || []).forEach(p => {
            Object.values(p.schedule || {}).forEach(item => {
                if (item?.eo?.id) {
                     counts[item.eo.id] = (counts[item.eo.id] || 0) + 1;
                }
            });
        });

        return counts;
    }, [schedule, adaPlanners, dayPlanners, scheduleLoaded, yearLoaded]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;
        if (over && active.data.current?.eo) {
            const overId = over.id as string;
            if (overId.startsWith('day-planner-')) {
                const parts = overId.split('-');
                const plannerId = parts[2];
                const phaseId = parts[4];
                const period = parts[6];
                const slotId = `${phaseId}-${period}`;
                const eo = active.data.current.eo as EO;
                addEoToDayPlanner(plannerId, slotId, eo);
            }
        }
    };
    
    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex h-[calc(100vh-8rem)] gap-8">
                <ObjectivesPanel scheduledEoCounts={scheduledEoCounts} />
                <div className="flex-1 flex flex-col">
                    <PageHeader
                        title="Day / Weekend Planner"
                        description="Drag EOs from the left panel to a day planner. To plan a weekend, simply add a separate day for each day of the weekend."
                    >
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Day
                        </Button>
                    </PageHeader>
                     <ScrollArea className="mt-6 flex-1 pr-2">
                        <div className="space-y-6">
                            {dayPlanners.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(planner => (
                                <DayPlannerDropzone 
                                    key={planner.id} 
                                    planner={planner}
                                />
                            ))}
                            {dayPlanners.length === 0 && (
                                <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                                    <p>No day plans created yet.</p>
                                    <p>Click "Add Day" to get started.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
                <AddDayPlannerDialog 
                    isOpen={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                    onAdd={addDayPlanner}
                />
            </div>
        </DndContext>
    );
}

    