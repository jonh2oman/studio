
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { copyTrainingSchedule } from '@/ai/flows/copy-training-year-flow';
import type { UserDocument, TrainingYearData, DutySchedule } from '@/lib/types';
import { defaultUserDocument } from './use-settings';

const defaultYearData: TrainingYearData = {
    firstTrainingNight: '',
    dutySchedule: {},
    cadets: [],
    schedule: {},
    dayMetadata: {},
    attendance: {},
    awardWinners: {},
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
    const { toast } = useToast();
    const [allYearsData, setAllYearsData] = useState<{ [year: string]: TrainingYearData }>({});
    const [trainingYears, setTrainingYears] = useState<string[]>([]);
    const [currentYear, setCurrentYearState] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    
    // Effect to load data from Firestore when user changes
    useEffect(() => {
        const loadData = async () => {
            if (!user || !db) {
                setTrainingYears([]);
                setAllYearsData({});
                setCurrentYearState(null);
                setIsLoaded(true);
                return;
            }

            setIsLoaded(false);
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            let data: UserDocument;
            if (userDocSnap.exists()) {
                data = userDocSnap.data() as UserDocument;
            } else {
                await setDoc(userDocRef, defaultUserDocument);
                data = defaultUserDocument;
            }

            const years = Object.keys(data.trainingYears || {}).sort().reverse();
            setTrainingYears(years);
            setAllYearsData(data.trainingYears || {});

            const storedCurrentYear = localStorage.getItem('currentTrainingYear');
            if (storedCurrentYear && years.includes(storedCurrentYear)) {
                setCurrentYearState(storedCurrentYear);
            } else if (years.length > 0) {
                setCurrentYearState(years[0]);
                localStorage.setItem('currentTrainingYear', years[0]);
            } else {
                setCurrentYearState(null);
            }
            setIsLoaded(true);
        };
        loadData();
    }, [user]);

    const currentYearData = currentYear ? allYearsData[currentYear] : null;

    const setCurrentYear = useCallback((year: string) => {
        if (trainingYears.includes(year)) {
            localStorage.setItem('currentTrainingYear', year);
            setCurrentYearState(year);
            toast({ title: "Switched Year", description: `Now viewing training year ${year}.` });
        }
    }, [trainingYears, toast]);

    const updateCurrentYearData = useCallback(async (dataUpdate: Partial<TrainingYearData>) => {
        if (!user || !db || !currentYear) return;

        const currentData = allYearsData[currentYear] || {};
        const updatedData = { ...currentData, ...dataUpdate };
        
        // Optimistic update for UI responsiveness
        setAllYearsData(prev => ({ ...prev, [currentYear]: updatedData }));

        const userDocRef = doc(db, 'users', user.uid);
        try {
            await updateDoc(userDocRef, {
                [`trainingYears.${currentYear}`]: updatedData
            });
        } catch (error) {
            console.error("Failed to update year data in Firestore", error);
            // Optionally revert optimistic update
            toast({ variant: "destructive", title: "Save Failed", description: "Could not save changes to the cloud." });
        }
    }, [user, currentYear, allYearsData, toast]);

    const createNewYear = useCallback(async ({ year, startDate, copyFrom, promoteCadets, useAiForCopy }: { year: string, startDate: string, copyFrom?: string, promoteCadets?: boolean, useAiForCopy?: boolean }) => {
        if (!user || !db) return;
        if (trainingYears.includes(year)) {
            toast({ variant: "destructive", title: "Error", description: `Training year ${year} already exists.` });
            return;
        }

        setIsCreating(true);
        toast({ title: "Creating New Year...", description: `Please wait while we set up ${year}.` });

        try {
            let newYearData: TrainingYearData = { ...defaultYearData, firstTrainingNight: startDate };

            if (copyFrom && allYearsData[copyFrom]) {
                const sourceData = allYearsData[copyFrom];
                newYearData.cadets = promoteCadets 
                    ? sourceData.cadets.map(c => ({ ...c, phase: Math.min(5, c.phase + 1) }))
                    : sourceData.cadets;
                
                if (useAiForCopy) {
                    const settingsDoc = await getDoc(doc(db, 'users', user.uid));
                    const globalSettings = settingsDoc.data()?.settings;
                    const result = await copyTrainingSchedule({
                        sourceScheduleJson: JSON.stringify(sourceData.schedule),
                        sourceTrainingYearStart: sourceData.firstTrainingNight,
                        targetTrainingYearStart: startDate,
                        trainingDayOfWeek: globalSettings?.trainingDay ?? 2,
                    });
                    newYearData.schedule = JSON.parse(result.newScheduleJson);
                } else {
                    newYearData.schedule = sourceData.schedule;
                }
            }
            
            await updateDoc(doc(db, 'users', user.uid), {
                [`trainingYears.${year}`]: newYearData
            });
            
            // Manually update local state to avoid a full re-fetch
            setAllYearsData(prev => ({ ...prev, [year]: newYearData }));
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
    }, [user, trainingYears, allYearsData, toast, setCurrentYear]);
    
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

    return { 
        trainingYears, 
        currentYear, 
        setCurrentYear, 
        createNewYear, 
        isLoaded, 
        isCreating, 
        currentYearData,
        updateCurrentYearData,
        dutySchedule: currentYearData?.dutySchedule || {},
        updateDutySchedule
    };
}
