
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Settings, UserDocument, Invite, UserRole } from '@/lib/types';
import { useAuth } from './use-auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, writeBatch, deleteField } from 'firebase/firestore';
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
    dashboardCardOrder: { categoryOrder: [], itemOrder: {} },
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
    const { toast } = useToast();
    const [userDocument, setUserDocument] = useState<UserDocument | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [dataOwnerId, setDataOwnerId] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const userRef = useRef(user);
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    const dataOwnerIdRef = useRef(dataOwnerId);
    useEffect(() => {
        dataOwnerIdRef.current = dataOwnerId;
    }, [dataOwnerId]);

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
        
        return ownerId;
    }, [db]);

    const syncPermissions = useCallback(async (currentDataOwnerId: string, currentSettings: Settings) => {
        if (!user || !db || currentSettings.permissions?.[user.uid]?.role !== 'owner') return;
        
        const invitesRef = collection(db, "invites");
        const q = query(invitesRef, where("corpsDataOwnerId", "==", currentDataOwnerId), where("status", "==", "accepted"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return;

        const batch = writeBatch(db);
        const newPermissions = { ...currentSettings.permissions };
        let permissionsChanged = false;

        querySnapshot.forEach(inviteDoc => {
            const inviteData = inviteDoc.data() as Invite;
            const inviteeId = inviteData.acceptedBy;
            
            if (inviteeId && !newPermissions[inviteeId]) {
                newPermissions[inviteeId] = { email: inviteData.inviteeEmail, role: inviteData.role };
                permissionsChanged = true;
                
                batch.update(inviteDoc.ref, { status: "processed" });
            }
        });

        if (permissionsChanged) {
            const userDocRef = doc(db, 'users', currentDataOwnerId);
            batch.set(userDocRef, { settings: { permissions: newPermissions } }, { merge: true });
            await batch.commit();
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

            try {
                let ownerIdFromInvite = null;
                try {
                    ownerIdFromInvite = await processInvites(user.uid, user.email!);
                } catch (error) {
                    console.error("Error processing invites:", error);
                }

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
                        try {
                            await syncPermissions(effectiveOwnerId, data.settings);
                            const updatedDataDocSnap = await getDoc(dataDocRef);
                            if (updatedDataDocSnap.exists()) {
                                const updatedData = updatedDataDocSnap.data() as UserDocument;
                                setUserDocument(updatedData);
                                setUserRole(updatedData.settings.permissions?.[user.uid]?.role || null);
                            }
                        } catch (error) {
                            console.error("Error syncing permissions:", error);
                            setUserDocument(data);
                            setUserRole(role);
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
            } catch (error) {
                console.error("Fatal error loading settings:", error);
                toast({ variant: 'destructive', title: 'Failed to load corps data.', description: 'Please check your connection and permissions, or try refreshing the page.' });
            } finally {
                setIsLoaded(true);
            }
        }
        loadSettings();
    }, [user, processInvites, syncPermissions, toast]);

    const settings = userDocument?.settings;
    const allYearsData = userDocument?.trainingYears || {};
    
    const saveSettings = useCallback((settingsUpdate: Partial<Settings> | ((prevSettings: Settings) => Partial<Settings>)) => {
        const currentUser = userRef.current;
        const ownerId = dataOwnerIdRef.current;
        if (!currentUser || !db || !ownerId) return;

        setUserDocument(prevDoc => {
            if (!prevDoc) return null;
            
            const currentSettings = prevDoc.settings || defaultSettings;
            const update = typeof settingsUpdate === 'function' ? settingsUpdate(currentSettings) : settingsUpdate;
            const updatedSettings = { ...currentSettings, ...update };

            const userDocRef = doc(db, 'users', ownerId);
            setDoc(userDocRef, { settings: updatedSettings }, { merge: true }).catch(
              (error) => {
                console.error('Failed to save settings to Firestore', error);
                toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save settings.' });
              }
            );

            return { ...prevDoc, settings: updatedSettings };
        });
    }, [db, toast]);

    const resetUserDocument = useCallback(async () => {
        const currentUser = userRef.current;
        const ownerId = dataOwnerIdRef.current;
        if (!currentUser || !db || !ownerId) {
            toast({ variant: "destructive", title: "Error", description: "Cannot reset data. User not authenticated or data owner not found." });
            return;
        }

        if (ownerId !== currentUser.uid) {
            toast({ variant: "destructive", title: "Action Not Allowed", description: "Only the data owner can reset the application." });
            return;
        }

        try {
            const newUserDoc = defaultUserDocument(currentUser.uid, currentUser.email!);
            const userDocRef = doc(db, 'users', ownerId);
            await setDoc(userDocRef, newUserDoc);
            
            localStorage.removeItem(`currentTrainingYear_${ownerId}`);

            toast({ title: "Application Reset", description: "Your data has been successfully reset. The page will now reload." });
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error("Failed to reset application:", error);
            toast({ variant: "destructive", title: "Reset Failed", description: "Could not reset your data." });
        }
    }, [db, toast]);

    const forceSetOwner = useCallback(async () => {
        const currentUser = userRef.current;
        if (!currentUser || !db) {
            toast({ variant: "destructive", title: "Error", description: "User not authenticated." });
            return;
        }

        try {
            const newDocument = defaultUserDocument(currentUser.uid, currentUser.email!);
            const userDocRef = doc(db, 'users', currentUser.uid);
            
            await setDoc(userDocRef, newDocument);

            toast({ title: "Ownership Claimed", description: "You are now the owner of your data. The page will reload." });
            setTimeout(() => window.location.reload(), 2000);

        } catch (error) {
            console.error("Failed to force set owner:", error);
            toast({ variant: "destructive", title: "Failed to set owner", description: "Could not update ownership." });
        }
    }, [db, toast]);

    return { 
        settings: settings || defaultSettings, 
        allYearsData,
        saveSettings, 
        isLoaded,
        userRole,
        dataOwnerId,
        resetUserDocument,
        forceSetOwner
    };
}
