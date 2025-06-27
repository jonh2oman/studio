
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { copyTrainingSchedule } from '@/ai/flows/copy-training-year-flow';
import type { Settings, TrainingYearSettings } from '@/lib/types';
import type { Cadet } from '@/lib/types';

const getFirstTuesdayOfSeptember = (year: number) => {
    const d = new Date(year, 8, 1);
    const day = d.getDay();
    const diff = (2 - day + 7) % 7;
    d.setDate(1 + diff);
    return d.toISOString().split('T')[0];
};

export function useTrainingYear() {
    const [trainingYears, setTrainingYears] = useState<string[]>([]);
    const [currentYear, setCurrentYearState] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedYears = localStorage.getItem('trainingYears');
            const years = storedYears ? JSON.parse(storedYears) : [];
            setTrainingYears(years);

            const storedCurrentYear = localStorage.getItem('currentTrainingYear');
            
            if (storedCurrentYear && years.includes(storedCurrentYear)) {
                setCurrentYearState(storedCurrentYear);
            } else if (years.length > 0) {
                const latestYear = years.sort().reverse()[0];
                setCurrentYearState(latestYear);
                localStorage.setItem('currentTrainingYear', latestYear);
            } else {
                // First time setup
                const yearDate = new Date();
                const year = yearDate.getMonth() >= 8 ? yearDate.getFullYear() : yearDate.getFullYear() - 1;
                const initialYear = `${year}-${year + 1}`;
                const initialStartDate = getFirstTuesdayOfSeptember(year);
                
                setTrainingYears([initialYear]);
                localStorage.setItem('trainingYears', JSON.stringify([initialYear]));
                
                setCurrentYearState(initialYear);
                localStorage.setItem('currentTrainingYear', initialYear);
                
                const initialYearSettings: TrainingYearSettings = {
                    [initialYear]: { firstTrainingNight: initialStartDate }
                };
                localStorage.setItem('trainingYearSettings', JSON.stringify(initialYearSettings));
            }
        } catch (error) {
            console.error("Failed to initialize training year", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const setCurrentYear = useCallback((year: string) => {
        if (trainingYears.includes(year)) {
            localStorage.setItem('currentTrainingYear', year);
            setCurrentYearState(year);
            toast({ title: "Switched Year", description: `Now viewing training year ${year}.` });
        }
    }, [trainingYears, toast]);

    const createNewYear = useCallback(async ({ year, startDate, copyFrom, promoteCadets, useAiForCopy }: { year: string, startDate: string, copyFrom?: string, promoteCadets?: boolean, useAiForCopy?: boolean }) => {
        if (trainingYears.includes(year)) {
            toast({ variant: "destructive", title: "Error", description: `Training year ${year} already exists.` });
            return;
        }

        setIsCreating(true);
        toast({ title: "Creating New Year...", description: `Please wait while we set up ${year}.` });

        try {
            // Update year list
            const updatedYears = [...trainingYears, year].sort().reverse();
            localStorage.setItem('trainingYears', JSON.stringify(updatedYears));
            setTrainingYears(updatedYears);

            // Set new year-specific settings
            const yearSettingsStr = localStorage.getItem('trainingYearSettings') || '{}';
            const yearSettings = JSON.parse(yearSettingsStr) as TrainingYearSettings;
            yearSettings[year] = { firstTrainingNight: startDate };
            localStorage.setItem('trainingYearSettings', JSON.stringify(yearSettings));

            if (copyFrom) {
                // Copy Cadets
                const sourceCadetsStr = localStorage.getItem(`${copyFrom}_cadetRoster`) || '[]';
                const sourceCadets = JSON.parse(sourceCadetsStr) as Cadet[];
                const newCadets = promoteCadets
                    ? sourceCadets.map(c => ({ ...c, phase: Math.min(5, c.phase + 1) }))
                    : sourceCadets;
                localStorage.setItem(`${year}_cadetRoster`, JSON.stringify(newCadets));

                // Copy schedule
                const sourceScheduleStr = localStorage.getItem(`${copyFrom}_trainingSchedule`) || '{}';
                if (useAiForCopy) {
                     const sourceYearSettings = yearSettings[copyFrom];
                     if (!sourceYearSettings) throw new Error(`Could not find settings for source year ${copyFrom}`);
                    
                    const globalSettingsStr = localStorage.getItem('trainingSettings') || '{}';
                    const globalSettings = JSON.parse(globalSettingsStr) as Partial<Settings>;
                    const trainingDay = globalSettings.trainingDay ?? 2;

                    const result = await copyTrainingSchedule({
                        sourceScheduleJson: sourceScheduleStr,
                        sourceTrainingYearStart: sourceYearSettings.firstTrainingNight,
                        targetTrainingYearStart: startDate,
                        trainingDayOfWeek: trainingDay,
                    });
                    localStorage.setItem(`${year}_trainingSchedule`, result.newScheduleJson);

                } else {
                    localStorage.setItem(`${year}_trainingSchedule`, sourceScheduleStr);
                }
                
                // Copy other year-specific data as empty states
                localStorage.setItem(`${year}_cadetAttendance`, '{}');
                localStorage.setItem(`${year}_awardWinners`, '{}');
                localStorage.setItem(`${year}_dayMetadata`, '{}');
            }
            
            setCurrentYear(year);
            toast({ title: "Success", description: `Successfully created and switched to training year ${year}.` });

        } catch (error) {
            console.error("Failed to create new year:", error);
            toast({ variant: "destructive", title: "Creation Failed", description: "Could not create the new training year. See console for details." });
            // Clean up failed year creation
            const revertedYears = trainingYears.filter(y => y !== year);
            localStorage.setItem('trainingYears', JSON.stringify(revertedYears));
            setTrainingYears(revertedYears);
        } finally {
            setIsCreating(false);
        }
    }, [trainingYears, toast]);

    return { trainingYears, currentYear, setCurrentYear, createNewYear, isLoaded, isCreating };
}
