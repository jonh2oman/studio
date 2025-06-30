
"use client";

import { useCallback } from 'react';
import type { Schedule, EO, ScheduledItem, DayMetadata, CsarDetails } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useTrainingYear } from './use-training-year';
import { format } from 'date-fns';

export function useSchedule() {
    const { currentYear, currentYearData, updateCurrentYearData, isLoaded } = useTrainingYear();
    const { toast } = useToast();
    
    const schedule = currentYearData?.schedule || {};
    const dayMetadata = currentYearData?.dayMetadata || {};
    const defaultCsarDetails = currentYearData?.csarDetails || {};

    const addScheduleItem = useCallback((slotId: string, eo: EO) => {
        if (!currentYear) return;
        const newSchedule = { 
            ...schedule, 
            [slotId]: {
                eo,
                instructor: '',
                classroom: ''
            }
        };
        updateCurrentYearData({ schedule: newSchedule });
    }, [schedule, currentYear, updateCurrentYearData]);

    const updateScheduleItem = useCallback((slotId: string, details: Partial<Omit<ScheduledItem, 'eo'>>) => {
        if (!currentYear) return;
        const [date, periodStr] = slotId.split('-').slice(0, 2);
        const period = parseInt(periodStr, 10);

        let conflict = false;
        if (details.instructor || details.classroom) {
            for (const otherSlotId in schedule) {
                if (otherSlotId === slotId) continue;
                
                const otherItem = schedule[otherSlotId];
                if (!otherItem) continue;

                const [otherDate, otherPeriodStr] = otherSlotId.split('-').slice(0, 2);
                if (date === otherDate && period === parseInt(otherPeriodStr, 10)) {
                    if (details.instructor && otherItem.instructor && details.instructor === otherItem.instructor) {
                        toast({ variant: "destructive", title: "Conflict Detected", description: `Instructor ${details.instructor} is already busy during this period.` });
                        conflict = true;
                        break;
                    }
                    if (details.classroom && otherItem.classroom && details.classroom === otherItem.classroom) {
                        toast({ variant: "destructive", title: "Conflict Detected", description: `Classroom ${details.classroom} is already occupied during this period.` });
                        conflict = true;
                        break;
                    }
                }
            }
        }
        
        if (conflict) return;

        const existingItem = schedule[slotId];
        if (!existingItem) return;

        const updatedItem = { ...existingItem, ...details };
        const newSchedule = { ...schedule, [slotId]: updatedItem };
        updateCurrentYearData({ schedule: newSchedule });
    }, [schedule, currentYear, updateCurrentYearData, toast]);

    const removeScheduleItem = useCallback((slotId: string) => {
        if (!currentYear) return;
        const newSchedule = { ...schedule };
        delete newSchedule[slotId];
        updateCurrentYearData({ schedule: newSchedule });
    }, [schedule, currentYear, updateCurrentYearData]);
    
    const moveScheduleItem = useCallback((sourceSlotId: string, targetSlotId: string) => {
        if (!currentYear || !schedule[sourceSlotId]) return;

        if (schedule[targetSlotId]) {
            toast({ variant: "destructive", title: "Cannot Move", description: "Target slot is already occupied. Please move to an empty slot." });
            return;
        }

        const itemToMove = schedule[sourceSlotId];
        const newSchedule = { ...schedule };
        delete newSchedule[sourceSlotId];
        newSchedule[targetSlotId] = itemToMove;

        updateCurrentYearData({ schedule: newSchedule });

    }, [schedule, currentYear, updateCurrentYearData, toast]);

    const updateDayMetadata = useCallback((date: string, metadataUpdate: Partial<DayMetadata>) => {
        if (!currentYear) return;
        const currentMetadata = dayMetadata[date] || { csarRequired: false, csarSubmitted: false, csarApproved: false };
        let updatedMetadata: DayMetadata = { ...currentMetadata, ...metadataUpdate };
        
        if (metadataUpdate.csarRequired && !currentMetadata.csarDetails) {
            updatedMetadata.csarDetails = defaultCsarDetails;
        }

        const newDayMetadataState = {
            ...dayMetadata,
            [date]: updatedMetadata,
        };
        updateCurrentYearData({ dayMetadata: newDayMetadataState });
    }, [dayMetadata, currentYear, updateCurrentYearData, defaultCsarDetails]);

    const updateCsarDetails = useCallback((date: string, newDetails: CsarDetails) => {
        if (!currentYear) return;
        const currentMetadata = dayMetadata[date];
        if (!currentMetadata) return;

        const updatedMetadata = { ...currentMetadata, csarDetails: newDetails };
        
        const newDayMetadataState = { ...dayMetadata, [date]: updatedMetadata };
        updateCurrentYearData({ dayMetadata: newDayMetadataState });
    }, [dayMetadata, currentYear, updateCurrentYearData]);
    
    const clearDaySchedule = useCallback((dateStr: string) => {
        if (!currentYear) return;

        const newSchedule = Object.keys(schedule).reduce((acc, slotId) => {
            if (!slotId.startsWith(dateStr)) {
                acc[slotId] = schedule[slotId];
            }
            return acc;
        }, {} as Schedule);

        const newDayMetadata = { ...dayMetadata };
        if (newDayMetadata[dateStr]) {
            delete newDayMetadata[dateStr];
        }
        
        updateCurrentYearData({
            schedule: newSchedule,
            dayMetadata: newDayMetadata
        });
        
        toast({ title: "Day Cleared", description: `All plans for ${format(new Date(dateStr.replace(/-/g, '/')), 'PPP')} have been removed.` });
    }, [currentYear, schedule, dayMetadata, updateCurrentYearData, toast]);

    return { schedule, isLoaded, addScheduleItem, updateScheduleItem, removeScheduleItem, moveScheduleItem, dayMetadata, updateDayMetadata, updateCsarDetails, clearDaySchedule };
}
