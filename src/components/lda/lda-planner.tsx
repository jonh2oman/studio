
"use client";

import { useState, useMemo, forwardRef, useCallback } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, X, CheckCircle, ArrowUpCircle, Trash2, GripVertical } from 'lucide-react';

import { useSchedule } from '@/hooks/use-schedule';
import type { EO, DayMetadata, CsarDetails } from '@/lib/types';
import { ScheduleDialog } from '@/components/planner/schedule-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DraggableObjectivesPanel } from '../planner/draggable-objectives-panel';
import { useSettings } from '@/hooks/use-settings';
import { getPhaseDisplayName } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DialogTrigger } from "../ui/dialog";


interface LdaPlannerProps {
    objectivesVisible: boolean;
}

export const LdaPlanner = forwardRef<HTMLDivElement, LdaPlannerProps>(({ objectivesVisible }, ref) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const { schedule, addScheduleItem, updateScheduleItem, removeScheduleItem, dayMetadata, updateDayMetadata, updateCsarDetails, clearDaySchedule, moveScheduleItem } = useSchedule();
    const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
    const [dayToDelete, setDayToDelete] = useState<string | null>(null);
    const { settings } = useSettings();

    const plannedDates = useMemo(() => {
        const dates = new Set<string>();
        Object.keys(schedule).forEach(slotId => {
            const dateStr = slotId.substring(0, 10);
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                const day = new Date(dateStr.replace(/-/g, '/'));
                if (day.getDay() !== settings.trainingDay) {
                    dates.add(dateStr);
                }
            }
        });
        return Array.from(dates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }, [schedule, settings.trainingDay]);

    const dayToPlan = useMemo(() => {
        if (!selectedDate) return [];
        return [selectedDate];
    }, [selectedDate]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, slotId: string) => {
        e.preventDefault();
        setDragOverSlot(slotId);
    };

    const handleDragLeave = () => setDragOverSlot(null);

    const handleDropOnSlot = (e: React.DragEvent<HTMLDivElement>, date: string, period: number, phase: number) => {
        e.preventDefault();
        setDragOverSlot(null);
        const targetSlotId = `${date}-${period}-${phase}`;
        try {
            const data = JSON.parse(e.dataTransfer.getData("application/json"));
            if (data.type === 'move') {
                if (data.sourceSlotId !== targetSlotId) {
                    moveScheduleItem(data.sourceSlotId, targetSlotId);
                }
            } else if (data.type === 'new') {
                addScheduleItem(targetSlotId, data.eo);
            }
        } catch (error) {
            console.error("Failed to handle drop:", error);
        }
    };
    
     const handleDragStartOnCard = (e: React.DragEvent<HTMLDivElement>, slotId: string) => {
        e.dataTransfer.setData("application/json", JSON.stringify({ type: "move", sourceSlotId: slotId }));
        e.dataTransfer.effectAllowed = "move";
    };

    const handleConfirmDelete = () => {
        if (dayToDelete) {
            clearDaySchedule(dayToDelete);
        }
        setDayToDelete(null);
    };
    
    const renderDayCard = (day: Date) => {
        const dateStr = format(day, "yyyy-MM-dd");

        return (
            <Card key={dateStr} className="flex-shrink-0 w-full relative">
                <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-2 flex-1">
                             <CardTitle className="text-base">{format(day, "EEEE, MMMM do")}</CardTitle>
                             <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setDayToDelete(dateStr)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Clear Day</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(9)].map((_, i) => {
                        const period = i + 1;
                        return (
                            <div key={period} className="space-y-2">
                                <h4 className="font-semibold text-center text-muted-foreground text-sm">Period {period}</h4>
                                <div className="space-y-2 rounded-lg bg-background/50 p-2 border">
                                    {[1, 2, 3, 4].map(phase => {
                                        const slotId = `${dateStr}-${period}-${phase}`;
                                        const scheduledItem = schedule[slotId];
                                        return (
                                            <div
                                                key={phase}
                                                onDragOver={(e) => handleDragOver(e, slotId)}
                                                onDragLeave={handleDragLeave}
                                                onDrop={(e) => handleDropOnSlot(e, dateStr, period, phase)}
                                                className={cn(
                                                    "relative group p-2 rounded-md min-h-[6rem] border-2 border-dashed flex flex-col justify-center items-center transition-colors",
                                                    dragOverSlot === slotId ? "border-primary bg-primary/10" : "border-muted-foreground/20 hover:border-primary/50",
                                                    { "border-solid bg-background p-3": scheduledItem }
                                                )}
                                            >
                                                {scheduledItem ? (
                                                    <>
                                                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 w-6 h-6 z-20 opacity-0 group-hover:opacity-100" onClick={() => removeScheduleItem(slotId)}>
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                        <div
                                                            draggable
                                                            onDragStart={(e) => handleDragStartOnCard(e, slotId)}
                                                            className="absolute top-1 left-1 p-1 cursor-grab opacity-0 group-hover:opacity-100 z-10"
                                                        >
                                                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                        <ScheduleDialog scheduledItem={scheduledItem} onUpdate={(details) => updateScheduleItem(slotId, details)} >
                                                            <DialogTrigger asChild>
                                                                <div className="w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1 -m-1 cursor-pointer">
                                                                    <Badge className="mb-1">{getPhaseDisplayName(settings.element, phase)}</Badge>
                                                                    <p className="font-bold text-sm">{scheduledItem.eo?.id?.split('-').slice(1).join('-') || 'Invalid EO'}</p>
                                                                    <p className="text-xs text-muted-foreground leading-tight mb-2">{scheduledItem.eo?.title || 'No Title'}</p>
                                                                    <div className="text-xs space-y-0.5">
                                                                        <p><span className="font-semibold">Inst:</span> {scheduledItem.instructor?.trim() ? scheduledItem.instructor : 'N/A'}</p>
                                                                        <p><span className="font-semibold">Loc:</span> {scheduledItem.classroom?.trim() ? scheduledItem.classroom : 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                            </DialogTrigger>
                                                        </ScheduleDialog>
                                                    </>
                                                ) : ( <span className="text-xs text-muted-foreground text-center">{getPhaseDisplayName(settings.element, phase)}</span> )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        );
    };

    return (
        <>
            <div className="relative rounded-lg border bg-card">
                {objectivesVisible && <DraggableObjectivesPanel />}
                <div className="rounded-lg bg-card text-card-foreground overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-xl font-bold">Select a Date to Plan</h2>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !selectedDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    
                    {plannedDates.length > 0 && (
                        <div className="p-4 border-b">
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Currently Planned Days</h3>
                            <div className="flex flex-wrap gap-2">
                                {plannedDates.map(dateStr => (
                                    <Badge key={dateStr} variant="secondary">
                                        {format(new Date(dateStr.replace(/-/g, '/')), "PPP")}
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Use the calendar picker above to navigate to these dates.</p>
                        </div>
                    )}
                    
                    <div ref={ref} className="p-4">
                        {dayToPlan.length > 0 ? dayToPlan.map(renderDayCard) : (
                            <div className="text-center text-muted-foreground py-16">
                                Please select a date to start planning.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <AlertDialog open={!!dayToDelete} onOpenChange={(isOpen) => !isOpen && setDayToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all planned lessons for {dayToDelete ? format(new Date(dayToDelete.replace(/-/g, '/')), 'PPP') : ''}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
});
LdaPlanner.displayName = "LdaPlanner";
