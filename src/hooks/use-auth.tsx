
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

const mockUserTemplate = {
    uid: 'mock-user-uid',
    emailVerified: true,
    displayName: 'Test User',
    isAnonymous: false,
    photoURL: '',
    providerData: [],
    metadata: {},
    providerId: 'password',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({
        token: 'mock-token',
        expirationTime: '',
        authTime: '',
        issuedAtTime: '',
        signInProvider: null,
        signInSecondFactor: null,
        claims: {},
    }),
    reload: async () => {},
    toJSON: () => ({}),
} as unknown as User;


interface AuthContextType {
  user: User | null;
  loading: boolean;
  isMock: boolean;
  logout: () => Promise<void>;
  login: (email: string) => void;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true, 
    isMock: false, 
    logout: async () => {}, 
    login: () => {} 
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isMock = !auth;

  useEffect(() => {
    if (!isMock && auth) {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
        return () => unsubscribe();
    } else {
        const sessionUser = sessionStorage.getItem('mockUser');
        if (sessionUser) {
            setUser({ ...mockUserTemplate, email: JSON.parse(sessionUser).email });
        }
        setLoading(false);
    }
  }, [isMock]);

  const login = (email: string) => {
      if (isMock) {
          const newMockUser = { ...mockUserTemplate, email };
          sessionStorage.setItem('mockUser', JSON.stringify({ email }));
          setUser(newMockUser);
      }
      // Real login is handled by firebase ui components
  };

  const logout = async () => {
      if (!isMock && auth) {
          const { signOut } = await import('firebase/auth');
          await signOut(auth);
          setUser(null);
      } else {
          sessionStorage.removeItem('mockUser');
          setUser(null);
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
    <AuthContext.Provider value={{ user, loading, isMock, logout, login }}>
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
