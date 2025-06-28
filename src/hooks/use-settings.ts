

"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Settings, UserDocument, Invite, UserRole } from '@/lib/types';
import { useAuth } from './use-auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { awardsData } from '@/lib/awards-data';

const permanentRoles = [
    'Commanding Officer',
    'Training Officer',
    'Administration Officer',
    'Supply Officer'
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
    customEOs: [],
    firstTrainingNight: '', // This is now a dummy value, real value is per-year
    awards: awardsData,
    assets: [],
    assetCategories: ['Uniforms', 'Electronics', 'Sailing Gear', 'Training Aids', 'Furniture', 'Other'],
    permissions: {},
    settingsCardOrder: ['general', 'resources', 'data', 'danger'],
    generalSettingsCardOrder: ['trainingYear', 'corpsInfo'],
    planningResourcesCardOrder: ['classrooms', 'customEos', 'weeklyActivities'],
    cadetSettingsCardOrder: ['cadetRoles', 'cadetRanks', 'cadetDress'],
    sidebarNavOrder: {},
};

export const defaultUserDocument: (userId: string, email: string) => UserDocument = (userId, email) => ({
    settings: {
        ...defaultSettings,
        permissions: {
            [userId]: { email, role: 'owner' }
        }
    },
    trainingYears: {}
});

export function useSettings() {
    const { user } = useAuth();
    const [userDocument, setUserDocument] = useState<UserDocument | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [dataOwnerId, setDataOwnerId] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const processInvites = useCallback(async (userId: string, userEmail: string) => {
        if (!db) return null;
        const invitesRef = collection(db, "invites");
        const q = query(invitesRef, where("inviteeEmail", "==", userEmail), where("status", "==", "pending"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return null;

        const inviteDoc = querySnapshot.docs[0];
        const inviteData = inviteDoc.data() as Invite;
        const ownerId = inviteData.corpsDataOwnerId;

        const ownerDocRef = doc(db, 'users', ownerId);
        const userDocRef = doc(db, 'users', userId);

        const batch = writeBatch(db);

        // Update owner's doc with new user's permission
        batch.set(ownerDocRef, {
            settings: {
                permissions: {
                    [userId]: { email: userEmail, role: inviteData.role }
                }
            }
        }, { merge: true });

        // Update invitee's doc with a pointer
        batch.set(userDocRef, { pointerToCorpsData: ownerId }, { merge: true });
        
        // Update invite status
        batch.update(inviteDoc.ref, { status: "accepted", acceptedBy: userId, acceptedAt: new Date() });

        await batch.commit();

        return ownerId;
    }, []);

    useEffect(() => {
        const loadSettings = async () => {
            if (!user || !db) {
                setUserDocument(null);
                setIsLoaded(true);
                return;
            };

            setIsLoaded(false);

            // 1. Check for and process any pending invites
            const ownerIdFromInvite = await processInvites(user.uid, user.email!);

            // 2. Determine where the data lives
            let effectiveOwnerId = ownerIdFromInvite;
            if (!effectiveOwnerId) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists() && userDocSnap.data()?.pointerToCorpsData) {
                    effectiveOwnerId = userDocSnap.data()?.pointerToCorpsData;
                } else {
                    effectiveOwnerId = user.uid; // User is the owner
                }
            }
            setDataOwnerId(effectiveOwnerId);

            // 3. Load the data from the owner's document
            const dataDocRef = doc(db, 'users', effectiveOwnerId);
            const dataDocSnap = await getDoc(dataDocRef);

            if (dataDocSnap.exists()) {
                const data = dataDocSnap.data() as UserDocument;
                const mergedSettings: Settings = {
                    ...defaultSettings,
                    ...data.settings,
                    staffRoles: Array.from(new Set([...permanentRoles, ...(data.settings.staffRoles || [])])),
                };
                setUserDocument({ ...data, settings: mergedSettings });
                setUserRole(data.settings.permissions?.[user.uid]?.role || null);
            } else {
                // This is a new user who wasn't invited, create their own document
                const newUserDoc = defaultUserDocument(user.uid, user.email!);
                await setDoc(dataDocRef, newUserDoc);
                setUserDocument(newUserDoc);
                setUserRole('owner');
            }
            setIsLoaded(true);
        }
        loadSettings();
    }, [user, processInvites]);

    const saveUserDocument = useCallback(async (newDocument: Partial<UserDocument>) => {
        if (!user || !db || !dataOwnerId) return;

        const updatedDocument = { ...userDocument, ...newDocument } as UserDocument;
        setUserDocument(updatedDocument);

        const userDocRef = doc(db, 'users', dataOwnerId);
        try {
            await setDoc(userDocRef, newDocument, { merge: true });
        } catch (error) {
            console.error("Failed to save user document to Firestore", error);
        }
    }, [user, userDocument, dataOwnerId]);
    
    const settings = userDocument?.settings;
    const allYearsData = userDocument?.trainingYears || {};

    const saveSettings = useCallback(async (newSettings: Partial<Settings>) => {
        if (!settings) return;
        const updatedSettings = { ...settings, ...newSettings };
        await saveUserDocument({ settings: updatedSettings });
    }, [settings, saveUserDocument]);

    return { 
        settings: settings || defaultSettings, 
        allYearsData,
        saveSettings, 
        isLoaded,
        userRole,
        dataOwnerId
    };
}
