
'use client';
import { useState, useMemo } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ObjectivesPanel } from '@/components/planning/objectives-panel';
import { AdaDropzone } from '@/components/planning/ada-dropzone';
import { useTrainingYear } from '@/hooks/use-training-year';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSchedule } from '@/hooks/use-schedule';

export default function AdaPlannerPage() {
    const { adaPlanners, addAdaPlanner, addEoToAda, dayPlanners, isLoaded: yearLoaded } = useTrainingYear();
    const { schedule, isLoaded: scheduleLoaded } = useSchedule();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newPlannerName, setNewPlannerName] = useState('');

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

        (dayPlanners || []).forEach(planner => {
            Object.values(planner.schedule || {}).forEach(item => {
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
            const plannerId = over.id as string;
            const eo = active.data.current.eo;
            addEoToAda(plannerId, eo);
        }
    };

    const handleAddPlanner = () => {
        if (newPlannerName.trim()) {
            addAdaPlanner(newPlannerName.trim());
            setNewPlannerName('');
            setIsAddDialogOpen(false);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex h-[calc(100vh-8rem)] gap-8">
                <ObjectivesPanel scheduledEoCounts={scheduledEoCounts} />
                <div className="flex-1 flex flex-col">
                    <PageHeader
                        title="ADA Planner"
                        description="Track EOs completed at Area Directed Activities. Drag EOs from the left panel to a planner."
                    >
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New ADA Planner</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Add New ADA Planner</DialogTitle></DialogHeader>
                                <Input 
                                    placeholder="e.g., Fall FTX 2024" 
                                    value={newPlannerName} 
                                    onChange={(e) => setNewPlannerName(e.target.value)} 
                                />
                                <DialogFooter>
                                    <Button onClick={handleAddPlanner}>Add Planner</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </PageHeader>
                     <ScrollArea className="mt-6 flex-1 pr-2">
                        <div className="space-y-6">
                            {adaPlanners.map(planner => (
                                <AdaDropzone key={planner.id} planner={planner} />
                            ))}
                            {adaPlanners.length === 0 && (
                                <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                                    <p>No ADA planners created yet.</p>
                                    <p>Click "Add New ADA Planner" to get started.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </DndContext>
    );
}
