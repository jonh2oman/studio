
"use client";

import { useSettings } from "@/hooks/use-settings";
import { getPhaseDisplayName } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScheduledEoCard } from "./scheduled-eo-card";
import type { Schedule } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSchedule } from "@/hooks/use-schedule";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDroppable } from '@dnd-kit/core';

interface AnnualDayDropzoneProps {
  date: Date;
}

const phases = [1, 2, 3, 4];

export function AnnualDayDropzone({ date }: AnnualDayDropzoneProps) {
    const { settings } = useSettings();
    const { schedule, dayMetadata, updateDayMetadata, clearDaySchedule } = useSchedule();
    const dateStr = format(date, "yyyy-MM-dd");
    const metadata = dayMetadata[dateStr] || {};

    const handleDressChange = (type: 'caf' | 'cadets', value: string) => {
        const newDress = { ...(metadata.dressOfTheDay || { caf: '', cadets: '' }), [type]: value };
        updateDayMetadata(dateStr, { dressOfTheDay: newDress });
    };

    const scheduledItemsForDay = Object.entries(schedule).filter(([slotId]) => slotId.startsWith(dateStr));
    
    return (
         <Card className="border">
            <AccordionItem value={dateStr} className="border-b-0">
                <AccordionTrigger className="p-6 hover:no-underline text-lg font-semibold">
                    {format(date, "EEEE, MMMM do, yyyy")}
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div className="flex flex-wrap gap-4">
                             <div>
                                <Label className="text-xs font-medium text-muted-foreground">CAF Dress</Label>
                                <Input value={metadata.dressOfTheDay?.caf || ''} onChange={e => handleDressChange('caf', e.target.value)} className="h-8"/>
                             </div>
                             <div>
                                <Label className="text-xs font-medium text-muted-foreground">Cadet Dress</Label>
                                <Input value={metadata.dressOfTheDay?.cadets || ''} onChange={e => handleDressChange('cadets', e.target.value)} className="h-8"/>
                             </div>
                        </div>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/>Clear Day</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will remove all planned lessons and settings for {format(date, 'PPP')}. This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => clearDaySchedule(dateStr)}>Clear Day</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {phases.map(phaseId => {
                            const itemsForPhase = scheduledItemsForDay.filter(([slotId]) => slotId.endsWith(`-${phaseId}`));
                            const { setNodeRef, isOver } = useDroppable({
                                id: `annual-${dateStr}-${phaseId}`,
                                data: { date: dateStr, phase: phaseId }
                            });
                            
                            return (
                                <div key={phaseId} className="rounded-lg bg-muted/50 p-3 space-y-2">
                                    <h5 className="font-medium text-center text-sm">{getPhaseDisplayName(settings.element, phaseId)}</h5>
                                    <div
                                        ref={setNodeRef}
                                        className={cn(
                                            "min-h-[10rem] rounded-md border-2 border-dashed bg-background/50 p-2 space-y-2 content-start transition-colors",
                                            isOver && "border-primary bg-primary/10"
                                        )}
                                    >
                                        {itemsForPhase.length > 0 ? itemsForPhase.map(([slotId, item]) => (
                                            item ? <ScheduledEoCard key={slotId} item={item} slotId={slotId} /> : null
                                        )) : (
                                            <p className="text-xs text-muted-foreground text-center p-4">Drop EOs here</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Card>
    );
}
