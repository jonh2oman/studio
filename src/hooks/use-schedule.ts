
"use client";

import { useCallback } from 'react';
import type { Schedule, EO, ScheduledItem, DayMetadata, CsarDetails } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useTrainingYear } from './use-training-year';

export function useSchedule() {
    const { currentYear, currentYearData, updateCurrentYearData, isLoaded } = useTrainingYear();
    const { toast } = useToast();
    
    const schedule = currentYearData?.schedule || {};
    const dayMetadata = currentYearData?.dayMetadata || {};
    const defaultCsarDetails = currentYearData?.csarDetails || {};

    const saveSchedule = useCallback((newSchedule: Schedule) => {
        if (!currentYear) return;
        updateCurrentYearData({ schedule: newSchedule });
    }, [currentYear, updateCurrentYearData]);

     const saveDayMetadata = useCallback((newDayMetadata: { [date: string]: DayMetadata }) => {
        if (!currentYear) return;
        updateCurrentYearData({ dayMetadata: newDayMetadata });
    }, [currentYear, updateCurrentYearData]);

    const addScheduleItem = useCallback((slotId: string, eo: EO) => {
        const newSchedule = { 
            ...schedule, 
            [slotId]: {
                eo,
                instructor: '',
                classroom: ''
            }
        };
        saveSchedule(newSchedule);
    }, [schedule, saveSchedule]);

    const updateScheduleItem = useCallback((slotId: string, details: Partial<Omit<ScheduledItem, 'eo'>>) => {
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
        saveSchedule(newSchedule);
    }, [schedule, saveSchedule, toast]);

    const removeScheduleItem = useCallback((slotId: string) => {
        const newSchedule = { ...schedule };
        delete newSchedule[slotId];
        saveSchedule(newSchedule);
    }, [schedule, saveSchedule]);

    const updateDayMetadata = useCallback((date: string, metadataUpdate: Partial<DayMetadata>) => {
        const currentMetadata = dayMetadata[date] || { csarRequired: false, csarSubmitted: false, csarApproved: false };
        let updatedMetadata: DayMetadata = { ...currentMetadata, ...metadataUpdate };
        
        if (metadataUpdate.csarRequired && !currentMetadata.csarDetails) {
            updatedMetadata.csarDetails = defaultCsarDetails;
        }

        const newDayMetadataState = {
            ...dayMetadata,
            [date]: updatedMetadata,
        };
        saveDayMetadata(newDayMetadataState);
    }, [dayMetadata, saveDayMetadata, defaultCsarDetails]);

    const updateCsarDetails = useCallback((date: string, newDetails: CsarDetails) => {
        const currentMetadata = dayMetadata[date];
        if (!currentMetadata) return;

        const updatedMetadata = { ...currentMetadata, csarDetails: newDetails };
        
        const newDayMetadataState = { ...dayMetadata, [date]: updatedMetadata };
        saveDayMetadata(newDayMetadataState);
    }, [dayMetadata, saveDayMetadata]);

    return { schedule, isLoaded, addScheduleItem, updateScheduleItem, removeScheduleItem, dayMetadata, updateDayMetadata, updateCsarDetails };
}
