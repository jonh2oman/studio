"use client";

import { useState, useMemo, useEffect } from "react";
import { format, addMonths, startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek, eachDayOfInterval, getYear } from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import type { Schedule, EO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScheduleDialog } from "./schedule-dialog";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface CalendarViewProps {
  schedule: Schedule;
  onDrop: (date: string, period: number, phase: number, eo: EO) => void;
  onUpdate: (slotId: string, details: { instructor?: string; classroom?: string }) => void;
  onRemove: (slotId: string) => void;
}

const nightSchedule = [
  { time: "1830", event: "Arrival" },
  { time: "1845-1900", event: "Fall-In/Opening" },
  { time: "1900-1930", event: "Period One" },
  { time: "1930-2000", event: "Period Two" },
  { time: "2000-2015", event: "Break" },
  { time: "2015-2045", event: "Period Three" },
  { time: "2045-2115", event: "Fall-In/Closing" },
  { time: "2115", event: "Dismissal" },
];

export function CalendarView({ schedule, onDrop, onUpdate, onRemove }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [trainingYear, setTrainingYear] = useState<{ start: Date; end: Date } | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const { settings, isLoaded } = useSettings();

  useEffect(() => {
    if (!isLoaded) return;

    // Use a helper to parse YYYY-MM-DD to avoid timezone issues.
    const parseDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    
    const firstNight = parseDate(settings.firstTrainingNight);
    // A training year runs from September to June.
    const startYear = firstNight.getMonth() >= 8 ? firstNight.getFullYear() : firstNight.getFullYear() - 1;

    const ty = {
      start: new Date(startYear, 8, 1), // September
      end: new Date(startYear + 1, 5, 30), // June
    };
    setTrainingYear(ty);

    setCurrentMonth(startOfMonth(firstNight));

  }, [isLoaded, settings.firstTrainingNight]);


  const weeks = useMemo(() => {
    if (!currentMonth) return [];
    return eachWeekOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  }, [currentMonth]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, slotId: string) => {
    e.preventDefault();
    setDragOverSlot(slotId);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, date: string, period: number, phase: number) => {
    e.preventDefault();
    const eo = JSON.parse(e.dataTransfer.getData("application/json"));
    onDrop(date, period, phase, eo);
    setDragOverSlot(null);
  };

  const changeMonth = (amount: number) => {
    if (!currentMonth || !trainingYear) return;
    const newMonth = addMonths(currentMonth, amount);
    if (newMonth >= trainingYear.start && newMonth <= trainingYear.end) {
      setCurrentMonth(newMonth);
    }
  };

  if (!isLoaded || !currentMonth || !trainingYear) {
    return <div className="flex items-center justify-center h-full"><p>Loading calendar...</p></div>;
  }
  
  const trainingDay = settings.trainingDay;
  const trainingDaysInMonth = weeks
    .flatMap(week => eachDayOfInterval({ start: week, end: endOfWeek(week) }))
    .filter(day => day.getDay() === trainingDay && day.getMonth() === currentMonth.getMonth() && day >= trainingYear.start && day <= trainingYear.end);

  return (
    <div className="flex flex-col h-full bg-card">
      <header className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => changeMonth(-1)} disabled={format(currentMonth, 'yyyy-MM') <= format(trainingYear.start, 'yyyy-MM')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => changeMonth(1)} disabled={format(currentMonth, 'yyyy-MM') >= format(trainingYear.end, 'yyyy-MM')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-8">
          {trainingDaysInMonth.map(day => {
            const dateStr = format(day, "yyyy-MM-dd");
            return (
              <Card key={dateStr} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{format(day, "EEEE, MMMM do")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(period => (
                      <div key={period} className="space-y-2">
                        <h4 className="font-semibold text-center text-muted-foreground">Period {period} ({nightSchedule[period+1].time})</h4>
                        <div className="space-y-2 rounded-lg bg-background/50 p-2">
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
                                  "relative p-2 rounded-md min-h-[6rem] border-2 border-dashed flex flex-col justify-center items-center transition-colors",
                                  dragOverSlot === slotId ? "border-primary bg-primary/10" : "border-muted-foreground/20 hover:border-primary/50",
                                  { "border-solid bg-background p-3": scheduledItem }
                                )}
                              >
                                {scheduledItem ? (
                                    <div className="w-full text-left">
                                        <ScheduleDialog scheduledItem={scheduledItem} onUpdate={(details) => onUpdate(slotId, details)} >
                                            <button className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1 -m-1">
                                                <Badge className="mb-1">Phase {phase}</Badge>
                                                <p className="font-bold text-sm">{scheduledItem.eo.id}</p>
                                                <p className="text-xs text-muted-foreground leading-tight mb-2">{scheduledItem.eo.title}</p>
                                                <div className="text-xs space-y-0.5">
                                                    <p><span className="font-semibold">Instructor:</span> {scheduledItem.instructor || 'N/A'}</p>
                                                    <p><span className="font-semibold">Classroom:</span> {scheduledItem.classroom || 'N/A'}</p>
                                                </div>
                                            </button>
                                        </ScheduleDialog>
                                         <Button variant="ghost" size="icon" className="absolute top-1 right-1 w-6 h-6" onClick={() => onRemove(slotId)}>
                                            <X className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground text-center">Phase {phase}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
           {trainingDaysInMonth.length === 0 && (
             <div className="text-center text-muted-foreground py-16">
               No training days scheduled for this month.
             </div>
           )}
        </div>
      </ScrollArea>
    </div>
  );
}
