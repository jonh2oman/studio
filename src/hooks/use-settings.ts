
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Settings, CorpsData, TrainingYearData, ZtoReviewedPlan } from '@/lib/types';
import { useAuth } from './use-auth';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
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

export function useSettings() {
    const { user, userData } = useAuth();
    const { toast } = useToast();
    const [corpsData, setCorpsData] = useState<CorpsData | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const userRef = useRef(user);
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        const loadCorpsData = async () => {
            if (!user || !userData || !db) {
                setIsLoaded(true);
                return;
            };

            setIsLoaded(false);

            try {
                if (userData.corpsId) {
                    const corpsDocRef = doc(db, 'corps', userData.corpsId);
                    const corpsDocSnap = await getDoc(corpsDocRef);

                    if (corpsDocSnap.exists()) {
                        const loadedData = corpsDocSnap.data() as Omit<CorpsData, 'id'>;
                        // Deep merge settings with defaults
                        const mergedSettings = { 
                            ...defaultSettings, 
                            ...loadedData.settings,
                            ordersOfDress: { ...defaultSettings.ordersOfDress, ...(loadedData.settings?.ordersOfDress || {}) },
                            dashboardCardOrder: { ...defaultSettings.dashboardCardOrder, ...(loadedData.settings?.dashboardCardOrder || {}) }
                        };
                        
                        setCorpsData({ id: corpsDocSnap.id, ...loadedData, settings: mergedSettings });

                    } else {
                        // Corps ID exists on user but not in corps collection - an error state
                        console.error("Error: Corps ID points to a non-existent document.");
                        toast({ variant: 'destructive', title: 'Data Error', description: 'Could not find your corps data. Please contact support.' });
                    }
                } else {
                    // New user with no corpsId, create a new corps for them.
                    const newCorpsRef = await addDoc(collection(db, "corps"), defaultCorpsData);
                    const userDocRef = doc(db, 'users', user.uid);
                    await setDoc(userDocRef, { corpsId: newCorpsRef.id }, { merge: true });
                    setCorpsData({ id: newCorpsRef.id, ...defaultCorpsData });
                    toast({ title: "Welcome!", description: "A new corps has been created for you." });
                }

            } catch (error) {
                console.error("Fatal error loading settings:", error);
                toast({ variant: 'destructive', title: 'Failed to load corps data.', description: 'Please check your connection and try refreshing the page.' });
            } finally {
                setIsLoaded(true);
            }
        }
        loadCorpsData();
    }, [user, userData, toast]);
    
    const updateCorpsData = useCallback(async (dataUpdate: Partial<Omit<CorpsData, 'id'>>) => {
        if (!user || !db || !corpsData?.id) return;
        
        try {
            const corpsDocRef = doc(db, 'corps', corpsData.id);
            await setDoc(corpsDocRef, dataUpdate, { merge: true });

            // Update local state immediately for responsiveness
            setCorpsData(prevData => {
                if (!prevData) return null;
                
                // A bit of a deep merge needed for settings
                const newSettings = dataUpdate.settings 
                    ? { ...prevData.settings, ...dataUpdate.settings } 
                    : prevData.settings;
                
                const newTrainingYears = dataUpdate.trainingYears
                    ? { ...prevData.trainingYears, ...dataUpdate.trainingYears }
                    : prevData.trainingYears;

                return { ...prevData, ...dataUpdate, settings: newSettings, trainingYears: newTrainingYears };
            });

        } catch (error) {
            console.error('Failed to save data to Firestore', error);
            toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save your changes.' });
        }
    }, [user, db, corpsData?.id, toast]);


    const saveSettings = useCallback((settingsUpdate: Partial<Settings> | ((prevSettings: Settings) => Partial<Settings>)) => {
        if (!corpsData) return;
        
        const currentSettings = corpsData.settings || defaultSettings;
        const update = typeof settingsUpdate === 'function' ? settingsUpdate(currentSettings) : settingsUpdate;
        const updatedSettings = { ...currentSettings, ...update };

        updateCorpsData({ settings: updatedSettings });

    }, [corpsData, updateCorpsData]);
    
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
            
            // To be safe, clear local current year storage
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
        allYearsData: corpsData?.trainingYears || {},
        ztoReviewedPlans: corpsData?.ztoReviewedPlans || [],
        saveSettings, 
        isLoaded,
        resetUserDocument,
        updateTrainingYears,
        saveZtoReviewedPlans,
    };
}
