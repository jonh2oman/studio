

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

        updateCurrentYearData((prevData: TrainingYearData): TrainingYearData => {
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

        updateCurrentYearData((prevData: TrainingYearData): TrainingYearData => {
            const currentSchedule = prevData.schedule;
            const [date, periodStr] = slotId.split('-').slice(0, 2);
            const period = parseInt(periodStr, 10);
            
            let conflict = false;
            if (details.instructor?.trim() || details.classroom?.trim()) {
                for (const otherSlotId in currentSchedule) {
                    if (otherSlotId === slotId) continue;
                    
                    const otherItem = currentSchedule[otherSlotId];
                    if (!otherItem) continue;

                    const [otherDate, otherPeriodStr] = otherSlotId.split('-').slice(0, 2);
                    if (date === otherDate && period === parseInt(otherPeriodStr, 10)) {
                        if (details.instructor?.trim() && otherItem.instructor?.trim() && details.instructor.trim().toLowerCase() === otherItem.instructor.trim().toLowerCase()) {
                            toast({ variant: "destructive", title: "Conflict Detected", description: `Instructor ${details.instructor} is already busy during this period.` });
                            conflict = true;
                            break;
                        }
                        if (details.classroom?.trim() && otherItem.classroom?.trim() && details.classroom.trim().toLowerCase() === otherItem.classroom.trim().toLowerCase()) {
                            toast({ variant: "destructive", title: "Conflict Detected", description: `Classroom ${details.classroom} is already occupied during this period.` });
                            conflict = true;
                            break;
                        }
                    }
                }
            }
            
            if (conflict) return prevData;

            const existingItem = currentSchedule[slotId];
            if (!existingItem) return prevData;

            const updatedItem = { ...existingItem, ...details };
            const newSchedule = { ...currentSchedule, [slotId]: updatedItem };
            return { ...prevData, schedule: newSchedule };
        });
    }, [currentYear, updateCurrentYearData, toast]);

    const removeScheduleItem = useCallback((slotId: string) => {
        if (!currentYear) return;
        
        updateCurrentYearData((prevData: TrainingYearData): TrainingYearData => {
            const newSchedule = { ...prevData.schedule };
            if (newSchedule[slotId]) {
                delete newSchedule[slotId];
                return { ...prevData, schedule: newSchedule };
            }
            return prevData; // Return previous state if item doesn't exist
        });
    }, [currentYear, updateCurrentYearData]);
    
    const moveScheduleItem = useCallback((sourceSlotId: string, targetSlotId: string) => {
        if (!currentYear) return;

        updateCurrentYearData((prevData: TrainingYearData): TrainingYearData => {
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
        
        updateCurrentYearData((prevData: TrainingYearData): TrainingYearData => {
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
        
        updateCurrentYearData((prevData: TrainingYearData): TrainingYearData => {
            const currentMetadata = prevData.dayMetadata[date];
            if (!currentMetadata) return prevData;

            const updatedMetadata = { ...currentMetadata, csarDetails: newDetails };
            
            const newDayMetadataState = { ...prevData.dayMetadata, [date]: updatedMetadata };
            return { ...prevData, dayMetadata: newDayMetadataState };
        });

    }, [currentYear, updateCurrentYearData]);
    
    const clearDaySchedule = useCallback((dateStr: string) => {
        if (!currentYear) return;

        updateCurrentYearData((prevData: TrainingYearData): TrainingYearData => {
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

