
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '@/lib/types';

const getFirstTuesdayOfSeptember = (year: number) => {
    const d = new Date(year, 8, 1); // September 1st
    const day = d.getDay(); // 0=Sun, 1=Mon...
    // Find the first Tuesday (day 2)
    const diff = (2 - day + 7) % 7;
    d.setDate(1 + diff);
    return d.toISOString().split('T')[0]; // Return as YYYY-MM-DD
}

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
    firstTrainingNight: getFirstTuesdayOfSeptember(new Date().getFullYear()),
};

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem('trainingSettings');
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings);
                // Merge stored settings with defaults to ensure all keys are present
                const mergedSettings = { ...defaultSettings, ...parsedSettings };
                // Ensure arrays are not empty if they exist in localStorage but are empty
                mergedSettings.instructors = mergedSettings.instructors.length > 0 ? mergedSettings.instructors : defaultSettings.instructors;
                mergedSettings.classrooms = mergedSettings.classrooms.length > 0 ? mergedSettings.classrooms : defaultSettings.classrooms;
                mergedSettings.ranks = mergedSettings.ranks && mergedSettings.ranks.length > 0 ? mergedSettings.ranks : defaultSettings.ranks;

                setSettings(mergedSettings);
            } else {
                setSettings(defaultSettings);
            }
        } catch (error) {
            console.error("Failed to parse settings from localStorage", error);
            setSettings(defaultSettings);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const saveSettings = useCallback((newSettings: Partial<Settings>) => {
        setSettings(prevSettings => {
            const updatedSettings = { ...prevSettings, ...newSettings };
            try {
                localStorage.setItem('trainingSettings', JSON.stringify(updatedSettings));
            } catch (error) {
                console.error("Failed to save settings to localStorage", error);
            }
            return updatedSettings;
        });
    }, []);

    return { settings, saveSettings, isLoaded };
}
