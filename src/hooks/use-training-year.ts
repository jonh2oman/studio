
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';
import { copyTrainingSchedule } from '@/ai/flows/copy-training-year-flow';
import type { TrainingYearData, DutySchedule, AdaPlannerData, DayPlannerData, EO, CorpsData, MarksmanshipRecord, BiathlonResult, StoreItem, Transaction, Schedule } from '@/lib/types';
import { useSettings } from './use-settings';

export const defaultYearData: Omit<TrainingYearData, 'cadets'> = {
    firstTrainingNight: '',
    element: 'Sea',
    dutySchedule: {},
    schedule: {},
    dayMetadata: {},
    attendance: {},
    awardWinners: {},
    csarDetails: {
        activityName: '',
        activityType: '',
        activityLocation: '',
        activityStartDate: '',
        activityEndDate: '',
        startTime: '09:00',
        endTime: '17:00',
        isMultiUnit: false,
        multiUnitDetails: '',
        numCadetsMale: 0,
        numCadetsFemale: 0,
        numStaffMale: 0,
        numStaffFemale: 0,
        transportRequired: false,
        transportation: { schoolBus44: 0, cruiser55: 0 },
        supportVehiclesRequired: false,
        supportVehicles: { van8: 0, crewCab: 0, cubeVan: 0, miniVan7: 0, panelVan: 0, staffCar: 0 },
        fuelCardRequired: false,
        accommodationsRequired: false,
        accommodation: { type: '', cost: 0 },
        mealsRequired: false,
        mealPlan: [],
        j4Plan: { quartermasterLocation: '', items: [], submitted: false, approved: false },
    },
    adaPlanners: [],
    dayPlanners: [],
};

const defaultDutySchedule: DutySchedule = {};
const defaultAdaPlanners: AdaPlannerData[] = [];
const defaultDayPlanners: DayPlannerData[] = [];

