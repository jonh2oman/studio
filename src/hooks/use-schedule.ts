
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Schedule, EO, ScheduledItem, DayMetadata, DayMetadataState, CsarDetails } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useTrainingYear } from './use-training-year';

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
    const { currentYear } = useTrainingYear();
    const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);
    const [dayMetadata, setDayMetadata] = useState<DayMetadataState>(defaultDayMetadata);
    const [isLoaded, setIsLoaded] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (!currentYear) {
            setSchedule(defaultSchedule);
            setDayMetadata(defaultDayMetadata);
            setIsLoaded(false);
            return;
        }

        setIsLoaded(false);
        try {
            const scheduleKey = `${currentYear}_trainingSchedule`;
            const metadataKey = `${currentYear}_dayMetadata`;

            const storedSchedule = localStorage.getItem(scheduleKey);
            setSchedule(storedSchedule ? JSON.parse(storedSchedule) : defaultSchedule);

            const storedDayMetadata = localStorage.getItem(metadataKey);
            setDayMetadata(storedDayMetadata ? JSON.parse(storedDayMetadata) : defaultDayMetadata);

        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
            setSchedule(defaultSchedule);
            setDayMetadata(defaultDayMetadata);
        } finally {
            setIsLoaded(true);
        }
    }, [currentYear]);

    const saveSchedule = useCallback((newSchedule: Schedule) => {
        if (!currentYear) return;
        const scheduleKey = `${currentYear}_trainingSchedule`;
        try {
            localStorage.setItem(scheduleKey, JSON.stringify(newSchedule));
            setSchedule(newSchedule);
        } catch (error) {
            console.error("Failed to save schedule to localStorage", error);
        }
    }, [currentYear]);

     const saveDayMetadata = useCallback((newDayMetadata: DayMetadataState) => {
        if (!currentYear) return;
        const metadataKey = `${currentYear}_dayMetadata`;
        try {
            localStorage.setItem(metadataKey, JSON.stringify(newDayMetadata));
            setDayMetadata(newDayMetadata);
        } catch (error) {
            console.error("Failed to save day metadata to localStorage", error);
        }
    }, [currentYear]);

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

    }, [dayMetadata, saveDayMetadata]);

    const updateCsarDetails = useCallback((date: string, newDetails: CsarDetails) => {
        const currentMetadata = dayMetadata[date];
        if (!currentMetadata) return;

        const updatedMetadata = { ...currentMetadata, csarDetails: newDetails };
        
        const newDayMetadataState = { ...dayMetadata, [date]: updatedMetadata };
        saveDayMetadata(newDayMetadataState);

    }, [dayMetadata, saveDayMetadata]);

    return { schedule, isLoaded: isLoaded && !!currentYear, addScheduleItem, updateScheduleItem, removeScheduleItem, dayMetadata, updateDayMetadata, updateCsarDetails };
}
