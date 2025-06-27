
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { format, addMonths, startOfMonth, eachDayOfInterval, getYear, addDays, addWeeks, startOfWeek, endOfWeek, addYears, getMonth } from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import type { Schedule, EO, DayMetadataState, DayMetadata } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduleDialog } from "./schedule-dialog";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useTrainingYear } from "@/hooks/use-training-year";

interface CalendarViewProps {
  schedule: Schedule;
  onDrop: (date: string, period: number, phase: number, eo: EO) => void;
  onUpdate: (slotId: string, details: { instructor?: string; classroom?: string }) => void;
  onRemove: (slotId: string) => void;
  viewMode: string;
  dayMetadata: DayMetadataState;
  updateDayMetadata: (date: string, metadataUpdate: Partial<DayMetadata>) => void;
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

export function CalendarView({ schedule, onDrop, onUpdate, onRemove, viewMode, dayMetadata, updateDayMetadata }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [trainingYear, setTrainingYear] = useState<{ start: Date; end: Date } | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const { settings, isLoaded } = useSettings();
  const { currentYearData, isLoaded: yearLoaded } = useTrainingYear();

  const firstNightDate = useMemo(() => {
    if (!yearLoaded || !currentYearData?.firstTrainingNight) return null;
    return new Date(currentYearData.firstTrainingNight.replace(/-/g, '/'));
  }, [yearLoaded, currentYearData?.firstTrainingNight]);

  useEffect(() => {
    if (!isLoaded || !firstNightDate) return;

    const startYear = firstNightDate.getMonth() >= 8 ? firstNightDate.getFullYear() : firstNightDate.getFullYear() - 1;
    const endYear = startYear + 1;

    const ty = {
      start: new Date(startYear, 8, 1),
      end: new Date(endYear, 5, 30),
    };
    
    setTrainingYear(ty);
    setCurrentDate(firstNightDate);
  }, [isLoaded, firstNightDate]);
  
  const getTrainingDaysForYear = useMemo(() => {
    if (!trainingYear || !firstNightDate) return [];
    return eachDayOfInterval({ start: trainingYear.start, end: trainingYear.end })
      .filter(d => d.getDay() === settings.trainingDay && d >= firstNightDate);
  }, [trainingYear, firstNightDate, settings.trainingDay]);

  const changeDate = useCallback((amount: number) => {
    if (!currentDate) return;
    let newDate;
    switch (viewMode) {
      case 'week': newDate = addWeeks(currentDate, amount); break;
      case 'year': newDate = addYears(currentDate, amount); break;
      case 'month':
      default: newDate = addMonths(currentDate, amount); break;
    }
    setCurrentDate(newDate);
  }, [currentDate, viewMode]);

  const { headerText, trainingDaysToShow } = useMemo(() => {
    if (!currentDate || !trainingYear) return { headerText: 'Loading...', trainingDaysToShow: [] };

    let text = "";
    let days: Date[] = [];

    switch (viewMode) {
      case 'week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        text = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
        days = getTrainingDaysForYear.filter(d => d >= weekStart && d <= weekEnd);
        break;
      case 'year':
        text = `${getYear(trainingYear.start)} - ${getYear(trainingYear.end)}`;
        days = getTrainingDaysForYear;
        break;
      case 'month':
      default:
        text = format(currentDate, "MMMM yyyy");
        days = getTrainingDaysForYear.filter(d => d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear());
        break;
    }
    return { headerText: text, trainingDaysToShow: days };
  }, [currentDate, trainingYear, getTrainingDaysForYear, viewMode]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, slotId: string) => {
    e.preventDefault(); setDragOverSlot(slotId);
  };
  const handleDragLeave = () => setDragOverSlot(null);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, date: string, period: number, phase: number) => {
    e.preventDefault();
    const eo = JSON.parse(e.dataTransfer.getData("application/json"));
    onDrop(date, period, phase, eo);
    setDragOverSlot(null);
  };

  const renderTrainingDayCard = useCallback((day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const metadata = dayMetadata[dateStr] || {};
    const dress = metadata.dressOfTheDay || { caf: '', cadets: '' };

    const handleDressChange = (type: 'caf' | 'cadets', value: string) => {
        const newDress = { ...dress, [type]: value };
        updateDayMetadata(dateStr, { dressOfTheDay: newDress });
    };

    return (
      <Card key={dateStr} className={cn("overflow-hidden print:shadow-none print:border print:border-gray-300 print:break-inside-avoid", (viewMode === 'year' || viewMode === 'month') && "w-[22rem] flex-shrink-0")}>
        <CardHeader>
          <CardTitle className="text-base">{format(day, "EEEE, MMMM do")}</CardTitle>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
                <Label className="text-xs text-muted-foreground">CAF Dress</Label>
                <Select value={dress.caf} onValueChange={(value) => handleDressChange('caf', value)}>
                    <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select dress..." />
                    </SelectTrigger>
                    <SelectContent>
                        {settings.ordersOfDress.caf.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label className="text-xs text-muted-foreground">Cadet Dress</Label>
                <Select value={dress.cadets} onValueChange={(value) => handleDressChange('cadets', value)}>
                    <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select dress..." />
                    </SelectTrigger>
                    <SelectContent>
                        {settings.ordersOfDress.cadets.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>
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
                                        <p className="font-bold text-sm">{scheduledItem.eo.id.split('-').slice(1).join('-')}</p>
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
                        ) : ( <span className="text-xs text-muted-foreground text-center">Phase {phase}</span> )}
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
  }, [schedule, dragOverSlot, viewMode, onDrop, onUpdate, onRemove, dayMetadata, updateDayMetadata, settings.ordersOfDress]);
  
  if (!isLoaded || !currentDate || !trainingYear) {
    return <div className="flex items-center justify-center h-full"><p>Loading calendar...</p></div>;
  }

  const groupedByMonth = trainingDaysToShow.reduce((acc, day) => {
    const month = format(day, "MMMM yyyy");
    if (!acc[month]) acc[month] = [];
    acc[month].push(day);
    return acc;
  }, {} as Record<string, Date[]>);

  return (
    <div className="flex flex-col bg-card min-w-0 print:h-auto">
      <header className="flex items-center justify-between p-4 border-b print:hidden">
        <h2 className="text-xl font-bold">{headerText}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => changeDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => changeDate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      {viewMode === 'year' ? (
        <div className="p-4 print:h-auto print:overflow-visible">
            <div className="flex gap-8 print:block">
              {Object.entries(groupedByMonth).map(([month, days]) => (
                <div key={month} className="space-y-4 print:break-after-page">
                  <h3 className="text-lg font-bold sticky left-0">{month}</h3>
                  <div className="flex gap-4 print:flex-wrap">
                    {days.map(renderTrainingDayCard)}
                  </div>
                </div>
              ))}
            </div>
        </div>
      ) : viewMode === 'month' ? (
        <div className="p-4 flex flex-wrap gap-4 print:h-auto print:overflow-visible">
          {trainingDaysToShow.length > 0 ? (
            trainingDaysToShow.map(renderTrainingDayCard)
          ) : (
            <div className="text-center text-muted-foreground py-16 w-full">
              No training days scheduled for this {viewMode}.
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 space-y-8 print:h-auto print:overflow-visible">
          {trainingDaysToShow.length > 0 ? (
            trainingDaysToShow.map(renderTrainingDayCard)
          ) : (
            <div className="text-center text-muted-foreground py-16">
              No training days scheduled for this {viewMode}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
