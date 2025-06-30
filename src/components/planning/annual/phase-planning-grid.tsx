
"use client";

import { useSettings } from "@/hooks/use-settings";
import { getPhaseDisplayName } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface PhasePlanningGridProps {
  date: Date;
  scheduleForDate: Schedule;
  activeSlot: string | null;
  onSlotSelect: (slotId: string) => void;
  onRemoveItem: (slotId: string) => void;
}

const periods = [1, 2, 3];
const phases = [1, 2, 3, 4];

export function PhasePlanningGrid({ date, scheduleForDate, activeSlot, onSlotSelect, onRemoveItem }: PhasePlanningGridProps) {
    const { settings } = useSettings();
    const { updateDayMetadata, dayMetadata, clearDaySchedule } = useSchedule();
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
                    
                    <div className="space-y-4">
                        {periods.map(period => (
                            <div key={period}>
                                <h4 className="font-semibold mb-2 ml-1">Period {period}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {phases.map(phaseId => {
                                        const slotId = `${dateStr}-${period}-${phaseId}`;
                                        const scheduledItem = scheduleForDate[slotId];
                                        const isActive = activeSlot === slotId;

                                        return (
                                            <div key={slotId} className="rounded-lg bg-muted/50 p-2">
                                                <h5 className="font-medium text-center text-sm mb-1">{getPhaseDisplayName(settings.element, phaseId)}</h5>
                                                <div className={cn(
                                                    "relative rounded-md min-h-[6rem] border-2 border-dashed border-transparent transition-colors",
                                                    isActive && "border-primary"
                                                )}>
                                                    {scheduledItem ? (
                                                        <ScheduledEoCard item={scheduledItem} slotId={slotId} onRemove={onRemoveItem} />
                                                    ) : (
                                                        <button
                                                            onClick={() => onSlotSelect(slotId)}
                                                            className="w-full h-full flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                                            aria-label={`Plan Period ${period} for Phase ${phaseId}`}
                                                        >
                                                             <span className="sr-only">Add to Period {period} {getPhaseDisplayName(settings.element, phaseId)}</span>
                                                        </button>
                                                    )}
                                                </div>
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

