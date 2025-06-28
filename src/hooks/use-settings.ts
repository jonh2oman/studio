

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

        const batch = writeBatch(db);

        // Invitee updates their own document to point to the owner's data
        const userDocRef = doc(db, 'users', userId);
        batch.set(userDocRef, { pointerToCorpsData: ownerId }, { merge: true });
        
        // Invitee updates the invite status to 'accepted'
        batch.update(inviteDoc.ref, { status: "accepted", acceptedBy: userId, acceptedAt: new Date() });

        await batch.commit();
        
        // The owner's client will handle adding the user to permissions.
        return ownerId;
    }, []);

    const syncPermissions = useCallback(async (currentDataOwnerId: string, currentSettings: Settings) => {
        if (!user || !db || currentSettings.permissions?.[user.uid]?.role !== 'owner') return;
        
        const invitesRef = collection(db, "invites");
        // Look for invites that this user sent and have been accepted but not yet processed
        const q = query(invitesRef, where("corpsDataOwnerId", "==", currentDataOwnerId), where("status", "==", "accepted"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return;

        const batch = writeBatch(db);
        const newPermissions = { ...currentSettings.permissions };
        let permissionsChanged = false;

        querySnapshot.forEach(inviteDoc => {
            const inviteData = inviteDoc.data() as Invite;
            const inviteeId = inviteData.acceptedBy;
            
            // If the accepted invitee is not already in permissions, add them
            if (inviteeId && !newPermissions[inviteeId]) {
                newPermissions[inviteeId] = { email: inviteData.inviteeEmail, role: inviteData.role };
                permissionsChanged = true;
                
                // Mark the invite as processed so we don't handle it again
                batch.update(inviteDoc.ref, { status: "processed" });
            }
        });

        if (permissionsChanged) {
            const userDocRef = doc(db, 'users', currentDataOwnerId);
            batch.set(userDocRef, { settings: { permissions: newPermissions } }, { merge: true });
            await batch.commit();
            // The main useEffect will re-read the data and update the state
        }
    }, [user, db]);

    useEffect(() => {
        const loadSettings = async () => {
            if (!user || !db) {
                setUserDocument(null);
                setIsLoaded(true);
                return;
            };

            setIsLoaded(false);

            const ownerIdFromInvite = await processInvites(user.uid, user.email!);

            let effectiveOwnerId = ownerIdFromInvite;
            if (!effectiveOwnerId) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists() && userDocSnap.data()?.pointerToCorpsData) {
                    effectiveOwnerId = userDocSnap.data()?.pointerToCorpsData;
                } else {
                    effectiveOwnerId = user.uid;
                }
            }
            setDataOwnerId(effectiveOwnerId);

            const dataDocRef = doc(db, 'users', effectiveOwnerId);
            const dataDocSnap = await getDoc(dataDocRef);

            if (dataDocSnap.exists()) {
                const data = dataDocSnap.data() as UserDocument;
                const role = data.settings.permissions?.[user.uid]?.role || null;
                
                if (role === 'owner') {
                    await syncPermissions(effectiveOwnerId, data.settings);
                    // Re-fetch data after syncing permissions to get the latest state
                    const updatedDataDocSnap = await getDoc(dataDocRef);
                    if (updatedDataDocSnap.exists()) {
                         const updatedData = updatedDataDocSnap.data() as UserDocument;
                         setUserDocument(updatedData);
                         setUserRole(updatedData.settings.permissions?.[user.uid]?.role || null);
                    }
                } else {
                    setUserDocument(data);
                    setUserRole(role);
                }
            } else {
                const newUserDoc = defaultUserDocument(user.uid, user.email!);
                await setDoc(dataDocRef, newUserDoc);
                setUserDocument(newUserDoc);
                setUserRole('owner');
            }
            setIsLoaded(true);
        }
        loadSettings();
    }, [user, processInvites, syncPermissions]);

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
