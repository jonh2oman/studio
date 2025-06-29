
"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { doc, onSnapshot, setDoc, query, collection, where, getDocs, addDoc } from 'firebase/firestore';
import type { UserData, CorpsData } from '@/lib/types';
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
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (user && db) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        
        unsubscribeDoc = onSnapshot(userDocRef, 
          async (docSnap) => {
            if (docSnap.exists() && docSnap.data().corpsId) {
                setUserData(docSnap.data() as UserData);
                setLoading(false);
            } else {
                // New user or user without a corpsId. Check for invites.
                const userEmail = user.email;
                if (!userEmail) {
                    console.error("User has no email, cannot check for invites.");
                    setLoading(false);
                    return;
                }
                
                try {
                    const corpsQuery = query(collection(db, "corps"), where("staffEmails", "array-contains", userEmail));
                    const querySnapshot = await getDocs(corpsQuery);

                    if (!querySnapshot.empty) {
                        // Found an invitation. Link user to this corps.
                        const corpsDoc = querySnapshot.docs[0];
                        const corpsId = corpsDoc.id;
                        await setDoc(userDocRef, { email: userEmail, corpsId: corpsId }, { merge: true });
                        toast({ title: "Welcome!", description: `You've been successfully linked to ${corpsDoc.data().settings.corpsName}.` });
                        // The listener will pick up this change and re-run.
                    } else {
                        // No invitation found. Create a new corps for them.
                        const newCorpsRef = await addDoc(collection(db, "corps"), defaultCorpsData);
                        await setDoc(userDocRef, { email: userEmail, corpsId: newCorpsRef.id }, { merge: true });
                        toast({ title: "Welcome!", description: "A new corps has been created for you." });
                        // The listener will pick up this change and re-run.
                    }
                } catch (e) {
                    console.error("Error during new user setup:", e);
                    toast({ variant: 'destructive', title: 'Setup Error', description: 'Could not set up your account data.' });
                    setLoading(false);
                }
            }
          }, 
          (error) => {
            console.error("Error listening to user document:", error);
            setUser(null);
            setUserData(null);
            setLoading(false);
          }
        );
      } else {
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