export function useTrainingYear() {
    const { user } = useAuth();
    const { settings, allYearsData, isLoaded: settingsLoaded, updateTrainingYears } = useSettings();
    const { toast } = useToast();
    
    const [trainingYears, setTrainingYears] = useState<string[]>([]);
    const [currentYear, setCurrentYearState] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Ref to hold the latest version of allYearsData to avoid stale closures
    const allYearsDataRef = useRef(allYearsData);
    useEffect(() => {
        allYearsDataRef.current = allYearsData;
    }, [allYearsData]);
    
    useEffect(() => {
        if(settingsLoaded && user) {
            const years = Object.keys(allYearsData).sort().reverse();
            setTrainingYears(years);

            const storedCurrentYear = localStorage.getItem(`currentTrainingYear_${user.uid}`);
            if (storedCurrentYear && years.includes(storedCurrentYear)) {
                setCurrentYearState(storedCurrentYear);
            } else if (years.length > 0) {
                setCurrentYearState(years[0]);
                localStorage.setItem(`currentTrainingYear_${user.uid}`, years[0]);
            } else {
                setCurrentYearState(null);
            }
        }
    }, [allYearsData, settingsLoaded, user]);

    const currentYearData = currentYear ? allYearsData[currentYear] : null;

    const setCurrentYear = useCallback((year: string | null) => {
        if (user) {
            if (year && trainingYears.includes(year)) {
                localStorage.setItem(`currentTrainingYear_${user.uid}`, year);
                setCurrentYearState(year);
                toast({ title: "Switched Year", description: `Now viewing training year ${year}.` });
            } else if (year === null) {
                localStorage.removeItem(`currentTrainingYear_${user.uid}`);
                setCurrentYearState(null);
            }
        }
    }, [trainingYears, toast, user]);

    const updateCurrentYearData = useCallback((updater: (prevData: TrainingYearData) => TrainingYearData) => {
        if (!currentYear) return;

        updateTrainingYears(prevAllYears => {
            const currentDataForYear = prevAllYears[currentYear];
            if (!currentDataForYear) {
                console.error("Attempted to update a non-existent year:", currentYear);
                return prevAllYears; // Return unchanged state
            }
    
            const updatedDataForYear = updater(currentDataForYear);
    
            return {
                ...prevAllYears,
                [currentYear]: updatedDataForYear,
            };
        });
    }, [currentYear, updateTrainingYears]);

    const createNewYear = useCallback(async ({ year, startDate, copyFrom, useAiForCopy, copyFromFileData }: { year: string, startDate: string, copyFrom?: string, useAiForCopy?: boolean, copyFromFileData?: Omit<TrainingYearData, 'cadets'> }) => {
        if (trainingYears.includes(year)) {
            toast({ variant: "destructive", title: "Error", description: `Training year ${year} already exists.` });
            return;
        }
        
        if (!user) {
            toast({ variant: "destructive", title: "Error", description: `User not authenticated.` });
            return;
        }

        setIsCreating(true);
        toast({ title: "Creating New Year...", description: `Please wait while we set up ${year}.` });

        try {
            let newYearData: Omit<TrainingYearData, 'cadets'>;
            const sourceData = allYearsData[copyFrom || ''] || null;

            if (copyFrom && sourceData) {
                const { cadets, ...sourceDataToCopy } = sourceData;
                newYearData = { ...sourceDataToCopy, firstTrainingNight: startDate, element: sourceDataToCopy.element || settings.element };
                
                if (useAiForCopy) {
                    const result = await copyTrainingSchedule({
                        sourceScheduleJson: JSON.stringify(sourceDataToCopy.schedule),
                        sourceTrainingYearStart: sourceDataToCopy.firstTrainingNight,
                        targetTrainingYearStart: startDate,
                        trainingDayOfWeek: settings?.trainingDay ?? 2,
                    });
                    newYearData.schedule = JSON.parse(result.newScheduleJson);
                }
            } else if (copyFromFileData) {
                 const { cadets, ...dataToCopy } = copyFromFileData;
                newYearData = { ...dataToCopy, firstTrainingNight: startDate, element: dataToCopy.element || 'Sea' };
            } else {
                 newYearData = { ...defaultYearData, firstTrainingNight: startDate, element: settings.element };
            }
            
            updateTrainingYears(prevAllYears => ({
                 ...prevAllYears, 
                 [year]: newYearData as TrainingYearData 
            }));
            
            setCurrentYear(year);

            toast({ title: "Success", description: `Successfully created and switched to training year ${year}.` });
        } catch (error) {
            console.error("Failed to create new year:", error);
            toast({ variant: "destructive", title: "Creation Failed", description: "Could not create the new training year. See console for details." });
        } finally {
            setIsCreating(false);
        }
    }, [user, trainingYears, allYearsData, toast, setCurrentYear, settings, updateTrainingYears]);
    
    const deleteTrainingYear = useCallback(async (yearToDelete: string) => {
        if (!user || !allYearsData[yearToDelete]) {
            toast({ variant: "destructive", title: "Error", description: "Cannot delete year." });
            return;
        }

        updateTrainingYears(prevAllYears => {
            const newAllYearsData = { ...prevAllYears };
            delete newAllYearsData[yearToDelete];
            return newAllYearsData;
        });

        if (currentYear === yearToDelete) {
            const remainingYears = Object.keys(allYearsData).filter(y => y !== yearToDelete).sort().reverse();
            const newCurrentYear = remainingYears.length > 0 ? remainingYears[0] : null;
            setCurrentYear(newCurrentYear);
        }
        
        toast({ title: "Training Year Deleted", description: `Successfully deleted ${yearToDelete}.` });

    }, [user, allYearsData, currentYear, toast, updateTrainingYears, setCurrentYear]);

    const updateDutySchedule = useCallback((date: string, scheduleUpdate: Partial<DutySchedule[string]>) => {
        updateCurrentYearData(prevData => ({
            ...prevData,
            dutySchedule: {
                ...prevData.dutySchedule,
                [date]: {
                    ...(prevData.dutySchedule[date] || {}),
                    ...scheduleUpdate
                }
            }
        }));
    }, [updateCurrentYearData]);

    const adaPlanners = currentYearData?.adaPlanners || defaultAdaPlanners;
    const dayPlanners = currentYearData?.dayPlanners || defaultDayPlanners;

    const addAdaPlanner = useCallback((name: string) => {
        if (!name.trim()) {
            toast({ variant: "destructive", title: "Invalid Name", description: "ADA planner name cannot be empty." });
            return;
        }
        if (!currentYear) {
            toast({ variant: "destructive", title: "Error", description: "No active training year. Please create one in Settings." });
            return;
        }
        updateCurrentYearData(prevData => {
            const newPlanner: AdaPlannerData = {
                id: crypto.randomUUID(),
                name,
                eos: []
            };
            const updatedPlanners = [...(prevData.adaPlanners || []), newPlanner];
            return { ...prevData, adaPlanners: updatedPlanners };
        });
        toast({ title: "ADA Planner Added" });
    }, [currentYear, updateCurrentYearData, toast]);

    const removeAdaPlanner = useCallback((id: string) => {
        updateCurrentYearData(prevData => {
            const updatedPlanners = (prevData.adaPlanners || []).filter(p => p.id !== id);
            return { ...prevData, adaPlanners: updatedPlanners };
        });
        toast({ title: "ADA Planner Removed", variant: "destructive" });
    }, [updateCurrentYearData, toast]);

    const updateAdaPlannerName = useCallback((id: string, name: string) => {
        updateCurrentYearData(prevData => {
            const updatedPlanners = (prevData.adaPlanners || []).map(p => p.id === id ? { ...p, name } : p);
            return { ...prevData, adaPlanners: updatedPlanners };
        });
    }, [updateCurrentYearData]);

    const addEoToAda = useCallback((plannerId: string, eo: EO) => {
        updateCurrentYearData(prevData => {
            if (!prevData) return prevData;
            const updatedPlanners = (prevData.adaPlanners || []).map(p => {
                if (p.id === plannerId) {
                    if (p.eos.length >= 60) {
                        toast({ title: "Planner Full", description: "An ADA planner cannot exceed 60 EOs.", variant: "destructive" });
                        return p;
                    }
                    return { ...p, eos: [...p.eos, eo] };
                }
                return p;
            });
            return { ...prevData, adaPlanners: updatedPlanners };
        });
    }, [updateCurrentYearData, toast]);

    const removeEoFromAda = useCallback((plannerId: string, eoIndex: number) => {
        updateCurrentYearData(prevData => {
            if (!prevData) return prevData;
            const updatedPlanners = (prevData.adaPlanners || []).map(p => {
                if (p.id === plannerId) {
                    const newEos = [...p.eos];
                    newEos.splice(eoIndex, 1);
                    return { ...p, eos: newEos };
                }
                return p;
            });
            return { ...prevData, adaPlanners: updatedPlanners };
        });
    }, [updateCurrentYearData]);

    const addDayPlanner = useCallback((name: string, date: string) => {
        if (!name.trim()) {
            toast({ variant: "destructive", title: "Invalid Name", description: "Day planner name cannot be empty." });
            return;
        }
        if (!currentYear) {
            toast({ variant: "destructive", title: "Error", description: "No active training year." });
            return;
        }
        updateCurrentYearData(prevData => {
            const newPlanner: DayPlannerData = {
                id: crypto.randomUUID(),
                name,
                date,
                schedule: {}
            };
            const updatedPlanners = [...(prevData.dayPlanners || []), newPlanner];
            return { ...prevData, dayPlanners: updatedPlanners };
        });
        toast({ title: "Day Plan Added" });
    }, [currentYear, updateCurrentYearData, toast]);

    const removeDayPlanner = useCallback((id: string) => {
        updateCurrentYearData(prevData => {
            const updatedPlanners = (prevData.dayPlanners || []).filter(p => p.id !== id);
            return { ...prevData, dayPlanners: updatedPlanners };
        });
        toast({ title: "Day Plan Removed", variant: "destructive" });
    }, [updateCurrentYearData, toast]);

    const updateDayPlanner = useCallback((id: string, name: string, date: string) => {
        updateCurrentYearData(prevData => {
            const updatedPlanners = (prevData.dayPlanners || []).map(p => p.id === id ? { ...p, name, date } : p);
            return { ...prevData, dayPlanners: updatedPlanners };
        });
    }, [updateCurrentYearData]);

    const addEoToDayPlanner = useCallback((plannerId: string, slotId: string, eo: EO) => {
        updateCurrentYearData(prevData => {
            if (!prevData) return prevData;
            const updatedPlanners = (prevData.dayPlanners || []).map(p => {
                if (p.id === plannerId) {
                    const currentSchedule = p.schedule || {};
                    if (currentSchedule[slotId]) {
                         toast({ variant: "destructive", title: "Slot Occupied", description: "This slot already has a lesson planned." });
                         return p;
                    }
                    const newSchedule = { ...currentSchedule, [slotId]: { eo, instructor: '', classroom: '' } };
                    return { ...p, schedule: newSchedule };
                }
                return p;
            });
            return { ...prevData, dayPlanners: updatedPlanners };
        });
    }, [updateCurrentYearData, toast]);

    const removeEoFromDayPlanner = useCallback((plannerId: string, slotId: string) => {
        updateCurrentYearData(prevData => {
            if (!prevData) return prevData;
            const updatedPlanners = (prevData.dayPlanners || []).map(p => {
                if (p.id === plannerId) {
                    const currentSchedule = p.schedule || {};
                    const newSchedule = { ...currentSchedule };
                    delete newSchedule[slotId];
                    return { ...p, schedule: newSchedule };
                }
                return p;
            });
            return { ...prevData, dayPlanners: updatedPlanners };
        });
    }, [updateCurrentYearData]);

    return { 
        trainingYears, 
        currentYear, 
        setCurrentYear, 
        createNewYear, 
        deleteTrainingYear,
        isLoaded: settingsLoaded,
        isCreating, 
        currentYearData,
        allYearsData,
        updateCurrentYearData,
        dutySchedule: currentYearData?.dutySchedule || defaultDutySchedule,
        updateDutySchedule,
        adaPlanners,
        addAdaPlanner,
        removeAdaPlanner,
        updateAdaPlannerName,
        addEoToAda,
        removeEoFromAda,
        dayPlanners,
        addDayPlanner,
        removeDayPlanner,
        updateDayPlanner,
        addEoToDayPlanner,
        removeEoFromDayPlanner,
    };
}
