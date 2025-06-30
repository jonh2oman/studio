

"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';
import { copyTrainingSchedule } from '@/ai/flows/copy-training-year-flow';
import type { TrainingYearData, DutySchedule, AdaPlannerData, EO, CorpsData, MarksmanshipRecord, BiathlonResult, StoreItem, Transaction } from '@/lib/types';
import { useSettings } from './use-settings';

export const defaultYearData: Omit<TrainingYearData, 'cadets'> = {
    firstTrainingNight: '',
    element: 'Sea',
    dutySchedule: {},
    schedule: {},
    dayMetadata: {},
    attendance: {},
    awardWinners: {},
    adaPlanners: [],
    marksmanshipRecords: [],
    biathlonResults: [],
    storeInventory: [],
    transactions: [],
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
    }
};

const defaultDutySchedule: DutySchedule = {};
const defaultAdaPlanners: AdaPlannerData[] = [];

export function useTrainingYear() {
    const { user } = useAuth();
    const { settings, allYearsData, isLoaded: settingsLoaded, updateTrainingYears } = useSettings();
    const { toast } = useToast();
    
    const [trainingYears, setTrainingYears] = useState<string[]>([]);
    const [currentYear, setCurrentYearState] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    
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

    const updateCurrentYearData = useCallback(async (
        dataUpdate: Partial<TrainingYearData> | ((prevData: TrainingYearData) => TrainingYearData)
    ) => {
        if (!currentYear || !user || !currentYearData) return;

        const currentData = currentYearData || defaultYearData;
        const updatedData = typeof dataUpdate === 'function' 
            ? dataUpdate(currentData) 
            : { ...currentData, ...dataUpdate };
        
        const newAllYearsData = { ...allYearsData, [currentYear]: updatedData };
        updateTrainingYears(newAllYearsData);

    }, [currentYear, allYearsData, user, updateTrainingYears, currentYearData]);


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

            if (copyFrom && allYearsData[copyFrom]) {
                const { cadets, ...sourceDataToCopy } = allYearsData[copyFrom];
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
            
            const newAllYearsData: CorpsData['trainingYears'] = { ...allYearsData, [year]: newYearData as TrainingYearData };
            
            updateTrainingYears(newAllYearsData);
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

        const newAllYearsData = { ...allYearsData };
        delete newAllYearsData[yearToDelete];
        
        updateTrainingYears(newAllYearsData);

        if (currentYear === yearToDelete) {
            const remainingYears = Object.keys(newAllYearsData).sort().reverse();
            const newCurrentYear = remainingYears.length > 0 ? remainingYears[0] : null;
            setCurrentYear(newCurrentYear);
        }
        
        toast({ title: "Training Year Deleted", description: `Successfully deleted ${yearToDelete}.` });

    }, [user, allYearsData, currentYear, toast, updateTrainingYears, setCurrentYear]);

    const updateDutySchedule = useCallback((date: string, scheduleUpdate: Partial<DutySchedule[string]>) => {
        if (!currentYearData) return;
        const newDutySchedule = {
            ...currentYearData.dutySchedule,
            [date]: {
                ...(currentYearData.dutySchedule[date] || {}),
                ...scheduleUpdate
            }
        };
        updateCurrentYearData({ dutySchedule: newDutySchedule });
    }, [currentYearData, updateCurrentYearData]);

    const adaPlanners = currentYearData?.adaPlanners || defaultAdaPlanners;

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
    };
}
