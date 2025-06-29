
"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { UserData } from '@/lib/types';

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

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // Unsubscribe from previous user's document listener
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (user && db) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);

        // Set up a real-time listener for the user's document
        unsubscribeDoc = onSnapshot(userDocRef, 
          (docSnap) => {
            if (docSnap.exists()) {
              setUserData(docSnap.data() as UserData);
            } else {
              // This case handles a brand new user whose doc hasn't been created yet.
              const newUserData: UserData = { email: user.email!, corpsId: null };
              setDoc(userDocRef, newUserData)
                .then(() => {
                  // The listener will automatically pick up this change and set the state.
                })
                .catch(error => console.error("Error creating user document:", error));
            }
            setLoading(false);
          }, 
          (error) => {
            console.error("Error listening to user document:", error);
            setUser(null);
            setUserData(null);
            setLoading(false);
          }
        );
      } else {
        // User logged out or db not available
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
  }, []);

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
