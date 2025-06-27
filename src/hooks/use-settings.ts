
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Settings, YearSpecificSettings, TrainingYearSettings, WeeklyActivity } from '@/lib/types';
import { useTrainingYear } from './use-training-year';

const defaultSettings: Settings = {
    trainingDay: 2, // Tuesday
    corpsName: "RCSCC 288 ARDENT",
    instructors: ["CI Smith", "Lt(N) Jones", "OCdt Picard"],
    classrooms: ["#1", "#2", "#3", "Parade Deck", "Boathouse"],
    ranks: [
        "Able Cadet (AC)",
        "Leading Cadet (LC)",
        "Petty Officer 2nd Class (PO2)",
        "Petty Officer 1st Class (PO1)",
        "Chief Petty Officer 2nd Class (CPO2)",
        "Chief Petty Officer 1st Class (CPO1)",
    ],
    weeklyActivities: [],
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
                const mergedSettings = { ...defaultSettings, ...parsedSettings };
                mergedSettings.instructors = mergedSettings.instructors?.length > 0 ? mergedSettings.instructors : defaultSettings.instructors;
                mergedSettings.classrooms = mergedSettings.classrooms?.length > 0 ? mergedSettings.classrooms : defaultSettings.classrooms;
                mergedSettings.ranks = mergedSettings.ranks?.length > 0 ? mergedSettings.ranks : defaultSettings.ranks;
                mergedSettings.weeklyActivities = parsedSettings.weeklyActivities || [];
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
