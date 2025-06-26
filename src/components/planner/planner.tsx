"use client";

import { useState } from "react";
import { ObjectivesList } from "@/components/planner/objectives-list";
import { CalendarView } from "@/components/planner/calendar-view";
import type { Schedule, EO, ScheduledItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface PlannerProps {
  viewMode: string;
}

export default function Planner({ viewMode }: PlannerProps) {
    const [schedule, setSchedule] = useState<Schedule>({});
    const { toast } = useToast();

    const handleDrop = (date: string, period: number, phase: number, eo: EO) => {
        const slotId = `${date}-${period}-${phase}`;
        setSchedule(prev => ({
            ...prev,
            [slotId]: {
                eo,
                instructor: '',
                classroom: ''
            }
        }));
    };

    const handleUpdate = (slotId: string, details: Partial<Omit<ScheduledItem, 'eo'>>) => {
        const [date, periodStr] = slotId.split('-');
        const period = parseInt(periodStr, 10);

        // Conflict check
        if (details.instructor || details.classroom) {
            for (const otherSlotId in schedule) {
                if (otherSlotId === slotId) continue;
                const otherItem = schedule[otherSlotId];
                if (!otherItem) continue;

                const [otherDate, otherPeriodStr] = otherSlotId.split('-');
                if (date === otherDate && period === parseInt(otherPeriodStr, 10)) {
                    if (details.instructor && otherItem.instructor && details.instructor === otherItem.instructor) {
                        toast({ variant: "destructive", title: "Conflict Detected", description: `Instructor ${details.instructor} is already busy during this period.` });
                        return;
                    }
                    if (details.classroom && otherItem.classroom && details.classroom === otherItem.classroom) {
                        toast({ variant: "destructive", title: "Conflict Detected", description: `Classroom ${details.classroom} is already occupied during this period.` });
                        return;
                    }
                }
            }
        }

        setSchedule(prev => {
            const existingItem = prev[slotId];
            if (!existingItem) return prev;
            return {
                ...prev,
                [slotId]: { ...existingItem, ...details }
            };
        });
    };

    const handleRemove = (slotId: string) => {
        setSchedule(prev => {
            const newSchedule = { ...prev };
            delete newSchedule[slotId];
            return newSchedule;
        });
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
            <div className="xl:col-span-1 h-full rounded-lg border bg-card text-card-foreground overflow-hidden">
                <ObjectivesList />
            </div>
            <div className="xl:col-span-3 h-full rounded-lg border bg-card text-card-foreground overflow-hidden">
                <CalendarView 
                    schedule={schedule} 
                    onDrop={handleDrop} 
                    onUpdate={handleUpdate}
                    onRemove={handleRemove}
                    viewMode={viewMode}
                />
            </div>
        </div>
    );
}
