
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { format, addMonths, getYear, eachDayOfInterval } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ZtoReviewedPlan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getPhaseDisplayName } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

export function StaticCalendarView({ plan }: { plan: ZtoReviewedPlan }) {
    const { planData, element } = plan;
    const { schedule, dayMetadata } = planData;

    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [trainingYear, setTrainingYear] = useState<{ start: Date; end: Date } | null>(null);
    const [trainingDays, setTrainingDays] = useState<Date[]>([]);

    useEffect(() => {
        if (planData.firstTrainingNight) {
            const firstNight = new Date(planData.firstTrainingNight.replace(/-/g, '/'));
            const startYear = firstNight.getMonth() >= 8 ? firstNight.getFullYear() : firstNight.getFullYear() - 1;
            const endYear = startYear + 1;

            const ty = {
                start: new Date(startYear, 8, 1),
                end: new Date(endYear, 5, 30),
            };
            setTrainingYear(ty);
            setCurrentDate(firstNight);

            // Get training day of week from first night
            const trainingDayOfWeek = firstNight.getDay();
            const allDaysInYear = eachDayOfInterval({ start: ty.start, end: ty.end });
            const days = allDaysInYear.filter(d => d.getDay() === trainingDayOfWeek && d >= firstNight);
            setTrainingDays(days);
        }
    }, [planData.firstTrainingNight]);

    const changeMonth = useCallback((amount: number) => {
        if (!currentDate) return;
        setCurrentDate(addMonths(currentDate, amount));
    }, [currentDate]);

    const { headerText, trainingDaysToShow } = useMemo(() => {
        if (!currentDate || !trainingYear) return { headerText: 'Loading...', trainingDaysToShow: [] };
        const text = format(currentDate, "MMMM yyyy");
        const days = trainingDays.filter(d => 
            d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
        );
        return { headerText: text, trainingDaysToShow: days };
    }, [currentDate, trainingYear, trainingDays]);


    const renderTrainingDayCard = useCallback((day: Date) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const metadata = dayMetadata[dateStr] || {};
        const dress = metadata.dressOfTheDay || { caf: 'N/A', cadets: 'N/A' };

        return (
            <Card key={dateStr} className="w-[44rem] flex-shrink-0 bg-background">
                <CardHeader>
                    <CardTitle className="text-base">{format(day, "EEEE, MMMM do")}</CardTitle>
                    <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                       <p><span className="font-semibold">CAF Dress:</span> {dress.caf}</p>
                       <p><span className="font-semibold">Cadet Dress:</span> {dress.cadets}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(period => (
                            <div key={period} className="space-y-2">
                                <h4 className="font-semibold text-center text-muted-foreground text-sm">Period {period}</h4>
                                <div className="space-y-2 rounded-lg bg-background p-2">
                                    {[1, 2, 3, 4].map(phase => {
                                        const slotId = `${dateStr}-${period}-${phase}`;
                                        const scheduledItem = schedule[slotId];
                                        return (
                                            <div
                                                key={phase}
                                                className={cn(
                                                    "relative p-3 rounded-md min-h-[6rem] border flex flex-col justify-center items-center transition-colors bg-background"
                                                )}
                                            >
                                                {scheduledItem ? (
                                                    <div className="w-full text-left">
                                                        <Badge className="mb-1">{getPhaseDisplayName(element, phase)}</Badge>
                                                        <p className="font-bold text-sm">{scheduledItem.eo?.id ? scheduledItem.eo.id.split('-').slice(1).join('-') : 'Invalid EO'}</p>
                                                        <p className="text-xs text-muted-foreground leading-tight mb-2">{scheduledItem.eo?.title || 'No Title'}</p>
                                                        <div className="text-xs space-y-0.5">
                                                            <p><span className="font-semibold">Inst:</span> {scheduledItem.instructor || 'N/A'}</p>
                                                            <p><span className="font-semibold">Loc:</span> {scheduledItem.classroom || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                ) : <span className="text-xs text-muted-foreground">{getPhaseDisplayName(element, phase)}</span>}
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
    }, [schedule, dayMetadata, element]);

    if (!currentDate) {
        return <div className="flex items-center justify-center h-full"><p>Loading calendar...</p></div>;
    }

    return (
        <div className="flex flex-col bg-background min-w-0 h-full">
             <div className="flex items-center justify-between p-4 border-b">
                <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold">{headerText}</h3>
                <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <ScrollArea className="flex-grow">
                <div className="p-4 space-y-4">
                    {trainingDaysToShow.length > 0 ? (
                        trainingDaysToShow.map(renderTrainingDayCard)
                    ) : (
                        <div className="text-center text-muted-foreground py-16 w-full">
                            No training days scheduled in this month.
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
