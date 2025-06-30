
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CsarPlanner } from '@/components/csar/csar-planner';
import { DraggableObjectivesPanel } from '../planner/draggable-objectives-panel';
import { useSettings } from '@/hooks/use-settings';
import { getPhaseDisplayName } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


interface WeekendPlannerProps {
    objectivesVisible: boolean;
}

export const WeekendPlanner = forwardRef<HTMLDivElement, WeekendPlannerProps>(({ objectivesVisible }, ref) => {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const { schedule, addScheduleItem, updateScheduleItem, removeScheduleItem, dayMetadata, updateDayMetadata, updateCsarDetails, clearDaySchedule, moveScheduleItem } = useSchedule();
    const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
    const [activeCsarDay, setActiveCsarDay] = useState<string | null>(null);
    const [dayToDelete, setDayToDelete] = useState<string | null>(null);
    const { settings } = useSettings();

    const weekendDays = useMemo(() => {
        if (!startDate) return [];
        return [startDate, addDays(startDate, 1), addDays(startDate, 2)];
    }, [startDate]);

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

    const handleSaveCsar = (dateStr: string, data: CsarDetails) => {
        updateCsarDetails(dateStr, data);
    };

    const handleConfirmDelete = () => {
        if (dayToDelete) {
            clearDaySchedule(dayToDelete);
        }
        setDayToDelete(null);
    };
    
    const renderDayCard = (day: Date, index: number) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const metadata = dayMetadata[dateStr] || { csarRequired: false, csarSubmitted: false, csarApproved: false };

        const handleCsarChange = (key: keyof DayMetadata, value: boolean) => {
            updateDayMetadata(dateStr, { [key]: value });
        };
        
        return (
            <Card key={dateStr} className="flex-shrink-0 w-[44rem] relative">
                <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                         <div className="flex items-center gap-2 flex-1">
                            <CardTitle className="text-base">{format(day, "EEEE, MMMM do")}</CardTitle>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setDayToDelete(dateStr)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Clear Day</span>
                            </Button>
                        </div>
                        <Sheet open={activeCsarDay === dateStr} onOpenChange={(isOpen) => setActiveCsarDay(isOpen ? dateStr : null)}>
                            <Card className="p-3 bg-muted/50 w-64 relative">
                                <CardTitle className="text-base mb-2 flex items-center justify-between">
                                    <span>CSAR Status</span>
                                    {metadata.csarApproved ? (
                                        <Badge variant="outline" className="text-green-600 border-green-600/60 bg-green-50 dark:bg-green-950 dark:text-green-400 dark:border-green-500/60 text-xs">
                                            <CheckCircle className="mr-1 h-3 w-3" />
                                            Approved
                                        </Badge>
                                    ) : metadata.csarSubmitted ? (
                                        <Badge variant="outline" className="text-amber-600 border-amber-600/60 bg-amber-50 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-500/60 text-xs">
                                            <ArrowUpCircle className="mr-1 h-3 w-3" />
                                            Submitted
                                        </Badge>
                                    ) : null}
                                </CardTitle>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor={`csar-required-${dateStr}`} className="text-sm">Required?</Label>
                                        <Switch id={`csar-required-${dateStr}`} checked={metadata.csarRequired} onCheckedChange={(val) => handleCsarChange('csarRequired', val)} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor={`csar-submitted-${dateStr}`} className={cn("text-sm", !metadata.csarRequired && "text-muted-foreground")}>Submitted?</Label>
                                        <Switch id={`csar-submitted-${dateStr}`} checked={metadata.csarSubmitted} onCheckedChange={(val) => handleCsarChange('csarSubmitted', val)} disabled={!metadata.csarRequired} />
                                    </div>
                                     <div className="flex items-center justify-between">
                                        <Label htmlFor={`csar-approved-${dateStr}`} className={cn("text-sm", !metadata.csarRequired && "text-muted-foreground")}>Approved?</Label>
                                        <Switch id={`csar-approved-${dateStr}`} checked={metadata.csarApproved} onCheckedChange={(val) => handleCsarChange('csarApproved', val)} disabled={!metadata.csarRequired} />
                                    </div>
                                    {metadata.csarRequired && (
                                        <>
                                            <div className="border-t pt-2 mt-2" />
                                            <SheetTrigger asChild>
                                                <Button className="w-full">Plan CSAR</Button>
                                            </SheetTrigger>
                                        </>
                                    )}
                                </div>
                            </Card>
                            <SheetContent className="w-full sm:max-w-4xl p-0">
                                 <SheetHeader className="p-6 border-b">
                                    <SheetTitle>CSAR Planner for {format(day, "PPP")}</SheetTitle>
                                </SheetHeader>
                                {metadata.csarDetails ? (
                                    <CsarPlanner
                                        initialData={metadata.csarDetails}
                                        onSave={(data) => handleSaveCsar(dateStr, data)}
                                        onClose={() => setActiveCsarDay(null)}
                                        startDate={format(day, "PPP")}
                                        endDate={format(addDays(day, 2 - index), "PPP")}
                                    />
                                ) : (
                                     <div className="p-6">Loading CSAR data or no CSAR required...</div>
                                )}
                            </SheetContent>
                        </Sheet>
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
                                                            <div className="w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1 -m-1 cursor-pointer">
                                                                <Badge className="mb-1">{getPhaseDisplayName(settings.element, phase)}</Badge>
                                                                <p className="font-bold text-sm">{scheduledItem.eo?.id?.split('-').slice(1).join('-') || 'Invalid EO'}</p>
                                                                <p className="text-xs text-muted-foreground leading-tight mb-2">{scheduledItem.eo?.title || 'No Title'}</p>
                                                                <div className="text-xs space-y-0.5">
                                                                    <p><span className="font-semibold">Inst:</span> {scheduledItem.instructor?.trim() ? scheduledItem.instructor : 'N/A'}</p>
                                                                    <p><span className="font-semibold">Loc:</span> {scheduledItem.classroom?.trim() ? scheduledItem.classroom : 'N/A'}</p>
                                                                </div>
                                                            </div>
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
                    <div className="flex items-center justify-start gap-4 p-4 border-b">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !startDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <h2 className="text-xl font-bold">Select Weekend Start Date</h2>
                    </div>
                    <ScrollArea>
                        <div ref={ref} className="p-4 flex gap-4">
                            {weekendDays.map(renderDayCard)}
                        </div>
                    </ScrollArea>
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
WeekendPlanner.displayName = "WeekendPlanner";
