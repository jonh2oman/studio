
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type SaveFunction = () => void;

interface SaveContextType {
  registerSave: (fn: SaveFunction | null) => void;
  triggerSave: () => void;
  isSaveAvailable: boolean;
}

const SaveContext = createContext<SaveContextType | null>(null);

export const SaveProvider = ({ children }: { children: ReactNode }) => {
  const [saveFunction, setSaveFunction] = useState<SaveFunction | null>(null);
  
  const isSaveAvailable = !!saveFunction;

  const registerSave = useCallback((fn: SaveFunction | null) => {
    // Use a function to avoid stale closures if fn changes
    setSaveFunction(() => fn);
  }, []);

  const triggerSave = () => {
    if (saveFunction) {
      saveFunction();
    }
  };

  return (
    <SaveContext.Provider value={{ registerSave, triggerSave, isSaveAvailable }}>
      {children}
    </SaveContext.Provider>
  );
};

export const useSave = () => {
  const context = useContext(SaveContext);
  if (!context) {
    throw new Error('useSave must be used within a SaveProvider');
  }
  return context;
};
