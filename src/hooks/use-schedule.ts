
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Schedule, EO, ScheduledItem, DayMetadata, DayMetadataState, CsarDetails } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const defaultSchedule: Schedule = {};
const defaultDayMetadata: DayMetadataState = {};

const defaultCsarDetails: CsarDetails = {
    activityName: '',
    activityType: '',
    activityLocation: '',
    startTime: '09:00',
    endTime: '17:00',
    isMultiUnit: false,
    multiUnitDetails: '',
    numCadetsMale: 0,
    numCadetsFemale: 0,
    numStaffMale: 0,
    numStaffFemale: 0,
    transportRequired: false,
    transportation: {
        schoolBus44: 0,
        cruiser55: 0,
    },
    supportVehiclesRequired: false,
    supportVehicles: {
        van8: 0,
        crewCab: 0,
        cubeVan: 0,
        miniVan7: 0,
        panelVan: 0,
        staffCar: 0,
    },
    fuelCardRequired: false,
    accommodationsRequired: false,
    accommodation: {
        type: '',
        cost: 0,
    },
    mealsRequired: false,
    mealPlanDetails: '',
    j4Plan: {
        quartermasterLocation: '',
        items: [],
        submitted: false,
        approved: false,
    },
};


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
            let updatedMetadata: DayMetadata = { ...currentMetadata, ...metadataUpdate };
            
            if (metadataUpdate.csarRequired && !currentMetadata.csarDetails) {
                updatedMetadata.csarDetails = defaultCsarDetails;
            }

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

    const updateCsarDetails = useCallback((date: string, newDetails: CsarDetails) => {
        setDayMetadata(prev => {
            const currentMetadata = prev[date];
            if (!currentMetadata) return prev;

            const updatedMetadata = { ...currentMetadata, csarDetails: newDetails };
            
            const newDayMetadataState = { ...prev, [date]: updatedMetadata };

            try {
                localStorage.setItem('dayMetadata', JSON.stringify(newDayMetadataState));
            } catch (error) {
                console.error("Failed to save day metadata to localStorage", error);
            }
            return newDayMetadataState;
        });
    }, []);

    return { schedule, isLoaded, addScheduleItem, updateScheduleItem, removeScheduleItem, dayMetadata, updateDayMetadata, updateCsarDetails };
}
