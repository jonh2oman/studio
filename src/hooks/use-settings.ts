"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '@/lib/types';

const defaultSettings: Settings = {
    trainingDay: 2, // Tuesday
    corpsName: "RCSCC 288 ARDENT",
};

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem('trainingSettings');
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        } catch (error) {
            console.error("Failed to parse settings from localStorage", error);
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
