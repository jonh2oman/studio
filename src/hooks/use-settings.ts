
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Settings, UserDocument, LsaWishListItem } from '@/lib/types';
import { useAuth } from './use-auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { awardsData } from '@/lib/awards-data';
import { useToast } from './use-toast';

const permanentRoles = [
    'Commanding Officer',
    'Training Officer',
    'Administration Officer',
    'Supply Officer'
];

const defaultSettings: Settings = {
    element: 'Sea',
    trainingDay: 2, // Tuesday
    corpsName: "",
    corpsLogo: "",
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
    customEOs: [],
    firstTrainingNight: '', // This is now a dummy value, real value is per-year
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

export const defaultUserDocument: (userId: string, email: string) => UserDocument = (userId, email) => ({
    settings: {
        ...defaultSettings,
    },
    trainingYears: {}
});

export function useSettings() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [userDocument, setUserDocument] = useState<UserDocument | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const userRef = useRef(user);
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        const loadSettings = async () => {
            if (!user || !db) {
                setUserDocument(null);
                setIsLoaded(true);
                return;
            };

            setIsLoaded(false);

            try {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    setUserDocument(userDocSnap.data() as UserDocument);
                } else {
                    const newUserDoc = defaultUserDocument(user.uid, user.email!);
                    await setDoc(userDocRef, newUserDoc);
                    setUserDocument(newUserDoc);
                }
            } catch (error) {
                console.error("Fatal error loading settings:", error);
                toast({ variant: 'destructive', title: 'Failed to load corps data.', description: 'Please check your connection and try refreshing the page.' });
            } finally {
                setIsLoaded(true);
            }
        }
        loadSettings();
    }, [user, toast]);

    const settings = userDocument?.settings;
    const allYearsData = userDocument?.trainingYears || {};
    
    const saveSettings = useCallback((settingsUpdate: Partial<Settings> | ((prevSettings: Settings) => Partial<Settings>)) => {
        const currentUser = userRef.current;
        if (!currentUser || !db) return;

        setUserDocument(prevDoc => {
            if (!prevDoc) return null;
            
            const currentSettings = prevDoc.settings || defaultSettings;
            const update = typeof settingsUpdate === 'function' ? settingsUpdate(currentSettings) : settingsUpdate;
            const updatedSettings = { ...currentSettings, ...update };

            const userDocRef = doc(db, 'users', currentUser.uid);
            setDoc(userDocRef, { settings: updatedSettings }, { merge: true }).catch(
              (error) => {
                console.error('Failed to save settings to Firestore', error);
                toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save settings.' });
              }
            );

            return { ...prevDoc, settings: updatedSettings };
        });
    }, [db, toast]);

    const updateTrainingYears = useCallback((newTrainingYears: UserDocument['trainingYears']) => {
        const currentUser = userRef.current;
        if (!currentUser || !db) return;

        setUserDocument(prevDoc => {
            if (!prevDoc) return null;
            
            const userDocRef = doc(db, 'users', currentUser.uid);
            setDoc(userDocRef, { trainingYears: newTrainingYears }, { merge: true }).catch(
                (error) => {
                console.error('Failed to save training years to Firestore', error);
                toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save training year data.' });
                }
            );

            return { ...prevDoc, trainingYears: newTrainingYears };
        });
    }, [db, toast]);

    const resetUserDocument = useCallback(async () => {
        const currentUser = userRef.current;
        if (!currentUser || !db) {
            toast({ variant: "destructive", title: "Error", description: "Cannot reset data. User not authenticated." });
            return;
        }

        try {
            const newUserDoc = defaultUserDocument(currentUser.uid, currentUser.email!);
            const userDocRef = doc(db, 'users', currentUser.uid);
            await setDoc(userDocRef, newUserDoc);
            
            localStorage.removeItem(`currentTrainingYear_${currentUser.uid}`);

            toast({ title: "Application Reset", description: "Your data has been successfully reset. The page will now reload." });
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error("Failed to reset application:", error);
            toast({ variant: "destructive", title: "Reset Failed", description: "Could not reset your data." });
        }
    }, [db, toast]);

    return { 
        settings: settings || defaultSettings, 
        allYearsData,
        saveSettings, 
        isLoaded,
        resetUserDocument,
        updateTrainingYears,
    };
}
