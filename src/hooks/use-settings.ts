
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Settings, YearSpecificSettings, TrainingYearSettings, WeeklyActivity } from '@/lib/types';
import { useTrainingYear } from './use-training-year';

const defaultSettings: Settings = {
    trainingDay: 2, // Tuesday
    corpsName: "",
    staff: [],
    classrooms: [],
    cadetRanks: [],
    officerRanks: [],
    weeklyActivities: [],
    ordersOfDress: {
        caf: [],
        cadets: []
    }
};

const defaultYearSettings: TrainingYearSettings = {};

export function useSettings() {
    const { currentYear } = useTrainingYear();
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [yearSettings, setYearSettings] = useState<TrainingYearSettings>(defaultYearSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem('trainingSettings');
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings);
                // Gracefully handle migration from old `ranks` to new `cadetRanks` and `officerRanks`
                if (parsedSettings.ranks && !parsedSettings.cadetRanks) {
                    parsedSettings.cadetRanks = parsedSettings.ranks;
                    delete parsedSettings.ranks;
                }
                
                // Create a robust merged settings object, falling back to new empty defaults if stored values are null/undefined
                const mergedSettings = {
                    ...defaultSettings, // Start with new defaults
                    ...parsedSettings,  // Override with any stored values
                    // Explicitly ensure array/object properties are not null
                    staff: parsedSettings.staff || [], 
                    classrooms: parsedSettings.classrooms || [],
                    cadetRanks: parsedSettings.cadetRanks || [],
                    officerRanks: parsedSettings.officerRanks || [],
                    weeklyActivities: parsedSettings.weeklyActivities || [],
                    ordersOfDress: parsedSettings.ordersOfDress || { caf: [], cadets: [] }
                };
                
                setSettings(mergedSettings);
            } else {
                setSettings(defaultSettings);
            }

            const storedYearSettings = localStorage.getItem('trainingYearSettings');
            if (storedYearSettings) {
                setYearSettings(JSON.parse(storedYearSettings));
            } else {
                setYearSettings(defaultYearSettings);
            }
        } catch (error) {
            console.error("Failed to parse settings from localStorage", error);
            setSettings(defaultSettings);
            setYearSettings(defaultYearSettings);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const saveSettings = useCallback((newSettings: Partial<Settings>) => {
        const updatedSettings = { ...settings, ...newSettings };
        try {
            localStorage.setItem('trainingSettings', JSON.stringify(updatedSettings));
            setSettings(updatedSettings);
        } catch (error) {
            console.error("Failed to save global settings to localStorage", error);
        }
    }, [settings]);

    const firstTrainingNight = currentYear ? yearSettings[currentYear]?.firstTrainingNight : null;

    const settingsForHook = { ...settings, firstTrainingNight: firstTrainingNight || ''};

    return { settings: settingsForHook, saveSettings, isLoaded };
}
