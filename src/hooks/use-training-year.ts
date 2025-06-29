
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { copyTrainingSchedule } from '@/ai/flows/copy-training-year-flow';
import type { TrainingYearData, DutySchedule, AdaPlannerData, EO } from '@/lib/types';
import { useSettings } from './use-settings';

const defaultYearData: TrainingYearData = {
    firstTrainingNight: '',
    dutySchedule: {},
    cadets: [],
    schedule: {},
    dayMetadata: {},
    attendance: {},
    awardWinners: {},
    adaPlanners: [],
    csarDetails: {
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

export function useTrainingYear() {
    const { user } = useAuth();
    const { settings, allYearsData, isLoaded: settingsLoaded } = useSettings();
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

    const setCurrentYear = useCallback((year: string) => {
        if (trainingYears.includes(year) && user) {
            localStorage.setItem(`currentTrainingYear_${user.uid}`, year);
            setCurrentYearState(year);
            toast({ title: "Switched Year", description: `Now viewing training year ${year}.` });
        }
    }, [trainingYears, toast, user]);

    const updateCurrentYearData = useCallback(async (
        dataUpdate: Partial<TrainingYearData> | ((prevData: TrainingYearData) => TrainingYearData)
    ) => {
        if (!currentYear || !user || !db) return;

        const currentData = allYearsData[currentYear] || defaultYearData;
        const updatedData = typeof dataUpdate === 'function' 
            ? dataUpdate(currentData) 
            : { ...currentData, ...dataUpdate };
        
        const newAllYearsData = { ...allYearsData, [currentYear]: updatedData };
        
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { trainingYears: newAllYearsData }, { merge: true });

    }, [currentYear, allYearsData, user, db]);


    const createNewYear = useCallback(async ({ year, startDate, copyFrom, promoteCadets, useAiForCopy, copyFromFileData }: { year: string, startDate: string, copyFrom?: string, promoteCadets?: boolean, useAiForCopy?: boolean, copyFromFileData?: TrainingYearData }) => {
        if (trainingYears.includes(year)) {
            toast({ variant: "destructive", title: "Error", description: `Training year ${year} already exists.` });
            return;
        }
        
        if (!user || !db) {
            toast({ variant: "destructive", title: "Error", description: `User not authenticated.` });
            return;
        }

        setIsCreating(true);
        toast({ title: "Creating New Year...", description: `Please wait while we set up ${year}.` });

        try {
            let newYearData: TrainingYearData;

            if (copyFrom && allYearsData[copyFrom]) {
                const sourceData = allYearsData[copyFrom];
                newYearData = { ...sourceData, firstTrainingNight: startDate };
                if (promoteCadets) {
                    newYearData.cadets = sourceData.cadets.map(c => ({ ...c, phase: Math.min(5, c.phase + 1) }));
                }
                if (useAiForCopy) {
                    const result = await copyTrainingSchedule({
                        sourceScheduleJson: JSON.stringify(sourceData.schedule),
                        sourceTrainingYearStart: sourceData.firstTrainingNight,
                        targetTrainingYearStart: startDate,
                        trainingDayOfWeek: settings?.trainingDay ?? 2,
                    });
                    newYearData.schedule = JSON.parse(result.newScheduleJson);
                }
            } else if (copyFromFileData) {
                newYearData = { ...copyFromFileData, firstTrainingNight: startDate };
                if (promoteCadets) {
                    newYearData.cadets = newYearData.cadets.map(c => ({...c, phase: Math.min(5, c.phase + 1)}));
                }
            } else {
                 newYearData = { ...defaultYearData, firstTrainingNight: startDate };
            }
            
            const newAllYearsData = { ...allYearsData, [year]: newYearData };
            
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { trainingYears: newAllYearsData }, { merge: true });
            
            const updatedYears = [...trainingYears, year].sort().reverse();
            setTrainingYears(updatedYears);
            setCurrentYear(year);

            toast({ title: "Success", description: `Successfully created and switched to training year ${year}.` });
        } catch (error) {
            console.error("Failed to create new year:", error);
            toast({ variant: "destructive", title: "Creation Failed", description: "Could not create the new training year. See console for details." });
        } finally {
            setIsCreating(false);
        }
    }, [user, db, trainingYears, allYearsData, toast, setCurrentYear, settings]);
    
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

    const adaPlanners = currentYearData?.adaPlanners || [];

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
        isLoaded: settingsLoaded,
        isCreating, 
        currentYearData,
        allYearsData,
        updateCurrentYearData,
        dutySchedule: currentYearData?.dutySchedule || {},
        updateDutySchedule,
        adaPlanners,
        addAdaPlanner,
        removeAdaPlanner,
        updateAdaPlannerName,
        addEoToAda,
        removeEoFromAda,
    };
}
