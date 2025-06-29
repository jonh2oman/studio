
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
    let unsubscribeDoc: (() => void) | null = null;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (user && db) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        
        unsubscribeDoc = onSnapshot(userDocRef, 
          async (docSnap) => {
            if (docSnap.exists()) {
                // User document exists, this is the normal case for a returning user.
                setUserData(docSnap.data() as UserData);
                setLoading(false);
            } else {
                // User document does not exist. This is a brand new user signing up.
                // We need to create their associated data.
                try {
                    const userEmail = user.email;
                    if (!userEmail) throw new Error("User email is not available for setup.");

                    const inviteRef = doc(db, 'invites', userEmail);
                    const inviteSnap = await getDoc(inviteRef);

                    let finalCorpsId: string;
                    if (inviteSnap.exists()) {
                        // User was invited. Link to the existing corps.
                        finalCorpsId = inviteSnap.data().corpsId;
                        await deleteDoc(inviteRef); // Consume the invite
                        toast({ title: "Welcome!", description: "You've been successfully linked to an existing corps." });
                    } else {
                        // User was not invited. Create a new corps for them.
                        const newCorpsRef = await addDoc(collection(db, "corps"), defaultCorpsData);
                        finalCorpsId = newCorpsRef.id;
                        toast({ title: "Welcome!", description: "A new corps has been created for you." });
                    }
                    
                    // Finally, create the user's own document, linking them to a corps.
                    await setDoc(userDocRef, { email: userEmail, corpsId: finalCorpsId });
                    // The onSnapshot listener will fire again with the new document, and the `if (docSnap.exists())` block will execute.
                } catch (error) {
                    console.error("Error during new user setup:", error);
                    toast({ variant: 'destructive', title: 'Account Setup Failed', description: 'Could not set up your account data.' });
                    setLoading(false);
                }
            }
          }, 
          (error) => {
            console.error("Error listening to user document:", error);
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
  }, [toast]); // toast is a stable function, so this only runs once.

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
