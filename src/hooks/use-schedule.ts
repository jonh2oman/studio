"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Schedule, EO, ScheduledItem, DayMetadata, DayMetadataState } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const defaultSchedule: Schedule = {};
const defaultDayMetadata: DayMetadataState = {};

export function useSchedule() {
    const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);
    const [dayMetadata, setDayMetadata] = useState<DayMetadataState>(defaultDayMetadata);
    const [isLoaded, setIsLoaded] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedSchedule = localStorage.getItem('trainingSchedule');
            if (storedSchedule) {
                setSchedule(JSON.parse(storedSchedule));
            }
            const storedDayMetadata = localStorage.getItem('dayMetadata');
             if (storedDayMetadata) {
                setDayMetadata(JSON.parse(storedDayMetadata));
            }
        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const addScheduleItem = useCallback((slotId: string, eo: EO) => {
        setSchedule(prev => {
            const newSchedule = { 
                ...prev, 
                [slotId]: {
                    eo,
                    instructor: '',
                    classroom: ''
                }
            };
            try {
                localStorage.setItem('trainingSchedule', JSON.stringify(newSchedule));
            } catch (error) {
                console.error("Failed to save schedule to localStorage", error);
            }
            return newSchedule;
        });
    }, []);

    const updateScheduleItem = useCallback((slotId: string, details: Partial<Omit<ScheduledItem, 'eo'>>) => {
        const [date, periodStr] = slotId.split('-').slice(0, 2);
        const period = parseInt(periodStr, 10);

        setSchedule(prev => {
            if (details.instructor || details.classroom) {
                for (const otherSlotId in prev) {
                    if (otherSlotId === slotId) continue;
                    
                    const otherItem = prev[otherSlotId];
                    if (!otherItem) continue;

                    const [otherDate, otherPeriodStr] = otherSlotId.split('-').slice(0, 2);
                    if (date === otherDate && period === parseInt(otherPeriodStr, 10)) {
                        if (details.instructor && otherItem.instructor && details.instructor === otherItem.instructor) {
                            toast({ variant: "destructive", title: "Conflict Detected", description: `Instructor ${details.instructor} is already busy during this period.` });
                            return prev;
                        }
                        if (details.classroom && otherItem.classroom && details.classroom === otherItem.classroom) {
                            toast({ variant: "destructive", title: "Conflict Detected", description: `Classroom ${details.classroom} is already occupied during this period.` });
                            return prev;
                        }
                    }
                }
            }

            const existingItem = prev[slotId];
            if (!existingItem) return prev;

            const updatedItem = { ...existingItem, ...details };
            const newSchedule = { ...prev, [slotId]: updatedItem };
            
            try {
                localStorage.setItem('trainingSchedule', JSON.stringify(newSchedule));
            } catch (error) {
                console.error("Failed to save schedule to localStorage", error);
            }
            return newSchedule;
        });
    }, [toast]);

    const removeScheduleItem = useCallback((slotId: string) => {
        setSchedule(prev => {
            const newSchedule = { ...prev };
            delete newSchedule[slotId];
            try {
                localStorage.setItem('trainingSchedule', JSON.stringify(newSchedule));
            } catch (error) {
                console.error("Failed to save schedule to localStorage", error);
            }
            return newSchedule;
        });
    }, []);

    const updateDayMetadata = useCallback((date: string, metadataUpdate: Partial<DayMetadata>) => {
        setDayMetadata(prev => {
            const currentMetadata = prev[date] || { csarRequired: false, csarSubmitted: false, csarApproved: false };
            const updatedMetadata = { ...currentMetadata, ...metadataUpdate };
            
            const newDayMetadataState = {
                ...prev,
                [date]: updatedMetadata,
            };

            try {
                localStorage.setItem('dayMetadata', JSON.stringify(newDayMetadataState));
            } catch (error) {
                console.error("Failed to save day metadata to localStorage", error);
            }
            return newDayMetadataState;
        });
    }, []);

    return { schedule, isLoaded, addScheduleItem, updateScheduleItem, removeScheduleItem, dayMetadata, updateDayMetadata };
}
