
"use client";

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X, CheckCircle, ArrowUpCircle } from 'lucide-react';

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

interface LdaPlannerProps {
    objectivesVisible: boolean;
}

export function LdaPlanner({ objectivesVisible }: LdaPlannerProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const { schedule, addScheduleItem, updateScheduleItem, removeScheduleItem, dayMetadata, updateDayMetadata, updateCsarDetails } = useSchedule();
    const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
    const [isCsarSheetOpen, setIsCsarSheetOpen] = useState(false);

    const plannedDates = useMemo(() => {
        const dates = new Set<string>();
        Object.keys(schedule).forEach(slotId => {
            const dateStr = slotId.substring(0, 10);
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                dates.add(dateStr);
            }
        });
        return Array.from(dates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }, [schedule]);

    const handleDateLinkClick = (dateStr: string) => {
        // Handle timezone issues by replacing hyphens. This is consistent with settings page.
        setSelectedDate(new Date(dateStr.replace(/-/g, '/')));
    };

    const dayToPlan = useMemo(() => {
        if (!selectedDate) return [];
        return [selectedDate];
    }, [selectedDate]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, slotId: string) => {
        e.preventDefault();
        setDragOverSlot(slotId);
    };

    const handleDragLeave = () => setDragOverSlot(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, date: string, period: number, phase: number) => {
        e.preventDefault();
        const eo = JSON.parse(e.dataTransfer.getData("application/json"));
        const slotId = `${date}-${period}-${phase}`;
        addScheduleItem(slotId, eo);
        setDragOverSlot(null);
    };

    const handleSaveCsar = (dateStr: string, data: CsarDetails) => {
        updateCsarDetails(dateStr, data);
    };
    
    const renderDayCard = (day: Date) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const metadata = dayMetadata[dateStr] || { csarRequired: false, csarSubmitted: false, csarApproved: false };

        const handleCsarChange = (key: keyof DayMetadata, value: boolean) => {
            updateDayMetadata(dateStr, { [key]: value });
        };

        return (
            <Card key={dateStr} className="flex-shrink-0 w-full">
                <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-base">{format(day, "EEEE, MMMM do")}</CardTitle>
                         <Sheet open={isCsarSheetOpen} onOpenChange={setIsCsarSheetOpen}>
                            <Card className="p-3 bg-muted/50 w-72">
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
                                       onClose={() => setIsCsarSheetOpen(false)}
                                       startDate={format(day, "PPP")}
                                       endDate={format(day, "PPP")}
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
                                                onDrop={(e) => handleDrop(e, dateStr, period, phase)}
                                                className={cn(
                                                    "relative p-2 rounded-md min-h-[5rem] border-2 border-dashed flex flex-col justify-center items-center transition-colors",
                                                    dragOverSlot === slotId ? "border-primary bg-primary/10" : "border-muted-foreground/20 hover:border-primary/50",
                                                    { "border-solid bg-background p-3": scheduledItem }
                                                )}
                                            >
                                                {scheduledItem ? (
                                                    <div className="w-full text-left">
                                                        <ScheduleDialog scheduledItem={scheduledItem} onUpdate={(details) => updateScheduleItem(slotId, details)} >
                                                            <button className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1 -m-1">
                                                                <Badge className="mb-1">Phase {phase}</Badge>
                                                                <p className="font-bold text-sm">{scheduledItem.eo.id.split('-').slice(1).join('-')}</p>
                                                                <p className="text-xs text-muted-foreground leading-tight mb-2">{scheduledItem.eo.title}</p>
                                                                <div className="text-xs space-y-0.5">
                                                                    <p><span className="font-semibold">Inst:</span> {scheduledItem.instructor || 'N/A'}</p>
                                                                    <p><span className="font-semibold">Loc:</span> {scheduledItem.classroom || 'N/A'}</p>
                                                                </div>
                                                            </button>
                                                        </ScheduleDialog>
                                                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 w-6 h-6" onClick={() => removeScheduleItem(slotId)}>
                                                            <X className="w-4 h-4"/>
                                                        </Button>
                                                    </div>
                                                ) : ( <span className="text-xs text-muted-foreground text-center">Phase {phase}</span> )}
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
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Jump to a Planned Day</h3>
                        <ScrollArea className="h-24">
                            <div className="flex flex-wrap gap-2">
                                {plannedDates.map(dateStr => {
                                    const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateStr;
                                    return (
                                        <Button 
                                            key={dateStr}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDateLinkClick(dateStr)}
                                            className={cn(isSelected && "border-primary text-primary")}
                                        >
                                            {format(new Date(dateStr.replace(/-/g, '/')), "PPP")}
                                        </Button>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                )}
                
                <div className="p-4">
                    {dayToPlan.length > 0 ? dayToPlan.map(renderDayCard) : (
                        <div className="text-center text-muted-foreground py-16">
                            Please select a date to start planning.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
