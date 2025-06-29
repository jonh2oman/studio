
"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { doc, onSnapshot, setDoc, getDoc, addDoc, collection, deleteDoc } from 'firebase/firestore';
import type { UserData } from '@/lib/types';
import { defaultCorpsData } from './use-settings';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    userData: null,
    loading: true, 
    logout: async () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!auth || !db) {
        setLoading(false);
        return;
    }

    let unsubscribeDoc: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        // Clean up previous user's snapshot listener
        if (unsubscribeDoc) {
            unsubscribeDoc();
            unsubscribeDoc = null;
        }

        if (user) {
            const userDocRef = doc(db, "users", user.uid);

            const setupAndListen = async () => {
                try {
                    const docSnap = await getDoc(userDocRef);

                    if (!docSnap.exists()) {
                        console.log("New user detected. Running setup...");
                        const userEmail = user.email;
                        if (!userEmail) throw new Error("User email is not available for setup.");

                        const inviteRef = doc(db, 'invites', userEmail);
                        const inviteSnap = await getDoc(inviteRef);
                        let finalCorpsId: string;
                        if (inviteSnap.exists()) {
                            finalCorpsId = inviteSnap.data().corpsId;
                            await deleteDoc(inviteRef);
                            toast({ title: "Welcome!", description: "You've been successfully linked to an existing corps." });
                        } else {
                            const newCorpsRef = await addDoc(collection(db, "corps"), defaultCorpsData);
                            finalCorpsId = newCorpsRef.id;
                            toast({ title: "Welcome!", description: "A new corps has been created for you." });
                        }
                        await setDoc(userDocRef, { email: userEmail, corpsId: finalCorpsId });
                    }
                } catch (error) {
                    console.error("Error during new user setup:", error);
                    toast({ variant: 'destructive', title: 'Account Setup Failed', description: 'Could not set up your account data.' });
                    setLoading(false);
                    setUser(null);
                    setUserData(null);
                    return; // Abort on setup failure
                }

                // Now that setup is guaranteed to be complete, attach the listener.
                unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        setUserData(doc.data() as UserData);
                    }
                    setUser(user);
                    setLoading(false);
                }, (error) => {
                    console.error("Error listening to user document:", error);
                    setUserData(null);
                    setUser(null);
                    setLoading(false);
                });
            };

            setupAndListen();

        } else {
            // No user signed in
            setUser(null);
            setUserData(null);
            setLoading(false);
        }
    });

    return () => {
        unsubscribeAuth();
        if (unsubscribeDoc) {
            unsubscribeDoc();
        }
    };
}, [toast]);

  const logout = useCallback(async () => {
      if (auth) {
          await signOut(auth);
          setUser(null);
          setUserData(null);
      }
  }, []);

  const value = useMemo(() => ({ user, userData, loading, logout }), [user, userData, loading, logout]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
