
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Settings, YearSpecificSettings, TrainingYearSettings, WeeklyActivity } from '@/lib/types';
import { useTrainingYear } from './use-training-year';

const defaultSettings: Settings = {
    trainingDay: 2, // Tuesday
    corpsName: "RCSCC 288 ARDENT",
    staff: [],
    classrooms: ["#1", "#2", "#3", "Parade Deck", "Boathouse"],
    cadetRanks: [
        "Able Cadet (AC)",
        "Leading Cadet (LC)",
        "Petty Officer 2nd Class (PO2)",
        "Petty Officer 1st Class (PO1)",
        "Chief Petty Officer 2nd Class (CPO2)",
        "Chief Petty Officer 1st Class (CPO1)",
    ],
    officerRanks: [
        "Naval Cadet (NCdt)",
        "Acting Sub-Lieutenant (A/SLt)",
        "Sub-Lieutenant (SLt)",
        "Lieutenant (Navy) (Lt[N])",
        "Lieutenant-Commander (LCdr)",
    ],
    weeklyActivities: [],
    ordersOfDress: {
        caf: ['DEU 3B', 'DEU 3', 'CADPAT'],
        cadets: ['C-1', 'C-2', 'C-3A', 'C-5 (Sports Gear)']
    }
};

const defaultYearSettings: TrainingYearSettings = {};

export function useSettings() {
    const { currentYear } = useTrainingYear();
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [yearSettings, setYearSettings] = useState<TrainingYearSettings>(defaultYearSettings);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSetupComplete, setIsSetupComplete] = useState(false);

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
                const mergedSettings = { ...defaultSettings, ...parsedSettings };
                mergedSettings.staff = parsedSettings.staff || [];
                mergedSettings.classrooms = mergedSettings.classrooms?.length > 0 ? mergedSettings.classrooms : defaultSettings.classrooms;
                mergedSettings.cadetRanks = mergedSettings.cadetRanks?.length > 0 ? mergedSettings.cadetRanks : defaultSettings.cadetRanks;
                mergedSettings.officerRanks = mergedSettings.officerRanks?.length > 0 ? mergedSettings.officerRanks : defaultSettings.officerRanks;
                mergedSettings.weeklyActivities = parsedSettings.weeklyActivities || [];
                mergedSettings.ordersOfDress = parsedSettings.ordersOfDress || defaultSettings.ordersOfDress;
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

            const setupCompleteFlag = localStorage.getItem('isSetupComplete');
            setIsSetupComplete(setupCompleteFlag === 'true');

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

    const completeSetup = useCallback(() => {
        try {
            localStorage.setItem('isSetupComplete', 'true');
            setIsSetupComplete(true);
        } catch (error) {
            console.error("Failed to save setup complete flag to localStorage", error);
        }
    }, []);

    const firstTrainingNight = currentYear ? yearSettings[currentYear]?.firstTrainingNight : null;

    const settingsForHook = { ...settings, firstTrainingNight: firstTrainingNight || ''};

    return { settings: settingsForHook, saveSettings, isLoaded, isSetupComplete, completeSetup };
}
