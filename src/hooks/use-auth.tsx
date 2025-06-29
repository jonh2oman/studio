
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
    if (auth) {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setUser(user);
            const userDocRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data() as UserData);
            } else {
                // New user, create their user document
                const newUserData: UserData = { email: user.email!, corpsId: null };
                await setDoc(userDocRef, newUserData);
                setUserData(newUserData);
            }
          } else {
            // User logged out
            setUser(null);
            setUserData(null);
          }
          setLoading(false);
        });
        return () => unsubscribe();
    } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
    }
  }, []);

  const logout = async () => {
      if (auth) {
          await signOut(auth);
          setUser(null);
          setUserData(null);
      }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout }}>
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
