
"use client";

import { useSettings } from "@/hooks/use-settings";
import { getPhaseDisplayName } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScheduledEoCard } from "./scheduled-eo-card";
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
const periods = [1, 2, 3];

export function AnnualDayDropzone({ date }: AnnualDayDropzoneProps) {
    const { settings } = useSettings();
    const { schedule, dayMetadata, updateDayMetadata, clearDaySchedule } = useSchedule();
    const dateStr = format(date, "yyyy-MM-dd");
    const metadata = dayMetadata[dateStr] || {};

    const handleDressChange = (type: 'caf' | 'cadets', value: string) => {
        const newDress = { ...(metadata.dressOfTheDay || { caf: '', cadets: '' }), [type]: value };
        updateDayMetadata(dateStr, { dressOfTheDay: newDress });
    };
    
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
                        {phases.map(phaseId => (
                            <div key={phaseId} className="rounded-lg bg-muted/50 p-3 space-y-2">
                                <h5 className="font-medium text-center text-sm">{getPhaseDisplayName(settings.element, phaseId)}</h5>
                                <div className="space-y-2">
                                    {periods.map(period => {
                                        const slotId = `${dateStr}-${period}-${phaseId}`;
                                        const scheduledItem = schedule[slotId];
                                        const { setNodeRef, isOver } = useDroppable({
                                            id: `annual-${slotId}`,
                                            data: { date: dateStr, phase: phaseId, period: period }
                                        });

                                        return (
                                            <div
                                                ref={setNodeRef}
                                                key={period}
                                                className={cn(
                                                    "min-h-[6rem] rounded-md border-2 border-dashed p-2 transition-colors",
                                                    isOver && "border-primary bg-primary/10",
                                                    !scheduledItem && "flex items-center justify-center",
                                                    scheduledItem ? "bg-background border-solid" : "border-dashed"
                                                )}
                                            >
                                                {scheduledItem ? (
                                                    <ScheduledEoCard item={scheduledItem} slotId={slotId} />
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">Period {period}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Card>
    );
}
