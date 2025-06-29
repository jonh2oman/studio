
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
    
    const setupUserAccount = async (user: User) => {
      if (!db) return;
      const userDocRef = doc(db, 'users', user.uid);
      try {
        const userEmail = user.email;
        if (!userEmail) throw new Error("User email is not available.");

        // Check for an invite first
        const inviteRef = doc(db, 'invites', userEmail);
        const inviteSnap = await getDoc(inviteRef);

        if (inviteSnap.exists()) {
          // User was invited. Link to existing corps.
          const { corpsId } = inviteSnap.data();
          await setDoc(userDocRef, { email: userEmail, corpsId }, { merge: true });
          await deleteDoc(inviteRef); // Consume the invite
          toast({ title: "Welcome!", description: "You've been successfully linked to an existing corps." });
        } else {
          // User was not invited. Create a new corps.
          const newCorpsRef = await addDoc(collection(db, "corps"), defaultCorpsData);
          await setDoc(userDocRef, { email: userEmail, corpsId: newCorpsRef.id }, { merge: true });
          toast({ title: "Welcome!", description: "A new corps has been created for you." });
        }
      } catch (error) {
        console.error("Error during new user setup:", error);
        toast({ variant: 'destructive', title: 'Setup Error', description: 'Could not set up your account data.' });
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (user && db) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        
        // This is the real-time listener for the user's data document.
        unsubscribeDoc = onSnapshot(userDocRef, 
          async (docSnap) => {
            if (docSnap.exists() && docSnap.data().corpsId) {
                // User document exists and is complete
                setUserData(docSnap.data() as UserData);
                setLoading(false);
            } else {
                // User document either doesn't exist or is incomplete (no corpsId).
                // This triggers the setup flow.
                setUserData(null); // Ensure old data is cleared
                await setupUserAccount(user);
                // The setupUserAccount will write to the DB, which will trigger this snapshot listener again.
                // On the next trigger, the first `if` condition should be met.
                // We still set loading to false here to prevent the UI from being stuck if setup fails.
                setLoading(false);
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
