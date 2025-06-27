
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Settings, YearSpecificSettings, TrainingYearSettings, WeeklyActivity, CustomEO } from '@/lib/types';
import { useTrainingYear } from './use-training-year';

const permanentRoles = [
    'Commanding Officer',
    'Training Officer',
    'Administration Officer',
    'Supply Officer'
];

const defaultCustomEOs: CustomEO[] = [
    { id: 'CS001', title: 'Drill Team Practice', periods: 1 },
    { id: 'CS002', title: 'Music Practice', periods: 1 },
    { id: 'CS003', title: 'Marksmanship Practice', periods: 1 },
    { id: 'CS004', title: 'Biathlon Practice', periods: 1 },
    { id: 'CS005', title: 'Orienteering Practice', periods: 1 },
    { id: 'CS006', title: 'Model Boat Club', periods: 1 },
    { id: 'CS009', title: 'Seamanship Team Practice', periods: 1 },
    { id: 'CS010', title: 'Halloween Costume Dance', periods: 1 },
    { id: 'CS011', title: 'Poppy Campaign', periods: 1 },
    { id: 'CS012', title: "Remembrance Day Visit to Veterans' Home", periods: 1 },
    { id: 'CS013', title: "Christmas Mess Dinner", periods: 1 },
    { id: 'CS014', title: "Caroling at Veterans' Home", periods: 1 },
    { id: 'CS015', title: 'Santa Claus Parade', periods: 1 },
    { id: 'CS016', title: 'Treasure Hunt Day', periods: 1 },
    { id: 'CS017', title: 'Volunteering at Animal Shelter', periods: 1 },
    { id: 'CS018', title: 'Swimming night', periods: 1 },
    { id: 'CS019', title: 'Pirate Sports Day', periods: 1 },
    { id: 'CS020', title: "Valentine's Skating Party", periods: 1 },
    { id: 'CS021', title: 'Yoga day', periods: 1 },
    { id: 'CS022', title: 'Movie night', periods: 1 },
    { id: 'CS023', title: 'Geocaching', periods: 1 },
    { id: 'CS024', title: 'Charity Relay', periods: 1 },
    { id: 'CS025', title: 'Maritime Museum Tour', periods: 1 },
    { id: 'CS026', title: 'ACR Setup', periods: 1 },
    { id: 'CS027', title: 'Beach Day', periods: 1 },
    { id: 'CS028', title: 'End-of-Year Barbecue', periods: 1 },
    { id: 'CS029', title: 'Halloween Theme Night', periods: 1 },
    { id: 'CS030', title: 'Christmas Theme Night', periods: 1 },
    { id: 'CS031', title: "Valentines Day Theme Night", periods: 1 },
];

const defaultSettings: Settings = {
    trainingDay: 2, // Tuesday
    corpsName: "",
    staff: [],
    staffRoles: [...permanentRoles],
    cadetRoles: [],
    classrooms: [],
    cadetRanks: [],
    officerRanks: [],
    weeklyActivities: [],
    ordersOfDress: {
        caf: [],
        cadets: []
    },
    customEOs: defaultCustomEOs,
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
                    staff: (parsedSettings.staff || []).map((s: any) => ({
                        ...s,
                        primaryRole: s.primaryRole || '',
                        additionalRoles: s.additionalRoles || [],
                    })), 
                    staffRoles: Array.from(new Set([...permanentRoles, ...(parsedSettings.staffRoles || [])])),
                    cadetRoles: parsedSettings.cadetRoles || [],
                    classrooms: parsedSettings.classrooms || [],
                    cadetRanks: parsedSettings.cadetRanks || [],
                    officerRanks: parsedSettings.officerRanks || [],
                    weeklyActivities: parsedSettings.weeklyActivities || [],
                    ordersOfDress: parsedSettings.ordersOfDress || { caf: [], cadets: [] },
                    customEOs: parsedSettings.customEOs || defaultCustomEOs,
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

    const settingsForHook = useMemo(() => ({
        ...settings,
        firstTrainingNight: firstTrainingNight || ''
    }), [settings, firstTrainingNight]);

    return { settings: settingsForHook, saveSettings, isLoaded };
}
