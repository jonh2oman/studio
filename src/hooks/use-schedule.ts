
"use client";

import { useCallback } from 'react';
import type { Schedule, EO, ScheduledItem, DayMetadata, CsarDetails, TrainingYearData } from '@/lib/types';
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

        updateCurrentYearData((prevData) => {
            if (!prevData) return prevData;
            if (prevData.schedule[slotId]) {
                toast({ variant: "destructive", title: "Slot Occupied", description: "This slot already has a lesson planned." });
                return prevData;
            }

            const newSchedule = {
                ...prevData.schedule,
                [slotId]: {
                    eo,
                    instructor: '',
                    classroom: ''
                }
            };
            return { ...prevData, schedule: newSchedule };
        });
    }, [currentYear, updateCurrentYearData, toast]);

    const updateScheduleItem = useCallback((slotId: string, details: Partial<Omit<ScheduledItem, 'eo'>>) => {
        if (!currentYear) return;

        updateCurrentYearData((prevData) => {
            if (!prevData) return prevData;
            const currentSchedule = prevData.schedule;
            
            const existingItem = currentSchedule[slotId];
            if (!existingItem) return prevData;

            const updatedItem = { ...existingItem, ...details };
            const newSchedule = { ...currentSchedule, [slotId]: updatedItem };
            return { ...prevData, schedule: newSchedule };
        });
    }, [currentYear, updateCurrentYearData]);

    const removeScheduleItem = useCallback((slotId: string) => {
        if (!currentYear) return;
        
        updateCurrentYearData((prevData) => {
            if (!prevData) return prevData;

            const newSchedule = { ...prevData.schedule };
            if (newSchedule[slotId]) {
                delete newSchedule[slotId];
                return { ...prevData, schedule: newSchedule };
            }
            return prevData;
        });
    }, [currentYear, updateCurrentYearData]);
    
    const moveScheduleItem = useCallback((sourceSlotId: string, targetSlotId: string) => {
        if (!currentYear) return;

        updateCurrentYearData((prevData) => {
            if (!prevData) return prevData;
            const currentSchedule = prevData.schedule;
            if (!currentSchedule[sourceSlotId]) return prevData;

            if (currentSchedule[targetSlotId]) {
                toast({ variant: "destructive", title: "Cannot Move", description: "Target slot is already occupied. Please move to an empty slot." });
                return prevData;
            }

            const itemToMove = currentSchedule[sourceSlotId];
            const newSchedule = { ...currentSchedule };
            delete newSchedule[sourceSlotId];
            newSchedule[targetSlotId] = itemToMove;

            return { ...prevData, schedule: newSchedule };
        });
    }, [currentYear, updateCurrentYearData, toast]);

    const updateDayMetadata = useCallback((date: string, metadataUpdate: Partial<DayMetadata>) => {
        if (!currentYear) return;
        
        updateCurrentYearData((prevData) => {
            if (!prevData) return prevData;

            const currentMetadata = prevData.dayMetadata[date] || { csarRequired: false, csarSubmitted: false, csarApproved: false };
            let updatedMetadata: DayMetadata = { ...currentMetadata, ...metadataUpdate };
            
            if (metadataUpdate.csarRequired && !currentMetadata.csarDetails) {
                 updatedMetadata.csarDetails = prevData.csarDetails || defaultYearData.csarDetails;
            }

            const newDayMetadataState = {
                ...prevData.dayMetadata,
                [date]: updatedMetadata,
            };
            return { ...prevData, dayMetadata: newDayMetadataState };
        });

    }, [currentYear, updateCurrentYearData]);

    const updateCsarDetails = useCallback((date: string, newDetails: CsarDetails) => {
         if (!currentYear) return;
        
        updateCurrentYearData((prevData) => {
            if (!prevData) return prevData;
            const currentMetadata = prevData.dayMetadata[date];
            if (!currentMetadata) return prevData;

            const updatedMetadata = { ...currentMetadata, csarDetails: newDetails };
            
            const newDayMetadataState = { ...prevData.dayMetadata, [date]: updatedMetadata };
            return { ...prevData, dayMetadata: newDayMetadataState };
        });

    }, [currentYear, updateCurrentYearData]);
    
    const clearDaySchedule = useCallback((dateStr: string) => {
        if (!currentYear) return;

        updateCurrentYearData((prevData) => {
            if (!prevData) return prevData;

            const newSchedule = Object.keys(prevData.schedule).reduce((acc, slotId) => {
                if (!slotId.startsWith(dateStr)) {
                    acc[slotId] = prevData.schedule[slotId];
                }
                return acc;
            }, {} as Schedule);

            const newDayMetadata = { ...prevData.dayMetadata };
            if (newDayMetadata[dateStr]) {
                delete newDayMetadata[dateStr];
            }
            
            toast({ title: "Day Cleared", description: `All plans for ${format(new Date(dateStr.replace(/-/g, '/')), 'PPP')} have been removed.` });

            return {
                ...prevData,
                schedule: newSchedule,
                dayMetadata: newDayMetadata
            };
        });
    }, [currentYear, updateCurrentYearData, toast]);

    return { schedule, isLoaded, addScheduleItem, updateScheduleItem, removeScheduleItem, moveScheduleItem, dayMetadata, updateDayMetadata, updateCsarDetails, clearDaySchedule, updateCurrentYearData };
}
