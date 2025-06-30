
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Settings, CorpsData, TrainingYearData, ZtoReviewedPlan } from '@/lib/types';
import { useAuth } from './use-auth';
import { doc, getDoc, setDoc, addDoc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { awardsData } from '@/lib/awards-data';
import { useToast } from './use-toast';

const defaultSettings: Settings = {
    element: 'Sea',
    trainingDay: 2, // Tuesday
    corpsName: "",
    corpsLogo: "",
    staff: [],
    cadets: [],
    staffRoles: [
      'Commanding Officer',
      'Training Officer',
      'Administration Officer',
      'Supply Officer'
    ],
    poNcmRoles: [],
    cadetRoles: [],
    classrooms: [],
    cadetRanks: [],
    officerRanks: [],
    weeklyActivities: [],
    ordersOfDress: {
        caf: [],
        cadets: []
    },
    customEOs: [],
    awards: awardsData,
    assets: [],
    assetCategories: ['Uniforms', 'Electronics', 'Sailing Gear', 'Training Aids', 'Furniture', 'Other'],
    lsaWishList: [],
    uniformInventory: [],
    issuedUniforms: [],
    uniformCategories: ['Tunics', 'Trousers', 'Boots', 'Headwear', 'Shirts', 'Accessories', 'Other'],
    settingsCardOrder: ['general', 'resources', 'data', 'danger'],
    generalSettingsCardOrder: ['trainingYear', 'corpsInfo'],
    planningResourcesCardOrder: ['classrooms', 'customEos', 'weeklyActivities'],
    cadetSettingsCardOrder: ['cadetRoles', 'cadetRanks', 'cadetDress'],
    sidebarNavOrder: {},
    dashboardCardOrder: { categoryOrder: [], itemOrder: {} },
};

export const defaultCorpsData: Omit<CorpsData, 'id'> = {
    settings: defaultSettings,
    trainingYears: {},
    ztoReviewedPlans: [],
};

const defaultTrainingYears = {};
const defaultZtoPlans: ZtoReviewedPlan[] = [];

export function useSettings() {
    const { user, userData } = useAuth();
    const { toast } = useToast();
    const [corpsData, setCorpsData] = useState<CorpsData | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        if (!user || !userData?.corpsId || !db) {
            setIsLoaded(true); // Mark as loaded if there's no user/corps to load
            return;
        }

        setIsLoaded(false);
        const corpsDocRef = doc(db, 'corps', userData.corpsId);

        const unsubscribe = onSnapshot(corpsDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const loadedData = docSnap.data() as Omit<CorpsData, 'id'>;
                // Deep merge settings with defaults to prevent crashes if new settings are added
                const mergedSettings = { 
                    ...defaultSettings, 
                    ...(loadedData.settings || {}),
                    ordersOfDress: { ...defaultSettings.ordersOfDress, ...(loadedData.settings?.ordersOfDress || {}) },
                    dashboardCardOrder: { ...defaultSettings.dashboardCardOrder, ...(loadedData.settings?.dashboardCardOrder || {}) }
                };
                
                setCorpsData({ id: docSnap.id, ...loadedData, settings: mergedSettings });
            } else {
                 console.error("Error: Corps ID points to a non-existent document.");
                 toast({ variant: 'destructive', title: 'Data Error', description: 'Could not find your corps data. Please contact support.' });
            }
            setIsLoaded(true);
        }, (error) => {
            console.error("Fatal error loading settings:", error);
            toast({ variant: 'destructive', title: 'Failed to load corps data.', description: 'Please check your connection and try refreshing the page.' });
            setIsLoaded(true);
        });

        return () => unsubscribe(); // Cleanup the listener on unmount
    }, [user, userData?.corpsId, toast]);

    const updateCorpsData = useCallback((updater: (prevData: CorpsData | null) => CorpsData | null) => {
        if (!user || !db || !userData?.corpsId) return;

        setCorpsData(currentCorpsData => {
            const newData = updater(currentCorpsData);
            if (newData && newData !== currentCorpsData) {
                const corpsDocRef = doc(db, 'corps', userData.corpsId!);
                // Use setDoc without merge to prevent race conditions, as we are managing the full state object.
                // The onSnapshot listener will handle syncing back, but this ensures a faster save.
                setDoc(corpsDocRef, newData).catch(error => {
                    console.error('Failed to save data to Firestore', error);
                    toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save your changes. Your local changes are temporary.' });
                });
            }
            return newData;
        });
    }, [user, db, userData?.corpsId, toast]);

    const saveSettings = useCallback(async (settingsUpdate: Partial<Settings> | ((prevSettings: Settings) => Partial<Settings>)) => {
        updateCorpsData(prevCorpsData => {
            if (!prevCorpsData) return null;
            const currentSettings = prevCorpsData.settings || defaultSettings;
            const update = typeof settingsUpdate === 'function' ? settingsUpdate(currentSettings) : settingsUpdate;
            return {
                ...prevCorpsData,
                settings: { ...currentSettings, ...update }
            };
        });
    }, [updateCorpsData]);
    
    const updateTrainingYears = useCallback((updater: (prevTrainingYears: CorpsData['trainingYears']) => CorpsData['trainingYears']) => {
        updateCorpsData(prevCorpsData => {
            if (!prevCorpsData) return null;
            const newTrainingYears = updater(prevCorpsData.trainingYears || {});
            return { ...prevCorpsData, trainingYears: newTrainingYears };
        });
    }, [updateCorpsData]);

    const saveZtoReviewedPlans = useCallback((newPlans: ZtoReviewedPlan[]) => {
         updateCorpsData(prevCorpsData => {
            if (!prevCorpsData) return null;
            return { ...prevCorpsData, ztoReviewedPlans: newPlans };
        });
    }, [updateCorpsData]);

    const resetUserDocument = useCallback(async () => {
        if (!user || !db || !userData?.corpsId) {
            toast({ variant: "destructive", title: "Error", description: "Cannot reset data. Not authenticated or no corps data found." });
            return;
        }

        try {
            const corpsDocRef = doc(db, 'corps', userData.corpsId);
            await setDoc(corpsDocRef, defaultCorpsData);
            
            localStorage.removeItem(`currentTrainingYear_${user.uid}`);

            toast({ title: "Application Reset", description: "Your data has been successfully reset. The page will now reload." });
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error("Failed to reset application:", error);
            toast({ variant: "destructive", title: "Reset Failed", description: "Could not reset your data." });
        }
    }, [db, toast, user, userData?.corpsId]);


    return { 
        settings: corpsData?.settings || defaultSettings, 
        allYearsData: corpsData?.trainingYears || defaultTrainingYears,
        ztoReviewedPlans: corpsData?.ztoReviewedPlans || defaultZtoPlans,
        corpsId: corpsData?.id || null,
        saveSettings, 
        isLoaded,
        resetUserDocument,
        updateTrainingYears,
        saveZtoReviewedPlans,
    };
}
