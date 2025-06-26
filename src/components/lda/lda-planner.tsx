
"use client";

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';

import { useSchedule } from '@/hooks/use-schedule';
import type { EO } from '@/lib/types';
import { ObjectivesList } from '@/components/planner/objectives-list';
import { ScheduleDialog } from '@/components/planner/schedule-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function LdaPlanner() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const { schedule, addScheduleItem, updateScheduleItem, removeScheduleItem } = useSchedule();
    const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

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
    
    const renderDayCard = (day: Date) => {
        const dateStr = format(day, "yyyy-MM-dd");
        return (
            <Card key={dateStr} className="flex-shrink-0 w-full">
                <CardHeader>
                    <CardTitle className="text-base">{format(day, "EEEE, MMMM do")}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(phase => (
                        <div key={phase} className="space-y-2">
                            <h3 className="font-bold text-center text-lg">Phase {phase}</h3>
                            <div className="space-y-2 rounded-lg bg-background/50 p-2 border">
                                {[...Array(9)].map((_, i) => {
                                    const period = i + 1;
                                    const slotId = `${dateStr}-${period}-${phase}`;
                                    const scheduledItem = schedule[slotId];
                                    return (
                                        <div key={period}>
                                            <h4 className="font-semibold text-center text-muted-foreground mb-1 text-xs">Period {period}</h4>
                                            <div
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
                                                                <p className="font-bold text-sm">{scheduledItem.eo.id}</p>
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
                                                ) : ( <span className="text-xs text-muted-foreground text-center">Drop EO here</span> )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
            <div className="xl:col-span-1 h-full rounded-lg border bg-card text-card-foreground overflow-hidden">
                <ObjectivesList />
            </div>
            <div className="xl:col-span-3 h-full rounded-lg border bg-card text-card-foreground overflow-hidden flex flex-col">
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
                <ScrollArea className="flex-1">
                    <div className="p-4">
                        {dayToPlan.length > 0 ? dayToPlan.map(renderDayCard) : (
                            <div className="text-center text-muted-foreground py-16">
                                Please select a date to start planning.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
