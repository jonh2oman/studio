"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '@/lib/types';

const defaultSettings: Settings = {
    trainingDay: 2, // Tuesday
    corpsName: "RCSCC 288 ARDENT",
    instructors: ["CI Smith", "Lt(N) Jones", "OCdt Picard"],
    classrooms: ["#1", "#2", "#3", "Parade Deck", "Boathouse"],
};

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem('trainingSettings');
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings);
                setSettings({ ...defaultSettings, ...parsedSettings });
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
