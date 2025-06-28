
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Settings, CustomEO, UserDocument } from '@/lib/types';
import { useAuth } from './use-auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
    customEOs: defaultCustomEOs,
    firstTrainingNight: '', // This is now a dummy value, real value is per-year
    awards: [],
    assets: [],
    assetCategories: ['Uniforms', 'Electronics', 'Sailing Gear', 'Training Aids', 'Furniture', 'Other'],
};

export const defaultUserDocument: UserDocument = {
    settings: defaultSettings,
    trainingYears: {}
}

export function useSettings() {
    const { user } = useAuth();
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            if (!user || !db) {
                setSettings(defaultSettings);
                setIsLoaded(true);
                return;
            };

            setIsLoaded(false);
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const data = userDocSnap.data() as UserDocument;
                 const mergedSettings = {
                    ...defaultSettings,
                    ...data.settings,
                    staffRoles: Array.from(new Set([...permanentRoles, ...(data.settings.staffRoles || [])])),
                };
                setSettings(mergedSettings);
            } else {
                // New user, create default doc
                await setDoc(userDocRef, defaultUserDocument);
                setSettings(defaultSettings);
            }
            setIsLoaded(true);
        }
        loadSettings();
    }, [user]);

    const saveSettings = useCallback(async (newSettings: Partial<Settings>) => {
        if (!user || !db) return;
        
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings); // Optimistic update

        const userDocRef = doc(db, 'users', user.uid);
        try {
            await setDoc(userDocRef, { settings: updatedSettings }, { merge: true });
        } catch (error) {
            console.error("Failed to save global settings to Firestore", error);
            // Optionally revert optimistic update
        }
    }, [user, settings]);
    
    return { settings, saveSettings, isLoaded };
}
