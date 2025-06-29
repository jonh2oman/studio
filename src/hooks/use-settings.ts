
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
    staffRoles: [
      'Commanding Officer',
      'Training Officer',
      'Administration Officer',
      'Supply Officer'
    ],
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

    const updateCorpsData = useCallback(async (dataUpdate: Partial<Omit<CorpsData, 'id'>>) => {
        if (!user || !db || !corpsData?.id) return;
        
        try {
            const corpsDocRef = doc(db, 'corps', corpsData.id);
            const dataForFirestore = { ...dataUpdate };
            
            await setDoc(corpsDocRef, dataForFirestore, { merge: true });

        } catch (error) {
            console.error('Failed to save data to Firestore', error);
            toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save your changes.' });
        }
    }, [user, db, corpsData?.id, toast]);


    const saveSettings = useCallback(async (settingsUpdate: Partial<Settings> | ((prevSettings: Settings) => Partial<Settings>)) => {
        if (!user || !db || !corpsData?.id) return;

        const currentSettings = corpsData.settings || defaultSettings;
        const update = typeof settingsUpdate === 'function' ? settingsUpdate(currentSettings) : settingsUpdate;
        const updatedSettings = { ...currentSettings, ...update };

        await updateCorpsData({ settings: updatedSettings });

    }, [user, db, corpsData, updateCorpsData, toast]);
    
    const updateTrainingYears = useCallback((newTrainingYears: CorpsData['trainingYears']) => {
        updateCorpsData({ trainingYears: newTrainingYears });
    }, [updateCorpsData]);

    const saveZtoReviewedPlans = useCallback((newPlans: ZtoReviewedPlan[]) => {
         updateCorpsData({ ztoReviewedPlans: newPlans });
    }, [updateCorpsData]);

    const resetUserDocument = useCallback(async () => {
        if (!user || !db || !corpsData?.id) {
            toast({ variant: "destructive", title: "Error", description: "Cannot reset data. Not authenticated or no corps data found." });
            return;
        }

        try {
            const corpsDocRef = doc(db, 'corps', corpsData.id);
            await setDoc(corpsDocRef, defaultCorpsData);
            
            localStorage.removeItem(`currentTrainingYear_${user.uid}`);

            toast({ title: "Application Reset", description: "Your data has been successfully reset. The page will now reload." });
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error("Failed to reset application:", error);
            toast({ variant: "destructive", title: "Reset Failed", description: "Could not reset your data." });
        }
    }, [db, toast, user, corpsData?.id]);


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
